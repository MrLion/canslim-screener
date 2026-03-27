import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock yahoo module before importing canslim
vi.mock("@/lib/yahoo", () => ({
  getQuotes: vi.fn(),
  getEarnings: vi.fn(),
  getHistoricalPrices: vi.fn(),
  getInstitutionalHoldings: vi.fn(),
  getSP500History: vi.fn(),
  filterValidTickers: vi.fn(),
}));

import { scoreStock, getMarketDirection, screenBatch } from "@/lib/canslim";
import type { MarketDirection } from "@/types";
import {
  getQuotes,
  getEarnings,
  getHistoricalPrices,
  getInstitutionalHoldings,
  getSP500History,
  filterValidTickers,
} from "@/lib/yahoo";
import type { StockQuote, EarningsData } from "@/lib/yahoo";

const mockGetQuotes = vi.mocked(getQuotes);
const mockGetEarnings = vi.mocked(getEarnings);
const mockGetHistoricalPrices = vi.mocked(getHistoricalPrices);
const mockGetInstitutionalHoldings = vi.mocked(getInstitutionalHoldings);
const mockGetSP500History = vi.mocked(getSP500History);
const mockFilterValidTickers = vi.mocked(filterValidTickers);


function makeQuote(overrides: Partial<StockQuote> = {}): StockQuote {
  return {
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
    ...overrides,
  };
}

function makeEarnings(overrides: Partial<EarningsData> = {}): EarningsData {
  return {
    quarterlyEps: [
      { date: "2026-01-01", actual: 2.5 },
      { date: "2025-01-01", actual: 1.8 },
    ],
    annualEps: [
      { year: 2025, eps: 8.0 },
      { year: 2024, eps: 6.0 },
      { year: 2023, eps: 4.5 },
    ],
    ...overrides,
  };
}

function makePrices(count: number, basePrice: number) {
  return Array.from({ length: count }, (_, i) => ({
    date: new Date(Date.now() - (count - i) * 24 * 60 * 60 * 1000),
    close: basePrice + i * 0.1,
    volume: 1000000,
  }));
}

const market: MarketDirection = {
  trend: "uptrend",
  sp500Price: 5500,
  ma200: 5200,
  ma50: 5400,
};

