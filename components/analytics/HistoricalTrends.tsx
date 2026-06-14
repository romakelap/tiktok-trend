"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ChartArea } from "lucide-react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { GridBg } from "@/components/layout/GridBg";
import { Mono } from "@/components/dashboard";
import { TOKENS } from "@/lib/design-tokens";
import { formatNum, formatPct } from "@/lib/analytics/formatters";
import type { HistoricalDay } from "@/lib/analytics/types";

type MetricKey =
  | "views"
  | "likes"
  | "comments"
  | "shares"
  | "engagement"
  | "viralProb";

const METRIC_DEFS: Record<
  MetricKey,
  { label: string; color: string; dataKey: string; formatter: (v: number) => string }
> = {
  views:      { label: "Views",        color: "#10b981", dataKey: "views",      formatter: formatNum },
  likes:      { label: "Likes",        color: "#0ea5e9", dataKey: "likes",      formatter: formatNum },
  comments:   { label: "Comments",     color: "#f59e0b", dataKey: "comments",   formatter: formatNum },
  shares:     { label: "Shares",       color: "#a855f7", dataKey: "shares",     formatter: formatNum },
  engagement: { label: "Engagement %", color: "#ec4899", dataKey: "engagement", formatter: (v: number) => `${v}%` },
  viralProb:  { label: "Viral Prob.",  color: "#fb7185", dataKey: "viralProb",  formatter: (v: number) => formatPct(v) },
};

const LEFT_AXIS_KEYS: MetricKey[] = ["views", "likes", "comments", "shares"];
const RIGHT_AXIS_KEYS: MetricKey[] = ["engagement", "viralProb"];

type HistoricalTrendsProps = {
  data: HistoricalDay[];
};

/**
 * Charcoal multi-metric trend card. Users toggle metrics; numeric metrics
 * render as filled `Area` on the left axis, percentage metrics render as
 * thin `Line`s on the right axis. Includes a collapsible raw-data table.
 */
