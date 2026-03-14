"use client";

import { useState, useEffect } from "react";

interface IndustryGroup {
  symbol: string;
  name: string;
  tickers: string[];
  count: number;
}

interface SectorMap {
  [sector: string]: IndustryGroup[];
}

interface APIResponse {
  sectors: SectorMap;
  totalGroups: number;
  totalTickers: number;
  tickersAssigned: number;
}

interface IndustryPickerProps {
  onScan: (tickers: string[] | null) => void;
  loading: boolean;
}

export default function IndustryPicker({ onScan, loading }: IndustryPickerProps) {
  const [data, setData] = useState<APIResponse | null>(null);
  const [fetchingIndustries, setFetchingIndustries] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(new Set());

  useEffect(() => {
    setFetchingIndustries(true);
    fetch("/api/industries")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((d) => setData(d))
      .catch(() => setError("Failed to load industry groups"))
      .finally(() => setFetchingIndustries(false));
  }, []);

  const toggleSector = (sector: string) => {
    setExpandedSectors((prev) => {
      const next = new Set(prev);
      if (next.has(sector)) next.delete(sector);
      else next.add(sector);
      return next;
    });
  };

  const toggleGroup = (symbol: string) => {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) next.delete(symbol);
      else next.add(symbol);
      return next;
    });
  };

  const selectAllInSector = (sector: string) => {
    if (!data) return;
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      for (const group of data.sectors[sector]) {
        next.add(group.symbol);
      }
      return next;
    });
  };

  const deselectAllInSector = (sector: string) => {
    if (!data) return;
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      for (const group of data.sectors[sector]) {
        next.delete(group.symbol);
      }
      return next;
    });
  };

  const isSectorFullySelected = (sector: string): boolean => {
    if (!data) return false;
    return data.sectors[sector].every((g) => selectedGroups.has(g.symbol));
  };

  const isSectorPartiallySelected = (sector: string): boolean => {
    if (!data) return false;
    const groups = data.sectors[sector];
    const selectedCount = groups.filter((g) => selectedGroups.has(g.symbol)).length;
    return selectedCount > 0 && selectedCount < groups.length;
  };

  const getSelectedTickers = (): string[] => {
    if (!data) return [];
    const tickers: string[] = [];
    for (const groups of Object.values(data.sectors)) {
      for (const group of groups) {
        if (selectedGroups.has(group.symbol)) {
          tickers.push(...group.tickers);
        }
      }
    }
    return [...new Set(tickers)];
  };

  const getSectorTickerCount = (sector: string): number => {
    if (!data) return 0;
    return data.sectors[sector].reduce((sum, g) => sum + g.count, 0);
  };

  const selectedTickers = getSelectedTickers();
  const totalSelectedGroups = selectedGroups.size;
  const totalSelectedTickers = selectedTickers.length;

  if (fetchingIndustries) {
    return (
      <div className="border border-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Loading IBD 197 industry groups...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-500/30 bg-red-900/20 rounded-lg p-4 mb-6 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  if (!data) return null;

  const sortedSectors = Object.keys(data.sectors).sort();
  const hasAnyTickers = data.tickersAssigned > 0;

  return (
    <div className="border border-gray-800 rounded-lg mb-6">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div>
          <h2 className="text-sm font-bold text-white">IBD 197 Industry Groups</h2>
          <p className="text-[10px] text-gray-500 mt-0.5">
            {data.totalGroups} groups across {sortedSectors.length} sectors
            {hasAnyTickers && ` \u00b7 ${data.tickersAssigned} stocks assigned`}
            {!hasAnyTickers && " \u00b7 Stock assignments pending"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {totalSelectedGroups > 0 && (
            <span className="text-xs text-gray-400">
              {totalSelectedGroups} group{totalSelectedGroups !== 1 ? "s" : ""}
              {totalSelectedTickers > 0 && ` (${totalSelectedTickers} stocks)`}
            </span>
          )}
          <button
            onClick={() => setSelectedGroups(new Set())}
            disabled={totalSelectedGroups === 0}
            className="text-xs text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() =>
              onScan(totalSelectedTickers > 0 ? selectedTickers : null)
            }
            disabled={loading || (totalSelectedGroups > 0 && totalSelectedTickers === 0)}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg text-xs font-medium transition-colors"
          >
            {loading
              ? "Scanning..."
              : totalSelectedGroups > 0
              ? totalSelectedTickers > 0
                ? `Scan Selected (${totalSelectedTickers})`
                : "No stocks in selected groups"
              : "Scan All"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-800 max-h-[400px] overflow-y-auto">
        {sortedSectors.map((sector) => (
          <div key={sector} className="p-3">
            <div
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => toggleSector(sector)}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-600 group-hover:text-gray-400 transition-colors">
                  {expandedSectors.has(sector) ? "\u25BC" : "\u25B6"}
                </span>
                <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">
                  {sector}
                </span>
                <span className="text-[10px] text-gray-600">
                  ({data.sectors[sector].length})
                </span>
              </div>
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() =>
                    isSectorFullySelected(sector)
                      ? deselectAllInSector(sector)
                      : selectAllInSector(sector)
                  }
                  className="text-[10px] text-gray-600 hover:text-blue-400 transition-colors"
                >
                  {isSectorFullySelected(sector) ? "Deselect all" : "Select all"}
                </button>
              </div>
            </div>

            {expandedSectors.has(sector) && (
              <div className="mt-2 space-y-1 ml-4">
                {data.sectors[sector].map((group) => {
                  const isSelected = selectedGroups.has(group.symbol);
                  return (
                    <label
                      key={group.symbol}
                      className="flex items-center gap-2 cursor-pointer group/item"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleGroup(group.symbol)}
                        className="w-3 h-3 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-0 focus:ring-offset-0"
                      />
                      <span
                        className={`text-xs transition-colors ${
                          isSelected
                            ? "text-white"
                            : "text-gray-500 group-hover/item:text-gray-300"
                        }`}
                      >
                        {group.name}
                      </span>
                      {group.count > 0 && (
                        <span className="text-[10px] text-gray-700">
                          ({group.count})
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}

            {!expandedSectors.has(sector) && isSectorPartiallySelected(sector) && (
              <div className="mt-1 ml-4">
                <span className="text-[10px] text-blue-400">
                  {data.sectors[sector].filter((g) => selectedGroups.has(g.symbol)).length}{" "}
                  of {data.sectors[sector].length} groups selected
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
