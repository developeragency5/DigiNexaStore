import { Router } from "express";
import { db } from "@workspace/db";
import { appsTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { syncUSApps, getSyncStatus } from "../services/app-sync.js";

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

export { router as syncRouter };
