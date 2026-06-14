"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  BookOpen,
  Smile,
  Utensils,
  Home,
  Monitor,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Info,
  Hash,
  Clock,
} from "lucide-react";
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

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CategoryTrendPoint {
  date: string;
  avgViews: number;
  avgEngagementRate: number;
  isForecast: boolean;
}

export interface CategoryTrendData {
  category: string;
  trendDirection: "rising" | "stable" | "declining";
  potentialScore: number;
  globalAvgViews: number;
  globalAvgEngagementRate: number;
  avgViralProbability: number;
  predictedChangePct: number;
  mainAccountVideoCount: number;
  mainAccountAvgViews: number;
  mainAccountEngagementRate: number;
  competitorVideoCount: number;
  competitorAvgViews: number;
  competitorEngagementRate: number;
  recommendation: string;
  historicalTrend: CategoryTrendPoint[];
  forecastTrend: CategoryTrendPoint[];
}

// Simplified inline types for hashtag & posting time
type InlineHashtag = {
  hashtag: string;
  competitionLevel: string;
  expectedEngagementRate: number;
};

type InlinePostingTime = {
  dayName: string;
  timeLabel: string;
  expectedEngagementRate: number;
  confidenceScore: number;
};

type ContentTrendProps = {
  data: CategoryTrendData[];
  loading?: boolean;
  hasMainAccount?: boolean;
  hashtagRecs?: InlineHashtag[];
  postingTimeRecs?: InlinePostingTime[];
};

// ─── Static metadata per category ─────────────────────────────────────────────
const CATEGORY_META: Record<
  string,
  { color: string; bg: string; icon: React.ElementType; desc: string }
> = {
  Edukasi: {
    color: "#0369a1",
    bg: "rgba(3,105,161,0.12)",
    icon: BookOpen,
    desc: "Tutorial, cara, tips, step-by-step",
  },
  Komedi: {
    color: "#b45309",
    bg: "rgba(180,83,9,0.12)",
    icon: Smile,
    desc: "Situasi relatable, humor, ekspektasi vs realita",
  },
  Kuliner: {
    color: "#b91c1c",
    bg: "rgba(185,28,28,0.12)",
    icon: Utensils,
    desc: "Resep, review makanan, ASMR masak",
  },
  "Lifestyle & Home": {
    color: "#047857",
    bg: "rgba(4,120,87,0.12)",
    icon: Home,
    desc: "Before-after, DIY, morning routine",
  },
  Teknologi: {
    color: "#5b21b6",
    bg: "rgba(91,33,182,0.12)",
    icon: Monitor,
    desc: "Review gadget, tips tech, unboxing",
  },
};

// ─── Opportunity score ring ────────────────────────────────────────────────────
function ScoreRing({ score, color }: { score: number; color: string }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const filled = ((score / 100) * circumference).toFixed(1);
  const tier =
    score >= 70 ? "Tinggi" : score >= 45 ? "Menengah" : "Rendah";
  return (
    <div className="relative flex items-center justify-center w-16 h-16 flex-shrink-0">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="5"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
          style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xs font-black text-white leading-none">{score}</span>
        <span className="text-[8px] font-bold leading-none" style={{ color }}>{tier}</span>
      </div>
    </div>
  );
}

// ─── Mini chart for one category ──────────────────────────────────────────────
function CategoryMiniChart({
  history,
  forecast,
  color,
}: {
  history: CategoryTrendPoint[];
  forecast: CategoryTrendPoint[];
  color: string;
}) {
  const combined = [
    ...history.map((p) => ({
      date: p.date?.slice(5) ?? "",
      histVal: p.avgEngagementRate,
      foreVal: null as number | null,
    })),
    // bridge: last history point also gets a foreVal
    ...(history.length > 0
      ? [
          {
            date: history[history.length - 1].date?.slice(5) ?? "",
            histVal: null as number | null,
            foreVal: history[history.length - 1].avgEngagementRate,
          },
        ]
      : []),
    ...forecast.map((p) => ({
      date: p.date?.slice(5) ?? "",
      histVal: null as number | null,
      foreVal: p.avgEngagementRate,
    })),
  ];

  const hasData = combined.some(
    (d) => (d.histVal ?? 0) > 0 || (d.foreVal ?? 0) > 0
  );

  if (!hasData) {
    return (
      <div
        className="h-28 flex items-center justify-center text-[10px] font-bold"
        style={{ color: "rgba(255,255,255,0.25)" }}
      >
        Data historis tidak tersedia
      </div>
    );
  }

  return (
    <div className="h-28 mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={combined} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)", fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)", fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => (v * 100).toFixed(0) + "%"}
          />
          <Tooltip
            contentStyle={{
              background: "#18181b",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              fontSize: 10,
              fontWeight: 700,
              color: "#fff",
            }}
            formatter={(v: any, name: string) => [
              (Number(v) * 100).toFixed(2) + "%",
              name === "histVal" ? "Aktual" : "Prediksi",
            ]}
            labelStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 9 }}
          />
          <Area
            type="monotone"
            dataKey="histVal"
            stroke="none"
            fill={color}
            fillOpacity={0.08}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="histVal"
            stroke={color}
            strokeWidth={2}
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="foreVal"
            stroke="#ec4899"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Single category card ──────────────────────────────────────────────────────
