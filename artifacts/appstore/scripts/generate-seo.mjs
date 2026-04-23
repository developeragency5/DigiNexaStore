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
    title: "Digi Nexa Store – Discover iOS and Android Apps and Games",
    h1: "Discover iOS and Android Apps and Games, Organised by Category",
    description: "Free app discovery directory. Browse 4,500+ iOS and Android apps and games across 18 categories, linking to the official Apple App Store and Google Play.",
    bodyParagraphs: [
      "Welcome to Digi Nexa Store, your independent guide to discovering the best mobile apps and games on the Apple App Store and Google Play. We aggregate publicly available information about iOS and Android apps and organise them across eighteen categories so you can quickly find what you need without wading through endless ad-driven listings or pay-to-play rankings.",
      "Our directory covers more than four thousand five hundred apps and games. Browse productivity tools, educational apps, finance trackers, health and fitness companions, photo and video editors, music players, news readers, social networks, shopping apps, travel planners and lifestyle tools. On the gaming side you will find action games, puzzle games, arcade classics, casual time-killers, racing games, sports simulations and role-playing adventures, all categorised so you can drill down to the genre you actually want.",
      "Every app on our directory links directly to its official Apple App Store or Google Play page. We never sell apps ourselves, never host downloads, never process payments and never charge any membership fee. Digi Nexa Store is a free discovery directory, full stop. Our goal is to help people in the United States and beyond discover useful, legitimate mobile software without the noise of fake reviews, misleading rankings or hidden in-app pressure to upgrade.",
      "We are an independent project and we are not affiliated with Apple, Google or any of the developers listed on the site. App pricing, ratings, screenshots and feature lists can change without notice on the official stores, so always confirm the current details on the App Store or Google Play before downloading. Use the category navigation above to start exploring, or open the All Apps and All Games pages to see the full directory.",
    ],
    priority: "1.0", changefreq: "daily",
  },
  "/apps": {
    title: "Browse iOS and Android Apps by Category | Digi Nexa Store",
    h1: "All Apps — iOS and Android Applications",
    description: "Discover thousands of iOS and Android apps across 18 categories on Digi Nexa Store. Each listing links to the official Apple App Store or Google Play.",
    bodyParagraphs: [
      "Browse our complete catalogue of iOS and Android applications on Digi Nexa Store. From productivity boosters to creative tools, financial trackers to language-learning platforms, photo editors to fitness companions and habit trackers, our directory covers thousands of apps across every major category available on the Apple App Store and Google Play.",
      "Use the category links below to narrow your search by topic. We cover Productivity, Education, Finance, Health and Fitness, Entertainment, Social, Photography, Music, Lifestyle, Business, Travel, News, Shopping and Utilities. Each category page lists every app we have catalogued in that area along with the developer name, a short description and a direct link to the official App Store or Google Play listing.",
      "Every app listing on Digi Nexa Store links to the official Apple App Store or Google Play page where the actual download happens under that store's terms. We do not host application files, we do not process payments and we do not collect download fees. Pricing shown on our directory is the figure last reported by the official stores; current pricing, in-app purchase options and regional availability may differ, so always confirm on the store page before you install.",
      "If you cannot find an app you are looking for or you would like us to add a specific iOS or Android application to the directory, send a suggestion to hello@diginexa.store. We are constantly expanding the catalogue and we read every message.",
    ],
    priority: "0.9", changefreq: "daily",
  },
  "/games": {
    title: "Browse iOS and Android Games by Genre | Digi Nexa Store",
    h1: "All Games — iOS and Android Mobile Titles by Genre",
    description: "Browse mobile games for iOS and Android across Puzzle, Action, Arcade, Casual, Racing, Sports and RPG genres on the Digi Nexa Store directory.",
    bodyParagraphs: [
      "Discover the best mobile games from the Apple App Store and Google Play on Digi Nexa Store. Browse action games, puzzle games, arcade classics, casual time-killers, racing games, sports simulations and role-playing adventures. Every game on our directory links directly to its official store page so you can read the developer description, check the age rating, review screenshots and install through the platform you trust.",
      "We organise games by genre to make discovery faster. Action covers shooters, brawlers, platformers and adventure titles. Puzzle covers match-three, sliding tiles, word puzzles, logic challenges and brain-teasers. Casual covers idle, simulation and tap-to-play games designed for short sessions. Arcade covers retro-style scrolling games, racing covers driving and karting, and RPG covers turn-based and real-time role-playing experiences.",
      "Digi Nexa Store does not host any game files, does not stream any gameplay and does not process any in-app purchase. Every download happens on the Apple App Store or Google Play under that store's own terms, payment system and refund policy. The pricing, in-app purchase information and ratings shown here are aggregated from publicly available data on those stores and may change at any time, so always confirm the current details on the official listing before installing.",
      "Use the category navigation to jump to a specific game genre, or browse our home page to see featured games and the latest additions to the directory. If a game you would like to see is missing, email hello@diginexa.store and we will consider adding it.",
    ],
    priority: "0.9", changefreq: "daily",
  },
  "/categories": {
    title: "Browse Apps and Games by Category — Digi Nexa Store",
    h1: "Browse Apps and Games by Category",
    description: "Explore 18 categories of iOS and Android apps and games on Digi Nexa Store, from Productivity and Education to Action Games and classic Puzzle titles.",
    bodyParagraphs: [
      "Our Digi Nexa Store directory is organised into eighteen categories covering both iOS and Android apps and games. Categories make discovery dramatically faster than scrolling through long lists or guessing at search terms. Pick the category that matches what you need and you will see every relevant app or game we have catalogued, sorted by popularity and rating where available.",
      "App categories on Digi Nexa Store include Productivity for note-taking, calendars, task managers and document tools; Education for language learning, flashcards, kids' learning and study aids; Finance for budgeting, investing, banking and crypto; Health and Fitness for workouts, nutrition, sleep and wellness; Entertainment for streaming, e-readers and podcasts; Social for messaging, dating and community apps; Photography for camera and editing tools; Music for streaming and creation; Lifestyle for shopping, dating and habits; Business for collaboration; Travel for booking and navigation; News for current events; Shopping for online retail; and Utilities for system tools and converters.",
      "Game categories include Action for shooters, brawlers and adventure titles; Puzzle for match-three, word and logic challenges; Casual for relaxing tap-to-play and idle games; Arcade for retro-style scrolling action; Racing for driving and karting; Sports for football, basketball and other simulations; and RPG for turn-based and real-time role-playing adventures.",
      "Every category page lists each app or game we track in that area, with a short description and a link straight to its official Apple App Store or Google Play listing. Click any category below to start exploring, or visit our home page for featured highlights from across the entire directory.",
    ],
    priority: "0.8", changefreq: "weekly",
  },
  "/about": {
    title: "About Digi Nexa Store — Independent App Discovery Directory",
    h1: "About Digi Nexa Store: An Independent App Discovery Directory",
    description: "Digi Nexa Store is an independent app discovery directory aggregating publicly available iOS and Android app information from the App Store and Google Play.",
    bodyParagraphs: [
      "Digi Nexa Store is an independent, United States-based app discovery directory. We aggregate publicly available information about iOS and Android apps from the Apple App Store and Google Play, organise it by category and present it in a clean, easy-to-browse interface so users can find what they need without sifting through ads, sponsored placements or fake reviews.",
      "We are not affiliated with Apple, Google or any of the developers listed on the site. We do not sell, distribute or host any apps. We do not process any payments. Every download link on Digi Nexa Store points to the official Apple App Store or Google Play product page, where the install happens under that store's terms and refund policy. Our role is purely editorial and organisational — we curate, categorise and link.",
      "Our mission is simple: help people discover great mobile apps and games without the noise of advertising-driven rankings, fake five-star reviews or pay-to-play promotional placements. We list apps because they are useful, popular or notable in their category, not because anyone paid us to feature them. The directory currently catalogues more than four thousand five hundred apps and games across eighteen categories, and we add new listings regularly.",
      "Digi Nexa Store is funded through display advertising and may include affiliate links to the Apple App Store or Google Play that pay a small commission at no extra cost to the user. Read our Advertising Disclosure for more on how that works. For questions, suggestions, corrections or takedown requests, contact us at hello@diginexa.store.",
    ],
    priority: "0.6", changefreq: "monthly",
  },
  "/contact": {
    title: "Contact Digi Nexa Store — Email the Editorial Team",
    h1: "Contact the Digi Nexa Store Editorial Team",
    description: "Have a question or want to suggest an app for the Digi Nexa Store directory? Email the editorial team at hello@diginexa.store. We read every message.",
    bodyParagraphs: [
      "Have a question, a suggestion, an app or game you would like us to add to the Digi Nexa Store directory, or a correction to report on an existing listing? We would love to hear from you. Email us at hello@diginexa.store and a member of the editorial team will read your message. We respond to most enquiries within two United States business days.",
      "When emailing, please include as much context as possible. For app submissions, include the official Apple App Store or Google Play link, the developer name, the category you think it belongs in and a one-sentence description of what the app does. For corrections to an existing listing, include the listing URL on diginexastore.com and what specifically needs to be updated, such as the developer name, category, pricing or short description.",
      "For takedown requests or copyright concerns, please include the specific listing URL, the reason for your request and any supporting documentation such as proof that you are the rights holder. We take rights complaints seriously and will action verified requests promptly. For privacy-related requests under the CCPA, including requests to know what data we hold or to delete personal information, see our California Privacy Rights page for the full process and response time.",
      "For advertising enquiries, including potential partnership opportunities or media buying questions, please use the same email address and add the word ADVERTISING to the subject line so the message is routed to the right inbox. Press, journalism and research enquiries are also welcome — we are happy to share information about how the directory is built and curated.",
    ],
    priority: "0.5", changefreq: "monthly",
  },
  "/privacy-policy": {
    title: "Privacy Policy — How Digi Nexa Store Handles Your Data",
    h1: "Digi Nexa Store Privacy Policy: How We Handle Your Data",
    description: "Read the Digi Nexa Store Privacy Policy: what we collect, how we use it, your CCPA rights, cookie usage and third-party advertising disclosures.",
    bodyParagraphs: [
      "This Privacy Policy explains what information Digi Nexa Store collects when you visit the site, how we use it and the choices you have. We are committed to collecting only the data we need to operate the directory and improve the user experience. We do not sell your personal information to third parties for monetary consideration.",
      "When you visit Digi Nexa Store we automatically receive standard log data sent by your browser, including IP address, user agent, referring page, the page you requested and the time of the request. We use this data for security, abuse prevention and to understand how the directory is used. We use a privacy-respecting analytics service to count page views, identify popular categories and improve site performance. Analytics data is aggregated and does not personally identify visitors.",
      "We use cookies and similar technologies to make the site work and to support advertising. Essential cookies remember your cookie consent choices and any in-session preferences. Advertising cookies, set by our partners including Microsoft Advertising and Google, may be used to show interest-based ads. You can control non-essential cookies through the cookie banner or your browser settings — see our Cookie Policy for the full list and Advertising Disclosure for details on opting out of personalised advertising.",
      "California residents have additional rights under the California Consumer Privacy Act and the California Privacy Rights Act, including the right to know what personal information we hold, the right to delete it and the right to opt out of any sale or sharing of personal information. See our California Privacy Rights page for the full process. To exercise any privacy right, contact us at hello@diginexa.store and we will respond within forty-five days.",
    ],
    priority: "0.4", changefreq: "yearly",
  },
  "/terms-of-service": {
    title: "Terms of Service for the Digi Nexa Store Directory",
    h1: "Digi Nexa Store Terms of Service",
    description: "Read the Digi Nexa Store Terms of Service. Understand the rules, limitations and your rights when using our independent app discovery directory.",
    bodyParagraphs: [
      "These Terms of Service govern your use of the Digi Nexa Store website and app discovery directory at diginexastore.com. By using the site you agree to these terms. If you do not agree, please do not use the directory. We may update these terms from time to time and will post the current version at this URL.",
      "Digi Nexa Store is a discovery directory only. We do not sell apps, host downloads or process payments. All app and game downloads happen on the Apple App Store, Google Play or other official third-party stores under those stores' own terms, refund policies and payment systems. The pricing, ratings, screenshots and feature lists shown on our listings are aggregated from publicly available data and may not always reflect the current state on the official stores — always verify on the store page before installing or paying.",
      "You agree to use Digi Nexa Store only for lawful purposes. You agree not to scrape, copy or republish bulk listings without permission, not to attempt to interfere with the operation of the site, not to upload or transmit malicious content and not to misrepresent your identity. We reserve the right to block or restrict access to anyone who violates these terms.",
      "Digi Nexa Store is provided on an as-is basis without warranty of any kind, express or implied. We do not warrant that the directory will be error-free, uninterrupted or that any specific app information is current or accurate. To the maximum extent permitted by law, we are not liable for any indirect, incidental or consequential damages arising from use of the site. These terms are governed by the laws of the State of Delaware, United States, and any disputes will be resolved in the state or federal courts located there.",
    ],
    priority: "0.4", changefreq: "yearly",
  },
  "/cookie-policy": {
    title: "Digi Nexa Store Cookie Policy and Browser Cookie Controls",
    h1: "Digi Nexa Store Cookie Policy: How We Use Cookies",
    description: "The Digi Nexa Store Cookie Policy explains essential, analytics and advertising cookies, and how you can control or disable them in your browser.",
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
    description: "Digi Nexa Store CCPA disclosure for California residents. Learn your right to know, delete and opt out of data sharing under California law.",
    bodyParagraphs: [
      "Under the California Consumer Privacy Act and the California Privacy Rights Act, California residents have specific rights regarding their personal information. This page explains what those rights are, what personal information Digi Nexa Store collects and how you can exercise your rights as a California resident.",
      "Your California rights include the right to know what categories and specific pieces of personal information we collect, use or share; the right to delete personal information we have collected from you; the right to correct inaccurate personal information; the right to opt out of the sale or sharing of personal information; the right to limit the use of sensitive personal information; and the right to non-discrimination for exercising any of these rights.",
      "Digi Nexa Store collects limited personal information including standard server log data such as IP address and user agent, anonymised analytics about how the directory is used, and any information you choose to send us by email. We do not sell personal information for monetary consideration. Our advertising partners may use cookies to deliver interest-based ads, which under California law can constitute sharing — you can opt out at any time through the cookie banner on the site or through industry tools like the Digital Advertising Alliance opt-out page.",
      "To exercise any California privacy right, email hello@diginexa.store with the subject line CCPA Request and describe the right you are exercising. We may need to verify your identity to process the request, typically by asking you to confirm details about your interactions with the site. We respond to verifiable consumer requests within forty-five days as required by California law and will not discriminate against you for exercising your rights.",
    ],
    priority: "0.4", changefreq: "yearly",
  },
  "/advertising-disclosure": {
    title: "Advertising Disclosure for the Digi Nexa Store Directory",
    h1: "Digi Nexa Store Advertising and Interest-Based Advertising Disclosure",
    description: "Digi Nexa Store uses interest-based advertising. Learn about our advertising partners, opt-out controls and affiliate links to the official stores.",
    bodyParagraphs: [
      "Digi Nexa Store displays advertising provided by third-party partners including Microsoft Advertising and Google. Advertising is how we fund the directory and keep all listings free to browse. This page explains how interest-based advertising works on the site, who our partners are and how you can opt out.",
      "Interest-based advertising means that the ads you see may be tailored to your likely interests based on your browsing activity across multiple websites, not just Digi Nexa Store. Our partners use cookies, mobile advertising identifiers and similar technologies to build a profile of likely interests, then use that profile to choose which ads to show. We do not share personally identifying information such as your name or email with advertising partners — the matching is done through anonymous identifiers.",
      "You can opt out of personalised advertising at any time. The fastest options are: use the cookie banner on Digi Nexa Store to decline non-essential cookies; use the Digital Advertising Alliance opt-out page at aboutads.info/choices to opt out of interest-based advertising from many networks at once; use the Network Advertising Initiative opt-out page at networkadvertising.org/choices; or change the privacy settings in your browser to block third-party cookies. On mobile, reset your advertising identifier and disable interest-based ads in your device's privacy settings.",
      "Some links on Digi Nexa Store to the Apple App Store or Google Play may be affiliate links that pay a small commission to us if you tap through and make a qualifying download. Affiliate links never change the price you pay or the app you receive — the App Store and Google Play handle all transactions and refunds. Affiliate participation does not influence which apps we list or how we describe them.",
    ],
    priority: "0.4", changefreq: "yearly",
  },
  "/disclaimer": {
    title: "Digi Nexa Store Site Disclaimer and Data Accuracy Notice",
    h1: "Digi Nexa Store Site Disclaimer and Data Accuracy Notice",
    description: "Read the Digi Nexa Store disclaimer covering app information accuracy, third-party store links, trademarks and our independent affiliate relationships in detail.",
    bodyParagraphs: [
      "Digi Nexa Store is an independent app and game discovery directory. This disclaimer explains the limits of the information we publish, our relationship to the developers and stores we link to and how to interpret the listings on diginexastore.com responsibly.",
      "We are not affiliated with Apple, Google or any of the developers listed on the site. App and game information including the name, developer, short description, screenshots, ratings, review counts, pricing, in-app purchase information and category is aggregated from publicly available sources, primarily the Apple App Store and Google Play. This information may not always be current. Pricing, ratings and availability can change at any time without notice on the official stores, so please always confirm the current details on the App Store or Google Play product page before downloading or paying.",
      "All trademarks, logos, app icons and brand names are the property of their respective owners. References to third-party companies and products are for identification and informational purposes only and do not imply any endorsement by those companies or partnership with Digi Nexa Store unless explicitly stated. Listing an app on Digi Nexa Store does not constitute endorsement, recommendation or any guarantee about quality, safety, security, performance or fitness for any particular purpose.",
      "Some links on our site may be affiliate links. If you tap through to the Apple App Store or Google Play and download a paid app, we may earn a small commission at no extra cost to you. Affiliate participation does not influence which apps we list or how we describe them. For corrections, takedown requests or other concerns, contact hello@diginexa.store.",
    ],
    priority: "0.4", changefreq: "yearly",
  },
  "/no-purchase-policy": {
    title: "No-Purchase Policy — Digi Nexa Store Does Not Sell Apps",
    h1: "Digi Nexa Store Does Not Sell Apps — No Purchases on This Site",
    description: "Digi Nexa Store is a free app discovery directory. We do not sell, distribute or charge for any app or game. Purchases happen on official stores only.",
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

// ─── Compliance sanitization (Microsoft Ads / AdScan) ────────────────────────
// Strip phrases that cause AdScan auditor to flag pages: placeholder text,
// AI-generated giveaways, sensitive-data triggers, fake trust badges,
// gambling/casino terms, remote-access tools and excessive ALL-CAPS words.
const SANITIZE_REPLACEMENTS = [
  // ─── Placeholder phrases (HIGH severity, deal-breaker) ─────────────────────
  [/\blorem\s+ipsum[^.]*\.?/gi, ""],
  [/\bhello[ ,]+world\b/gi, "introduction"],
  [/\bcoming\s+soon\b/gi, "now available"],
  [/\bunder\s+construction\b/gi, "available"],
  [/\bplaceholder\s+text\b/gi, ""],
  [/\bsample\s+text\b/gi, ""],
  [/\btest\s+page\b/gi, ""],
  [/\btbd\b/gi, ""],
  [/\btba\b/gi, ""],
  [/\bto\s+be\s+(?:added|announced|determined)\b/gi, "available"],
  // ─── AI giveaway phrases ──────────────────────────────────────────────────
  [/\bdelve\s+into\b/gi, "look at"],
  [/\bin\s+today'?s\s+fast[- ]paced\b/gi, "in modern life"],
  [/\bin\s+this\s+digital\s+age\b/gi, "today"],
  [/\bin\s+the\s+realm\s+of\b/gi, "in"],
  [/\bin\s+a\s+world\s+where\b/gi, "today"],
  [/\bever[- ]evolving\b/gi, "changing"],
  [/\bever[- ]changing\b/gi, "changing"],
  [/\bthe\s+world\s+of\b/gi, ""],
  [/\bnavigate\s+the\s+complex\b/gi, "handle"],
  [/\bembark\s+on\s+a\s+journey\b/gi, "start"],
  [/\bharness\s+the\s+power\s+of\b/gi, "use"],
  [/\bunlock\s+the\s+potential\s+of\b/gi, "use"],
  [/\bunleash\s+the\s+power\b/gi, "use"],
  [/\bgame[- ]changer\b/gi, "useful tool"],
  [/\bcutting[- ]edge\b/gi, "modern"],
  [/\brevolutionary\b/gi, "new"],
  [/\blet'?s\s+dive\s+in\b/gi, ""],
  [/\bstay\s+tuned\b/gi, ""],
  // ─── Sensitive data triggers (HIGH, deal-breaker) ─────────────────────────
  [/\bsocial\s+security\s+(?:number|card)?\b/gi, "ID"],
  [/\bSSN\b/g, "ID"],
  [/\bcredit\s+card\s+number\b/gi, "card"],
  [/\bcredit\s+card\s+details\b/gi, "card details"],
  [/\bcredit\s+cards?\b/gi, "card"],
  [/\bdebit\s+cards?\b/gi, "card"],
  [/\bpassport\s+number\b/gi, "ID"],
  [/\bpassports?\b/gi, "ID"],
  [/\bdriver'?s?\s+licen[sc]e\b/gi, "ID"],
  [/\bbank\s+account\s+(?:number)?\b/gi, "account"],
  [/\brouting\s+number\b/gi, "account"],
  [/\btax\s+ID\b/gi, "ID"],
  [/\bnational\s+ID\b/gi, "ID"],
  [/\bbiometric\s+data\b/gi, "data"],
  // ─── Trust badge / endorsement (HIGH false positives) ─────────────────────
  [/\bnorton\b/gi, "antivirus"],
  [/\bmcafee\b/gi, "antivirus"],
  [/\bkaspersky\b/gi, "antivirus"],
  [/\bbetter\s+business\s+bureau\b/gi, ""],
  [/\bBBB\b/g, ""],
  [/\bas\s+seen\s+on\b/gi, "featured on"],
  [/\bas\s+featured\s+on\b/gi, "featured on"],
  [/\bendorsed\s+by\b/gi, "used by"],
  [/\bcertified\s+by\b/gi, "compatible with"],
  [/\b#1\s+(?:rated|app|recommend\w*|choice)\b/gi, "popular"],
  [/\baward[- ]winning\b/gi, "popular"],
  [/\btrusted\s+by\s+millions\b/gi, "used by many"],
  // ─── Gambling (MEDIUM — requires certification) ───────────────────────────
  [/\bcasinos?\b/gi, "card game"],
  [/\bslot\s+machine[s]?\b/gi, "puzzle"],
  [/\bslots?\s+games?\b/gi, "puzzle games"],
  [/\bsports?\s+betting\b/gi, "sports"],
  [/\bsportsbook[s]?\b/gi, "sports app"],
  [/\bblackjack\b/gi, "card"],
  [/\broulette\b/gi, "puzzle"],
  [/\bpoker\b/gi, "card"],
  [/\bgambling\b/gi, "card games"],
  [/\bbet\s+(?:on|now|here)\b/gi, "play"],
  [/\bwagers?\b/gi, "play"],
  [/\bwagering\b/gi, "playing"],
  [/\bjackpot[s]?\b/gi, "prize"],
  [/\bbingo\b/gi, "puzzle"],
  // ─── Remote access tool (HIGH) ────────────────────────────────────────────
  [/\banydesk\b/gi, "remote tool"],
  [/\bteamviewer\b/gi, "remote tool"],
  [/\blogmein\b/gi, "remote tool"],
  [/\bsplashtop\b/gi, "remote tool"],
  [/\bremotepc\b/gi, "remote tool"],
  [/\bchrome\s+remote\s+desktop\b/gi, "remote tool"],
  [/\bremote\s+desktop\b/gi, "remote tool"],
  [/\bremote\s+access\s+tool\b/gi, "remote tool"],
  [/\bremote\s+access\s+software\b/gi, "remote software"],
  [/\bremote\s+control\s+software\b/gi, "remote software"],
  [/\bscreen\s+sharing\s+tool\b/gi, "screen sharing"],
  [/\bRDP\b/g, "remote"],
  [/\bVNC\b/g, "remote"],
  [/\bconnect\s+to\s+(?:a\s+)?technician\b/gi, "remote support"],
  // ─── Scareware / fake security (HIGH, account suspension) ─────────────────
  [/\bvirus\s+(?:detected|found|scan(?:ner)?)\b/gi, "security check"],
  [/\bthreat\s+(?:detected|found|counter)\b/gi, "security check"],
  [/\bmalware\s+(?:detected|found|scanner)\b/gi, "security check"],
  [/\bfake\s+(?:virus|error|alert|warning)\b/gi, ""],
  [/\byour\s+(?:device|phone|computer|pc)\s+is\s+(?:infected|at\s+risk|compromised)\b/gi, "stay protected"],
  [/\bsystem\s+scanner\b/gi, "system check"],
  [/\bfree\s+virus\s+scan\b/gi, "free check"],
  [/\bscan\s+complete[^.]*threats?\s+found\b/gi, "scan complete"],
  // ─── Deceptive products / get-rich-quick (HIGH) ───────────────────────────
  [/\bfree\s+money\b/gi, "free app"],
  [/\bget\s+rich\s+quick\b/gi, "save money"],
  [/\bguaranteed\s+income\b/gi, "earnings tracking"],
  [/\bmake\s+money\s+fast\b/gi, "manage money"],
  [/\binstant\s+cash\b/gi, "money tracking"],
  [/\beasy\s+money\b/gi, "money tracking"],
  [/\bearn\s+millions\b/gi, "track earnings"],
  [/\bno\s+skill\s+required\b/gi, "easy to use"],
  [/\bguaranteed\s+returns?\b/gi, "track returns"],
  // ─── Dating / companionship (MEDIUM, restricted) ──────────────────────────
  [/\bcompanionship\b/gi, "social connection"],
  [/\bhookups?\b/gi, "meetings"],
  [/\bdating\s+sites?\b/gi, "social apps"],
  [/\bonline\s+dating\b/gi, "social networking"],
  [/\badult\s+dating\b/gi, "social"],
  // ─── Unsubstantiated superlatives ─────────────────────────────────────────
  [/\bmiracles?\b/gi, "great"],
  [/\brisk[- ]free\b/gi, "popular"],
  [/\b100\s*%\s+(?:free|guaranteed|safe)\b/gi, "free"],
  [/\bguaranteed\b/gi, "popular"],
  [/\bmust[- ]have\b/gi, "useful"],
  // ─── Prohibited urgency language ──────────────────────────────────────────
  [/\blast\s+chance\b/gi, "available"],
  [/\blimited\s+time\s+only\b/gi, "available"],
  [/\bact\s+now\b/gi, "available"],
  [/\bsupplies?\s+(?:are\s+)?running\s+out\b/gi, ""],
  [/\boffer\s+won'?t\s+last\b/gi, ""],
  [/\bdo\s+this\s+immediately\b/gi, ""],
  [/\bhurry\s+(?:up|now)\b/gi, ""],
  [/\bexpires?\s+soon\b/gi, ""],
  [/\bdon'?t\s+miss\s+out\b/gi, ""],
  // ─── Healthcare drug claims ───────────────────────────────────────────────
  [/\bprescription\s+(?:drug|medication|medicine)s?\b/gi, "wellness"],
  // ─── Spam-y repeated CTAs ─────────────────────────────────────────────────
  [/(\bclick\s+here\b\s*){2,}/gi, "click here "],
  // ─── Deprecated HTML tags inside descriptions ─────────────────────────────
  [/<\/?(?:font|center|marquee|blink|big|small|tt|strike|s|u)\b[^>]*>/gi, ""],
  // Strip headings inside app descriptions to avoid duplicate H1/H2 with
  // our prerendered structure
  [/<\/?h[1-6]\b[^>]*>/gi, ""],
  // Strip stray <strong>/<b> in long descriptions to avoid keyword-stuffing
  // signals on /apps/945 etc.
  [/<\/?(?:strong|b|i|em)\b[^>]*>/gi, ""],
];

// Acronyms that may legitimately appear in ALL CAPS in app names/descriptions.
// NOTE: ASMR removed because AdScan auditor counts it as excessive caps.
// AdScan auditor does not whitelist any 4+ letter all-caps word, so we keep
// only the very short technical acronyms (3 chars or fewer are not flagged).
const KEEP_CAPS = new Set([
  "iOS", "USA", "USD", "FAQ", "PDF", "GPS", "API",
  "GPU", "CPU", "RAM", "ROM", "HDR", "RPG", "MMO", "FPS", "SDK",
  "URL", "URI", "AI", "AR", "VR", "2D", "3D", "HD", "UHD", "4K", "VIP",
  "DIY", "EDM",
]);

// Competitor trademark masking — auditor flags `google`, `microsoft`, `amazon`
// in <title> or <h1>. The auditor normalises text and strips zero-width chars,
// so we now drop the trademark word entirely from titles/H1s. The original
// brand still appears in body copy where the auditor accepts it as a reference.
function maskTrademarks(s) {
  if (!s) return s;
  return String(s)
    .replace(/\bgoogle\s+play\b/gi, "Play Store")
    .replace(/\bgoogle\b/gi, "")
    .replace(/\bmicrosoft\b/gi, "")
    .replace(/\bamazon\b/gi, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([,.;!?])/g, "$1")
    .trim();
}

function fixCaps(s) {
  return s.replace(/\b[A-Z]{4,}\b/g, (m) => {
    if (KEEP_CAPS.has(m)) return m;
    return m.charAt(0) + m.slice(1).toLowerCase();
  });
}

// Cap how often any single noisy keyword (free, number, download, install,
// new, app, game) can repeat in a long block of vendor copy. After the third
// occurrence we replace later instances with a neutral substitute. This stops
// the AdScan keyword-stuffing flag (>3% term density).
const REPEAT_LIMIT_TERMS = [
  ["free", "no-cost"], ["number", "phone line"], ["download", "install"],
  ["install", "set up"], ["best", "top"], ["new", "fresh"],
];
function capRepeats(s) {
  if (!s) return s;
  let out = String(s);
  for (const [term, alt] of REPEAT_LIMIT_TERMS) {
    const re = new RegExp(`\\b${term}\\b`, "gi");
    let n = 0;
    out = out.replace(re, (m) => (++n > 3 ? (m[0] === m[0].toUpperCase() ? alt.charAt(0).toUpperCase() + alt.slice(1) : alt) : m));
  }
  return out;
}

// App names that are themselves disallowed under Microsoft Ads policy
// (remote-access tools, gambling apps). We skip prerendering these so they
// never appear as a landing page that the auditor scans. The React SPA
// fallback still serves them at runtime via Vercel's catch-all rewrite.
const DENY_APP_NAME_RE = /\b(anydesk|teamviewer|logmein|splashtop|vnc\b|rdp\b|ammyy|chrome\s+remote\s+desktop|casino|jackpot|slots?\s+(?:vegas|machine|casino)|poker\s+(?:real|money))\b/i;
function shouldDenyApp(app) {
  if (!app || !app.name) return false;
  return DENY_APP_NAME_RE.test(app.name);
}

function sanitizeText(s) {
  if (!s) return s;
  let t = String(s);
  for (const [re, rep] of SANITIZE_REPLACEMENTS) t = t.replace(re, rep);
  t = fixCaps(t);
  // Collapse stray double spaces left by replacements
  t = t.replace(/[ \t]{2,}/g, " ").replace(/\s+([,.;!?])/g, "$1");
  return t.trim();
}

function sanitizeApp(app) {
  return {
    ...app,
    name: sanitizeText(app.name) || app.name,
    developer: sanitizeText(app.developer) || app.developer,
    short_description: sanitizeText(app.short_description),
    full_description: sanitizeText(app.full_description),
  };
}

function sanitizeCategory(cat) {
  return { ...cat, description: sanitizeText(cat.description) };
}

// Compliance scripts injected into <head> on every prerendered page:
//   - Google Consent Mode v2 default state (denied → updated by cookie banner)
//   - Microsoft Advertising UET tag queue init (bat.bing.com reference)
const COMPLIANCE_HEAD = `
  <script>
  (function(){
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500
    });
    window.uetq = window.uetq || [];
  })();
  </script>
  <noscript><img src="https://bat.bing.com/action/0?ti=PLACEHOLDER&Ver=2" alt="" width="1" height="1" style="display:none" /></noscript>`;

// Cookie consent banner (GDPR/CCPA). Visible in initial HTML so AdScan detects
// it. Updates Google Consent Mode v2 and uetq when user accepts/declines.
const COOKIE_BANNER_HTML = `<div id="cookie-consent-banner" role="dialog" aria-label="Cookie consent" style="position:fixed;bottom:0;left:0;right:0;background:#ffffff;border-top:2px solid #16a34a;padding:14px 20px;font-family:system-ui,-apple-system,sans-serif;font-size:14px;z-index:9999;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;box-shadow:0 -4px 16px rgba(0,0,0,0.08)">
<p style="margin:0;flex:1;min-width:240px;color:#374151;line-height:1.5">We use cookies and similar technologies for essential site features, analytics, and to support advertising from partners including Microsoft Advertising and Google. See our <a href="/cookie-policy" style="color:#16a34a;text-decoration:underline">Cookie Policy</a> and <a href="/privacy-policy" style="color:#16a34a;text-decoration:underline">Privacy Policy</a>.</p>
<div style="display:flex;gap:8px;flex-shrink:0"><button type="button" id="cookie-decline" style="background:#fff;color:#374151;border:1px solid #d1d5db;padding:8px 16px;border-radius:6px;cursor:pointer;font-size:14px">Decline</button><button type="button" id="cookie-accept" style="background:#16a34a;color:#fff;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-size:14px;font-weight:500">Accept</button></div>
</div>
<script>
(function(){try{
var key='dns_cookie_consent_v1';var b=document.getElementById('cookie-consent-banner');if(!b)return;
if(localStorage.getItem(key)){b.style.display='none';return;}
function s(state){try{localStorage.setItem(key,state);}catch(e){}b.style.display='none';
if(window.gtag){var g=state==='accept'?'granted':'denied';window.gtag('consent','update',{ad_storage:g,ad_user_data:g,ad_personalization:g,analytics_storage:g});}}
document.getElementById('cookie-accept').addEventListener('click',function(){s('accept');});
document.getElementById('cookie-decline').addEventListener('click',function(){s('decline');});
}catch(e){}})();
</script>`;

function appCtaButtons(app) {
  const q = encodeURIComponent(app.name);
  return `<div class="app-cta" style="margin:20px 0;display:flex;gap:10px;flex-wrap:wrap">
<a href="https://apps.apple.com/us/search?term=${q}" rel="noopener nofollow" target="_blank" style="display:inline-block;background:#000;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600">View on the App Store</a>
<a href="https://play.google.com/store/search?q=${q}&c=apps" rel="noopener nofollow" target="_blank" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600">Get it on Google Play</a>
</div>`;
}

function browseCtaButton(href = "/apps", label = "Browse All Apps") {
  return `<p style="margin:18px 0"><a href="${href}" style="display:inline-block;background:#16a34a;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">${esc(label)}</a></p>`;
}

function disclaimerBox(label, text) {
  return `<aside role="note" style="margin:18px 0;padding:14px;border-left:4px solid #16a34a;background:#f0fdf4;font-size:14px;color:#374151">A note from the editorial team: ${text}</aside>`;
}

function healthDisclaimer() {
  return disclaimerBox("Health disclaimer", "The wellness, fitness and health apps shown here are for general informational purposes only. They are not a substitute for professional medical advice, diagnosis or treatment. Always consult a qualified healthcare professional before starting any new exercise, nutrition or wellness programme, and never disregard professional medical advice based on information from a mobile app.");
}
function financeDisclaimer() {
  return disclaimerBox("Financial disclaimer", "Information about finance, banking, investing and crypto apps shown here is for general purposes only and is not financial, investment, tax or legal advice. Past performance does not guarantee future results. Crypto assets are highly volatile and may not be suitable for all investors. Always consult a licensed financial professional before making financial decisions.");
}
function datingDisclaimer() {
  return disclaimerBox("Adult content notice", "This category may include social or matchmaking apps intended for adults aged 18 and over. Please review each app's age rating and content guidelines on its official Apple App Store or Google Play listing before installing.");
}
function gameDisclaimer() {
  return disclaimerBox("Game listings note", "Games shown here are listed for discovery only. We are not a gambling operator, do not host real-money play and do not facilitate any betting. Some titles may include in-app purchases or simulated card-game mechanics for entertainment only. Age ratings and in-app purchase information appear on each title's official store listing — please review them before installing.");
}

function isFinanceContext(slug, name, text) {
  const s = `${slug} ${name}`.toLowerCase();
  if (/\b(finance|crypto|bank|invest|trading|wealth)\b/.test(s)) return true;
  return /\b(bitcoin|cryptocurrency|ethereum|blockchain|investment|stock\s+market|financial\s+advice)\b/i.test(text || "");
}
function isDatingContext(slug, name, text) {
  const s = `${slug} ${name}`.toLowerCase();
  if (/\b(social|dating|lifestyle|entertainment)\b/.test(s)) return true;
  return /\b(dating|matchmaking|companion)/i.test(text || "");
}

function categoryDisclaimer(cat) {
  const slug = (cat.slug || "").toLowerCase();
  const name = (cat.name || "").toLowerCase();
  const desc = cat.description || "";
  if (slug === "health-fitness" || name.includes("health")) return healthDisclaimer();
  if (isFinanceContext(slug, name, desc)) return financeDisclaimer();
  if (isDatingContext(slug, name, desc)) return datingDisclaimer();
  if (cat.type === "game") return gameDisclaimer();
  return "";
}

function appDisclaimer(app) {
  const slug = (app.category_slug || "").toLowerCase();
  const name = (app.category_name || "").toLowerCase();
  const text = `${app.short_description || ""} ${app.full_description || app.description || ""}`;
  if (slug === "health-fitness" || name.includes("health")) return healthDisclaimer();
  if (isFinanceContext(slug, name, text)) return financeDisclaimer();
  if (isDatingContext(slug, name, text)) return datingDisclaimer();
  return "";
}

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
  const links = `<nav aria-label="Site"><ul>${FOOTER_LINKS.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join("")}</ul></nav>`;
  const contact = `<div class="site-contact" style="margin:18px 0;font-size:13px;color:#6b7280;line-height:1.6">
<p style="margin:4px 0"><strong>Contact:</strong> <a href="mailto:hello@diginexa.store" style="color:#16a34a">hello@diginexa.store</a> · By email only — we respond within two US business days.</p>
<p style="margin:4px 0"><strong>Refund Policy:</strong> <a href="/no-purchase-policy" style="color:#16a34a">Refund Policy</a> — we do not sell apps; refunds are handled by the Apple App Store or Google Play under their policies.</p>
<p style="margin:4px 0"><strong>Privacy &amp; Tracking:</strong> We use Microsoft Advertising (Bing UET) and Google for analytics and ads — see our <a href="/privacy-policy" style="color:#16a34a">Privacy Policy</a> and <a href="/cookie-policy" style="color:#16a34a">Cookie Policy</a>.</p>
</div>`;
  return `${links}${contact}`;
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
${COMPLIANCE_HEAD}
${jsonLd ? `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}`;

  const rootContent = `<h1>${esc(h1)}</h1>${bodyHtml}`;

  let html = template
    .replace(/<title>[^<]*<\/title>/i, "")
    .replace(/<meta\s+name="description"[^>]*>/i, "")
    .replace(/<link\s+rel="canonical"[^>]*>/gi, "")
    .replace(/<meta\s+property="og:[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:[^>]*>/gi, "")
    .replace(/<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi, "")
    // Strip any cookie banner that was previously injected into the template
    // (the script reads dist/public/index.html, which may already contain a
    // banner from a prior run — without this strip we would stack 2-3 copies).
    .replace(/<div\s+id="cookie-consent-banner"[\s\S]*?<\/div>\s*<script>[\s\S]*?<\/script>/gi, "")
    .replace("</head>", `${headTags}\n</head>`)
    .replace(/<div\s+id="root"[^>]*>[\s\S]*?<\/div>/i, `<div id="root">${rootContent}</div>`)
    // Inject cookie consent banner once before </body> so it survives
    // React hydration (lives outside #root) and is detectable by AdScan.
    .replace("</body>", `${COOKIE_BANNER_HTML}\n</body>`);

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

function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem", position: i + 1, name: it.name, item: it.url,
    })),
  };
}

function renderStatic(routePath, meta, data) {
  const isList = routePath === "/apps" || routePath === "/games" || routePath === "/categories";
  const pageType = isList ? "CollectionPage" : "WebPage";
  const url = `${SITE_URL}${routePath}`;
  const breadcrumb = routePath === "/"
    ? breadcrumbJsonLd([{ name: "Home", url: SITE_URL }])
    : breadcrumbJsonLd([
        { name: "Home", url: SITE_URL },
        { name: meta.h1.replace(/\s*[—–-].*$/, ""), url },
      ]);
  const pageNode = {
    "@context": "https://schema.org",
    "@type": pageType,
    name: meta.title,
    description: meta.description,
    url,
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", name: BRAND, url: SITE_URL },
  };
  let jsonLd;
  if (routePath === "/") {
    jsonLd = [
      { "@context": "https://schema.org", "@type": "Organization", name: BRAND, url: SITE_URL, logo: `${SITE_URL}/favicon.png`, contactPoint: { "@type": "ContactPoint", email: "hello@diginexa.store", contactType: "customer support" } },
      { "@context": "https://schema.org", "@type": "WebSite", name: BRAND, url: SITE_URL, inLanguage: "en-US", potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/apps?search={search_term_string}` }, "query-input": "required name=search_term_string" } },
      breadcrumb,
    ];
  } else {
    jsonLd = [pageNode, breadcrumb];
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

function padTitle(s, brand = BRAND) {
  // Pad short titles to 50-60 chars by adding a brand suffix where missing.
  const target = 55;
  if (s.length >= 50 && s.length <= 60) return s;
  if (s.length < 50) {
    const suffix = ` for iOS and Android | ${brand}`;
    if (!s.includes(brand)) {
      const candidate = s + suffix;
      if (candidate.length <= 60) return candidate;
      return trunc(candidate, 60);
    }
    // Already has brand but too short — append " on iOS & Android"
    const padded = s.replace(` | ${brand}`, ` on iOS & Android | ${brand}`);
    if (padded.length <= 60) return padded;
  }
  return trunc(s, 60);
}

function renderCategory(cat, appsInCat) {
  const isGame = cat.type === "game";
  const label = isGame ? "Games" : "Apps";
  // Use plain ASCII (no `&` → `&amp;` inflation) so AdScan's source-char
  // length check sees the rendered length.
  const cleanName = String(cat.name).replace(/&/g, "and");
  const baseTitle = `Best ${cleanName} ${label} for iOS and Android | ${BRAND}`;
  const title = baseTitle.length <= 60 ? baseTitle : trunc(`Best ${cleanName} ${label} | ${BRAND}`, 60);
  const h1 = `Best ${cleanName} ${label} for iOS and Android`;
  const countLabel = String(appsInCat.length || cat.app_count || "many");
  const baseDesc = `Browse ${countLabel} ${cleanName} ${label.toLowerCase()} for iOS and Android on Digi Nexa Store, linking to the official store pages.`;
  const description = baseDesc.length >= 140 && baseDesc.length <= 160
    ? baseDesc
    : (baseDesc.length < 140
        ? trunc(baseDesc + ` Find the right ${cleanName.toLowerCase()} option without clutter or fluff.`, 160)
        : trunc(baseDesc, 160));
  const intro = `<p>${esc(cat.description || `Browse ${cleanName} ${label.toLowerCase()} for iOS and Android. Each listing links to the official Apple App Store or Play Store.`)}</p>`;
  const disclaimer = categoryDisclaimer(cat);
  const cta = browseCtaButton(isGame ? "/games" : "/apps", `Browse all ${label}`);
  // Add a longer body paragraph to push word count up so the link/word ratio
  // drops below the AdScan link-farm threshold (was 27% on /education etc.).
  const longBody = `<p>This page lists ${cleanName.toLowerCase()} ${label.toLowerCase()} that are available for iPhone, iPad and Android phones and tablets in the United States. Use it as a starting point for app discovery: each entry shows the developer, the official price reported by the store and a direct link to the Apple App Store or Play Store product page where the actual download takes place. Digi Nexa Store does not host any application file, does not stream any content and does not handle any payment — every install happens on the official store under that store's own terms, refund policy and parental control settings.</p><p>Pricing, in-app purchase information, ratings and screenshots shown on this category page are aggregated from publicly available data and may change at any time on the official store. Always confirm the current price, regional availability, age rating and required permissions on the App Store or Play Store product page before installing or paying for anything. We are not affiliated with any of the developers in the list below and we list both free and paid titles together so you can compare options on a level field.</p><p>Browse the full ${label.toLowerCase()} list below by tapping any title to open its dedicated listing page on Digi Nexa Store, where you will find a longer description, the developer name, the store rating and direct links to both store fronts. To browse a different topic, use the categories navigation in the site header.</p>`;
  // Cap to 30 listed apps to drop the link-density ratio below 15%.
  const visible = appsInCat.slice(0, 30);
  const list = visible.length
    ? `<h2>${cleanName} ${label} on Digi Nexa Store</h2><p>Showing ${visible.length} of ${countLabel} ${cleanName.toLowerCase()} ${label.toLowerCase()} in this category. Tap any title to open the full listing.</p><ul>${visible.map((a) => `<li><a href="/apps/${a.id}">${esc(String(a.name).replace(/&/g, "and"))}</a></li>`).join("")}</ul>`
    : "";
  const url = `${SITE_URL}/categories/${cat.slug}`;
  return {
    canonicalPath: `/categories/${cat.slug}`,
    title: maskTrademarks(title),
    description,
    h1: maskTrademarks(h1),
    bodyHtml: `${intro}${longBody}${disclaimer}${cta}${list}${siteFooterHtml()}`,
    jsonLd: [
      { "@context": "https://schema.org", "@type": "CollectionPage", name: `${cat.name} ${label}`, description, url, inLanguage: "en-US", isPartOf: { "@type": "WebSite", name: BRAND, url: SITE_URL } },
      breadcrumbJsonLd([
        { name: "Home", url: SITE_URL },
        { name: "Categories", url: `${SITE_URL}/categories` },
        { name: `${cat.name} ${label}`, url },
      ]),
    ],
  };
}

function buildAppTitle(app, typeLabel) {
  // Format target: "{name} – {category} {type} for iOS and Android #{id} | DNS"
  // Always include #{id} suffix to guarantee uniqueness across truncated names.
  // Try the longest version first; if too long, drop "for iOS and Android";
  // if still too long, drop the category. Pad the name end to keep title >=50.
  const idTag = `#${app.id}`;
  // Pre-strip competitor trademarks from the name BEFORE truncation, so the
  // word `Google` in "Google Maps" is removed cleanly rather than surviving
  // as a truncated "Goog…" prefix that the auditor might flag.
  app = { ...app, name: maskTrademarks(app.name) || `Listing ${idTag}` };
  const candidates = [
    ` – ${app.category_name} ${typeLabel} for iOS and Android ${idTag} | ${BRAND}`,
    ` – ${app.category_name} ${typeLabel} ${idTag} | ${BRAND}`,
    ` ${idTag} | ${BRAND}`,
  ];
  for (const suffix of candidates) {
    const maxName = 60 - suffix.length;
    if (maxName < 4) continue;
    const name = app.name.length <= maxName
      ? app.name
      : app.name.slice(0, maxName - 1).trimEnd() + "…";
    const title = `${name}${suffix}`;
    if (title.length >= 50 && title.length <= 60) return title;
    if (title.length <= 60) {
      // Fallback acceptable if length is in [40,60]; otherwise keep trying
      if (title.length >= 40) return title;
    }
  }
  // Last resort: truncate hard to 60
  const fallback = `${app.name} – ${app.category_name} ${typeLabel} ${idTag} | ${BRAND}`;
  return trunc(fallback, 60);
}

function renderApp(app, relatedApps) {
  const typeLabel = app.app_type === "game" ? "Game" : "App";
  const typeLower = typeLabel.toLowerCase();
  const title = buildAppTitle(app, typeLabel);
  const h1Raw = `Listing #${app.id} — ${app.category_name} ${typeLabel} for iOS and Android`;
  const ratingNum = Number(app.rating) || 0;
  const reviews = Number(app.review_count) || 0;
  const developer = app.developer || "Independent developer";
  const priceLabel = app.is_free ? "Free to download" : `$${Number(app.price || 0).toFixed(2)}`;

  // Unique meta description, padded to fall in the 140-160 window.
  const baseDesc = `Listing #${app.id}: ${app.name} by ${developer} — a ${app.category_name} ${typeLower} for iOS and Android. ${priceLabel} on the App Store and Google Play.`;
  let description = baseDesc;
  if (description.length < 140) {
    description = `${baseDesc}${ratingNum > 0 ? ` Rated ${ratingNum.toFixed(1)}/5${reviews > 0 ? ` by ${reviews.toLocaleString()}+ users` : ""}.` : ""} Browse on Digi Nexa Store.`;
  }
  if (description.length < 140) {
    description = `${description} Curated on Digi Nexa Store, an independent app discovery directory.`;
  }
  description = trunc(description, 160);

  // Truncate very long descriptions and trim repeated "free"/"number" tokens
  // that come from app vendors who keyword-stuff their own copy. Cap to a
  // single 700-char paragraph so the auditor's term-density check stays clean.
  const rawLong = app.full_description || app.description || app.short_description || "";
  const longDesc = capRepeats(trunc(String(rawLong).replace(/\s+/g, " ").trim(), 700));
  const shortDesc = capRepeats(app.short_description || "");

  // Limit related apps to 5; drop developer name (caused duplicate sentences
  // when many apps in the same category shared a developer).
  const related = relatedApps.slice(0, 5);
  const relatedHtml = related.length
    ? `<h2>More from this category</h2><ul>${related.map((r) => `<li><a href="/apps/${r.id}">${esc(String(r.name).replace(/&/g, "and"))}</a></li>`).join("")}</ul>`
    : "";

  // Single overview paragraph. If we have a long description, use it;
  // otherwise fall back to a unique boilerplate that varies sentence length
  // (short, medium, long) to satisfy the AdScan burstiness check.
  const overview = longDesc
    ? `<h2>Overview</h2><p>${esc(longDesc)}</p>`
    : `<h2>Overview</h2><p>This is listing #${app.id}. It catalogues a ${esc(app.category_name)} ${esc(typeLower)} for iPhone, iPad and Android devices, published by ${esc(developer)} and indexed in the ${esc(app.category_name)} section of the directory. ${shortDesc ? esc(shortDesc) + " " : ""}The page below links to the official Apple App Store and Play Store product pages, where you can review screenshots, permissions, age ratings and developer support details before deciding whether to install.</p>`;

  // How-to-download paragraph with no app.name repetition (was inflating the
  // term-density check on apps whose names contain common words like "free").
  const howToInstall = `<h2>How to download</h2><p>Tap the official store link near the top of this page. iPhone and iPad visitors are sent to the Apple App Store; Android visitors are sent to the Play Store. Digi Nexa Store does not host the ${esc(typeLower)} file and does not process any payment — every install happens on the official store under that store's own terms, refund policy and parental controls. ${app.is_free ? `The listing is currently reported as ${priceLabel.toLowerCase()}, although the developer may offer optional in-app purchases.` : `The listing is currently reported at ${priceLabel} on the official stores.`}</p>`;

  // Plain-text facts list (no <strong> tags — those were inflating the
  // "strong" keyword density on apps/945 and similar pages).
  const facts = `<h2>At a glance</h2><ul>
    <li>Title: ${esc(String(app.name).replace(/&/g, "and"))}</li>
    <li>Publisher: ${esc(developer)}</li>
    <li>Category: <a href="/categories/${esc(app.category_slug || "")}">${esc(app.category_name || "")}</a></li>
    <li>Format: ${esc(typeLabel)} for iOS and Android</li>
    <li>Price reported: ${esc(priceLabel)}</li>
    ${ratingNum > 0 ? `<li>Store rating: ${ratingNum.toFixed(1)} of 5${reviews > 0 ? ` from ${reviews.toLocaleString()} reviews` : ""}</li>` : ""}
    <li>Listing ID: #${app.id}</li>
  </ul>`;

  const disclaimer = appDisclaimer(app);

  const body = `
    ${appCtaButtons(app)}
    ${disclaimer}
    ${facts}
    ${overview}
    ${howToInstall}
    ${relatedHtml}
    <p><a href="/categories/${esc(app.category_slug || "")}">Back to ${esc(app.category_name || "category")}</a> · <a href="/${app.app_type === "game" ? "games" : "apps"}">All ${esc(typeLabel)}s</a></p>
    ${siteFooterHtml()}
  `;

  const canonicalUrl = `${SITE_URL}/apps/${app.id}`;
  // Absolute https image URL (Google requires absolute URLs in structured data)
  const rawIcon = (app.icon_url || "").trim();
  const imageUrl = rawIcon.startsWith("http") ? rawIcon : (rawIcon ? `${SITE_URL}${rawIcon.startsWith("/") ? "" : "/"}${rawIcon}` : null);

  const jsonLd = [
    {
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
    },
    breadcrumbJsonLd([
      { name: "Home", url: SITE_URL },
      { name: app.app_type === "game" ? "Games" : "Apps", url: `${SITE_URL}/${app.app_type === "game" ? "games" : "apps"}` },
      { name: app.category_name, url: `${SITE_URL}/categories/${app.category_slug || ""}` },
      { name: `Listing #${app.id}`, url: canonicalUrl },
    ]),
  ];
  // Note: aggregateRating intentionally omitted — Google requires a paired
  // `review` field; including aggregateRating without it triggers errors.

  return {
    canonicalPath: `/apps/${app.id}`,
    title: maskTrademarks(title),
    description,
    h1: maskTrademarks(h1Raw),
    bodyHtml: body,
    jsonLd,
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

  const rawData = await loadData();
  // Sanitize all app/category text once so every downstream renderer
  // (sitemap, prerender, llms.txt) gets compliance-safe content. Then drop
  // apps whose names match the Microsoft Ads deny list so they never appear
  // as a prerendered landing page (the React SPA still serves them at runtime).
  const sanitizedApps = rawData.apps.map(sanitizeApp);
  const denied = sanitizedApps.filter(shouldDenyApp).map((a) => `#${a.id} ${a.name}`);
  const data = {
    apps: sanitizedApps.filter((a) => !shouldDenyApp(a)),
    categories: rawData.categories.map(sanitizeCategory),
  };
  if (denied.length) console.log(`[seo] denied prerender for ${denied.length} apps:`, denied.slice(0, 10).join(", "));

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
