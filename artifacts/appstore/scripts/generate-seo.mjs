#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, "..", "dist", "public");
const PUBLIC_DIR = path.resolve(__dirname, "..", "public");

const SITE_URL = (process.env.SITE_URL || "https://www.diginexastore.com").replace(/\/$/, "");
const BRAND = "Digi Nexa Store";
const TODAY = new Date().toISOString().split("T")[0];

const API_URL = (
  process.env.SEO_API_URL ||
  process.env.VITE_API_URL ||
  "https://diginexastorediginexa-api.onrender.com"
).replace(/\/$/, "");

// ─── Static page metadata ────────────────────────────────────────────────────
const STATIC_PAGES = {
  "/": {
    title: "Digi Nexa Store – Discover Apps & Games",
    h1: "Discover iOS & Android Apps and Games, Organised by Category",
    description: "Digi Nexa Store is a free app discovery platform. Browse 4,500+ iOS and Android apps and games organised across 18 categories — all linking to official stores, free to explore.",
    body: "Welcome to Digi Nexa Store, your independent guide to discovering the best mobile apps and games. We aggregate publicly available information about iOS and Android apps and organise them across 18 categories so you can quickly find what you need. Browse productivity tools, educational apps, finance trackers, health and fitness companions, photo editors, action games, puzzle games, and much more. Every app on our directory links directly to its official Apple App Store or Google Play page — we never sell apps ourselves and never charge for downloads.",
    priority: "1.0", changefreq: "daily",
  },
  "/apps": {
    title: "Browse Apps – iOS & Android | Digi Nexa Store",
    h1: "All Apps — iOS & Android Applications",
    description: "Explore thousands of iOS and Android apps across Productivity, Education, Finance, Health & Fitness, and more — all organised by category on Digi Nexa Store.",
    body: "Browse our complete catalogue of iOS and Android applications. From productivity boosters to creative tools, financial trackers to language-learning platforms, our directory covers thousands of apps across every major category. Each listing links directly to the official App Store or Google Play page.",
    priority: "0.9", changefreq: "daily",
  },
  "/games": {
    title: "Browse Games – App Store & Google Play | Digi Nexa Store",
    h1: "All Games — App Store & Google Play",
    description: "Browse games from the Apple App Store and Google Play across Puzzle, Action, Arcade, Casual and more genres — all organised by category on Digi Nexa Store.",
    body: "Discover the best mobile games from the Apple App Store and Google Play. Browse action games, puzzle games, arcade classics, casual time-killers, racing games, role-playing adventures and more. Every game on our directory links directly to its official store page for safe, legitimate downloads.",
    priority: "0.9", changefreq: "daily",
  },
  "/categories": {
    title: "App & Game Categories | Digi Nexa Store",
    h1: "Browse Apps & Games by Category",
    description: "Explore apps and games by category on Digi Nexa Store. 18 categories spanning Productivity, Education, Health & Fitness, Action Games and more — find exactly what you need.",
    body: "Our directory is organised into 18 categories covering both apps and games. Browse Productivity, Education, Finance, Health & Fitness, Entertainment, Social, Photography, Music, Lifestyle, Business, Travel, News, Shopping, Utilities, plus game categories like Action, Puzzle, Casual, Arcade, Racing, and RPG. Each category page lists every app or game we have catalogued in that area.",
    priority: "0.8", changefreq: "weekly",
  },
  "/about": {
    title: "About Digi Nexa Store – App Discovery Platform",
    h1: "About Digi Nexa Store: An Independent App Discovery Directory",
    description: "Learn about Digi Nexa Store — an independent app discovery directory that aggregates publicly available iOS and Android app information from the Apple App Store and Google Play.",
    body: "Digi Nexa Store is an independent, US-based app discovery directory. We aggregate publicly available information about iOS and Android apps from the Apple App Store and Google Play, organise it by category, and present it in a clean, easy-to-browse interface. We are not affiliated with Apple or Google. We do not sell, distribute, or host any apps. Every download link points to the official store. Our mission is simple: help people discover great mobile apps without the noise of ads, fake reviews, or pay-to-play rankings.",
    priority: "0.6", changefreq: "monthly",
  },
  "/blog": {
    title: "Digi Nexa Store Blog – App Discovery Articles",
    h1: "The Digi Nexa Store Blog",
    description: "Articles about app discovery, categories, and how to find apps on the Apple App Store and Google Play. New content coming soon.",
    body: "Welcome to the Digi Nexa Store blog. We publish articles about mobile app trends, category deep-dives, and tips for discovering quality apps and games on the Apple App Store and Google Play. New content is added regularly — check back soon for our latest posts.",
    priority: "0.6", changefreq: "weekly",
  },
  "/contact": {
    title: "Contact Digi Nexa Store | Get in Touch",
    h1: "Contact the Digi Nexa Store Team",
    description: "Have a question, suggestion, or want to recommend an app? Get in touch with the Digi Nexa Store team. We read every message.",
    body: "Have a question, a suggestion, an app you would like us to add to the directory, or a correction to report? We would love to hear from you. Email us at hello@diginexa.store — we read every message and respond within two business days. For takedown requests or copyright concerns, please include the specific app and the reason for your request.",
    priority: "0.5", changefreq: "monthly",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Digi Nexa Store",
    h1: "Digi Nexa Store Privacy Policy: How We Handle Your Data",
    description: "Read Digi Nexa Store's Privacy Policy. Learn how we collect, use, and protect your data — including CCPA rights, cookie usage, and third-party disclosures.",
    body: "This Privacy Policy explains what information we collect when you visit Digi Nexa Store, how we use it, and the choices you have. We collect minimal data — primarily anonymous analytics about how the site is used so we can improve it. We do not sell your personal information. California residents have additional rights under the CCPA, detailed on our California Privacy Rights page. Read the full policy below for specifics on cookies, third-party services, advertising partners, and your rights to access or delete your data.",
    priority: "0.4", changefreq: "yearly",
  },
  "/terms-of-service": {
    title: "Terms of Service | Digi Nexa Store",
    h1: "Digi Nexa Store Terms of Service",
    description: "Read Digi Nexa Store's Terms of Service. Understand the rules, limitations, and your rights when using the Digi Nexa Store app discovery platform.",
    body: "These Terms of Service govern your use of the Digi Nexa Store website and directory. By using the site you agree to these terms. Digi Nexa Store is a discovery directory only — we do not sell apps, host downloads, or process payments. All app downloads happen on official third-party stores under their own terms. We aim to keep app information accurate but make no warranty about completeness or current pricing. Read below for full terms covering acceptable use, intellectual property, disclaimers, limitation of liability, and dispute resolution.",
    priority: "0.4", changefreq: "yearly",
  },
  "/cookie-policy": {
    title: "Cookie Policy | Digi Nexa Store",
    h1: "Digi Nexa Store Cookie Policy: How We Use Cookies",
    description: "Digi Nexa Store's Cookie Policy explains what cookies we use, why we use them, and how you can control them — including essential, analytics, and advertising cookies.",
    body: "This Cookie Policy explains how Digi Nexa Store uses cookies and similar technologies. We use essential cookies to make the site work, analytics cookies to understand traffic patterns, and advertising cookies from our partners. You can control non-essential cookies through your browser settings or our cookie banner. Read below for the full list of cookies we use, what each does, and how to opt out of advertising cookies.",
    priority: "0.4", changefreq: "yearly",
  },
  "/ccpa-privacy-rights": {
    title: "California Privacy Rights (CCPA) | Digi Nexa Store",
    h1: "Your California Privacy Rights Under CCPA",
    description: "Digi Nexa Store's CCPA disclosure for California residents. Learn about your right to know, delete, and opt out of data sharing under the California Consumer Privacy Act.",
    body: "Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have specific rights regarding their personal information. These include the right to know what personal information we collect, the right to delete that information, the right to opt out of the sale or sharing of personal information, and the right to non-discrimination for exercising these rights. To exercise any of these rights, contact us at hello@diginexa.store. We respond to verifiable consumer requests within 45 days.",
    priority: "0.4", changefreq: "yearly",
  },
  "/advertising-disclosure": {
    title: "Advertising Disclosure | Digi Nexa Store",
    h1: "Digi Nexa Store Advertising & Interest-Based Advertising Disclosure",
    description: "Digi Nexa Store uses interest-based advertising. Learn how our advertising partners collect data, how to opt out, and what controls you have over targeted ads.",
    body: "Digi Nexa Store displays advertising provided by third-party partners including Microsoft Advertising and Google. These partners may use cookies and similar technologies to show you ads based on your interests across websites. You can opt out of personalised advertising at any time through industry tools like the Digital Advertising Alliance opt-out page or the Network Advertising Initiative opt-out page. Read below for the full list of our advertising partners and their privacy policies.",
    priority: "0.4", changefreq: "yearly",
  },
  "/disclaimer": {
    title: "Disclaimer | Digi Nexa Store",
    h1: "Digi Nexa Store Site Disclaimer",
    description: "Digi Nexa Store is an independent app discovery platform. Read our disclaimer about app information accuracy, third-party links, and affiliate relationships.",
    body: "Digi Nexa Store is an independent app discovery directory. We are not affiliated with Apple, Google, or any of the app developers listed on our site. App information is aggregated from publicly available sources and may not always be current. Pricing, ratings, and availability can change at any time. All trademarks belong to their respective owners. Some links on our site may be affiliate links — if you tap through and download a paid app, we may earn a small commission at no extra cost to you.",
    priority: "0.4", changefreq: "yearly",
  },
  "/no-purchase-policy": {
    title: "No-Purchase Policy | Digi Nexa Store",
    h1: "Digi Nexa Store Does Not Sell Apps — No Purchases on This Site",
    description: "Digi Nexa Store is a free discovery platform only. We do not sell, distribute, or charge for any app or game. All purchases happen on official third-party stores.",
    body: "Digi Nexa Store is a free discovery directory. We do not sell, distribute, host, or process payments for any app or game. We do not charge any subscription, membership, or access fee. Every app or game listed on our site links directly to its official Apple App Store or Google Play page, where the actual download (free or paid) takes place under that store's terms. If you ever see something on Digi Nexa Store that asks you to pay us for an app or game, it is not legitimate — please report it to hello@diginexa.store immediately.",
    priority: "0.4", changefreq: "yearly",
  },
};

