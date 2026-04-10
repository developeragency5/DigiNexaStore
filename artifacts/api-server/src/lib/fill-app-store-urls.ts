import { db, appsTable } from "@workspace/db";
import { isNull, or, eq } from "drizzle-orm";
import { logger } from "./logger";

const DELAY_MS = 1500;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalize(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
}

function nameSimilarity(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return 1.0;
  if (na.includes(nb) || nb.includes(na)) return 0.9;
  const wordsA = na.split(" ");
  const wordsB = nb.split(" ");
  const setB = new Set(wordsB);
  const intersection = wordsA.filter((w) => setB.has(w)).length;
  const union = new Set([...wordsA, ...wordsB]).size;
  return intersection / union;
}

async function searchItunesByName(name: string): Promise<string | null> {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(name)}&media=software&limit=3&country=us`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      resultCount: number;
      results: Array<{ trackName: string; trackViewUrl: string }>;
    };
    if (!data.results?.length) return null;
    for (const result of data.results) {
      if (nameSimilarity(name, result.trackName) >= 0.7) {
        return result.trackViewUrl.replace(/\?uo=\d+$/, "");
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function runFillAppStoreUrls() {
  try {
    const appsToFill = await db
      .select({ id: appsTable.id, name: appsTable.name })
      .from(appsTable)
      .where(or(isNull(appsTable.appStoreUrl), eq(appsTable.appStoreUrl, "")));

    if (appsToFill.length === 0) {
      logger.info("All apps already have App Store URLs");
      return;
    }

    logger.info({ count: appsToFill.length }, "Starting App Store URL fill background task");

    let found = 0;
    let notFound = 0;

    for (let i = 0; i < appsToFill.length; i++) {
      const app = appsToFill[i];
      try {
        const url = await searchItunesByName(app.name);
        if (url) {
          await db.update(appsTable).set({ appStoreUrl: url }).where(eq(appsTable.id, app.id));
          found++;
        } else {
          notFound++;
        }
        if ((i + 1) % 100 === 0) {
          logger.info({ processed: i + 1, total: appsToFill.length, found, notFound }, "App Store URL fill progress");
        }
      } catch (err) {
        logger.warn({ err, appId: app.id }, "Error filling App Store URL for app");
      }
      await sleep(DELAY_MS);
    }

    logger.info({ found, notFound }, "App Store URL fill complete");
  } catch (err) {
    logger.error({ err }, "App Store URL fill task failed");
  }
}
