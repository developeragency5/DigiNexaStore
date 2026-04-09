/**
 * repopulate-store-urls.ts
 * ========================
 * Re-finds App Store & Play Store URLs for every app that's missing one.
 * Uses Node's native https module (not fetch) to avoid Apple's bot blocking.
 */

import { db } from "@workspace/db";
import { appsTable } from "@workspace/db";
import { isNull, eq } from "drizzle-orm";
import gplay from "google-play-scraper";
import https from "node:https";

const CONCURRENCY = 4;
const DELAY_MS    = 300;
const THRESHOLD   = 0.60;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ── https helper ──────────────────────────────────────────────────────────────
function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const opts = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate",
        "Connection": "keep-alive",
      },
    };
    const req = https.get(url, opts, (res) => {
      // Handle redirect
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        httpsGet(res.headers.location).then(resolve).catch(reject);
        res.resume();
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      let encoding = res.headers["content-encoding"];
      let stream: NodeJS.ReadableStream = res;

      if (encoding === "gzip") {
        const zlib = require("zlib");
        stream = res.pipe(zlib.createGunzip());
      } else if (encoding === "deflate") {
        const zlib = require("zlib");
        stream = res.pipe(zlib.createInflate());
      }

      const chunks: Buffer[] = [];
      stream.on("data", (chunk: Buffer) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      stream.on("error", reject);
    });
    req.setTimeout(8000, () => { req.destroy(); reject(new Error("timeout")); });
    req.on("error", reject);
  });
}

// ── similarity ────────────────────────────────────────────────────────────────
function bigrams(str: string): Set<string> {
  const s = str.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const b = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) b.add(s.slice(i, i + 2));
  return b;
}
function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  if (norm(a) === norm(b)) return 1;
  const ba = bigrams(a), bb = bigrams(b);
  let hits = 0;
  for (const g of ba) if (bb.has(g)) hits++;
  return (2 * hits) / (ba.size + bb.size);
}

// ── iTunes search ─────────────────────────────────────────────────────────────
async function searchITunes(term: string, appName: string): Promise<string | null> {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=software&limit=8&country=us`;
    const body = await httpsGet(url);
    const data = JSON.parse(body);
    let best = { sim: 0, trackUrl: "" };
    for (const r of (data.results ?? [])) {
      const sim = similarity(appName, r.trackName ?? "");
      if (sim > best.sim) best = { sim, trackUrl: r.trackViewUrl ?? "" };
    }
    if (best.sim >= THRESHOLD && best.trackUrl) {
      return best.trackUrl.split("?")[0];
    }
    return null;
  } catch {
    return null;
  }
}

async function getAppStoreUrl(name: string, developer: string): Promise<string | null> {
  let url = await searchITunes(name, name);
  if (url) return url;

  const shortName = name.split(/[:\-–]/)[0].trim();
  if (shortName !== name && shortName.length > 3) {
    url = await searchITunes(shortName, name);
    if (url) return url;
  }
  return null;
}

// ── Play Store search ─────────────────────────────────────────────────────────
async function getPlayStoreUrl(name: string): Promise<string | null> {
  try {
    const results: any[] = await (gplay as any).search({
      term: name, num: 8, lang: "en", country: "us", throttle: 10,
    });
    let best = { sim: 0, appId: "" };
    for (const r of (results ?? [])) {
      const sim = similarity(name, r.title ?? "");
      if (sim > best.sim) best = { sim, appId: r.appId ?? "" };
    }
    if (best.sim >= THRESHOLD && best.appId) {
      return `https://play.google.com/store/apps/details?id=${best.appId}`;
    }
  } catch {}
  return null;
}

// ── batch runner ──────────────────────────────────────────────────────────────
async function processBatch<T>(
  items: T[],
  fn: (item: T) => Promise<void>,
  label: string,
  batchSize: number,
) {
  let done = 0;
  let found = 0;
  for (let i = 0; i < items.length; i += batchSize) {
    const results = await Promise.allSettled(items.slice(i, i + batchSize).map(async item => {
      const before = found;
      await fn(item);
    }));
    done += Math.min(batchSize, items.length - i);
    process.stdout.write(`\r  [${label}] ${done}/${items.length}`);
    await sleep(DELAY_MS);
  }
  console.log();
  return found;
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  // ── Verify iTunes API works ──────────────────────────────────────────────
  try {
    const test = await httpsGet("https://itunes.apple.com/search?term=spotify&entity=software&limit=1&country=us");
    const td = JSON.parse(test);
    console.log(`\n✓ iTunes API OK (test: "${td.results?.[0]?.trackName}")`);
  } catch (e: any) {
    console.error(`\n✗ iTunes API failed: ${e.message} — aborting`);
    process.exit(1);
  }

  // ── App Store pass ──────────────────────────────────────────────────────────
  const needsIOS = await db
    .select({ id: appsTable.id, name: appsTable.name, developer: appsTable.developer, playStoreUrl: appsTable.playStoreUrl })
    .from(appsTable)
    .where(isNull(appsTable.appStoreUrl));

  console.log(`Apps missing App Store URL: ${needsIOS.length}`);
  let iosFound = 0;

  await processBatch(needsIOS, async (app) => {
    const url = await getAppStoreUrl(app.name, app.developer ?? "");
    if (url) {
      const newPlatform = app.playStoreUrl ? "both" : "ios";
      await db.update(appsTable)
        .set({ appStoreUrl: url, platform: newPlatform, updatedAt: new Date() })
        .where(eq(appsTable.id, app.id));
      iosFound++;
    }
  }, "iOS", CONCURRENCY);

  console.log(`  ✓ Found App Store URLs: ${iosFound}/${needsIOS.length}`);

  // ── Play Store pass ─────────────────────────────────────────────────────────
  const needsAndroid = await db
    .select({ id: appsTable.id, name: appsTable.name, developer: appsTable.developer, appStoreUrl: appsTable.appStoreUrl })
    .from(appsTable)
    .where(isNull(appsTable.playStoreUrl));

  console.log(`\nApps missing Play Store URL: ${needsAndroid.length}`);
  let playFound = 0;

  await processBatch(needsAndroid, async (app) => {
    const url = await getPlayStoreUrl(app.name);
    if (url) {
      const newPlatform = app.appStoreUrl ? "both" : "android";
      await db.update(appsTable)
        .set({ playStoreUrl: url, platform: newPlatform, updatedAt: new Date() })
        .where(eq(appsTable.id, app.id));
      playFound++;
    }
  }, "Play", CONCURRENCY);

  console.log(`  ✓ Found Play Store URLs: ${playFound}/${needsAndroid.length}`);

  console.log(`\n════════════════════════`);
  console.log(`App Store links added:  ${iosFound}`);
  console.log(`Play Store links added: ${playFound}`);
  console.log(`════════════════════════`);
}

main()
  .then(() => { console.log("Done."); process.exit(0); })
  .catch(e => { console.error("Fatal:", e); process.exit(1); });
