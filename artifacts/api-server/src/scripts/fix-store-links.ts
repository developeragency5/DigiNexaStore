/**
 * fix-store-links.ts
 * ==================
 * For every app/game that is missing one store link:
 *   - Android-only  → search iTunes API for the iOS version
 *   - iOS-only      → search Google Play for the Android version
 *
 * A match is accepted only when the result name matches the DB name
 * with ≥ 75% similarity (Dice coefficient), preventing false positives.
 *
 * Usage:
 *   pnpm --filter @workspace/api-server tsx src/scripts/fix-store-links.ts
 */

import { db } from "@workspace/db";
import { appsTable } from "@workspace/db";
import { isNull, isNotNull, and, eq } from "drizzle-orm";
import gplay from "google-play-scraper";

const DELAY = 250;
const BATCH = 5; // parallel requests per tick
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ── Dice coefficient string similarity ──────────────────────────────────────
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

// ── iTunes Search API ────────────────────────────────────────────────────────
async function searchITunes(name: string): Promise<string | null> {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=software&limit=3&country=us`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data: any = await res.json();
    for (const r of (data.results ?? [])) {
      if (similarity(name, r.trackName) >= 0.75) return r.trackViewUrl as string;
    }
    return null;
  } catch {
    return null;
  }
}

// ── Google Play Search ───────────────────────────────────────────────────────
async function searchPlayStore(name: string): Promise<string | null> {
  try {
    const results: any[] = await (gplay as any).search({
      term: name, num: 3, lang: "en", country: "us", throttle: 10,
    });
    for (const r of (results ?? [])) {
      if (similarity(name, r.title) >= 0.75) {
        return `https://play.google.com/store/apps/details?id=${r.appId}`;
      }
    }
    return null;
  } catch {
    return null;
  }
}

// ── Process a list in parallel batches ──────────────────────────────────────
async function processBatch<T>(
  items: T[],
  fn: (item: T) => Promise<void>,
  label: string,
) {
  let done = 0;
  for (let i = 0; i < items.length; i += BATCH) {
    const chunk = items.slice(i, i + BATCH);
    await Promise.all(chunk.map(fn));
    done += chunk.length;
    if (done % 100 === 0 || done === items.length) {
      console.log(`  ${label}: ${done}/${items.length}`);
    }
    await sleep(DELAY);
  }
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  // ── 1. Android-only → find App Store URL ──
  const androidOnly = await db
    .select({ id: appsTable.id, name: appsTable.name })
    .from(appsTable)
    .where(and(isNotNull(appsTable.playStoreUrl), isNull(appsTable.appStoreUrl)));

  console.log(`\n[1/2] Android apps missing App Store URL: ${androidOnly.length}`);
  let iosFound = 0;

  await processBatch(androidOnly, async (app) => {
    const url = await searchITunes(app.name);
    if (url) {
      await db.update(appsTable)
        .set({ appStoreUrl: url, platform: "both", updatedAt: new Date() })
        .where(eq(appsTable.id, app.id));
      iosFound++;
    }
  }, "iOS search");

  console.log(`  ✓ Added App Store links to ${iosFound}/${androidOnly.length} apps`);

  // ── 2. iOS-only → find Play Store URL ──
  const iosOnly = await db
    .select({ id: appsTable.id, name: appsTable.name })
    .from(appsTable)
    .where(and(isNotNull(appsTable.appStoreUrl), isNull(appsTable.playStoreUrl)));

  console.log(`\n[2/2] iOS apps missing Play Store URL: ${iosOnly.length}`);
  let playFound = 0;

  await processBatch(iosOnly, async (app) => {
    const url = await searchPlayStore(app.name);
    if (url) {
      await db.update(appsTable)
        .set({ playStoreUrl: url, platform: "both", updatedAt: new Date() })
        .where(eq(appsTable.id, app.id));
      playFound++;
    }
  }, "Play search");

  console.log(`  ✓ Added Play Store links to ${playFound}/${iosOnly.length} apps`);

  console.log(`\n════════════════════════════════════`);
  console.log(`New App Store links:  ${iosFound}`);
  console.log(`New Play Store links: ${playFound}`);
  console.log(`Total newly linked:   ${iosFound + playFound}`);
  console.log(`════════════════════════════════════`);
}

main()
  .then(() => { console.log("Done."); process.exit(0); })
  .catch(e => { console.error("Fatal:", e); process.exit(1); });
