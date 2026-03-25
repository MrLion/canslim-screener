import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted so mocks are available when vi.mock factory runs
const { mockQuote, mockFundamentalsTimeSeries, mockQuoteSummary, mockChart } = vi.hoisted(() => ({
  mockQuote: vi.fn(),
  mockFundamentalsTimeSeries: vi.fn(),
  mockQuoteSummary: vi.fn(),
  mockChart: vi.fn(),
}));

vi.mock("yahoo-finance2", () => {
  return {
    default: class MockYahooFinance {
      quote = mockQuote;
      fundamentalsTimeSeries = mockFundamentalsTimeSeries;
      quoteSummary = mockQuoteSummary;
      chart = mockChart;
    },
  };
});

// Mock node-cache
vi.mock("node-cache", () => {
  return {
    default: class MockNodeCache {
      private store = new Map();
      get(key: string) { return this.store.get(key); }
      set(key: string, val: unknown) { this.store.set(key, val); }
    },
  };
});

import { getQuotes, getEarnings, getHistoricalPrices, getInstitutionalHoldings } from "@/lib/yahoo";

describe("yahoo.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getQuotes", () => {
    it("maps yahoo response to StockQuote", async () => {
      mockQuote.mockResolvedValue({
        symbol: "AAPL",
        shortName: "Apple Inc",
        regularMarketPrice: 200,
        regularMarketVolume: 50000000,
        averageDailyVolume3Month: 40000000,
        fiftyTwoWeekHigh: 210,
        fiftyTwoWeekLow: 150,
        marketCap: 3e12,
        sharesOutstanding: 15e9,
        sector: "Technology",
        industry: "Consumer Electronics",
      });

      const result = await getQuotes(["AAPL"]);
      expect(result.size).toBe(1);
      const quote = result.get("AAPL");
      expect(quote?.symbol).toBe("AAPL");
      expect(quote?.regularMarketPrice).toBe(200);
    });

    it("logs error and skips failed quotes", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockQuote.mockRejectedValue(new Error("rate limited"));

      const result = await getQuotes(["FAIL"]);
      expect(result.size).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("[yahoo] getQuotes failed"),
        expect.objectContaining({ symbol: "FAIL" })
      );
      consoleSpy.mockRestore();
    });
  });

  describe("getEarnings", () => {
    it("extracts quarterly and annual EPS", async () => {
      mockFundamentalsTimeSeries.mockResolvedValue([
        { date: new Date("2026-01-01"), dilutedEPS: 2.5 },
        { date: new Date("2025-01-01"), dilutedEPS: 1.8 },
      ]);
      mockQuoteSummary.mockResolvedValue({
        earnings: {
          financialsChart: {
            yearly: [
              { date: 2025, earnings: 8.0 },
              { date: 2024, earnings: 6.0 },
            ],
          },
        },
      });

      const result = await getEarnings("AAPL");
      expect(result).not.toBeNull();
      expect(result!.quarterlyEps).toHaveLength(2);
      expect(result!.annualEps).toHaveLength(2);
    });

    it("does not cache empty results (cache poisoning fix)", async () => {
      mockFundamentalsTimeSeries.mockResolvedValue([]);
      mockQuoteSummary.mockResolvedValue({});

      const result = await getEarnings("EMPTY");
      expect(result).not.toBeNull();
      expect(result!.quarterlyEps).toHaveLength(0);
      expect(result!.annualEps).toHaveLength(0);

      // Calling again should hit the API again (not cache)
      mockFundamentalsTimeSeries.mockResolvedValue([
        { date: new Date("2026-01-01"), dilutedEPS: 1.0 },
      ]);
      const result2 = await getEarnings("EMPTY");
      expect(result2!.quarterlyEps).toHaveLength(1);
    });

    it("logs error on inner API failures", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      // Inner .catch() handlers log errors but don't throw
      mockFundamentalsTimeSeries.mockRejectedValue(new Error("timeout"));
      mockQuoteSummary.mockRejectedValue(new Error("timeout"));

      const result = await getEarnings("FAIL_INNER");
      // Both inner catches log and return null, outer function returns empty data
      expect(result).not.toBeNull();
      expect(result!.quarterlyEps).toHaveLength(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("[yahoo] fundamentalsTimeSeries failed"),
        expect.anything()
      );
      consoleSpy.mockRestore();
    });
  });

  describe("getHistoricalPrices", () => {
    it("maps chart response to price array", async () => {
      mockChart.mockResolvedValue({
        quotes: [
          { date: new Date("2026-01-01"), close: 200, volume: 1000000 },
          { date: new Date("2026-01-02"), close: 202, volume: 1100000 },
        ],
      });

      const result = await getHistoricalPrices("AAPL", 12);
      expect(result).toHaveLength(2);
      expect(result[0].close).toBe(200);
    });

    it("filters out zero-close entries", async () => {
      mockChart.mockResolvedValue({
        quotes: [
          { date: new Date("2026-01-01"), close: 200, volume: 1000000 },
          { date: new Date("2026-01-02"), close: 0, volume: 0 },
        ],
      });

      const result = await getHistoricalPrices("ZERO_TEST", 12);
      expect(result).toHaveLength(1);
    });

    it("returns empty array on error", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockChart.mockRejectedValue(new Error("network"));

      const result = await getHistoricalPrices("FAIL");
      expect(result).toEqual([]);
      consoleSpy.mockRestore();
    });
  });

  describe("getInstitutionalHoldings", () => {
    it("extracts institutional percent", async () => {
      mockQuoteSummary.mockResolvedValue({
        majorHoldersBreakdown: { institutionsPercentHeld: 0.65 },
      });

      const result = await getInstitutionalHoldings("AAPL");
      expect(result).not.toBeNull();
      expect(result!.institutionPercentHeld).toBe(0.65);
    });

    it("returns null on error", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockQuoteSummary.mockRejectedValue(new Error("fail"));

      const result = await getInstitutionalHoldings("FAIL");
      expect(result).toBeNull();
      consoleSpy.mockRestore();
    });
  });
});
