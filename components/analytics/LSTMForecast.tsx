"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Brain } from "lucide-react";
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
import { TOKENS } from "@/lib/design-tokens";
import { formatNum } from "@/lib/analytics/formatters";

type MetricKey = "views" | "likes" | "comments" | "shares";

interface ForecastDataPoint {
  date: string;
  predictedViews: number;
  predictedLikes: number;
  predictedComments: number;
  predictedShares: number;
  isForecast: boolean;
}

const METRIC_DEFS: Record<
  MetricKey,
  { label: string; color: string; valKey: string }
> = {
  views:    { label: "Views",    color: "#10b981", valKey: "predictedViews"    },
  likes:    { label: "Likes",    color: "#0ea5e9", valKey: "predictedLikes"    },
  comments: { label: "Comments", color: "#f59e0b", valKey: "predictedComments" },
  shares:   { label: "Shares",   color: "#a855f7", valKey: "predictedShares"   },
};

type LSTMForecastProps = {
  data: ForecastDataPoint[];
  loading?: boolean;
};

export function LSTMForecast({ data, loading = false }: LSTMForecastProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("views");

  const chartData = data.map((d, index) => {
    const isForecast = d.isForecast;
    const valKey = METRIC_DEFS[selectedMetric].valKey as keyof ForecastDataPoint;
    const val = typeof d[valKey] === "number" ? (d[valKey] as number) : 0;

    const isFirstForecast = isForecast && (index === 0 || !data[index - 1].isForecast);
    const showInHistory  = !isForecast || isFirstForecast;

    const isLastHistory  = !isForecast && (index === data.length - 1 || data[index + 1]?.isForecast);
    const showInForecast = isForecast  || isLastHistory;

    let displayDate = "";
    if (d.date) {
      try {
        const parts = d.date.split("-");
        if (parts.length === 3) displayDate = `${parts[2]}/${parts[1]}`;
        else displayDate = d.date;
      } catch { displayDate = d.date; }
    }

    return {
      ...d,
      dateLabel:     displayDate,
      historyValue:  showInHistory  ? val : null,
      forecastValue: showInForecast ? val : null,
    };
  });

  const activeDef = METRIC_DEFS[selectedMetric];

  const historyPoints  = data.filter((d) => !d.isForecast);
  const forecastPoints = data.filter((d) =>  d.isForecast);

  const getAvg = (points: ForecastDataPoint[], key: string) => {
    if (points.length === 0) return 0;
    const sum = points.reduce(
      (acc, p) => acc + ((p[key as keyof ForecastDataPoint] as number) || 0),
      0
    );
    return Math.round(sum / points.length);
  };

  const valKey      = activeDef.valKey;
  const avgHistory  = getAvg(historyPoints,  valKey);
  const avgForecast = getAvg(forecastPoints, valKey);
  const pctChange   = avgHistory > 0 ? ((avgForecast - avgHistory) / avgHistory) * 100 : 0;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    } catch {}
    return dateStr;
  };

  const historyRange  = historyPoints.length > 0
    ? `${formatDate(historyPoints[0].date)} s/d ${formatDate(historyPoints[historyPoints.length - 1].date)}`
    : "-";
  const forecastRange = forecastPoints.length > 0
    ? `${formatDate(forecastPoints[0].date)} s/d ${formatDate(forecastPoints[forecastPoints.length - 1].date)}`
    : "-";

  const hasHistory   = historyPoints.length > 0;
  const hasForecast  = forecastPoints.length > 0;
  const isLstmForecast  = hasForecast && historyPoints.length >= 7;
  const isTrendForecast = hasForecast && historyPoints.length < 7;
  const insufficientHistory = hasHistory && historyPoints.length < 3;

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        border: "1px solid rgba(139,92,246,0.2)",
        boxShadow: "0 8px 40px rgba(139,92,246,0.1)",
      }}
    >
      <GridBg theme="dark" />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}>
              <Brain className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="font-black text-base text-white tracking-tight flex items-center gap-2">
                LSTM Engagement Forecasting
                <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide border"
                      style={{ background: "rgba(139,92,246,0.2)", color: "#c4b5fd", borderColor: "rgba(139,92,246,0.4)" }}>
                  PyTorch LSTM
                </span>
              </h2>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                Time-series forecasting · 14 hari histori → 7 hari prediksi
              </p>
              {data.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-0.5 mt-1 text-[10px] text-white/50">
                  <span><strong className="text-emerald-400">Histori Aktual:</strong> {historyRange}</span>
                  <span className="hidden sm:inline" style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
                  <span><strong className="text-violet-400">Prediksi LSTM:</strong> {forecastRange}</span>
                </div>
              )}
            </div>
          </div>

          {/* Metric Selector */}
          <div className="flex flex-wrap gap-1.5">
            {(Object.entries(METRIC_DEFS) as [MetricKey, typeof METRIC_DEFS[MetricKey]][]).map(([key, m]) => {
              const isSelected = selectedMetric === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedMetric(key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all"
                  style={{
                    background:  isSelected ? m.color : "rgba(255,255,255,0.06)",
                    color:       isSelected ? "#fff"  : "rgba(255,255,255,0.5)",
                    border:      `1px solid ${isSelected ? m.color : "rgba(255,255,255,0.08)"}`,
                    boxShadow:   isSelected ? `0 0 10px ${m.color}44` : "none",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full"
                        style={{ background: isSelected ? "#fff" : m.color }} />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div
          className="mb-6 p-4 rounded-xl text-xs space-y-2 text-white/70"
          style={{ background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.15)" }}
        >
          <p className="leading-relaxed">
            <strong className="text-violet-400">Cara Kerja Model:</strong> Model{" "}
            <strong className="text-white">LSTM (Long Short-Term Memory)</strong> berbasis PyTorch dilatih menggunakan
            data time-series engagement harian (views, likes, comments, shares) dari semua akun yang dipantau.
            Model menerima sequence 14 hari sebagai input dan memprediksi 7 hari ke depan secara simultan.
          </p>
          <p className="leading-relaxed">
            <strong className="text-emerald-400">Interpretasi Chart:</strong>{" "}
            Garis <span className="text-emerald-400 font-bold">solid</span> = data aktual historis.{" "}
            Garis <span className="text-violet-400 font-bold">putus-putus</span> = prediksi LSTM model PyTorch.
          </p>
        </div>

        {loading ? (
          <div className="h-[280px] flex items-center justify-center text-white/50 text-xs font-bold">
            <span className="animate-pulse">Memuat prediksi LSTM model...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="h-[280px] flex flex-col items-center justify-center gap-3 text-center px-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1"
                 style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Brain className="w-6 h-6" style={{ color: "rgba(255,255,255,0.25)" }} />
            </div>
            <p className="text-sm font-black" style={{ color: "rgba(255,255,255,0.5)" }}>
              Belum ada data prediksi LSTM
            </p>
            <p className="text-xs leading-relaxed max-w-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
              Tabel <code className="px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.08)" }}>ml_engagement_forecasts</code> masih kosong.
              Jalankan DAG 3 (ML Inference) di Airflow, atau trigger inference melalui menu ML Predictions.
            </p>
          </div>
        ) : (
          <>
            {/* Data quality banners */}
            {insufficientHistory && (
              <div className="mb-4 px-4 py-3 rounded-xl flex items-start gap-3 text-xs"
                   style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
                <span className="text-amber-400 font-black flex-shrink-0 mt-0.5">⚠</span>
                <p style={{ color: "rgba(255,255,255,0.6)" }}>
                  <strong className="text-amber-400">Data histori terbatas</strong> — hanya {historyPoints.length} hari tersedia.
                  LSTM optimal dengan minimal 14 hari data snapshot. Jalankan DAG 2 secara rutin.
                </p>
              </div>
            )}
            {isTrendForecast && (
              <div className="mb-4 px-4 py-3 rounded-xl flex items-start gap-3 text-xs"
                   style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <span className="text-violet-400 font-black flex-shrink-0 mt-0.5">ℹ</span>
                <p style={{ color: "rgba(255,255,255,0.55)" }}>
                  <strong className="text-violet-400">Linear trend (fallback)</strong> — tabel{" "}
                  <code className="px-1 py-0.5 rounded text-violet-300"
                        style={{ background: "rgba(139,92,246,0.15)" }}>ml_engagement_forecasts</code>{" "}
                  kosong. Garis putus-putus adalah ekstrapolasi linier sementara.
                  Jalankan DAG 3 untuk prediksi LSTM nyata.
                </p>
              </div>
            )}
            {isLstmForecast && (
              <div className="mb-4 px-4 py-3 rounded-xl flex items-start gap-3 text-xs"
                   style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
                <span className="text-emerald-400 font-black flex-shrink-0 mt-0.5">✓</span>
                <p style={{ color: "rgba(255,255,255,0.55)" }}>
                  <strong className="text-emerald-400">LSTM aktif</strong> — model PyTorch telah memproses{" "}
                  {historyPoints.length} hari histori dan menghasilkan proyeksi 7 hari ke depan.
                </p>
              </div>
            )}

            {/* Chart */}
            <div className="relative h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lstmHistoryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={activeDef.color} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={activeDef.color} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="lstmForecastGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="dateLabel"
                    stroke="rgba(255,255,255,0.3)"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: "rgba(255,255,255,0.45)" }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.3)"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatNum}
                    tick={{ fontSize: 10, fontWeight: 700, fill: "rgba(255,255,255,0.4)" }}
                  />
                  <Tooltip
                    cursor={{ stroke: "rgba(255,255,255,0.15)", strokeWidth: 1, strokeDasharray: "3 3" }}
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid rgba(139,92,246,0.3)",
                      borderRadius: 12,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#fff",
                    }}
                    formatter={(value: any, name: string) => {
                      const label = name === "historyValue" ? "Aktual/Histori" : "Prediksi LSTM";
                      return [formatNum(Number(value)), label];
                    }}
                  />

                  <Area type="monotone" dataKey="historyValue"  stroke="none" fill="url(#lstmHistoryGrad)"  connectNulls />
                  <Area type="monotone" dataKey="forecastValue" stroke="none" fill="url(#lstmForecastGrad)" connectNulls />

                  <Line
                    type="monotone"
                    dataKey="historyValue"
                    stroke={activeDef.color}
                    strokeWidth={3}
                    dot={{ r: 2, fill: activeDef.color, stroke: "#0f172a", strokeWidth: 1 }}
                    activeDot={{ r: 5, fill: activeDef.color, stroke: "#fff", strokeWidth: 2 }}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="forecastValue"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ r: 2, fill: "#8b5cf6", stroke: "#0f172a", strokeWidth: 1 }}
                    activeDot={{ r: 5, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
                    connectNulls
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Stats */}
            <div
              className="mt-6 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-4"
              style={{ borderTop: "1px solid rgba(139,92,246,0.15)" }}
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Rata-rata Histori
                </p>
                <h4 className="text-lg font-black text-white mt-1 tracking-tight">{formatNum(avgHistory)}</h4>
                <p className="text-[10px] text-white/50">Periode aktual historis</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400">
                  Proyeksi 7 Hari Ke Depan
                </p>
                <h4 className="text-lg font-black text-violet-400 mt-1 tracking-tight">{formatNum(avgForecast)}</h4>
                <p className="text-[10px] text-violet-300/40">Prediksi model LSTM PyTorch</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Tren Perubahan
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`text-sm font-black flex items-center ${pctChange >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {pctChange >= 0 ? "+" : ""}{pctChange.toFixed(1)}%
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/40" />
                </div>
                <p className="text-[10px] text-white/50">Proyeksi vs histori</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
