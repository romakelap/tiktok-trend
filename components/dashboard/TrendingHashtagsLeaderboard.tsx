"use client";

import { TrendingUp, Minus, Hash, Flame } from "lucide-react";

export interface TrendingHashtagItem {
  hashtagPk: number;
  tagTitle: string;
  viewsCountNum: number;
  videoCountNum: number;
  avgEngagementRate: number;
  competitionLevel: string;
  rankPosition: number | null;
  trendingScore: number;
  isRising: boolean;
}

type Props = {
  data: TrendingHashtagItem[];
  loading?: boolean;
};

const COMPETITION_META: Record<string, { label: string; className: string }> = {
  low: {
    label: "Low Comp",
    className: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60",
  },
  medium: {
    label: "Med Comp",
    className: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60",
  },
  high: {
    label: "High Comp",
    className: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/60",
  },
  extreme: {
    label: "Extreme",
    className: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/60",
  },
};

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n ?? 0);
}

export function TrendingHashtagsLeaderboard({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-stone-100 dark:bg-neutral-800/50 animate-pulse border border-stone-200/80 dark:border-neutral-800"
          />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-28 rounded-xl border border-dashed border-stone-200 dark:border-neutral-800 text-xs font-medium text-stone-500">
        Belum ada data trending hashtag
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {data.map((item, idx) => {
        const comp =
          COMPETITION_META[(item.competitionLevel ?? "").toLowerCase()] ??
          COMPETITION_META.medium;
        const rank = item.rankPosition ?? idx + 1;
        const isTop3 = rank <= 3;

        return (
          <div
            key={item.hashtagPk ?? idx}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all bg-white dark:bg-neutral-900 ${
              isTop3
                ? "border-stone-900/30 dark:border-white/30 shadow-xs"
                : "border-stone-200/80 dark:border-neutral-800 hover:border-stone-400"
            }`}
          >
            {/* Rank */}
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold ${
                isTop3
                  ? "bg-stone-900 text-white dark:bg-white dark:text-stone-900"
                  : "bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400"
              }`}
            >
              {rank}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <Hash className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                  {item.tagTitle}
                </p>
                {item.isRising ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 dark:text-neutral-400">
                <span>{fmt(item.viewsCountNum ?? 0)} views</span>
                <span>•</span>
                <span>{fmt(item.videoCountNum ?? 0)} videos</span>
              </div>
            </div>

            {/* Competition Badge */}
            <span
              className={`px-2 py-0.5 rounded text-[9.5px] font-bold border flex-shrink-0 ${comp.className}`}
            >
              {comp.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
