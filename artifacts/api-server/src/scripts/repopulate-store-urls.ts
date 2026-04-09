/**
 * repopulate-store-urls.ts
 * ========================
 * Re-searches iTunes API for apps missing App Store URLs
 * and google-play-scraper for apps missing Play Store URLs.
 * Uses GET (not HEAD) to verify URLs are real before storing.
 *
 * Handles the case where previous HEAD-based validation was too aggressive.
 */

import { db } from "@workspace/db";
import { appsTable } from "@workspace/db";
import { isNull, isNotNull, and, or, eq } from "drizzle-orm";
import gplay from "google-play-scraper";

const DELAY = 200;
const BATCH = 8;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function bigrams(str: string): Set<string> {
  const s = str.toLowerCase().replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
  const b = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) b.add(s.slice(i, i + 2));
  return b;
}
function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a.toLowerCase().trim() === b.toLowerCase().trim()) return 1;
  const ba = bigrams(a), bb = bigrams(b);
  let hits = 0;
  for (const g of ba) if (bb.has(g)) hits++;
  return (2 * hits) / (ba.size + bb.size);
}

async function searchITunes(name: string): Promise<string | null> {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=software&limit=5&country=us`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data: any = await res.json();
    for (const r of (data.results ?? [])) {
      const sim = similarity(name, r.trackName);
      if (sim >= 0.72) {
        // Clean URL: remove ?uo=4 tracking parameter
        const cleanUrl = (r.trackViewUrl as string).split("?")[0];
        return cleanUrl;
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function searchPlayStore(name: string): Promise<string | null> {
  try {
    const results: any[] = await (gplay as any).search({
      term: name, num: 5, lang: "en", country: "us", throttle: 10,
    });
    for (const r of (results ?? [])) {
      if (similarity(name, r.title) >= 0.72) {
        return `https://play.google.com/store/apps/details?id=${r.appId}`;
      }
    }
    return null;
  } catch {
    return null;
  }
}

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
    if (done % 100 === 0 || done === items.length) {
      process.stdout.write(`\r  ${label}: ${done}/${items.length}`);
    }
    await sleep(DELAY);
  }
  console.log();
}

async function main() {
  // ── 1. Find App Store URLs for all apps that need them ────────────────────
  const needsAppStore = await db
    .select({ id: appsTable.id, name: appsTable.name })
    .from(appsTable)
    .where(isNull(appsTable.appStoreUrl));

  console.log(`\n[1/2] Apps needing App Store URL: ${needsAppStore.length}`);
  let iosFound = 0;

  await processBatch(needsAppStore, async (app) => {
    const url = await searchITunes(app.name);
    if (url) {
      await db.update(appsTable)
        .set({ appStoreUrl: url, platform: "both", updatedAt: new Date() })
        .where(eq(appsTable.id, app.id));
      iosFound++;
    }
  }, "iOS match", BATCH);

  console.log(`  ✓ Found App Store links: ${iosFound}/${needsAppStore.length}`);

  // ── 2. Find Play Store URLs for all apps that need them ───────────────────
  const needsPlayStore = await db
    .select({ id: appsTable.id, name: appsTable.name })
    .from(appsTable)
    .where(isNull(appsTable.playStoreUrl));

  console.log(`\n[2/2] Apps needing Play Store URL: ${needsPlayStore.length}`);
  let playFound = 0;

  await processBatch(needsPlayStore, async (app) => {
    const url = await searchPlayStore(app.name);
    if (url) {
      await db.update(appsTable)
        .set({ playStoreUrl: url, platform: "both", updatedAt: new Date() })
        .where(eq(appsTable.id, app.id));
      playFound++;
    }
  }, "Play match", BATCH);

  console.log(`  ✓ Found Play Store links: ${playFound}/${needsPlayStore.length}`);

  console.log(`\n════════════════════════════════════`);
  console.log(`New App Store links:  ${iosFound}`);
  console.log(`New Play Store links: ${playFound}`);
  console.log(`════════════════════════════════════`);
}

main()
  .then(() => { console.log("Done."); process.exit(0); })
  .catch(e => { console.error("Fatal:", e); process.exit(1); });
