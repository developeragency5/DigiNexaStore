import { pgTable, text, serial, integer, real, boolean, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const appsTable = pgTable("apps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  developer: text("developer").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  iconUrl: text("icon_url").notNull(),
  screenshotUrls: text("screenshot_urls").array().notNull().default([]),
  categorySlug: text("category_slug").notNull(),
  categoryName: text("category_name").notNull(),
  appType: text("app_type").notNull().default("app"),
  rating: real("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  downloadCount: integer("download_count").notNull().default(0),
  price: real("price").notNull().default(0),
  isFree: boolean("is_free").notNull().default(true),
  platform: text("platform").notNull().default("both"),
  featured: boolean("featured").notNull().default(false),
  trending: boolean("trending").notNull().default(false),
  appStoreUrl: text("app_store_url"),
  playStoreUrl: text("play_store_url"),
  tags: text("tags").array().notNull().default([]),
  version: text("version").notNull().default("1.0.0"),
  size: text("size").notNull().default("Unknown"),
  requirements: text("requirements").notNull().default("iOS 14+ / Android 8+"),
  website: text("website"),
  privacyPolicyUrl: text("privacy_policy_url"),
  releaseNotes: text("release_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAppSchema = createInsertSchema(appsTable).omit({ id: true });
export type InsertApp = z.infer<typeof insertAppSchema>;
export type App = typeof appsTable.$inferSelect;

export const userRatingsTable = pgTable("user_ratings", {
  id: serial("id").primaryKey(),
  appId: integer("app_id").notNull(),
  ipAddress: text("ip_address").notNull(),
  rating: integer("rating").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [unique("unique_ip_app").on(t.appId, t.ipAddress)]);
