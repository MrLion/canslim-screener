# Changelog

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
