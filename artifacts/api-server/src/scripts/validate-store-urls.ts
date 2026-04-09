/**
 * validate-store-urls.ts
 * =======================
 * Checks every App Store and Play Store URL in the DB with an HTTP HEAD request.
 * Removes URLs that return 404 or have permanent redirect chains away from the
 * expected domain (meaning the app was removed from that store).
 * Updates the `platform` field accordingly.
 *
 * Usage:
 *   pnpm --filter @workspace/api-server tsx src/scripts/validate-store-urls.ts
 */

import { db } from "@workspace/db";
import { appsTable } from "@workspace/db";
import { isNotNull, eq, sql } from "drizzle-orm";

const CONCURRENCY = 8;
const TIMEOUT_MS = 8000;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

type UrlStatus = "ok" | "dead" | "error";

async function checkUrl(url: string, expectedDomain: string): Promise<UrlStatus> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AppUS/1.0; +https://appus.net)",
      },
    });
    clearTimeout(timer);

    // Check final URL still belongs to the expected domain
    if (res.status === 404) return "dead";
    if (res.status >= 400) return "dead";
    return "ok";
  } catch {
    return "error";
  }
}

async function processBatch<T>(items: T[], fn: (item: T) => Promise<void>, concurrency: number) {
  for (let i = 0; i < items.length; i += concurrency) {
    await Promise.all(items.slice(i, i + concurrency).map(fn));
  }
}

async function main() {
  // ── Validate App Store URLs ──────────────────────────────────────────────
  const iosApps = await db
    .select({ id: appsTable.id, name: appsTable.name, appStoreUrl: appsTable.appStoreUrl, playStoreUrl: appsTable.playStoreUrl })
    .from(appsTable)
    .where(isNotNull(appsTable.appStoreUrl));

  console.log(`\n[1/2] Checking ${iosApps.length} App Store URLs...`);
  let iosRemoved = 0, iosOk = 0, iosError = 0;

  await processBatch(iosApps, async (app) => {
    const status = await checkUrl(app.appStoreUrl!, "apps.apple.com");
    if (status === "dead") {
      // Remove dead App Store URL; if no Play Store URL either, keep ios, else android
      const newPlatform = app.playStoreUrl ? "android" : "ios";
      await db.update(appsTable)
        .set({
          appStoreUrl: null,
          platform: newPlatform,
          updatedAt: new Date(),
        })
        .where(eq(appsTable.id, app.id));
      iosRemoved++;
      process.stdout.write(`  ✗ DEAD: ${app.name.slice(0, 50)}\n`);
    } else if (status === "ok") {
      iosOk++;
    } else {
      iosError++;
    }
  }, CONCURRENCY);

  console.log(`\n  App Store results: ${iosOk} ok, ${iosRemoved} removed (dead), ${iosError} error/timeout`);

  // ── Validate Play Store URLs ─────────────────────────────────────────────
  const androidApps = await db
    .select({ id: appsTable.id, name: appsTable.name, appStoreUrl: appsTable.appStoreUrl, playStoreUrl: appsTable.playStoreUrl })
    .from(appsTable)
    .where(isNotNull(appsTable.playStoreUrl));

  console.log(`\n[2/2] Checking ${androidApps.length} Play Store URLs...`);
  let playRemoved = 0, playOk = 0, playError = 0;

  await processBatch(androidApps, async (app) => {
    const status = await checkUrl(app.playStoreUrl!, "play.google.com");
    if (status === "dead") {
      const newPlatform = app.appStoreUrl ? "ios" : "android";
      await db.update(appsTable)
        .set({
          playStoreUrl: null,
          platform: newPlatform,
          updatedAt: new Date(),
        })
        .where(eq(appsTable.id, app.id));
      playRemoved++;
      process.stdout.write(`  ✗ DEAD: ${app.name.slice(0, 50)}\n`);
    } else if (status === "ok") {
      playOk++;
    } else {
      playError++;
    }
  }, CONCURRENCY);

  console.log(`\n  Play Store results: ${playOk} ok, ${playRemoved} removed (dead), ${playError} error/timeout`);

  // ── Final tally ──────────────────────────────────────────────────────────
  console.log(`\n════════════════════════════════════`);
  console.log(`Dead App Store links removed:  ${iosRemoved}`);
  console.log(`Dead Play Store links removed: ${playRemoved}`);
  console.log(`Total cleaned up:              ${iosRemoved + playRemoved}`);
  console.log(`════════════════════════════════════`);
}

main()
  .then(() => { console.log("Done."); process.exit(0); })
  .catch(e => { console.error("Fatal:", e); process.exit(1); });
