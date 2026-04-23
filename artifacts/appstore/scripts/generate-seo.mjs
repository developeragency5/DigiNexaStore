#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, "..", "public");

const SITE_URL = (process.env.SITE_URL || "https://www.diginexastore.com").replace(/\/$/, "");
const API_URL = (
  process.env.SEO_API_URL ||
  process.env.VITE_API_URL ||
  "https://diginexastorediginexa-api.onrender.com"
).replace(/\/$/, "");

const TODAY = new Date().toISOString().split("T")[0];

const STATIC_PAGES = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/apps", changefreq: "daily", priority: "0.9" },
  { path: "/games", changefreq: "daily", priority: "0.9" },
  { path: "/categories", changefreq: "weekly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/blog", changefreq: "weekly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.4" },
  { path: "/terms-of-service", changefreq: "yearly", priority: "0.4" },
  { path: "/cookie-policy", changefreq: "yearly", priority: "0.4" },
  { path: "/ccpa-privacy-rights", changefreq: "yearly", priority: "0.4" },
  { path: "/advertising-disclosure", changefreq: "yearly", priority: "0.4" },
  { path: "/disclaimer", changefreq: "yearly", priority: "0.4" },
  { path: "/no-purchase-policy", changefreq: "yearly", priority: "0.4" },
];

async function loadFromDatabase() {
  if (!process.env.DATABASE_URL) return null;
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  try {
    const [appsRes, catsRes] = await Promise.all([
      pool.query("SELECT id, COALESCE(updated_at, NOW()) AS updated_at FROM apps ORDER BY id"),
      pool.query("SELECT slug, name FROM categories ORDER BY name"),
    ]);
    return {
      apps: appsRes.rows.map((r) => ({
        id: r.id,
        updated_at: new Date(r.updated_at).toISOString().split("T")[0],
      })),
      categories: catsRes.rows.map((r) => ({ slug: r.slug, name: r.name })),
    };
  } finally {
    await pool.end();
  }
}

async function fetchAllApps() {
  const pageSize = 1000;
  let page = 1;
  const all = [];
  while (true) {
    const url = `${API_URL}/api/apps?page=${page}&limit=${pageSize}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Apps fetch failed: ${res.status}`);
    const json = await res.json();
    const items = Array.isArray(json) ? json : json.apps || json.data || json.items || [];
    if (items.length === 0) break;
    all.push(...items);
    if (items.length < pageSize) break;
    page++;
    if (page > 20) break;
  }
  return all;
}

async function loadFromApi() {
  const [apps, categoriesRes] = await Promise.all([
    fetchAllApps(),
    fetch(`${API_URL}/api/categories`).then((r) => r.json()),
  ]);
  const categories = Array.isArray(categoriesRes)
    ? categoriesRes
    : categoriesRes.categories || categoriesRes.data || [];
  return {
    apps: apps.map((a) => ({
      id: a.id,
      updated_at: a.updated_at
        ? new Date(a.updated_at).toISOString().split("T")[0]
        : TODAY,
    })),
    categories: categories.map((c) => ({ slug: c.slug, name: c.name })),
  };
}

async function loadData() {
  try {
    const dbData = await loadFromDatabase();
    if (dbData && dbData.apps.length > 0) {
      console.log(`[seo] loaded from DB: ${dbData.apps.length} apps, ${dbData.categories.length} categories`);
      return dbData;
    }
  } catch (err) {
    console.warn("[seo] DB load failed, trying API:", err.message);
  }
  try {
    const apiData = await loadFromApi();
    console.log(`[seo] loaded from API: ${apiData.apps.length} apps, ${apiData.categories.length} categories`);
    return apiData;
  } catch (err) {
    console.warn("[seo] API load failed, using static-only fallback:", err.message);
    return { apps: [], categories: [] };
  }
}

function buildSitemap(data) {
  const urlEntry = (loc, lastmod, changefreq, priority) =>
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

  const staticEntries = STATIC_PAGES.map((p) =>
    urlEntry(`${SITE_URL}${p.path}`, TODAY, p.changefreq, p.priority)
  );
  const categoryEntries = data.categories.map((c) =>
    urlEntry(`${SITE_URL}/categories/${c.slug}`, TODAY, "weekly", "0.8")
  );
  const appEntries = data.apps.map((a) =>
    urlEntry(`${SITE_URL}/apps/${a.id}`, a.updated_at, "weekly", "0.7")
  );

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
    ...staticEntries,
    ...categoryEntries,
    ...appEntries,
  ].join("\n")}\n</urlset>\n`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

function buildLlms(data) {
  const catLines = data.categories
    .slice(0, 50)
    .map((c) => `- [${c.name}](${SITE_URL}/categories/${c.slug}): Browse ${c.name} apps and games.`)
    .join("\n");
  return `# Digi Nexa Store\n\n> Digi Nexa Store is a free, independent app discovery directory for iOS and Android. Browse 4,500+ apps and games organised across 18 categories. All download links go to the official Apple App Store and Google Play.\n\n## Main Pages\n\n- [Home](${SITE_URL}/): Discover apps and games by category.\n- [All Apps](${SITE_URL}/apps): Browse iOS and Android apps.\n- [All Games](${SITE_URL}/games): Browse mobile games.\n- [Categories](${SITE_URL}/categories): All 18 categories.\n- [About](${SITE_URL}/about): About Digi Nexa Store.\n- [Blog](${SITE_URL}/blog): Articles about app discovery.\n- [Contact](${SITE_URL}/contact): Get in touch.\n\n## Categories\n\n${catLines}\n\n## Policies\n\n- [Privacy Policy](${SITE_URL}/privacy-policy)\n- [Terms of Service](${SITE_URL}/terms-of-service)\n- [Cookie Policy](${SITE_URL}/cookie-policy)\n- [CCPA Privacy Rights](${SITE_URL}/ccpa-privacy-rights)\n- [Advertising Disclosure](${SITE_URL}/advertising-disclosure)\n- [Disclaimer](${SITE_URL}/disclaimer)\n- [No-Purchase Policy](${SITE_URL}/no-purchase-policy)\n\n## Sitemap\n\nFull XML sitemap: ${SITE_URL}/sitemap.xml\n`;
}

async function main() {
  await fs.mkdir(PUBLIC_DIR, { recursive: true });
  const data = await loadData();

  const sitemap = buildSitemap(data);
  const robots = buildRobots();
  const llms = buildLlms(data);

  await Promise.all([
    fs.writeFile(path.join(PUBLIC_DIR, "sitemap.xml"), sitemap, "utf8"),
    fs.writeFile(path.join(PUBLIC_DIR, "robots.txt"), robots, "utf8"),
    fs.writeFile(path.join(PUBLIC_DIR, "llms.txt"), llms, "utf8"),
  ]);

  const totalUrls =
    STATIC_PAGES.length + data.categories.length + data.apps.length;
  console.log(
    `[seo] wrote sitemap.xml (${totalUrls} URLs), robots.txt, llms.txt → ${PUBLIC_DIR}`
  );
}

main().catch((err) => {
  console.error("[seo] generation failed:", err);
  process.exit(1);
});
