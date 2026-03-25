"use client";

import MarketStatus from "@/components/MarketStatus";
import StockTable from "@/components/StockTable";
import IndustryPicker from "@/components/IndustryPicker";
import { timeAgo } from "@/lib/scan-cache";
import { useScreener } from "@/hooks/useScreener";

export default function Home() {
  const {
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
  } = useScreener();

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
