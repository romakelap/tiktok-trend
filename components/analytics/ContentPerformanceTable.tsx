"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowDown, ChevronLeft, ChevronRight, Play, Video } from "lucide-react";

import { formatNum, formatPct, initialsFrom } from "@/lib/analytics/formatters";
import {
  ACCOUNT_TINTS,
  TIER_META,
} from "@/lib/analytics/meta";
import type { ContentRow, SortKey } from "@/lib/analytics/types";
import { CONTENT_PERFORMANCE } from "@/lib/analytics/mock-data";
import { resolveAvatarUrl } from "@/lib/utils";

type ContentPerformanceTableProps = {
  rows?: ContentRow[];
  sortBy: SortKey;
  setSortBy: (field: SortKey) => void;
  onRowClick?: (video: ContentRow) => void;
};

type SortableHeaderProps = {
  field: SortKey;
  label: string;
  active: boolean;
  onSelect: (field: SortKey) => void;
};

function SortableHeader({ field, label, active, onSelect }: SortableHeaderProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(field)}
      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:text-stone-700 dark:hover:text-neutral-200 transition-colors"
    >
      <span className={active ? "text-stone-900 dark:text-white font-black" : ""}>
        {label}
      </span>
      {active && <ArrowDown className="w-2.5 h-2.5 text-sky-500" strokeWidth={2.5} />}
    </button>
  );
}

const NUMERIC_HEADERS: { field: SortKey; label: string }[] = [
  { field: "views", label: "Views" },
  { field: "likes", label: "Likes" },
  { field: "comments", label: "Komentar" },
  { field: "shares", label: "Shares" },
];

