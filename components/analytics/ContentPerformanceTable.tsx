import { useState, useEffect } from "react";
import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";

import { Mono } from "@/components/dashboard";
import { formatNum, formatPct, initialsFrom } from "@/lib/analytics/formatters";
import {
  ACCOUNT_TINTS,
  CLUSTER_META,
  TIER_META,
} from "@/lib/analytics/meta";
import type { ContentRow, SortKey } from "@/lib/analytics/types";

type ContentPerformanceTableProps = {
  rows: ContentRow[];
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
  { field: "comments", label: "Comments" },
  { field: "shares", label: "Shares" },
];

export function ContentPerformanceTable({
  rows,
  sortBy,
  setSortBy,
  onRowClick,
}: ContentPerformanceTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [rows, sortBy]);

  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedRows = rows.slice(startIndex, endIndex);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] border-collapse text-left">
        <thead>
          <tr className="border-b border-stone-200/80 dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-950/50">
            <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-stone-400 w-12">
              #
            </th>
            <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Video & Creator
            </th>
            {NUMERIC_HEADERS.map((h) => (
              <th key={h.field} className="px-5 py-3 text-right">
                <SortableHeader
                  field={h.field}
                  label={h.label}
                  active={sortBy === h.field}
                  onSelect={setSortBy}
                />
              </th>
            ))}
            <th className="px-5 py-3 text-right">
              <SortableHeader
                field="engagement"
                label="Engagement"
                active={sortBy === "engagement"}
                onSelect={setSortBy}
              />
            </th>
            <th className="px-5 py-3 text-left">
              <SortableHeader
                field="viralProb"
                label="Viral Prob."
                active={sortBy === "viralProb"}
                onSelect={setSortBy}
              />
            </th>
            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Tier
            </th>
            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Cluster
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 dark:divide-neutral-800/80">
          {paginatedRows.map((v, idx) => {
            const accColor = ACCOUNT_TINTS[v.accountType] || "#0ea5e9";
            const tier = TIER_META[v.tier] || TIER_META["Mid"];
            const cluster = CLUSTER_META[v.clusterId] || CLUSTER_META[0];
            const probColor =
              v.viralProb >= 0.8
                ? "#10b981"
                : v.viralProb >= 0.6
                  ? "#0ea5e9"
                  : v.viralProb >= 0.4
                    ? "#f59e0b"
                    : "#ef4444";

            const globalIdx = startIndex + idx;

            return (
              <tr
                key={v.id}
                onClick={() => onRowClick?.(v)}
                className="hover:bg-stone-50/70 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group"
              >
                <td className="px-5 py-3.5">
                  <span
                    className={`font-mono text-xs font-bold ${
                      globalIdx < 3 ? "text-stone-900 dark:text-white" : "text-stone-400"
                    }`}
                  >
                    #{globalIdx + 1}
                  </span>
                </td>

                <td className="px-5 py-3.5">
                  <p className="font-bold text-xs leading-snug line-clamp-1 mb-1 text-stone-900 dark:text-white max-w-[280px] group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {v.title}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded flex items-center justify-center text-white font-black text-[8px]"
                      style={{ background: accColor }}
                    >
                      {initialsFrom(v.account)}
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-neutral-400 font-mono">
                      @{v.account}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-3.5 text-right font-mono font-bold text-xs text-stone-800 dark:text-neutral-200">
                  {formatNum(v.views)}
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-xs text-stone-600 dark:text-neutral-400">
                  {formatNum(v.likes)}
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-xs text-stone-600 dark:text-neutral-400">
                  {formatNum(v.comments)}
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-xs text-stone-600 dark:text-neutral-400">
                  {formatNum(v.shares)}
                </td>

                <td className="px-5 py-3.5 text-right">
                  <span
                    className={`font-mono font-bold text-xs ${
                      v.engagement >= 12
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-stone-800 dark:text-neutral-200"
                    }`}
                  >
                    {v.engagement}%
                  </span>
                </td>

                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2 min-w-[90px]">
                    <span
                      className="font-mono font-bold text-xs"
                      style={{ color: probColor }}
                    >
                      {formatPct(v.viralProb, 0)}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-stone-100 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${v.viralProb * 100}%`,
                          background: probColor,
                        }}
                      />
                    </div>
                  </div>
                </td>

                <td className="px-5 py-3.5">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border"
                    style={{
                      background: tier.tint,
                      color: tier.solid,
                      borderColor: `${tier.solid}33`,
                    }}
                  >
                    {v.tier}
                  </span>
                </td>

                <td className="px-5 py-3.5">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border"
                    style={{
                      background: cluster.tint,
                      color: cluster.solid,
                      borderColor: `${cluster.solid}33`,
                    }}
                  >
                    <cluster.Ico className="w-3 h-3" />
                    <span>C{v.clusterId}</span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-stone-200/80 dark:border-neutral-800 bg-stone-50/30 dark:bg-neutral-900">
          <span className="text-xs text-stone-500 dark:text-neutral-400">
            Showing <strong className="text-stone-900 dark:text-white font-mono">{startIndex + 1}</strong>-
            <strong className="text-stone-900 dark:text-white font-mono">{Math.min(endIndex, rows.length)}</strong> of{" "}
            <strong className="text-stone-900 dark:text-white font-mono">{rows.length}</strong> videos
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
                      ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm"
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

