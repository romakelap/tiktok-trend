"use client";

import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, BookOpen, Smile, Utensils, Home, Monitor, Info } from "lucide-react";
import { TOKENS } from "@/lib/design-tokens";
import { GridBg } from "@/components/layout/GridBg";
import type { CategoryTrendData } from "./EngagementForecast";

// ── Category meta (same as EngagementForecast) ────────────────────────
const CAT_META: Record<string, { color: string; icon: React.ElementType }> = {
  Edukasi:          { color: "#0369a1", icon: BookOpen },
  Komedi:           { color: "#b45309", icon: Smile },
  Kuliner:          { color: "#b91c1c", icon: Utensils },
  "Lifestyle & Home": { color: "#047857", icon: Home },
  Teknologi:        { color: "#5b21b6", icon: Monitor },
};

interface Props {
  data: CategoryTrendData[];
  loading?: boolean;
}

// ── Custom tooltip ────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border text-xs font-bold shadow-lg"
      style={{ background: "#18181b", borderColor: "rgba(255,255,255,0.1)", padding: "8px 12px", minWidth: 160 }}>
      <p className="text-white/50 mb-1.5 text-[10px]">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ background: p.color }} />
            {p.dataKey}
          </span>
          <span className="text-white font-black">{(Number(p.value) * 100).toFixed(2)}%</span>
        </div>
      ))}
    </div>
  );
}

