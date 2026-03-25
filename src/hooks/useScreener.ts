"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  readCache,
  getCachedResults,
  getCachedMarket,
  cacheMarket,
  partitionTickers,
  clearCache,
  getCacheStats,
  flushCacheWrites,
  type CachedResult,
  type MarketCache,
} from "@/lib/scan-cache";
import { parseSSEStream } from "@/lib/sse-parser";
import type { MarketDirection, StockResult } from "@/types";

export interface ScreenerState {
  results: StockResult[];
  market: MarketDirection | null;
  loading: boolean;
  progress: { scanned: number; total: number };
  error: string | null;
  timestamp: string | null;
  cacheInfo: {
    totalCached: number;
    freshCount: number;
    staleCount: number;
    newestScan: string | null;
  } | null;
  skippedFresh: number;
}

export interface ScreenerActions {
  handleScan: (tickers: string[] | null) => void;
  handleRescanAll: () => void;
  handleClearCache: () => void;
}

export function useScreener(): ScreenerState & ScreenerActions {
  const [results, setResults] = useState<StockResult[]>([]);
  const [market, setMarket] = useState<MarketDirection | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ scanned: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [cacheInfo, setCacheInfo] = useState<ScreenerState["cacheInfo"]>(null);
  const [skippedFresh, setSkippedFresh] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const mergedSymbolsRef = useRef<Set<string>>(new Set());

  // Load cache stats on mount
  useEffect(() => {
    const stats = getCacheStats();
    setCacheInfo(stats);

    const cachedMarket = getCachedMarket();
    if (cachedMarket) setMarket(cachedMarket);

    const cachedResults = getCachedResults();
    if (cachedResults.length > 0) {
      setResults(cachedResults);
      const cache = readCache();
      if (cache.marketTimestamp) setTimestamp(cache.marketTimestamp);
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

      let tickersToScan: string[] | null = null;
      let freshResults: CachedResult[] = [];

      if (!forceRescan && tickers) {
        const { fresh, stale, missing } = partitionTickers(tickers);
        freshResults = getCachedResults(fresh);
        tickersToScan = [...stale, ...missing];
        setSkippedFresh(fresh.length);

        if (tickersToScan.length === 0) {
          const cachedMarket = getCachedMarket();
          if (cachedMarket) setMarket(cachedMarket);
          setResults(freshResults as StockResult[]);
          setTimestamp(new Date().toISOString());
          setLoading(false);
          updateCacheInfo();
          return;
        }
      }

      if (freshResults.length > 0) {
        setResults(freshResults as StockResult[]);
        for (const r of freshResults) {
          mergedSymbolsRef.current.add(r.symbol);
        }
      } else if (forceRescan) {
        setResults([]);
      } else {
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
        const pendingCacheWrites: CachedResult[] = [];
        let marketData: MarketCache | undefined;

        for await (const { event, data } of parseSSEStream(reader)) {
          switch (event) {
            case "market":
              setMarket(data as MarketDirection);
              marketData = data as MarketCache;
              cacheMarket(data as MarketCache);
              break;
            case "stock": {
              const stockWithTimestamp: StockResult = {
                ...(data as StockResult),
                scannedAt: new Date().toISOString(),
              };
              setResults((prev) => {
                const existing = new Map(prev.map((r) => [r.symbol, r]));
                existing.set(stockWithTimestamp.symbol, stockWithTimestamp);
                const merged = [...existing.values()];
                merged.sort((a, b) => b.compositeScore - a.compositeScore);
                return merged;
              });
              pendingCacheWrites.push({
                ...(data as CachedResult),
                scannedAt: new Date().toISOString(),
              });
              if (pendingCacheWrites.length >= 10) {
                flushCacheWrites(pendingCacheWrites, marketData);
                pendingCacheWrites.length = 0;
              }
              break;
            }
            case "progress":
              setProgress(data as { scanned: number; total: number });
              break;
            case "done":
              setTimestamp((data as { timestamp: string }).timestamp);
              break;
            case "error":
              setError((data as { message: string }).message);
              break;
          }
        }

        // Flush remaining
        flushCacheWrites(pendingCacheWrites, marketData);
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

  return {
    results,
    market,
    loading,
    progress,
    error,
    timestamp,
    cacheInfo,
    skippedFresh,
    handleScan,
    handleRescanAll,
    handleClearCache,
  };
}
