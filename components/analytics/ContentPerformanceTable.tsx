"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowDown, ChevronLeft, ChevronRight, Play, Video } from "lucide-react";

import { formatNum, formatPct } from "@/lib/analytics/formatters";
import type { ContentRow, SortKey } from "@/lib/analytics/types";
import { CONTENT_PERFORMANCE } from "@/lib/analytics/mock-data";
import { resolveAvatarUrl } from "@/lib/utils";

type ContentPerformanceTableProps = {
  rows?: ContentRow[];
  sortBy: SortKey;
  setSortBy: (field: SortKey) => void;
  onRowClick?: (video: ContentRow) => void;
};

export function ContentPerformanceTable({
  rows = [],
  sortBy,
  setSortBy,
  onRowClick,
}: ContentPerformanceTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 4;

  const displayRows = useMemo(() => {
    const list = rows !== undefined ? rows : CONTENT_PERFORMANCE;
    return [...list].sort((a, b) => {
      if (sortBy === "viralProb") {
        return (b.viralProb || 0) - (a.viralProb || 0);
      }
      if (sortBy === "engagement") {
        return (b.engagement || 0) - (a.engagement || 0);
      }
      if (sortBy === "views") {
        return (b.views || 0) - (a.views || 0);
      }
      return 0;
    });
  }, [rows, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [displayRows, sortBy]);

  const totalPages = Math.ceil(displayRows.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedRows = displayRows.slice(startIndex, endIndex);

  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 overflow-hidden shadow-xs">
      {/* Card Header & Filter Toggles */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 dark:border-neutral-800 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-xs">
            <span className="font-mono">≡</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-tight">
              Matriks Performa Konten Video
            </h3>
            <p className="text-xs text-stone-400 dark:text-neutral-500">
              50 video teranalisis · Disertai prediksi viralitas &amp; tier
            </p>
          </div>
        </div>

        {/* Filter Toggle Buttons */}
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-neutral-800 rounded-lg p-1 text-xs">
          <button
            type="button"
            onClick={() => setSortBy("viralProb")}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              sortBy === "viralProb"
                ? "bg-white dark:bg-neutral-900 text-sky-600 dark:text-sky-400 shadow-xs border border-stone-200 dark:border-neutral-700 font-bold"
                : "text-stone-500 dark:text-neutral-400 hover:text-stone-700 dark:hover:text-neutral-200"
            }`}
          >
            Probabilitas Viral
          </button>
          <button
            type="button"
            onClick={() => setSortBy("engagement")}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              sortBy === "engagement"
                ? "bg-white dark:bg-neutral-900 text-sky-600 dark:text-sky-400 shadow-xs border border-stone-200 dark:border-neutral-700 font-bold"
                : "text-stone-500 dark:text-neutral-400 hover:text-stone-700 dark:hover:text-neutral-200"
            }`}
          >
            Engagement Rate
          </button>
          <button
            type="button"
            onClick={() => setSortBy("views")}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              sortBy === "views"
                ? "bg-white dark:bg-neutral-900 text-sky-600 dark:text-sky-400 shadow-xs border border-stone-200 dark:border-neutral-700 font-bold"
                : "text-stone-500 dark:text-neutral-400 hover:text-stone-700 dark:hover:text-neutral-200"
            }`}
          >
            Views
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 dark:border-neutral-800 text-[10px] font-bold uppercase tracking-wider text-stone-400 bg-stone-50/50 dark:bg-neutral-900/50">
              <th className="px-4 py-3 w-8 text-center">#</th>
              <th className="px-4 py-3">Video &amp; Kreator</th>
              <th className="px-4 py-3 text-right">Views</th>
              <th className="px-4 py-3 text-right">Likes</th>
              <th className="px-4 py-3 text-right">Engagement</th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-1">
                  <span>Probabilitas Viral</span>
                  <ArrowDown className="w-3 h-3 text-sky-500" />
                </div>
              </th>
              <th className="px-4 py-3 text-center">Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-neutral-800">
            {paginatedRows.map((v, idx) => {
              const globalRank = startIndex + idx + 1;
              const prob = v.viralProb || 0.65;
              const probPct = Math.round(prob * 100);
              const isHigh = v.tier === "High" || v.tier === "Top" || prob >= 0.8;

              return (
                <tr
                  key={v.id || idx}
                  onClick={() => onRowClick?.(v)}
                  className="hover:bg-stone-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group text-xs"
                >
                  {/* Rank */}
                  <td className="px-4 py-3.5 text-center font-bold text-stone-500">
                    #{globalRank}
                  </td>

                  {/* Thumbnail + Title + Creator */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5 min-w-0 max-w-xs sm:max-w-sm">
                      {/* Dark thumbnail with rank badge */}
                      <div className="w-12 h-8 rounded bg-stone-900 flex-shrink-0 relative overflow-hidden flex items-center justify-center text-white">
                        <span className={`text-[8px] font-black px-1 rounded ${isHigh ? "bg-emerald-600" : "bg-stone-800 text-stone-300"}`}>
                          #{globalRank} {v.tier?.toUpperCase() || "MID"}
                        </span>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Play className="w-3 h-3 fill-white text-white" />
                        </div>
                      </div>

                      {/* Title & Creator */}
                      <div className="min-w-0">
                        <p className="font-semibold text-stone-900 dark:text-white truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          {v.title}
                        </p>
                        <p className="text-[10px] text-stone-400 dark:text-neutral-500 truncate flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-stone-300 dark:bg-neutral-600 inline-block" />
                          @{v.account || "imploracosmetics"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Views */}
                  <td className="px-4 py-3.5 text-right font-bold text-stone-900 dark:text-white">
                    {formatNum(v.views)}
                  </td>

                  {/* Likes */}
                  <td className="px-4 py-3.5 text-right text-stone-600 dark:text-neutral-300 font-medium">
                    {formatNum(v.likes)}
                  </td>

                  {/* Engagement */}
                  <td className="px-4 py-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {v.engagement ? `${v.engagement.toFixed(1)}%` : "0.1%"}
                  </td>

                  {/* Viral probability percentage + progress bar */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 w-9 text-right font-mono">
                        {probPct}%
                      </span>
                      <div className="w-24 h-1.5 rounded-full bg-stone-100 dark:bg-neutral-800 overflow-hidden flex-1">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${probPct}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Tier */}
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`px-2 py-0.5 text-[9.5px] font-bold rounded ${
                        isHigh
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                          : "bg-stone-100 text-stone-600 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      {v.tier || "Low"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-3 border-t border-stone-200 dark:border-neutral-800 flex items-center justify-between text-xs text-stone-500 dark:text-neutral-400">
        <span>
          Menampilkan <strong>{startIndex + 1}–{Math.min(endIndex, displayRows.length)}</strong> dari <strong>{displayRows.length}</strong> video
        </span>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => (
            <button
              key={i + 1}
              type="button"
              onClick={() => setCurrentPage(i + 1)}
              className={`w-7 h-7 rounded-md font-bold transition-all cursor-pointer ${
                currentPage === i + 1
                  ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-xs"
                  : "bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400 hover:bg-stone-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          {totalPages > 3 && (
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="w-7 h-7 rounded-md bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400 hover:bg-stone-200 flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
