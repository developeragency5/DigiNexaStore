import gplay from "google-play-scraper";
import store from "app-store-scraper";
import { db } from "@workspace/db";
import { appsTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";
import pino from "pino";

const log = pino({ level: "info" });

// ── Category maps ──────────────────────────────────────────────────────────

interface CatInfo { slug: string; name: string; appType: string }

const GPLAY_CAT: Record<string, CatInfo> = {
  GAME:               { slug: "games",         name: "Games",           appType: "game" },
  GAME_ACTION:        { slug: "action-games",  name: "Action",          appType: "game" },
  GAME_ARCADE:        { slug: "arcade-games",  name: "Arcade",          appType: "game" },
  GAME_CASUAL:        { slug: "casual-games",  name: "Casual",          appType: "game" },
  GAME_PUZZLE:        { slug: "puzzle-games",  name: "Puzzle",          appType: "game" },
  GAME_RACING:        { slug: "racing-games",  name: "Racing",          appType: "game" },
  GAME_ROLE_PLAYING:  { slug: "rpg-games",     name: "RPG",             appType: "game" },
  GAME_SPORTS:        { slug: "sports-games",  name: "Sports Games",    appType: "game" },
  GAME_STRATEGY:      { slug: "strategy-games",name: "Strategy",        appType: "game" },
  SOCIAL:             { slug: "social",         name: "Social",          appType: "app"  },
  ENTERTAINMENT:      { slug: "entertainment",  name: "Entertainment",   appType: "app"  },
  FINANCE:            { slug: "finance",         name: "Finance",         appType: "app"  },
  PRODUCTIVITY:       { slug: "productivity",    name: "Productivity",    appType: "app"  },
  EDUCATION:          { slug: "education",       name: "Education",       appType: "app"  },
  SHOPPING:           { slug: "shopping",        name: "Shopping",        appType: "app"  },
  SPORTS:             { slug: "sports",          name: "Sports",          appType: "app"  },
  MUSIC_AND_AUDIO:    { slug: "music",           name: "Music",           appType: "app"  },
  HEALTH_AND_FITNESS: { slug: "health-fitness",  name: "Health & Fitness",appType: "app"  },
  PHOTOGRAPHY:        { slug: "photography",     name: "Photography",     appType: "app"  },
  TRAVEL_AND_LOCAL:   { slug: "travel",          name: "Travel",          appType: "app"  },
  FOOD_AND_DRINK:     { slug: "food-drink",      name: "Food & Drink",    appType: "app"  },
};

const STORE_CAT: Record<number, CatInfo> = {
  6014: { slug: "games",         name: "Games",           appType: "game" },
  7001: { slug: "action-games",  name: "Action",          appType: "game" },
  7003: { slug: "arcade-games",  name: "Arcade",          appType: "game" },
  7009: { slug: "puzzle-games",  name: "Puzzle",          appType: "game" },
  7012: { slug: "racing-games",  name: "Racing",          appType: "game" },
  7015: { slug: "strategy-games",name: "Strategy",        appType: "game" },
  7002: { slug: "casual-games",  name: "Casual",          appType: "game" },
  6005: { slug: "social",         name: "Social",          appType: "app"  },
  6016: { slug: "entertainment",  name: "Entertainment",   appType: "app"  },
  6015: { slug: "finance",         name: "Finance",         appType: "app"  },
  6007: { slug: "productivity",    name: "Productivity",    appType: "app"  },
  6017: { slug: "education",       name: "Education",       appType: "app"  },
  6024: { slug: "shopping",        name: "Shopping",        appType: "app"  },
  6004: { slug: "sports",          name: "Sports",          appType: "app"  },
  6011: { slug: "music",           name: "Music",           appType: "app"  },
  6013: { slug: "health-fitness",  name: "Health & Fitness",appType: "app"  },
  6023: { slug: "food-drink",      name: "Food & Drink",    appType: "app"  },
};

// ── Sync state ─────────────────────────────────────────────────────────────

export interface SyncStatus {
  running: boolean;
  startedAt: string | null;
  fetched: number;
  inserted: number;
  updated: number;
  errors: number;
  phase: string;
  done: boolean;
}

let syncStatus: SyncStatus = {
  running: false,
  startedAt: null,
  fetched: 0,
  inserted: 0,
  updated: 0,
  errors: 0,
  phase: "idle",
  done: false,
};

export function getSyncStatus(): SyncStatus {
  return { ...syncStatus };
}

// ── Helpers ────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function parseInstalls(installs: string | number | undefined): number {
  if (!installs) return 0;
  if (typeof installs === "number") return Math.min(installs, 2_000_000_000);
  const n = parseInt(installs.replace(/[^0-9]/g, ""), 10);
  return isNaN(n) ? 0 : Math.min(n, 2_000_000_000);
}

