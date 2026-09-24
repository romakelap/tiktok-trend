"use client";

import { Eye, Flame, Calendar, ChevronRight } from "lucide-react";

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

export function TopViralVideosLeaderboard({
  data,
  loading,
  onVideoClick,
}: Props) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-14 rounded-xl bg-stone-100 dark:bg-neutral-800/50 animate-pulse border border-stone-200/80 dark:border-neutral-800"
          />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-28 rounded-xl border border-dashed border-stone-200 dark:border-neutral-800 text-xs font-medium text-stone-500">
        Belum ada data video
      </div>
    );
  }

  const maxViews = Math.max(...data.map((v) => v.viewsNum ?? 0), 1);

  return (
    <div className="space-y-2">
      {data.map((video, idx) => {
        const rank = idx + 1;
        const isTop3 = rank <= 3;
        const viewsPct = Math.round(((video.viewsNum ?? 0) / maxViews) * 100);
        const engRatePct = (video.engagementRate ?? 0) * 100;
        const engGood = engRatePct >= 2.0;

        return (
          <button
            key={video.videoPk}
            type="button"
            onClick={() => onVideoClick?.(video.videoPk)}
            className={`w-full text-left flex items-center gap-3.5 px-4 py-3 rounded-xl border transition-all bg-white dark:bg-neutral-900 cursor-pointer ${
              isTop3
                ? "border-stone-900/30 dark:border-white/30 shadow-xs hover:bg-stone-50 dark:hover:bg-neutral-800/60"
                : "border-stone-200/80 dark:border-neutral-800 hover:bg-stone-50 dark:hover:bg-neutral-800/40 hover:border-stone-400"
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

            {/* Title & Metadata */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                  {video.titleBrief || "Untitled Video"}
                </p>
                {isTop3 && (
                  <Flame className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500 dark:text-neutral-400">
                <span className="font-medium text-stone-700 dark:text-neutral-300">
                  @{video.nickName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3" />
                  {formatDate(video.publishedAt)}
                </span>
                {video.durationBucket && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-[10px]">
                      {video.durationBucket}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Views Bar (Sky Blue) */}
            <div className="hidden sm:flex flex-col items-end gap-1 w-32 flex-shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-900 dark:text-white">
                <Eye className="w-3.5 h-3.5 text-sky-500" />
                {fmt(video.viewsNum ?? 0)}
              </div>
              <div className="w-full h-2 rounded-full bg-sky-100/60 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-sky-500 dark:bg-sky-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(viewsPct, 4)}%` }}
                />
              </div>
            </div>

            {/* Engagement */}
            <div className="hidden md:flex flex-col items-end gap-0.5 w-20 flex-shrink-0">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                Engage
              </span>
              <span
                className={`text-xs font-mono font-bold ${
                  engGood
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-stone-700 dark:text-neutral-300"
                }`}
              >
                {engRatePct.toFixed(1)}%
              </span>
            </div>

            <ChevronRight className="w-4 h-4 text-stone-400 flex-shrink-0 ml-1" />
          </button>
        );
      })}
    </div>
  );
}
