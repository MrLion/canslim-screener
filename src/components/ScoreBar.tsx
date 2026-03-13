"use client";

export default function ScoreBar({ score, pass }: { score: number; pass: boolean }) {
  const color = pass
    ? score >= 80
      ? "bg-green-500"
      : "bg-green-400"
    : score >= 40
    ? "bg-yellow-500"
    : "bg-red-500";

  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-2 rounded-full bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-7 text-right">{score.toFixed(0)}</span>
    </div>
  );
}
