"use client";

import type { MarketDirection } from "@/types";

export default function MarketStatus({ market }: { market: MarketDirection | null }) {
  if (!market) return null;

  const colors = {
    uptrend: "bg-green-900/30 border-green-500/50 text-green-300",
    downtrend: "bg-red-900/30 border-red-500/50 text-red-300",
    neutral: "bg-orange-900/30 border-orange-500/50 text-orange-300",
  };

  const icons = {
    uptrend: "▲",
    downtrend: "▼",
    neutral: "►",
  };

  const labels = {
    uptrend: "CONFIRMED UPTREND",
    downtrend: "CONFIRMED DOWNTREND",
    neutral: "UPTREND UNDER PRESSURE — PROCEED WITH CAUTION",
  };

  return (
    <div className={`rounded-lg border px-4 py-3 ${colors[market.trend]}`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icons[market.trend]}</span>
          <div>
            <div className="font-bold text-sm tracking-wide">
              M — MARKET DIRECTION: {labels[market.trend]}
            </div>
            <div className="text-xs opacity-75">
              S&P 500: ${market.sp500Price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              {" | "}50-day MA: ${market.ma50.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              {" | "}200-day MA: ${market.ma200.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
        <div className="text-xs opacity-60">
          {market.trend === "uptrend"
            ? "Above 50-day MA — favorable for new buys"
            : market.trend === "downtrend"
            ? "Below 50 & 200-day MA — avoid new buys"
            : "Below 50-day MA, above 200-day MA — proceed with caution"}
        </div>
      </div>
    </div>
  );
}
