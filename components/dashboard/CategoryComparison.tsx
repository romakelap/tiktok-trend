"use client";

import { useState } from "react";
import {
  BarChart2,
  Sparkles,
  ChevronRight,
  Eye,
  Activity,
  Video,
  Zap,
} from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import { CATEGORIES } from "@/lib/dashboard/mock-data";
import { fmt, fmtPct } from "@/lib/dashboard/formatters";
import type { Category, CategoryId } from "@/lib/dashboard/types";

type CategoryComparisonProps = {
  onSelectCategory: (id: CategoryId) => void;
  selectedCategory: CategoryId | null;
  categories?: Category[];
};

export function CategoryComparison({
  onSelectCategory,
  selectedCategory,
  categories = CATEGORIES,
}: CategoryComparisonProps) {
  // Toggle visibility of specific lines for flexible viewing
  const [visibleSeries, setVisibleSeries] = useState({
    views: true,
    content: true,
    engagement: true,
    viral: true,
  });

  const toggleSeries = (key: keyof typeof visibleSeries) => {
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Transform category data for ComposedChart
  const chartData = categories.map((cat) => ({
    id: cat.id,
    name: cat.label,
    views: cat.views || 0,
    videos: cat.videos || 0,
    engagement: Number((cat.engagement || 0).toFixed(2)),
    viralScore: Math.round((cat.viralProb || 0.5) * 100),
    color: cat.color,
  }));

  // Average Engagement benchmark
  const avgEngagement = Number(
    (
      chartData.reduce((acc, curr) => acc + curr.engagement, 0) /
      (chartData.length || 1)
    ).toFixed(2)
  );

  // Maximum values for scaled axes
  const maxViews = Math.max(...chartData.map((d) => d.views), 1);
  const maxVideos = Math.max(...chartData.map((d) => d.videos), 1);

  // Sort categories by composite performance for the quick matrix cards
  const sortedMatrix = [...categories].sort((a, b) => {
    const scoreA =
      ((a.views || 0) / maxViews) * 30 +
      (a.engagement / 5) * 40 +
      ((a.viralProb || 0.5) * 30);
    const scoreB =
      ((b.views || 0) / maxViews) * 30 +
      (b.engagement / 5) * 40 +
      ((b.viralProb || 0.5) * 30);
    return scoreB - scoreA;
  });

  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-xs overflow-hidden">
      {/* Header & Interactive Legend Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4 px-6 py-4 border-b border-stone-200/80 dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-900/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-900 dark:bg-white text-white dark:text-stone-900 flex items-center justify-center">
            <BarChart2 className="w-4 h-4" strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 dark:text-white">
              Category Performance Matrix (Reach, Content & Virality)
            </h2>
            <p className="text-xs text-stone-500 dark:text-neutral-400">
              Evaluasi komprehensif: Volume Jangkauan (Bar), Total Konten (Line), Rasio Interaksi (Line), dan Peluang Viral (Line)
            </p>
          </div>
        </div>

        {/* Interactive Filter Legend (Click to show/hide) */}
        <div className="flex items-center flex-wrap gap-3 text-xs">
          {/* 1. Views Bar */}
          <button
            type="button"
            onClick={() => toggleSeries("views")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
              visibleSeries.views
                ? "bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300 font-semibold"
                : "bg-stone-100 dark:bg-neutral-800 border-stone-200 dark:border-neutral-700 text-stone-400 opacity-60"
            }`}
            title="Klik untuk tampilkan/sembunyikan bar Total Views"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 shadow-xs" />
            <span>Total Views (Bar)</span>
          </button>

          {/* 2. Content Volume Line */}
          <button
            type="button"
            onClick={() => toggleSeries("content")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
              visibleSeries.content
                ? "bg-violet-50 dark:bg-violet-950/40 border-violet-300 dark:border-violet-800 text-violet-800 dark:text-violet-300 font-semibold"
                : "bg-stone-100 dark:bg-neutral-800 border-stone-200 dark:border-neutral-700 text-stone-400 opacity-60"
            }`}
            title="Klik untuk tampilkan/sembunyikan garis Total Konten"
          >
            <span className="w-2.5 h-0.5 bg-violet-500 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-violet-500 rounded-xs" />
            </span>
            <span>Total Konten (Line)</span>
          </button>

          {/* 3. Engagement Rate Line */}
          <button
            type="button"
            onClick={() => toggleSeries("engagement")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
              visibleSeries.engagement
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold"
                : "bg-stone-100 dark:bg-neutral-800 border-stone-200 dark:border-neutral-700 text-stone-400 opacity-60"
            }`}
            title="Klik untuk tampilkan/sembunyikan garis Engagement Rate"
          >
            <span className="w-2.5 h-0.5 bg-emerald-500 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            </span>
            <span>Engagement Rate %</span>
          </button>

          {/* 4. Viral Probability Line */}
          <button
            type="button"
            onClick={() => toggleSeries("viral")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
              visibleSeries.viral
                ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-semibold"
                : "bg-stone-100 dark:bg-neutral-800 border-stone-200 dark:border-neutral-700 text-stone-400 opacity-60"
            }`}
            title="Klik untuk tampilkan/sembunyikan garis Peluang Viral"
          >
            <span className="w-2.5 h-0.5 bg-amber-500 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-amber-500 rotate-45" />
            </span>
            <span>Peluang Viral %</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Axis Composed Chart */}
      <div className="p-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 24, left: 10, bottom: 8 }}
              onClick={(e) => {
                if (e && e.activePayload && e.activePayload.length > 0) {
                  const catId = e.activePayload[0].payload.id as CategoryId;
                  onSelectCategory(catId);
                }
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(0,0,0,0.06)"
              />
              <XAxis
                dataKey="name"
                axisLine={{ stroke: "rgba(0,0,0,0.12)" }}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fontWeight: 700,
                  fill: "rgb(87, 83, 78)",
                }}
              />

              {/* Left Y-Axis: Views Volume (Scaled with proper B / M / K) */}
              <YAxis
                yAxisId="views"
                orientation="left"
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => fmt(v)}
                tick={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  fill: "#0ea5e9",
                }}
              />

              {/* Dedicated Content Volume Axis (for scale balance) */}
              <YAxis
                yAxisId="content"
                orientation="left"
                hide={true}
                domain={[0, maxVideos * 1.2]}
              />

              {/* Right Y-Axis: Rates & Percentages (0% - 100%) */}
              <YAxis
                yAxisId="rates"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 100]}
                tick={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  fill: "#10b981",
                }}
              />

              {/* Reference line for Average Engagement */}
              {visibleSeries.engagement && (
                <ReferenceLine
                  yAxisId="rates"
                  y={avgEngagement}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  strokeOpacity={0.45}
                  label={{
                    value: `Avg ER: ${avgEngagement}%`,
                    position: "insideTopRight",
                    fontSize: 10,
                    fill: "#10b981",
                    fontWeight: 700,
                  }}
                />
              )}

              {/* Custom Tooltip */}
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-xl p-4 bg-stone-900 text-white shadow-2xl border border-stone-800 text-xs min-w-[220px]">
                      <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-2.5">
                        <span className="font-bold text-sm text-white">
                          {data.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                          Viral {data.viralScore}%
                        </span>
                      </div>

                      <div className="space-y-2 font-mono text-[11px]">
                        <div className="flex items-center justify-between text-sky-400">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-xs bg-sky-500" />
                            Total Views:
                          </span>
                          <strong>{fmt(data.views)}</strong>
                        </div>

                        <div className="flex items-center justify-between text-violet-400">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-xs bg-violet-500" />
                            Total Konten:
                          </span>
                          <strong>{fmt(data.videos)} video</strong>
                        </div>

                        <div className="flex items-center justify-between text-emerald-400">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Engagement Rate:
                          </span>
                          <strong>{data.engagement}%</strong>
                        </div>

                        <div className="flex items-center justify-between text-amber-400">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rotate-45 bg-amber-500" />
                            Peluang Viral:
                          </span>
                          <strong>{data.viralScore}%</strong>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-stone-800 text-[10.5px] text-stone-400 text-center font-sans">
                        Klik untuk drilldown detail kategori
                      </div>
                    </div>
                  );
                }}
              />

              {/* 1. Bar: Total Views */}
              {visibleSeries.views && (
                <Bar
                  yAxisId="views"
                  dataKey="views"
                  name="Total Views"
                  fill="#0ea5e9"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                  className="cursor-pointer transition-opacity hover:opacity-85"
                />
              )}

              {/* 2. Line: Total Content (Videos) */}
              {visibleSeries.content && (
                <Line
                  yAxisId="content"
                  type="monotone"
                  dataKey="videos"
                  name="Total Konten"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  strokeDasharray="4 2"
                  dot={{
                    r: 4,
                    fill: "#8b5cf6",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#8b5cf6",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                  className="cursor-pointer"
                />
              )}

              {/* 3. Line: Engagement Rate % (Scaled to 0-100) */}
              {visibleSeries.engagement && (
                <Line
                  yAxisId="rates"
                  type="monotone"
                  dataKey="engagement"
                  name="Engagement Rate"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: "#10b981",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 7,
                    fill: "#10b981",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                  className="cursor-pointer"
                />
              )}

              {/* 4. Line: Viral Probability % */}
              {visibleSeries.viral && (
                <Line
                  yAxisId="rates"
                  type="monotone"
                  dataKey="viralScore"
                  name="Peluang Viral"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{
                    r: 4,
                    fill: "#f59e0b",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#f59e0b",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                  className="cursor-pointer"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Performance Matrix Cards (5 Categories) */}
      <div className="px-6 pb-6 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {sortedMatrix.map((cat, idx) => {
            const isSelected = selectedCategory === cat.id;
            const rank = idx + 1;
            const viralPct = Math.round((cat.viralProb || 0.5) * 100);

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-sky-50/50 dark:bg-sky-950/20 border-sky-500 dark:border-sky-400 shadow-xs ring-1 ring-sky-500/20"
                    : "bg-stone-50/60 dark:bg-neutral-800/40 border-stone-200/80 dark:border-neutral-800 hover:border-stone-400 dark:hover:border-neutral-700 hover:bg-white dark:hover:bg-neutral-900"
                }`}
              >
                {/* Header Card */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[10px] ${
                        rank === 1
                          ? "bg-stone-900 text-white dark:bg-white dark:text-stone-900 ring-1 ring-emerald-500/30"
                          : "bg-stone-200/80 dark:bg-neutral-700 text-stone-700 dark:text-neutral-300"
                      }`}
                    >
                      #{rank}
                    </span>
                    <span className="text-xs font-bold text-stone-900 dark:text-white truncate">
                      {cat.label}
                    </span>
                  </div>
                  <cat.Ico className="w-3.5 h-3.5 text-stone-400" />
                </div>

                {/* 4 Stats Grid */}
                <div className="space-y-1 text-[11px] font-mono">
                  {/* Views */}
                  <div className="flex items-center justify-between text-stone-600 dark:text-neutral-400">
                    <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400">
                      Views:
                    </span>
                    <strong className="text-stone-900 dark:text-white">
                      {fmt(cat.views)}
                    </strong>
                  </div>

                  {/* Konten */}
                  <div className="flex items-center justify-between text-stone-600 dark:text-neutral-400">
                    <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400">
                      Konten:
                    </span>
                    <strong className="text-stone-900 dark:text-white">
                      {fmt(cat.videos)}
                    </strong>
                  </div>

                  {/* Engagement */}
                  <div className="flex items-center justify-between text-stone-600 dark:text-neutral-400">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      Engage:
                    </span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {cat.engagement.toFixed(2)}%
                    </strong>
                  </div>

                  {/* Viral Score */}
                  <div className="flex items-center justify-between text-stone-600 dark:text-neutral-400">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      Viral:
                    </span>
                    <strong className="text-amber-600 dark:text-amber-400 font-bold">
                      {viralPct}%
                    </strong>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-2.5 pt-1.5 border-t border-sky-200 dark:border-sky-800 text-[10px] font-bold text-sky-700 dark:text-sky-400 flex items-center justify-center gap-1">
                    <span>Sedang Dilihat</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Insight Strip */}
      <div className="px-6 py-3.5 border-t border-stone-200/80 dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-900/50 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-neutral-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>
            Korelasi: Volume konten tinggi (misal: <strong className="text-stone-900 dark:text-white">Lifestyle</strong>) mendorong jangkauan views besar, namun efisiensi interaksi & peluang viral tertinggi dicapai oleh sektor <strong className="text-stone-900 dark:text-white">Komedi</strong>.
          </span>
        </div>
        <div className="text-[11px] font-mono">
          Klik nama metrik di atas untuk filter kurva
        </div>
      </div>
    </div>
  );
}
