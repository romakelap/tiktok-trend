"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatNum } from "@/lib/analytics/formatters";
import type { HistoricalDay } from "@/lib/analytics/types";

export interface ForecastDataPoint {
  date: string;
  predictedViews: number;
  predictedLikes: number;
  predictedComments: number;
  predictedShares: number;
  isForecast: boolean;
}

type LSTMForecastProps = {
  data: ForecastDataPoint[];
  historicalData?: HistoricalDay[];
  loading?: boolean;
};

export function LSTMForecast({
  data = [],
  loading = false,
}: LSTMForecastProps) {
  const [visibleMetrics, setVisibleMetrics] = useState({
    views: true,
    likes: true,
    comments: true,
    shares: true,
  });

  const toggleMetric = (key: keyof typeof visibleMetrics) => {
    setVisibleMetrics((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Build clean 7-day forecast dataset
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((d, idx) => {
      let dateLabel = d.date;
      if (d.date) {
        try {
          const parts = d.date.split("-");
          if (parts.length === 3) dateLabel = `${parts[2]}/${parts[1]}`;
        } catch {}
      } else {
        dateLabel = `Hari +${idx + 1}`;
      }

      return {
        dateLabel,
        rawDate: d.date,
        views: d.predictedViews || 0,
        likes: d.predictedLikes || 0,
        comments: d.predictedComments || 0,
        shares: d.predictedShares || 0,
        isForecast: true,
      };
    });
  }, [data]);

  // Calculate averages across the forecast period
  const summaryStats = useMemo(() => {
    if (chartData.length === 0) return [];

    const getAvg = (key: "views" | "likes" | "comments" | "shares") => {
      const sum = chartData.reduce((acc, curr) => acc + (curr[key] || 0), 0);
      return Math.round(sum / chartData.length);
    };

    return [
      {
        key: "views" as const,
        label: "Views",
        icon: Eye,
        color: "#0ea5e9", // Dashboard Sky Blue
        avg: getAvg("views"),
        type: "Bar",
      },
      {
        key: "likes" as const,
        label: "Likes",
        icon: Heart,
        color: "#10b981", // Dashboard Emerald
        avg: getAvg("likes"),
        type: "Line",
      },
      {
        key: "comments" as const,
        label: "Comments",
        icon: MessageCircle,
        color: "#f59e0b", // Dashboard Amber
        avg: getAvg("comments"),
        type: "Line",
      },
      {
        key: "shares" as const,
        label: "Shares",
        icon: Share2,
        color: "#8b5cf6", // Dashboard Violet
        avg: getAvg("shares"),
        type: "Line",
      },
    ];
  }, [chartData]);

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-sm p-5 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-tight">
                Proyeksi Metrik Konten (7 Hari)
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-neutral-400">
                Visualisasi terpadu Volume Views (Bar) & Interaksi (Line)
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-300 border border-stone-200/60 dark:border-neutral-700 text-[10px] font-bold">
            <Sparkles className="w-3 h-3 text-sky-500" />
            <span>Kombinasi Bar + Line</span>
          </div>
        </div>

        {/* 4-Metric Compact Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {summaryStats.map((item) => {
            const Icon = item.icon;
            const isVisible = visibleMetrics[item.key];

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleMetric(item.key)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isVisible
                    ? "bg-stone-50/70 dark:bg-neutral-800/50 border-stone-200/80 dark:border-neutral-700/80 hover:bg-stone-100/70"
                    : "bg-white dark:bg-neutral-900 border-stone-200/40 dark:border-neutral-800 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: item.color }}
                    />
                    <span className="text-[10px] font-bold text-stone-500 dark:text-neutral-400 uppercase tracking-wider truncate">
                      {item.label}
                    </span>
                  </div>
                  <Icon className="w-3 h-3 text-stone-400 flex-shrink-0" />
                </div>

                <div className="flex items-baseline justify-between gap-1">
                  <span className="text-sm font-bold font-mono text-stone-900 dark:text-white">
                    {formatNum(item.avg)}
                  </span>
                  <span className="text-[9px] font-bold text-stone-400 font-mono">
                    / hari
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Loading / Empty States */}
        {loading ? (
          <div className="h-64 flex items-center justify-center text-stone-400 text-xs font-medium">
            Memuat proyeksi metrik...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center gap-2 text-center px-6 rounded-xl bg-stone-50/50 dark:bg-neutral-800/30 border border-dashed border-stone-200 dark:border-neutral-800">
            <Layers className="w-5 h-5 text-stone-400" />
            <p className="text-xs font-bold text-stone-700 dark:text-neutral-300">
              Data proyeksi metrik belum tersedia
            </p>
            <p className="text-[11px] text-stone-400 max-w-sm">
              Data akan tampil secara otomatis setelah histori performa terdata.
            </p>
          </div>
        ) : (
          <div>
            {/* Unified Bar + Line Composed Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f5f5f4"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="dateLabel"
                    tick={{ fontSize: 10, fill: "#78716c", fontWeight: 700 }}
                    axisLine={{ stroke: "#e7e5e4" }}
                    tickLine={false}
                  />
                  {/* Left Y-Axis for Views (Bar) */}
                  <YAxis
                    yAxisId="views"
                    orientation="left"
                    tick={{ fontSize: 10, fill: "#0ea5e9", fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatNum}
                  />
                  {/* Right Y-Axis for Engagements (Likes, Comments, Shares) */}
                  <YAxis
                    yAxisId="engagements"
                    orientation="right"
                    tick={{ fontSize: 10, fill: "#10b981", fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatNum}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(14, 165, 233, 0.05)" }}
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      const dataPoint = payload[0]?.payload;

                      return (
                        <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl p-3 shadow-lg text-xs space-y-2 min-w-[170px]">
                          <div className="flex items-center justify-between pb-1.5 border-b border-stone-100 dark:border-neutral-800">
                            <span className="font-bold text-stone-900 dark:text-white">
                              {label}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-200/60 dark:bg-sky-950/40 dark:text-sky-400">
                              Proyeksi 7H
                            </span>
                          </div>

                          <div className="space-y-1 font-mono">
                            <div className="flex items-center justify-between">
                              <span className="text-sky-600 font-bold flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-xs bg-sky-500" />
                                Views:
                              </span>
                              <span className="font-bold text-stone-900 dark:text-white">
                                {formatNum(dataPoint.views)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                Likes:
                              </span>
                              <span className="font-bold text-stone-900 dark:text-white">
                                {formatNum(dataPoint.likes)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-amber-600 font-bold flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-xs bg-amber-500" />
                                Comments:
                              </span>
                              <span className="font-bold text-stone-900 dark:text-white">
                                {formatNum(dataPoint.comments)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-purple-600 font-bold flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-xs bg-purple-500" />
                                Shares:
                              </span>
                              <span className="font-bold text-stone-900 dark:text-white">
                                {formatNum(dataPoint.shares)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />

                  {/* Views Bar (Dashboard Sky Blue #0ea5e9) */}
                  {visibleMetrics.views && (
                    <Bar
                      yAxisId="views"
                      dataKey="views"
                      name="Views"
                      fill="#0ea5e9"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={36}
                      className="cursor-pointer transition-opacity hover:opacity-85"
                    />
                  )}

                  {/* Likes Line */}
                  {visibleMetrics.likes && (
                    <Line
                      yAxisId="engagements"
                      type="monotone"
                      dataKey="likes"
                      name="Likes"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
                      activeDot={{ r: 5, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
                    />
                  )}

                  {/* Comments Line */}
                  {visibleMetrics.comments && (
                    <Line
                      yAxisId="engagements"
                      type="monotone"
                      dataKey="comments"
                      name="Comments"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#f59e0b", stroke: "#ffffff", strokeWidth: 2 }}
                      activeDot={{ r: 5, fill: "#f59e0b", stroke: "#ffffff", strokeWidth: 2 }}
                    />
                  )}

                  {/* Shares Line */}
                  {visibleMetrics.shares && (
                    <Line
                      yAxisId="engagements"
                      type="monotone"
                      dataKey="shares"
                      name="Shares"
                      stroke="#8b5cf6"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#8b5cf6", stroke: "#ffffff", strokeWidth: 2 }}
                      activeDot={{ r: 5, fill: "#8b5cf6", stroke: "#ffffff", strokeWidth: 2 }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom Legend */}
            <div className="flex flex-wrap items-center justify-between text-[10px] text-stone-400 mt-2 pt-2 border-t border-stone-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 font-semibold text-sky-600 dark:text-sky-400">
                  <span className="w-2.5 h-2.5 rounded-xs bg-sky-500 inline-block" />
                  Views (Bar)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-semibold text-emerald-600">
                  <span className="w-2 h-0.5 bg-emerald-500 inline-block" /> Likes
                </span>
                <span className="flex items-center gap-1 font-semibold text-amber-600">
                  <span className="w-2 h-0.5 bg-amber-500 inline-block" /> Comments
                </span>
                <span className="flex items-center gap-1 font-semibold text-purple-600">
                  <span className="w-2 h-0.5 bg-purple-500 inline-block" /> Shares
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
