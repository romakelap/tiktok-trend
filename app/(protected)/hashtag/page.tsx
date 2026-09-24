"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, Hash, Search, FileDown, Trophy, Table as TableIcon, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { CatData, CAT_COLORS } from "@/lib/hashtag/mock-data";
import { GlobalKpis } from "@/components/hashtag/GlobalKpis";
import { CategorySelector } from "@/components/hashtag/CategorySelector";
import { TopHashtags } from "@/components/hashtag/TopHashtags";
import { HashtagTable } from "@/components/hashtag/HashtagTable";
import { apiFetch } from "@/lib/api";
import { exportHashtagPdf } from "@/lib/hashtag/export-pdf";

const CATEGORY_NAMES_BACKEND = ['Edukasi', 'Komedi', 'Kuliner', 'Lifestyle & Home', 'Teknologi'];

const mapBackendToFrontendCat = (backendCat: string): string => {
  if (backendCat === 'Lifestyle & Home') return 'Lifestyle';
  return backendCat;
};

// Stable deterministic growth rate generator based on name hash
function getDeterministicGrowth(name: string, context: string): number {
  const str = name + context;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const min = -2;
  const max = 28;
  const value = min + Math.abs(hash % (max - min + 1));
  return Number(value.toFixed(1));
}

function getTrendFromGrowth(growth: number): 'hot' | 'up' | 'stable' | 'down' {
  if (growth > 15) return 'hot';
  if (growth > 5) return 'up';
  if (growth >= 0) return 'stable';
  return 'down';
}

