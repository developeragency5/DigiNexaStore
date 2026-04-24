import type { Plugin } from "vite";
import type { Connect } from "vite";
import pg from "pg";

const { Pool } = pg;

const SITE_URL = "https://www.diginexastore.com";
const BRAND = "Digi Nexa Store";
const TODAY = new Date().toISOString().split("T")[0];

const HIDDEN_STYLE =
  "position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden";

function trunc(s: string, max: number): string {
  return s.length <= max ? s : s.slice(0, max - 1) + "…";
}

// Lazy pool — only created when the plugin actually handles a request
let _pool: InstanceType<typeof Pool> | null = null;
function getPool(): InstanceType<typeof Pool> {
  if (!_pool && process.env.DATABASE_URL) {
    _pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return _pool!;
}

async function queryOne<T>(sql: string, params: any[]): Promise<T | null> {
  try {
    const pool = getPool();
    if (!pool) return null;
    const { rows } = await pool.query(sql, params);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

async function queryAll<T>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const pool = getPool();
    if (!pool) return [];
    const { rows } = await pool.query(sql, params);
    return rows;
  } catch {
    return [];
  }
}

interface PageMeta {
  title: string;
  h1: string;
  description: string;
  canonical: string;
  type?: string;
  jsonLd?: object | object[];
}

// ─── Static route table ──────────────────────────────────────────────────────

const STATIC_META: Record<string, Omit<PageMeta, "canonical">> = {
  "/": {
    title: "Digi Nexa Store – Discover Apps & Games",
    h1: "Discover iOS & Android Apps and Games, Organised by Category",
    description:
      "Digi Nexa Store is a free app discovery platform. Browse 4,500+ iOS and Android apps and games organised across 18 categories — all linking to official stores, free to explore.",
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Digi Nexa Store",
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.svg`,
        contactPoint: {
          "@type": "ContactPoint",
          email: "hello@diginexastore.com",
          contactType: "customer support",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Digi Nexa Store",
        url: SITE_URL,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/apps?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  },
  "/apps": {
    title: "Browse Apps – iOS & Android | Digi Nexa Store",
    h1: "All Apps — iOS & Android Applications",
    description:
      "Explore thousands of iOS and Android apps across Productivity, Education, Finance, Health & Fitness, and more — all organised by category on Digi Nexa Store.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "All Apps",
      description: "iOS and Android apps organised by category on Digi Nexa Store.",
      url: `${SITE_URL}/apps`,
    },
  },
  "/games": {
    title: "Browse Games – App Store & Google Play | Digi Nexa Store",
    h1: "All Games — App Store & Google Play",
    description:
      "Browse games from the Apple App Store and Google Play across Puzzle, Action, Arcade, Casual and more genres — all organised by category on Digi Nexa Store.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "All Games",
      description: "Games from the Apple App Store and Google Play organised by category on Digi Nexa Store.",
      url: `${SITE_URL}/games`,
    },
  },
  "/categories": {
    title: "App & Game Categories | Digi Nexa Store",
    h1: "Browse Apps & Games by Category",
    description:
      "Explore apps and games by category on Digi Nexa Store. 18 categories spanning Productivity, Education, Health & Fitness, Action Games and more — find exactly what you need.",
  },
  "/about": {
    title: "About Digi Nexa Store – App Discovery Platform",
    h1: "About Digi Nexa Store: An Independent App Discovery Directory",
    description:
      "Learn about Digi Nexa Store — an independent app discovery directory that aggregates publicly available iOS and Android app information from the Apple App Store and Google Play.",
  },
  "/blog": {
    title: "Digi Nexa Store Blog – App Discovery Articles",
    h1: "The Digi Nexa Store Blog",
    description:
      "Articles about app discovery, categories, and how to find apps on the Apple App Store and Google Play. New content coming soon.",
  },
  "/contact": {
    title: "Contact Digi Nexa Store | Get in Touch",
    h1: "Contact the Digi Nexa Store Team",
    description:
      "Have a question, suggestion, or want to recommend an app? Get in touch with the Digi Nexa Store team. We read every message.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Digi Nexa Store",
    h1: "Digi Nexa Store Privacy Policy: How We Handle Your Data",
    description:
      "Read Digi Nexa Store's Privacy Policy. Learn how we collect, use, and protect your data — including CCPA rights, cookie usage, and third-party disclosures.",
  },
  "/terms-of-service": {
    title: "Terms of Service | Digi Nexa Store",
    h1: "Digi Nexa Store Terms of Service",
    description:
      "Read Digi Nexa Store's Terms of Service. Understand the rules, limitations, and your rights when using the Digi Nexa Store app discovery platform.",
  },
  "/cookie-policy": {
    title: "Cookie Policy | Digi Nexa Store",
    h1: "Digi Nexa Store Cookie Policy: How We Use Cookies",
    description:
      "Digi Nexa Store's Cookie Policy explains what cookies we use, why we use them, and how you can control them — including essential, analytics, and advertising cookies.",
  },
  "/ccpa-privacy-rights": {
    title: "California Privacy Rights (CCPA) | Digi Nexa Store",
    h1: "Your California Privacy Rights Under CCPA",
    description:
      "Digi Nexa Store's CCPA disclosure for California residents. Learn about your right to know, delete, and opt out of data sharing under the California Consumer Privacy Act.",
  },
  "/advertising-disclosure": {
    title: "Advertising Disclosure | Digi Nexa Store",
    h1: "Digi Nexa Store Advertising & Interest-Based Advertising Disclosure",
    description:
      "Digi Nexa Store uses interest-based advertising. Learn how our advertising partners collect data, how to opt out, and what controls you have over targeted ads.",
  },
  "/disclaimer": {
    title: "Disclaimer | Digi Nexa Store",
    h1: "Digi Nexa Store Site Disclaimer",
    description:
      "Digi Nexa Store is an independent app discovery platform. Read our disclaimer about app information accuracy, third-party links, and affiliate relationships.",
  },
  "/no-purchase-policy": {
    title: "No-Purchase Policy | Digi Nexa Store",
    h1: "Digi Nexa Store Does Not Sell Apps — No Purchases on This Site",
    description:
      "Digi Nexa Store is a free discovery platform only. We do not sell, distribute, or charge for any app or game. All purchases happen on official third-party stores.",
  },
};

// ─── Hidden nav links ─────────────────────────────────────────────────────────

const ALL_NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/apps", label: "All Apps" },
  { href: "/games", label: "All Games" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/ccpa-privacy-rights", label: "California Privacy Rights" },
  { href: "/advertising-disclosure", label: "Advertising Disclosure" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/no-purchase-policy", label: "No Purchase Policy" },
  { href: "/categories/productivity", label: "Productivity Apps" },
  { href: "/categories/education", label: "Education Apps" },
  { href: "/categories/finance", label: "Finance Apps" },
  { href: "/categories/health-fitness", label: "Health & Fitness Apps" },
  { href: "/categories/entertainment", label: "Entertainment Apps" },
  { href: "/categories/social", label: "Social Apps" },
  { href: "/categories/photography", label: "Photography Apps" },
  { href: "/categories/music", label: "Music Apps" },
  { href: "/categories/action-games", label: "Action Games" },
  { href: "/categories/puzzle-games", label: "Puzzle Games" },
  { href: "/categories/casual-games", label: "Casual Games" },
  { href: "/categories/arcade-games", label: "Arcade Games" },
];

// ─── Dynamic meta fetchers ───────────────────────────────────────────────────

interface AppRow {
  id: number;
  name: string;
  developer: string;
  short_description: string;
  category_name: string;
  app_type: string;
  rating: number;
  review_count: number;
  is_free: boolean;
  price: number;
}

interface CategoryRow {
  name: string;
  slug: string;
  description: string;
  app_count: number;
  type: string;
}

async function getAppMeta(id: string): Promise<Omit<PageMeta, "canonical"> | null> {
  const row = await queryOne<AppRow>(
    `SELECT id, name, developer, short_description, category_name, app_type, rating, review_count, is_free, price
     FROM apps WHERE id = $1 LIMIT 1`,
    [Number(id)]
  );
  if (!row) return null;

  const typeLabel = row.app_type === "game" ? "Game" : "App";
  const fullTitle = `${row.name} – ${row.category_name} ${typeLabel}`;
  const title = trunc(`${fullTitle} | ${BRAND}`, 60);
  const h1 = `${row.name}: ${row.short_description}`;
  const desc = `${row.developer}'s ${row.name} is a top-rated ${row.category_name} ${typeLabel.toLowerCase()} for iOS and Android. Rated ${Number(row.rating).toFixed(1)}/5 by ${Number(row.review_count).toLocaleString()}+ users. Discover it free on Digi Nexa Store.`;
  return {
    title,
    h1,
    description: trunc(desc, 160),
    type: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: row.name,
      description: row.short_description,
      applicationCategory:
        row.app_type === "game" ? "GameApplication" : "MobileApplication",
      operatingSystem: "iOS, Android",
      author: { "@type": "Organization", name: row.developer },
      aggregateRating:
        row.review_count > 0
          ? {
              "@type": "AggregateRating",
              ratingValue: Number(row.rating).toFixed(1),
              reviewCount: row.review_count,
            }
          : undefined,
      offers: {
        "@type": "Offer",
        price: row.is_free ? "0" : Number(row.price).toFixed(2),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    },
  };
}

async function getCategoryMeta(slug: string): Promise<Omit<PageMeta, "canonical"> | null> {
  const row = await queryOne<CategoryRow>(
    `SELECT name, slug, description, app_count, type FROM categories WHERE slug = $1 LIMIT 1`,
    [slug]
  );
  if (!row) return null;

  const isGame = row.type === "game";
  const label = isGame ? "Games" : "Apps";
  const title = trunc(`Best ${row.name} ${label} | ${BRAND}`, 60);
  const h1 = `Best ${row.name} ${label} for iOS and Android`;
  const desc = `Browse ${row.app_count}+ ${row.name} ${label.toLowerCase()} for iOS and Android on Digi Nexa Store. Organised by category — find the right ${row.name.toLowerCase()} ${label.toLowerCase()} quickly without the clutter.`;
  return {
    title,
    h1,
    description: trunc(desc, 160),
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${row.name} ${label}`,
      description: desc,
      url: `${SITE_URL}/categories/${slug}`,
    },
  };
}

// ─── Resolve meta for a URL path ─────────────────────────────────────────────

async function resolveMeta(pathname: string): Promise<PageMeta> {
  const canonical = `${SITE_URL}${pathname}`;

  if (STATIC_META[pathname]) {
    return { ...STATIC_META[pathname], canonical };
  }

  const appMatch = pathname.match(/^\/apps\/(\d+)$/);
  if (appMatch) {
    const dynamic = await getAppMeta(appMatch[1]);
    if (dynamic) return { ...dynamic, canonical };
  }

  const catMatch = pathname.match(/^\/categories\/(.+)$/);
  if (catMatch) {
    const dynamic = await getCategoryMeta(catMatch[1]);
    if (dynamic) return { ...dynamic, canonical };
  }

  return {
    title: `${BRAND} – Discover Apps & Games`,
    h1: "Discover Apps & Games on Digi Nexa Store",
    description:
      "Digi Nexa Store is a free app discovery platform. Browse iOS and Android apps and games organised by category, all linking to official stores.",
    canonical,
    type: "website",
  };
}

// ─── HTML injection ───────────────────────────────────────────────────────────

function buildNavHtml(): string {
  const links = ALL_NAV_LINKS.map(
    (l) => `<a href="${l.href}">${l.label}</a>`
  ).join("\n");
  return `<nav style="${HIDDEN_STYLE}" aria-hidden="true">\n${links}\n</nav>`;
}

function buildHeadTags(meta: PageMeta): string {
  const jsonLdArr = meta.jsonLd
    ? Array.isArray(meta.jsonLd)
      ? meta.jsonLd
      : [meta.jsonLd]
    : [];
  const jsonLdHtml = jsonLdArr
    .map(
      (ld) =>
        `<script type="application/ld+json">${JSON.stringify(ld)}</script>`
    )
    .join("\n");
  const esc = (s: string) => s.replace(/"/g, "&quot;");

  return `
  <title>${meta.title}</title>
  <meta name="description" content="${esc(meta.description)}">
  <link rel="canonical" href="${meta.canonical}">
  <meta property="og:title" content="${esc(meta.title)}">
  <meta property="og:description" content="${esc(meta.description)}">
  <meta property="og:url" content="${meta.canonical}">
  <meta property="og:type" content="${meta.type ?? "website"}">
  <meta property="og:site_name" content="${BRAND}">
  <meta property="og:image" content="${SITE_URL}/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(meta.title)}">
  <meta name="twitter:description" content="${esc(meta.description)}">
  <meta name="twitter:image" content="${SITE_URL}/og-image.png">
${jsonLdHtml}`;
}

function injectIntoHtml(html: string, meta: PageMeta): string {
  const headTags = buildHeadTags(meta);
  const h1Html = `<h1 style="${HIDDEN_STYLE}">${meta.h1}</h1>`;
  const navHtml = buildNavHtml();

  let result = html
    .replace(/<title>[^<]*<\/title>/gi, "")
    .replace(/<meta\s+name="description"[^>]*>/gi, "")
    .replace(/<meta\s+property="og:[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:[^>]*>/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>/gi, "")
    .replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi, "");

  result = result.replace("</head>", `${headTags}\n</head>`);
  result = result.replace(
    /(<div\s+id="root"\s*>)/i,
    `$1\n${h1Html}\n${navHtml}`
  );

  return result;
}

// ─── Sitemap generator ───────────────────────────────────────────────────────

async function generateSitemap(): Promise<string> {
  const staticUrls = Object.keys(STATIC_META).map((path) => {
    const priority =
      path === "/" ? "1.0" : path.startsWith("/categories") ? "0.8" : "0.6";
    return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${path === "/" ? "daily" : "weekly"}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const [apps, categories] = await Promise.all([
    queryAll<{ id: number; updated_at: string }>(
      `SELECT id, updated_at FROM apps LIMIT 500`
    ),
    queryAll<{ slug: string }>(`SELECT slug FROM categories`),
  ]);

  const dynamicUrls = [
    ...apps.map(
      (a) => `  <url>
    <loc>${SITE_URL}/apps/${a.id}</loc>
    <lastmod>${new Date(a.updated_at).toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    ),
    ...categories.map(
      (c) => `  <url>
    <loc>${SITE_URL}/categories/${c.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...dynamicUrls].join("\n")}
</urlset>`;
}

// ─── Shared middleware ────────────────────────────────────────────────────────

function seoMiddleware(): Connect.NextHandleFunction {
  return async (req, res, next) => {
    const url = (req.url ?? "/").split("?")[0];

    if (url === "/sitemap.xml") {
      try {
        const xml = await generateSitemap();
        res.setHeader("Content-Type", "application/xml; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=3600");
        res.end(xml);
      } catch {
        res.statusCode = 500;
        res.end("Sitemap generation failed");
      }
      return;
    }

    const accept = req.headers.accept ?? "";
    if (!accept.includes("text/html")) return next();

    const originalEnd = (res as any).end.bind(res);
    (res as any).end = async function (
      chunk: any,
      encodingOrCallback?: any,
      callback?: any
    ) {
      if (typeof chunk === "string" && chunk.includes("<!DOCTYPE html>")) {
        try {
          const meta = await resolveMeta(url);
          chunk = injectIntoHtml(chunk, meta);
        } catch {
          // serve unmodified on error
        }
      } else if (
        Buffer.isBuffer(chunk) &&
        chunk.toString().includes("<!DOCTYPE html>")
      ) {
        try {
          const meta = await resolveMeta(url);
          chunk = Buffer.from(injectIntoHtml(chunk.toString(), meta), "utf-8");
        } catch {
          // serve unmodified on error
        }
      }
      return originalEnd(chunk, encodingOrCallback, callback);
    };

    next();
  };
}

// ─── Plugin export ────────────────────────────────────────────────────────────

export function seoPlugin(): Plugin {
  return {
    name: "vite-seo-meta",
    configureServer(server) {
      server.middlewares.use(seoMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(seoMiddleware());
    },
  };
}
