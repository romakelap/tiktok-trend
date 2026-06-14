"use client";

import { TrendingUp, Minus, Hash } from "lucide-react";
import { TOKENS } from "@/lib/design-tokens";

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

// Same subtle tint for all top 3
const TOP_ACCENT = {
  bg:      "rgba(47,87,138,0.06)",
  border:  "rgba(47,87,138,0.20)",
  shadow:  "0 4px 16px rgba(47,87,138,0.10)",
  rankBg:  "#2F578A",
  rankTxt: "#fff",
};

const COMPETITION_META: Record<string, { label: string; color: string; bg: string }> = {
  low:     { label: "Low",    color: "#059669", bg: "rgba(5,150,105,0.08)"  },
  medium:  { label: "Medium", color: "#d97706", bg: "rgba(217,119,6,0.08)"  },
  high:    { label: "High",   color: "#dc2626", bg: "rgba(220,38,38,0.08)"  },
  extreme: { label: "Extreme",color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
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
          <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: "rgba(0,0,0,0.04)" }} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-28 rounded-2xl border border-dashed text-xs font-bold"
           style={{ borderColor: TOKENS.divider, color: TOKENS.textMuted }}>
        Belum ada data trending hashtag
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {data.map((item, idx) => {
        const comp   = COMPETITION_META[(item.competitionLevel ?? "").toLowerCase()] ?? COMPETITION_META.medium;
        const isTop3 = idx < 3;

        return (
          <div
            key={item.hashtagPk ?? idx}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all hover:shadow-md"
            style={{
              background:  isTop3 ? TOP_ACCENT.bg     : "#fff",
              borderColor: isTop3 ? TOP_ACCENT.border  : TOKENS.divider,
              boxShadow:   isTop3 ? TOP_ACCENT.shadow  : "0 1px 4px rgba(0,0,0,0.03)",
            }}
          >
            {/* Rank */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black"
              style={{
                background: isTop3 ? TOP_ACCENT.rankBg  : "rgba(0,0,0,0.04)",
                color:      isTop3 ? TOP_ACCENT.rankTxt : TOKENS.textMuted,
              }}
            >
              {item.rankPosition ?? idx + 1}
            </div>

            {/* Name + stats */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <Hash className="w-3 h-3 flex-shrink-0" style={{ color: TOKENS.textMuted }} strokeWidth={2.5} />
                <p className="text-xs font-black truncate" style={{ color: TOKENS.text }}>
                  {item.tagTitle}
                </p>
                {item.isRising
                  ? <TrendingUp className="w-3 h-3 flex-shrink-0 text-emerald-500" strokeWidth={2.5} />
                  : <Minus className="w-3 h-3 flex-shrink-0" style={{ color: TOKENS.textMuted }} strokeWidth={2.5} />
                }
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[10px] font-bold" style={{ color: TOKENS.textMuted }}>
                  {fmt(item.viewsCountNum ?? 0)} views
                </span>
                <span className="text-[10px] font-bold" style={{ color: TOKENS.textMuted }}>
                  {fmt(item.videoCountNum ?? 0)} videos
                </span>
              </div>
            </div>

            {/* Competition badge */}
            <div
              className="px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex-shrink-0"
              style={{ background: comp.bg, color: comp.color }}
            >
              {comp.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
