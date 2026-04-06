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
    appType: (app as any).appType ?? "app",
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

router.get("/featured", async (req, res) => {
  const appType = req.query.appType as string | undefined;
  const conditions: any[] = [eq(appsTable.featured, true)];
  if (appType) conditions.push(eq((appsTable as any).appType, appType));
  
  const apps = await db
    .select()
    .from(appsTable)
    .where(and(...conditions))
    .orderBy(desc(appsTable.rating))
    .limit(10);

  return res.json(apps.map(formatApp));
});

router.get("/trending", async (req, res) => {
  const appType = req.query.appType as string | undefined;
  const limit = parseInt(req.query.limit as string) || 8;
  const conditions: any[] = [eq(appsTable.trending, true)];
  if (appType) conditions.push(eq((appsTable as any).appType, appType));

  const apps = await db
    .select()
    .from(appsTable)
    .where(and(...conditions))
    .orderBy(desc(appsTable.downloadCount))
    .limit(limit);

  return res.json(apps.map(formatApp));
});

router.get("/new", async (req, res) => {
  const appType = req.query.appType as string | undefined;
  const limit = parseInt(req.query.limit as string) || 8;
  const conditions: any[] = [];
  if (appType) conditions.push(eq((appsTable as any).appType, appType));

  const apps = await db
    .select()
    .from(appsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(appsTable.createdAt))
    .limit(limit);

  return res.json(apps.map(formatApp));
});

router.get("/games", async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 8;

  const apps = await db
    .select()
    .from(appsTable)
    .where(eq((appsTable as any).appType, "game"))
    .orderBy(desc(appsTable.downloadCount))
    .limit(limit);

  return res.json(apps.map(formatApp));
});

router.get("/", async (req, res) => {
  const parsed = ListAppsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query parameters" });
  }

  const { category, search, featured, platform, limit = 20, offset = 0 } = parsed.data;
  const appType = req.query.appType as string | undefined;
  const trending = req.query.trending === 'true' ? true : undefined;

  const conditions: any[] = [];
  if (category) conditions.push(eq(appsTable.categorySlug, category));
  if (search) {
    conditions.push(
      sql`(${ilike(appsTable.name, `%${search}%`)} OR ${ilike(appsTable.description, `%${search}%`)} OR ${ilike(appsTable.developer, `%${search}%`)})`
    );
  }
  if (featured !== undefined) conditions.push(eq(appsTable.featured, featured));
  if (trending !== undefined) conditions.push(eq(appsTable.trending, trending));
  if (platform) conditions.push(eq(appsTable.platform, platform));
  if (appType) conditions.push(eq((appsTable as any).appType, appType));

  const apps = await db
    .select()
    .from(appsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(appsTable.downloadCount))
    .limit(limit)
    .offset(offset);

  return res.json(apps.map(formatApp));
});

router.get("/:id/related", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid app ID" });

  const [app] = await db.select().from(appsTable).where(eq(appsTable.id, id)).limit(1);
  if (!app) return res.status(404).json({ error: "App not found" });

  const limit = parseInt(req.query.limit as string) || 6;
  const related = await db
    .select()
    .from(appsTable)
    .where(and(eq(appsTable.categorySlug, app.categorySlug), sql`${appsTable.id} != ${id}`))
    .orderBy(desc(appsTable.rating))
    .limit(limit);

  return res.json(related.map(formatApp));
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
