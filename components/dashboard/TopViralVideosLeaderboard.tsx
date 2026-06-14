"use client";

import { Eye, Flame, Calendar } from "lucide-react";
import { TOKENS } from "@/lib/design-tokens";

export interface TopVideoItem {
  videoPk: string | number;
  titleBrief: string;
  nickName: string;
  viewsNum: number;
  likesNum: number;
  engagementRate: number;
  durationBucket: string;
  publishedAt: string;
}

type Props = {
  data: TopVideoItem[];
  loading?: boolean;
  onVideoClick?: (videoId: string | number) => void;
};

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n ?? 0);
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return iso.split("T")[0];
}

// Same subtle tint for all top 3
const TOP_ACCENT = {
  bg:      "rgba(47,87,138,0.06)",
  border:  "rgba(47,87,138,0.20)",
  shadow:  "0 4px 16px rgba(47,87,138,0.10)",
  rankBg:  "#2F578A",
  rankTxt: "#fff",
};

export function TopViralVideosLeaderboard({ data, loading, onVideoClick }: Props) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-14 rounded-2xl animate-pulse" style={{ background: "rgba(0,0,0,0.04)" }} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-28 rounded-2xl border border-dashed text-xs font-bold"
           style={{ borderColor: TOKENS.divider, color: TOKENS.textMuted }}>
        Belum ada data video
      </div>
    );
  }

  const maxViews = Math.max(...data.map((v) => v.viewsNum ?? 0), 1);

  return (
    <div className="space-y-2">
      {data.map((video, idx) => {
        const isTop3   = idx < 3;
        const viewsPct = Math.round(((video.viewsNum ?? 0) / maxViews) * 100);
        const engPct   = Math.min(100, Math.round((video.engagementRate ?? 0) * 100 * 5));
        const engGood  = (video.engagementRate ?? 0) >= 0.07;

        return (
          <button
            key={video.videoPk}
            type="button"
            onClick={() => onVideoClick?.(video.videoPk)}
            className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all hover:shadow-md active:scale-[0.99]"
            style={{
              background:  isTop3 ? TOP_ACCENT.bg     : "#fff",
              borderColor: isTop3 ? TOP_ACCENT.border  : TOKENS.divider,
              boxShadow:   isTop3 ? TOP_ACCENT.shadow  : "none",
              cursor: onVideoClick ? "pointer" : "default",
            }}
          >
            {/* Rank badge */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-black"
              style={{
                background: isTop3 ? TOP_ACCENT.rankBg  : "rgba(0,0,0,0.04)",
                color:      isTop3 ? TOP_ACCENT.rankTxt : TOKENS.textMuted,
              }}
            >
              {idx + 1}
            </div>

            {/* Title + account */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black truncate leading-snug" style={{ color: TOKENS.text }}>
                {video.titleBrief || "Untitled"}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-bold truncate" style={{ color: TOKENS.textMuted }}>
                  @{video.nickName}
                </span>
                <span className="flex items-center gap-0.5 text-[10px] font-bold flex-shrink-0"
                  style={{ color: TOKENS.textMuted }}>
                  <Calendar className="w-2.5 h-2.5" strokeWidth={2.5} />
                  {formatDate(video.publishedAt)}
                </span>
              </div>
            </div>

            {/* Views */}
            <div className="hidden sm:flex flex-col items-end gap-1 w-24 flex-shrink-0">
              <div className="flex items-center gap-1.5 w-full justify-end">
                <Eye className="w-3 h-3 flex-shrink-0" style={{ color: TOKENS.textMuted }} strokeWidth={2.4} />
                <span className="text-[11px] font-black" style={{ color: TOKENS.text }}>
                  {fmt(video.viewsNum ?? 0)}
                </span>
              </div>
              <div className="relative w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                <div className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${viewsPct}%`, background: "#2F578A" }} />
              </div>
            </div>

            {/* Engagement */}
            <div className="hidden md:flex flex-col items-end gap-1 w-20 flex-shrink-0">
              <span className="text-[11px] font-black"
                style={{ color: engGood ? "#059669" : "#b45309" }}>
                {((video.engagementRate ?? 0) * 100).toFixed(1)}%
              </span>
              <div className="relative w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                <div className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${engPct}%`, background: engGood ? "#059669" : "#f59e0b" }} />
              </div>
            </div>

            {/* Flame icon top 3 */}
            {isTop3 && (
              <Flame className="w-4 h-4 flex-shrink-0" style={{ color: "#2F578A" }} strokeWidth={2.2} />
            )}
          </button>
        );
      })}
    </div>
  );
}