export function HistoricalTrends({ data }: HistoricalTrendsProps) {
  const [activeMetrics, setActiveMetrics] = useState<MetricKey[]>([
    "views",
    "engagement",
  ]);
  const [tableExpanded, setTableExpanded] = useState(false);

  const toggleMetric = (m: MetricKey) => {
    setActiveMetrics((prev) =>
      prev.includes(m)
        ? prev.length > 1
          ? prev.filter((x) => x !== m)
          : prev
        : [...prev, m]
    );
  };

  const leftMetrics = activeMetrics.filter((m) =>
    LEFT_AXIS_KEYS.includes(m)
  );
  const rightMetrics = activeMetrics.filter((m) =>
    RIGHT_AXIS_KEYS.includes(m)
  );

  const totals = data.reduce(
    (acc, d) => ({
      videos: acc.videos + d.videos,
      views: acc.views + d.views,
      likes: acc.likes + d.likes,
      comments: acc.comments + d.comments,
      shares: acc.shares + d.shares,
    }),
    { videos: 0, views: 0, likes: 0, comments: 0, shares: 0 }
  );
  const avgEng = (
    data.reduce((s, d) => s + d.engagement, 0) / data.length
  ).toFixed(1);
  const avgViral = data.reduce((s, d) => s + d.viralProb, 0) / data.length;

  const summaryStrip = [
    { l: "Total Videos", v: totals.videos },
    { l: "Total Views", v: formatNum(totals.views) },
    { l: "Total Likes", v: formatNum(totals.likes) },
    { l: "Total Comments", v: formatNum(totals.comments) },
    { l: "Total Shares", v: formatNum(totals.shares) },
    { l: "Avg Engagement", v: `${avgEng}%` },
    { l: "Avg Viral Prob.", v: formatPct(avgViral) },
  ];

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: TOKENS.charcoal,
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
      }}
    >
      <GridBg theme="dark" />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 360,
          height: 360,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(255,255,255,0.07) 0%,transparent 70%)",
          top: -120,
          right: -80,
        }}
      />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <ChartArea
                className="w-5 h-5 text-white"
                strokeWidth={2.2}
              />
            </div>
            <div>
              <h2 className="font-black text-base text-white tracking-tight">
                Historical Trends
              </h2>
              <p
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Daily aggregates · {data.length} hari · multi-metric overlay
              </p>
              {data.length > 0 && (
                <p className="text-[10px] text-emerald-400 font-bold mt-1">
                  Rentang Tanggal: {data[0].date} s/d {data[data.length - 1].date}
                </p>
              )}
            </div>
          </div>

          {/* Metric toggles */}
          <div className="flex flex-wrap gap-1.5">
            {(Object.entries(METRIC_DEFS) as [MetricKey, (typeof METRIC_DEFS)[MetricKey]][]).map(
              ([key, m]) => {
                const sel = activeMetrics.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleMetric(key)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-black transition-all"
                    style={{
                      background: sel ? m.color : "rgba(255,255,255,0.06)",
                      color: sel ? "#fff" : "rgba(255,255,255,0.5)",
                      border: `1px solid ${sel ? m.color : "rgba(255,255,255,0.08)"}`,
                      boxShadow: sel ? `0 0 10px ${m.color}55` : "none",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: sel ? "#fff" : m.color }}
                    />
                    {m.label}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Chart */}
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
            >
              <defs>
                {Object.entries(METRIC_DEFS).map(([key, m]) => (
                  <linearGradient
                    key={key}
                    id={`agrad-${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={m.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={m.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid
                stroke="rgba(255,255,255,0.07)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.3)"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fontWeight: 700,
                  fill: "rgba(255,255,255,0.45)",
                }}
              />
              <YAxis
                yAxisId="left"
                stroke="rgba(255,255,255,0.3)"
                axisLine={false}
                tickLine={false}
                tickFormatter={formatNum}
                tick={{
                  fontSize: 10,
                  fontWeight: 700,
                  fill: "rgba(255,255,255,0.4)",
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="rgba(255,255,255,0.3)"
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) =>
                  v < 1 ? `${(v * 100).toFixed(0)}%` : `${v}%`
                }
                tick={{
                  fontSize: 10,
                  fontWeight: 700,
                  fill: "rgba(255,255,255,0.4)",
                }}
              />
              <Tooltip
                cursor={{
                  stroke: "rgba(255,255,255,0.2)",
                  strokeWidth: 1,
                  strokeDasharray: "3 3",
                }}
                contentStyle={{
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#111",
                }}
                formatter={(v: number, name: string) => {
                  const m = Object.values(METRIC_DEFS).find(
                    (x) => x.dataKey === name
                  );
                  return m ? [m.formatter(v), m.label] : [v, name];
                }}
              />

              {leftMetrics.map((key) => {
                const m = METRIC_DEFS[key];
                return (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={m.dataKey}
                    yAxisId="left"
                    stroke={m.color}
                    strokeWidth={2}
                    fill={`url(#agrad-${key})`}
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: m.color,
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                );
              })}
              {rightMetrics.map((key) => {
                const m = METRIC_DEFS[key];
                return (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={m.dataKey}
                    yAxisId="right"
                    stroke={m.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: m.color,
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Summary strip */}
        <div
          className="mt-5 pt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          {summaryStrip.map((s) => (
            <div key={s.l}>
              <p
                className="text-[9px] font-black uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {s.l}
              </p>
              <p className="text-base font-black text-white mt-0.5 tracking-tight">
                {s.v}
              </p>
            </div>
          ))}
        </div>

        {/* Data table toggle */}
        <button
          type="button"
          onClick={() => setTableExpanded((v) => !v)}
          className="mt-5 flex items-center gap-2 text-xs font-black transition-all hover:opacity-75"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          {tableExpanded ? (
            <ArrowUp className="w-3.5 h-3.5" strokeWidth={2.5} />
          ) : (
            <ArrowDown className="w-3.5 h-3.5" strokeWidth={2.5} />
          )}
          {tableExpanded ? "Sembunyikan" : "Lihat"} data tabel harian
        </button>

        {tableExpanded && (
          <div
            className="mt-4 rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {[
                      "Tanggal",
                      "Videos",
                      "Views",
                      "Likes",
                      "Comments",
                      "Shares",
                      "Eng. %",
                      "Viral Prob.",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[9px] font-black uppercase tracking-widest px-4 py-2.5"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((d, i) => (
                    <tr
                      key={d.date}
                      style={{
                        borderBottom:
                          i < data.length - 1
                            ? "1px solid rgba(255,255,255,0.05)"
                            : "none",
                      }}
                    >
                      <td className="px-4 py-2.5">
                        <Mono
                          size="sm"
                          className="font-bold"
                          style={{ color: "#fff" }}
                        >
                          {d.date}
                        </Mono>
                      </td>
                      <td className="px-4 py-2.5 text-xs font-bold text-white/80">
                        {d.videos}
                      </td>
                      <td className="px-4 py-2.5 text-xs font-black text-white">
                        {formatNum(d.views)}
                      </td>
                      <td className="px-4 py-2.5 text-xs font-bold text-white/80">
                        {formatNum(d.likes)}
                      </td>
                      <td className="px-4 py-2.5 text-xs font-bold text-white/80">
                        {formatNum(d.comments)}
                      </td>
                      <td className="px-4 py-2.5 text-xs font-bold text-white/80">
                        {formatNum(d.shares)}
                      </td>
                      <td className="px-4 py-2.5 text-xs font-black text-white">
                        {d.engagement}%
                      </td>
                      <td
                        className="px-4 py-2.5 text-xs font-black"
                        style={{
                          color:
                            d.viralProb >= 0.6
                              ? "#86efac"
                              : "rgba(255,255,255,0.7)",
                        }}
                      >
                        {formatPct(d.viralProb)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
