# Changelog

## [0.4.1.0] - 2026-03-27

### Added
- **Invalid ticker validation** — `getQuotes()` now caches known-invalid tickers (null/zero-price) with a 24-hour TTL, preventing redundant Yahoo Finance calls on repeat scans of IBD industry groups (~2,044 tickers, ~1,100 OTC/ADR symbols)
- **`filterValidTickers()`** — new exported function partitions ticker lists into known-invalid vs potentially-valid before API calls
- **`ScreenBatchResult` type** — `screenBatch()` now returns `{ results, invalidCount, errorCount }` instead of a plain array, separating pre-filtered invalids from actual scoring failures
- **`/api/cache` DELETE endpoint** — flushes the server-side node-cache (quotes, earnings, invalid markers) for recovery when valid tickers are accidentally blacklisted
- **"Clear Server Cache" button** — added to the cache status bar in the UI for one-click server cache reset
- **`vitest.config.ts`** — committed vitest configuration (jsdom environment, `@` path alias)

### Changed
- SSE `progress` events now include `invalid` count alongside `scanned`/`total`
- SSE `done` event now includes separate `invalid` and `errors` counts (was a single `failed` count)
- UI status line now shows `X scored, Y failed, Z invalid skipped` when IBD groups are scanned
- `console.error` in `screenBatch` now uses structured object format (matches `yahoo.ts` style)
- `.gitignore` updated to exclude `.gstack/` tooling directory
- Ticker parsing in `/api/screen` now trims whitespace from individual symbols

### Removed
- Deleted stale `docs/pipeline/` QA and pipeline-state files from the IBD groups PR

## [0.4.0] - 2025-03-25

### Added
- **Shared type system** — centralized `CriterionResult`, `CANSLIMResult`, `MarketDirection`, `StockResult` types in `src/types/index.ts`, eliminating duplicate interface declarations across 4 files
- **SSE parser module** — extracted `parseSSEStream()` AsyncGenerator from page.tsx into `src/lib/sse-parser.ts` with proper reader cleanup
- **useScreener hook** — extracted all state management, data fetching, and cache logic from page.tsx into `src/hooks/useScreener.ts`
- **`flushCacheWrites()` helper** — dedicated cache flush function in scan-cache.ts
- **`isStaleTimestamp()` utility** — string-based staleness check for ISO timestamps
- **Error logging** — all 7 Yahoo Finance catch blocks now log structured errors via `console.error`
- **Failed stock count** — SSE `done` event now includes `{ failed }` count, displayed in UI
- **Test suite** — 75 tests across 9 files covering canslim scoring, scan-cache, SSE parser, tickers, useScreener hook, Yahoo data layer, and 3 UI components
- **TODOS.md** — project task tracking with P2 item for C criterion data source

### Fixed
- **Cache poisoning** — `getEarnings()` no longer caches empty results, preventing 4-hour stale entries
- **Resource leak** — SSE parser releases reader lock in `finally` block on abort/error
- **Unmount cleanup** — inflight scans are aborted when useScreener unmounts
- **Timestamp consistency** — stock results use a single timestamp for both UI state and cache writes

### Changed
- `page.tsx` reduced from ~450 lines to ~160-line render shell
- `CACHE_VERSION` bumped from 1 to 2 (auto-clears old caches on deploy)
- `getHistoricalPrices` parameter renamed from `months` to `periodMonths` for clarity
- `totalGroups` in industries API now computed dynamically instead of hardcoded 197
- `getSelectedTickers` in IndustryPicker memoized with `useMemo`

## [0.3.0] - 2026-03-14

### Added
- **IBD 197 Industry Groups** — replaced Yahoo Finance sector/industry mapping with official IBD 197 industry group classification from MarketSurge
- New `src/lib/ibd-groups.ts` data file with all 197 groups organized into ~40 sectors
- Groups include IBD symbol codes (e.g., G3722 for Aerospace/Defense)
- Sector derivation logic automatically categorizes groups into browsable sectors

### Changed
- `/api/industries` now returns static IBD groups instead of fetching from Yahoo Finance (instant load, no API calls)
- `IndustryPicker` redesigned for IBD group structure with sector/group hierarchy
- Industry picker header shows "IBD 197 Industry Groups" with group and sector counts
- Selection now works by IBD group symbol rather than Yahoo sector/industry key
- README updated to reflect IBD industry group classification

### Note
- Stock ticker assignments per IBD group will be provided in a future update
- "Scan All" continues to scan the full S&P 500 + NASDAQ 100 universe

## [0.2.0] - 2026-03-14

### Added
- **Industry-based stock selection** — pick specific sectors and industries before scanning
- New `/api/industries` endpoint that returns stocks grouped by sector and industry
- `IndustryPicker` component with collapsible sector groups, per-industry checkboxes, and stock counts
- "Select All" / "Deselect All" per sector
- "Scan Selected" scans only chosen industries; "Scan All" scans the full universe
- Sector and industry metadata (`sector`, `industry`) added to stock quote data

### Changed
- `/api/screen` now accepts an optional `?tickers=` query param for filtered scans
- Market direction banner uses color-coded signals: green (above 50-day MA), orange (below 50-day MA but above 200-day MA), red (below both)

## [0.1.0] - 2026-03-13

### Added
- Initial CAN SLIM screener with S&P 500 + NASDAQ 100 stock universe (~517 tickers)
- Server-Sent Events streaming for progressive results
- CAN SLIM scoring engine (C, A, N, S, L, I, M criteria)
- Market direction banner with S&P 500 trend analysis
- Sortable, filterable results table with expandable detail rows
- In-memory caching (4-hour TTL) via node-cache
