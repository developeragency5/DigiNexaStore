import { db, appsTable } from "@workspace/db";
import { isNull, or, eq } from "drizzle-orm";
import { logger } from "./logger";

const DELAY_MS = 1200;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function wordOverlap(a: string, b: string): number {
  const wa = new Set(normalize(a).split(" ").filter((w) => w.length > 2));
  const wb = new Set(normalize(b).split(" ").filter((w) => w.length > 2));
  if (wa.size === 0 || wb.size === 0) return 0;
  let shared = 0;
  for (const w of wa) if (wb.has(w)) shared++;
  return shared / Math.min(wa.size, wb.size);
}

function bundleIdToKeywords(bundleId: string): string {
  const parts = bundleId.split(".").slice(2);
  const words = parts
    .join(" ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z ]/g, " ")
    .toLowerCase()
    .split(" ")
    .filter((w) => w.length > 2 && !["com", "app", "apps", "the", "and", "for"].includes(w));
  return [...new Set(words)].slice(0, 5).join(" ");
}

async function searchItunes(term: string, appName: string): Promise<string | null> {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=software&limit=5&country=us`;
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
    let best: { url: string; score: number } | null = null;
    for (const result of data.results) {
      const score = wordOverlap(appName, result.trackName);
      if (score > (best?.score ?? 0)) {
        best = { url: result.trackViewUrl.replace(/\?uo=\d+$/, "").replace(/apps\.apple\.com\/[a-z]{2}\//, "apps.apple.com/"), score };
      }
    }
    if (best && best.score >= 0.4) return best.url;
    return null;
  } catch {
    return null;
  }
}

async function findAppStoreUrl(name: string, playStoreUrl?: string | null): Promise<string | null> {
  let url = await searchItunes(name, name);
  if (url) return url;
  if (playStoreUrl) {
    const match = playStoreUrl.match(/id=([^&]+)/);
    if (match?.[1]) {
      const keywords = bundleIdToKeywords(match[1]);
      if (keywords.length > 3) {
        url = await searchItunes(keywords, name);
        if (url) return url;
      }
    }
  }
  const shortName = name.split(/[-:–|]/)[0].trim();
  if (shortName !== name && shortName.length > 4) {
    url = await searchItunes(shortName, name);
    if (url) return url;
  }
  return null;
}

export async function runFillAppStoreUrls() {
  try {
    const appsToFill = await db
      .select({ id: appsTable.id, name: appsTable.name, playStoreUrl: appsTable.playStoreUrl })
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
        const url = await findAppStoreUrl(app.name, app.playStoreUrl);
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
        logger.warn({ err, appId: app.id }, "Error filling App Store URL");
        notFound++;
      }
      await sleep(DELAY_MS);
    }

    logger.info({ found, notFound }, "App Store URL fill complete");
  } catch (err) {
    logger.error({ err }, "App Store URL fill task failed");
  }
}
