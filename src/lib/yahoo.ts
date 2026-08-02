/**
 * Market data facade (kept path for import stability).
 *
 * Primary: Alpaca for OHLCV / quotes / history (N, S, L, M + charts).
 * Secondary: Yahoo Finance for fundamentals (C, A) and institutional (I),
 *            and last-resort price fallback when Alpaca is unavailable.
 */

import YahooFinance from "yahoo-finance2";
import NodeCache from "node-cache";
import {
  hasAlpacaCreds,
  getQuotesAlpaca,
  getHistoricalPricesAlpaca,
  getSPYHistory,
  clearAlpacaCache,
  filterValidTickersAlpaca,
} from "./alpaca";

const cache = new NodeCache({ stdTTL: 14400 }); // 4 hour cache

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const yf = new (YahooFinance as any)({ suppressNotices: ["yahooSurvey"] });

export interface StockQuote {
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

export interface EarningsData {
  quarterlyEps: { date: string; actual: number }[];
  annualEps: { year: number; eps: number }[];
}

export interface InstitutionalData {
  institutionPercentHeld: number;
}

/** Flush all server-side cached data (quotes, earnings, invalid markers, etc.) */
export function clearServerCache(): void {
  cache.flushAll();
  clearAlpacaCache();
}

/** Partition symbols into known-invalid (cached) vs potentially-valid */
export function filterValidTickers(symbols: string[]): { valid: string[]; invalid: string[] } {
  if (hasAlpacaCreds()) {
    return filterValidTickersAlpaca(symbols);
  }
  const valid: string[] = [];
  const invalid: string[] = [];
  for (const sym of symbols) {
    if (cache.get(`invalid:${sym}`)) invalid.push(sym);
    else valid.push(sym);
  }
  return { valid, invalid };
}

// ── Quotes (Alpaca primary) ──────────────────────────────────────────────────

export async function getQuotes(symbols: string[]): Promise<Map<string, StockQuote>> {
  if (hasAlpacaCreds()) {
    try {
      const alpacaMap = await getQuotesAlpaca(symbols);
      // Optionally enrich shortName/sector from Yahoo for display (non-blocking best-effort)
      const results = new Map<string, StockQuote>();
      for (const [sym, q] of alpacaMap) {
        results.set(sym, q);
      }
      // If Alpaca returned nothing for all, fall through to Yahoo
      if (results.size > 0 || symbols.length === 0) {
        return results;
      }
      console.warn("[market] Alpaca returned 0 quotes; falling back to Yahoo");
    } catch (e) {
      console.error("[market] Alpaca getQuotes failed, falling back to Yahoo", {
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }
  return getQuotesYahoo(symbols);
}

async function getQuotesYahoo(symbols: string[]): Promise<Map<string, StockQuote>> {
  const results = new Map<string, StockQuote>();
  const uncached: string[] = [];

  for (const s of symbols) {
    const cached = cache.get<StockQuote>(`quote:${s}`);
    if (cached) results.set(s, cached);
    else uncached.push(s);
  }

  if (uncached.length > 0) {
    const quotePromises = uncached.map(async (sym) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const q: any = await yf.quote(sym);
        if (!q || !q.symbol) {
          cache.set(`invalid:${sym}`, true, 86400);
          return;
        }
        const mapped: StockQuote = {
          symbol: q.symbol,
          shortName: q.shortName || q.longName || q.symbol,
          regularMarketPrice: q.regularMarketPrice ?? 0,
          regularMarketVolume: q.regularMarketVolume ?? 0,
          averageDailyVolume3Month: q.averageDailyVolume3Month ?? 0,
          fiftyTwoWeekHigh: q.fiftyTwoWeekHigh ?? 0,
          fiftyTwoWeekLow: q.fiftyTwoWeekLow ?? 0,
          marketCap: q.marketCap ?? 0,
          sharesOutstanding: q.sharesOutstanding ?? 0,
          sector: q.sector || "Unknown",
          industry: q.industry || "Unknown",
        };
        if (mapped.regularMarketPrice === 0) {
          cache.set(`invalid:${sym}`, true, 86400);
          return;
        }
        cache.set(`quote:${q.symbol}`, mapped);
        results.set(q.symbol, mapped);
      } catch (e) {
        console.error("[yahoo] getQuotes failed", {
          symbol: sym,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    });
    await Promise.allSettled(quotePromises);
  }

  return results;
}

// ── Historical prices (Alpaca primary; SPY for index) ────────────────────────

export async function getHistoricalPrices(
  symbol: string,
  periodMonths: number = 12
): Promise<{ date: Date; close: number; volume: number }[]> {
  // Map Yahoo index ticker to Alpaca-tradable proxy
  const alpacaSymbol = symbol === "^GSPC" ? "SPY" : symbol;

  if (hasAlpacaCreds()) {
    try {
      const bars = await getHistoricalPricesAlpaca(alpacaSymbol, periodMonths);
      if (bars.length > 0) return bars;
      console.warn("[market] Alpaca history empty; falling back to Yahoo", { symbol });
    } catch (e) {
      console.error("[market] Alpaca history failed, falling back to Yahoo", {
        symbol,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }
  return getHistoricalPricesYahoo(symbol === "SPY" ? "^GSPC" : symbol, periodMonths);
}

async function getHistoricalPricesYahoo(
  symbol: string,
  periodMonths: number = 12
): Promise<{ date: Date; close: number; volume: number }[]> {
  const cacheKey = `hist:${symbol}:${periodMonths}`;
  const cached = cache.get<{ date: Date; close: number; volume: number }[]>(cacheKey);
  if (cached) return cached;

  try {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - periodMonths);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await yf.chart(symbol, {
      period1: start,
      period2: end,
      interval: "1d",
    });

    const prices = (result.quotes || [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((q: any) => ({
        date: new Date(q.date),
        close: q.close ?? 0,
        volume: q.volume ?? 0,
      }))
      .filter((p: { close: number }) => p.close > 0);

    cache.set(cacheKey, prices);
    return prices;
  } catch (e) {
    console.error("[yahoo] getHistoricalPrices failed", {
      symbol,
      error: e instanceof Error ? e.message : String(e),
    });
    return [];
  }
}

/** Market index history for M + L (SPY via Alpaca when available). */
export async function getSP500History(months: number = 12) {
  if (hasAlpacaCreds()) {
    try {
      const spy = await getSPYHistory(months);
      if (spy.length > 0) return spy;
    } catch (e) {
      console.error("[market] SPY via Alpaca failed", {
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }
  return getHistoricalPricesYahoo("^GSPC", months);
}

// ── Fundamentals: Yahoo (Alpaca free market data has no EPS / holders) ───────

export async function getEarnings(symbol: string): Promise<EarningsData | null> {
  const cacheKey = `earnings:${symbol}`;
  const cached = cache.get<EarningsData>(cacheKey);
  if (cached) return cached;

  try {
    const [timeSeries, summary] = await Promise.all([
      yf
        .fundamentalsTimeSeries(symbol, {
          type: "quarterly" as const,
          period1: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000),
          period2: new Date(),
          module: "financials" as const,
        })
        .catch((e: unknown) => {
          console.error("[yahoo] fundamentalsTimeSeries failed", {
            symbol,
            error: e instanceof Error ? e.message : String(e),
          });
          return null;
        }),
      yf
        .quoteSummary(symbol, {
          modules: ["earnings"],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        })
        .catch((e: unknown) => {
          console.error("[yahoo] quoteSummary(earnings) failed", {
            symbol,
            error: e instanceof Error ? e.message : String(e),
          });
          return null;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as Promise<any>,
    ]);

    const quarterlyEps: { date: string; actual: number }[] = [];
    const annualEps: { year: number; eps: number }[] = [];

    if (timeSeries) {
      for (const entry of timeSeries) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const e = entry as any;
        const eps = e.dilutedEPS ?? e.basicEPS;
        if (eps != null && e.date) {
          const d = e.date instanceof Date ? e.date : new Date(e.date);
          quarterlyEps.push({
            date: d.toISOString().slice(0, 10),
            actual: eps,
          });
        }
      }
    }

    if (quarterlyEps.length === 0 && summary?.earningsHistory?.history) {
      for (const h of summary.earningsHistory.history) {
        if (h.epsActual != null && h.quarter) {
          const d = h.quarter instanceof Date ? h.quarter : new Date(h.quarter);
          quarterlyEps.push({
            date: d.toISOString().slice(0, 10),
            actual: h.epsActual,
          });
        }
      }
    }

    if (summary?.earnings?.financialsChart?.yearly) {
      for (const y of summary.earnings.financialsChart.yearly) {
        if (y.earnings != null) {
          annualEps.push({ year: y.date, eps: y.earnings });
        }
      }
    }

    const data: EarningsData = { quarterlyEps, annualEps };
    if (quarterlyEps.length > 0 || annualEps.length > 0) {
      cache.set(cacheKey, data);
    }
    return data;
  } catch (e) {
    console.error("[yahoo] getEarnings failed", {
      symbol,
      error: e instanceof Error ? e.message : String(e),
    });
    return null;
  }
}

export async function getInstitutionalHoldings(symbol: string): Promise<InstitutionalData | null> {
  const cacheKey = `inst:${symbol}`;
  const cached = cache.get<InstitutionalData>(cacheKey);
  if (cached) return cached;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await yf.quoteSummary(symbol, {
      modules: ["majorHoldersBreakdown"],
    });

    const pct = result.majorHoldersBreakdown?.institutionsPercentHeld ?? 0;
    const data: InstitutionalData = { institutionPercentHeld: pct };
    cache.set(cacheKey, data);
    return data;
  } catch (e) {
    console.error("[yahoo] getInstitutionalHoldings failed", {
      symbol,
      error: e instanceof Error ? e.message : String(e),
    });
    return null;
  }
}

export async function getSectorIndustry(symbol: string): Promise<{ sector: string; industry: string }> {
  const cacheKey = `sector:${symbol}`;
  const cached = cache.get<{ sector: string; industry: string }>(cacheKey);
  if (cached) return cached;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await yf.quoteSummary(symbol, {
      modules: ["assetProfile"],
    });
    const data = {
      sector: result.assetProfile?.sector || "Unknown",
      industry: result.assetProfile?.industry || "Unknown",
    };
    cache.set(cacheKey, data, 86400);
    return data;
  } catch (e) {
    console.error("[yahoo] getSectorIndustry failed", {
      symbol,
      error: e instanceof Error ? e.message : String(e),
    });
    return { sector: "Unknown", industry: "Unknown" };
  }
}

/** Which provider will serve price data in this process. */
export function getPriceDataProvider(): "alpaca" | "yahoo-fallback" {
  return hasAlpacaCreds() ? "alpaca" : "yahoo-fallback";
}
