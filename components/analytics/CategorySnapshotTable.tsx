"use client";

import {
  BookOpen,
  Smile,
  Utensils,
  Home,
  Monitor,
  Flame,
} from "lucide-react";
import { TOKENS } from "@/lib/design-tokens";

export interface CategorySnapshotItem {
  category: string;
  videoCount: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  avgEngagementRate: number;
  avgViralScore: number;
  totalGmvLocal: number;
  topHashtag: string | null;
  bestTime: string | null;
}

type Props = {
  data: CategorySnapshotItem[];
  loading?: boolean;
};

const CATEGORY_META: Record<
  string,
  { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; color: string; bg: string }
> = {
  Edukasi:            { icon: BookOpen, color: "#0ea5e9", bg: "rgba(14,165,233,0.08)"  },
  Komedi:             { icon: Smile,    color: "#f59e0b", bg: "rgba(245,158,11,0.08)"  },
  Kuliner:            { icon: Utensils, color: "#ef4444", bg: "rgba(239,68,68,0.08)"   },
  "Lifestyle & Home": { icon: Home,     color: "#a855f7", bg: "rgba(168,85,247,0.08)"  },
  Teknologi:          { icon: Monitor,  color: "#10b981", bg: "rgba(16,185,129,0.08)"  },
};

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function fmtIDR(n: number) {
  if (n <= 0) return "—";
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}rb`;
  return `Rp ${n}`;
}

function EngagementBadge({ value }: { value: number }) {
  const pct = value * 100;
  const isHigh = pct >= 7;
  return (
    <span
      className="px-2 py-0.5 rounded-md text-[11px] font-black"
      style={{
        background: isHigh ? "rgba(5,150,105,0.08)" : "rgba(180,83,9,0.08)",
        color: isHigh ? "#059669" : "#b45309",
      }}
    >
      {pct.toFixed(1)}%
    </span>
  );
}

function ViralBadge({ value }: { value: number }) {
  const pct = value * 100;
  const color = pct >= 60 ? "#10b981" : pct >= 30 ? "#f59e0b" : "#94a3b8";
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative w-14 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
      </div>
      <span className="text-[11px] font-black" style={{ color }}>{pct.toFixed(0)}%</span>
    </div>
  );
}

const HEADERS = [
  "Kategori", "Video", "Total Views", "Engagement", "Viral Score", "GMV", "Top Hashtag", "Best Time",
];

export function CategorySnapshotTable({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: TOKENS.divider }}>
        <div className="h-12 animate-pulse" style={{ background: "rgba(0,0,0,0.03)" }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse border-t" style={{ background: i % 2 === 0 ? "#fff" : "rgba(0,0,0,0.01)", borderColor: TOKENS.divider }} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 rounded-2xl border border-dashed text-xs font-bold"
           style={{ borderColor: TOKENS.divider, color: TOKENS.textMuted }}>
        Belum ada data snapshot kategori
      </div>
    );
  }

  // Sort by totalViews descending
  const sorted = [...data].sort((a, b) => (b.totalViews ?? 0) - (a.totalViews ?? 0));

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ borderColor: TOKENS.divider, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
    >
      {/* Header */}
      <div className="px-5 py-3.5 border-b bg-gray-50/60" style={{ borderColor: TOKENS.divider }}>
        <h3 className="text-xs font-black uppercase tracking-wider" style={{ color: TOKENS.textMuted }}>
          Category Snapshot — Global Market Data
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b" style={{ borderColor: TOKENS.divider }}>
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider"
                  style={{ color: TOKENS.textMuted }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const meta = CATEGORY_META[row.category] ?? { icon: Flame, color: "#6b7280", bg: "rgba(107,114,128,0.08)" };
              const CatIcon = meta.icon;
              return (
                <tr
                  key={row.category}
                  className="border-b transition-colors hover:bg-neutral-50"
                  style={{
                    borderColor: TOKENS.divider,
                    background: i === 0 ? "rgba(0,0,0,0.012)" : "transparent",
                  }}
                >
                  {/* Category */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: meta.bg, color: meta.color }}
                      >
                        <CatIcon className="w-3.5 h-3.5" strokeWidth={2.2} />
                      </div>
                      <span className="text-xs font-black" style={{ color: TOKENS.text }}>{row.category}</span>
                    </div>
                  </td>

                  {/* Video count */}
                  <td className="px-5 py-3.5 text-xs font-bold" style={{ color: TOKENS.text }}>
                    {(row.videoCount ?? 0).toLocaleString("id-ID")}
                  </td>

                  {/* Total views */}
                  <td className="px-5 py-3.5 text-xs font-black" style={{ color: TOKENS.text }}>
                    {fmt(row.totalViews ?? 0)}
                  </td>

                  {/* Engagement */}
                  <td className="px-5 py-3.5">
                    <EngagementBadge value={row.avgEngagementRate ?? 0} />
                  </td>

                  {/* Viral score */}
                  <td className="px-5 py-3.5">
                    <ViralBadge value={row.avgViralScore ?? 0} />
                  </td>

                  {/* GMV */}
                  <td className="px-5 py-3.5 text-xs font-bold" style={{ color: TOKENS.text }}>
                    {fmtIDR(row.totalGmvLocal ?? 0)}
                  </td>

                  {/* Top hashtag */}
                  <td className="px-5 py-3.5">
                    {row.topHashtag ? (
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-black"
                        style={{ background: meta.bg, color: meta.color }}
                      >
                        #{row.topHashtag.replace(/^#/, "")}
                      </span>
                    ) : (
                      <span className="text-[11px]" style={{ color: TOKENS.textMuted }}>—</span>
                    )}
                  </td>

                  {/* Best time */}
                  <td className="px-5 py-3.5 text-[11px] font-bold" style={{ color: TOKENS.textMuted }}>
                    {row.bestTime ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
