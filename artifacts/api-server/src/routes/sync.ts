import { Router } from "express";
import { db } from "@workspace/db";
import { appsTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { syncUSApps, getSyncStatus, refreshRatings, getRefreshStatus, refreshAppStoreRatings, getIosRefreshStatus, resolvePlayStoreUrls, getResolveStatus, findPlayStoreEquivalents, getIosMatchStatus } from "../services/app-sync.js";

const router = Router();

// POST /sync-us-apps — start background sync
router.post("/sync-us-apps", (_req, res) => {
  const status = getSyncStatus();
  if (status.running) {
    res.json({ ok: false, message: "Sync already running", status });
    return;
  }
  syncUSApps().catch((err: any) => console.error("Sync crashed:", err?.message));
  res.json({ ok: true, message: "Sync started. Poll GET /sync-status for progress." });
});

// GET /sync-us-apps — alias: returns current sync status
router.get("/sync-us-apps", (_req, res) => {
  res.json(getSyncStatus());
});

// GET /sync-status — detailed progress
router.get("/sync-status", async (_req, res) => {
  const status = getSyncStatus();
  const [row] = await db
    .select({ total: sql<number>`COUNT(*)` })
    .from(appsTable);
  res.json({ ...status, dbTotal: Number(row?.total ?? 0) });
});

// POST /find-android-equivalents — find Play Store equivalents for iOS-only apps
router.post("/find-android-equivalents", (_req, res) => {
  const status = getIosMatchStatus();
  if (status.running) {
    res.json({ ok: false, message: "Job already running", status });
    return;
  }
  findPlayStoreEquivalents().catch((err: any) => console.error("iOS match crashed:", err?.message));
  res.json({ ok: true, message: "iOS → Android matching started. Poll GET /find-android-equivalents-status." });
});

router.get("/find-android-equivalents-status", (_req, res) => {
  res.json(getIosMatchStatus());
});

// POST /resolve-play-urls — resolve search-based Play Store URLs to direct package links
router.post("/resolve-play-urls", (_req, res) => {
  const status = getResolveStatus();
  if (status.running) {
    res.json({ ok: false, message: "Resolver already running", status });
    return;
  }
  resolvePlayStoreUrls().catch((err: any) => console.error("Play URL resolver crashed:", err?.message));
  res.json({ ok: true, message: "Play Store URL resolver started. Poll GET /resolve-play-urls-status for progress." });
});

router.get("/resolve-play-urls-status", (_req, res) => {
  res.json(getResolveStatus());
});

// POST /refresh-ios-ratings — sweep ALL apps with appStoreUrl and apply iOS rating
router.post("/refresh-ios-ratings", (_req, res) => {
  const status = getIosRefreshStatus();
  if (status.running) {
    res.json({ ok: false, message: "iOS sweep already running", status });
    return;
  }
  refreshAppStoreRatings().catch((err: any) => console.error("iOS sweep crashed:", err?.message));
  res.json({ ok: true, message: "iOS rating sweep started. Poll GET /refresh-ios-ratings-status for progress." });
});

router.get("/refresh-ios-ratings-status", (_req, res) => {
  res.json(getIosRefreshStatus());
});

// POST /refresh-ratings — fetch real ratings from stores for apps showing 0.0
router.post("/refresh-ratings", (_req, res) => {
  const status = getRefreshStatus();
  if (status.running) {
    res.json({ ok: false, message: "Refresh already running", status });
    return;
  }
  refreshRatings().catch((err: any) => console.error("Rating refresh crashed:", err?.message));
  res.json({ ok: true, message: "Rating refresh started. Poll GET /refresh-ratings-status for progress." });
});

// GET /refresh-ratings-status — check progress
router.get("/refresh-ratings-status", (_req, res) => {
  res.json(getRefreshStatus());
});

export { router as syncRouter };
