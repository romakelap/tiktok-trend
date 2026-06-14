'use client';

import React, { useState, useEffect } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import {
  CategoryFilterBar,
  HeatmapChart,
  OptimizationPanel,
  DayHourPerformanceTable,
  VideoListByTimeSlot,
} from '@/components/timeposting';
import { apiFetch } from '@/lib/api';
import { TOKENS } from '@/lib/design-tokens';
import { AlertCircle, FileDown } from 'lucide-react';
import { exportTimePostingPdf } from '@/lib/timeposting/export-pdf';

const mapFrontendToBackendCat = (frontendCat: string): string => {
  if (frontendCat === 'Lifestyle') return 'Lifestyle & Home';
  return frontendCat;
};

export default function TimePostingDashboard() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [cells, setCells] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleExportPdf = () => {
    if (activeCategory === 'All') {
      alert("Silakan pilih salah satu kategori terlebih dahulu sebelum mengekspor ke PDF!");
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
          // /api/videos returns a PageResponse with items, /api/category/.../top-videos returns an array
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

  return (
    <PageShell title="Global Posting Time Analysis">
      {/* ── Toolbar with Page Title and Description ── */}
      <div
        className="sticky top-0 z-20 px-6 py-4 border-b flex items-center justify-between gap-4 flex-wrap"
        style={{
          background: 'rgba(248, 248, 246, 0.95)',
          backdropFilter: 'blur(20px)',
          borderColor: TOKENS.divider
        }}
      >
        <div>
          <h1 className="text-lg font-black flex items-center gap-2" style={{ color: TOKENS.text }}>
            Global Posting Time Analysis
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-black text-white"
              style={{ background: '#111', boxShadow: '0 0 10px rgba(0,0,0,0.18)' }}
            >
              Live
            </span>
          </h1>
          <p className="text-xs" style={{ color: TOKENS.textMuted }}>
            Analisis waktu posting optimal berdasarkan views, engagement rate, dan video viral.
          </p>
        </div>

        {/* ── Export Button ── */}
        <div className="flex items-center">
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105 active:scale-95 duration-200"
            style={{
              background: activeCategory === 'All' ? '#cbd5e1' : '#111',
              color: activeCategory === 'All' ? '#64748b' : '#fff',
              boxShadow: activeCategory === 'All' ? 'none' : '0 4px 14px rgba(0,0,0,0.18)',
              cursor: activeCategory === 'All' ? 'not-allowed' : 'pointer',
              border: 'none',
            }}
            title={activeCategory === 'All' ? 'Pilih kategori terlebih dahulu untuk ekspor PDF' : 'Ekspor data ke PDF'}
          >
            <FileDown className="w-4 h-4" strokeWidth={2.5} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 w-full max-w-full overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div id="timeposting-filter">
          <CategoryFilterBar selected={activeCategory} onChange={setActiveCategory} />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: '#111 transparent #111 #111' }} />
            <p className="text-sm font-black" style={{ color: TOKENS.textMuted }}>Memuat analisis waktu posting...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <div
              className="p-4 rounded-xl flex items-center gap-3 text-sm font-bold max-w-md"
              style={{ background: TOKENS.negativeBg, border: `1px solid rgba(185,28,28,0.2)`, color: TOKENS.negative }}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
              <span>{error}</span>
            </div>
          </div>
        ) : (
          <>
            <div id="timeposting-heatmap" className="w-full max-w-full overflow-hidden">
              <HeatmapChart activeCategory={activeCategory} cells={cells} />
            </div>
            <div id="timeposting-optimization">
              <OptimizationPanel activeCategory={activeCategory} cells={cells} />
            </div>
            <div id="timeposting-table">
              <DayHourPerformanceTable activeCategory={activeCategory} cells={cells} />
            </div>
            <div id="timeposting-videos">
              <VideoListByTimeSlot activeCategory={activeCategory} videos={videos} />
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </PageShell>
  );
}