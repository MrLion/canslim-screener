"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import MarketStatus from "@/components/MarketStatus";
import StockTable from "@/components/StockTable";
import IndustryPicker from "@/components/IndustryPicker";
import {
  readCache,
  getCachedResults,
  getCachedMarket,
  cacheStockResult,
  cacheMarket,
  partitionTickers,
  clearCache,
  getCacheStats,
  timeAgo,
  type CachedResult,
  type MarketCache,
} from "@/lib/scan-cache";

interface MarketDirection {
  trend: "uptrend" | "downtrend" | "neutral";
  sp500Price: number;
  ma200: number;
  ma50: number;
}

interface CriterionResult {
  pass: boolean;
  score: number;
  value: string;
  detail: string;
}

export interface StockResult {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  compositeScore: number;
  C: CriterionResult;
  A: CriterionResult;
  N: CriterionResult;
  S: CriterionResult;
  L: CriterionResult;
  I: CriterionResult;
  M: CriterionResult;
  scannedAt?: string;
}

function toStockResult(cached: CachedResult): StockResult {
  return { ...cached };
}

export default function Home() {
  const [results, setResults] = useState<StockResult[]>([]);
  const [market, setMarket] = useState<MarketDirection | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ scanned: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [cacheInfo, setCacheInfo] = useState<{
    totalCached: number;
    freshCount: number;
    staleCount: number;
    newestScan: string | null;
  } | null>(null);
  const [skippedFresh, setSkippedFresh] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  // Track symbols that were merged from cache for this display session
  const mergedSymbolsRef = useRef<Set<string>>(new Set());

  // Load cache stats on mount
  useEffect(() => {
    const stats = getCacheStats();
    setCacheInfo(stats);

    // Restore cached market data
    const cachedMarket = getCachedMarket();
    if (cachedMarket) {
      setMarket(cachedMarket);
    }

    // Restore cached results
    const cachedResults = getCachedResults();
    if (cachedResults.length > 0) {
      setResults(cachedResults.map(toStockResult));
      const cache = readCache();
      if (cache.marketTimestamp) {
        setTimestamp(cache.marketTimestamp);
      }
    }
  }, []);

  const updateCacheInfo = useCallback(() => {
    setCacheInfo(getCacheStats());
  }, []);

  const fetchData = useCallback(
    async (tickers: string[] | null = null, forceRescan = false) => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);
      setSkippedFresh(0);
      mergedSymbolsRef.current = new Set();

      // Determine which tickers actually need scanning
      let tickersToScan: string[] | null = null;
      let freshResults: CachedResult[] = [];

      if (!forceRescan && tickers) {
        const { fresh, stale, missing } = partitionTickers(tickers);
        freshResults = getCachedResults(fresh);
        tickersToScan = [...stale, ...missing];
        setSkippedFresh(fresh.length);

        if (tickersToScan.length === 0) {
          // Everything is fresh — just display cached results
          const cachedMarket = getCachedMarket();
          if (cachedMarket) setMarket(cachedMarket);
          setResults(freshResults.map(toStockResult));
          setTimestamp(new Date().toISOString());
          setLoading(false);
          updateCacheInfo();
          return;
        }
      }

      // Start with fresh cached results (they'll be merged with new ones)
      if (freshResults.length > 0) {
        setResults(freshResults.map(toStockResult));
        for (const r of freshResults) {
          mergedSymbolsRef.current.add(r.symbol);
        }
      } else if (forceRescan) {
        setResults([]);
      } else {
        // Keep existing results visible, new ones will merge in
        // but clear if doing a full scan (tickers === null)
        if (tickers === null) setResults([]);
      }

      setProgress({ scanned: 0, total: 0 });

      try {
        const url = tickersToScan
          ? `/api/screen?tickers=${tickersToScan.join(",")}`
          : tickers === null
          ? "/api/screen"
          : `/api/screen?tickers=${tickers.join(",")}`;

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok || !res.body) throw new Error("Failed to fetch");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        // Batch cache writes for efficiency
        const pendingCacheWrites: CachedResult[] = [];
        let marketData: MarketCache | undefined;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          let eventType = "";
          for (const line of lines) {
            if (line.startsWith("event: ")) {
              eventType = line.slice(7);
            } else if (line.startsWith("data: ") && eventType) {
              try {
                const data = JSON.parse(line.slice(6));
                switch (eventType) {
                  case "market":
                    setMarket(data);
                    marketData = data;
                    cacheMarket(data);
                    break;
                  case "stock": {
                    const stockWithTimestamp: StockResult = {
                      ...data,
                      scannedAt: new Date().toISOString(),
                    };
                    setResults((prev) => {
                      // Merge: replace if exists, append if new
                      const existing = new Map(prev.map((r) => [r.symbol, r]));
                      existing.set(stockWithTimestamp.symbol, stockWithTimestamp);
                      const merged = [...existing.values()];
                      merged.sort((a, b) => b.compositeScore - a.compositeScore);
                      return merged;
                    });
                    // Queue for batch cache write
                    pendingCacheWrites.push({
                      ...data,
                      scannedAt: new Date().toISOString(),
                    });
                    // Flush cache every 10 results
                    if (pendingCacheWrites.length >= 10) {
                      const cache = readCache();
                      for (const r of pendingCacheWrites) {
                        cache.results[r.symbol] = r;
                      }
                      if (marketData) {
                        cache.market = marketData;
                        cache.marketTimestamp = new Date().toISOString();
                      }
                      localStorage.setItem(
                        "canslim-scan-cache",
                        JSON.stringify(cache)
                      );
                      pendingCacheWrites.length = 0;
                    }
                    break;
                  }
                  case "progress":
                    setProgress(data);
                    break;
                  case "done":
                    setTimestamp(data.timestamp);
                    break;
                  case "error":
                    setError(data.message);
                    break;
                }
              } catch {
                // skip malformed JSON
              }
              eventType = "";
            }
          }
        }

        // Flush remaining cache writes
        if (pendingCacheWrites.length > 0) {
          const cache = readCache();
          for (const r of pendingCacheWrites) {
            cache.results[r.symbol] = r;
          }
          if (marketData) {
            cache.market = marketData;
            cache.marketTimestamp = new Date().toISOString();
          }
          localStorage.setItem("canslim-scan-cache", JSON.stringify(cache));
        }

        updateCacheInfo();
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setError("Failed to load screener data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [updateCacheInfo]
  );

  const handleScan = useCallback(
    (tickers: string[] | null) => {
      fetchData(tickers, false);
    },
    [fetchData]
  );

  const handleRescanAll = useCallback(() => {
    clearCache();
    updateCacheInfo();
    setResults([]);
    setMarket(null);
    setSkippedFresh(0);
    fetchData(null, true);
  }, [fetchData, updateCacheInfo]);

  const handleClearCache = useCallback(() => {
    clearCache();
    updateCacheInfo();
    setResults([]);
    setMarket(null);
    setTimestamp(null);
    setSkippedFresh(0);
  }, [updateCacheInfo]);

  const started = loading || results.length > 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              CAN SLIM Screener
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Stocks ranked by William O&apos;Neil&apos;s CAN SLIM methodology
            </p>
          </div>
          <div className="flex items-center gap-3">
            {progress.total > 0 && (
              <span className="text-xs text-gray-600">
                {loading
                  ? `${progress.scanned}/${progress.total} scanned`
                  : `${results.length} stocks scored`}
                {timestamp &&
                  ` | ${new Date(timestamp).toLocaleTimeString()}`}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {loading && progress.total > 0 && (
          <div className="mb-4">
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{
                  width: `${(progress.scanned / progress.total) * 100}%`,
                }}
              />
            </div>
            {skippedFresh > 0 && (
              <p className="text-[10px] text-gray-600 mt-1">
                {skippedFresh} stocks loaded from cache &middot; scanning {progress.total} new/stale
              </p>
            )}
          </div>
        )}

        {/* Market Direction */}
        <div className="mb-6">
          <MarketStatus market={market} />
        </div>

        {/* Industry Picker */}
        <IndustryPicker onScan={handleScan} loading={loading} />

        {/* Cache Status Bar */}
        {cacheInfo && cacheInfo.totalCached > 0 && !loading && (
          <div className="flex items-center justify-between px-4 py-2 mb-4 bg-gray-900/50 border border-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500/70" />
                <span className="text-xs text-gray-400">
                  {cacheInfo.totalCached} stocks cached
                </span>
              </div>
              {cacheInfo.staleCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
                  <span className="text-xs text-gray-500">
                    {cacheInfo.staleCount} stale
                  </span>
                </div>
              )}
              {cacheInfo.newestScan && (
                <span className="text-[10px] text-gray-600">
                  Last scan: {timeAgo(cacheInfo.newestScan)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRescanAll}
                className="text-[11px] text-gray-500 hover:text-blue-400 transition-colors"
              >
                Rescan All
              </button>
              <span className="text-gray-800">|</span>
              <button
                onClick={handleClearCache}
                className="text-[11px] text-gray-500 hover:text-red-400 transition-colors"
              >
                Clear Cache
              </button>
            </div>
          </div>
        )}

        {/* Loading State (before any results arrive) */}
        {loading && results.length === 0 && progress.scanned === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">
              Fetching market data and S&P 500 history...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && <StockTable results={results} />}

        {/* Legend */}
        {results.length > 0 && (
          <div className="mt-8 border-t border-gray-800 pt-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              CAN SLIM Criteria
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-500">
              <div>
                <span className="font-bold text-gray-400">C</span> — Current
                quarterly EPS growth {">"}25%
              </div>
              <div>
                <span className="font-bold text-gray-400">A</span> — Annual
                earnings growth {">"}25%
              </div>
              <div>
                <span className="font-bold text-gray-400">N</span> — New
                52-week price high (within 5%)
              </div>
              <div>
                <span className="font-bold text-gray-400">S</span> — Supply:
                volume vs 3-month average
              </div>
              <div>
                <span className="font-bold text-gray-400">L</span> — Leader:
                relative strength vs S&P 500
              </div>
              <div>
                <span className="font-bold text-gray-400">I</span> —
                Institutional ownership {">"}20%
              </div>
              <div>
                <span className="font-bold text-gray-400">M</span> — Market
                direction (S&P 500 trend)
              </div>
              <div>
                <span className="font-bold text-gray-400">Score</span> —
                Weighted composite (0-100)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