function clamp(n: number | undefined, max: number): number {
  if (!n || isNaN(n)) return 0;
  return Math.min(Math.round(n), max);
}

// ── DB upsert ──────────────────────────────────────────────────────────────

interface AppData {
  name: string;
  developer: string;
  description: string;
  shortDescription: string;
  fullDescription: string;
  iconUrl: string;
  screenshotUrls: string[];
  categorySlug: string;
  categoryName: string;
  appType: string;
  rating: number;
  reviewCount: number;
  downloadCount: number;
  price: number;
  isFree: boolean;
  platform: "android" | "ios" | "both";
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  tags: string[];
  version: string;
  size: string;
}

async function upsertApp(data: AppData): Promise<"inserted" | "updated" | "skipped"> {
  try {
    const conditions = [];
    if (data.playStoreUrl) conditions.push(eq(appsTable.playStoreUrl, data.playStoreUrl));
    if (data.appStoreUrl)  conditions.push(eq(appsTable.appStoreUrl,  data.appStoreUrl));

    if (conditions.length === 0) return "skipped";

    const existing = await db.select({ id: appsTable.id })
      .from(appsTable)
      .where(or(...conditions))
      .limit(1);

    const payload = {
      name:            data.name.slice(0, 200),
      developer:       (data.developer || "Unknown").slice(0, 200),
      description:     data.description || data.shortDescription || data.name,
      shortDescription:(data.shortDescription || data.description || data.name).slice(0, 300),
      fullDescription: data.fullDescription || data.description || data.name,
      iconUrl:         data.iconUrl || "",
      screenshotUrls:  data.screenshotUrls.slice(0, 10),
      categorySlug:    data.categorySlug,
      categoryName:    data.categoryName,
      appType:         data.appType,
      rating:          data.rating,
      reviewCount:     clamp(data.reviewCount,   2_000_000_000),
      downloadCount:   clamp(data.downloadCount, 2_000_000_000),
      price:           data.price,
      isFree:          data.isFree,
      platform:        data.platform,
      appStoreUrl:     data.appStoreUrl,
      playStoreUrl:    data.playStoreUrl,
      tags:            data.tags,
      version:         (data.version || "1.0.0").slice(0, 50),
      size:            (data.size || "Unknown").slice(0, 50),
      updatedAt:       new Date(),
    };

    if (existing.length > 0) {
      await db.update(appsTable).set(payload).where(eq(appsTable.id, existing[0].id));
      return "updated";
    } else {
      await db.insert(appsTable).values({ ...payload, requirements: "iOS 14+ / Android 8+" });
      return "inserted";
    }
  } catch (err: any) {
    log.error({ err: err?.message }, "upsert error");
    return "skipped";
  }
}

// ── Google Play fetching ───────────────────────────────────────────────────

interface GPlayJob { category: string; collection: string }

const GPLAY_JOBS: GPlayJob[] = [
  // Games
  { category: "GAME",              collection: "TOP_FREE"   },
  { category: "GAME",              collection: "TOP_PAID"   },
  { category: "GAME",              collection: "GROSSING"   },
  { category: "GAME_ACTION",       collection: "TOP_FREE"   },
  { category: "GAME_ARCADE",       collection: "TOP_FREE"   },
  { category: "GAME_CASUAL",       collection: "TOP_FREE"   },
  { category: "GAME_PUZZLE",       collection: "TOP_FREE"   },
  { category: "GAME_RACING",       collection: "TOP_FREE"   },
  { category: "GAME_ROLE_PLAYING", collection: "TOP_FREE"   },
  { category: "GAME_STRATEGY",     collection: "TOP_FREE"   },
  { category: "GAME_SPORTS",       collection: "TOP_FREE"   },
  // Apps
  { category: "SOCIAL",             collection: "TOP_FREE"   },
  { category: "SOCIAL",             collection: "GROSSING"   },
  { category: "ENTERTAINMENT",      collection: "TOP_FREE"   },
  { category: "ENTERTAINMENT",      collection: "GROSSING"   },
  { category: "FINANCE",            collection: "TOP_FREE"   },
  { category: "FINANCE",            collection: "GROSSING"   },
  { category: "PRODUCTIVITY",       collection: "TOP_FREE"   },
  { category: "PRODUCTIVITY",       collection: "TOP_PAID"   },
  { category: "EDUCATION",          collection: "TOP_FREE"   },
  { category: "EDUCATION",          collection: "TOP_PAID"   },
  { category: "SHOPPING",           collection: "TOP_FREE"   },
  { category: "SHOPPING",           collection: "GROSSING"   },
  { category: "SPORTS",             collection: "TOP_FREE"   },
  { category: "MUSIC_AND_AUDIO",    collection: "TOP_FREE"   },
  { category: "MUSIC_AND_AUDIO",    collection: "GROSSING"   },
  { category: "HEALTH_AND_FITNESS", collection: "TOP_FREE"   },
  { category: "HEALTH_AND_FITNESS", collection: "TOP_PAID"   },
  { category: "PHOTOGRAPHY",        collection: "TOP_FREE"   },
  { category: "TRAVEL_AND_LOCAL",   collection: "TOP_FREE"   },
  { category: "FOOD_AND_DRINK",     collection: "TOP_FREE"   },
];

