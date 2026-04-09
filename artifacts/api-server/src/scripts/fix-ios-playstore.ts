/**
 * fix-ios-playstore.ts
 * ====================
 * For iOS-only apps (have App Store URL but no Play Store URL),
 * search Google Play and add the Play Store link if a strong match is found.
 */

import { db } from "@workspace/db";
import { appsTable } from "@workspace/db";
import { isNull, isNotNull, and, eq } from "drizzle-orm";
import gplay from "google-play-scraper";

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

async function main() {
  const apps = await db
    .select({ id: appsTable.id, name: appsTable.name })
    .from(appsTable)
    .where(and(isNotNull(appsTable.appStoreUrl), isNull(appsTable.playStoreUrl)));

  console.log(`iOS-only apps to process: ${apps.length}`);
  let found = 0;

  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];
    if (i % 25 === 0) process.stdout.write(`\r  Progress: ${i}/${apps.length} (matched: ${found})`);
    const url = await searchPlayStore(app.name);
    if (url) {
      await db.update(appsTable)
        .set({ playStoreUrl: url, platform: "both", updatedAt: new Date() })
        .where(eq(appsTable.id, app.id));
      found++;
    }
    await sleep(300);
  }

  console.log(`\nDone. Added Play Store links to ${found}/${apps.length} iOS-only apps.`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
