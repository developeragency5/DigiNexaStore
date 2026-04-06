import { Router } from "express";
import { db } from "@workspace/db";
import { appsTable, categoriesTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/summary", async (req, res) => {
  const [appCounts] = await db.select({
    totalApps: sql<number>`COUNT(*) FILTER (WHERE app_type = 'app')`,
    totalGames: sql<number>`COUNT(*) FILTER (WHERE app_type = 'game')`,
    totalDownloads: sql<number>`SUM(download_count)`,
    featuredCount: sql<number>`COUNT(*) FILTER (WHERE featured = true)`,
  }).from(appsTable);

  const [{ totalCategories }] = await db.select({
    totalCategories: sql<number>`COUNT(*)`,
  }).from(categoriesTable);

  return res.json({
    totalApps: Number(appCounts.totalApps) || 0,
    totalGames: Number(appCounts.totalGames) || 0,
    totalCategories: Number(totalCategories) || 0,
    totalDownloads: Number(appCounts.totalDownloads) || 0,
    featuredCount: Number(appCounts.featuredCount) || 0,
  });
});

export { router as statsRouter };