// ─── DB / API loaders ────────────────────────────────────────────────────────

async function loadFromDatabase() {
  if (!process.env.DATABASE_URL) return null;
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  try {
    const [appsRes, catsRes] = await Promise.all([
      pool.query(`SELECT id, name, developer, short_description, full_description, category_name, category_slug, app_type, rating, review_count, is_free, price, icon_url, COALESCE(updated_at, NOW()) AS updated_at FROM apps ORDER BY id`),
      pool.query(`SELECT id, name, slug, description, app_count, type FROM categories ORDER BY name`),
    ]);
    return { apps: appsRes.rows, categories: catsRes.rows };
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
  const categories = Array.isArray(categoriesRes) ? categoriesRes : categoriesRes.categories || categoriesRes.data || [];
  return { apps, categories };
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

// ─── HTML helpers ────────────────────────────────────────────────────────────

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const trunc = (s, n) => (s.length <= n ? s : s.slice(0, n - 1) + "…");

const FOOTER_LINKS = [
  { href: "/", label: "Home" }, { href: "/apps", label: "All Apps" },
  { href: "/games", label: "All Games" }, { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" }, { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" }, { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" }, { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/ccpa-privacy-rights", label: "California Privacy Rights" }, { href: "/advertising-disclosure", label: "Advertising Disclosure" },
  { href: "/disclaimer", label: "Disclaimer" }, { href: "/no-purchase-policy", label: "No-Purchase Policy" },
];

function siteFooterHtml() {
  return `<nav aria-label="Site"><ul>${FOOTER_LINKS.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join("")}</ul></nav>`;
}

function categoriesNavHtml(categories) {
  if (!categories.length) return "";
  return `<nav aria-label="Categories"><ul>${categories.map((c) => `<li><a href="/categories/${esc(c.slug)}">${esc(c.name)}</a></li>`).join("")}</ul></nav>`;
}

function buildPageHtml(template, { canonicalPath, title, description, h1, bodyHtml, jsonLd }) {
  const canonical = `${SITE_URL}${canonicalPath}`;
  const headTags = `
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${BRAND}">
  <meta property="og:image" content="${SITE_URL}/opengraph.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
${jsonLd ? `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}`;

  const rootContent = `<h1>${esc(h1)}</h1>${bodyHtml}`;

  let html = template
    .replace(/<title>[^<]*<\/title>/i, "")
    .replace(/<meta\s+name="description"[^>]*>/i, "")
    .replace(/<link\s+rel="canonical"[^>]*>/gi, "")
    .replace(/<meta\s+property="og:[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:[^>]*>/gi, "")
    .replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi, "")
    .replace("</head>", `${headTags}\n</head>`)
    .replace(/<div\s+id="root"[^>]*>[\s\S]*?<\/div>/i, `<div id="root">${rootContent}</div>`);

  return html;
}

// ─── File writers ────────────────────────────────────────────────────────────

async function writeRoute(routePath, html) {
  const cleanPath = routePath === "/" ? "" : routePath.replace(/^\//, "");
  const dir = cleanPath ? path.join(DIST_DIR, cleanPath) : DIST_DIR;
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, "index.html"), html, "utf8");
}

// ─── Sitemap / robots / llms ─────────────────────────────────────────────────

function buildSitemap(data) {
  const entry = (loc, lastmod, changefreq, priority) =>
    `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
  const urls = [
    ...Object.entries(STATIC_PAGES).map(([p, m]) => entry(`${SITE_URL}${p}`, TODAY, m.changefreq, m.priority)),
    ...data.categories.map((c) => entry(`${SITE_URL}/categories/${c.slug}`, TODAY, "weekly", "0.8")),
    ...data.apps.map((a) => {
      const lastmod = a.updated_at ? new Date(a.updated_at).toISOString().split("T")[0] : TODAY;
      return entry(`${SITE_URL}/apps/${a.id}`, lastmod, "weekly", "0.7");
    }),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

function buildLlms(data) {
  const catLines = data.categories
    .map((c) => `- [${c.name}](${SITE_URL}/categories/${c.slug}): Browse ${c.name} ${c.type === "game" ? "games" : "apps"}.`)
    .join("\n");
  return `# Digi Nexa Store\n\n> Digi Nexa Store is a free, independent app discovery directory for iOS and Android. Browse 4,500+ apps and games organised across 18 categories. All download links go to the official Apple App Store and Google Play.\n\n## Main Pages\n\n- [Home](${SITE_URL}/): Discover apps and games by category.\n- [All Apps](${SITE_URL}/apps): Browse iOS and Android apps.\n- [All Games](${SITE_URL}/games): Browse mobile games.\n- [Categories](${SITE_URL}/categories): All 18 categories.\n- [About](${SITE_URL}/about): About Digi Nexa Store.\n- [Blog](${SITE_URL}/blog): Articles about app discovery.\n- [Contact](${SITE_URL}/contact): Get in touch.\n\n## Categories\n\n${catLines}\n\n## Policies\n\n- [Privacy Policy](${SITE_URL}/privacy-policy)\n- [Terms of Service](${SITE_URL}/terms-of-service)\n- [Cookie Policy](${SITE_URL}/cookie-policy)\n- [CCPA Privacy Rights](${SITE_URL}/ccpa-privacy-rights)\n- [Advertising Disclosure](${SITE_URL}/advertising-disclosure)\n- [Disclaimer](${SITE_URL}/disclaimer)\n- [No-Purchase Policy](${SITE_URL}/no-purchase-policy)\n\n## Sitemap\n\n${SITE_URL}/sitemap.xml\n`;
}

// ─── Per-page renderers ──────────────────────────────────────────────────────

function renderStatic(routePath, meta, data) {
  return {
    canonicalPath: routePath,
    title: meta.title,
    description: meta.description,
    h1: meta.h1,
    bodyHtml: `<p>${esc(meta.body)}</p>${categoriesNavHtml(data.categories)}${siteFooterHtml()}`,
  };
}

function renderCategory(cat, appsInCat) {
  const isGame = cat.type === "game";
  const label = isGame ? "Games" : "Apps";
  const title = trunc(`Best ${cat.name} ${label} | ${BRAND}`, 60);
  const h1 = `Best ${cat.name} ${label} for iOS and Android`;
  const description = trunc(`Browse ${appsInCat.length || cat.app_count || ""} ${cat.name} ${label.toLowerCase()} for iOS and Android on Digi Nexa Store. Organised by category — find the right ${cat.name.toLowerCase()} ${label.toLowerCase()} quickly without the clutter.`, 160);
  const intro = `<p>${esc(cat.description || `Browse ${cat.name} ${label.toLowerCase()} for iOS and Android. All apps link directly to the official Apple App Store or Google Play.`)}</p>`;
  const list = appsInCat.length
    ? `<h2>All ${cat.name} ${label}</h2><ul>${appsInCat.map((a) => `<li><a href="/apps/${a.id}">${esc(a.name)}</a> by ${esc(a.developer || "")}${a.short_description ? ` — ${esc(a.short_description)}` : ""}</li>`).join("")}</ul>`
    : "";
  return {
    canonicalPath: `/categories/${cat.slug}`,
    title, description, h1,
    bodyHtml: `${intro}${list}${siteFooterHtml()}`,
    jsonLd: { "@context": "https://schema.org", "@type": "CollectionPage", name: `${cat.name} ${label}`, description, url: `${SITE_URL}/categories/${cat.slug}` },
  };
}

function renderApp(app) {
  const typeLabel = app.app_type === "game" ? "Game" : "App";
  const title = trunc(`${app.name} – ${app.category_name} ${typeLabel} | ${BRAND}`, 60);
  const h1 = `${app.name}: ${app.short_description || `${app.category_name} ${typeLabel}`}`;
  const ratingNum = Number(app.rating) || 0;
  const reviews = Number(app.review_count) || 0;
  const description = trunc(`${app.developer || "Independent developer"}'s ${app.name} is a ${app.category_name} ${typeLabel.toLowerCase()} for iOS and Android.${ratingNum > 0 ? ` Rated ${ratingNum.toFixed(1)}/5${reviews > 0 ? ` by ${reviews.toLocaleString()}+ users` : ""}.` : ""} Discover it free on Digi Nexa Store.`, 160);
  const longDesc = app.full_description || app.description || app.short_description || "";
  const body = `
    <p><strong>Developer:</strong> ${esc(app.developer || "Unknown")}</p>
    <p><strong>Category:</strong> <a href="/categories/${esc(app.category_slug || "")}">${esc(app.category_name || "")}</a></p>
    ${ratingNum > 0 ? `<p><strong>Rating:</strong> ${ratingNum.toFixed(1)}/5${reviews > 0 ? ` (${reviews.toLocaleString()} reviews)` : ""}</p>` : ""}
    <p><strong>Price:</strong> ${app.is_free ? "Free" : `$${Number(app.price || 0).toFixed(2)}`}</p>
    ${longDesc ? `<h2>About ${esc(app.name)}</h2><p>${esc(longDesc)}</p>` : `<p>${esc(description)}</p>`}
    <p><a href="/categories/${esc(app.category_slug || "")}">← Back to ${esc(app.category_name || "category")}</a></p>
    ${siteFooterHtml()}
  `;
  return {
    canonicalPath: `/apps/${app.id}`,
    title, description, h1, bodyHtml: body,
    jsonLd: {
      "@context": "https://schema.org", "@type": "SoftwareApplication", name: app.name,
      description: app.short_description || description,
      applicationCategory: app.app_type === "game" ? "GameApplication" : "MobileApplication",
      operatingSystem: "iOS, Android",
      author: { "@type": "Organization", name: app.developer || "Unknown" },
      ...(reviews > 0 ? { aggregateRating: { "@type": "AggregateRating", ratingValue: ratingNum.toFixed(1), reviewCount: reviews } } : {}),
      offers: { "@type": "Offer", price: app.is_free ? "0" : Number(app.price || 0).toFixed(2), priceCurrency: "USD", availability: "https://schema.org/InStock" },
    },
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  await fs.mkdir(PUBLIC_DIR, { recursive: true });

  // Try to read built index.html as template; if not present (running without build),
  // write robots/sitemap/llms only and exit gracefully.
  let template = null;
  try {
    template = await fs.readFile(path.join(DIST_DIR, "index.html"), "utf8");
  } catch {
    console.warn("[seo] dist/public/index.html not found — writing only sitemap/robots/llms to public/");
  }

  const data = await loadData();

  const sitemap = buildSitemap(data);
  const robots = buildRobots();
  const llms = buildLlms(data);

  const targetDir = template ? DIST_DIR : PUBLIC_DIR;
  await fs.mkdir(targetDir, { recursive: true });
  await Promise.all([
    fs.writeFile(path.join(targetDir, "sitemap.xml"), sitemap, "utf8"),
    fs.writeFile(path.join(targetDir, "robots.txt"), robots, "utf8"),
    fs.writeFile(path.join(targetDir, "llms.txt"), llms, "utf8"),
  ]);

  if (!template) {
    console.log(`[seo] wrote sitemap.xml/robots.txt/llms.txt to ${targetDir}`);
    return;
  }

  // Group apps by category for category pages
  const appsByCat = new Map();
  for (const a of data.apps) {
    const slug = a.category_slug;
    if (!slug) continue;
    if (!appsByCat.has(slug)) appsByCat.set(slug, []);
    appsByCat.get(slug).push(a);
  }

  // Prerender static pages
  let staticCount = 0;
  for (const [routePath, meta] of Object.entries(STATIC_PAGES)) {
    if (routePath === "/") continue; // index.html will be handled separately
    const page = renderStatic(routePath, meta, data);
    await writeRoute(routePath, buildPageHtml(template, page));
    staticCount++;
  }
  // Overwrite root index.html with proper home page
  const homePage = renderStatic("/", STATIC_PAGES["/"], data);
  await fs.writeFile(path.join(DIST_DIR, "index.html"), buildPageHtml(template, homePage), "utf8");

  // Prerender categories
  let catCount = 0;
  for (const cat of data.categories) {
    const inCat = appsByCat.get(cat.slug) || [];
    const page = renderCategory(cat, inCat);
    await writeRoute(`/categories/${cat.slug}`, buildPageHtml(template, page));
    catCount++;
  }

  // Prerender app detail pages (in batches to avoid fd exhaustion)
  let appCount = 0;
  const BATCH = 50;
  for (let i = 0; i < data.apps.length; i += BATCH) {
    const batch = data.apps.slice(i, i + BATCH);
    await Promise.all(batch.map(async (app) => {
      const page = renderApp(app);
      await writeRoute(`/apps/${app.id}`, buildPageHtml(template, page));
      appCount++;
    }));
  }

  console.log(`[seo] prerendered ${staticCount + 1} static + ${catCount} categories + ${appCount} apps = ${staticCount + 1 + catCount + appCount} pages`);
  console.log(`[seo] wrote sitemap.xml (${Object.keys(STATIC_PAGES).length + data.categories.length + data.apps.length} URLs), robots.txt, llms.txt`);
}

main().catch((err) => {
  console.error("[seo] generation failed:", err);
  process.exit(1);
});
