/**
 * AppVault - App Store Data Scraper
 * Scrapes app data from appinme.com to import store links
 * 
 * Usage: node scraper.js
 * 
 * Note: appinme.com uses Cloudflare protection. If blocked,
 * try running from a different network or with a proxy.
 */

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const BASE_URL = "https://us.appinme.com";
const OUTPUT_FILE = path.join(__dirname, "apps-data.json");
const DELAY_MS = 1000; // Delay between requests to be respectful

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch a single app detail page from appinme.com
 * @param {string} packageId - Android package ID (e.g. com.whatsapp)
 * @param {string} type - 'app' or 'game'
 */
async function fetchAppDetail(packageId, type = "app") {
  const url = `${BASE_URL}/${type}/${packageId}.html`;
  try {
    const response = await axios.get(url, { headers, timeout: 10000 });
    const $ = cheerio.load(response.data);

    // Extract store links
    let androidUrl = null;
    let iosUrl = null;

    // Look for Google Play link
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      if (href.includes("play.google.com/store/apps/details")) {
        androidUrl = href;
      }
      if (href.includes("apps.apple.com")) {
        iosUrl = href;
      }
    });

    // Extract app info
    const name = $("h1, .app-name, [itemprop='name']").first().text().trim();
    const developer = $(".developer, .app-developer, [itemprop='author']").first().text().trim();
    const rating = $(".rating, [itemprop='ratingValue']").first().text().trim();
    const category = $(".category, [itemprop='applicationCategory']").first().text().trim();
    const iconUrl = $('img[src*="myappcdn.com/logo"]').first().attr("src") || 
                    `https://myappcdn.com/logo/${packageId}.webp`;

    return {
      name,
      developer,
      icon: iconUrl,
      category,
      rating: parseFloat(rating) || null,
      package_id: packageId,
      app_type: type,
      android_url: androidUrl || `${BASE_URL}/${type}/${packageId}.html`,
      ios_url: iosUrl,
      source_url: url,
    };
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error.message);
    return null;
  }
}

/**
 * Get all app/game listings from a category page
 */
async function fetchCategoryPage(categorySlug) {
  const url = `${BASE_URL}/category/${categorySlug}.html`;
  const apps = [];
  try {
    const response = await axios.get(url, { headers, timeout: 10000 });
    const $ = cheerio.load(response.data);

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      const appMatch = href.match(/\/app\/(.+?)\.html/);
      const gameMatch = href.match(/\/game\/(.+?)\.html/);
      if (appMatch) apps.push({ packageId: appMatch[1], type: "app" });
      if (gameMatch) apps.push({ packageId: gameMatch[1], type: "game" });
    });
  } catch (error) {
    console.error(`Failed to fetch category ${categorySlug}:`, error.message);
  }
  return apps;
}

/**
 * Main scraper function - crawls all categories and fetches app details
 */
async function scrapeAll() {
  const categories = [
    "communication", "social", "productivity", "entertainment",
    "finance", "education", "travel", "lifestyle", "tools",
    "music-and-audio", "food-and-drink", "health-and-fitness",
    "photography", "sport", "dating", "beauty",
  ];

  const allPackages = new Set();
  const allApps = [];

  console.log("Step 1: Collecting app listings from categories...");
  for (const cat of categories) {
    console.log(`  Fetching category: ${cat}`);
    const apps = await fetchCategoryPage(cat);
    apps.forEach((app) => {
      const key = `${app.type}:${app.packageId}`;
      if (!allPackages.has(key)) {
        allPackages.add(key);
        allApps.push(app);
      }
    });
    await sleep(DELAY_MS);
  }

  console.log(`Found ${allApps.length} unique apps across all categories`);

  // Step 2: Fetch details for each app
  console.log("\nStep 2: Fetching app details...");
  const detailedApps = [];
  for (let i = 0; i < allApps.length; i++) {
    const { packageId, type } = allApps[i];
    console.log(`  [${i + 1}/${allApps.length}] Fetching: ${packageId}`);
    const detail = await fetchAppDetail(packageId, type);
    if (detail) detailedApps.push(detail);
    await sleep(DELAY_MS);
  }

  // Step 3: Save to JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(detailedApps, null, 2));
  console.log(`\nDone! Saved ${detailedApps.length} apps to ${OUTPUT_FILE}`);
  return detailedApps;
}

/**
 * Quick URL builder — no scraping needed if you already have package IDs
 * Constructs appinme.com URLs from package IDs
 */
function buildAppinmeUrls(packageId, type = "app") {
  return {
    appinme_url: `${BASE_URL}/${type}/${packageId}.html`,
    play_store_url: `https://play.google.com/store/apps/details?id=${packageId}`,
    icon_url: `https://myappcdn.com/logo/${packageId}.webp`,
  };
}

// Run scraper
scrapeAll().catch(console.error);

module.exports = { scrapeAll, fetchAppDetail, fetchCategoryPage, buildAppinmeUrls };
