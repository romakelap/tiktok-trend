import { useState, useEffect } from "react";
import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";

import { Mono } from "@/components/dashboard";
import { TOKENS } from "@/lib/design-tokens";
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
      className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-all hover:opacity-75"
      style={{ color: active ? TOKENS.text : TOKENS.textMuted }}
    >
      {label}
      {active && <ArrowDown className="w-2.5 h-2.5" strokeWidth={3} />}
    </button>
  );
}

const NUMERIC_HEADERS: { field: SortKey; label: string }[] = [
  { field: "views", label: "Views" },
  { field: "likes", label: "Likes" },
  { field: "comments", label: "Comments" },
  { field: "shares", label: "Shares" },
];

/**
 * Sortable performance table: lists each video with raw metrics, engagement,
 * ML viral probability bar, tier badge, and cluster chip.
 */
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
      <table className="w-full min-w-[1200px]">
        <thead>
          <tr style={{ borderBottom: `1px solid ${TOKENS.divider}` }}>
            <th className="text-left px-5 py-3">
              <span
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: TOKENS.textMuted }}
              >
                #
              </span>
            </th>
            <th className="text-left px-5 py-3">
              <span
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: TOKENS.textMuted }}
              >
                Video
              </span>
            </th>
            {NUMERIC_HEADERS.map((h) => (
              <th key={h.field} className="text-left px-5 py-3">
                <SortableHeader
                  field={h.field}
                  label={h.label}
                  active={sortBy === h.field}
                  onSelect={setSortBy}
                />
              </th>
            ))}
            <th className="text-left px-5 py-3">
              <SortableHeader
                field="engagement"
                label="Engagement"
                active={sortBy === "engagement"}
                onSelect={setSortBy}
              />
            </th>
            <th className="text-left px-5 py-3">
              <SortableHeader
                field="viralProb"
                label="Viral Prob."
                active={sortBy === "viralProb"}
                onSelect={setSortBy}
              />
            </th>
            <th className="text-left px-5 py-3">
              <span
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: TOKENS.textMuted }}
              >
                Tier
              </span>
            </th>
            <th className="text-left px-5 py-3">
              <span
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: TOKENS.textMuted }}
              >
                Cluster
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((v, idx) => {
            const accColor = ACCOUNT_TINTS[v.accountType];
            const tier = TIER_META[v.tier] || TIER_META["Mid"];
            const cluster = CLUSTER_META[v.clusterId] || CLUSTER_META[0];
            const probColor =
              v.viralProb >= 0.8
                ? "#047857"
                : v.viralProb >= 0.6
                  ? "#059669"
                  : v.viralProb >= 0.4
                    ? "#d97706"
                    : "#dc2626";

            const globalIdx = startIndex + idx;

            return (
              <tr
                key={v.id}
                onClick={() => onRowClick?.(v)}
                className="transition-colors hover:bg-black/[0.02] cursor-pointer"
                style={{
                  borderBottom:
                    idx < paginatedRows.length - 1
                      ? `1px solid ${TOKENS.divider}`
                      : "none",
                }}
              >
                <td className="px-5 py-3.5">
                  <span
                    className="font-black text-sm"
                    style={{ color: globalIdx < 3 ? TOKENS.text : TOKENS.textMuted }}
                  >
                    {globalIdx + 1}
                  </span>
                </td>

                <td className="px-5 py-3.5">
                  <p
                    className="font-black text-xs leading-snug line-clamp-1 mb-1"
                    style={{ color: TOKENS.text, maxWidth: 320 }}
                  >
                    {v.title}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 text-white font-black"
                      style={{ background: accColor, fontSize: 8 }}
                    >
                      {initialsFrom(v.account)}
                    </span>
                    <Mono size="xs" dim className="font-bold">
                      @{v.account}
                    </Mono>
                  </div>
                </td>

                <td className="px-5 py-3.5">
                  <span
                    className="font-black text-xs"
                    style={{ color: TOKENS.text }}
                  >
                    {formatNum(v.views)}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-bold text-xs" style={{ color: "#dc2626" }}>
                    {formatNum(v.likes)}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-bold text-xs" style={{ color: "#0369a1" }}>
                    {formatNum(v.comments)}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-bold text-xs" style={{ color: "#059669" }}>
                    {formatNum(v.shares)}
                  </span>
                </td>

                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <span
                      className="font-black text-xs flex-shrink-0"
                      style={{
                        color: v.engagement >= 12 ? "#059669" : TOKENS.text,
                      }}
                    >
                      {v.engagement}%
                    </span>
                    <div
                      className="flex-1 h-1 rounded-full overflow-hidden"
                      style={{ background: TOKENS.barBg }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(v.engagement * 5, 100)}%`,
                          background: v.engagement >= 12 ? "#059669" : "#111",
                        }}
                      />
                    </div>
                  </div>
                </td>

                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <Mono
                      size="sm"
                      className="font-black flex-shrink-0"
                      style={{ color: probColor }}
                    >
                      {formatPct(v.viralProb, 0)}
                    </Mono>
                    <div
                      className="flex-1 h-1 rounded-full overflow-hidden"
                      style={{ background: TOKENS.barBg }}
                    >
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
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md font-black text-[10px] uppercase tracking-wider"
                    style={{
                      background: tier.tint,
                      color: tier.solid,
                      border: `1px solid ${tier.solid}33`,
                    }}
                  >
                    <span className="flex items-center gap-0.5">
                      {[1, 2, 3, 4].map((i) => (
                        <span
                          key={i}
                          className="w-1 h-1 rounded-full"
                          style={{
                            background:
                              i <= tier.dots ? tier.solid : "rgba(0,0,0,0.12)",
                          }}
                        />
                      ))}
                    </span>
                    {v.tier}
                  </span>
                </td>

                <td className="px-5 py-3.5">
                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md font-black"
                    style={{
                      background: cluster.tint,
                      color: cluster.solid,
                      border: `1px solid ${cluster.solid}33`,
                      fontSize: 11,
                    }}
                  >
                    <cluster.Ico className="w-3 h-3" strokeWidth={2.4} />
                    <Mono
                      size="xs"
                      className="font-black"
                      style={{ color: cluster.solid }}
                    >
                      C{v.clusterId}
                    </Mono>
                    <span className="uppercase tracking-wider">
                      ·{cluster.short}
                    </span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div 
          className="flex items-center justify-between px-5 py-4 bg-black/[0.01]"
          style={{ borderTop: `1px solid ${TOKENS.divider}` }}
        >
          <span className="text-xs" style={{ color: TOKENS.textMuted }}>
            Menampilkan <strong style={{ color: TOKENS.text }}>{Math.min(startIndex + 1, rows.length)}</strong> -{" "}
            <strong style={{ color: TOKENS.text }}>{Math.min(endIndex, rows.length)}</strong> dari{" "}
            <strong style={{ color: TOKENS.text }}>{rows.length}</strong> video
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all hover:bg-black/5 disabled:opacity-40 disabled:hover:bg-transparent"
              style={{ borderColor: TOKENS.inputBorder, color: TOKENS.text }}
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              const isSelected = p === currentPage;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all border"
                  style={{
                    background: isSelected ? "#111" : "transparent",
                    color: isSelected ? "#fff" : TOKENS.text,
                    borderColor: isSelected ? "#111" : TOKENS.inputBorder,
                  }}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all hover:bg-black/5 disabled:opacity-40 disabled:hover:bg-transparent"
              style={{ borderColor: TOKENS.inputBorder, color: TOKENS.text }}
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
