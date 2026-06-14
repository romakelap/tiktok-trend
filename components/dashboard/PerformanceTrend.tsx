"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { GridBg } from "@/components/layout/GridBg";
import { TOKENS } from "@/lib/design-tokens";
import { TREND_DATA } from "@/lib/dashboard/mock-data";
import { fmt } from "@/lib/dashboard/formatters";

type TrendMetricKey = "views" | "engagement" | "viralProb";

type TrendMetric = {
  key: TrendMetricKey;
  label: string;
  color: string;
  yAxis: "left" | "right";
};

const METRICS: TrendMetric[] = [
  { key: "views", label: "Views", color: "#10b981", yAxis: "left" },
  { key: "engagement", label: "Engagement", color: "#0ea5e9", yAxis: "right" },
  { key: "viralProb", label: "Viral", color: "#f59e0b", yAxis: "right" },
];

/** 30-day multi-metric area chart in a dark card. */
export function PerformanceTrend() {
  const [active, setActive] = useState<TrendMetricKey[]>([
    "views",
    "engagement",
  ]);

  const toggle = (k: TrendMetricKey) => {
    setActive((prev) =>
      prev.includes(k)
        ? prev.length > 1
          ? prev.filter((x) => x !== k)
          : prev
        : [...prev, k]
    );
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: TOKENS.charcoal,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
      }}
    >
      <GridBg theme="dark" />
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="font-black text-sm text-white tracking-tight">
                Performance Trend
              </h2>
              <p
                className="text-[11px]"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                30 hari terakhir
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {METRICS.map((m) => {
              const sel = active.includes(m.key);
              return (
                <button
                  type="button"
                  key={m.key}
                  onClick={() => toggle(m.key)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-black transition-all"
                  style={{
                    background: sel ? m.color : "rgba(255,255,255,0.06)",
                    color: sel ? "#fff" : "rgba(255,255,255,0.5)",
                    border: `1px solid ${sel ? m.color : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: sel ? "#fff" : m.color }}
                  />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={TREND_DATA}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              <defs>
                {METRICS.map((m) => (
                  <linearGradient
                    key={m.key}
                    id={`tg-${m.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={m.color}
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor={m.color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fontWeight: 700,
                  fill: "rgba(255,255,255,0.35)",
                }}
                interval={4}
              />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tickFormatter={fmt}
                tick={{
                  fontSize: 10,
                  fontWeight: 700,
                  fill: "rgba(255,255,255,0.35)",
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) =>
                  v < 1 ? `${(v * 100).toFixed(0)}%` : `${v}%`
                }
                tick={{
                  fontSize: 10,
                  fontWeight: 700,
                  fill: "rgba(255,255,255,0.35)",
                }}
              />
              <Tooltip
                cursor={{
                  stroke: "rgba(255,255,255,0.12)",
                  strokeWidth: 1,
                }}
                contentStyle={{
                  background: "#fff",
                  border: `1px solid ${TOKENS.cardBorder}`,
                  borderRadius: 12,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />
              {METRICS.filter((m) => active.includes(m.key)).map((m) => (
                <Area
                  key={m.key}
                  type="monotone"
                  dataKey={m.key}
                  yAxisId={m.yAxis}
                  stroke={m.color}
                  strokeWidth={1.8}
                  fill={`url(#tg-${m.key})`}
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: m.color,
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
