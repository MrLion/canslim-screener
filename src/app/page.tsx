"use client";

import { useState, useCallback, useRef } from "react";
import MarketStatus from "@/components/MarketStatus";
import StockTable from "@/components/StockTable";
import IndustryPicker from "@/components/IndustryPicker";

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
}

export default function Home() {
  const [results, setResults] = useState<StockResult[]>([]);
  const [market, setMarket] = useState<MarketDirection | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ scanned: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (tickers: string[] | null = null) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setResults([]);
    setMarket(null);
    setProgress({ scanned: 0, total: 0 });
    setTimestamp(null);

    try {
      const url = tickers
        ? `/api/screen?tickers=${tickers.join(",")}`
        : "/api/screen";
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok || !res.body) throw new Error("Failed to fetch");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

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
                  break;
                case "stock":
                  setResults((prev) => {
                    const next = [...prev, data];
                    next.sort((a, b) => b.compositeScore - a.compositeScore);
                    return next;
                  });
                  break;
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
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError("Failed to load screener data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

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
          </div>
        )}

        {/* Market Direction */}
        <div className="mb-6">
          <MarketStatus market={market} />
        </div>

        {/* Industry Picker */}
        <IndustryPicker onScan={fetchData} loading={loading} />

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
