import { db, appsTable } from "@workspace/db";
import { isNotNull, sql } from "drizzle-orm";
import { logger } from "./logger";

const BATCH_SIZE = 100;
const DELAY_MS = 1000;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function extractAppId(url: string): string | null {
  const match = url.match(/\/id(\d+)(?:\?|$)/);
  return match ? match[1] : null;
}

async function lookupIds(ids: string[]): Promise<Set<string>> {
  try {
    const url = `https://itunes.apple.com/lookup?id=${ids.join(",")}&country=us`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return new Set();
    const data = (await res.json()) as { results: Array<{ trackId: number }> };
    return new Set(data.results.map((r) => String(r.trackId)));
  } catch {
    return new Set();
  }
}

export async function runValidateAppStoreUrls() {
  logger.info("[validate] Starting App Store URL validation…");

  const apps = await db
    .select({ id: appsTable.id, name: appsTable.name, appStoreUrl: appsTable.appStoreUrl })
    .from(appsTable)
    .where(isNotNull(appsTable.appStoreUrl));

  logger.info(`[validate] Checking ${apps.length} apps with stored App Store URLs`);

  let cleared = 0;
  let valid = 0;

  for (let i = 0; i < apps.length; i += BATCH_SIZE) {
    const batch = apps.slice(i, i + BATCH_SIZE);

    const idMap = new Map<string, typeof batch[0]>();
    for (const app of batch) {
      const id = extractAppId(app.appStoreUrl!);
      if (id) idMap.set(id, app);
    }

    if (idMap.size === 0) continue;

    const foundIds = await lookupIds([...idMap.keys()]);

    for (const [appId, app] of idMap) {
      if (!foundIds.has(appId)) {
        await db
          .update(appsTable)
          .set({ appStoreUrl: null })
          .where(sql`${appsTable.id} = ${app.id}`);
        logger.info(`[validate] Cleared invalid URL for: ${app.name} (id${appId})`);
        cleared++;
      } else {
        valid++;
      }
    }

    logger.info(`[validate] Progress: ${Math.min(i + BATCH_SIZE, apps.length)}/${apps.length} checked, ${cleared} cleared so far`);
    await sleep(DELAY_MS);
  }

  logger.info(`[validate] Done. ${valid} valid, ${cleared} invalid URLs cleared.`);
}
