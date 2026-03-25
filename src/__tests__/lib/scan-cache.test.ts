import { describe, it, expect, beforeEach } from "vitest";
import {
  readCache,
  isStale,
  isStaleTimestamp,
  isMarketStale,
  timeAgo,
  getCachedResults,
  partitionTickers,
  cacheStockResult,

  clearCache,
  getCacheStats,
  flushCacheWrites,
  type CachedResult,
} from "@/lib/scan-cache";

const STORAGE_KEY = "canslim-scan-cache";

function makeCachedResult(symbol: string, scannedAt?: string): CachedResult {
  const criterion = { pass: true, score: 80, value: "80%", detail: "test" };
  return {
    symbol,
    name: `${symbol} Inc`,
    price: 100,
    marketCap: 1e9,
    compositeScore: 75,
    C: criterion,
    A: criterion,
    N: criterion,
    S: criterion,
    L: criterion,
    I: criterion,
    M: criterion,
    scannedAt: scannedAt || new Date().toISOString(),
  };
}

describe("scan-cache", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("readCache", () => {
    it("returns empty cache when nothing stored", () => {
      const cache = readCache();
      expect(cache.version).toBe(2);
      expect(cache.market).toBeNull();
      expect(Object.keys(cache.results)).toHaveLength(0);
    });

    it("returns empty cache on version mismatch", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, market: null, marketTimestamp: null, results: {} }));
      const cache = readCache();
      expect(Object.keys(cache.results)).toHaveLength(0);
    });

    it("returns empty cache on corrupt JSON", () => {
      localStorage.setItem(STORAGE_KEY, "not-json");
      const cache = readCache();
      expect(cache.version).toBe(2);
    });
  });

  describe("isStale / isStaleTimestamp", () => {
    it("marks recent results as fresh", () => {
      const result = makeCachedResult("AAPL");
      expect(isStale(result)).toBe(false);
    });

    it("marks old results as stale", () => {
      const old = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
      const result = makeCachedResult("AAPL", old);
      expect(isStale(result)).toBe(true);
    });

    it("isStaleTimestamp works with raw string", () => {
      expect(isStaleTimestamp(new Date().toISOString())).toBe(false);
      expect(isStaleTimestamp(new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString())).toBe(true);
    });

    it("boundary: exactly 24h is not stale (<=)", () => {
      // At exactly 24h, age === STALE_MS, which is > not >=
      const exactly24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      // This is right at the boundary — implementation uses >, so exactly 24h is NOT stale
      expect(isStaleTimestamp(exactly24h)).toBe(false);
    });
  });

  describe("isMarketStale", () => {
    it("returns true when no market timestamp", () => {
      const cache = readCache();
      expect(isMarketStale(cache)).toBe(true);
    });
  });

  describe("timeAgo", () => {
    it("returns 'just now' for recent timestamps", () => {
      expect(timeAgo(new Date().toISOString())).toBe("just now");
    });

    it("returns minutes for recent past", () => {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      expect(timeAgo(fiveMinAgo)).toBe("5m ago");
    });

    it("returns hours", () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      expect(timeAgo(twoHoursAgo)).toBe("2h ago");
    });

    it("returns days", () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
      expect(timeAgo(threeDaysAgo)).toBe("3d ago");
    });
  });

  describe("partitionTickers", () => {
    it("classifies fresh, stale, and missing tickers", () => {
      const fresh = makeCachedResult("AAPL");
      const staleResult = makeCachedResult("MSFT", new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString());
      cacheStockResult(fresh);
      cacheStockResult(staleResult);

      const result = partitionTickers(["AAPL", "MSFT", "GOOG"]);
      expect(result.fresh).toEqual(["AAPL"]);
      expect(result.stale).toEqual(["MSFT"]);
      expect(result.missing).toEqual(["GOOG"]);
    });
  });

  describe("getCachedResults", () => {
    it("returns all results sorted by score", () => {
      const a = makeCachedResult("AAPL");
      a.compositeScore = 90;
      const b = makeCachedResult("MSFT");
      b.compositeScore = 70;
      cacheStockResult(a);
      cacheStockResult(b);

      const results = getCachedResults();
      expect(results[0].symbol).toBe("AAPL");
      expect(results[1].symbol).toBe("MSFT");
    });

    it("filters by symbol list", () => {
      cacheStockResult(makeCachedResult("AAPL"));
      cacheStockResult(makeCachedResult("MSFT"));
      const results = getCachedResults(["AAPL"]);
      expect(results).toHaveLength(1);
      expect(results[0].symbol).toBe("AAPL");
    });
  });

  describe("flushCacheWrites", () => {
    it("writes multiple results in one operation", () => {
      const pending = [makeCachedResult("AAPL"), makeCachedResult("MSFT")];
      flushCacheWrites(pending);
      const results = getCachedResults();
      expect(results).toHaveLength(2);
    });

    it("includes market data when provided", () => {
      const market = { trend: "uptrend" as const, sp500Price: 5000, ma200: 4800, ma50: 4900 };
      flushCacheWrites([makeCachedResult("AAPL")], market);
      const cache = readCache();
      expect(cache.market?.trend).toBe("uptrend");
      expect(cache.marketTimestamp).toBeTruthy();
    });
  });

  describe("clearCache", () => {
    it("removes all cached data", () => {
      cacheStockResult(makeCachedResult("AAPL"));
      clearCache();
      const results = getCachedResults();
      expect(results).toHaveLength(0);
    });
  });

  describe("getCacheStats", () => {
    it("returns zero stats for empty cache", () => {
      const stats = getCacheStats();
      expect(stats.totalCached).toBe(0);
      expect(stats.freshCount).toBe(0);
      expect(stats.staleCount).toBe(0);
    });

    it("counts fresh and stale correctly", () => {
      cacheStockResult(makeCachedResult("AAPL"));
      cacheStockResult(makeCachedResult("MSFT", new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString()));
      const stats = getCacheStats();
      expect(stats.totalCached).toBe(2);
      expect(stats.freshCount).toBe(1);
      expect(stats.staleCount).toBe(1);
    });
  });
});
