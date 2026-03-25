"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

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

const STORAGE_KEY = "canslim-selected-groups";

function loadSavedSelections(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return new Set(JSON.parse(saved));
  } catch {}
  return new Set();
}

function saveSelections(groups: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...groups]));
  } catch {}
}

export default function IndustryPicker({ onScan, loading }: IndustryPickerProps) {
  const [data, setData] = useState<APIResponse | null>(null);
  const [fetchingIndustries, setFetchingIndustries] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(loadSavedSelections);
  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [hideEmpty, setHideEmpty] = useState(false);

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

  // Persist selections to localStorage
  const updateSelectedGroups = useCallback((updater: (prev: Set<string>) => Set<string>) => {
    setSelectedGroups((prev) => {
      const next = updater(prev);
      saveSelections(next);
      return next;
    });
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
    updateSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) next.delete(symbol);
      else next.add(symbol);
      return next;
    });
  };

  const selectAllInSector = (sector: string, visibleGroups?: IndustryGroup[]) => {
    if (!data) return;
    const groups = visibleGroups ?? data.sectors[sector];
    updateSelectedGroups((prev) => {
      const next = new Set(prev);
      for (const group of groups) {
        next.add(group.symbol);
      }
      return next;
    });
  };

  const deselectAllInSector = (sector: string, visibleGroups?: IndustryGroup[]) => {
    if (!data) return;
    const groups = visibleGroups ?? data.sectors[sector];
    updateSelectedGroups((prev) => {
      const next = new Set(prev);
      for (const group of groups) {
        next.delete(group.symbol);
      }
      return next;
    });
  };

  const isSectorFullySelected = (sector: string, visibleGroups?: IndustryGroup[]): boolean => {
    if (!data) return false;
    const groups = visibleGroups ?? data.sectors[sector];
    return groups.length > 0 && groups.every((g) => selectedGroups.has(g.symbol));
  };

  const isSectorPartiallySelected = (sector: string): boolean => {
    if (!data) return false;
    const groups = data.sectors[sector];
    const selectedCount = groups.filter((g) => selectedGroups.has(g.symbol)).length;
    return selectedCount > 0 && selectedCount < groups.length;
  };

  const getSelectedTickers = useMemo((): string[] => {
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
  }, [data, selectedGroups]);

  const getSectorTickerCount = (sector: string): number => {
    if (!data) return 0;
    return data.sectors[sector].reduce((sum, g) => sum + g.count, 0);
  };

  // Filter sectors and groups by search query and empty toggle
  const filteredSectors = useMemo(() => {
    if (!data) return [];
    const query = searchQuery.toLowerCase().trim();
    const sortedSectors = Object.keys(data.sectors).sort();

    return sortedSectors
      .map((sector) => {
        let groups = data.sectors[sector];

        // Filter by search query
        if (query) {
          groups = groups.filter(
            (g) =>
              g.name.toLowerCase().includes(query) ||
              sector.toLowerCase().includes(query) ||
              g.tickers.some((t) => t.toLowerCase() === query)
          );
        }

        // Filter out empty groups
        if (hideEmpty) {
          groups = groups.filter((g) => g.count > 0);
        }

        return { name: sector, groups };
      })
      .filter((s) => s.groups.length > 0);
  }, [data, searchQuery, hideEmpty]);

  const selectedTickers = getSelectedTickers;
  const totalSelectedGroups = selectedGroups.size;
  const totalSelectedTickers = selectedTickers.length;
  const allSectorNames = data ? Object.keys(data.sectors).sort() : [];

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

  const hasAnyTickers = data.tickersAssigned > 0;
  const populatedGroupCount = Object.values(data.sectors)
    .flat()
    .filter((g) => g.count > 0).length;

  return (
    <div className="border border-gray-800 rounded-lg mb-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-gray-800 gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-white">IBD 197 Industry Groups</h2>
          <p className="text-[10px] text-gray-500 mt-0.5 truncate">
            {data.totalGroups} groups across {allSectorNames.length} sectors
            {hasAnyTickers && ` \u00b7 ${data.tickersAssigned} stocks in ${populatedGroupCount} groups`}
            {!hasAnyTickers && " \u00b7 Stock assignments pending"}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {totalSelectedGroups > 0 && (
            <span className="text-[11px] sm:text-xs text-gray-400">
              {totalSelectedGroups} group{totalSelectedGroups !== 1 ? "s" : ""}
              {totalSelectedTickers > 0 && ` (${totalSelectedTickers})`}
            </span>
          )}
          <button
            onClick={() => {
              if (expandedSectors.size > 0) {
                setExpandedSectors(new Set());
              } else {
                setExpandedSectors(new Set(allSectorNames));
              }
            }}
            className="text-[11px] sm:text-xs text-gray-500 hover:text-white transition-colors"
          >
            {expandedSectors.size > 0 ? "Collapse All" : "Expand All"}
          </button>
          <button
            onClick={() => {
              updateSelectedGroups(() => new Set());
            }}
            disabled={totalSelectedGroups === 0}
            className="text-[11px] sm:text-xs text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() =>
              onScan(totalSelectedTickers > 0 ? selectedTickers : null)
            }
            disabled={loading || (totalSelectedGroups > 0 && totalSelectedTickers === 0)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg text-[11px] sm:text-xs font-medium transition-colors whitespace-nowrap"
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

      {/* Search & filter bar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-4 py-2 border-b border-gray-800/50 bg-gray-950/30">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groups, sectors, or tickers..."
            className="w-full pl-8 pr-8 py-1.5 bg-gray-900 border border-gray-800 rounded-md text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hideEmpty}
            onChange={(e) => setHideEmpty(e.target.checked)}
            className="w-3 h-3 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-0 focus:ring-offset-0"
          />
          <span className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors">
            Hide empty groups
          </span>
        </label>
        {(searchQuery || hideEmpty) && (
          <span className="text-[10px] text-gray-400">
            Showing {filteredSectors.reduce((sum, s) => sum + s.groups.length, 0)} groups
            in {filteredSectors.length} sectors
          </span>
        )}
      </div>

      {/* Sector/group grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-800 max-h-[400px] overflow-y-auto">
        {filteredSectors.length === 0 ? (
          <div className="col-span-full p-6 text-center text-gray-600 text-xs">
            No groups match your filters.{" "}
            <button onClick={() => { setSearchQuery(""); setHideEmpty(false); }} className="text-blue-500 hover:text-blue-400">
              Clear filters
            </button>
          </div>
        ) : (
          filteredSectors.map(({ name: sector, groups }) => {
            const sectorTickerCount = getSectorTickerCount(sector);
            return (
              <div key={sector} className="p-3">
                <div
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={() => toggleSector(sector)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 group-hover:text-gray-300 transition-colors">
                      {expandedSectors.has(sector) ? "\u25BC" : "\u25B6"}
                    </span>
                    <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">
                      {sector}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {groups.length}
                      {sectorTickerCount > 0 && (
                        <span className="text-gray-400"> &middot; {sectorTickerCount} stocks</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() =>
                        isSectorFullySelected(sector, groups)
                          ? deselectAllInSector(sector, groups)
                          : selectAllInSector(sector, groups)
                      }
                      className="text-[10px] text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {isSectorFullySelected(sector, groups) ? "Deselect all" : "Select all"}
                    </button>
                  </div>
                </div>

                {expandedSectors.has(sector) && (
                  <div className="mt-2 space-y-1 ml-4">
                    {groups.map((group) => {
                      const isSelected = selectedGroups.has(group.symbol);
                      const isEmpty = group.count === 0;
                      return (
                        <label
                          key={group.symbol}
                          className={`flex items-center gap-2 cursor-pointer group/item ${
                            isEmpty ? "opacity-40" : ""
                          }`}
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
                          {group.count > 0 ? (
                            <span className="text-[10px] text-gray-400">
                              ({group.count})
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-500 italic">
                              empty
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
            );
          })
        )}
      </div>
    </div>
  );
}
