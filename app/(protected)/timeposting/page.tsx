'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import {
  CategoryFilterBar,
  HeatmapChart,
  OptimizationPanel,
  DayHourPerformanceTable,
  VideoListByTimeSlot,
} from '@/components/timeposting';
import { apiFetch } from '@/lib/api';
import { AlertCircle, FileDown, Clock, Calendar, Video as VideoIcon, Zap, Sparkles, Layers } from 'lucide-react';
import { exportTimePostingPdf } from '@/lib/timeposting/export-pdf';

const mapFrontendToBackendCat = (frontendCat: string): string => {
  if (frontendCat === 'Lifestyle') return 'Lifestyle & Home';
  return frontendCat;
};

function TimePostingProcessingLoader() {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = useMemo(() => [
    { label: "Mengumpulkan data waktu publikasi & statistik penonton...", icon: Clock, sub: "TikTok Time Ingestion Engine" },
    { label: "Mengalkulasi matriks distribusi 7 hari x 24 jam...", icon: Calendar, sub: "7x24 Matrix Distribution Pipeline" },
    { label: "Menentukan jam emas (peak hours) & hari terbaik...", icon: Zap, sub: "Peak Performance Optimization" },
    { label: "Menyusun agregasi cuplikan video per slot waktu...", icon: Layers, sub: "Time-Slot Video Aggregator" },
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

export default function TimePostingDashboard() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'heatmap' | 'performance' | 'videos'>('heatmap');
  const [cells, setCells] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleExportPdf = () => {
    if (activeCategory === 'All') {
      alert("Silakan pilih salah satu kategori spesifik terlebih dahulu sebelum mengekspor ke PDF!");
      return;
    }
    exportTimePostingPdf(activeCategory, cells, videos);
  };

  useEffect(() => {
    async function loadPostingTimeData() {
      setIsLoading(true);
      setError(null);
      try {
        const backendCat = mapFrontendToBackendCat(activeCategory);
        
        const heatmapUrl = activeCategory === 'All'
          ? '/api/dashboard/posting/heatmap'
          : `/api/category/${encodeURIComponent(backendCat)}/posting-time?limit=2000`;
          
        const videosUrl = activeCategory === 'All'
          ? '/api/videos?page=0&size=100'
          : `/api/category/${encodeURIComponent(backendCat)}/top-videos?limit=100`;

        const [heatmapRes, videosRes] = await Promise.all([
          apiFetch<any>(heatmapUrl).catch(err => {
            console.error("Failed to fetch heatmap cells:", err);
            return null;
          }),
          apiFetch<any>(videosUrl).catch(err => {
            console.error("Failed to fetch top videos:", err);
            return null;
          })
        ]);

        if (heatmapRes && heatmapRes.success && Array.isArray(heatmapRes.data)) {
          setCells(heatmapRes.data);
        } else {
          setCells([]);
        }

        if (videosRes && videosRes.success && videosRes.data) {
          const rawVideos = Array.isArray(videosRes.data)
            ? videosRes.data
            : Array.isArray(videosRes.data.items)
            ? videosRes.data.items
            : [];
          setVideos(rawVideos);
        } else {
          setVideos([]);
        }
      } catch (err) {
        console.error("Failed to load posting time dashboard:", err);
        setError("Gagal memuat data dari server");
      } finally {
        setIsLoading(false);
      }
    }

    loadPostingTimeData();
  }, [activeCategory]);

  const tabs = [
    {
      id: 'heatmap' as const,
      label: 'Heatmap & Rekomendasi Jadwal',
      icon: Clock,
      count: '7x24 Jam',
    },
    {
      id: 'performance' as const,
      label: 'Performa Hari & Jam',
      icon: Calendar,
      count: 'Analisis',
    },
    {
      id: 'videos' as const,
      label: 'Contoh Video per Slot Waktu',
      icon: VideoIcon,
      count: videos.length ? `${videos.length} Video` : undefined,
    },
  ];

  return (
    <PageShell title="Global Posting Time Analysis">
      {/* ── Toolbar with Page Title, Search & PDF Export ── */}
      <div className="sticky top-0 z-20 px-6 py-4 border-b border-stone-200/80 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-600 text-white shadow-sm flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-stone-900 dark:text-white">
                Global Posting Time Analytics
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                Live Data
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-neutral-400">
              Analisis waktu posting optimal berdasarkan views, engagement rate, dan video viral
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportPdf}
            disabled={activeCategory === 'All' || isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-sky-600 hover:bg-sky-700 text-white shadow-2xs cursor-pointer disabled:opacity-50"
            title={activeCategory === 'All' ? 'Pilih kategori spesifik terlebih dahulu untuk ekspor PDF' : 'Ekspor laporan waktu posting ke PDF'}
          >
            <FileDown className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 1. Category Filter Bar */}
        <div id="timeposting-filter">
          <CategoryFilterBar selected={activeCategory} onChange={setActiveCategory} />
        </div>

        {/* 2. Modular Tab Switcher */}
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

        {isLoading ? (
          <TimePostingProcessingLoader />
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <div className="p-4 rounded-xl flex items-center gap-3 text-xs font-bold max-w-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
              <span>{error}</span>
            </div>
          </div>
        ) : (
          <>
            {/* Tab 1: Heatmap & Rekomendasi Jadwal */}
            {activeTab === 'heatmap' && (
              <div className="space-y-6">
                <div id="timeposting-optimization">
                  <OptimizationPanel activeCategory={activeCategory} cells={cells} />
                </div>
                <div id="timeposting-heatmap" className="w-full max-w-full overflow-hidden">
                  <HeatmapChart activeCategory={activeCategory} cells={cells} />
                </div>
              </div>
            )}

            {/* Tab 2: Performa Hari & Jam */}
            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div id="timeposting-table">
                  <DayHourPerformanceTable activeCategory={activeCategory} cells={cells} />
                </div>
              </div>
            )}

            {/* Tab 3: Video per Slot Waktu */}
            {activeTab === 'videos' && (
              <div className="space-y-6">
                <div id="timeposting-videos">
                  <VideoListByTimeSlot activeCategory={activeCategory} videos={videos} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}