import YahooFinance from "yahoo-finance2";
import NodeCache from "node-cache";

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
}

export interface EarningsData {
  quarterlyEps: { date: string; actual: number }[];
  annualEps: { year: number; eps: number }[];
}

export interface InstitutionalData {
  institutionPercentHeld: number;
}

export async function getQuotes(symbols: string[]): Promise<Map<string, StockQuote>> {
  const results = new Map<string, StockQuote>();
  const uncached: string[] = [];

  for (const s of symbols) {
    const cached = cache.get<StockQuote>(`quote:${s}`);
    if (cached) {
      results.set(s, cached);
    } else {
      uncached.push(s);
    }
  }

  if (uncached.length > 0) {
    const quotePromises = uncached.map(async (sym) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const q: any = await yf.quote(sym);
        if (!q || !q.symbol) return;
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
        };
        cache.set(`quote:${q.symbol}`, mapped);
        results.set(q.symbol, mapped);
      } catch {
        // skip failed quote
      }
    });
    await Promise.allSettled(quotePromises);
  }

  return results;
}

export async function getEarnings(symbol: string): Promise<EarningsData | null> {
  const cacheKey = `earnings:${symbol}`;
  const cached = cache.get<EarningsData>(cacheKey);
  if (cached) return cached;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await yf.quoteSummary(symbol, {
      modules: ["earnings", "earningsHistory", "financialData"],
    });

    const quarterlyEps: { date: string; actual: number }[] = [];
    const annualEps: { year: number; eps: number }[] = [];

    if (result.earningsHistory?.history) {
      for (const h of result.earningsHistory.history) {
        if (h.epsActual != null && h.quarter) {
          const d = h.quarter instanceof Date ? h.quarter : new Date(h.quarter);
          quarterlyEps.push({
            date: d.toISOString().slice(0, 10),
            actual: h.epsActual,
          });
        }
      }
    }

    if (result.earnings?.financialsChart?.yearly) {
      for (const y of result.earnings.financialsChart.yearly) {
        if (y.earnings != null) {
          annualEps.push({ year: y.date, eps: y.earnings });
        }
      }
    }

    const data: EarningsData = { quarterlyEps, annualEps };
    cache.set(cacheKey, data);
    return data;
  } catch {
    return null;
  }
}

export async function getHistoricalPrices(
  symbol: string,
  months: number = 12
): Promise<{ date: Date; close: number; volume: number }[]> {
  const cacheKey = `hist:${symbol}:${months}`;
  const cached = cache.get<{ date: Date; close: number; volume: number }[]>(cacheKey);
  if (cached) return cached;

  try {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);

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
  } catch {
    return [];
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
  } catch {
    return null;
  }
}

export async function getSP500History(months: number = 12) {
  return getHistoricalPrices("^GSPC", months);
}