function VideoThumbnailCell({
  video,
  rank,
}: {
  video: ContentRow;
  rank: number;
}) {
  const [imgError, setImgError] = useState(false);
  const rawCover =
    video.coverUrl ||
    (video as any).cover_url ||
    (video as any).originCover ||
    (video as any).dynamicCover ||
    (video as any).thumbnailUrl ||
    (video as any).cover;

  const resolvedCover = useMemo(() => {
    if (!rawCover) return null;
    return resolveAvatarUrl(rawCover);
  }, [rawCover]);

  // Gradient themes for fallback poster based on tier and rank
  const posterGrads = [
    "from-slate-900 via-rose-950 to-stone-900 text-rose-300",
    "from-slate-900 via-indigo-950 to-stone-900 text-indigo-300",
    "from-slate-900 via-emerald-950 to-stone-900 text-emerald-300",
    "from-slate-900 via-sky-950 to-stone-900 text-sky-300",
    "from-slate-900 via-purple-950 to-stone-900 text-purple-300",
  ];
  const activeGrad =
    posterGrads[Math.abs(Number(video.clusterId || 0) + rank) % posterGrads.length];

  return (
    <div className="w-12 h-16 sm:w-13 sm:h-17 rounded-lg bg-stone-900 border border-stone-200/80 dark:border-neutral-700/80 overflow-hidden flex-shrink-0 relative group/thumb shadow-xs select-none">
      {resolvedCover && !imgError ? (
        <img
          src={resolvedCover}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-b ${activeGrad} flex flex-col items-center justify-between p-1.5 relative overflow-hidden`}
        >
          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "6px 6px",
            }}
          />

          {/* Top Rank + Tier tag */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="text-[8px] font-mono font-black text-white/90 bg-black/60 px-1 py-0.2 rounded leading-none">
              #{rank}
            </span>
            <span className="text-[7px] font-black text-white/75 uppercase tracking-tight">
              {video.tier}
            </span>
          </div>

          {/* Center Play/Video Icon */}
          <div className="z-10 w-6 h-6 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center text-white border border-white/20 shadow-xs">
            <Video className="w-3 h-3 text-white" strokeWidth={2.2} />
          </div>

          {/* Bottom Label */}
          <div className="w-full text-center z-10">
            <span className="text-[7px] font-mono font-black text-white/80 uppercase tracking-wider block">
              VIDEO
            </span>
          </div>
        </div>
      )}

      {/* Hover Play Overlay */}
      <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
        <div className="w-6 h-6 rounded-full bg-white text-stone-900 flex items-center justify-center shadow-md transform scale-90 group-hover:scale-100 transition-transform">
          <Play className="w-2.5 h-2.5 fill-current ml-0.5 text-stone-900" />
        </div>
      </div>
    </div>
  );
}

export function ContentPerformanceTable({
  rows = [],
  sortBy,
  setSortBy,
  onRowClick,
}: ContentPerformanceTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 8;

  const displayRows = useMemo(() => {
    if (rows && rows.length > 0) return rows;
    return CONTENT_PERFORMANCE;
  }, [rows]);

  useEffect(() => {
    setCurrentPage(1);
  }, [displayRows, sortBy]);

  const totalPages = Math.ceil(displayRows.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedRows = displayRows.slice(startIndex, endIndex);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] border-collapse text-left">
        <thead>
          <tr className="border-b border-stone-200/80 dark:border-neutral-800 bg-stone-50/60 dark:bg-neutral-900/60 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            <th className="px-4 py-3.5 w-10 text-center">#</th>
            <th className="px-4 py-3.5">Video & Kreator</th>
            {NUMERIC_HEADERS.map((h) => (
              <th key={h.field} className="px-4 py-3.5 text-right">
                <SortableHeader
                  field={h.field}
                  label={h.label}
                  active={sortBy === h.field}
                  onSelect={setSortBy}
                />
              </th>
            ))}
            <th className="px-4 py-3.5 text-right">
              <SortableHeader
                field="engagement"
                label="Engagement"
                active={sortBy === "engagement"}
                onSelect={setSortBy}
              />
            </th>
            <th className="px-4 py-3.5 text-left">
              <SortableHeader
                field="viralProb"
                label="Probabilitas Viral"
                active={sortBy === "viralProb"}
                onSelect={setSortBy}
              />
            </th>
            <th className="px-4 py-3.5 text-center">Tier</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 dark:divide-neutral-800/80">
          {paginatedRows.map((v, idx) => {
            const accColor = ACCOUNT_TINTS[v.accountType] || "#0284c7";
            const tier = TIER_META[v.tier] || TIER_META["Mid"];
            const prob = v.viralProb || 0.65;
            const probColor =
              prob >= 0.8
                ? "#10b981"
                : prob >= 0.6
                  ? "#0284c7"
                  : prob >= 0.4
                    ? "#f59e0b"
                    : "#ef4444";

            const globalIdx = startIndex + idx;

            return (
              <tr
                key={v.id || idx}
                onClick={() => onRowClick?.(v)}
                className="hover:bg-stone-50/80 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group"
              >
                {/* # Rank */}
                <td className="px-4 py-3.5 text-center">
                  <span
                    className={`font-mono text-xs font-bold ${
                      globalIdx < 3 ? "text-stone-900 dark:text-white" : "text-stone-400"
                    }`}
                  >
                    #{globalIdx + 1}
                  </span>
                </td>

                {/* Video Cover + Title & Creator */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3 min-w-0 max-w-sm sm:max-w-md">
                    {/* Leftmost Video Cover Thumbnail */}
                    <VideoThumbnailCell video={v} rank={globalIdx + 1} />

                    {/* Title & Creator */}
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs leading-snug line-clamp-2 mb-1.5 text-stone-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {v.title}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center text-white font-black text-[8px] flex-shrink-0"
                          style={{ background: accColor }}
                        >
                          {initialsFrom(v.account)}
                        </span>
                        <span className="text-[11px] text-stone-500 dark:text-neutral-400 font-mono truncate">
                          @{v.account}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Metrics */}
                <td className="px-4 py-3.5 text-right font-mono font-bold text-xs text-stone-900 dark:text-white">
                  {formatNum(v.views)}
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-xs text-stone-600 dark:text-neutral-400">
                  {formatNum(v.likes)}
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-xs text-stone-600 dark:text-neutral-400">
                  {formatNum(v.comments)}
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-xs text-stone-600 dark:text-neutral-400">
                  {formatNum(v.shares)}
                </td>

                {/* Engagement */}
                <td className="px-4 py-3.5 text-right">
                  <span
                    className={`font-mono font-bold text-xs ${
                      v.engagement >= 10
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-stone-800 dark:text-neutral-200"
                    }`}
                  >
                    {v.engagement}%
                  </span>
                </td>

                {/* Viral Prob. */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2 min-w-[110px]">
                    <span
                      className="font-mono font-bold text-xs w-9"
                      style={{ color: probColor }}
                    >
                      {formatPct(prob, 0)}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-stone-100 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${prob * 100}%`,
                          background: probColor,
                        }}
                      />
                    </div>
                  </div>
                </td>

                {/* Tier */}
                <td className="px-4 py-3.5 text-center">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border"
                    style={{
                      background: tier.tint,
                      color: tier.solid,
                      borderColor: `${tier.solid}33`,
                    }}
                  >
                    {v.tier}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-stone-200/80 dark:border-neutral-800 bg-stone-50/40 dark:bg-neutral-900/50">
          <span className="text-xs text-stone-500 dark:text-neutral-400">
            Menampilkan <strong className="text-stone-900 dark:text-white font-mono">{startIndex + 1}</strong>-
            <strong className="text-stone-900 dark:text-white font-mono">{Math.min(endIndex, displayRows.length)}</strong> dari{" "}
            <strong className="text-stone-900 dark:text-white font-mono">{displayRows.length}</strong> video
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="w-7 h-7 rounded-lg flex items-center justify-center border border-stone-200 dark:border-neutral-800 text-stone-600 dark:text-neutral-300 disabled:opacity-30 hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              const isSelected = p === currentPage;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs"
                      : "border border-stone-200 dark:border-neutral-800 text-stone-600 dark:text-neutral-400 hover:bg-stone-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="w-7 h-7 rounded-lg flex items-center justify-center border border-stone-200 dark:border-neutral-800 text-stone-600 dark:text-neutral-300 disabled:opacity-30 hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
