# Changelog

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
