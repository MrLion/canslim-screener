/**
 * Alpaca Market Data client — primary source for OHLCV / quotes / history (N, S, L, M).
 * Auth: ALPACA_API_KEY + ALPACA_SECRET_KEY (paper keys work for market data).
 */

import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 14400 }); // 4 hour cache
const DATA_BASE = process.env.ALPACA_DATA_URL || "https://data.alpaca.markets";

export function hasAlpacaCreds(): boolean {
  return Boolean(process.env.ALPACA_API_KEY && process.env.ALPACA_SECRET_KEY);
}

function authHeaders(): HeadersInit {
  const key = process.env.ALPACA_API_KEY;
  const secret = process.env.ALPACA_SECRET_KEY;
  if (!key || !secret) {
    throw new Error("Missing ALPACA_API_KEY / ALPACA_SECRET_KEY");
  }
  return {
    "APCA-API-KEY-ID": key,
    "APCA-API-SECRET-KEY": secret,
  };
}

async function alpacaGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(path, DATA_BASE);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v != null && v !== "") url.searchParams.set(k, v);
    }
  }
  const res = await fetch(url.toString(), {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Alpaca ${res.status} ${path}: ${body.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

export interface AlpacaBar {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
  n?: number;
  vw?: number;
}

export interface AlpacaSnapshot {
  latestTrade?: { p?: number; s?: number; t?: string };
  latestQuote?: { ap?: number; bp?: number };
  minuteBar?: AlpacaBar;
  dailyBar?: AlpacaBar;
  prevDailyBar?: AlpacaBar;
}

export type PriceBar = { date: Date; close: number; volume: number; high?: number; low?: number };

/** Clear Alpaca-side cache entries only (shared process may also hold yahoo cache). */
export function clearAlpacaCache(): void {
  cache.flushAll();
}

export async function fetchSnapshots(symbols: string[]): Promise<Map<string, AlpacaSnapshot>> {
  const out = new Map<string, AlpacaSnapshot>();
  if (symbols.length === 0) return out;

  // Alpaca accepts comma-separated symbols; keep batches modest for URL length
  const BATCH = 50;
  for (let i = 0; i < symbols.length; i += BATCH) {
    const batch = symbols.slice(i, i + BATCH);
    try {
      const data = await alpacaGet<Record<string, AlpacaSnapshot>>("/v2/stocks/snapshots", {
        symbols: batch.join(","),
        feed: process.env.ALPACA_FEED || "iex",
      });
      for (const [sym, snap] of Object.entries(data || {})) {
        out.set(sym.toUpperCase(), snap);
      }
    } catch (e) {
      console.error("[alpaca] fetchSnapshots failed", {
        batch: batch.slice(0, 5),
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }
  return out;
}

/**
 * Daily bars for one or many symbols.
 * Multi-symbol: GET /v2/stocks/bars?symbols=A,B&timeframe=1Day
 */
export async function fetchDailyBars(
  symbols: string[],
  periodMonths: number = 12
): Promise<Map<string, PriceBar[]>> {
  const out = new Map<string, PriceBar[]>();
  if (symbols.length === 0) return out;

  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - periodMonths);
  const startStr = start.toISOString().slice(0, 10);
  const endStr = end.toISOString().slice(0, 10);

  const BATCH = 20; // multi-symbol bar payloads get large
  for (let i = 0; i < symbols.length; i += BATCH) {
    const batch = symbols.slice(i, i + BATCH);
    const uncached: string[] = [];
    for (const s of batch) {
      const key = `bars:${s}:${periodMonths}`;
      const hit = cache.get<PriceBar[]>(key);
      if (hit) out.set(s, hit);
      else uncached.push(s);
    }
    if (uncached.length === 0) continue;

    try {
      type BarsResponse = {
        bars?: Record<string, AlpacaBar[]>;
        next_page_token?: string | null;
      };
      let pageToken: string | undefined;
      const acc: Record<string, AlpacaBar[]> = {};
      for (const s of uncached) acc[s] = [];

      do {
        const params: Record<string, string> = {
          symbols: uncached.join(","),
          timeframe: "1Day",
          start: startStr,
          end: endStr,
          adjustment: "split",
          feed: process.env.ALPACA_FEED || "iex",
          limit: "10000",
        };
        if (pageToken) params.page_token = pageToken;

        const data = await alpacaGet<BarsResponse>("/v2/stocks/bars", params);
        for (const [sym, bars] of Object.entries(data.bars || {})) {
          const u = sym.toUpperCase();
          if (!acc[u]) acc[u] = [];
          acc[u].push(...bars);
        }
        pageToken = data.next_page_token || undefined;
      } while (pageToken);

      for (const s of uncached) {
        const bars = (acc[s] || []).map((b) => ({
          date: new Date(b.t),
          close: b.c ?? 0,
          volume: b.v ?? 0,
          high: b.h,
          low: b.l,
        })).filter((p) => p.close > 0);

        cache.set(`bars:${s}:${periodMonths}`, bars);
        out.set(s, bars);
      }
    } catch (e) {
      console.error("[alpaca] fetchDailyBars failed", {
        batch: uncached.slice(0, 5),
        error: e instanceof Error ? e.message : String(e),
      });
      for (const s of uncached) {
        if (!out.has(s)) out.set(s, []);
      }
    }
  }

  return out;
}

export async function getHistoricalPricesAlpaca(
  symbol: string,
  periodMonths: number = 12
): Promise<PriceBar[]> {
  const map = await fetchDailyBars([symbol.toUpperCase()], periodMonths);
  return map.get(symbol.toUpperCase()) || [];
}

/** Index proxy: SPY tracks S&P 500 (Alpaca has no ^GSPC). */
export async function getSPYHistory(months: number = 12): Promise<PriceBar[]> {
  return getHistoricalPricesAlpaca("SPY", months);
}

export interface QuoteFromAlpaca {
  symbol: string;
  shortName: string;
  regularMarketPrice: number;
  regularMarketVolume: number;
  averageDailyVolume3Month: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  marketCap: number;
  sharesOutstanding: number;
  sector: string;
  industry: string;
}

function priceFromSnapshot(snap: AlpacaSnapshot): number {
  return (
    snap.latestTrade?.p ??
    snap.dailyBar?.c ??
    snap.prevDailyBar?.c ??
    0
  );
}

function volumeFromSnapshot(snap: AlpacaSnapshot): number {
  return snap.dailyBar?.v ?? snap.minuteBar?.v ?? 0;
}

export async function getQuotesAlpaca(symbols: string[]): Promise<Map<string, QuoteFromAlpaca>> {
  const results = new Map<string, QuoteFromAlpaca>();
  const upper = symbols.map((s) => s.toUpperCase());
  const uncached: string[] = [];

  for (const s of upper) {
    const cached = cache.get<QuoteFromAlpaca>(`quote:${s}`);
    if (cached) results.set(s, cached);
    else uncached.push(s);
  }
  if (uncached.length === 0) return results;

  const [snapshots, barsMap] = await Promise.all([
    fetchSnapshots(uncached),
    fetchDailyBars(uncached, 12),
  ]);

  for (const sym of uncached) {
    try {
      const snap = snapshots.get(sym);
      const bars = barsMap.get(sym) || [];
      if (!snap && bars.length === 0) {
        cache.set(`invalid:${sym}`, true, 86400);
        continue;
      }

      const price = snap ? priceFromSnapshot(snap) : bars[bars.length - 1]?.close ?? 0;
      if (price === 0) {
        cache.set(`invalid:${sym}`, true, 86400);
        continue;
      }

      const volume = snap ? volumeFromSnapshot(snap) : bars[bars.length - 1]?.volume ?? 0;

      // 52-week high/low from daily bars
      let high52 = 0;
      let low52 = Number.POSITIVE_INFINITY;
      for (const b of bars) {
        const h = b.high ?? b.close;
        const l = b.low ?? b.close;
        if (h > high52) high52 = h;
        if (l > 0 && l < low52) low52 = l;
      }
      if (!Number.isFinite(low52) || low52 === Number.POSITIVE_INFINITY) low52 = 0;

      // ~3 month avg daily volume (63 trading days)
      const volWindow = bars.slice(-63);
      const avgVol =
        volWindow.length > 0
          ? volWindow.reduce((sum, b) => sum + b.volume, 0) / volWindow.length
          : 0;

      const mapped: QuoteFromAlpaca = {
        symbol: sym,
        shortName: sym, // Alpaca free data has no company name; UI still works
        regularMarketPrice: price,
        regularMarketVolume: volume,
        averageDailyVolume3Month: avgVol,
        fiftyTwoWeekHigh: high52,
        fiftyTwoWeekLow: low52,
        marketCap: 0,
        sharesOutstanding: 0,
        sector: "Unknown",
        industry: "Unknown",
      };

      cache.set(`quote:${sym}`, mapped);
      results.set(sym, mapped);
    } catch (e) {
      console.error("[alpaca] getQuotesAlpaca failed", {
        symbol: sym,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return results;
}

export function filterValidTickersAlpaca(symbols: string[]): {
  valid: string[];
  invalid: string[];
} {
  const valid: string[] = [];
  const invalid: string[] = [];
  for (const sym of symbols) {
    if (cache.get(`invalid:${sym.toUpperCase()}`)) invalid.push(sym);
    else valid.push(sym);
  }
  return { valid, invalid };
}

export function markInvalidAlpaca(symbol: string): void {
  cache.set(`invalid:${symbol.toUpperCase()}`, true, 86400);
}
