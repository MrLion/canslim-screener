# CAN SLIM Screener

**CAN SLIM–inspired** multi-factor stock screener (William J. O’Neil). Not a full MarketSmith / IBD clone.

Live product goal: pick IBD-style industry groups → scan → letter scores + market (M) banner → expandable detail.

## Disclaimer

**Not financial advice.** Educational / research tool only. Past patterns ≠ future results. Scores use simplified proxies and free/public market data — they are **not** pure O’Neil or official IBD RS ratings.

## CAN SLIM criteria (v1 proxies)

| Letter | Criterion | What we measure | Pass threshold | Data source |
|--------|-----------|-----------------|----------------|-------------|
| **C** | Current Earnings | Quarterly EPS YoY | ≥ 25% | Yahoo (fundamentals) |
| **A** | Annual Earnings | Avg annual EPS growth | ≥ 25% | Yahoo |
| **N** | New Highs | Distance from 52w high | Within 5% | **Alpaca** bars |
| **S** | Supply/Demand | Volume vs ~3m avg | ≥ 1.0× avg | **Alpaca** |
| **L** | Leader (RS) | 6m return vs SPY | RS score ≥ 70 | **Alpaca** |
| **I** | Institutional | Ownership % | ≥ 20% | Yahoo |
| **M** | Market Direction | SPY vs 50/200 MA | Uptrend | **Alpaca** (SPY) |

Known purity gaps vs true CAN SLIM / IBD: no cup-with-handle, no pivot, no breakout volume surge rule, no IBD RS 1–99, no distribution/follow-through day system, no ROE in A, institutional “ownership level” not “increasing sponsorship.”

## Setup

```bash
npm install
cp .env.example .env.local
# fill ALPACA_API_KEY and ALPACA_SECRET_KEY (paper is fine)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ALPACA_API_KEY` | Yes (prod) | Alpaca Key ID |
| `ALPACA_SECRET_KEY` | Yes (prod) | Alpaca Secret |
| `ALPACA_DATA_URL` | No | Default `https://data.alpaca.markets` |
| `ALPACA_FEED` | No | Default `iex` (free/basic) |

Without Alpaca keys, the app **falls back to Yahoo** for prices so local UI still works — production should always set Alpaca.

```bash
npm run build    # production build
npm run lint
npm run typecheck
```

## Deploy (Vercel)

1. Import `jzoccali/canslim-screener` (or `vercel` from repo root).
2. Set `ALPACA_API_KEY` and `ALPACA_SECRET_KEY` in Project → Settings → Environment Variables (Production + Preview).
3. Deploy. Do not commit secrets.

## Features

- IBD-style industry groups picker
- Streaming scan (SSE) with progress
- Letter scores + composite, sortable table, expandable rows
- Market direction banner (M)
- Client + server caching (don’t hammer APIs)

## Tech

- Next.js 16 (App Router) + TypeScript + Tailwind
- **Alpaca** Market Data API for OHLCV / N S L M
- **yahoo-finance2** for C A I fundamentals (and price fallback)
- `node-cache` for in-process TTL cache

## Project structure

```
src/
├── app/api/screen/          # SSE scan
├── app/api/industries/      # IBD groups
├── app/api/stock/[ticker]/ # single ticker
├── lib/alpaca.ts            # Alpaca market data
├── lib/yahoo.ts             # facade: Alpaca primary + Yahoo fundamentals
├── lib/canslim.ts           # letter scoring
└── components/              # UI
```

## License

See `LICENSE`. Forked from [MrLion/canslim-screener](https://github.com/MrLion/canslim-screener).