async function fetchGPlayCategory(job: GPlayJob, seen: Set<string>): Promise<AppData[]> {
  const catInfo = GPLAY_CAT[job.category] ?? { slug: "apps", name: "Apps", appType: "app" };
  try {
    const results: any[] = await (gplay as any).list({
      category:   job.category,
      collection: (gplay as any).collection?.[job.collection] ?? job.collection,
      num:        100,
      country:    "us",
      lang:       "en",
    });

    return results
      .filter((r: any) => r?.appId && !seen.has(`gp:${r.appId}`))
      .map((r: any): AppData => {
        seen.add(`gp:${r.appId}`);
        const screenshots = Array.isArray(r.screenshots) ? r.screenshots.slice(0, 5) : [];
        return {
          name:            r.title || r.appId,
          developer:       r.developer || "Unknown",
          description:     r.summary || r.description || r.title || "",
          shortDescription:(r.summary || r.title || "").slice(0, 300),
          fullDescription: r.description || r.summary || r.title || "",
          iconUrl:         r.icon || "",
          screenshotUrls:  screenshots,
          categorySlug:    catInfo.slug,
          categoryName:    catInfo.name,
          appType:         catInfo.appType,
          rating:          parseFloat(r.score?.toFixed(1) ?? "0"),
          reviewCount:     clamp(r.ratings, 2_000_000_000),
          downloadCount:   parseInstalls(r.installs),
          price:           r.price ?? 0,
          isFree:          r.free !== false,
          platform:        "android",
          appStoreUrl:     null,
          playStoreUrl:    r.url || `https://play.google.com/store/apps/details?id=${r.appId}`,
          tags:            r.genre ? [r.genre] : [],
          version:         r.version || "1.0.0",
          size:            r.size || "Unknown",
        };
      });
  } catch (err: any) {
    log.warn({ err: err?.message, job }, "gplay fetch error");
    return [];
  }
}

// ── App Store fetching ─────────────────────────────────────────────────────

interface StoreJob { category: number; collection: string }

const STORE_JOBS: StoreJob[] = [
  // Games
  { category: 6014, collection: "TOP_FREE_IOS"          },
  { category: 6014, collection: "TOP_PAID_IOS"          },
  { category: 6014, collection: "TOP_GROSSING_IOS"      },
  { category: 7001, collection: "TOP_FREE_IOS"          },
  { category: 7002, collection: "TOP_FREE_IOS"          },
  { category: 7003, collection: "TOP_FREE_IOS"          },
  { category: 7009, collection: "TOP_FREE_IOS"          },
  { category: 7012, collection: "TOP_FREE_IOS"          },
  { category: 7015, collection: "TOP_FREE_IOS"          },
  // Apps
  { category: 6005, collection: "TOP_FREE_IOS"          },
  { category: 6005, collection: "TOP_GROSSING_IOS"      },
  { category: 6016, collection: "TOP_FREE_IOS"          },
  { category: 6016, collection: "TOP_GROSSING_IOS"      },
  { category: 6015, collection: "TOP_FREE_IOS"          },
  { category: 6015, collection: "TOP_GROSSING_IOS"      },
  { category: 6007, collection: "TOP_FREE_IOS"          },
  { category: 6007, collection: "TOP_PAID_IOS"          },
  { category: 6017, collection: "TOP_FREE_IOS"          },
  { category: 6017, collection: "TOP_PAID_IOS"          },
  { category: 6024, collection: "TOP_FREE_IOS"          },
  { category: 6024, collection: "TOP_GROSSING_IOS"      },
  { category: 6004, collection: "TOP_FREE_IOS"          },
  { category: 6011, collection: "TOP_FREE_IOS"          },
  { category: 6011, collection: "TOP_GROSSING_IOS"      },
  { category: 6013, collection: "TOP_FREE_IOS"          },
  { category: 6013, collection: "TOP_PAID_IOS"          },
  { category: 6023, collection: "TOP_FREE_IOS"          },
];

