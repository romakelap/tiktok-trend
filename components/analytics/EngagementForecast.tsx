"use client";

import { useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  BookOpen,
  Smile,
  Utensils,
  Home,
  Monitor,
  Info,
  AlertCircle,
} from "lucide-react";

import { formatNum } from "@/lib/analytics/formatters";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CategoryTrendPoint {
  date: string;
  avgViews: number;
  avgEngagementRate: number;
  isForecast: boolean;
}

export interface CategoryTrendData {
  category: string;
  trendDirection: "rising" | "stable" | "declining";
  potentialScore: number;
  globalAvgViews: number;
  globalAvgEngagementRate: number;
  avgViralProbability: number;
  predictedChangePct: number;
  mainAccountVideoCount: number;
  mainAccountAvgViews: number;
  mainAccountEngagementRate: number;
  competitorVideoCount: number;
  competitorAvgViews: number;
  competitorEngagementRate: number;
  recommendation: string;
  historicalTrend: CategoryTrendPoint[];
  forecastTrend: CategoryTrendPoint[];
}

type InlineHashtag = {
  hashtag: string;
  competitionLevel: string;
  expectedEngagementRate: number;
};

type InlinePostingTime = {
  dayName: string;
  timeLabel: string;
  expectedEngagementRate: number;
  confidenceScore: number;
};

type ContentTrendProps = {
  data: CategoryTrendData[];
  loading?: boolean;
  hasMainAccount?: boolean;
  hashtagRecs?: InlineHashtag[];
  postingTimeRecs?: InlinePostingTime[];
};

const CATEGORY_META: Record<
  string,
  { color: string; bg: string; icon: React.ElementType }
> = {
  Edukasi: {
    color: "#0284c7",
    bg: "rgba(2,132,199,0.1)",
    icon: BookOpen,
  },
  Komedi: {
    color: "#d97706",
    bg: "rgba(217,119,6,0.1)",
    icon: Smile,
  },
  Kuliner: {
    color: "#dc2626",
    bg: "rgba(220,38,38,0.1)",
    icon: Utensils,
  },
  "Lifestyle & Home": {
    color: "#059669",
    bg: "rgba(5,150,105,0.1)",
    icon: Home,
  },
  Teknologi: {
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.1)",
    icon: Monitor,
  },
};

export function EngagementForecast({
  data,
  loading = false,
  hasMainAccount = true,
}: ContentTrendProps) {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.potentialScore - a.potentialScore);
  }, [data]);

  const topCategory = sortedData[0] ?? null;

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-sm p-5 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-tight">
                Proyeksi Tren Kategori (7 Hari)
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-neutral-400">
                Peringkat potensi performa & momentum 5 sektor konten
              </p>
            </div>
          </div>

          {topCategory && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40 text-[10px] font-bold">
              <TrendingUp className="w-3 h-3" />
              <span>Top: <strong>{topCategory.category}</strong> ({Math.round(topCategory.potentialScore)} Pts)</span>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="h-64 flex items-center justify-center text-stone-400 text-xs font-medium">
            Memuat proyeksi kategori...
          </div>
        ) : !hasMainAccount ? (
          <div className="h-48 flex flex-col items-center justify-center gap-1.5 text-center px-6 rounded-xl bg-stone-50/50 dark:bg-neutral-800/30 border border-dashed border-stone-200 dark:border-neutral-800">
            <Info className="w-5 h-5 text-stone-400" />
            <p className="text-xs font-bold text-stone-600 dark:text-neutral-400">
              Pilih akun utama untuk melihat proyeksi kategori
            </p>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center gap-1.5 text-center px-6 rounded-xl bg-stone-50/50 dark:bg-neutral-800/30 border border-dashed border-stone-200 dark:border-neutral-800">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <p className="text-xs font-bold text-stone-600 dark:text-neutral-400">
              Data tren kategori belum tersedia
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 dark:border-neutral-800">
              <span className="col-span-4">Kategori</span>
              <span className="col-span-2 text-right">Potensi</span>
              <span className="col-span-3 text-right">Avg Reach</span>
              <span className="col-span-3 text-right">Engagement</span>
            </div>

            {/* List Rows */}
            {sortedData.map((item, idx) => {
              const meta = CATEGORY_META[item.category] ?? {
                color: "#78716c",
                bg: "rgba(120,113,108,0.1)",
                icon: Sparkles,
              };
              const Icon = meta.icon;

              const isRising = item.trendDirection === "rising";
              const isDeclining = item.trendDirection === "declining";

              return (
                <div
                  key={item.category}
                  className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-xl bg-stone-50/70 dark:bg-neutral-800/40 border border-stone-200/60 dark:border-neutral-700/60 hover:bg-stone-100/70 dark:hover:bg-neutral-800/80 transition-all"
                >
                  {/* Category Name & Icon */}
                  <div className="col-span-4 flex items-center gap-2 min-w-0">
                    <span className="w-4 h-4 rounded bg-stone-200 dark:bg-neutral-700 text-stone-700 dark:text-neutral-200 flex items-center justify-center text-[9px] font-mono font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ background: meta.bg }}
                    >
                      <Icon className="w-3 h-3" style={{ color: meta.color }} />
                    </div>
                    <span className="text-xs font-bold text-stone-900 dark:text-white truncate">
                      {item.category}
                    </span>
                  </div>

                  {/* Potential Score */}
                  <div className="col-span-2 text-right">
                    <span
                      className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold font-mono"
                      style={{
                        background: meta.bg,
                        color: meta.color,
                      }}
                    >
                      {Math.round(item.potentialScore)} Pts
                    </span>
                  </div>

                  {/* Avg Reach */}
                  <div className="col-span-3 text-right">
                    <span className="text-xs font-mono font-bold text-stone-800 dark:text-neutral-200">
                      {formatNum(Math.round(item.globalAvgViews))}
                    </span>
                  </div>

                  {/* Engagement Rate & Direction */}
                  <div className="col-span-3 flex items-center justify-end gap-1">
                    <span className="text-xs font-mono font-bold text-stone-800 dark:text-neutral-200">
                      {(item.globalAvgEngagementRate * 100).toFixed(1)}%
                    </span>
                    {isRising ? (
                      <TrendingUp className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                    ) : isDeclining ? (
                      <TrendingDown className="w-3 h-3 text-rose-600 flex-shrink-0" />
                    ) : (
                      <Minus className="w-3 h-3 text-amber-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
