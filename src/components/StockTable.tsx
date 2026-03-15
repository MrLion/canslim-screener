"use client";

import { useState } from "react";
import ScoreBar from "./ScoreBar";

interface CriterionResult {
  pass: boolean;
  score: number;
  value: string;
  detail: string;
}

interface CANSLIMResult {
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
  scannedAt?: string;
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function isStale(iso: string): boolean {
  return Date.now() - new Date(iso).getTime() > 4 * 60 * 60 * 1000;
}

type SortKey = "compositeScore" | "C" | "A" | "N" | "S" | "L" | "I" | "symbol" | "price";

const CRITERIA = ["C", "A", "N", "S", "L", "I"] as const;

const CRITERIA_LABELS: Record<string, string> = {
  C: "Current Earnings",
  A: "Annual Growth",
  N: "New Highs",
  S: "Supply/Demand",
  L: "Leader (RS)",
  I: "Institutional",
};

function PassFail({ result }: { result: CriterionResult }) {
  return (
    <span
      className={`inline-block w-5 h-5 rounded text-center text-xs font-bold leading-5 ${
        result.pass
          ? "bg-green-500/20 text-green-400"
          : result.value === "N/A"
          ? "bg-gray-700 text-gray-500"
          : "bg-red-500/20 text-red-400"
      }`}
      title={result.detail}
    >
      {result.pass ? "✓" : result.value === "N/A" ? "–" : "✗"}
    </span>
  );
}

export default function StockTable({ results }: { results: CANSLIMResult[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("compositeScore");
  const [sortAsc, setSortAsc] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const sorted = [...results]
    .filter((r) => {
      if (!filter) return true;
      const q = filter.toUpperCase();
      return r.symbol.includes(q) || r.name.toUpperCase().includes(q);
    })
    .sort((a, b) => {
      let av: number, bv: number;
      if (sortKey === "symbol") {
        return sortAsc
          ? a.symbol.localeCompare(b.symbol)
          : b.symbol.localeCompare(a.symbol);
      } else if (sortKey === "price") {
        av = a.price;
        bv = b.price;
      } else if (sortKey === "compositeScore") {
        av = a.compositeScore;
        bv = b.compositeScore;
      } else {
        av = a[sortKey].score;
        bv = b[sortKey].score;
      }
      return sortAsc ? av - bv : bv - av;
    });

  const SortHeader = ({
    label,
    field,
    className = "",
  }: {
    label: string;
    field: SortKey;
    className?: string;
  }) => (
    <th
      className={`px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white select-none ${className}`}
      onClick={() => handleSort(field)}
    >
      {label}
      {sortKey === field ? (sortAsc ? " ▲" : " ▼") : ""}
    </th>
  );

  const passCount = (r: CANSLIMResult) =>
    CRITERIA.filter((c) => r[c].pass).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Filter by ticker or name..."
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-64"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <span className="text-sm text-gray-500">
          {sorted.length} of {results.length} stocks
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 w-8">#</th>
              <SortHeader label="Ticker" field="symbol" />
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400">Name</th>
              <SortHeader label="Price" field="price" />
              <SortHeader label="Score" field="compositeScore" />
              {CRITERIA.map((c) => (
                <SortHeader key={c} label={c} field={c} />
              ))}
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-400">Pass</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {sorted.map((stock, idx) => (
              <>
                <tr
                  key={stock.symbol}
                  className="hover:bg-gray-800/50 cursor-pointer transition-colors"
                  onClick={() =>
                    setExpanded(expanded === stock.symbol ? null : stock.symbol)
                  }
                >
                  <td className="px-3 py-2 text-gray-500 text-xs">
                    <div className="flex items-center gap-1">
                      {idx + 1}
                      {stock.scannedAt && isStale(stock.scannedAt) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" title={`Stale — scanned ${timeAgo(stock.scannedAt)}`} />
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono font-bold text-white">
                    {stock.symbol}
                  </td>
                  <td className="px-3 py-2 text-gray-300 max-w-[200px] truncate">
                    {stock.name}
                  </td>
                  <td className="px-3 py-2 text-gray-300">
                    ${stock.price.toFixed(2)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${
                          stock.compositeScore >= 70
                            ? "text-green-400"
                            : stock.compositeScore >= 50
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {stock.compositeScore}
                      </span>
                    </div>
                  </td>
                  {CRITERIA.map((c) => (
                    <td key={c} className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <PassFail result={stock[c]} />
                        <span className="text-xs text-gray-400 ml-1">
                          {stock[c].value}
                        </span>
                      </div>
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <span
                      className={`text-xs font-bold ${
                        passCount(stock) >= 5
                          ? "text-green-400"
                          : passCount(stock) >= 3
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {passCount(stock)}/6
                    </span>
                  </td>
                </tr>
                {expanded === stock.symbol && (
                  <tr key={`${stock.symbol}-detail`} className="bg-gray-900/30">
                    <td colSpan={11} className="px-6 py-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {CRITERIA.map((c) => (
                          <div key={c} className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs">
                                {c} — {CRITERIA_LABELS[c]}
                              </span>
                              <PassFail result={stock[c]} />
                            </div>
                            <ScoreBar score={stock[c].score} pass={stock[c].pass} />
                            <div className="text-xs text-gray-500">
                              {stock[c].detail}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
                        <span>
                          Market Cap: ${(stock.marketCap / 1e9).toFixed(1)}B
                        </span>
                        {stock.scannedAt && (
                          <span className={`flex items-center gap-1 ${isStale(stock.scannedAt) ? "text-yellow-600" : "text-gray-700"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isStale(stock.scannedAt) ? "bg-yellow-500/60" : "bg-green-500/40"}`} />
                            Scanned {timeAgo(stock.scannedAt)}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
