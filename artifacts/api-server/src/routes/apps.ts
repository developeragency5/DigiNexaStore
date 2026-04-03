import { Router } from "express";
import { db } from "@workspace/db";
import { appsTable, categoriesTable } from "@workspace/db";
import { eq, ilike, and, desc, sql } from "drizzle-orm";
import {
  ListAppsQueryParams,
  GetAppParams,
  GetAppsByCategoryParams,
  GetAppsByCategoryQueryParams,
} from "@workspace/api-zod";

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

function formatAppDetail(app: typeof appsTable.$inferSelect) {
  return {
    ...formatApp(app),
    fullDescription: app.fullDescription,
    version: app.version,
    size: app.size,
    requirements: app.requirements,
    website: app.website ?? null,
    privacyPolicyUrl: app.privacyPolicyUrl ?? null,
    releaseNotes: app.releaseNotes ?? null,
    updatedAt: app.updatedAt.toISOString(),
  };
}

router.get("/", async (req, res) => {
  const parsed = ListAppsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query parameters" });
  }

  const { category, search, featured, platform, limit = 20, offset = 0 } = parsed.data;

  const conditions = [];
  if (category) conditions.push(eq(appsTable.categorySlug, category));
  if (search) conditions.push(ilike(appsTable.name, `%${search}%`));
  if (featured !== undefined) conditions.push(eq(appsTable.featured, featured));
  if (platform) conditions.push(eq(appsTable.platform, platform));

  const apps = await db
    .select()
    .from(appsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(appsTable.downloadCount))
    .limit(limit)
    .offset(offset);

  return res.json(apps.map(formatApp));
});

router.get("/featured", async (req, res) => {
  const apps = await db
    .select()
    .from(appsTable)
    .where(eq(appsTable.featured, true))
    .orderBy(desc(appsTable.rating))
    .limit(10);

  return res.json(apps.map(formatApp));
});

router.get("/trending", async (req, res) => {
  const apps = await db
    .select()
    .from(appsTable)
    .where(eq(appsTable.trending, true))
    .orderBy(desc(appsTable.downloadCount))
    .limit(10);

  return res.json(apps.map(formatApp));
});

router.get("/new", async (req, res) => {
  const apps = await db
    .select()
    .from(appsTable)
    .orderBy(desc(appsTable.createdAt))
    .limit(10);

  return res.json(apps.map(formatApp));
});

router.get("/:id", async (req, res) => {
  const parsed = GetAppParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid app ID" });
  }

  const [app] = await db
    .select()
    .from(appsTable)
    .where(eq(appsTable.id, parsed.data.id))
    .limit(1);

  if (!app) {
    return res.status(404).json({ error: "App not found" });
  }

  return res.json(formatAppDetail(app));
});

export { router as appsRouter };
