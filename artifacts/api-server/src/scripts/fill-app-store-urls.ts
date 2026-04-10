import { db, appsTable } from "@workspace/db";
import { isNull, or, eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

const PROGRESS_FILE = path.join(process.cwd(), "app-store-fill-progress.json");
const DELAY_MS = 1200;
const BATCH_LOG = 50;

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
  const setA = new Set(wordsA);
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
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { resultCount: number; results: Array<{ trackName: string; trackViewUrl: string }> };
    if (!data.results?.length) return null;
    for (const result of data.results) {
      const sim = nameSimilarity(name, result.trackName);
      if (sim >= 0.7) {
        const viewUrl = result.trackViewUrl.replace(/\?uo=\d+$/, "");
        return viewUrl;
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function main() {
  console.log("Loading apps with no App Store URL...");
  const appsToFill = await db
    .select({ id: appsTable.id, name: appsTable.name })
    .from(appsTable)
    .where(or(isNull(appsTable.appStoreUrl), eq(appsTable.appStoreUrl, "")));

  console.log(`Found ${appsToFill.length} apps needing App Store URLs`);

  let progress: { done: Set<number>; found: number; notFound: number } = { done: new Set(), found: 0, notFound: 0 };

  if (fs.existsSync(PROGRESS_FILE)) {
    const saved = JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"));
    progress.done = new Set(saved.done);
    progress.found = saved.found;
    progress.notFound = saved.notFound;
    console.log(`Resuming: already processed ${progress.done.size} apps (${progress.found} found, ${progress.notFound} not found)`);
  }

  const remaining = appsToFill.filter((a) => !progress.done.has(a.id));
  console.log(`Processing ${remaining.length} remaining apps...`);

  for (let i = 0; i < remaining.length; i++) {
    const app = remaining[i];
    const url = await searchItunesByName(app.name);

    if (url) {
      await db.update(appsTable).set({ appStoreUrl: url }).where(eq(appsTable.id, app.id));
      progress.found++;
    } else {
      progress.notFound++;
    }

    progress.done.add(app.id);

    if (i % BATCH_LOG === 0 || i === remaining.length - 1) {
      fs.writeFileSync(
        PROGRESS_FILE,
        JSON.stringify({ done: [...progress.done], found: progress.found, notFound: progress.notFound })
      );
      const total = progress.found + progress.notFound;
      console.log(
        `[${i + 1}/${remaining.length}] total=${total} found=${progress.found} notFound=${progress.notFound} last="${app.name}" -> ${url ?? "not found"}`
      );
    }

    await sleep(DELAY_MS);
  }

  console.log(`\nDone! Found App Store URLs for ${progress.found} apps. No match: ${progress.notFound}`);
  fs.unlinkSync(PROGRESS_FILE);
}

main().catch(console.error);
