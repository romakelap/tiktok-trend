import React from 'react';
import { BarChart2, Flame, TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { KeywordItem, formatNum } from '@/lib/keyword/mock-data';

interface FrequencyChartProps {
  keywords: KeywordItem[];
}

export function FrequencyChart({ keywords }: FrequencyChartProps) {
  const top10 = keywords.slice(0, 10);
  const maxFreq = Math.max(...top10.map(k => k.frequency), 1);

  const chartData = top10.map(kw => ({
    name: kw.keyword.length > 14 ? `${kw.keyword.slice(0, 12)}...` : kw.keyword,
    fullName: kw.keyword,
    frequency: kw.frequency,
    avgViews: kw.avgViews,
    engagement: kw.engagement,
    rank: kw.rank,
    type: kw.type,
  }));

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'hot':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60">
            <Flame className="w-2.5 h-2.5 fill-current" /> HOT
          </span>
        );
      case 'up':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60">
            <TrendingUp className="w-2.5 h-2.5" /> NAIK
          </span>
        );
      case 'down':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60">
            <TrendingDown className="w-2.5 h-2.5" /> TURUN
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-stone-100 text-stone-600 dark:bg-neutral-800 dark:text-neutral-400 border border-stone-200/60">
            <Minus className="w-2.5 h-2.5" /> STABIL
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* ── 1. Top 10 Visual Bar Chart Diagram ── */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden">
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/60 shadow-2xs">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-stone-900 dark:text-white">
                  Visualisasi Diagram Frekuensi Top 10 Keywords
                </h3>
                <p className="text-xs text-stone-500 dark:text-neutral-400">
                  Perbandingan persentase penggunaan kata kunci terpopuler pada caption video
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">
              Top 10 Keywords
            </span>
          </div>

          {/* Recharts Bar Chart */}
          <div style={{ height: 260 }} className="w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 15, right: 15, left: -15, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fontWeight: 600, fill: "#0284c7" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const item = payload[0]?.payload;

                    return (
                      <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl p-3 shadow-lg text-xs space-y-1.5 min-w-[200px]">
                        <div className="flex items-center justify-between pb-1 border-b border-stone-100 dark:border-neutral-800">
                          <span className="font-bold text-stone-900 dark:text-white font-mono">
                            #{item.rank} &quot;{item.fullName}&quot;
                          </span>
                          <span className="text-[10px] uppercase font-bold text-stone-400">
                            {item.type}
                          </span>
                        </div>
                        <div className="space-y-1 font-mono text-xs">
                          <div className="flex items-center justify-between text-sky-600 dark:text-sky-400 font-bold">
                            <span>Frekuensi Penggunaan:</span>
                            <span>{item.frequency}%</span>
                          </div>
                          <div className="flex items-center justify-between text-stone-600 dark:text-neutral-300">
                            <span>Rata-rata Tayangan:</span>
                            <span>{formatNum(item.avgViews)}</span>
                          </div>
                          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-bold">
                            <span>Engagement Rate:</span>
                            <span>{item.engagement}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="frequency"
                  name="Frekuensi (%)"
                  fill="#0284c7"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={42}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── 2. Top 10 Detail Ranking List with Blue Bars ── */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-600 text-white shadow-sm">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-stone-900 dark:text-white">
                  Daftar Peringkat Top 10 Keywords
                </h3>
                <p className="text-xs text-stone-500 dark:text-neutral-400">
                  Rincian persentase penggunaan, rata-rata penayangan, engagement rate, dan status tren
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {top10.map((kw, i) => {
              const pct = Math.max(10, (kw.frequency / maxFreq) * 100);
              const isNo1 = i === 0;

              return (
                <div
                  key={kw.rank}
                  className="rounded-xl p-3 border border-stone-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-sky-300 dark:hover:border-sky-700 hover:bg-sky-50/20 dark:hover:bg-sky-950/10 transition-all duration-150"
                >
                  <div className="flex items-center gap-3">
                    {/* Rank */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-mono font-bold text-xs ${
                        isNo1
                          ? 'bg-sky-600 text-white shadow-2xs'
                          : 'bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400'
                      }`}
                    >
                      {kw.rank}
                    </div>

                    {/* Keyword Name */}
                    <div className="flex-shrink-0 w-36 sm:w-44">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white truncate">
                          &quot;{kw.keyword}&quot;
                        </span>
                        {isNo1 && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-sky-600 text-white shadow-2xs">
                            TOP
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-stone-400 dark:text-neutral-500 capitalize">
                        Tipe: {kw.type}
                      </span>
                    </div>

                    {/* Blue Progress Bar */}
                    <div className="flex-1 min-w-[100px] flex items-center gap-2">
                      <div className="flex-1 relative h-6 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 overflow-hidden">
                        <div
                          className={`h-full rounded-lg transition-all duration-500 ${
                            isNo1
                              ? 'bg-sky-600 dark:bg-sky-500'
                              : 'bg-sky-500/85 dark:bg-sky-500/70'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                        {/* Text inside bar with pure white font */}
                        <div className="absolute inset-0 flex items-center px-2.5">
                          <span className="font-mono font-bold text-[11px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] select-none">
                            {kw.frequency}% usage
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats — avg views + engagement */}
                    <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                      <div className="text-right min-w-[60px]">
                        <p className="font-mono font-bold text-xs text-stone-900 dark:text-white">{formatNum(kw.avgViews)}</p>
                        <p className="text-[9px] text-stone-400 dark:text-neutral-500 font-medium">avg views</p>
                      </div>
                      <div className="text-right min-w-[48px]">
                        <p className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">{kw.engagement.toFixed(1)}%</p>
                        <p className="text-[9px] text-stone-400 dark:text-neutral-500 font-medium">eng. rate</p>
                      </div>

                      {/* Trend badge */}
                      {getTrendBadge(kw.trend)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
