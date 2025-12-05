# n8n Library

**Discover 2,348+ free n8n workflow templates** – A curated collection of automation blueprints for AI, Telegram, Slack, Google Sheets, and more.

[![Deploy to Cloudflare Pages](https://github.com/7and1/n8n-Library/actions/workflows/deploy.yml/badge.svg)](https://github.com/7and1/n8n-Library/actions/workflows/deploy.yml)

**Live Site**: [https://n8n-library.pages.dev](https://n8n-library.pages.dev)

## Features

- **2,348 Workflow Templates** – Daily-sync'd mix of curated + community automations (data regenerated whenever `npm run build:data` runs)
- **364 Integrations** – End-to-end coverage with both `integrations.json` (full list) and `integrations_top.json` (hero slice)
- **Server-Powered Search API** – `/api/workflows/search` exposes query, filters, pagination, and latency telemetry used by `/search` + `/directory`
- **Virtualized Directory UI** – Client grid built on `@tanstack/react-virtual` with skeleton states whenever filters change
- **One-Click Copy** – Download/import the exact JSON from each detail page
- **Open Data Export** – `public/data/*.json` bundle (including `meta.json` and cache manifest stats) for downstream consumers

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Search**: Node-side Fuse.js (`src/lib/search/engine.ts`) exposed via `/api/workflows/search` + virtualized React grid
- **Data pipeline**: `scripts/build-data.js` + cache manifest + `meta.json`
- **Deployment**: Cloudflare Pages
- **CI/CD**: GitHub Actions (`deploy.yml`)

## Data Sources & Credits

This project aggregates workflow templates from two excellent community repositories:

### [awesome-n8n-templates](https://github.com/enescingoz/awesome-n8n-templates)
Curated showcase of high-quality workflows organised by folder/category.

### [n8n-workflows](https://github.com/Zie619/n8n-workflows)
Community mega-repo (≈2,060 JSON files) mapped into the global search index.

**Thank you to all the contributors** who have shared their workflows with the community!

## Local Development

```bash
# Install dependencies
npm install

# Run development server (uses the committed data bundle)
npm run dev

# Regenerate the JSON data + build the production bundle
npm run build

# Only rebuild the data bundle
npm run build:data -- --force
```

### ETL flags & caching

`scripts/build-data.js` accepts several flags/env vars:

| Flag / Env | Description |
| --- | --- |
| `--force` | Ignore `.cache/workflow-manifest.json` and parse every workflow |
| `--since=2025-12-01` | Only touch files newer than the ISO timestamp; cached entries are reused |
| `--max-workers=6` | Override CPU-based concurrency |
| `--pretty` | Emit human-readable JSON for debugging |
| `--source=awesome|community|all` | Limit which repo(s) to ingest |
| `--revalidate-url=https://example.com/api/workflows/revalidate?secret=XYZ` | Optional webhook to revalidate the `workflows-data` tag after ETL |
| `WORKFLOW_REVALIDATE_TOKEN` | Adds `Authorization: Bearer <token>` to the webhook call |

Each run writes `public/data/meta.json` containing the dataset hash, manifest stats, upstream commit SHAs, and cache hit counts for downstream consumers.

### Cache invalidation

The runtime ships `POST /api/workflows/revalidate`, which simply calls `revalidateTag('workflows-data')`. Protect it with `WORKFLOW_REVALIDATE_TOKEN` (or `REVALIDATE_SECRET`) in `.env.local` and invoke it from CI/CD via the `--revalidate-url` flag.

### Public dataset files

```
public/data/
├── index.json             # Workflow metadata (search index)
├── categories.json        # Category stats
├── integrations.json      # Full integration list (364 entries)
├── integrations_top.json  # Top 150 integrations for hero sections
├── meta.json              # Dataset hash + cache stats + source commits
└── workflows/*.json       # Individual workflow payloads
```

All of these files are committed so reviewers can diff regenerated data in PRs.

### Search API for third parties

`GET /api/workflows/search` powers both `/search` and `/directory`. Query parameters mirror the client `FilterState`:

| Param | Notes |
| --- | --- |
| `q` | Full-text query (Fuse.js)
| `category`, `integration`, `trigger` | Filter slugs
| `source` | `all` (default) \| `awesome` \| `community`
| `quality` | Minimum quality score (1-5)
| `sort` | `relevance` \| `quality` \| `newest` \| `nodes` \| `name`
| `page`, `pageSize` | Pagination (max 48 per page)

Responses include `{ results, total, page, hasMore, tookMs }`. Please keep usage to reasonable bursts (≈30 req/min) so the CDN cache stays warm.

## Project Structure

```
n8n-library/
├── src/
│   ├── app/                 # Next.js app router routes (pages + API)
│   │   ├── page.tsx         # Homepage
│   │   ├── search/          # Search page
│   │   ├── category/        # Category pages
│   │   ├── integration/     # Integration pages
│   │   ├── workflow/        # Workflow detail pages
│   │   ├── about/           # About page
│   │   └── api/workflows/   # Search + cache revalidate routes
│   ├── components/          # React components
│   └── lib/                 # Utilities and data functions
├── public/
│   └── data/                # Pre-built workflow data bundle
│       ├── index.json       # Search index
│       ├── categories.json  # Category metadata
│       ├── integrations*.json # Full + top integration lists
│       ├── meta.json        # Dataset + cache summary
│       └── workflows/       # Individual workflow JSON files
└── scripts/                 # ETL build scripts
```

## License

MIT

## Disclaimer

This is an unofficial community project and is not affiliated with n8n GmbH. n8n is a registered trademark of n8n GmbH. All workflow templates are provided by the community under their respective licenses.
