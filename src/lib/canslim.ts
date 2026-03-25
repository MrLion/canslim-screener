import {
  StockQuote,
  EarningsData,
  InstitutionalData,
  getQuotes,
  getEarnings,
  getHistoricalPrices,
  getInstitutionalHoldings,
  getSP500History,
} from "./yahoo";
import type { CriterionResult, CANSLIMResult, MarketDirection } from "@/types";

export type { CriterionResult, CANSLIMResult, MarketDirection };

// C - Current Quarterly Earnings
function scoreC(earnings: EarningsData | null): CriterionResult {
  if (!earnings || earnings.quarterlyEps.length < 2) {
    return { pass: false, score: 0, value: "N/A", detail: "Insufficient quarterly data" };
  }

  const sorted = [...earnings.quarterlyEps].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sorted[0];
  // Find same quarter last year
  const latestDate = new Date(latest.date);
  const targetYear = latestDate.getFullYear() - 1;
  const yearAgo = sorted.find((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === targetYear && Math.abs(d.getMonth() - latestDate.getMonth()) <= 1;
  });

  if (!yearAgo || yearAgo.actual <= 0) {
    return { pass: false, score: 0, value: "N/A", detail: "No comparable quarter" };
  }

  const growth = ((latest.actual - yearAgo.actual) / Math.abs(yearAgo.actual)) * 100;
  const pass = growth >= 25;
  const score = Math.min(100, Math.max(0, growth * 2));

  return {
    pass,
    score,
    value: `${growth.toFixed(0)}%`,
    detail: `Q EPS: $${latest.actual.toFixed(2)} vs $${yearAgo.actual.toFixed(2)} YoY`,
  };
}

// A - Annual Earnings Growth
function scoreA(earnings: EarningsData | null): CriterionResult {
  if (!earnings || earnings.annualEps.length < 2) {
    return { pass: false, score: 0, value: "N/A", detail: "Insufficient annual data" };
  }

  const sorted = [...earnings.annualEps].sort((a, b) => b.year - a.year);
  let totalGrowth = 0;
  let count = 0;

  for (let i = 0; i < sorted.length - 1 && i < 3; i++) {
    const current = sorted[i].eps;
    const prev = sorted[i + 1].eps;
    if (prev > 0) {
      totalGrowth += ((current - prev) / prev) * 100;
      count++;
    }
  }

  if (count === 0) {
    return { pass: false, score: 0, value: "N/A", detail: "Cannot compute growth" };
  }

  const avgGrowth = totalGrowth / count;
  const pass = avgGrowth >= 25;
  const score = Math.min(100, Math.max(0, avgGrowth * 2));

  return {
    pass,
    score,
    value: `${avgGrowth.toFixed(0)}%`,
    detail: `Avg annual EPS growth over ${count} year(s)`,
  };
}

// N - New Highs (price near 52-week high)
function scoreN(quote: StockQuote): CriterionResult {
  if (!quote.fiftyTwoWeekHigh || quote.fiftyTwoWeekHigh === 0) {
    return { pass: false, score: 0, value: "N/A", detail: "No 52-week data" };
  }

  const pctFromHigh =
    ((quote.fiftyTwoWeekHigh - quote.regularMarketPrice) / quote.fiftyTwoWeekHigh) * 100;
  const pass = pctFromHigh <= 5;
  const score = Math.min(100, Math.max(0, 100 - pctFromHigh * 5));

  return {
    pass,
    score,
    value: `${pctFromHigh.toFixed(1)}%`,
    detail: `${pctFromHigh.toFixed(1)}% below 52-week high of $${quote.fiftyTwoWeekHigh.toFixed(2)}`,
  };
}

// S - Supply and Demand (volume surge)
function scoreS(quote: StockQuote): CriterionResult {
  if (!quote.averageDailyVolume3Month || quote.averageDailyVolume3Month === 0) {
    return { pass: false, score: 0, value: "N/A", detail: "No volume data" };
  }

  const volRatio = quote.regularMarketVolume / quote.averageDailyVolume3Month;
  const pass = volRatio >= 1.0;
  const score = Math.min(100, Math.max(0, volRatio * 50));

  return {
    pass,
    score,
    value: `${volRatio.toFixed(1)}x`,
    detail: `Volume ${(volRatio * 100).toFixed(0)}% of 3-month avg`,
  };
}

// L - Leader (Relative Strength)
function scoreL(
  stockPrices: { date: Date; close: number }[],
  sp500Prices: { date: Date; close: number }[]
): CriterionResult {
  if (stockPrices.length < 60 || sp500Prices.length < 60) {
    return { pass: false, score: 0, value: "N/A", detail: "Insufficient price history" };
  }

  // Calculate 6-month performance
  const stockRecent = stockPrices[stockPrices.length - 1].close;
  const stock6mo = stockPrices[Math.max(0, stockPrices.length - 126)].close;
  const sp500Recent = sp500Prices[sp500Prices.length - 1].close;
  const sp5006mo = sp500Prices[Math.max(0, sp500Prices.length - 126)].close;

  if (stock6mo <= 0 || sp5006mo <= 0) {
    return { pass: false, score: 0, value: "N/A", detail: "Invalid price data" };
  }

  const stockReturn = ((stockRecent - stock6mo) / stock6mo) * 100;
  const sp500Return = ((sp500Recent - sp5006mo) / sp5006mo) * 100;
  const relativeStrength = stockReturn - sp500Return;

  // Map relative strength to a 0-100 scale
  // RS > 0 means outperforming, scale up to max around +50%
  const rsScore = Math.min(100, Math.max(0, 50 + relativeStrength * 2));
  const pass = rsScore >= 70;

  return {
    pass,
    score: rsScore,
    value: `${rsScore.toFixed(0)}`,
    detail: `Stock: ${stockReturn.toFixed(1)}% vs S&P 500: ${sp500Return.toFixed(1)}% (6mo)`,
  };
}

