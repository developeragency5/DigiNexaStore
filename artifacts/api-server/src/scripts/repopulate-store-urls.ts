/**
 * repopulate-store-urls.ts
 * ========================
 * Re-finds App Store & Play Store URLs for every app that's missing one.
 * Tries multiple search strategies per app to maximise coverage.
 */

import { db } from "@workspace/db";
import { appsTable } from "@workspace/db";
import { isNull, isNotNull, eq } from "drizzle-orm";
import gplay from "google-play-scraper";

const CONCURRENCY = 10;
const DELAY_MS    = 80;
const THRESHOLD   = 0.60; // lowered for better recall

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

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

// ── iTunes ────────────────────────────────────────────────────────────────────
async function searchITunes(term: string, appName: string): Promise<string | null> {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=software&limit=8&country=us`;
    const res = await fetch(url, { signal: AbortSignal.timeout(7000) });
    if (!res.ok) return null;
    const data: any = await res.json();
    let best = { sim: 0, trackUrl: "" };
    for (const r of (data.results ?? [])) {
      const sim = similarity(appName, r.trackName ?? "");
      if (sim > best.sim) best = { sim, trackUrl: r.trackViewUrl ?? "" };
    }
    if (best.sim >= THRESHOLD && best.trackUrl) {
      return best.trackUrl.split("?")[0]; // strip ?uo=4 tracking
    }
    return null;
  } catch {
    return null;
  }
}

async function getAppStoreUrl(name: string, developer: string): Promise<string | null> {
  // Strategy 1: full name
  let url = await searchITunes(name, name);
  if (url) return url;
  // Strategy 2: first word of name + developer
  const firstName = name.split(/[\s:–-]/)[0];
  if (firstName && firstName.length > 3) {
    url = await searchITunes(`${firstName} ${developer}`, name);
    if (url) return url;
  }
  // Strategy 3: name without subtitle (everything before colon/dash)
  const shortName = name.split(/[:\-–]/)[0].trim();
  if (shortName !== name && shortName.length > 3) {
    url = await searchITunes(shortName, name);
    if (url) return url;
  }
  return null;
}

// ── Play Store ─────────────────────────────────────────────────────────────────
async function searchPlayStore(name: string, appName: string): Promise<string | null> {
  try {
    const results: any[] = await (gplay as any).search({
      term: name, num: 8, lang: "en", country: "us", throttle: 10,
    });
    let best = { sim: 0, appId: "" };
    for (const r of (results ?? [])) {
      const sim = similarity(appName, r.title ?? "");
      if (sim > best.sim) best = { sim, appId: r.appId ?? "" };
    }
    if (best.sim >= THRESHOLD && best.appId) {
      return `https://play.google.com/store/apps/details?id=${best.appId}`;
    }
    return null;
  } catch {
    return null;
  }
}

async function getPlayStoreUrl(name: string, developer: string): Promise<string | null> {
  let url = await searchPlayStore(name, name);
  if (url) return url;
  const shortName = name.split(/[:\-–]/)[0].trim();
  if (shortName !== name && shortName.length > 3) {
    url = await searchPlayStore(shortName, name);
    if (url) return url;
  }
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
  for (let i = 0; i < items.length; i += batchSize) {
    await Promise.all(items.slice(i, i + batchSize).map(fn));
    done += Math.min(batchSize, items.length - i);
    process.stdout.write(`\r  [${label}] ${done}/${items.length}`);
    await sleep(DELAY_MS);
  }
  console.log();
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  // ── App Store pass ──────────────────────────────────────────────────────────
  const needsIOS = await db
    .select({ id: appsTable.id, name: appsTable.name, developer: appsTable.developer, playStoreUrl: appsTable.playStoreUrl })
    .from(appsTable)
    .where(isNull(appsTable.appStoreUrl));

  console.log(`\nApps missing App Store URL: ${needsIOS.length}`);
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
    const url = await getPlayStoreUrl(app.name, app.developer ?? "");
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
