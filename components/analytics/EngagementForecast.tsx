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
} from "lucide-react";

import { formatNum } from "@/lib/analytics/formatters";

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
  avgViralProbability?: number;
  predictedChangePct?: number;
  mainAccountVideoCount?: number;
  mainAccountAvgViews?: number;
  mainAccountEngagementRate?: number;
  competitorVideoCount?: number;
  competitorAvgViews?: number;
  competitorEngagementRate?: number;
  recommendation?: string;
  historicalTrend?: CategoryTrendPoint[];
  forecastTrend?: CategoryTrendPoint[];
}

type ContentTrendProps = {
  data?: CategoryTrendData[];
  loading?: boolean;
  hasMainAccount?: boolean;
  hashtagRecs?: any[];
  postingTimeRecs?: any[];
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

const DEFAULT_CATEGORIES: CategoryTrendData[] = [
  {
    category: "Lifestyle & Home",
    trendDirection: "rising",
    potentialScore: 94,
    globalAvgViews: 384000,
    globalAvgEngagementRate: 0.128,
  } as CategoryTrendData,
  {
    category: "Edukasi",
    trendDirection: "rising",
    potentialScore: 89,
    globalAvgViews: 245000,
    globalAvgEngagementRate: 0.114,
  } as CategoryTrendData,
  {
    category: "Komedi",
    trendDirection: "stable",
    potentialScore: 82,
    globalAvgViews: 410000,
    globalAvgEngagementRate: 0.098,
  } as CategoryTrendData,
  {
    category: "Kuliner",
    trendDirection: "stable",
    potentialScore: 78,
    globalAvgViews: 195000,
    globalAvgEngagementRate: 0.089,
  } as CategoryTrendData,
  {
    category: "Teknologi",
    trendDirection: "declining",
    potentialScore: 71,
    globalAvgViews: 160000,
    globalAvgEngagementRate: 0.075,
  } as CategoryTrendData,
];

export function EngagementForecast({
  data = [],
  loading = false,
}: ContentTrendProps) {
  const displayData = useMemo(() => {
    if (data && data.length > 0) {
      return [...data].sort((a, b) => b.potentialScore - a.potentialScore);
    }
    return DEFAULT_CATEGORIES;
  }, [data]);

  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2.5 py-1">
      {/* Label Badge */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-sky-600" />
        <span className="text-[11px] font-bold text-stone-600 dark:text-neutral-300 uppercase tracking-tight">
          Tren Kategori (7H):
        </span>
      </div>

      {/* Inline Category Pills */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 flex-1">
        {displayData.map((item, idx) => {
          const meta = CATEGORY_META[item.category] ?? {
            color: "#0284c7",
            bg: "rgba(2,132,199,0.1)",
            icon: Sparkles,
          };
          const Icon = meta.icon;
          const isRising = item.trendDirection === "rising";
          const isDeclining = item.trendDirection === "declining";
          const score = Math.round(item.potentialScore || 80);

          return (
            <div
              key={item.category}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-stone-100/80 dark:bg-neutral-800/60 border border-stone-200/60 dark:border-neutral-700/60 text-xs font-semibold text-stone-800 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <div
                className="w-4.5 h-4.5 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: meta.bg }}
              >
                <Icon className="w-3 h-3" style={{ color: meta.color }} />
              </div>
              <span className="font-bold truncate">{item.category}</span>
              <span
                className="font-mono text-[10px] font-bold px-1 rounded"
                style={{ color: meta.color }}
              >
                {score}p
              </span>
              {isRising ? (
                <TrendingUp className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              ) : isDeclining ? (
                <TrendingDown className="w-3 h-3 text-rose-600 flex-shrink-0" />
              ) : (
                <Minus className="w-3 h-3 text-amber-500 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
