"use client";

import {
  TrendingUp,
  TrendingDown,
  Minus,
  Flame,
  BookOpen,
  Smile,
  Utensils,
  Home,
  Monitor,
} from "lucide-react";
import { TOKENS } from "@/lib/design-tokens";

export interface CategoryTrendItem {
  category: string;
  trendDirection: "rising" | "stable" | "declining";
  potentialScore: number;
  globalAvgEngagementRate: number;
  avgViralProbability: number;
  predictedChangePct: number;
  recommendation: string;
}

type Props = {
  data: CategoryTrendItem[];
  loading?: boolean;
};

const CATEGORY_META: Record<
  string,
  { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; color: string; bg: string }
> = {
  Edukasi:          { icon: BookOpen,  color: "#0ea5e9", bg: "rgba(14,165,233,0.08)" },
  Komedi:           { icon: Smile,     color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  Kuliner:          { icon: Utensils,  color: "#ef4444", bg: "rgba(239,68,68,0.08)"  },
  "Lifestyle & Home":{ icon: Home,     color: "#a855f7", bg: "rgba(168,85,247,0.08)" },
  Teknologi:        { icon: Monitor,   color: "#10b981", bg: "rgba(16,185,129,0.08)" },
};

const TREND_META = {
  rising:   { label: "Rising",   Icon: TrendingUp,   color: "#10b981", bg: "rgba(16,185,129,0.1)"  },
  stable:   { label: "Stable",   Icon: Minus,        color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  declining:{ label: "Declining",Icon: TrendingDown, color: "#ef4444", bg: "rgba(239,68,68,0.1)"   },
};

function ScoreBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value));
  const color = pct >= 70 ? "#10b981" : pct >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative h-1.5 rounded-full overflow-hidden w-full" style={{ background: "rgba(0,0,0,0.06)" }}>
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

export function CategoryHypeRanking({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-44 rounded-2xl animate-pulse" style={{ background: "rgba(0,0,0,0.04)" }} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 rounded-2xl border border-dashed text-xs font-bold"
           style={{ borderColor: TOKENS.divider, color: TOKENS.textMuted }}>
        Belum ada data tren kategori
      </div>
    );
  }

  // Sort by potentialScore descending
  const sorted = [...data].sort((a, b) => (b.potentialScore ?? 0) - (a.potentialScore ?? 0));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
      {sorted.map((item, rank) => {
        const meta = CATEGORY_META[item.category] ?? {
          icon: Flame, color: "#6b7280", bg: "rgba(107,114,128,0.08)",
        };
        const trend = TREND_META[item.trendDirection] ?? TREND_META.stable;
        const CategoryIcon = meta.icon;
        const TrendIcon = trend.Icon;
        const isTop = rank === 0;

        return (
          <div
            key={item.category}
            className="relative rounded-2xl p-4 flex flex-col gap-3 overflow-hidden transition-all duration-200"
            style={{
              background: isTop ? "#111" : "#fff",
              border: `1px solid ${isTop ? "transparent" : TOKENS.divider}`,
              boxShadow: isTop
                ? "0 8px 32px rgba(0,0,0,0.18)"
                : "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            {/* Rank badge */}
            {isTop && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/15">
                <Flame className="w-3 h-3 text-amber-400" strokeWidth={2.5} />
                <span className="text-[9px] font-black text-white/80 uppercase tracking-widest">#1 Hype</span>
              </div>
            )}

            {/* Icon + category */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: isTop ? "rgba(255,255,255,0.12)" : meta.bg, color: isTop ? "#fff" : meta.color }}
              >
                <CategoryIcon className="w-4 h-4" strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <p
                  className="text-xs font-black truncate leading-tight"
                  style={{ color: isTop ? "#fff" : TOKENS.text }}
                >
                  {item.category}
                </p>
                <p className="text-[10px] font-semibold mt-0.5" style={{ color: isTop ? "rgba(255,255,255,0.45)" : TOKENS.textMuted }}>
                  #{rank + 1} ranking
                </p>
              </div>
            </div>

            {/* Opportunity score */}
            <div>
              <div className="flex items-end justify-between mb-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest"
                  style={{ color: isTop ? "rgba(255,255,255,0.4)" : TOKENS.textMuted }}>
                  Opportunity Score
                </span>
                <span className="text-xl font-black leading-none"
                  style={{ color: isTop ? "#fff" : TOKENS.text }}>
                  {Math.round(item.potentialScore ?? 0)}
                </span>
              </div>
              <div className="relative h-1.5 rounded-full overflow-hidden w-full"
                style={{ background: isTop ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)" }}>
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, item.potentialScore ?? 0)}%`,
                    background: isTop ? "#fff" : (item.potentialScore >= 70 ? "#10b981" : item.potentialScore >= 40 ? "#f59e0b" : "#ef4444"),
                  }}
                />
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-3">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest"
                  style={{ color: isTop ? "rgba(255,255,255,0.4)" : TOKENS.textMuted }}>Eng. Rate</p>
                <p className="text-xs font-black mt-0.5"
                  style={{ color: isTop ? "#fff" : TOKENS.text }}>
                  {((item.globalAvgEngagementRate ?? 0) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest"
                  style={{ color: isTop ? "rgba(255,255,255,0.4)" : TOKENS.textMuted }}>Viral Prob.</p>
                <p className="text-xs font-black mt-0.5"
                  style={{ color: isTop ? "#fff" : TOKENS.text }}>
                  {((item.avgViralProbability ?? 0) * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            {/* Trend badge */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl w-fit"
              style={{ background: isTop ? "rgba(255,255,255,0.1)" : trend.bg, color: isTop ? "#fff" : trend.color }}
            >
              <TrendIcon className="w-3 h-3 flex-shrink-0" strokeWidth={2.5} />
              <span className="text-[10px] font-black"
                style={{ color: isTop ? "#fff" : trend.color }}>
                {trend.label}
                {item.predictedChangePct != null && item.predictedChangePct !== 0 && (
                  <span className="ml-1 opacity-70">
                    {item.predictedChangePct > 0 ? "+" : ""}{item.predictedChangePct.toFixed(1)}%
                  </span>
                )}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
