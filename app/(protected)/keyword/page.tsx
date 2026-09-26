'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Type, Search, AlertCircle, FileDown, Trophy, Table as TableIcon, Sparkles, TrendingUp } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { KeywordItem, KeywordType, Trend } from '@/lib/keyword/mock-data';
import { CategorySelector } from '@/components/keyword/CategorySelector';
import { KeywordKpis } from '@/components/keyword/KeywordKpis';
import { FrequencyChart } from '@/components/keyword/FrequencyChart';
import { Top50Table } from '@/components/keyword/Top50Table';
import { apiFetch } from '@/lib/api';
import { exportKeywordPdf } from '@/lib/keyword/export-pdf';

function KeywordProcessingLoader() {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = useMemo(() => [
    { label: "Memuat dataset kata kunci & caption hooks...", icon: Type, sub: "spaCy & KeyBERT Ingestion Pipeline" },
    { label: "Menganalisis frekuensi penggunaan & laju tren...", icon: TrendingUp, sub: "Usage Frequency & Velocity Engine" },
    { label: "Menyusun perbandingan performa & direktori...", icon: Trophy, sub: "Top Keywords Benchmark Aggregator" },
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(timer);
  }, [steps.length]);

  const CurrentIcon = steps[stepIndex].icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
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

export default function KeywordDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('Edukasi');
  const [activeTab, setActiveTab] = useState<'top10' | 'table'>('top10');
  const [searchQuery, setSearchQuery] = useState('');
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleExportPdf = () => {
    if (!selectedCategory) {
      alert("Silakan pilih salah satu kategori terlebih dahulu sebelum mengekspor ke PDF!");
      return;
    }
    exportKeywordPdf(selectedCategory, keywords);
  };

  useEffect(() => {
    async function loadKeywordData() {
      if (!selectedCategory) {
        setKeywords([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const backendCat = selectedCategory === 'Lifestyle' ? 'Lifestyle & Home' : selectedCategory;
        const res = await apiFetch<any>(`/api/category/${encodeURIComponent(backendCat)}/keywords?limit=50`);
        
        if (res && res.success && Array.isArray(res.data)) {
          const mapped: KeywordItem[] = res.data.map((item: any) => {
            let type: KeywordType = 'hook';
            const dbType = item.keywordType ? item.keywordType.toLowerCase() : '';
            if (dbType === 'verb' || dbType === 'action') {
              type = 'action';
            } else if (dbType === 'adjective' || dbType === 'emotion') {
              type = 'emotion';
            } else if (dbType === 'brand' || dbType === 'entity') {
              type = 'brand';
            }
            
            let trend: Trend = 'stable';
            if (item.rank <= 3) {
              trend = 'hot';
            } else if (item.rank <= 8) {
              trend = 'up';
            } else if (item.rank > 20) {
              trend = 'down';
            }

            const videoCount = item.videoCount || 1;
            const avgViews = item.videoCount > 0 ? Math.round(item.totalViews / item.videoCount) : 0;
            const engagement = (item.avgEngagementRate || 0) * 100;

            return {
              rank: item.rank,
              keyword: item.keyword,
              type,
              frequency: item.totalFrequency || item.videoCount || 0,
              avgViews,
              engagement: parseFloat(engagement.toFixed(1)),
              videoCount: item.videoCount || 0,
              trend
            };
          });
          setKeywords(mapped);
        } else {
          setKeywords([]);
        }
      } catch (err) {
        console.error("Failed to fetch keywords:", err);
        setError("Gagal memuat data keyword dari server");
      } finally {
        setIsLoading(false);
      }
    }

    loadKeywordData();
  }, [selectedCategory]);

  const top1 = keywords[0];
  const avgEng = keywords.length ? (keywords.reduce((a, b) => a + b.engagement, 0) / keywords.length) : 0;
  const totalVideos = keywords.reduce((a, b) => a + b.videoCount, 0);
  const topViews = keywords[0]?.avgViews || 0;
  const sparkFreq = keywords.slice(0, 8).map(k => k.frequency);

  const tabs = [
    {
      id: 'top10' as const,
      label: 'Top 10 Keywords & Frekuensi',
      icon: Trophy,
      count: keywords.length ? `${Math.min(10, keywords.length)} Top` : undefined,
    },
    {
      id: 'table' as const,
      label: 'Direktori Top 50 Keywords',
      icon: TableIcon,
      count: keywords.length ? `${keywords.length} Total` : undefined,
    },
  ];

  return (
    <PageShell title="Global Keyword Analysis">
      {/* ── Toolbar with Page Title, Search & PDF Export ── */}
      <div className="sticky top-0 z-20 px-6 py-4 border-b border-stone-200/80 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-600 text-white shadow-sm flex-shrink-0">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-stone-900 dark:text-white">
                Global Keyword Analytics
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                Live Data
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-neutral-400">
              Analisis kata kunci populer, caption hooks & korelasi performa per kategori
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari keyword..."
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
            disabled={!selectedCategory || isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-sky-600 hover:bg-sky-700 text-white shadow-2xs cursor-pointer disabled:opacity-50"
            title="Ekspor laporan kata kunci ke PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 1. Category Selector */}
        <div id="keyword-categories">
          <CategorySelector
            selected={selectedCategory}
            onSelect={cat => {
              setSelectedCategory(cat);
              setSearchQuery('');
            }}
          />
        </div>

        {isLoading ? (
          <KeywordProcessingLoader />
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <div className="p-4 rounded-xl flex items-center gap-3 text-xs font-bold max-w-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
              <span>{error}</span>
            </div>
          </div>
        ) : (
          <>
            {/* 2. Keyword KPIs (4 Cards) */}
            <div id="keyword-kpi">
              <KeywordKpis
                topKeyword={top1?.keyword || ''}
                sparkFreq={sparkFreq}
                avgEng={avgEng}
                totalVideos={totalVideos}
                peakViews={topViews}
              />
            </div>

            {/* 3. 2-Tab Navigation */}
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
                Kategori Aktif: <span className="font-bold text-sky-600 dark:text-sky-400">{selectedCategory}</span>
              </div>
            </div>

            {/* 4. Tab Contents */}
            {activeTab === 'top10' && (
              <div className="space-y-6">
                <FrequencyChart keywords={keywords} />
              </div>
            )}

            {activeTab === 'table' && (
              <div className="space-y-6">
                <Top50Table keywords={keywords} searchQuery={searchQuery} />
              </div>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}