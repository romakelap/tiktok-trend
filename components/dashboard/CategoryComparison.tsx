"use client";

import { useState } from "react";
import { MoreHorizontal, ChevronRight, Sparkles } from "lucide-react";
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
  const [visibleSeries, setVisibleSeries] = useState({
    views: true,
    content: true,
    engagement: true,
    viral: true,
  });

  const toggleSeries = (key: keyof typeof visibleSeries) => {
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const chartData = categories.map((cat) => ({
    id: cat.id,
    name: cat.label,
    views: cat.views || 0,
    videos: cat.videos || 0,
    engagement: Number((cat.engagement || 0).toFixed(2)),
    viralScore: Math.round((cat.viralProb || 0.5) * 100),
    color: cat.color,
  }));

  const avgEngagement = Number(
    (
      chartData.reduce((acc, curr) => acc + curr.engagement, 0) /
      (chartData.length || 1)
    ).toFixed(2)
  );

  const maxViews = Math.max(...chartData.map((d) => d.views), 1);
  const maxVideos = Math.max(...chartData.map((d) => d.videos), 1);

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

  // Focused segment — the selected or top category
  const focusedCat = selectedCategory
    ? categories.find((c) => c.id === selectedCategory) ?? sortedMatrix[0]
    : sortedMatrix[0];

  const viralPctFocused = Math.round((focusedCat.viralProb || 0.5) * 100);

  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-stone-900 dark:text-white">
            Category Performance Matrix
          </span>
          <span className="text-xs text-stone-400 dark:text-neutral-500">
            Reach, Total Konten & Peluang Virality
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <button
            type="button"
            onClick={() => toggleSeries("views")}
            className={`flex items-center gap-1.5 transition-opacity cursor-pointer ${visibleSeries.views ? "opacity-100" : "opacity-30"}`}
          >
            <span className="w-3 h-3 rounded-sm bg-sky-500 flex-shrink-0" />
            <span className="text-stone-600 dark:text-neutral-300 font-medium">Total Views</span>
          </button>
          <button
            type="button"
            onClick={() => toggleSeries("content")}
            className={`flex items-center gap-1.5 transition-opacity cursor-pointer ${visibleSeries.content ? "opacity-100" : "opacity-30"}`}
          >
            <span className="w-4 h-0.5 bg-violet-500 flex-shrink-0" />
            <span className="text-stone-600 dark:text-neutral-300 font-medium">Total Konten</span>
          </button>
          <button
            type="button"
            onClick={() => toggleSeries("engagement")}
            className={`flex items-center gap-1.5 transition-opacity cursor-pointer ${visibleSeries.engagement ? "opacity-100" : "opacity-30"}`}
          >
            <span className="w-4 h-0.5 bg-emerald-500 flex-shrink-0" />
            <span className="text-stone-600 dark:text-neutral-300 font-medium">Engagement Rate</span>
          </button>
          <button
            type="button"
            onClick={() => toggleSeries("viral")}
            className={`flex items-center gap-1.5 transition-opacity cursor-pointer ${visibleSeries.viral ? "opacity-100" : "opacity-30"}`}
          >
            <span className="w-4 h-0.5 bg-amber-500 flex-shrink-0" />
            <span className="text-stone-600 dark:text-neutral-300 font-medium">Peluang Viral</span>
          </button>
        </div>
      </div>

      {/* ── Body: Chart (left) + Focused Segment Panel (right) ── */}
      <div className="flex divide-x divide-stone-200 dark:divide-neutral-800">
        {/* Chart area - 2/3 */}
        <div className="flex-1 min-w-0 p-5">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
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
                  stroke="rgba(0,0,0,0.05)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 600, fill: "rgb(120,113,108)" }}
                  tickFormatter={(v, i) => {
                    const idx = sortedMatrix.findIndex((c) => c.label === v);
                    const rank = idx + 1;
                    return `#${rank} ${v}`;
                  }}
                />
                <YAxis
                  yAxisId="views"
                  orientation="left"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => fmt(v)}
                  tick={{ fontSize: 10, fontWeight: 500, fill: "#0ea5e9" }}
                />
                <YAxis
                  yAxisId="content"
                  orientation="left"
                  hide={true}
                  domain={[0, maxVideos * 1.2]}
                />
                <YAxis
                  yAxisId="rates"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fontWeight: 500, fill: "#10b981" }}
                />

                {visibleSeries.engagement && (
                  <ReferenceLine
                    yAxisId="rates"
                    y={avgEngagement}
                    stroke="#10b981"
                    strokeDasharray="4 2"
                    strokeOpacity={0.4}
                    label={{
                      value: `Avg ER: ${avgEngagement}%`,
                      position: "insideTopRight",
                      fontSize: 9.5,
                      fill: "#10b981",
                      fontWeight: 700,
                    }}
                  />
                )}

                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg p-3 bg-stone-900 text-white shadow-xl border border-stone-800 text-xs min-w-[200px]">
                        <div className="font-bold text-sm mb-2 pb-1.5 border-b border-stone-700">
                          {data.name}
                        </div>
                        <div className="space-y-1.5 font-mono text-[11px]">
                          {visibleSeries.views && (
                            <div className="flex justify-between gap-4">
                              <span className="text-sky-400">Total Views</span>
                              <strong>{fmt(data.views)}</strong>
                            </div>
                          )}
                          {visibleSeries.content && (
                            <div className="flex justify-between gap-4">
                              <span className="text-violet-400">Konten</span>
                              <strong>{fmt(data.videos)}</strong>
                            </div>
                          )}
                          {visibleSeries.engagement && (
                            <div className="flex justify-between gap-4">
                              <span className="text-emerald-400">Engagement</span>
                              <strong>{data.engagement}%</strong>
                            </div>
                          )}
                          {visibleSeries.viral && (
                            <div className="flex justify-between gap-4">
                              <span className="text-amber-400">Viral</span>
                              <strong>{data.viralScore}%</strong>
                            </div>
                          )}
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-stone-700 text-[9.5px] text-stone-400 text-center">
                          Klik untuk drilldown
                        </div>
                      </div>
                    );
                  }}
                />

                {visibleSeries.views && (
                  <Bar
                    yAxisId="views"
                    dataKey="views"
                    fill="#0ea5e9"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={48}
                    className="cursor-pointer"
                    opacity={0.85}
                  />
                )}
                {visibleSeries.content && (
                  <Line
                    yAxisId="content"
                    type="monotone"
                    dataKey="videos"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="5 3"
                    dot={{ r: 3, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 5 }}
                    className="cursor-pointer"
                  />
                )}
                {visibleSeries.engagement && (
                  <Line
                    yAxisId="rates"
                    type="monotone"
                    dataKey="engagement"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 5 }}
                    className="cursor-pointer"
                  />
                )}
                {visibleSeries.viral && (
                  <Line
                    yAxisId="rates"
                    type="monotone"
                    dataKey="viralScore"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 5 }}
                    className="cursor-pointer"
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Focused Segment Panel - 1/3 */}
        <div className="w-72 flex-shrink-0 p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-bold tracking-widest text-stone-400 dark:text-neutral-500 uppercase">
              Focused Segment
            </span>
            <button type="button" className="text-stone-400 hover:text-stone-600 dark:hover:text-neutral-200 transition-colors cursor-pointer">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h3 className="text-xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
              {focusedCat.label}
            </h3>
          </div>

          {/* 2-col metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-stone-400 dark:text-neutral-500 mb-0.5">Total views</p>
              <p className="text-xl font-black text-stone-900 dark:text-white">{fmt(focusedCat.views)}</p>
              <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">+18.6%</p>
            </div>
            <div>
              <p className="text-[10px] text-stone-400 dark:text-neutral-500 mb-0.5">Engagement</p>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {focusedCat.engagement.toFixed(2)}%
              </p>
              <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">+0.22%</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-stone-100 dark:border-neutral-800" />

          {/* Recommended action */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span className="text-[11px] font-bold text-stone-900 dark:text-white">Recommended action</span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-neutral-400 leading-relaxed">
              {focusedCat.insight ||
                "Content before-after performs 3× better. Weekend slots are strongest."}
            </p>
          </div>

          {/* Open deep dive link */}
          <div className="mt-auto">
            <button
              type="button"
              onClick={() => onSelectCategory(focusedCat.id)}
              className="flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
            >
              <span>Open deep dive</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Category Tabs Row ── */}
      <div className="border-t border-stone-200 dark:border-neutral-800 overflow-x-auto">
        <div className="flex min-w-max">
          {sortedMatrix.map((cat, idx) => {
            const isSelected = selectedCategory === cat.id;
            const rank = idx + 1;
            const viralPct = Math.round((cat.viralProb || 0.5) * 100);

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`flex-1 min-w-[160px] px-4 py-3 text-left border-r last:border-r-0 border-stone-200 dark:border-neutral-800 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-stone-50 dark:bg-neutral-800/60 border-t-2 border-t-sky-500"
                    : "hover:bg-stone-50/60 dark:hover:bg-neutral-800/30 border-t-2 border-t-transparent"
                }`}
              >
                {/* Rank + name + badge */}
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] font-black text-stone-400 dark:text-neutral-500">
                    #{rank}
                  </span>
                  <span className={`text-xs font-bold ${isSelected ? "text-stone-900 dark:text-white" : "text-stone-700 dark:text-neutral-200"}`}>
                    {cat.label}
                  </span>
                  {isSelected && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-400 rounded">
                      Sedang Dilihat
                    </span>
                  )}
                  {rank > 1 && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold text-stone-400 dark:text-neutral-500 border border-stone-200 dark:border-neutral-700 rounded">
                      Klaster {String(rank).padStart(2, "0")}
                    </span>
                  )}
                </div>

                {/* 3-col stats */}
                <div className="grid grid-cols-3 gap-1">
                  <div>
                    <p className="text-[9px] font-bold text-stone-400 dark:text-neutral-500 uppercase">Views</p>
                    <p className="text-xs font-bold text-stone-900 dark:text-white">{fmt(cat.views)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-stone-400 dark:text-neutral-500 uppercase">Engage</p>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{cat.engagement.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-stone-400 dark:text-neutral-500 uppercase">Viral</p>
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400">{viralPct}%</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Footer Insight Strip ── */}
      <div className="px-5 py-2.5 border-t border-stone-100 dark:border-neutral-800 bg-stone-50/60 dark:bg-neutral-900/60 flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-[8px] font-black">i</span>
        </div>
        <p className="text-[11px] text-stone-500 dark:text-neutral-400 italic">
          <strong className="text-stone-700 dark:text-neutral-200 not-italic">Korelasi Strategis:</strong>{" "}
          Volume konten tinggi (misal: <strong className="text-stone-800 dark:text-white not-italic">Lifestyle</strong>) mendorong jangkauan views besar, namun efisiensi interaksi & peluang viral tertinggi dicapai oleh sektor <strong className="text-stone-800 dark:text-white not-italic">Komedi</strong>.
        </p>
      </div>
    </div>
  );
}
