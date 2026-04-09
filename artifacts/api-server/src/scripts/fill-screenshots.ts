/**
 * fill-screenshots.ts
 * ====================
 * Fetches screenshot URLs for every app that currently has none.
 * Strategy:
 *   1. If the app has an App Store URL → extract Apple ID → call iTunes lookup API
 *   2. Else if the app has a Play Store URL → call google-play-scraper
 *
 * Usage:
 *   pnpm --filter @workspace/api-server tsx src/scripts/fill-screenshots.ts
 */

import { db } from "@workspace/db";
import { appsTable } from "@workspace/db";
import { eq, sql, and } from "drizzle-orm";
import gplay from "google-play-scraper";

const CONCURRENCY = 6;
const DELAY_MS    = 150;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ── helpers ──────────────────────────────────────────────────────────────────

function extractAppleId(url: string): string | null {
  const m = url.match(/\/id(\d+)/);
  return m ? m[1] : null;
}

function extractPlayId(url: string): string | null {
  const m = url.match(/[?&]id=([^&]+)/);
  return m ? m[1] : null;
}

async function getItunesScreenshots(appleId: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://itunes.apple.com/lookup?id=${appleId}&country=us`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return [];
    const data: any = await res.json();
    const r = data.results?.[0];
    if (!r) return [];
    const shots: string[] = [
      ...(r.screenshotUrls ?? []),
      ...(r.ipadScreenshotUrls ?? []),
    ];
    // Replace low-res suffix with high-res
    return shots.slice(0, 8).map((u: string) =>
      u.replace(/\d+x\d+bb\.jpg$/, "392x696bb.jpg")
    );
  } catch {
    return [];
  }
}

async function getPlayScreenshots(packageId: string): Promise<string[]> {
  try {
    const data: any = await (gplay as any).app({ appId: packageId, lang: "en", country: "us" });
    return (data?.screenshots ?? []).slice(0, 8);
  } catch {
    return [];
  }
}

async function processBatch<T>(
  items: T[],
  fn: (item: T) => Promise<void>,
  batchSize: number,
) {
  let done = 0;
  for (let i = 0; i < items.length; i += batchSize) {
    await Promise.all(items.slice(i, i + batchSize).map(fn));
    done += Math.min(batchSize, items.length - i);
    process.stdout.write(`\r  ${done}/${items.length} processed...`);
    await sleep(DELAY_MS);
  }
  process.stdout.write("\n");
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Find all apps where screenshot_urls is empty or has 0 items
  const rows = await db
    .select({
      id: appsTable.id,
      name: appsTable.name,
      appStoreUrl: appsTable.appStoreUrl,
      playStoreUrl: appsTable.playStoreUrl,
    })
    .from(appsTable)
    .where(
      sql`(screenshot_urls IS NULL OR array_length(screenshot_urls, 1) IS NULL OR array_length(screenshot_urls, 1) = 0)`
    );

  console.log(`\nApps missing screenshots: ${rows.length}`);
  let found = 0;

  await processBatch(rows, async (app) => {
    let shots: string[] = [];

    // Try App Store first (better quality screenshots)
    if (app.appStoreUrl) {
      const appleId = extractAppleId(app.appStoreUrl);
      if (appleId) shots = await getItunesScreenshots(appleId);
    }

    // Fall back to Play Store
    if (shots.length === 0 && app.playStoreUrl) {
      const pkgId = extractPlayId(app.playStoreUrl);
      if (pkgId) shots = await getPlayScreenshots(pkgId);
    }

    if (shots.length > 0) {
      await db
        .update(appsTable)
        .set({ screenshotUrls: shots as any, updatedAt: new Date() })
        .where(eq(appsTable.id, app.id));
      found++;
    }
  }, CONCURRENCY);

  console.log(`\n✓ Added screenshots to ${found}/${rows.length} apps`);
  console.log(`  Still missing: ${rows.length - found}`);
}

main()
  .then(() => { console.log("Done."); process.exit(0); })
  .catch(e => { console.error("Fatal:", e); process.exit(1); });
