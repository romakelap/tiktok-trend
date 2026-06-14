"use client";

import type { ElementType } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Crown,
  DollarSign,
  Eye,
  Flame,
  Video,
} from "lucide-react";

import { GridBg } from "@/components/layout/GridBg";
import { TOKENS } from "@/lib/design-tokens";
import { CATEGORIES } from "@/lib/dashboard/mock-data";
import { fmt, fmtPct, fmtRp } from "@/lib/dashboard/formatters";
import type { CategoryFilterValue } from "./CategoryFilterDropdown";
import type { Category } from "@/lib/dashboard/types";

type KpiCard = {
  Ico: ElementType;
  label: string;
  value: string;
  sub: string;
  delta: string;
  pos: boolean;
  fontSize?: number;
};

/** Six KPI tiles summarising the filtered category set. */
export function KpiCards({
  filterCategory,
  categories = CATEGORIES,
}: {
  filterCategory: CategoryFilterValue;
  categories?: Category[];
}) {
  const filtered =
    filterCategory === "all"
      ? categories
      : categories.filter((c) => c.id === filterCategory);

  const totalViews = filtered.reduce((s, c) => s + c.views, 0);
  const totalVideos = filtered.reduce((s, c) => s + c.videos, 0);
  const avgEngagement = filtered.length > 0
    ? filtered.reduce((s, c) => s + c.engagement, 0) / filtered.length
    : 0;
  const avgViral = filtered.length > 0
    ? filtered.reduce((s, c) => s + c.viralProb, 0) / filtered.length
    : 0;
  const totalRevenue = filtered.reduce((s, c) => s + c.revenue, 0);
  
  const sortedCats = [...categories].sort((a, b) => b.engagement - a.engagement);
  const bestCat = sortedCats[0] || CATEGORIES[0];

  const cards: KpiCard[] = [
    {
      Ico: Eye,
      label: "Total Views",
      value: fmt(totalViews),
      sub: "Akumulasi semua kategori",
      delta: "+22%",
      pos: true,
    },
    {
      Ico: Video,
      label: "Total Videos",
      value: totalVideos.toString(),
      sub: "Semua konten aktif",
      delta: "+8%",
      pos: true,
    },
    {
      Ico: Activity,
      label: "Avg. Engagement",
      value: `${avgEngagement.toFixed(1)}%`,
      sub: "Rata-rata tertimbang",
      delta: "+1.4%",
      pos: true,
    },
    {
      Ico: Flame,
      label: "Avg. Viral Score",
      value: fmtPct(avgViral),
      sub: "Model RF-viral-v2.4",
      delta: "+5.2%",
      pos: true,
    },
    {
      Ico: DollarSign,
      label: "Est. Revenue",
      value: fmtRp(totalRevenue),
      sub: "Estimasi GMV total",
      delta: "-4.1%",
      pos: false,
    },
    {
      Ico: Crown,
      label: "Best Category",
      value: bestCat.label,
      sub: `Engagement ${bestCat.engagement}%`,
      delta: "+2.1%",
      pos: true,
      fontSize: 18,
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="relative p-4 rounded-2xl overflow-hidden hover:-translate-y-0.5 transition-all duration-200"
          style={{
            background: TOKENS.cardSoft,
            border: `1px solid ${TOKENS.cardBorder}`,
            boxShadow:
              "0 2px 12px rgba(0,0,0,0.04),inset 0 1px 0 rgba(255,255,255,1)",
          }}
        >
          <GridBg theme="light" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "#111",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
                }}
              >
                <c.Ico className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <span
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-black"
                style={{
                  background: c.pos
                    ? "rgba(5,150,105,0.08)"
                    : "rgba(220,38,38,0.07)",
                  color: c.pos ? "#059669" : "#dc2626",
                }}
              >
                {c.pos ? (
                  <ArrowUpRight className="w-2.5 h-2.5" strokeWidth={2.5} />
                ) : (
                  <ArrowDownRight
                    className="w-2.5 h-2.5"
                    strokeWidth={2.5}
                  />
                )}
                {c.delta}
              </span>
            </div>
            <p
              className="text-[9px] font-black uppercase tracking-[0.14em] mb-1"
              style={{ color: TOKENS.textMuted }}
            >
              {c.label}
            </p>
            <p
              className="font-black mb-0.5 leading-tight tracking-tight truncate"
              style={{ color: TOKENS.text, fontSize: c.fontSize ?? 22 }}
            >
              {c.value}
            </p>
            <p
              className="text-[10.5px]"
              style={{ color: TOKENS.textMuted }}
            >
              {c.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
