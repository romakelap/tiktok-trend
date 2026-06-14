"use client";

import { useState } from "react";
import { Layers } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { GridBg } from "@/components/layout/GridBg";
import { TOKENS } from "@/lib/design-tokens";
import { CATEGORIES } from "@/lib/dashboard/mock-data";
import { fmt, fmtPct, fmtRp } from "@/lib/dashboard/formatters";
import type { Category, CategoryId } from "@/lib/dashboard/types";
import { Mono } from "./Mono";

type MetricKey = "views" | "engagement" | "viralProb" | "revenue";

type Metric = {
  key: MetricKey;
  label: string;
  fmt: (v: number) => string;
};

const METRICS: Metric[] = [
  { key: "views", label: "Views", fmt },
  { key: "engagement", label: "Engagement", fmt: (v) => `${v}%` },
  { key: "viralProb", label: "Viral", fmt: (v) => fmtPct(v) },
  { key: "revenue", label: "Revenue", fmt: fmtRp },
];

type CategoryComparisonProps = {
  onSelectCategory: (id: CategoryId) => void;
  selectedCategory: CategoryId | null;
  categories?: Category[];
};

type CustomBarProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
};

/** Bar chart + table for comparing the 5 main categories across one metric. */
export function CategoryComparison({
  onSelectCategory,
  selectedCategory,
  categories = CATEGORIES,
}: CategoryComparisonProps) {
  const [metric, setMetric] = useState<MetricKey>("engagement");
  const m = METRICS.find((x) => x.key === metric)!;

  const chartData = categories.map((c) => ({
    name: c.label,
    value: c[metric] as number,
    color: c.color,
  }));

  function CustomBar(props: CustomBarProps) {
    const { x = 0, y = 0, width = 0, height = 0, index = 0 } = props;
    const cat = categories[index];
    if (!cat) return null;
    const sel = selectedCategory === cat.id;
    return (
      <g
        onClick={() => onSelectCategory(cat.id)}
        style={{ cursor: "pointer" }}
      >
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={cat.color}
          rx={4}
          ry={4}
          opacity={selectedCategory && !sel ? 0.4 : 1}
        />
        {sel ? (
          <rect
            x={x - 2}
            y={y - 2}
            width={width + 4}
            height={height + 2}
            fill="none"
            stroke={cat.color}
            strokeWidth={2}
            rx={5}
            ry={5}
          />
        ) : null}
      </g>
    );
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: TOKENS.cardSoft,
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow:
          "0 4px 20px rgba(0,0,0,0.04),inset 0 1px 0 rgba(255,255,255,1)",
      }}
    >
      <GridBg theme="light" />
      <div className="relative z-10">
        <div
          className="flex items-center justify-between flex-wrap gap-3 px-6 pt-6 pb-4"
          style={{ borderBottom: `1px solid ${TOKENS.divider}` }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "#111" }}
            >
              <Layers className="w-4 h-4 text-white" strokeWidth={2.4} />
            </div>
            <div>
              <h2
                className="font-black text-sm tracking-tight"
                style={{ color: TOKENS.text }}
              >
                Category Comparison
              </h2>
              <p
                className="text-[11px]"
                style={{ color: TOKENS.textMuted }}
              >
                Klik bar untuk lihat detail kategori
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-1 p-0.5 rounded-xl"
            style={{
              background: "rgba(0,0,0,0.04)",
              border: `1px solid ${TOKENS.inputBorder}`,
            }}
          >
            {METRICS.map((opt) => {
              const sel = metric === opt.key;
              return (
                <button
                  type="button"
                  key={opt.key}
                  onClick={() => setMetric(opt.key)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-black transition-all"
                  style={{
                    background: sel ? "#fff" : "transparent",
                    color: sel ? TOKENS.text : TOKENS.textMuted,
                    boxShadow: sel ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-6 pt-5" style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              barCategoryGap="30%"
            >
              <CartesianGrid stroke={TOKENS.gridLine} vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fontWeight: 700,
                  fill: TOKENS.textMuted,
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={m.fmt}
                tick={{
                  fontSize: 10,
                  fontWeight: 700,
                  fill: TOKENS.textMuted,
                }}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.02)" }}
                contentStyle={{
                  background: "#fff",
                  border: `1px solid ${TOKENS.cardBorder}`,
                  borderRadius: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                }}
                formatter={(v: number) => [m.fmt(v), m.label]}
              />
              <Bar
                dataKey="value"
                radius={[5, 5, 0, 0]}
                shape={(props: unknown) => <CustomBar {...(props as CustomBarProps)} />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="px-6 pb-6 mt-2 overflow-x-auto">
          <p
            className="text-[10px] font-black uppercase tracking-widest mb-3"
            style={{ color: TOKENS.textMuted }}
          >
            Detail Per Kategori
          </p>
          <table className="w-full" style={{ minWidth: 860 }}>
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${TOKENS.divider}`,
                  background: "rgba(0,0,0,0.015)",
                }}
              >
                {[
                  "Kategori",
                  "Videos",
                  "Views",
                  "Engagement",
                  "Viral",
                  "Revenue",
                  "Top Hashtag",
                  "Best Time",
                  "Insight",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2.5 text-[9px] font-black uppercase tracking-widest"
                    style={{ color: TOKENS.textMuted }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, idx) => (
                <CategoryRow
                  key={cat.id}
                  cat={cat}
                  isLast={idx === categories.length - 1}
                  selected={selectedCategory === cat.id}
                  onSelect={onSelectCategory}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CategoryRow({
  cat,
  isLast,
  selected,
  onSelect,
}: {
  cat: Category;
  isLast: boolean;
  selected: boolean;
  onSelect: (id: CategoryId) => void;
}) {
  return (
    <tr
      onClick={() => onSelect(cat.id)}
      className="transition-all cursor-pointer"
      style={{
        borderBottom: !isLast ? `1px solid ${TOKENS.divider}` : "none",
        background: selected ? `${cat.color}08` : "transparent",
      }}
    >
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: cat.tint,
              border: `1px solid ${cat.color}22`,
            }}
          >
            <cat.Ico
              className="w-3.5 h-3.5"
              style={{ color: cat.color }}
              strokeWidth={2.2}
            />
          </div>
          <span
            className="font-black text-xs"
            style={{ color: TOKENS.text }}
          >
            {cat.label}
          </span>
          {selected ? (
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: cat.color }}
            />
          ) : null}
        </div>
      </td>
      <td className="px-3 py-3">
        <Mono style={{ color: TOKENS.textMuted }}>{cat.videos}</Mono>
      </td>
      <td className="px-3 py-3">
        <span
          className="font-black text-xs"
          style={{ color: TOKENS.text }}
        >
          {fmt(cat.views)}
        </span>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-1.5">
          <span
            className="font-black text-xs"
            style={{ color: cat.engagement >= 12 ? "#059669" : TOKENS.text }}
          >
            {cat.engagement}%
          </span>
          <div
            className="w-10 h-1 rounded-full overflow-hidden"
            style={{ background: TOKENS.barBg }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(cat.engagement * 5.5, 100)}%`,
                background: cat.engagement >= 12 ? "#059669" : "#111",
              }}
            />
          </div>
        </div>
      </td>
      <td className="px-3 py-3">
        <Mono
          style={{
            color: cat.viralProb >= 0.7 ? "#047857" : TOKENS.textSubtle,
            fontWeight: 700,
          }}
        >
          {fmtPct(cat.viralProb)}
        </Mono>
      </td>
      <td className="px-3 py-3">
        <span
          className="font-bold text-xs"
          style={{ color: "#7c3aed" }}
        >
          {fmtRp(cat.revenue)}
        </span>
      </td>
      <td className="px-3 py-3">
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded"
          style={{
            background: "rgba(14,165,233,0.07)",
            color: "#0369a1",
            border: "1px solid rgba(14,165,233,0.18)",
          }}
        >
          {cat.topHashtags && cat.topHashtags.length > 0 ? cat.topHashtags[0] : "-"}
        </span>
      </td>
      <td className="px-3 py-3">
        <span
          className="text-[11px] font-bold"
          style={{ color: TOKENS.textSubtle }}
        >
          {cat.bestTime ? cat.bestTime.split(" ")[0] : "N/A"}
        </span>
      </td>
      <td className="px-3 py-3" style={{ maxWidth: 200 }}>
        <p
          className="text-[10.5px] leading-snug"
          style={{ color: TOKENS.textMuted }}
        >
          {cat.insight ? (cat.insight.length > 60 ? `${cat.insight.substring(0, 60)}...` : cat.insight) : "-"}
        </p>
      </td>
    </tr>
  );
}