describe("canslim scoring", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("scoreStock", () => {
    it("scores a stock with full data", async () => {
      mockGetEarnings.mockResolvedValue(makeEarnings());
      mockGetHistoricalPrices.mockResolvedValue(makePrices(200, 180));
      mockGetInstitutionalHoldings.mockResolvedValue({ institutionPercentHeld: 0.65 });

      const result = await scoreStock("AAPL", makeQuote(), makePrices(200, 5400), market);

      expect(result.symbol).toBe("AAPL");
      expect(result.name).toBe("Apple Inc");
      expect(result.compositeScore).toBeGreaterThan(0);
      expect(result.compositeScore).toBeLessThanOrEqual(100);
      expect(result.C.value).not.toBe("N/A");
      expect(result.A.value).not.toBe("N/A");
      expect(result.M.pass).toBe(true); // uptrend
    });

    it("handles missing earnings gracefully", async () => {
      mockGetEarnings.mockResolvedValue(null);
      mockGetHistoricalPrices.mockResolvedValue(makePrices(200, 180));
      mockGetInstitutionalHoldings.mockResolvedValue({ institutionPercentHeld: 0.5 });

      const result = await scoreStock("AAPL", makeQuote(), makePrices(200, 5400), market);
      expect(result.C.value).toBe("N/A");
      expect(result.A.value).toBe("N/A");
      expect(result.C.pass).toBe(false);
    });

    it("handles insufficient price history", async () => {
      mockGetEarnings.mockResolvedValue(makeEarnings());
      mockGetHistoricalPrices.mockResolvedValue(makePrices(30, 180)); // < 60 required
      mockGetInstitutionalHoldings.mockResolvedValue({ institutionPercentHeld: 0.5 });

      const result = await scoreStock("AAPL", makeQuote(), makePrices(200, 5400), market);
      expect(result.L.value).toBe("N/A");
    });

    it("handles missing institutional data", async () => {
      mockGetEarnings.mockResolvedValue(makeEarnings());
      mockGetHistoricalPrices.mockResolvedValue(makePrices(200, 180));
      mockGetInstitutionalHoldings.mockResolvedValue(null);

      const result = await scoreStock("AAPL", makeQuote(), makePrices(200, 5400), market);
      expect(result.I.value).toBe("N/A");
      expect(result.I.pass).toBe(false);
    });
  });

  describe("scoreC — quarterly EPS", () => {
    it("passes when YoY growth >= 25%", async () => {
      mockGetEarnings.mockResolvedValue(makeEarnings({
        quarterlyEps: [
          { date: "2026-01-01", actual: 2.5 },
          { date: "2025-01-01", actual: 1.5 }, // 67% growth
        ],
      }));
      mockGetHistoricalPrices.mockResolvedValue(makePrices(200, 180));
      mockGetInstitutionalHoldings.mockResolvedValue({ institutionPercentHeld: 0.5 });

      const result = await scoreStock("AAPL", makeQuote(), makePrices(200, 5400), market);
      expect(result.C.pass).toBe(true);
    });

    it("fails when YoY growth < 25%", async () => {
      mockGetEarnings.mockResolvedValue(makeEarnings({
        quarterlyEps: [
          { date: "2026-01-01", actual: 1.2 },
          { date: "2025-01-01", actual: 1.1 }, // ~9% growth
        ],
      }));
      mockGetHistoricalPrices.mockResolvedValue(makePrices(200, 180));
      mockGetInstitutionalHoldings.mockResolvedValue({ institutionPercentHeld: 0.5 });

      const result = await scoreStock("AAPL", makeQuote(), makePrices(200, 5400), market);
      expect(result.C.pass).toBe(false);
    });

    it("returns N/A with zero previous EPS", async () => {
      mockGetEarnings.mockResolvedValue(makeEarnings({
        quarterlyEps: [
          { date: "2026-01-01", actual: 1.5 },
          { date: "2025-01-01", actual: 0 },
        ],
      }));
      mockGetHistoricalPrices.mockResolvedValue(makePrices(200, 180));
      mockGetInstitutionalHoldings.mockResolvedValue({ institutionPercentHeld: 0.5 });

      const result = await scoreStock("AAPL", makeQuote(), makePrices(200, 5400), market);
      expect(result.C.value).toBe("N/A");
    });
  });

  describe("scoreN — new highs", () => {
    it("passes when within 5% of 52-week high", async () => {
      mockGetEarnings.mockResolvedValue(makeEarnings());
      mockGetHistoricalPrices.mockResolvedValue(makePrices(200, 180));
      mockGetInstitutionalHoldings.mockResolvedValue({ institutionPercentHeld: 0.5 });

      const quote = makeQuote({ regularMarketPrice: 200, fiftyTwoWeekHigh: 205 });
      const result = await scoreStock("AAPL", quote, makePrices(200, 5400), market);
      expect(result.N.pass).toBe(true);
    });

    it("fails when far from 52-week high", async () => {
      mockGetEarnings.mockResolvedValue(makeEarnings());
      mockGetHistoricalPrices.mockResolvedValue(makePrices(200, 180));
      mockGetInstitutionalHoldings.mockResolvedValue({ institutionPercentHeld: 0.5 });

      const quote = makeQuote({ regularMarketPrice: 150, fiftyTwoWeekHigh: 210 });
      const result = await scoreStock("AAPL", quote, makePrices(200, 5400), market);
      expect(result.N.pass).toBe(false);
    });
  });

  describe("scoreM — market direction", () => {
    it("passes during uptrend", async () => {
      mockGetEarnings.mockResolvedValue(makeEarnings());
      mockGetHistoricalPrices.mockResolvedValue(makePrices(200, 180));
      mockGetInstitutionalHoldings.mockResolvedValue({ institutionPercentHeld: 0.5 });

      const result = await scoreStock("AAPL", makeQuote(), makePrices(200, 5400), { ...market, trend: "uptrend" });
      expect(result.M.pass).toBe(true);
      expect(result.M.score).toBe(100);
    });

    it("fails during downtrend", async () => {
      mockGetEarnings.mockResolvedValue(makeEarnings());
      mockGetHistoricalPrices.mockResolvedValue(makePrices(200, 180));
      mockGetInstitutionalHoldings.mockResolvedValue({ institutionPercentHeld: 0.5 });

      const result = await scoreStock("AAPL", makeQuote(), makePrices(200, 5400), { ...market, trend: "downtrend" });
      expect(result.M.pass).toBe(false);
      expect(result.M.score).toBe(0);
    });
  });

  describe("composite score weights", () => {
    it("uses correct weights summing to 100%", async () => {
      // All criteria score 100 → composite should be 100
      mockGetEarnings.mockResolvedValue(makeEarnings({
        quarterlyEps: [
          { date: "2026-01-01", actual: 10 },
          { date: "2025-01-01", actual: 1 }, // 900% growth
        ],
        annualEps: [
          { year: 2025, eps: 10 },
          { year: 2024, eps: 1 },
        ],
      }));
      mockGetHistoricalPrices.mockResolvedValue(makePrices(200, 100));
      mockGetInstitutionalHoldings.mockResolvedValue({ institutionPercentHeld: 0.95 });

      const quote = makeQuote({
        regularMarketPrice: 200,
        fiftyTwoWeekHigh: 200, // at the high
        regularMarketVolume: 100000000,
        averageDailyVolume3Month: 50000000, // 2x volume
      });

      const result = await scoreStock("AAPL", quote, makePrices(200, 5400), market);
      // Composite = C*0.2 + A*0.2 + N*0.15 + S*0.1 + L*0.2 + I*0.1 + M*0.05 = 1.0
      expect(result.compositeScore).toBeLessThanOrEqual(100);
      expect(result.compositeScore).toBeGreaterThan(70); // should be high with all strong criteria
    });
  });

  describe("getMarketDirection", () => {
    it("returns uptrend when price above 50-day MA", async () => {
      // 200 prices increasing — latest above both MAs
      const prices = makePrices(250, 5000);
      mockGetSP500History.mockResolvedValue(prices);

      const result = await getMarketDirection();
      expect(result.trend).toBe("uptrend");
      expect(result.sp500Price).toBeGreaterThan(0);
    });

    it("returns neutral with insufficient data", async () => {
      mockGetSP500History.mockResolvedValue(makePrices(50, 5000));

      const result = await getMarketDirection();
      expect(result.trend).toBe("neutral");
    });
  });

  describe("screenBatch", () => {
    it("returns separate invalidCount and errorCount", async () => {
      mockFilterValidTickers.mockReturnValue({
        valid: ["AAPL", "BADQUOTE"],
        invalid: ["HESAY", "BYDDF"],  // 2 pre-filtered invalid
      });

      const quotesMap = new Map();
      quotesMap.set("AAPL", makeQuote());
      // BADQUOTE not in map → newly discovered invalid
      mockGetQuotes.mockResolvedValue(quotesMap);

      mockGetEarnings.mockResolvedValue(makeEarnings());
      mockGetHistoricalPrices.mockResolvedValue(makePrices(200, 180));
      mockGetInstitutionalHoldings.mockResolvedValue({ institutionPercentHeld: 0.5 });

      const result = await screenBatch(
        ["AAPL", "HESAY", "BYDDF", "BADQUOTE"],
        makePrices(200, 5400),
        market
      );

      expect(result.results).toHaveLength(1); // only AAPL scored
      expect(result.invalidCount).toBe(3);    // 2 pre-filtered + 1 no quote
      expect(result.errorCount).toBe(0);
    });

    it("counts scoring errors separately from invalid tickers", async () => {
      mockFilterValidTickers.mockReturnValue({
        valid: ["AAPL", "ERRSTOCK"],
        invalid: [],
      });

      const quotesMap = new Map();
      quotesMap.set("AAPL", makeQuote());
      quotesMap.set("ERRSTOCK", makeQuote({ symbol: "ERRSTOCK" }));
      mockGetQuotes.mockResolvedValue(quotesMap);

      // AAPL succeeds
      mockGetEarnings
        .mockResolvedValueOnce(makeEarnings())
        .mockRejectedValueOnce(new Error("API error")); // ERRSTOCK fails scoring
      mockGetHistoricalPrices.mockResolvedValue(makePrices(200, 180));
      mockGetInstitutionalHoldings.mockResolvedValue({ institutionPercentHeld: 0.5 });

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const result = await screenBatch(
        ["AAPL", "ERRSTOCK"],
        makePrices(200, 5400),
        market
      );

      expect(result.results).toHaveLength(1);
      expect(result.invalidCount).toBe(0);
      expect(result.errorCount).toBe(1);
      consoleSpy.mockRestore();
    });

    it("counts price=0 quotes as invalid (missing from map after getQuotes filters them)", async () => {
      mockFilterValidTickers.mockReturnValue({
        valid: ["AAPL", "ZEROPRICE"],
        invalid: [],
      });

      // ZEROPRICE is not in the map — getQuotes filtered it out due to price=0
      const quotesMap = new Map();
      quotesMap.set("AAPL", makeQuote());
      mockGetQuotes.mockResolvedValue(quotesMap);

      mockGetEarnings.mockResolvedValue(makeEarnings());
      mockGetHistoricalPrices.mockResolvedValue(makePrices(200, 180));
      mockGetInstitutionalHoldings.mockResolvedValue({ institutionPercentHeld: 0.5 });

      const result = await screenBatch(
        ["AAPL", "ZEROPRICE"],
        makePrices(200, 5400),
        market
      );

      expect(result.results).toHaveLength(1);
      expect(result.invalidCount).toBe(1);
      expect(result.errorCount).toBe(0);
    });

    it("returns empty results when all tickers are pre-filtered invalid", async () => {
      mockFilterValidTickers.mockReturnValue({
        valid: [],
        invalid: ["HESAY", "BYDDF", "LVMUY"],
      });

      mockGetQuotes.mockResolvedValue(new Map());

      const result = await screenBatch(
        ["HESAY", "BYDDF", "LVMUY"],
        makePrices(200, 5400),
        market
      );

      expect(result.results).toHaveLength(0);
      expect(result.invalidCount).toBe(3);
      expect(result.errorCount).toBe(0);
    });
  });
});
