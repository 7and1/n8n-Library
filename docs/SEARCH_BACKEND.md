# Search & Data Loading Revamp

## Goals
- Avoid shipping the 2MB `index.json` + Fuse.js bundle to every client.
- Keep search latency <150ms for 2.3k+ workflows with pagination & filters.
- Provide a first-class API surface that both `/search` and `/directory` pages can consume.
- Make data loading deterministic and cacheable with explicit invalidation hooks.
- Keep UX responsive on low-end devices via virtualization & optimistic UI.

## Architecture Overview
1. **Server Cache Layer**  (`src/lib/data.ts`)
   - Wrap file reads with `unstable_cache` keyed by `[relativePath, WORKFLOW_DATA_TAG]`，避免请求风暴下重复读盘。
   - 暴露 `invalidateWorkflowDataCache()`，由 `/api/workflows/revalidate` + CLI `--revalidate-url` 调用，内部执行 `revalidateTag('workflows-data')`。

2. **Search Engine Module** (`src/lib/search/engine.ts`)
   - Lazily instantiates a single Fuse.js instance per server process, keyed by data hash.
   - Exposes `searchWorkflows(query, filters, pagination)` returning `{results, total, took}`.
   - Reuses shared filter/sort utilities that are also consumed on the client for determinism.

3. **API Route** (`src/app/api/workflows/search/route.ts`)
   - Query params mirror `FilterState` + `page` + `pageSize`.
   - Handles validation + error states; responds with JSON for both pages & integration detail modals。
   - 返回 `tookMs` 以便客户端展示服务器耗时；`unstable_cache` 的 tag 由 `/api/workflows/revalidate` 刷新。

4. **Client Experience** (`src/app/search/client.tsx`)
   - UI-only client component; fetches data via the API using `AbortController` for race cancellation。
   - Keeps filters in URL, but only stores lightweight metadata in state；展示 `tookMs` 以及 filter skeleton，强调“服务端驱动”。
   - List rendering performed by `VirtualizedWorkflowGrid` (`@tanstack/react-virtual`)，因此即使加载 2,348+ workflows DOM 依旧轻量。
   - `Load more` simply increments `page` and appends results; virtualization ensures DOM remains small。

5. **Directory Page**
   - Server component fetches the first page through the shared search engine and seeds `SearchClient` with `initialResponse` to prevent layout shift.

6. **ETL Enhancements**
   - CLI flags: `--force`, `--since=<ISO>`, `--max-workers=<n>`, `--source=<repo>`, `--pretty`，以及新的 `--revalidate-url` + `WORKFLOW_REVALIDATE_TOKEN`。
   - File-level caching via `.cache/workflow-manifest.json` storing mtime & hash; unchanged workflows reuse cached parsed metadata。
   - Output summary `public/data/meta.json` includes dataset hash / manifest stats / upstream commits，为 Fuse hash 与缓存命中提供依据。

7. **JSON Output Optimization**
   - Minified JSON by default; optional `--pretty` flag for debugging.
   - `integrations.json` now contains the full list. A new `integrations_top.json` (Top 150) feeds homepage hero without forcing clients to download everything.

8. **Testing Strategy**
   - `npm run build:data` (with DEBUG) to ensure ETL correctness.
   - `npm run lint` & `npm run build` to validate Next bundle.
   - Manual QA checklist recorded in PR description (search latency, filter accuracy, virtualization scroll, sitemap link integrity).
