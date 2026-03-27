# TODOS

## Data Quality

- **Investigate alternative data source for "C" criterion quarterly EPS**
  **Priority:** P2
  Yahoo Finance `fundamentalsTimeSeries` and `earningsHistory` often return empty data,
  causing the "C" (Current Quarterly Earnings) criterion to show N/A for many stocks.
  Investigate Alpha Vantage, Financial Modeling Prep, or SEC EDGAR as alternatives.

## API

- **Add input length cap on `?tickers=` query param in `/api/screen`**
  **Priority:** P4
  The screen endpoint accepts an arbitrary number of tickers via `?tickers=AAPL,MSFT,...`.
  There is no limit, so a crafted URL with thousands of tickers could trigger an unbounded scan.
  For a productized version, silently truncate to ~2500 tickers (covers full IBD universe with headroom).
  Currently a solo dev tool so the risk is low.

## Completed
