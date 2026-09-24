"use client";

import React, { useState, useMemo } from 'react';
import {
  Flame,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Hash,
  Video,
  Eye,
  Heart,
  MessageCircle,
  BarChart2,
  Layers,
  LineChart as LineChartIcon,
  Activity,
  Sparkles,
  ExternalLink
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { CatData, Tag, getTrendConfig, fmt } from "@/lib/hashtag/mock-data";
import { apiFetch } from "@/lib/api";
import { CAT_ICONS } from "./CategorySelector";
import { VideoMiniCard } from "./VideoMiniCard";

interface TopHashtagsProps {
  catData: CatData;
  catColor?: string;
  activeCategory: string;
  searchQuery: string;
}

export function TopHashtags({ catData, catColor = '#0284c7', activeCategory, searchQuery }: TopHashtagsProps) {
  const [expandedTag, setExpandedTag] = useState<string | null>(null);
  const [tagVideos, setTagVideos] = useState<Record<string, any[]>>({});
  const [loadingVideos, setLoadingVideos] = useState<Record<string, boolean>>({});

  // Series visibility for the combined chart
  const [visibleSeries, setVisibleSeries] = useState({
    uses: true,
    growth: true,
    engagement: true,
  });

  const CatIcon = CAT_ICONS[activeCategory] ?? Hash;

  // Always sort top 10 by uses for standard hierarchy
  const topTags = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const filtered = (catData?.tags || []).filter((t: Tag) => t.tag.toLowerCase().includes(q));
    return [...filtered].sort((a, b) => b.uses - a.uses).slice(0, 10);
  }, [catData, searchQuery]);

  // Prepare unified multi-metric chart data for Top 10
  const chartData = useMemo(() => {
    return topTags.map(t => ({
      name: t.tag.replace('#', ''),
      fullTag: t.tag,
      uses: t.uses,
      growth: t.weekGrowth,
      engagement: t.engagement,
      avgViews: t.avgViews,
      videoCount: t.videoCount,
    }));
  }, [topTags]);

  const handleToggleExpand = async (tagTitle: string) => {
    const isExpanding = expandedTag !== tagTitle;
    setExpandedTag(isExpanding ? tagTitle : null);

    if (isExpanding && !tagVideos[tagTitle]) {
      try {
        setLoadingVideos(prev => ({ ...prev, [tagTitle]: true }));
        const searchTag = tagTitle.startsWith('#') ? tagTitle.substring(1) : tagTitle;
        const res = await apiFetch<any>(`/api/videos?page=0&size=4&search=${encodeURIComponent(searchTag)}`);
        
        if (res.success && res.data && Array.isArray(res.data.items)) {
          const mapped = res.data.items.map((item: any) => {
            const formatDuration = (sec: number) => {
              if (!sec) return '0:00';
              const m = Math.floor(sec / 60);
              const s = sec % 60;
              return `${m}:${s.toString().padStart(2, '0')}`;
            };

            const getRelativeTime = (isoString: string) => {
              if (!isoString) return '';
              const date = new Date(isoString);
              const now = new Date();
              const diffMs = now.getTime() - date.getTime();
              const diffSec = Math.floor(diffMs / 1000);
              const diffMin = Math.floor(diffSec / 60);
              const diffHour = Math.floor(diffMin / 60);
              const diffDay = Math.floor(diffHour / 24);

              if (diffSec < 60) return 'baru saja';
              if (diffMin < 60) return `${diffMin} mnt lalu`;
              if (diffHour < 24) return `${diffHour} jam lalu`;
              return `${diffDay} hari lalu`;
            };

            return {
              id: item.videoPk,
              title: item.titleBrief || 'Untitled Video',
              views: item.viewsNum || 0,
              likes: item.likesNum || 0,
              comments: item.commentsNum || 0,
              duration: formatDuration(item.durationSeconds),
              date: getRelativeTime(item.publishedAt),
              viral: (item.viewsNum || 0) >= 100000,
              coverUrl: item.coverUrl,
              videoUrl: item.videoUrl,
              shareUrl: item.shareUrl,
            };
          });
          setTagVideos(prev => ({ ...prev, [tagTitle]: mapped }));
        }
      } catch (err) {
        console.error("Failed to fetch related videos:", err);
      } finally {
        setLoadingVideos(prev => ({ ...prev, [tagTitle]: false }));
      }
    }
  };

  const toggleSeries = (key: keyof typeof visibleSeries) => {
    setVisibleSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* ── 1. Unified Multi-Metric Line Chart Panel ── */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden">
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/60 shadow-2xs">
                <LineChartIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-stone-900 dark:text-white">
                  Visualisasi Diagram Metrik Top 10 Hashtag
                </h3>
                <p className="text-xs text-stone-500 dark:text-neutral-400">
                  Perbandingan tren satu grafik: Penggunaan (Uses), Pertumbuhan (%), dan Engagement Rate (%)
                </p>
              </div>
            </div>

            {/* Interactive Series Toggle Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => toggleSeries('uses')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  visibleSeries.uses
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border-sky-300 dark:border-sky-700 shadow-2xs'
                    : 'bg-stone-50 text-stone-400 dark:bg-neutral-800 border-stone-200 dark:border-neutral-700 opacity-60'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
                <span>Penggunaan (Bar)</span>
              </button>

              <button
                onClick={() => toggleSeries('growth')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  visibleSeries.growth
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 shadow-2xs'
                    : 'bg-stone-50 text-stone-400 dark:bg-neutral-800 border-stone-200 dark:border-neutral-700 opacity-60'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Pertumbuhan (Line %)</span>
              </button>

              <button
                onClick={() => toggleSeries('engagement')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  visibleSeries.engagement
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-300 dark:border-amber-700 shadow-2xs'
                    : 'bg-stone-50 text-stone-400 dark:bg-neutral-800 border-stone-200 dark:border-neutral-700 opacity-60'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Engagement Rate (Line %)</span>
              </button>
            </div>
          </div>

          {/* Composed Chart Canvas (Bar for Uses + Line for Rates) */}
          {chartData.length > 0 ? (
            <div style={{ height: 310 }} className="w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fontWeight: 700, fill: "#64748b" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                    tickFormatter={(v) => `#${v}`}
                  />
                  {/* Left Y-Axis for Uses */}
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tick={{ fontSize: 10, fontWeight: 600, fill: "#0284c7" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={fmt}
                  />
                  {/* Right Y-Axis for Percentage Rates (0 - 100) */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 10, fontWeight: 600, fill: "#10b981" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const item = payload[0]?.payload;

                      return (
                        <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl p-3 shadow-lg text-xs space-y-2 min-w-[210px]">
                          <div className="flex items-center justify-between pb-1.5 border-b border-stone-100 dark:border-neutral-800">
                            <span className="font-bold text-stone-900 dark:text-white font-mono text-sm">
                              {item.fullTag}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              {fmt(item.videoCount)} video
                            </span>
                          </div>

                          <div className="space-y-1 font-mono text-xs">
                            <div className="flex items-center justify-between text-sky-600 dark:text-sky-400 font-bold">
                              <span>Penggunaan:</span>
                              <span>{fmt(item.uses)} uses</span>
                            </div>
                            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                              <span>Pertumbuhan:</span>
                              <span>{item.growth >= 0 ? '+' : ''}{item.growth}%</span>
                            </div>
                            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-bold">
                              <span>Engagement Rate:</span>
                              <span>{item.engagement}%</span>
                            </div>
                            <div className="flex items-center justify-between text-stone-500 dark:text-neutral-400 pt-1 border-t border-stone-100 dark:border-neutral-800 text-[11px]">
                              <span>Rata-rata Views:</span>
                              <span>{fmt(item.avgViews)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  {visibleSeries.uses && (
                    <Bar
                      yAxisId="left"
                      dataKey="uses"
                      name="Penggunaan"
                      fill="#0284c7"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={38}
                    />
                  )}
                  {visibleSeries.growth && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="growth"
                      name="Pertumbuhan (%)"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      strokeDasharray="4 4"
                      dot={{ r: 3.5, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
                    />
                  )}
                  {visibleSeries.engagement && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="engagement"
                      name="Engagement (%)"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      dot={{ r: 3.5, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 6, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-stone-400">
              Tidak ada data untuk grafik
            </div>
          )}
        </div>
      </div>

      {/* ── 2. Top 10 Hashtag Rows Panel with Blue Bars ── */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden">
        <div className="p-6">
          {/* Panel header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-600 text-white shadow-sm">
                <CatIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="font-black text-base text-stone-900 dark:text-white">
                    Top 10 Hashtag
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">
                    {activeCategory}
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-neutral-400">
                  <span className="font-mono font-bold text-stone-700 dark:text-neutral-300">{fmt(catData?.tags?.length || 0)}</span> total hashtags ·{' '}
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {(catData?.weekGrowth || 0) >= 0 ? '+' : ''}{catData?.weekGrowth || 0}% tren mingguan
                  </span>
                </p>
              </div>
            </div>

            <div className="text-xs font-mono text-stone-400 dark:text-neutral-500">
              Klik baris hashtag untuk melihat sampel video & detail lengkap
            </div>
          </div>

          {/* Hashtag rows */}
          <div className="space-y-2">
            {topTags.map((tag, idx) => {
              const maxUses = topTags[0]?.uses || 1;
              const pct = Math.max(10, (tag.uses / maxUses) * 100);
              const isNo1 = idx === 0;
              const tc = getTrendConfig(tag.trend);
              const isExpand = expandedTag === tag.tag;

              return (
                <div key={tag.tag} className="transition-all duration-150">
                  {/* Row */}
                  <div
                    onClick={() => handleToggleExpand(tag.tag)}
                    className={`group cursor-pointer rounded-xl p-3 border transition-all duration-150 ${
                      isExpand
                        ? 'bg-sky-50/40 dark:bg-sky-950/20 border-sky-300 dark:border-sky-700 shadow-2xs'
                        : 'bg-white dark:bg-neutral-900 border-stone-200/70 dark:border-neutral-800 hover:border-sky-300 dark:hover:border-sky-700 hover:bg-sky-50/20 dark:hover:bg-sky-950/10'
                    }`}
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
                        {idx + 1}
                      </div>

                      {/* Tag name + video count */}
                      <div className="flex-shrink-0 w-36 sm:w-44">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white truncate">
                            {tag.tag}
                          </span>
                          {isNo1 && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-sky-600 text-white shadow-2xs">
                              TOP
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[10px] text-stone-400 dark:text-neutral-500">
                          {fmt(tag.videoCount)} video terindeks
                        </span>
                      </div>

                      {/* Blue Progress Bar (Changed from black to blue!) */}
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
                          {/* Uses label inside bar */}
                          <div className="absolute inset-0 flex items-center px-2.5">
                            <span className="font-mono font-bold text-[11px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] select-none">
                              {fmt(tag.uses)} uses
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stats — avg views + engagement */}
                      <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                        <div className="text-right min-w-[60px]">
                          <p className="font-mono font-bold text-xs text-stone-900 dark:text-white">{fmt(tag.avgViews)}</p>
                          <p className="text-[9px] text-stone-400 dark:text-neutral-500 font-medium">avg views</p>
                        </div>
                        <div className="text-right min-w-[48px]">
                          <p className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">{tag.engagement}%</p>
                          <p className="text-[9px] text-stone-400 dark:text-neutral-500 font-medium">eng. rate</p>
                        </div>

                        {/* Trend badge */}
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold min-w-[68px] justify-center"
                          style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}
                        >
                          {tag.trend === 'hot' ? <Flame className="w-2.5 h-2.5 fill-current" />
                            : tag.trend === 'up' ? <TrendingUp className="w-2.5 h-2.5" />
                            : tag.trend === 'down' ? <TrendingDown className="w-2.5 h-2.5" />
                            : null}
                          {tag.weekGrowth >= 0 ? '+' : ''}{tag.weekGrowth}%
                        </span>
                      </div>

                      {/* Expand chevron */}
                      <div className="ml-1 flex-shrink-0 text-stone-400 dark:text-neutral-500">
                        {isExpand ? <ChevronUp className="w-4 h-4 text-sky-600" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* ── 3. Redesigned Highly Readable Expand Detail Drawer ── */}
                  {isExpand && (
                    <div className="mt-2 mb-3 p-5 rounded-2xl bg-stone-50/90 dark:bg-neutral-850 border border-stone-200 dark:border-neutral-750 shadow-xs space-y-5">
                      {/* Header status bar */}
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-stone-200/80 dark:border-neutral-750">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-sky-600 text-white font-mono font-bold text-xs">
                            #{idx + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                              {tag.tag}
                              <span className="text-[10px] font-mono font-normal px-2 py-0.2 rounded-full bg-stone-200/70 dark:bg-neutral-700 text-stone-700 dark:text-neutral-300">
                                {tag.category || activeCategory}
                              </span>
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-stone-500 dark:text-neutral-400">
                            Status Tren: <span style={{ color: tc.text }} className="font-bold">{tc.label}</span>
                          </span>
                          <span
                            className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md"
                            style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}
                          >
                            {tag.weekGrowth >= 0 ? '+' : ''}{tag.weekGrowth}% 7 hari
                          </span>
                        </div>
                      </div>

                      {/* 4 Clean High-Contrast Metric Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-sky-100 dark:border-sky-950/60 shadow-2xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                            Total Penggunaan
                          </span>
                          <p className="font-mono font-black text-xl text-sky-600 dark:text-sky-400 mt-1">
                            {fmt(tag.uses)}
                          </p>
                          <p className="text-[10px] text-stone-400 dark:text-neutral-500 mt-0.5">
                            {fmt(tag.videoCount)} video terindeks
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-neutral-400">
                            Rata-rata Tayangan
                          </span>
                          <p className="font-mono font-black text-xl text-stone-900 dark:text-white mt-1">
                            {fmt(tag.avgViews)}
                          </p>
                          <p className="text-[10px] text-stone-400 dark:text-neutral-500 mt-0.5">
                            Views per video
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-amber-100 dark:border-amber-950/60 shadow-2xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                            Engagement Rate
                          </span>
                          <p className="font-mono font-black text-xl text-amber-600 dark:text-amber-400 mt-1">
                            {tag.engagement}%
                          </p>
                          <p className="text-[10px] text-stone-400 dark:text-neutral-500 mt-0.5">
                            Rasio interaksi audiens
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-emerald-100 dark:border-emerald-950/60 shadow-2xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                            Laju Pertumbuhan
                          </span>
                          <p className="font-mono font-black text-xl text-emerald-600 dark:text-emerald-400 mt-1">
                            {tag.weekGrowth >= 0 ? '+' : ''}{tag.weekGrowth}%
                          </p>
                          <p className="text-[10px] text-stone-400 dark:text-neutral-500 mt-0.5">
                            Perubahan 7 hari
                          </p>
                        </div>
                      </div>

                      {/* Video List Header & Grid */}
                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                              <Video className="w-3 h-3" />
                            </div>
                            <h5 className="font-bold text-xs text-stone-900 dark:text-white">
                              Contoh Video Populer dengan Hashtag {tag.tag}
                            </h5>
                          </div>
                          <span className="text-[10px] font-mono text-stone-400">
                            {loadingVideos[tag.tag] ? 'Memuat sampel video...' : `${(tagVideos[tag.tag] || []).length} video ditemukan`}
                          </span>
                        </div>

                        {loadingVideos[tag.tag] ? (
                          <div className="flex items-center justify-center py-10 bg-white dark:bg-neutral-900 rounded-xl border border-stone-200/70 dark:border-neutral-800">
                            <div className="w-5 h-5 rounded-full border-2 border-sky-600 border-t-transparent animate-spin" />
                            <span className="text-xs font-bold text-stone-500 dark:text-neutral-400 ml-2.5">
                              Mengambil cuplikan video teratas...
                            </span>
                          </div>
                        ) : (tagVideos[tag.tag] || []).length === 0 ? (
                          <div className="text-center py-8 bg-white dark:bg-neutral-900 rounded-xl border border-stone-200/70 dark:border-neutral-800">
                            <span className="text-xs text-stone-400 dark:text-neutral-500">
                              Tidak ada cuplikan video yang terindeks untuk hashtag ini
                            </span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {(tagVideos[tag.tag] || []).map((v, vi) => (
                              <VideoMiniCard key={v.id} v={v} color="#0284c7" rank={vi + 1} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {topTags.length === 0 && (
              <div className="py-12 text-center rounded-xl bg-stone-50 dark:bg-neutral-850 border border-dashed border-stone-200 dark:border-neutral-800">
                <p className="text-xs font-bold text-stone-400 dark:text-neutral-500">
                  Tidak ada hashtag yang cocok dengan pencarian &quot;{searchQuery}&quot;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
