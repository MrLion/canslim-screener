import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

// Mock scan-cache
vi.mock("@/lib/scan-cache", () => ({
  readCache: vi.fn(() => ({ version: 2, market: null, marketTimestamp: null, results: {} })),
  getCachedResults: vi.fn(() => []),
  getCachedMarket: vi.fn(() => null),
  cacheMarket: vi.fn(),
  partitionTickers: vi.fn(() => ({ fresh: [], stale: [], missing: [] })),
  clearCache: vi.fn(),
  getCacheStats: vi.fn(() => ({ totalCached: 0, freshCount: 0, staleCount: 0, newestScan: null })),
  flushCacheWrites: vi.fn(),
}));

// Mock sse-parser
vi.mock("@/lib/sse-parser", () => ({
  parseSSEStream: vi.fn(),
}));

import { useScreener } from "@/hooks/useScreener";
import { getCachedResults, getCachedMarket, getCacheStats } from "@/lib/scan-cache";
import { parseSSEStream } from "@/lib/sse-parser";

const mockGetCachedResults = vi.mocked(getCachedResults);
const mockGetCachedMarket = vi.mocked(getCachedMarket);
const mockGetCacheStats = vi.mocked(getCacheStats);
const mockParseSSEStream = vi.mocked(parseSSEStream);

describe("useScreener", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCacheStats.mockReturnValue({ totalCached: 0, freshCount: 0, staleCount: 0, oldestScan: null, newestScan: null });
    // Reset fetch mock
    global.fetch = vi.fn();
  });

  it("initializes with empty state", () => {
    const { result } = renderHook(() => useScreener());

    expect(result.current.results).toEqual([]);
    expect(result.current.market).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.failedCount).toBe(0);
  });

  it("restores cached results on mount", () => {
    const cachedMarket = { trend: "uptrend" as const, sp500Price: 5500, ma200: 5200, ma50: 5400 };
    mockGetCachedMarket.mockReturnValue(cachedMarket);
    mockGetCachedResults.mockReturnValue([
      {
        symbol: "AAPL", name: "Apple", price: 200, marketCap: 3e12, compositeScore: 80,
        C: { pass: true, score: 80, value: "80%", detail: "" },
        A: { pass: true, score: 80, value: "80%", detail: "" },
        N: { pass: true, score: 80, value: "80%", detail: "" },
        S: { pass: true, score: 80, value: "80%", detail: "" },
        L: { pass: true, score: 80, value: "80%", detail: "" },
        I: { pass: true, score: 80, value: "80%", detail: "" },
        M: { pass: true, score: 80, value: "80%", detail: "" },
        scannedAt: new Date().toISOString(),
      },
    ]);
    mockGetCacheStats.mockReturnValue({ totalCached: 1, freshCount: 1, staleCount: 0, oldestScan: null, newestScan: null });

    const { result } = renderHook(() => useScreener());

    expect(result.current.market).toEqual(cachedMarket);
    expect(result.current.results).toHaveLength(1);
    expect(result.current.results[0].symbol).toBe("AAPL");
  });

  it("sets error on network failure", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("network error"));

    const { result } = renderHook(() => useScreener());

    await act(async () => {
      result.current.handleScan(null);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("Failed to load screener data. Please try again.");
    });
  });

  it("clears state on handleClearCache", () => {
    const { result } = renderHook(() => useScreener());

    act(() => {
      result.current.handleClearCache();
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.market).toBeNull();
    expect(result.current.timestamp).toBeNull();
  });
});
