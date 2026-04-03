import { Router } from "express";
import { db } from "@workspace/db";
import { appsTable, categoriesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { GetAppsByCategoryParams, GetAppsByCategoryQueryParams } from "@workspace/api-zod";

const router = Router();

function formatApp(app: typeof appsTable.$inferSelect) {
  return {
    id: app.id,
    name: app.name,
    developer: app.developer,
    description: app.description,
    shortDescription: app.shortDescription,
    iconUrl: app.iconUrl,
    screenshotUrls: app.screenshotUrls,
    categorySlug: app.categorySlug,
    categoryName: app.categoryName,
    rating: app.rating,
    reviewCount: app.reviewCount,
    downloadCount: app.downloadCount,
    price: app.price,
    isFree: app.isFree,
    platform: app.platform,
    featured: app.featured,
    trending: app.trending,
    appStoreUrl: app.appStoreUrl ?? null,
    playStoreUrl: app.playStoreUrl ?? null,
    tags: app.tags,
    createdAt: app.createdAt.toISOString(),
  };
}

router.get("/", async (req, res) => {
  const categories = await db
    .select()
    .from(categoriesTable)
    .orderBy(categoriesTable.name);

  return res.json(categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    iconName: c.iconName,
    appCount: c.appCount,
    color: c.color,
  })));
});

router.get("/:slug/apps", async (req, res) => {
  const paramsParsed = GetAppsByCategoryParams.safeParse({ slug: req.params.slug });
  if (!paramsParsed.success) {
    return res.status(400).json({ error: "Invalid slug" });
  }

  const queryParsed = GetAppsByCategoryQueryParams.safeParse(req.query);
  const limit = queryParsed.success ? (queryParsed.data.limit ?? 20) : 20;

  const apps = await db
    .select()
    .from(appsTable)
    .where(eq(appsTable.categorySlug, paramsParsed.data.slug))
    .orderBy(desc(appsTable.downloadCount))
    .limit(limit);

  return res.json(apps.map(formatApp));
});

export { router as categoriesRouter };
