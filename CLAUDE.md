# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## gstack

Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

Available skills: /office-hours, /plan-ceo-review, /plan-eng-review, /plan-design-review, /design-consultation, /review, /ship, /land-and-deploy, /canary, /benchmark, /browse, /qa, /qa-only, /design-review, /setup-browser-cookies, /setup-deploy, /retro, /investigate, /document-release, /codex, /cso, /autoplan, /careful, /freeze, /guard, /unfreeze, /gstack-upgrade

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

```bash
npm run typecheck  # TypeScript type check (tsc --noEmit)
npx vitest run     # Run test suite
```

## Architecture

**Next.js 16 App Router** with SSE-based progressive scanning of ~600 tickers.

### Data flow

1. **`/src/lib/yahoo.ts`** — Yahoo Finance data layer. Uses `new (YahooFinance as any)()` constructor (v3 API — not default import). All calls are wrapped with `node-cache` (4-hour server-side TTL for quotes/earnings; 24-hour TTL for invalid ticker markers). Key functions: `getQuotes`, `getEarnings`, `getHistoricalPrices`, `getInstitutionalHoldings`, `getSP500History`, `filterValidTickers`, `clearServerCache`.

2. **`/src/lib/canslim.ts`** — Scoring engine. `scoreStock()` fetches earnings/prices/institutional data in parallel and scores each of the 7 CAN SLIM criteria (C/A/N/S/L/I/M) as `CriterionResult` objects with `{ pass, score, value, detail }`. Composite score uses fixed weights (C=20%, A=20%, L=20%, N=15%, S=10%, I=10%, M=5%). `screenBatch()` returns `ScreenBatchResult { results, invalidCount, errorCount }` — separating pre-filtered invalid tickers from actual scoring errors.

3. **`/src/app/api/screen/route.ts`** — SSE streaming endpoint. Processes tickers in batches of 10. Emits events: `market`, `progress`, `stock`, `done`, `error`. Accepts optional `?tickers=AAPL,MSFT,...` param to scan a subset. `progress` events include `{ scanned, total, invalid }`; `done` includes `{ scanned, invalid, errors, timestamp }`.

4. **`/src/app/api/cache/route.ts`** — DELETE endpoint that flushes the entire server-side node-cache (quotes, earnings, invalid markers). Used by the "Clear Server Cache" UI button to recover from stuck-invalid situations.

5. **`/src/app/api/stock/[ticker]/route.ts`** — Single-stock JSON endpoint used for on-demand rescans.

6. **`/src/app/api/industries/route.ts`** — Returns IBD sector/industry group structure with ticker counts.

7. **`/src/lib/scan-cache.ts`** — Client-side `localStorage` cache (24-hour TTL, `CACHE_VERSION=2`). `partitionTickers()` splits tickers into fresh/stale/missing so incremental scans skip up-to-date results. `flushCacheWrites()` batches pending writes.

8. **`/src/lib/ibd-groups.ts`** — IBD industry group definitions (197 groups across sectors). Each group has a `symbol`, `name`, and `tickers[]`.

9. **`/src/lib/tickers.ts`** — `ALL_TICKERS` export: S&P 500 + NASDAQ 100 combined (~600 symbols).

10. **`/src/types/index.ts`** — Shared types: `CriterionResult`, `CANSLIMResult`, `MarketDirection`, `StockResult`. All components and libs import from here.

11. **`/src/lib/sse-parser.ts`** — AsyncGenerator-based SSE parser. `parseSSEStream(reader)` yields `{ event, data }` objects with proper reader cleanup.

12. **`/src/hooks/useScreener.ts`** — Custom hook encapsulating all screener state, SSE streaming, and cache logic. `page.tsx` is a thin render shell that delegates to this hook.

## Design System
Always read DESIGN.md before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match DESIGN.md.

### Key gotchas

- **yahoo-finance2 v3**: Must instantiate with `new (YahooFinance as any)({ suppressNotices: [...] })`. The "C" (quarterly EPS) criterion often returns N/A because `fundamentalsTimeSeries` data is sparse; it falls back to `earningsHistory`.
- **Caching is three-tier**: Server-side `node-cache` (4hr for quotes/earnings, 24hr for invalid ticker markers); client-side `localStorage` (24hr) for scored results. The client cache enables instant page loads on repeat visits. Invalid ticker markers prevent re-querying OTC/ADR symbols that Yahoo Finance can't resolve. Use the "Clear Server Cache" button or `DELETE /api/cache` to flush all server-side entries if valid tickers get accidentally blacklisted (e.g. due to transient API errors).
- **SSE streaming**: The screen API uses `ReadableStream` with `text/event-stream`. The UI consumes events progressively and merges incoming results with the client cache.
- **Market direction (M criterion)**: Uses S&P 500 50-day and 200-day MAs. Above 50-MA = uptrend; between 50-MA and 200-MA = neutral; below both = downtrend.

