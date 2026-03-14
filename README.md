# CAN SLIM Screener

A web app that screens stocks against William O'Neil's CAN SLIM investment methodology using IBD's 197 Industry Groups classification. Results stream in live as they're computed.

## CAN SLIM Criteria

| Letter | Criterion | What It Measures | Pass Threshold |
|--------|-----------|------------------|----------------|
| **C** | Current Earnings | Quarterly EPS growth YoY | ≥ 25% |
| **A** | Annual Earnings | Avg annual EPS growth (3yr) | ≥ 25% |
| **N** | New Highs | Proximity to 52-week high | Within 5% |
| **S** | Supply/Demand | Volume vs 50-day average | Above average |
| **L** | Leader | Relative strength vs S&P 500 | RS ≥ 70 |
| **I** | Institutional | Institutional ownership | ≥ 20% |
| **M** | Market Direction | S&P 500 trend (50/200-day MA) | Uptrend |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), select IBD industry groups, and click **Scan Selected** or **Scan All**.

- Browse 197 IBD industry groups organized into ~40 sectors
- Select specific groups to scan a focused subset of stocks
- Or scan all stocks at once (takes ~2-3 minutes)
- Results stream in progressively — you can browse while scanning continues
- Subsequent scans are faster thanks to 4-hour in-memory caching

## Features

- **IBD 197 Industry Groups** — browse and select from IBD's official 197 industry group classification
- **Streaming results** — stocks appear ranked as they're scored via Server-Sent Events
- **Progress bar** — real-time scan progress (e.g., 300/517 scanned)
- **Market direction banner** — shows current S&P 500 trend status (M criterion) with color-coded signals (green/orange/red)
- **Sortable columns** — sort by composite score or any individual CAN SLIM criterion
- **Filter** — search by ticker symbol or company name
- **Expandable rows** — click any stock to see detailed score breakdowns with visual score bars

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **yahoo-finance2** (v3) for free stock data (no API key required)
- **node-cache** for in-memory caching

## Project Structure

```
src/
├── app/
│   ├── page.tsx                       # Main screener UI (SSE consumer)
│   ├── api/screen/route.ts            # Streaming API (SSE producer, supports ?tickers= filter)
│   ├── api/industries/route.ts        # IBD 197 industry groups API
│   └── api/stock/[ticker]/route.ts    # Individual stock detail API
├── lib/
│   ├── canslim.ts                     # CAN SLIM scoring engine
│   ├── yahoo.ts                       # Yahoo Finance data layer + caching
│   ├── tickers.ts                     # S&P 500 + NASDAQ 100 ticker lists
│   └── ibd-groups.ts                  # IBD 197 industry group definitions
└── components/
    ├── IndustryPicker.tsx             # IBD industry group selector UI
    ├── StockTable.tsx                 # Sortable/filterable results table
    ├── ScoreBar.tsx                   # Visual score indicator
    └── MarketStatus.tsx               # Market direction banner
```

## How Scoring Works

Each stock is evaluated against 6 criteria (C, A, N, S, L, I) plus the market direction (M). Each criterion produces a score from 0-100 and a pass/fail result. The composite score is a weighted average:

| Criterion | Weight |
|-----------|--------|
| C (Current Earnings) | 20% |
| A (Annual Growth) | 20% |
| L (Leader/RS) | 20% |
| N (New Highs) | 15% |
| S (Supply/Demand) | 10% |
| I (Institutional) | 10% |
| M (Market Direction) | 5% |

## Data Source

All data comes from Yahoo Finance via the `yahoo-finance2` npm package. No API key is required. Industry classification uses IBD's 197 Industry Groups from MarketSurge. The stock universe includes S&P 500 constituents plus select NASDAQ 100 names (~500 tickers total).

## Notes

- The **C** (Current Earnings) criterion may show "N/A" for some stocks due to limited quarterly earnings data availability from Yahoo Finance
- Data is cached in-memory for 4 hours to avoid excessive API calls
- This tool is for educational/research purposes and does not constitute investment advice