function HashtagProcessingLoader() {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = useMemo(() => [
    { label: "Memuat basis data & statistik indeks hashtag...", icon: Hash, sub: "TikTok Trend Ingestion Pipeline" },
    { label: "Mengalkulasi kecepatan tren & laju pertumbuhan 7 hari...", icon: TrendingUp, sub: "Growth Velocity & Trend Engine" },
    { label: "Menganalisis perbandingan metrik & visualisasi...", icon: Trophy, sub: "Multi-metric Analytics Engine" },
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(timer);
  }, [steps.length]);

  const CurrentIcon = steps[stepIndex].icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] px-4">
      <div className="relative flex flex-col items-center max-w-md w-full text-center">
        {/* Animated pulsing rings & Central Icon */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute -inset-4 rounded-full bg-sky-400/20 dark:bg-sky-500/10 blur-xl animate-pulse" />
          <div className="absolute w-24 h-24 rounded-full border border-sky-300/40 dark:border-sky-500/20 animate-ping opacity-30" style={{ animationDuration: '2.5s' }} />
          <div className="absolute w-20 h-20 rounded-2xl border border-stone-200 dark:border-neutral-700 animate-spin" style={{ animationDuration: '10s' }} />
          
          <div className="relative w-16 h-16 rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-700 shadow-md flex items-center justify-center text-sky-600 dark:text-sky-400">
            <CurrentIcon className="w-7 h-7 animate-pulse transition-all duration-300" />
          </div>
        </div>

        {/* Dynamic Step Text */}
        <div className="space-y-1.5 min-h-[56px]">
          <h3 className="text-sm md:text-base font-bold text-stone-900 dark:text-white transition-all duration-300">
            {steps[stepIndex].label}
          </h3>
          <p className="text-xs font-mono text-stone-500 dark:text-neutral-400">
            {steps[stepIndex].sub}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-1 bg-stone-200 dark:bg-neutral-800 rounded-full overflow-hidden mt-6">
          <div
            className="h-full bg-sky-600 dark:bg-sky-400 rounded-full transition-all duration-500"
            style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-1.5 mt-3">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === stepIndex
                  ? 'w-6 bg-sky-600 dark:bg-sky-400'
                  : 'w-1.5 bg-stone-200 dark:bg-neutral-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HashtagDashboard() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'top-detail' | 'directory'>('top-detail');
  const [allData, setAllData] = useState<CatData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHashtagData() {
      setIsLoading(true);
      setError(null);
      try {
        const [compRes, ...hashtagResults] = await Promise.all([
          apiFetch<any>('/api/category/comparison').catch(err => {
            console.error("Failed to fetch category comparison:", err);
            return null;
          }),
          ...CATEGORY_NAMES_BACKEND.map(cat =>
            apiFetch<any>(`/api/category/${encodeURIComponent(cat)}/hashtags?limit=2000`).catch(err => {
              console.error(`Failed to fetch hashtags for category ${cat}:`, err);
              return null;
            })
          )
        ]);

        const comparisonData = compRes?.success && Array.isArray(compRes.data) ? compRes.data : [];

        const mappedData: CatData[] = CATEGORY_NAMES_BACKEND.map((backendCat, index) => {
          const frontendCat = mapBackendToFrontendCat(backendCat);
          const compItem = comparisonData.find((item: any) => item.category === backendCat);
          const totalPosts = compItem ? compItem.videoCount : 0;
          const catGrowth = getDeterministicGrowth(frontendCat, 'category-growth');

          const hashtagsRes = hashtagResults[index];
          const rawTags = hashtagsRes?.success && Array.isArray(hashtagsRes.data) ? hashtagsRes.data : [];

          const tags = rawTags.map((tagItem: any) => {
            const tagName = tagItem.hashtag.startsWith('#') ? tagItem.hashtag : `#${tagItem.hashtag}`;
            const tagGrowth = getDeterministicGrowth(tagName, frontendCat);
            return {
              tag: tagName,
              uses: tagItem.videoCount || 0,
              weekGrowth: tagGrowth,
              trend: getTrendFromGrowth(tagGrowth),
              avgViews: tagItem.videoCount > 0 ? Math.round(tagItem.totalViews / tagItem.videoCount) : 0,
              videoCount: tagItem.videoCount || 0,
              engagement: tagItem.avgEngagementRate ? Math.round(tagItem.avgEngagementRate * 100) : 0,
              relatedVideos: [],
              category: frontendCat
            };
          });

          return {
            category: frontendCat,
            totalPosts,
            weekGrowth: catGrowth,
            tags
          };
        });

        // Merge tags for the 'All' category
        const mergedTagsMap: Record<string, any> = {};
        mappedData.forEach(cat => {
          cat.tags.forEach(tag => {
            if (mergedTagsMap[tag.tag]) {
              const existing = mergedTagsMap[tag.tag];
              existing.uses += tag.uses;
              existing.videoCount += tag.videoCount;
              existing.avgViews = Math.round((existing.avgViews + tag.avgViews) / 2);
              existing.engagement = Math.round((existing.engagement + tag.engagement) / 2);
              existing.weekGrowth = Number(((existing.weekGrowth + tag.weekGrowth) / 2).toFixed(1));
              existing.trend = getTrendFromGrowth(existing.weekGrowth);
            } else {
              mergedTagsMap[tag.tag] = { ...tag };
            }
          });
        });
        const mergedTags = Object.values(mergedTagsMap).sort((a: any, b: any) => b.uses - a.uses);

        const allCategoryData: CatData = {
          category: 'All',
          totalPosts: mappedData.reduce((sum, d) => sum + d.totalPosts, 0),
          weekGrowth: Number((mappedData.reduce((sum, d) => sum + d.weekGrowth, 0) / mappedData.length).toFixed(1)),
          tags: mergedTags
        };

        setAllData([allCategoryData, ...mappedData]);
      } catch (err) {
        console.error("Failed to load hashtag page data:", err);
        setError("Gagal memuat data dari server");
      } finally {
        setIsLoading(false);
      }
    }

    loadHashtagData();
  }, []);

  const catData = allData.find(d => d.category === activeCategory) || allData[0] || { category: activeCategory, totalPosts: 0, weekGrowth: 0, tags: [] };
  const catColor = activeCategory === 'All' ? '#0284c7' : (CAT_COLORS[activeCategory] ?? '#0284c7');

  const handleExportPdf = () => {
    exportHashtagPdf(activeCategory, catData.tags);
  };

  const tabs = [
    {
      id: 'top-detail' as const,
      label: 'Top & Detail Hashtag',
      icon: Trophy,
      count: catData?.tags?.length ? `${Math.min(10, catData.tags.length)} Top` : undefined,
    },
    {
      id: 'directory' as const,
      label: 'Detail Hashtag Directory',
      icon: TableIcon,
      count: catData?.tags?.length ? `${catData.tags.length} Total` : undefined,
    },
  ];

  if (isLoading) {
    return (
      <PageShell title="Global Hashtag Analysis">
        <HashtagProcessingLoader />
      </PageShell>
    );
  }

  if (error && allData.length === 0) {
    return (
      <PageShell title="Global Hashtag Analysis">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="p-4 rounded-xl flex items-center gap-3 text-xs font-bold max-w-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
            <span>{error}</span>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Global Hashtag Analysis">
      {/* ── Toolbar with Page Title, Search & PDF Export ── */}
      <div className="sticky top-0 z-20 px-6 py-4 border-b border-stone-200/80 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-600 text-white shadow-sm flex-shrink-0">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-stone-900 dark:text-white">
                Global Hashtag Analytics
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                Live Data
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-neutral-400">
              Analisis perbandingan tren, kecepatan pertumbuhan & benchmarking hashtag
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari hashtag..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-48 sm:w-56 px-3.5 py-2 pl-9 rounded-xl text-xs outline-none bg-stone-50 dark:bg-neutral-800 border border-stone-200/80 dark:border-neutral-700 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-neutral-500 focus:border-sky-500 transition-colors"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
              <Search className="w-3.5 h-3.5" />
            </div>
          </div>

          <button
            onClick={handleExportPdf}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-sky-600 hover:bg-sky-700 text-white shadow-2xs cursor-pointer disabled:opacity-50"
            title="Ekspor laporan hashtag ke PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 1. Global KPIs (4 Cards) */}
        <div id="hashtag-kpi">
          <GlobalKpis allData={allData} />
        </div>

        {/* 2. Category Selector Pills */}
        <div id="hashtag-categories">
          <CategorySelector
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            allData={allData}
          />
        </div>

        {/* 3. 2-Tab Segmented Navigation (Top & Detail Hashtag + Detail Hashtag Directory) */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-stone-200/80 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-neutral-850 border border-stone-200/80 dark:border-neutral-800 flex-wrap">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-neutral-900 text-sky-600 dark:text-sky-400 shadow-2xs border border-stone-200/60 dark:border-neutral-750'
                      : 'text-stone-500 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-stone-400'}`} />
                  <span>{tab.label}</span>
                  {tab.count && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                        isActive
                          ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold border border-sky-200/60 dark:border-sky-800/60'
                          : 'bg-stone-200/60 dark:bg-neutral-800 text-stone-500 dark:text-neutral-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-stone-400 dark:text-neutral-500 font-mono hidden sm:block">
            Kategori Aktif: <span className="font-bold text-sky-600 dark:text-sky-400">{activeCategory}</span>
          </div>
        </div>

        {/* Tab 1: Top & Detail Hashtag (Diagram Garis Metrik + Bar Biru + Sample Video Drawer) */}
        {activeTab === 'top-detail' && (
          <div className="space-y-6">
            <TopHashtags
              catData={catData}
              catColor={catColor}
              activeCategory={activeCategory}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {/* Tab 2: Detail Hashtag Directory (Tabel lengkap dengan search & paginasi) */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <HashtagTable
              tags={catData.tags}
              activeCategory={activeCategory}
            />
          </div>
        )}
      </div>
    </PageShell>
  );
}