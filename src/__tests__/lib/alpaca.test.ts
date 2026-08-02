import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

vi.mock("node-cache", () => {
  return {
    default: class MockNodeCache {
      private store = new Map();
      get(key: string) {
        return this.store.get(key);
      }
      set(key: string, val: unknown) {
        this.store.set(key, val);
      }
      flushAll() {
        this.store.clear();
      }
    },
  };
});

describe("alpaca.ts", () => {
  const prevKey = process.env.ALPACA_API_KEY;
  const prevSecret = process.env.ALPACA_SECRET_KEY;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.ALPACA_API_KEY = "PK_TEST";
    process.env.ALPACA_SECRET_KEY = "SECRET_TEST";
  });

  afterEach(() => {
    if (prevKey === undefined) delete process.env.ALPACA_API_KEY;
    else process.env.ALPACA_API_KEY = prevKey;
    if (prevSecret === undefined) delete process.env.ALPACA_SECRET_KEY;
    else process.env.ALPACA_SECRET_KEY = prevSecret;
  });

  it("hasAlpacaCreds reflects env", async () => {
    const { hasAlpacaCreds } = await import("@/lib/alpaca");
    expect(hasAlpacaCreds()).toBe(true);
    delete process.env.ALPACA_API_KEY;
    // re-import won't re-read unless we check function which reads env each call
    expect(hasAlpacaCreds()).toBe(false);
  });

  it("getQuotesAlpaca maps snapshot + bars", async () => {
    fetchMock.mockImplementation(async (url: string) => {
      const u = String(url);
      if (u.includes("/snapshots")) {
        return {
          ok: true,
          json: async () => ({
            AAPL: {
              latestTrade: { p: 200 },
              dailyBar: { t: "2026-08-01T00:00:00Z", o: 198, h: 201, l: 197, c: 200, v: 50_000_000 },
            },
          }),
        };
      }
      if (u.includes("/bars")) {
        return {
          ok: true,
          json: async () => ({
            bars: {
              AAPL: [
                { t: "2025-09-01T00:00:00Z", o: 150, h: 155, l: 149, c: 154, v: 40_000_000 },
                { t: "2026-08-01T00:00:00Z", o: 198, h: 210, l: 197, c: 200, v: 50_000_000 },
              ],
            },
            next_page_token: null,
          }),
        };
      }
      return { ok: false, text: async () => "not found" };
    });

    const { getQuotesAlpaca } = await import("@/lib/alpaca");
    const map = await getQuotesAlpaca(["AAPL"]);
    const q = map.get("AAPL");
    expect(q).toBeDefined();
    expect(q!.regularMarketPrice).toBe(200);
    expect(q!.fiftyTwoWeekHigh).toBe(210);
    expect(q!.averageDailyVolume3Month).toBeGreaterThan(0);
  });
});
