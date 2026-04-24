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
- **Apex redirect**: `vercel.json` includes a 301 redirect from the apex `diginexastore.com` to `https://www.diginexastore.com` (preserves path). Both apex and `www` must be added in Vercel → Settings → Domains, with `www` set as primary.

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
