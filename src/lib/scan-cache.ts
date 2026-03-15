/**
 * Client-side scan results cache using localStorage.
 *
 * Stores per-symbol CAN SLIM scores with individual timestamps so
 * incremental scans can skip fresh results and only fetch new/stale tickers.
 *
 * Storage budget: ~500 bytes per stock × 600 stocks ≈ 300KB (well within 5MB limit).
 */

const STORAGE_KEY = "canslim-scan-cache";
const CACHE_VERSION = 1;
const STALE_MS = 4 * 60 * 60 * 1000; // 4 hours

export interface CachedResult {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  compositeScore: number;
  C: CriterionCache;
  A: CriterionCache;
  N: CriterionCache;
  S: CriterionCache;
  L: CriterionCache;
  I: CriterionCache;
  M: CriterionCache;
  scannedAt: string; // ISO timestamp
}

interface CriterionCache {
  pass: boolean;
  score: number;
  value: string;
  detail: string;
}

export interface MarketCache {
  trend: "uptrend" | "downtrend" | "neutral";
  sp500Price: number;
  ma200: number;
  ma50: number;
}

interface ScanCacheData {
  version: number;
  market: MarketCache | null;
  marketTimestamp: string | null;
  results: { [symbol: string]: CachedResult };
}

function emptyCache(): ScanCacheData {
  return { version: CACHE_VERSION, market: null, marketTimestamp: null, results: {} };
}

export function readCache(): ScanCacheData {
  if (typeof window === "undefined") return emptyCache();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyCache();
    const parsed = JSON.parse(raw) as ScanCacheData;
    if (parsed.version !== CACHE_VERSION) return emptyCache();
    return parsed;
  } catch {
    return emptyCache();
  }
}

function writeCache(data: ScanCacheData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full — clear and retry once
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Give up silently
    }
  }
}

/** Check if a cached result is older than the stale threshold */
export function isStale(result: CachedResult): boolean {
  const age = Date.now() - new Date(result.scannedAt).getTime();
  return age > STALE_MS;
}

/** Check if market data is stale */
export function isMarketStale(cache: ScanCacheData): boolean {
  if (!cache.marketTimestamp) return true;
  const age = Date.now() - new Date(cache.marketTimestamp).getTime();
  return age > STALE_MS;
}

/** Get human-readable time-ago string */
export function timeAgo(isoTimestamp: string): string {
  const ms = Date.now() - new Date(isoTimestamp).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/** Get all cached results as a sorted array */
export function getCachedResults(symbols?: string[]): CachedResult[] {
  const cache = readCache();
  let results = Object.values(cache.results);
  if (symbols) {
    const set = new Set(symbols);
    results = results.filter((r) => set.has(r.symbol));
  }
  return results.sort((a, b) => b.compositeScore - a.compositeScore);
}

/** Get cached market direction */
export function getCachedMarket(): MarketCache | null {
  const cache = readCache();
  return cache.market;
}

/**
 * Given a list of desired tickers, partition them into:
 * - fresh: already cached and not stale (skip scanning)
 * - stale: cached but old (rescan)
 * - missing: not in cache (must scan)
 */
export function partitionTickers(
  tickers: string[]
): { fresh: string[]; stale: string[]; missing: string[] } {
  const cache = readCache();
  const fresh: string[] = [];
  const stale: string[] = [];
  const missing: string[] = [];

  for (const t of tickers) {
    const cached = cache.results[t];
    if (!cached) {
      missing.push(t);
    } else if (isStale(cached)) {
      stale.push(t);
    } else {
      fresh.push(t);
    }
  }

  return { fresh, stale, missing };
}

/** Store a single stock result into cache */
export function cacheStockResult(result: CachedResult) {
  const cache = readCache();
  cache.results[result.symbol] = result;
  writeCache(cache);
}

/** Store market direction into cache */
export function cacheMarket(market: MarketCache) {
  const cache = readCache();
  cache.market = market;
  cache.marketTimestamp = new Date().toISOString();
  writeCache(cache);
}

/** Batch-write multiple results (more efficient than one-by-one) */
export function cacheResults(results: CachedResult[], market?: MarketCache) {
  const cache = readCache();
  for (const r of results) {
    cache.results[r.symbol] = r;
  }
  if (market) {
    cache.market = market;
    cache.marketTimestamp = new Date().toISOString();
  }
  writeCache(cache);
}

/** Clear entire cache */
export function clearCache() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

/** Get cache stats */
export function getCacheStats(): {
  totalCached: number;
  freshCount: number;
  staleCount: number;
  oldestScan: string | null;
  newestScan: string | null;
} {
  const cache = readCache();
  const all = Object.values(cache.results);
  if (all.length === 0) {
    return { totalCached: 0, freshCount: 0, staleCount: 0, oldestScan: null, newestScan: null };
  }

  let freshCount = 0;
  let staleCount = 0;
  let oldest = all[0].scannedAt;
  let newest = all[0].scannedAt;

  for (const r of all) {
    if (isStale(r)) staleCount++;
    else freshCount++;
    if (r.scannedAt < oldest) oldest = r.scannedAt;
    if (r.scannedAt > newest) newest = r.scannedAt;
  }

  return { totalCached: all.length, freshCount, staleCount, oldestScan: oldest, newestScan: newest };
}