export function CategoryTrendChart({ data, loading = false }: Props) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [showForecast, setShowForecast] = useState(true);

  // Build unified date-keyed dataset
  const { chartData, forecastStartDate } = useMemo(() => {
    if (!data.length) return { chartData: [], forecastStartDate: null };

    // Collect all dates across all categories
    const dateMap = new Map<string, Record<string, number | null>>();

    let forecastStart: string | null = null;

    data.forEach((cat) => {
      // Historical
      (cat.historicalTrend || []).forEach((pt) => {
        if (!pt.date) return;
        const d = pt.date.slice(5); // MM-DD
        if (!dateMap.has(d)) dateMap.set(d, {});
        dateMap.get(d)![cat.category] = pt.avgEngagementRate;
      });
      // Forecast
      if (showForecast) {
        (cat.forecastTrend || []).forEach((pt, i) => {
          if (!pt.date) return;
          const d = pt.date.slice(5);
          if (i === 0 && !forecastStart) forecastStart = d;
          if (!dateMap.has(d)) dateMap.set(d, {});
          dateMap.get(d)![`${cat.category}_fc`] = pt.avgEngagementRate;
        });
      }
    });

    const sorted = Array.from(dateMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, vals]) => ({ date, ...vals }));

    return { chartData: sorted, forecastStartDate: forecastStart };
  }, [data, showForecast]);

  const toggleCat = (cat: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  return (
    <div className="relative rounded-2xl overflow-hidden"
      style={{ background: TOKENS.charcoal, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 40px rgba(0,0,0,0.2)" }}>
      <GridBg theme="dark" />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="font-black text-base text-white tracking-tight flex items-center gap-2 flex-wrap">
                Category Trend Chart
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-extrabold uppercase tracking-wide border border-indigo-500/30">
                  Engagement Rate
                </span>
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                Tren engagement rate per kategori konten · 30 hari historis + proyeksi 7 hari
              </p>
            </div>
          </div>

          {/* Forecast toggle */}
          <button
            type="button"
            onClick={() => setShowForecast(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
            style={{
              background: showForecast ? "rgba(236,72,153,0.15)" : "rgba(255,255,255,0.06)",
              color: showForecast ? "#ec4899" : "rgba(255,255,255,0.4)",
              border: showForecast ? "1px solid rgba(236,72,153,0.3)" : "1px solid rgba(255,255,255,0.08)",
            }}>
            <span className="w-2 h-2 rounded-full inline-block"
              style={{ background: "#ec4899", borderStyle: "dashed", outline: "1px dashed #ec4899" }} />
            Proyeksi 7 Hari
          </button>
        </div>

        {loading ? (
          <div className="h-[320px] flex items-center justify-center text-white/40 text-xs font-bold">
            Memuat data tren kategori...
          </div>
        ) : data.length === 0 ? (
          <div className="h-[320px] flex flex-col items-center justify-center gap-3 text-center"
            style={{ borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}>
            <Info className="w-7 h-7 text-white/20" />
            <p className="text-sm font-black text-white/30">Data kategori belum tersedia</p>
            <p className="text-xs text-white/20 max-w-xs leading-relaxed">
              Pastikan pipeline ingestion sudah berjalan dan akun utama sudah dikonfigurasi.
            </p>
          </div>
        ) : (
          <>
            {/* Category toggle pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {data.map((cat) => {
                const meta = CAT_META[cat.category] ?? { color: "#888", icon: TrendingUp };
                const Icon = meta.icon;
                const isHidden = hidden.has(cat.category);
                const TrendIcon = cat.trendDirection === "rising" ? TrendingUp
                  : cat.trendDirection === "declining" ? TrendingDown : Minus;
                const trendC = cat.trendDirection === "rising" ? "#10b981"
                  : cat.trendDirection === "declining" ? "#ef4444" : "#f59e0b";
                return (
                  <button key={cat.category} type="button" onClick={() => toggleCat(cat.category)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all"
                    style={{
                      background: isHidden ? "rgba(255,255,255,0.04)" : meta.color + "22",
                      border: `1px solid ${isHidden ? "rgba(255,255,255,0.08)" : meta.color + "44"}`,
                      color: isHidden ? "rgba(255,255,255,0.25)" : meta.color,
                    }}>
                    <Icon className="w-3 h-3" />
                    {cat.category}
                    <span className="flex items-center gap-0.5 ml-1" style={{ color: isHidden ? "rgba(255,255,255,0.2)" : trendC }}>
                      <TrendIcon className="w-2.5 h-2.5" />
                      <span className="text-[9px] font-black">
                        {cat.predictedChangePct > 0 ? "+" : ""}{cat.predictedChangePct.toFixed(1)}%
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Main chart */}
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)", fontWeight: 700 }}
                    axisLine={false} tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)", fontWeight: 700 }}
                    axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${(v * 100).toFixed(1)}%`}
                    width={44}
                  />
                  <Tooltip content={<CustomTooltip />} />

                  {/* Forecast boundary */}
                  {forecastStartDate && showForecast && (
                    <ReferenceLine x={forecastStartDate} stroke="rgba(236,72,153,0.4)"
                      strokeDasharray="4 4" strokeWidth={1.5}
                      label={{ value: "Proyeksi", position: "insideTopRight", fontSize: 9, fill: "rgba(236,72,153,0.7)" }} />
                  )}

                  {/* Historical lines */}
                  {data.map((cat) => {
                    if (hidden.has(cat.category)) return null;
                    const color = CAT_META[cat.category]?.color ?? "#888";
                    return (
                      <Line key={cat.category}
                        type="monotone" dataKey={cat.category}
                        stroke={color} strokeWidth={2}
                        dot={false} activeDot={{ r: 4, fill: color }}
                        connectNulls
                      />
                    );
                  })}

                  {/* Forecast dashed lines */}
                  {showForecast && data.map((cat) => {
                    if (hidden.has(cat.category)) return null;
                    const color = CAT_META[cat.category]?.color ?? "#888";
                    return (
                      <Line key={`${cat.category}_fc`}
                        type="monotone" dataKey={`${cat.category}_fc`}
                        stroke={color} strokeWidth={1.5}
                        strokeDasharray="5 4" dot={false}
                        activeDot={{ r: 3 }} connectNulls
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Legend + summary row */}
            <div className="mt-4 pt-4 grid grid-cols-5 gap-2"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {data.map((cat) => {
                const meta = CAT_META[cat.category] ?? { color: "#888" };
                const trendColor = cat.trendDirection === "rising" ? "#10b981"
                  : cat.trendDirection === "declining" ? "#ef4444" : "#f59e0b";
                const TIcon = cat.trendDirection === "rising" ? TrendingUp
                  : cat.trendDirection === "declining" ? TrendingDown : Minus;
                const last = cat.forecastTrend?.[cat.forecastTrend.length - 1];
                const estEng = last ? (last.avgEngagementRate * 100).toFixed(2) : "—";
                return (
                  <div key={cat.category} className="flex flex-col gap-1 px-3 py-2 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${meta.color}22` }}>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta.color }} />
                      <span className="text-[9px] font-black text-white/60 truncate">{cat.category}</span>
                    </div>
                    <p className="text-xs font-black text-white">{(cat.globalAvgEngagementRate * 100).toFixed(2)}%</p>
                    <div className="flex items-center gap-1" style={{ color: trendColor }}>
                      <TIcon className="w-3 h-3" />
                      <span className="text-[9px] font-black">
                        {cat.predictedChangePct > 0 ? "+" : ""}{cat.predictedChangePct.toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-[8px] text-white/30">Est 7D: {estEng}%</p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
