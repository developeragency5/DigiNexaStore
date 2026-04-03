import { Router } from "express";
import { db } from "@workspace/db";
import { appsTable, categoriesTable } from "@workspace/db";
import { eq, count, sum } from "drizzle-orm";

const router = Router();

router.get("/summary", async (req, res) => {
  const [appStats] = await db
    .select({
      totalApps: count(),
      totalDownloads: sum(appsTable.downloadCount),
      featuredCount: count(eq(appsTable.featured, true)),
    })
    .from(appsTable);

  const [catStats] = await db
    .select({ totalCategories: count() })
    .from(categoriesTable);

  return res.json({
    totalApps: Number(appStats?.totalApps ?? 0),
    totalCategories: Number(catStats?.totalCategories ?? 0),
    totalDownloads: Number(appStats?.totalDownloads ?? 0),
    featuredCount: Number(appStats?.featuredCount ?? 0),
  });
});

export { router as statsRouter };