// I - Institutional Sponsorship
function scoreI(inst: InstitutionalData | null): CriterionResult {
  if (!inst) {
    return { pass: false, score: 0, value: "N/A", detail: "No institutional data" };
  }

  const pct = inst.institutionPercentHeld * 100;
  const pass = pct >= 20;
  const score = Math.min(100, Math.max(0, pct * 1.25));

  return {
    pass,
    score,
    value: `${pct.toFixed(0)}%`,
    detail: `${pct.toFixed(1)}% institutional ownership`,
  };
}

// M - Market Direction
export async function getMarketDirection(): Promise<MarketDirection> {
  const prices = await getSP500History(14);
  if (prices.length < 200) {
    // Try with whatever we have
    const latest = prices.length > 0 ? prices[prices.length - 1].close : 0;
    return { trend: "neutral", sp500Price: latest, ma200: latest, ma50: latest };
  }

  const latest = prices[prices.length - 1].close;
  const ma200 =
    prices.slice(-200).reduce((sum, p) => sum + p.close, 0) / 200;
  const ma50 =
    prices.slice(-50).reduce((sum, p) => sum + p.close, 0) / 50;

  let trend: "uptrend" | "downtrend" | "neutral";
  if (latest > ma50) {
    // Above 50-day MA → confirmed uptrend (green)
    trend = "uptrend";
  } else if (latest < ma50 && latest > ma200) {
    // Below 50-day MA but above 200-day MA → caution (orange)
    trend = "neutral";
  } else {
    // Below both 50-day and 200-day MA → confirmed downtrend (red)
    trend = "downtrend";
  }

  return { trend, sp500Price: latest, ma200, ma50 };
}

function scoreM(market: MarketDirection): CriterionResult {
  const pass = market.trend === "uptrend";
  const score = market.trend === "uptrend" ? 100 : market.trend === "neutral" ? 50 : 0;

  return {
    pass,
    score,
    value: market.trend.charAt(0).toUpperCase() + market.trend.slice(1),
    detail: `S&P 500: $${market.sp500Price.toFixed(0)} | 50-MA: $${market.ma50.toFixed(0)} | 200-MA: $${market.ma200.toFixed(0)}`,
  };
}

// Score a single stock
export async function scoreStock(
  symbol: string,
  quote: StockQuote,
  sp500Prices: { date: Date; close: number }[],
  market: MarketDirection
): Promise<CANSLIMResult> {
  // Fetch earnings, prices, and institutional data in parallel
  const [earnings, stockPrices, inst] = await Promise.all([
    getEarnings(symbol),
    getHistoricalPrices(symbol, 12),
    getInstitutionalHoldings(symbol),
  ]);

  const C = scoreC(earnings);
  const A = scoreA(earnings);
  const N = scoreN(quote);
  const S = scoreS(quote);
  const L = scoreL(stockPrices, sp500Prices);
  const I = scoreI(inst);
  const M = scoreM(market);

  // Weighted composite score
  const compositeScore =
    C.score * 0.2 +
    A.score * 0.2 +
    N.score * 0.15 +
    S.score * 0.1 +
    L.score * 0.2 +
    I.score * 0.1 +
    M.score * 0.05;

  return {
    symbol,
    name: quote.shortName,
    price: quote.regularMarketPrice,
    marketCap: quote.marketCap,
    compositeScore: Math.round(compositeScore),
    C, A, N, S, L, I, M,
  };
}

// Screen a batch of tickers
export async function screenBatch(
  symbols: string[],
  sp500Prices: { date: Date; close: number }[],
  market: MarketDirection
): Promise<CANSLIMResult[]> {
  const quotes = await getQuotes(symbols);
  const results: CANSLIMResult[] = [];

  // Process stocks in parallel (limited concurrency)
  const promises = symbols.map(async (symbol) => {
    const quote = quotes.get(symbol);
    if (!quote || quote.regularMarketPrice === 0) return null;
    try {
      return await scoreStock(symbol, quote, sp500Prices, market);
    } catch (e) {
      console.error(`Error scoring ${symbol}:`, e);
      return null;
    }
  });

  const settled = await Promise.allSettled(promises);
  for (const r of settled) {
    if (r.status === "fulfilled" && r.value) {
      results.push(r.value);
    }
  }

  return results.sort((a, b) => b.compositeScore - a.compositeScore);
}
