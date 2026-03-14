"use client";

import { useState, useEffect } from "react";

interface IndustryMap {
  [sector: string]: {
    [industry: string]: {
      tickers: string[];
      count: number;
    };
  };
}

interface IndustryPickerProps {
  onScan: (tickers: string[] | null) => void;
  loading: boolean;
}

export default function IndustryPicker({ onScan, loading }: IndustryPickerProps) {
  const [industries, setIndustries] = useState<IndustryMap | null>(null);
  const [fetchingIndustries, setFetchingIndustries] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndustries, setSelectedIndustries] = useState<Set<string>>(new Set());
  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(new Set());

  useEffect(() => {
    setFetchingIndustries(true);
    fetch("/api/industries")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setIndustries(data))
      .catch(() => setError("Failed to load industries"))
      .finally(() => setFetchingIndustries(false));
  }, []);

  // Build a key for each industry: "sector|industry"
  const getKey = (sector: string, industry: string) => `${sector}|${industry}`;

  const toggleSector = (sector: string) => {
    setExpandedSectors((prev) => {
      const next = new Set(prev);
      if (next.has(sector)) next.delete(sector);
      else next.add(sector);
      return next;
    });
  };

  const toggleIndustry = (sector: string, industry: string) => {
    const key = getKey(sector, industry);
    setSelectedIndustries((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const selectAllInSector = (sector: string) => {
    if (!industries) return;
    setSelectedIndustries((prev) => {
      const next = new Set(prev);
      for (const industry of Object.keys(industries[sector])) {
        next.add(getKey(sector, industry));
      }
      return next;
    });
  };

  const deselectAllInSector = (sector: string) => {
    if (!industries) return;
    setSelectedIndustries((prev) => {
      const next = new Set(prev);
      for (const industry of Object.keys(industries[sector])) {
        next.delete(getKey(sector, industry));
      }
      return next;
    });
  };

  const isSectorFullySelected = (sector: string): boolean => {
    if (!industries) return false;
    return Object.keys(industries[sector]).every((ind) =>
      selectedIndustries.has(getKey(sector, ind))
    );
  };

  const isSectorPartiallySelected = (sector: string): boolean => {
    if (!industries) return false;
    const keys = Object.keys(industries[sector]);
    const selectedCount = keys.filter((ind) =>
      selectedIndustries.has(getKey(sector, ind))
    ).length;
    return selectedCount > 0 && selectedCount < keys.length;
  };

  const getSelectedTickers = (): string[] => {
    if (!industries) return [];
    const tickers: string[] = [];
    for (const [sector, sectorData] of Object.entries(industries)) {
      for (const [industry, data] of Object.entries(sectorData)) {
        if (selectedIndustries.has(getKey(sector, industry))) {
          tickers.push(...data.tickers);
        }
      }
    }
    return [...new Set(tickers)];
  };

  const getSectorTickerCount = (sector: string): number => {
    if (!industries) return 0;
    return Object.values(industries[sector]).reduce((sum, d) => sum + d.count, 0);
  };

  const selectedTickers = getSelectedTickers();
  const totalSelected = selectedTickers.length;

  if (fetchingIndustries) {
    return (
      <div className="border border-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Loading industries...
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

  if (!industries) return null;

  const sortedSectors = Object.keys(industries).sort();

  return (
    <div className="border border-gray-800 rounded-lg mb-6">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <h2 className="text-sm font-bold text-white">Select Industries to Scan</h2>
        <div className="flex items-center gap-3">
          {totalSelected > 0 && (
            <span className="text-xs text-gray-400">
              {totalSelected} stock{totalSelected !== 1 ? "s" : ""} selected
            </span>
          )}
          <button
            onClick={() => setSelectedIndustries(new Set())}
            disabled={totalSelected === 0}
            className="text-xs text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => onScan(totalSelected > 0 ? selectedTickers : null)}
            disabled={loading}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg text-xs font-medium transition-colors"
          >
            {loading
              ? "Scanning..."
              : totalSelected > 0
              ? `Scan Selected (${totalSelected})`
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
                  {expandedSectors.has(sector) ? "▼" : "▶"}
                </span>
                <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors">
                  {sector}
                </span>
                <span className="text-[10px] text-gray-600">
                  ({getSectorTickerCount(sector)})
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
                {Object.entries(industries[sector])
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([industry, data]) => {
                    const key = getKey(sector, industry);
                    const isSelected = selectedIndustries.has(key);
                    return (
                      <label
                        key={key}
                        className="flex items-center gap-2 cursor-pointer group/item"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleIndustry(sector, industry)}
                          className="w-3 h-3 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-0 focus:ring-offset-0"
                        />
                        <span
                          className={`text-xs transition-colors ${
                            isSelected
                              ? "text-white"
                              : "text-gray-500 group-hover/item:text-gray-300"
                          }`}
                        >
                          {industry}
                        </span>
                        <span className="text-[10px] text-gray-700">
                          ({data.count})
                        </span>
                      </label>
                    );
                  })}
              </div>
            )}

            {!expandedSectors.has(sector) && isSectorPartiallySelected(sector) && (
              <div className="mt-1 ml-4">
                <span className="text-[10px] text-blue-400">
                  {Object.keys(industries[sector]).filter((ind) =>
                    selectedIndustries.has(getKey(sector, ind))
                  ).length}{" "}
                  of {Object.keys(industries[sector]).length} industries selected
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
