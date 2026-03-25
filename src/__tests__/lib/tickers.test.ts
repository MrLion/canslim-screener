import { describe, it, expect } from "vitest";
import { ALL_TICKERS } from "@/lib/tickers";

describe("ALL_TICKERS", () => {
  it("is non-empty", () => {
    expect(ALL_TICKERS.length).toBeGreaterThan(0);
  });

  it("contains no duplicates", () => {
    const unique = new Set(ALL_TICKERS);
    expect(unique.size).toBe(ALL_TICKERS.length);
  });

  it("contains well-known tickers", () => {
    expect(ALL_TICKERS).toContain("AAPL");
    expect(ALL_TICKERS).toContain("MSFT");
    expect(ALL_TICKERS).toContain("GOOGL");
  });

  it("all tickers are uppercase strings", () => {
    for (const t of ALL_TICKERS) {
      expect(t).toBe(t.toUpperCase());
      expect(t.length).toBeGreaterThan(0);
    }
  });
});
