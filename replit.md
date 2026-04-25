# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### App Discovery Platform (`artifacts/appstore`)
- **Type**: react-vite web app
- **Preview path**: `/`
- **Description**: App store discovery platform similar to appinme.com — curated directory of mobile apps

**Pages:**
- `/` — Hero landing + featured apps + trending + categories + new releases
- `/apps` — Full catalog with category filter + search
- `/apps/:id` — App detail page with screenshots, ratings, download links
- `/categories` — All categories grid
- `/categories/:slug` — Apps by category

**Features:**
- 15 seeded apps across 10 categories
- Featured, trending, and new apps sections
- Category filtering and full-text search
- Platform filter (iOS/Android/Both)
- Stats summary (total apps, downloads, etc.)

### API Server (`artifacts/api-server`)
- **Routes**: `/api/apps`, `/api/categories`, `/api/stats`
- **Database tables**: `apps`, `categories`

## Deployment

- **Host**: Vercel
- **Canonical domain**: `https://www.diginexastore.com`
- **Apex redirect**: `vercel.json` defines a 301 from apex `diginexastore.com` → `https://www.diginexastore.com` (path preserved). Both domains are live in Vercel → Settings → Domains with `www` as primary.
- **Verified 2026-04-24** (apex → www, path preserved, currently served as **307 Temporary** by Vercel's domain layer — vercel.json's 301 is overridden by the dashboard-level redirect):
  - `https://diginexastore.com/` → `https://www.diginexastore.com/`
  - `https://diginexastore.com/apps` → `https://www.diginexastore.com/apps`
  - `https://diginexastore.com/categories` → `https://www.diginexastore.com/categories`
  - `https://diginexastore.com/apps/1` → `https://www.diginexastore.com/apps/1`
  - `https://diginexastore.com/robots.txt` → `https://www.diginexastore.com/robots.txt`
  - `http://diginexastore.com/` → `https://diginexastore.com/` (308) → `https://www.diginexastore.com/`
- `https://www.diginexastore.com/` returns 200 with `<link rel="canonical">` and `og:url` pointing at `www`. `sitemap.xml` and `robots.txt` reference only `www` URLs.

## SEO / AdScan Compliance

- **HTML site index is paginated**: master `/sitemap` is a small editorial index linking to 18 per-category sub-pages at `/sitemap/{slug}` (and `/sitemap/other` for unassigned listings). All sub-pages keep link density under 5% (well below the 15% AdScan threshold) by combining app-link lists with substantial intro paragraphs and per-app one-line blurbs from `apps.short_description`. Renderers: `renderHtmlSitemap` / `renderHtmlSitemapCategory` / `renderHtmlSitemapOther` in `artifacts/appstore/scripts/generate-seo.mjs`.
- **`scrubLongTokens` HTML-safety rule**: the long-token splitter regex must use `[A-Za-z0-9_]`, NEVER `\S`. Using `\S` matches HTML markup and inserts spaces inside tag names (e.g. `</li>` → `</ li>`), breaking the DOM and triggering AdScan structural-tag-mismatch failures on densely-packed link lists.
- **Financial-products disclaimer**: `/sitemap/finance` and any prerendered app page mentioning `cash advance`, `payday loan`, `credit-builder`, etc., must include the boilerplate "Financial products notice" with `Past performance does not guarantee future results` + `Truth-in-Lending Act` language so AdScan / Microsoft Ads policy is satisfied on the same page as the trigger phrase.

## Database Schema

### `categories` table
- id, name, slug, description, icon_name, color, app_count

### `apps` table
- id, name, developer, description, short_description, full_description
- icon_url, screenshot_urls, category_slug, category_name
- rating, review_count, download_count, price, is_free, platform
- featured, trending, app_store_url, play_store_url, tags
- version, size, requirements, website, privacy_policy_url, release_notes
- created_at, updated_at