function CategoryCard({
  item,
  rank,
  hashtagRecs = [],
  postingTimeRecs = [],
}: {
  item: CategoryTrendData;
  rank: number;
  hashtagRecs?: InlineHashtag[];
  postingTimeRecs?: InlinePostingTime[];
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[item.category] ?? {
    color: "#888",
    bg: "rgba(136,136,136,0.1)",
    icon: Sparkles,
    desc: "",
  };
  const Icon = meta.icon;
  const TrendIcon =
    item.trendDirection === "rising"
      ? TrendingUp
      : item.trendDirection === "declining"
      ? TrendingDown
      : Minus;
  const trendColor =
    item.trendDirection === "rising"
      ? "#10b981"
      : item.trendDirection === "declining"
      ? "#ef4444"
      : "#f59e0b";
  const trendLabel =
    item.trendDirection === "rising"
      ? "Naik Tren"
      : item.trendDirection === "declining"
      ? "Menurun"
      : "Stabil";

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid rgba(255,255,255,0.08)`,
        boxShadow: expanded ? `0 0 20px ${meta.color}22` : "none",
      }}
    >
      {/* Card header */}
      <div
        className="p-4 flex items-start gap-3 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Rank badge */}
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0 mt-0.5"
          style={{ background: meta.color + "33", color: meta.color }}
        >
          {rank}
        </div>

        {/* Category icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: meta.bg }}
        >
          <Icon className="w-4 h-4" style={{ color: meta.color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <span className="text-sm font-black text-white">{item.category}</span>
              <span className="ml-2 text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>
                {meta.desc}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Trend badge */}
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black"
                style={{ background: trendColor + "22", color: trendColor }}
              >
                <TrendIcon className="w-3 h-3" />
                {trendLabel}
                {item.predictedChangePct !== 0 && (
                  <span>
                    {item.predictedChangePct > 0 ? "+" : ""}
                    {item.predictedChangePct.toFixed(1)}%
                  </span>
                )}
              </span>
              {/* Expand toggle */}
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-white/30" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-white/30" />
              )}
            </div>
          </div>

          {/* Quick stats row */}
          <div className="flex items-center gap-4 mt-1.5 flex-wrap">
            <ScoreRing score={Math.round(item.potentialScore)} color={meta.color} />
            <div className="flex gap-4 flex-wrap">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Avg Views Global
                </p>
                <p className="text-xs font-black text-white">{formatNum(Math.round(item.globalAvgViews))}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Avg Engagement
                </p>
                <p className="text-xs font-black text-white">
                  {(item.globalAvgEngagementRate * 100).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Viral Prob
                </p>
                <p className="text-xs font-black" style={{ color: "#10b981" }}>
                  {(item.avgViralProbability * 100).toFixed(0)}%
                </p>
              </div>
              {item.mainAccountVideoCount > 0 && (
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Video Akun Utama
                  </p>
                  <p className="text-xs font-black text-white">{item.mainAccountVideoCount}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div
          className="px-4 pb-4 space-y-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Mini chart */}
          <CategoryMiniChart
            history={item.historicalTrend}
            forecast={item.forecastTrend}
            color={meta.color}
          />

          {/* Benchmarks */}
          {(item.mainAccountVideoCount > 0 || item.competitorVideoCount > 0) && (
            <div className="grid grid-cols-2 gap-3">
              {item.mainAccountVideoCount > 0 && (
                <div
                  className="p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1.5">Akun Utama</p>
                  <p className="text-[10px] text-white/70">
                    <span className="font-black text-white">{item.mainAccountVideoCount}</span> video
                  </p>
                  <p className="text-[10px] text-white/70">
                    Avg views: <span className="font-black text-white">{formatNum(Math.round(item.mainAccountAvgViews))}</span>
                  </p>
                  <p className="text-[10px] text-white/70">
                    Engagement: <span className="font-black text-white">{(item.mainAccountEngagementRate * 100).toFixed(2)}%</span>
                  </p>
                </div>
              )}
              {item.competitorVideoCount > 0 && (
                <div
                  className="p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1.5">Kompetitor</p>
                  <p className="text-[10px] text-white/70">
                    <span className="font-black text-white">{item.competitorVideoCount}</span> video
                  </p>
                  <p className="text-[10px] text-white/70">
                    Avg views: <span className="font-black text-white">{formatNum(Math.round(item.competitorAvgViews))}</span>
                  </p>
                  <p className="text-[10px] text-white/70">
                    Engagement: <span className="font-black text-white">{(item.competitorEngagementRate * 100).toFixed(2)}%</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Recommendation */}
          <div
            className="px-3 py-2.5 rounded-xl text-[11px] leading-relaxed"
            style={{ background: meta.color + "11", border: `1px solid ${meta.color}33`, color: "rgba(255,255,255,0.75)" }}
          >
            <span className="font-black" style={{ color: meta.color }}>💡 Rekomendasi: </span>
            {item.recommendation}
          </div>

          {/* Action Plan: Hashtags + Posting Times */}
          {(hashtagRecs.length > 0 || postingTimeRecs.length > 0) && (
            <div
              className="p-3 rounded-xl space-y-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
                Strategi Posting · Akun Utama
              </p>

              {/* Top 3 Hashtags */}
              {hashtagRecs.length > 0 && (
                <div>
                  <p className="text-[9px] font-bold mb-1.5 flex items-center gap-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                    <Hash className="w-3 h-3" /> Top Hashtag
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {hashtagRecs.slice(0, 3).map((h) => {
                      const compColor =
                        h.competitionLevel?.toLowerCase() === "low"
                          ? "#10b981"
                          : h.competitionLevel?.toLowerCase() === "medium"
                          ? "#f59e0b"
                          : "#ef4444";
                      return (
                        <span
                          key={h.hashtag}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: compColor + "18", color: compColor, border: `1px solid ${compColor}33` }}
                        >
                          #{h.hashtag} · {(h.expectedEngagementRate * 100).toFixed(1)}%
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Top 3 Posting Times */}
              {postingTimeRecs.length > 0 && (
                <div>
                  <p className="text-[9px] font-bold mb-1.5 flex items-center gap-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                    <Clock className="w-3 h-3" /> Waktu Terbaik
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {postingTimeRecs.slice(0, 3).map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.25)" }}
                      >
                        <Clock className="w-2.5 h-2.5 inline mr-0.5" />
                        {t.dayName} {t.timeLabel}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export function EngagementForecast({ data, loading = false, hasMainAccount = true, hashtagRecs = [], postingTimeRecs = [] }: ContentTrendProps) {
  const topCategory = data[0] ?? null;

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

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-500/10 border border-rose-500/20 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-rose-500 animate-pulse" />
          </div>
          <div className="flex-1">
            <h2 className="font-black text-base text-white tracking-tight flex items-center gap-2 flex-wrap">
              Content Trend Intelligence
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-extrabold uppercase tracking-wide border border-rose-500/30">
                ML Predictive
              </span>
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              Prediksi peluang tren konten 7 hari ke depan · 5 kategori utama · berbasis data historis &amp; benchmark kompetitor
            </p>
          </div>
        </div>

        {/* Explanation card */}
        <div
          className="mb-5 p-4 rounded-xl text-xs space-y-2 text-white/65"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="leading-relaxed">
            <strong className="text-rose-400">Cara Kerja:</strong> Sistem menganalisis data engagement historis dari{" "}
            <strong className="text-white">5 kategori utama</strong> (Edukasi, Komedi, Kuliner, Lifestyle &amp; Home, Teknologi)
            menggunakan perbandingan tren 14 hari terakhir vs 15-30 hari sebelumnya. Setiap kategori mendapatkan{" "}
            <strong className="text-white">Opportunity Score (0–100)</strong> yang memperhitungkan: viral probability,
            momentum tren engagement, gap performa akun utama vs kompetitor, dan rata-rata engagement rate global.
          </p>
          <p className="leading-relaxed">
            <strong className="text-emerald-400">Data yang digunakan:</strong> Views, likes, comments, shares, engagement rate,
            viral probability, caption, hashtag, waktu posting — dari semua akun yang dianalisis.
            Garis solid = data historis aktual · Garis putus-putus pink = proyeksi 7 hari ke depan.
          </p>
        </div>

        {loading ? (
          <div className="h-[200px] flex items-center justify-center text-white/50 text-xs font-bold">
            Menganalisis tren konten dari 5 kategori...
          </div>
        ) : !hasMainAccount ? (
          <div
            className="h-[180px] flex flex-col items-center justify-center gap-3 text-center px-8 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}
          >
            <Info className="w-7 h-7 text-white/20" />
            <p className="text-sm font-black text-white/40">Pilih akun utama terlebih dahulu</p>
            <p className="text-xs text-white/25 max-w-xs leading-relaxed">
              Content Trend Intelligence akan menampilkan peluang kategori konten yang paling sesuai dengan profil akun utama Anda.
            </p>
          </div>
        ) : data.length === 0 ? (
          <div
            className="h-[180px] flex flex-col items-center justify-center gap-3 text-center px-8 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}
          >
            <AlertCircle className="w-7 h-7 text-amber-400/60" />
            <p className="text-sm font-black text-white/40">Data historis kategori belum tersedia</p>
            <p className="text-xs text-white/25 max-w-xs leading-relaxed">
              Pastikan data video sudah di-ingestion ke tabel <code className="text-white/40">vw_category_feature_store</code>.
              Jalankan DAG 2 (Ingestion) agar data kategori terisi.
            </p>
          </div>
        ) : (
          <>
            {/* Top recommendation highlight */}
            {topCategory && (
              <div
                className="mb-4 p-3 rounded-xl flex items-center gap-3"
                style={{
                  background: (CATEGORY_META[topCategory.category]?.color ?? "#888") + "18",
                  border: `1px solid ${(CATEGORY_META[topCategory.category]?.color ?? "#888")}33`,
                }}
              >
                <TrendingUp
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: CATEGORY_META[topCategory.category]?.color ?? "#888" }}
                />
                <p className="text-[11px] text-white/75 leading-relaxed">
                  <strong className="text-white">
                    Kategori #{1} tertinggi: {topCategory.category}
                  </strong>{" "}
                  dengan Opportunity Score{" "}
                  <strong style={{ color: CATEGORY_META[topCategory.category]?.color ?? "#888" }}>
                    {Math.round(topCategory.potentialScore)}/100
                  </strong>
                  {topCategory.trendDirection === "rising" && " — sedang naik tren, waktu terbaik untuk mulai posting."}
                  {topCategory.trendDirection === "stable" && " — tren stabil, konsistensi akan memberikan hasil terbaik."}
                  {topCategory.trendDirection === "declining" && " — tren menurun, pertimbangkan kategori lain atau buat konten yang lebih unik."}
                </p>
              </div>
            )}

            {/* Category cards */}
            <div className="space-y-2.5">
              {data.map((item, idx) => (
                <CategoryCard
                  key={item.category}
                  item={item}
                  rank={idx + 1}
                  hashtagRecs={hashtagRecs}
                  postingTimeRecs={postingTimeRecs}
                />
              ))}
            </div>

            {/* Legend */}
            <div
              className="mt-4 pt-4 flex items-center gap-4 flex-wrap text-[10px] font-bold"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}
            >
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 rounded bg-white/60 inline-block" /> Engagement Rate Aktual
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 rounded inline-block" style={{ background: "#ec4899", border: "none", backgroundImage: "repeating-linear-gradient(90deg,#ec4899 0,#ec4899 4px,transparent 4px,transparent 8px)" }} /> Proyeksi 7 Hari
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border-2 border-emerald-400 inline-block" /> Score Tinggi ≥ 70
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border-2 border-amber-400 inline-block" /> Score Menengah 45–69
              </span>
              <span className="ml-auto text-white/20">Klik kartu untuk melihat detail &amp; grafik</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