async function fetchStoreCategory(job: StoreJob, seen: Set<string>): Promise<AppData[]> {
  const catInfo = STORE_CAT[job.category] ?? { slug: "apps", name: "Apps", appType: "app" };
  try {
    const results: any[] = await (store as any).list({
      category:   job.category,
      collection: (store as any).collection?.[job.collection] ?? job.collection,
      num:        200,
      country:    "us",
      lang:       "en-us",
    });

    return results
      .filter((r: any) => r?.id && !seen.has(`ios:${r.id}`))
      .map((r: any): AppData => {
        seen.add(`ios:${r.id}`);
        const screenshots = Array.isArray(r.screenshots) ? r.screenshots.slice(0, 5) : [];
        const icon = r.artworkUrl512 || r.artworkUrl100 || r.icon || "";
        return {
          name:            r.title || r.appId || "Unknown",
          developer:       r.developer || r.developerId || "Unknown",
          description:     r.description || r.title || "",
          shortDescription:(r.description || r.title || "").slice(0, 300),
          fullDescription: r.description || r.title || "",
          iconUrl:         icon,
          screenshotUrls:  screenshots,
          categorySlug:    catInfo.slug,
          categoryName:    catInfo.name,
          appType:         catInfo.appType,
          rating:          parseFloat(r.score?.toFixed(1) ?? "0"),
          reviewCount:     clamp(r.reviews, 2_000_000_000),
          downloadCount:   0,
          price:           r.price ?? 0,
          isFree:          (r.price ?? 0) === 0,
          platform:        "ios",
          appStoreUrl:     r.url || `https://apps.apple.com/us/app/id${r.id}`,
          playStoreUrl:    null,
          tags:            r.genres ? r.genres.slice(0, 3) : [],
          version:         r.version || "1.0.0",
          size:            r.size ? `${Math.round(r.size / 1024 / 1024)}MB` : "Unknown",
        };
      });
  } catch (err: any) {
    log.warn({ err: err?.message, job }, "appstore fetch error");
    return [];
  }
}

// ── Main sync function ─────────────────────────────────────────────────────

export async function syncUSApps(): Promise<void> {
  if (syncStatus.running) {
    log.warn("Sync already running");
    return;
  }

  syncStatus = {
    running: true,
    startedAt: new Date().toISOString(),
    fetched: 0,
    inserted: 0,
    updated: 0,
    errors: 0,
    phase: "starting",
    done: false,
  };

  log.info("🚀 Starting US app sync...");
  const seen = new Set<string>();

  // ── Phase 1: Google Play ──
  syncStatus.phase = "google-play";
  log.info(`📱 Fetching from Google Play (${GPLAY_JOBS.length} category/collection combos)...`);

  for (const job of GPLAY_JOBS) {
    const apps = await fetchGPlayCategory(job, seen);
    syncStatus.fetched += apps.length;
    log.info(`  [GP] ${job.category}/${job.collection}: ${apps.length} apps (total: ${syncStatus.fetched})`);

    for (const app of apps) {
      const result = await upsertApp(app);
      if (result === "inserted") syncStatus.inserted++;
      else if (result === "updated") syncStatus.updated++;
      else syncStatus.errors++;
    }

    if (syncStatus.inserted + syncStatus.updated > 0 && (syncStatus.inserted + syncStatus.updated) % 100 === 0) {
      log.info(`  ✅ Progress: ${syncStatus.inserted} inserted, ${syncStatus.updated} updated`);
    }

    await sleep(800); // Rate limit
  }

  log.info(`✅ Google Play done: ${syncStatus.fetched} fetched`);

  // ── Phase 2: App Store ──
  syncStatus.phase = "app-store";
  log.info(`🍎 Fetching from App Store (${STORE_JOBS.length} category/collection combos)...`);

  for (const job of STORE_JOBS) {
    const apps = await fetchStoreCategory(job, seen);
    syncStatus.fetched += apps.length;
    log.info(`  [AS] ${job.category}/${job.collection}: ${apps.length} apps (total: ${syncStatus.fetched})`);

    for (const app of apps) {
      const result = await upsertApp(app);
      if (result === "inserted") syncStatus.inserted++;
      else if (result === "updated") syncStatus.updated++;
      else syncStatus.errors++;
    }

    await sleep(600); // Rate limit
  }

  log.info(`✅ App Store done`);

  syncStatus.running = false;
  syncStatus.done = true;
  syncStatus.phase = "done";

  log.info(`🎉 Sync complete! Fetched: ${syncStatus.fetched}, Inserted: ${syncStatus.inserted}, Updated: ${syncStatus.updated}, Errors: ${syncStatus.errors}`);
}
