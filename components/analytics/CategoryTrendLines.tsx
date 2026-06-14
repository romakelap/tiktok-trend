"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TOKENS } from "@/lib/design-tokens";
import { GridBg } from "@/components/layout/GridBg";

export interface TrendPoint {
  date: string;
  avgViews: number;
  avgEngagementRate: number;
  isForecast: boolean;
}

export interface CategoryTrendLineItem {
  category: string;
  historicalTrend: TrendPoint[];
  forecastTrend: TrendPoint[];
}

type MetricKey = "avgEngagementRate" | "avgViews";

const CATEGORY_COLORS: Record<string, string> = {
  Edukasi:            "#0ea5e9",
  Komedi:             "#f59e0b",
  Kuliner:            "#ef4444",
  "Lifestyle & Home": "#a855f7",
  Teknologi:          "#10b981",
};

const METRIC_OPTIONS: { key: MetricKey; label: string }[] = [
  { key: "avgEngagementRate", label: "Engagement Rate" },
  { key: "avgViews",          label: "Avg Views" },
];

type Props = {
  data: CategoryTrendLineItem[];
  loading?: boolean;
};

function formatTick(value: number, metric: MetricKey) {
  if (metric === "avgEngagementRate") {
    return `${(value * 100).toFixed(1)}%`;
  }
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

/**
 * Merge historical + forecast points for a category into a single series.
 * We use a composite object keyed by date so all series share the same X-axis.
 */
function buildChartData(
  items: CategoryTrendLineItem[],
  metric: MetricKey
): { date: string; isForecast: boolean; [cat: string]: any }[] {
  const dateMap = new Map<string, { date: string; isForecast: boolean; [cat: string]: any }>();

  for (const item of items) {
    const allPoints = [
      ...item.historicalTrend.map((p) => ({ ...p, isForecast: false })),
      ...item.forecastTrend.map((p) => ({ ...p, isForecast: true })),
    ];

    for (const pt of allPoints) {
      if (!dateMap.has(pt.date)) {
        dateMap.set(pt.date, { date: pt.date, isForecast: pt.isForecast });
      }
      const row = dateMap.get(pt.date)!;
      row[item.category] = pt[metric];
      if (pt.isForecast) row.isForecast = true;
    }
  }

  return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

// Custom tooltip
function CustomTooltip({ active, payload, label, metric }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl shadow-xl p-3 text-xs font-bold"
      style={{
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.1)",
        minWidth: 160,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <p className="font-black text-gray-800 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-600">{p.dataKey}</span>
          </div>
          <span className="font-black text-gray-900">
            {metric === "avgEngagementRate"
              ? `${((p.value ?? 0) * 100).toFixed(2)}%`
              : p.value >= 1_000_000
              ? `${(p.value / 1_000_000).toFixed(1)}M`
              : p.value >= 1_000
              ? `${(p.value / 1_000).toFixed(0)}K`
              : String(p.value ?? 0)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CategoryTrendLines({ data, loading }: Props) {
  const [metric, setMetric] = useState<MetricKey>("avgEngagementRate");
  const [hiddenCats, setHiddenCats] = useState<Set<string>>(new Set());

  const toggleCat = (cat: string) => {
    setHiddenCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="rounded-2xl h-80 animate-pulse" style={{ background: "rgba(0,0,0,0.04)" }} />
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 rounded-2xl border border-dashed text-xs font-bold"
           style={{ borderColor: TOKENS.divider, color: TOKENS.textMuted }}>
        Belum ada data tren per kategori
      </div>
    );
  }

  const chartData = buildChartData(data, metric);

  // Find the first forecast date to draw a reference line
  const firstForecastDate = chartData.find((d) => d.isForecast)?.date;

  // Format date label: keep only MM/DD
  const formatDate = (d: string) => {
    if (!d) return "";
    const parts = d.split("-");
    if (parts.length === 3) return `${parts[1]}/${parts[2]}`;
    return d;
  };

  const categories = data.map((d) => d.category);

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "#fff",
        border: `1px solid ${TOKENS.divider}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <GridBg theme="light" />
      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-sm font-black" style={{ color: TOKENS.text }}>
              Category Trend Lines
            </h3>
            <p className="text-[11px] mt-0.5" style={{ color: TOKENS.textMuted }}>
              30 hari historis + 7 hari forecast (dashed) · per kategori konten
            </p>
          </div>

          {/* Metric toggle */}
          <div
            className="flex items-center gap-0.5 p-0.5 rounded-xl"
            style={{ background: "rgba(0,0,0,0.04)", border: `1px solid ${TOKENS.inputBorder}` }}
          >
            {METRIC_OPTIONS.map((opt) => {
              const active = metric === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setMetric(opt.key)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-black transition-all"
                  style={{
                    background: active ? "#111" : "transparent",
                    color: active ? "#fff" : TOKENS.textMuted,
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category toggles */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {categories.map((cat) => {
            const color = CATEGORY_COLORS[cat] ?? "#6b7280";
            const active = !hiddenCats.has(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCat(cat)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black transition-all border"
                style={{
                  background: active ? `${color}15` : "transparent",
                  borderColor: active ? color : TOKENS.inputBorder,
                  color: active ? color : TOKENS.textMuted,
                  opacity: active ? 1 : 0.5,
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: active ? color : "#d1d5db" }} />
                {cat}
              </button>
            );
          })}
        </div>

        {/* Chart */}
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={(v) => formatTick(v, metric)}
                tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              <Tooltip content={<CustomTooltip metric={metric} />} />

              {/* Reference line separating history from forecast */}
              {firstForecastDate && (
                <ReferenceLine
                  x={firstForecastDate}
                  stroke="rgba(0,0,0,0.15)"
                  strokeDasharray="4 4"
                  label={{
                    value: "Forecast →",
                    position: "insideTopRight",
                    fontSize: 9,
                    fontWeight: 700,
                    fill: "#94a3b8",
                  }}
                />
              )}

              {categories.map((cat) => {
                if (hiddenCats.has(cat)) return null;
                const color = CATEGORY_COLORS[cat] ?? "#6b7280";
                return (
                  <Line
                    key={cat}
                    type="monotone"
                    dataKey={cat}
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: color, stroke: "#fff", strokeWidth: 2 }}
                    connectNulls
                    strokeDasharray={undefined}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend hint */}
        <p className="text-[10px] mt-3 font-semibold" style={{ color: TOKENS.textMuted }}>
          Garis solid = data historis · area setelah garis putus-putus = proyeksi 7 hari ke depan
        </p>
      </div>
    </div>
  );
}
