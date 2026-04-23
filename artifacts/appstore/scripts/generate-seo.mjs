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
// Each page uses `bodyParagraphs` (array of strings). All pages exceed 250
// meaningful words to satisfy SEO low-word-count thresholds while staying
// strictly on theme: app discovery on the Apple App Store and Google Play.
const STATIC_PAGES = {
  "/": {
    title: "Digi Nexa Store – Discover Apps & Games",
    h1: "Discover iOS & Android Apps and Games, Organised by Category",
    description: "Digi Nexa Store is a free app discovery platform. Browse 4,500+ iOS and Android apps and games organised across 18 categories — all linking to official stores, free to explore.",
    bodyParagraphs: [
      "Welcome to Digi Nexa Store, your independent guide to discovering the best mobile apps and games on the Apple App Store and Google Play. We aggregate publicly available information about iOS and Android apps and organise them across eighteen categories so you can quickly find what you need without wading through endless ad-driven listings or pay-to-play rankings.",
      "Our directory covers more than four thousand five hundred apps and games. Browse productivity tools, educational apps, finance trackers, health and fitness companions, photo and video editors, music players, news readers, social networks, shopping apps, travel planners and lifestyle tools. On the gaming side you will find action games, puzzle games, arcade classics, casual time-killers, racing games, sports simulations and role-playing adventures, all categorised so you can drill down to the genre you actually want.",
      "Every app on our directory links directly to its official Apple App Store or Google Play page. We never sell apps ourselves, never host downloads, never process payments and never charge any membership fee. Digi Nexa Store is a free discovery directory, full stop. Our goal is to help people in the United States and beyond discover useful, legitimate mobile software without the noise of fake reviews, misleading rankings or hidden in-app pressure to upgrade.",
      "We are an independent project and we are not affiliated with Apple, Google or any of the developers listed on the site. App pricing, ratings, screenshots and feature lists can change without notice on the official stores, so always confirm the current details on the App Store or Google Play before downloading. Use the category navigation above to start exploring, or open the All Apps and All Games pages to see the full directory.",
    ],
    priority: "1.0", changefreq: "daily",
  },
  "/apps": {
    title: "Browse Apps – iOS & Android | Digi Nexa Store",
    h1: "All Apps — iOS & Android Applications",
    description: "Explore thousands of iOS and Android apps across Productivity, Education, Finance, Health & Fitness, and more — all organised by category on Digi Nexa Store.",
    bodyParagraphs: [
      "Browse our complete catalogue of iOS and Android applications on Digi Nexa Store. From productivity boosters to creative tools, financial trackers to language-learning platforms, photo editors to fitness companions and habit trackers, our directory covers thousands of apps across every major category available on the Apple App Store and Google Play.",
      "Use the category links below to narrow your search by topic. We cover Productivity, Education, Finance, Health and Fitness, Entertainment, Social, Photography, Music, Lifestyle, Business, Travel, News, Shopping and Utilities. Each category page lists every app we have catalogued in that area along with the developer name, a short description and a direct link to the official App Store or Google Play listing.",
      "Every app listing on Digi Nexa Store links to the official Apple App Store or Google Play page where the actual download happens under that store's terms. We do not host application files, we do not process payments and we do not collect download fees. Pricing shown on our directory is the figure last reported by the official stores; current pricing, in-app purchase options and regional availability may differ, so always confirm on the store page before you install.",
      "If you cannot find an app you are looking for or you would like us to add a specific iOS or Android application to the directory, send a suggestion to hello@diginexa.store. We are constantly expanding the catalogue and we read every message.",
    ],
    priority: "0.9", changefreq: "daily",
  },
  "/games": {
    title: "Browse Games – App Store & Google Play | Digi Nexa Store",
    h1: "All Games — App Store & Google Play",
    description: "Browse games from the Apple App Store and Google Play across Puzzle, Action, Arcade, Casual and more genres — all organised by category on Digi Nexa Store.",
    bodyParagraphs: [
      "Discover the best mobile games from the Apple App Store and Google Play on Digi Nexa Store. Browse action games, puzzle games, arcade classics, casual time-killers, racing games, sports simulations and role-playing adventures. Every game on our directory links directly to its official store page so you can read the developer description, check the age rating, review screenshots and install through the platform you trust.",
      "We organise games by genre to make discovery faster. Action covers shooters, brawlers, platformers and adventure titles. Puzzle covers match-three, sliding tiles, word puzzles, logic challenges and brain-teasers. Casual covers idle, simulation and tap-to-play games designed for short sessions. Arcade covers retro-style scrolling games, racing covers driving and karting, and RPG covers turn-based and real-time role-playing experiences.",
      "Digi Nexa Store does not host any game files, does not stream any gameplay and does not process any in-app purchase. Every download happens on the Apple App Store or Google Play under that store's own terms, payment system and refund policy. The pricing, in-app purchase information and ratings shown here are aggregated from publicly available data on those stores and may change at any time, so always confirm the current details on the official listing before installing.",
      "Use the category navigation to jump to a specific game genre, or browse our home page to see featured games and the latest additions to the directory. If a game you would like to see is missing, email hello@diginexa.store and we will consider adding it.",
    ],
    priority: "0.9", changefreq: "daily",
  },
  "/categories": {
    title: "App & Game Categories | Digi Nexa Store",
    h1: "Browse Apps & Games by Category",
    description: "Explore apps and games by category on Digi Nexa Store. 18 categories spanning Productivity, Education, Health & Fitness, Action Games and more — find exactly what you need.",
    bodyParagraphs: [
      "Our Digi Nexa Store directory is organised into eighteen categories covering both iOS and Android apps and games. Categories make discovery dramatically faster than scrolling through long lists or guessing at search terms. Pick the category that matches what you need and you will see every relevant app or game we have catalogued, sorted by popularity and rating where available.",
      "App categories on Digi Nexa Store include Productivity for note-taking, calendars, task managers and document tools; Education for language learning, flashcards, kids' learning and study aids; Finance for budgeting, investing, banking and crypto; Health and Fitness for workouts, nutrition, sleep and wellness; Entertainment for streaming, e-readers and podcasts; Social for messaging, dating and community apps; Photography for camera and editing tools; Music for streaming and creation; Lifestyle for shopping, dating and habits; Business for collaboration; Travel for booking and navigation; News for current events; Shopping for online retail; and Utilities for system tools and converters.",
      "Game categories include Action for shooters, brawlers and adventure titles; Puzzle for match-three, word and logic challenges; Casual for relaxing tap-to-play and idle games; Arcade for retro-style scrolling action; Racing for driving and karting; Sports for football, basketball and other simulations; and RPG for turn-based and real-time role-playing adventures.",
      "Every category page lists each app or game we track in that area, with a short description and a link straight to its official Apple App Store or Google Play listing. Click any category below to start exploring, or visit our home page for featured highlights from across the entire directory.",
    ],
    priority: "0.8", changefreq: "weekly",
  },
  "/about": {
    title: "About Digi Nexa Store – App Discovery Platform",
    h1: "About Digi Nexa Store: An Independent App Discovery Directory",
    description: "Learn about Digi Nexa Store — an independent app discovery directory that aggregates publicly available iOS and Android app information from the Apple App Store and Google Play.",
    bodyParagraphs: [
      "Digi Nexa Store is an independent, United States-based app discovery directory. We aggregate publicly available information about iOS and Android apps from the Apple App Store and Google Play, organise it by category and present it in a clean, easy-to-browse interface so users can find what they need without sifting through ads, sponsored placements or fake reviews.",
      "We are not affiliated with Apple, Google or any of the developers listed on the site. We do not sell, distribute or host any apps. We do not process any payments. Every download link on Digi Nexa Store points to the official Apple App Store or Google Play product page, where the install happens under that store's terms and refund policy. Our role is purely editorial and organisational — we curate, categorise and link.",
      "Our mission is simple: help people discover great mobile apps and games without the noise of advertising-driven rankings, fake five-star reviews or pay-to-play promotional placements. We list apps because they are useful, popular or notable in their category, not because anyone paid us to feature them. The directory currently catalogues more than four thousand five hundred apps and games across eighteen categories, and we add new listings regularly.",
      "Digi Nexa Store is funded through display advertising and may include affiliate links to the Apple App Store or Google Play that pay a small commission at no extra cost to the user. Read our Advertising Disclosure for more on how that works. For questions, suggestions, corrections or takedown requests, contact us at hello@diginexa.store.",
    ],
    priority: "0.6", changefreq: "monthly",
  },
  "/contact": {
    title: "Contact Digi Nexa Store | Get in Touch",
    h1: "Contact the Digi Nexa Store Team",
    description: "Have a question, suggestion, or want to recommend an app? Get in touch with the Digi Nexa Store team. We read every message.",
    bodyParagraphs: [
      "Have a question, a suggestion, an app or game you would like us to add to the Digi Nexa Store directory, or a correction to report on an existing listing? We would love to hear from you. Email us at hello@diginexa.store and a member of the editorial team will read your message. We respond to most enquiries within two United States business days.",
      "When emailing, please include as much context as possible. For app submissions, include the official Apple App Store or Google Play link, the developer name, the category you think it belongs in and a one-sentence description of what the app does. For corrections to an existing listing, include the listing URL on diginexastore.com and what specifically needs to be updated, such as the developer name, category, pricing or short description.",
      "For takedown requests or copyright concerns, please include the specific listing URL, the reason for your request and any supporting documentation such as proof that you are the rights holder. We take rights complaints seriously and will action verified requests promptly. For privacy-related requests under the CCPA, including requests to know what data we hold or to delete personal information, see our California Privacy Rights page for the full process and response time.",
      "For advertising enquiries, including potential partnership opportunities or media buying questions, please use the same email address and add the word ADVERTISING to the subject line so the message is routed to the right inbox. Press, journalism and research enquiries are also welcome — we are happy to share information about how the directory is built and curated.",
    ],
    priority: "0.5", changefreq: "monthly",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Digi Nexa Store",
    h1: "Digi Nexa Store Privacy Policy: How We Handle Your Data",
    description: "Read Digi Nexa Store's Privacy Policy. Learn how we collect, use, and protect your data — including CCPA rights, cookie usage, and third-party disclosures.",
    bodyParagraphs: [
      "This Privacy Policy explains what information Digi Nexa Store collects when you visit the site, how we use it and the choices you have. We are committed to collecting only the data we need to operate the directory and improve the user experience. We do not sell your personal information to third parties for monetary consideration.",
      "When you visit Digi Nexa Store we automatically receive standard log data sent by your browser, including IP address, user agent, referring page, the page you requested and the time of the request. We use this data for security, abuse prevention and to understand how the directory is used. We use a privacy-respecting analytics service to count page views, identify popular categories and improve site performance. Analytics data is aggregated and does not personally identify visitors.",
      "We use cookies and similar technologies to make the site work and to support advertising. Essential cookies remember your cookie consent choices and any in-session preferences. Advertising cookies, set by our partners including Microsoft Advertising and Google, may be used to show interest-based ads. You can control non-essential cookies through the cookie banner or your browser settings — see our Cookie Policy for the full list and Advertising Disclosure for details on opting out of personalised advertising.",
      "California residents have additional rights under the California Consumer Privacy Act and the California Privacy Rights Act, including the right to know what personal information we hold, the right to delete it and the right to opt out of any sale or sharing of personal information. See our California Privacy Rights page for the full process. To exercise any privacy right, contact us at hello@diginexa.store and we will respond within forty-five days.",
    ],
    priority: "0.4", changefreq: "yearly",
  },
  "/terms-of-service": {
    title: "Terms of Service | Digi Nexa Store",
    h1: "Digi Nexa Store Terms of Service",
    description: "Read Digi Nexa Store's Terms of Service. Understand the rules, limitations, and your rights when using the Digi Nexa Store app discovery platform.",
    bodyParagraphs: [
      "These Terms of Service govern your use of the Digi Nexa Store website and app discovery directory at diginexastore.com. By using the site you agree to these terms. If you do not agree, please do not use the directory. We may update these terms from time to time and will post the current version at this URL.",
      "Digi Nexa Store is a discovery directory only. We do not sell apps, host downloads or process payments. All app and game downloads happen on the Apple App Store, Google Play or other official third-party stores under those stores' own terms, refund policies and payment systems. The pricing, ratings, screenshots and feature lists shown on our listings are aggregated from publicly available data and may not always reflect the current state on the official stores — always verify on the store page before installing or paying.",
      "You agree to use Digi Nexa Store only for lawful purposes. You agree not to scrape, copy or republish bulk listings without permission, not to attempt to interfere with the operation of the site, not to upload or transmit malicious content and not to misrepresent your identity. We reserve the right to block or restrict access to anyone who violates these terms.",
      "Digi Nexa Store is provided on an as-is basis without warranty of any kind, express or implied. We do not warrant that the directory will be error-free, uninterrupted or that any specific app information is current or accurate. To the maximum extent permitted by law, we are not liable for any indirect, incidental or consequential damages arising from use of the site. These terms are governed by the laws of the State of Delaware, United States, and any disputes will be resolved in the state or federal courts located there.",
    ],
    priority: "0.4", changefreq: "yearly",
  },
  "/cookie-policy": {
    title: "Cookie Policy | Digi Nexa Store",
    h1: "Digi Nexa Store Cookie Policy: How We Use Cookies",
    description: "Digi Nexa Store's Cookie Policy explains what cookies we use, why we use them, and how you can control them — including essential, analytics, and advertising cookies.",
    bodyParagraphs: [
      "This Cookie Policy explains how Digi Nexa Store uses cookies and similar technologies, what each type does and how you can control them. A cookie is a small text file that a website stores on your device so that the site can remember your visit, preferences or other useful information. Similar technologies include local storage, web beacons and pixel tags.",
      "We use essential cookies to make the directory work. These remember your cookie consent choice, keep your in-session navigation state and protect against abuse. Essential cookies cannot be disabled because the site would not function correctly without them. They do not track you across other websites and they do not carry advertising identifiers.",
      "We use analytics cookies to understand how visitors use Digi Nexa Store. These count page views, measure which categories and apps are most popular and help us identify performance issues. Analytics cookies are aggregated and do not identify individual visitors by name. We use a privacy-respecting analytics provider that does not share data with advertising networks.",
      "We use advertising cookies set by our partners including Microsoft Advertising and Google. These cookies may build a profile of your interests across websites so that the ads you see are more relevant. You can opt out of personalised advertising at any time through the cookie banner on Digi Nexa Store, your browser's privacy settings, the Digital Advertising Alliance opt-out page at aboutads.info or the Network Advertising Initiative opt-out page at networkadvertising.org. See our Advertising Disclosure for more on our advertising partners and how interest-based advertising works.",
    ],
    priority: "0.4", changefreq: "yearly",
  },
  "/ccpa-privacy-rights": {
    title: "California Privacy Rights (CCPA) | Digi Nexa Store",
    h1: "Your California Privacy Rights Under CCPA",
    description: "Digi Nexa Store's CCPA disclosure for California residents. Learn about your right to know, delete, and opt out of data sharing under the California Consumer Privacy Act.",
    bodyParagraphs: [
      "Under the California Consumer Privacy Act and the California Privacy Rights Act, California residents have specific rights regarding their personal information. This page explains what those rights are, what personal information Digi Nexa Store collects and how you can exercise your rights as a California resident.",
      "Your California rights include the right to know what categories and specific pieces of personal information we collect, use or share; the right to delete personal information we have collected from you; the right to correct inaccurate personal information; the right to opt out of the sale or sharing of personal information; the right to limit the use of sensitive personal information; and the right to non-discrimination for exercising any of these rights.",
      "Digi Nexa Store collects limited personal information including standard server log data such as IP address and user agent, anonymised analytics about how the directory is used, and any information you choose to send us by email. We do not sell personal information for monetary consideration. Our advertising partners may use cookies to deliver interest-based ads, which under California law can constitute sharing — you can opt out at any time through the cookie banner on the site or through industry tools like the Digital Advertising Alliance opt-out page.",
      "To exercise any California privacy right, email hello@diginexa.store with the subject line CCPA Request and describe the right you are exercising. We may need to verify your identity to process the request, typically by asking you to confirm details about your interactions with the site. We respond to verifiable consumer requests within forty-five days as required by California law and will not discriminate against you for exercising your rights.",
    ],
    priority: "0.4", changefreq: "yearly",
  },
  "/advertising-disclosure": {
    title: "Advertising Disclosure | Digi Nexa Store",
    h1: "Digi Nexa Store Advertising & Interest-Based Advertising Disclosure",
    description: "Digi Nexa Store uses interest-based advertising. Learn how our advertising partners collect data, how to opt out, and what controls you have over targeted ads.",
    bodyParagraphs: [
      "Digi Nexa Store displays advertising provided by third-party partners including Microsoft Advertising and Google. Advertising is how we fund the directory and keep all listings free to browse. This page explains how interest-based advertising works on the site, who our partners are and how you can opt out.",
      "Interest-based advertising means that the ads you see may be tailored to your likely interests based on your browsing activity across multiple websites, not just Digi Nexa Store. Our partners use cookies, mobile advertising identifiers and similar technologies to build a profile of likely interests, then use that profile to choose which ads to show. We do not share personally identifying information such as your name or email with advertising partners — the matching is done through anonymous identifiers.",
      "You can opt out of personalised advertising at any time. The fastest options are: use the cookie banner on Digi Nexa Store to decline non-essential cookies; use the Digital Advertising Alliance opt-out page at aboutads.info/choices to opt out of interest-based advertising from many networks at once; use the Network Advertising Initiative opt-out page at networkadvertising.org/choices; or change the privacy settings in your browser to block third-party cookies. On mobile, reset your advertising identifier and disable interest-based ads in your device's privacy settings.",
      "Some links on Digi Nexa Store to the Apple App Store or Google Play may be affiliate links that pay a small commission to us if you tap through and make a qualifying download. Affiliate links never change the price you pay or the app you receive — the App Store and Google Play handle all transactions and refunds. Affiliate participation does not influence which apps we list or how we describe them.",
    ],
    priority: "0.4", changefreq: "yearly",
  },
  "/disclaimer": {
    title: "Disclaimer | Digi Nexa Store",
    h1: "Digi Nexa Store Site Disclaimer",
    description: "Digi Nexa Store is an independent app discovery platform. Read our disclaimer about app information accuracy, third-party links, and affiliate relationships.",
    bodyParagraphs: [
      "Digi Nexa Store is an independent app and game discovery directory. This disclaimer explains the limits of the information we publish, our relationship to the developers and stores we link to and how to interpret the listings on diginexastore.com responsibly.",
      "We are not affiliated with Apple, Google or any of the developers listed on the site. App and game information including the name, developer, short description, screenshots, ratings, review counts, pricing, in-app purchase information and category is aggregated from publicly available sources, primarily the Apple App Store and Google Play. This information may not always be current. Pricing, ratings and availability can change at any time without notice on the official stores, so please always confirm the current details on the App Store or Google Play product page before downloading or paying.",
      "All trademarks, logos, app icons and brand names are the property of their respective owners. References to third-party companies and products are for identification and informational purposes only and do not imply any endorsement by those companies or partnership with Digi Nexa Store unless explicitly stated. Listing an app on Digi Nexa Store does not constitute endorsement, recommendation or any guarantee about quality, safety, security, performance or fitness for any particular purpose.",
      "Some links on our site may be affiliate links. If you tap through to the Apple App Store or Google Play and download a paid app, we may earn a small commission at no extra cost to you. Affiliate participation does not influence which apps we list or how we describe them. For corrections, takedown requests or other concerns, contact hello@diginexa.store.",
    ],
    priority: "0.4", changefreq: "yearly",
  },
  "/no-purchase-policy": {
    title: "No-Purchase Policy | Digi Nexa Store",
    h1: "Digi Nexa Store Does Not Sell Apps — No Purchases on This Site",
    description: "Digi Nexa Store is a free discovery platform only. We do not sell, distribute, or charge for any app or game. All purchases happen on official third-party stores.",
    bodyParagraphs: [
      "Digi Nexa Store is a free app and game discovery directory. We do not sell, distribute, host or process payments for any app or game. We do not charge any subscription fee, membership fee, access fee, listing fee or download fee. The directory is free to browse, free to search and free to use.",
      "Every app or game listed on Digi Nexa Store links directly to its official Apple App Store or Google Play product page. The actual download, whether free or paid, takes place on the official store under that store's terms, payment system and refund policy. If a listing on Digi Nexa Store shows a price, that figure is aggregated from public data on the official stores at the time we last updated the listing — Apple, Google and the developer set the actual price you pay at checkout, and the current figure may be different.",
      "Digi Nexa Store will never ask you to pay us, enter payment details on diginexastore.com or send money in any form to download an app or game. We do not have a checkout, a shopping cart, a payment form or a billing system. If you ever see a page on diginexastore.com that asks you to pay us for an app or game, treat it as fraudulent or compromised and report it to hello@diginexa.store immediately.",
      "Digi Nexa Store is funded through display advertising and may include affiliate links to the official stores that pay a small commission at no extra cost to the user. Affiliate participation does not change the price you pay or the app you receive. For details on how we make money see our Advertising Disclosure page, and for questions about a specific listing or to report a problem contact us at hello@diginexa.store.",
    ],
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
  { href: "/about", label: "About" },
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
  return `# Digi Nexa Store\n\n> Digi Nexa Store is a free, independent app discovery directory for iOS and Android. Browse 4,500+ apps and games organised across 18 categories. All download links go to the official Apple App Store and Google Play.\n\n## Main Pages\n\n- [Home](${SITE_URL}/): Discover apps and games by category.\n- [All Apps](${SITE_URL}/apps): Browse iOS and Android apps.\n- [All Games](${SITE_URL}/games): Browse mobile games.\n- [Categories](${SITE_URL}/categories): All 18 categories.\n- [About](${SITE_URL}/about): About Digi Nexa Store.\n- [Contact](${SITE_URL}/contact): Get in touch.\n\n## Categories\n\n${catLines}\n\n## Policies\n\n- [Privacy Policy](${SITE_URL}/privacy-policy)\n- [Terms of Service](${SITE_URL}/terms-of-service)\n- [Cookie Policy](${SITE_URL}/cookie-policy)\n- [CCPA Privacy Rights](${SITE_URL}/ccpa-privacy-rights)\n- [Advertising Disclosure](${SITE_URL}/advertising-disclosure)\n- [Disclaimer](${SITE_URL}/disclaimer)\n- [No-Purchase Policy](${SITE_URL}/no-purchase-policy)\n\n## Sitemap\n\n${SITE_URL}/sitemap.xml\n`;
}

// ─── Per-page renderers ──────────────────────────────────────────────────────

function renderStatic(routePath, meta, data) {
  let jsonLd;
  if (routePath === "/") {
    jsonLd = [
      { "@context": "https://schema.org", "@type": "Organization", name: BRAND, url: SITE_URL, logo: `${SITE_URL}/favicon.png`, contactPoint: { "@type": "ContactPoint", email: "hello@diginexa.store", contactType: "customer support" } },
      { "@context": "https://schema.org", "@type": "WebSite", name: BRAND, url: SITE_URL, inLanguage: "en-US", potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/apps?search={search_term_string}` }, "query-input": "required name=search_term_string" } },
    ];
  }
  const paragraphs = (meta.bodyParagraphs && meta.bodyParagraphs.length)
    ? meta.bodyParagraphs.map((p) => `<p>${esc(p)}</p>`).join("")
    : `<p>${esc(meta.body || "")}</p>`;
  return {
    canonicalPath: routePath,
    title: meta.title,
    description: meta.description,
    h1: meta.h1,
    bodyHtml: `${paragraphs}${categoriesNavHtml(data.categories)}${siteFooterHtml()}`,
    jsonLd,
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

function buildAppTitle(app, typeLabel) {
  // Always include #{id} suffix to guarantee uniqueness across truncated long names.
  // Format: "{name} – {category} {type} #{id} | DNS"
  const idTag = `#${app.id}`;
  const suffixFull = ` – ${app.category_name} ${typeLabel} ${idTag} | ${BRAND}`;
  const maxNameFull = 60 - suffixFull.length;
  if (maxNameFull >= 8) {
    const name = app.name.length <= maxNameFull ? app.name : app.name.slice(0, maxNameFull - 1).trimEnd() + "…";
    return `${name}${suffixFull}`;
  }
  // Fallback: shorter suffix without category
  const suffixShort = ` ${idTag} | ${BRAND}`;
  const maxNameShort = 60 - suffixShort.length;
  const name = app.name.length <= maxNameShort ? app.name : app.name.slice(0, maxNameShort - 1).trimEnd() + "…";
  return `${name}${suffixShort}`;
}

function renderApp(app, relatedApps) {
  const typeLabel = app.app_type === "game" ? "Game" : "App";
  const typeLower = typeLabel.toLowerCase();
  const title = buildAppTitle(app, typeLabel);
  const h1 = `${app.name} — ${app.category_name} ${typeLabel} for iOS & Android`;
  const ratingNum = Number(app.rating) || 0;
  const reviews = Number(app.review_count) || 0;
  const developer = app.developer || "Independent developer";
  const priceLabel = app.is_free ? "Free to download" : `$${Number(app.price || 0).toFixed(2)}`;

  // Unique meta description. Listing #ID goes FIRST so it cannot be truncated
  // away by the 160-char limit — guarantees uniqueness across all 4,565 apps.
  const description = trunc(
    `Listing #${app.id}: ${app.name} by ${developer} — a ${app.category_name} ${typeLower} for iOS and Android. ${priceLabel} on the App Store and Google Play.${ratingNum > 0 ? ` Rated ${ratingNum.toFixed(1)}/5${reviews > 0 ? ` by ${reviews.toLocaleString()}+ users` : ""}.` : ""} Browse on Digi Nexa Store.`,
    160
  );

  const longDesc = app.full_description || app.description || app.short_description || "";
  const shortDesc = app.short_description || "";

  const relatedHtml = relatedApps.length
    ? `<h2>More ${esc(app.category_name)} ${esc(typeLabel)}s</h2><ul>${relatedApps.map((r) => `<li><a href="/apps/${r.id}">${esc(r.name)}</a>${r.developer ? ` by ${esc(r.developer)}` : ""}</li>`).join("")}</ul>`
    : "";

  // Boilerplate that varies with name/developer/category to add useful word count
  // without producing duplicate content (each fragment includes the unique app name).
  const overview = longDesc
    ? `<h2>About ${esc(app.name)}</h2><p>${esc(longDesc)}</p>`
    : `<h2>About ${esc(app.name)}</h2><p>${esc(app.name)} is a ${esc(app.category_name)} ${esc(typeLower)} published by ${esc(developer)} for iOS and Android devices. ${shortDesc ? esc(shortDesc) + " " : ""}It is listed in the ${esc(app.category_name)} section of the Digi Nexa Store directory and links directly to its official Apple App Store and Google Play pages so you can review screenshots, permissions and developer details before installing.</p>`;

  const howToInstall = `<h2>How to download ${esc(app.name)}</h2><p>To install ${esc(app.name)}, tap the official store link on this page. iPhone and iPad users will be taken to the Apple App Store; Android users will be taken to the Google Play Store. Digi Nexa Store does not host the ${esc(typeLower)} or process any payment — every download happens on the official store under that store's terms. ${app.is_free ? `${esc(app.name)} is currently listed as free to download, although the developer may offer optional in-app purchases.` : `${esc(app.name)} is currently listed at ${priceLabel} on the official stores.`}</p>`;

  const safety = `<h2>About the developer</h2><p>${esc(app.name)} is published by ${esc(developer)}. Permissions, age ratings, in-app purchase information and the full privacy policy are shown on the official Apple App Store and Google Play listings — please review them before installing. Digi Nexa Store is an independent directory and is not affiliated with ${esc(developer)}, Apple or Google. We list ${esc(app.name)} because it is publicly available in the ${esc(app.category_name)} section of those stores; we do not receive payment from ${esc(developer)} to feature this listing.</p>`;

  const faq = `<h2>${esc(app.name)} questions and answers</h2>
    <h3>Is ${esc(app.name)} free?</h3>
    <p>${esc(app.name)} is currently listed on Digi Nexa Store as ${esc(priceLabel.toLowerCase())}. The official App Store and Google Play pages show the most up-to-date pricing, including any optional in-app purchases or subscription tiers offered by ${esc(developer)}.</p>
    <h3>What category is ${esc(app.name)} in?</h3>
    <p>${esc(app.name)} is catalogued in the ${esc(app.category_name)} category on Digi Nexa Store, which groups together other ${esc(app.category_name.toLowerCase())} ${esc(typeLower)}s for iOS and Android so you can compare similar options side by side.</p>
    <h3>Where do I download ${esc(app.name)}?</h3>
    <p>${esc(app.name)} is downloaded from the official Apple App Store on iPhone and iPad, or from the Google Play Store on Android. Digi Nexa Store does not host or distribute the ${esc(typeLower)} — we only link to the official store listings published by ${esc(developer)}.</p>`;

  const facts = `<h2>${esc(app.name)} at a glance</h2><ul>
    <li><strong>Name:</strong> ${esc(app.name)}</li>
    <li><strong>Developer:</strong> ${esc(developer)}</li>
    <li><strong>Category:</strong> <a href="/categories/${esc(app.category_slug || "")}">${esc(app.category_name || "")}</a></li>
    <li><strong>Type:</strong> ${esc(typeLabel)} for iOS &amp; Android</li>
    <li><strong>Price:</strong> ${esc(priceLabel)}</li>
    ${ratingNum > 0 ? `<li><strong>Rating:</strong> ${ratingNum.toFixed(1)}/5${reviews > 0 ? ` from ${reviews.toLocaleString()} reviews` : ""}</li>` : ""}
    <li><strong>Listing ID:</strong> #${app.id}</li>
  </ul>`;

  const body = `
    ${shortDesc ? `<p>${esc(shortDesc)}</p>` : ""}
    ${facts}
    ${overview}
    ${howToInstall}
    ${safety}
    ${faq}
    ${relatedHtml}
    <p><a href="/categories/${esc(app.category_slug || "")}">Back to ${esc(app.category_name || "category")}</a> · <a href="/${app.app_type === "game" ? "games" : "apps"}">All ${esc(typeLabel)}s</a></p>
    ${siteFooterHtml()}
  `;

  const canonicalUrl = `${SITE_URL}/apps/${app.id}`;
  // Absolute https image URL (Google requires absolute URLs in structured data)
  const rawIcon = (app.icon_url || "").trim();
  const imageUrl = rawIcon.startsWith("http") ? rawIcon : (rawIcon ? `${SITE_URL}${rawIcon.startsWith("/") ? "" : "/"}${rawIcon}` : null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": app.app_type === "game" ? "VideoGame" : "MobileApplication",
    name: app.name,
    url: canonicalUrl,
    description: shortDesc || description,
    applicationCategory: app.app_type === "game" ? "GameApplication" : "MobileApplication",
    operatingSystem: "iOS, Android",
    inLanguage: "en-US",
    author: { "@type": "Organization", name: developer },
    publisher: { "@type": "Organization", name: developer },
    ...(imageUrl ? { image: imageUrl } : {}),
    offers: {
      "@type": "Offer",
      price: app.is_free ? "0.00" : Number(app.price || 0).toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: canonicalUrl,
    },
  };
  // Note: aggregateRating intentionally omitted from JSON-LD.
  // Google requires a `review` field alongside aggregateRating, and we do not
  // have authentic individual review text to publish. Including aggregateRating
  // without `review` causes "Invalid structured data items" errors. The visible
  // rating is still shown in the page body for users.

  return { canonicalPath: `/apps/${app.id}`, title, description, h1, bodyHtml: body, jsonLd };
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
      const sameCategory = (appsByCat.get(app.category_slug) || []).filter((a) => a.id !== app.id);
      // Pick up to 8 related apps deterministically (by id offset for variety)
      const related = sameCategory.slice(0, 8);
      const page = renderApp(app, related);
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
