'use client';

import React, { useState, useEffect } from 'react';
import { Type, Search, AlertCircle, FileDown } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { TOKENS } from '@/lib/design-tokens';
import { KeywordItem, KeywordType, Trend } from '@/lib/keyword/mock-data';
import { CategorySelector } from '@/components/keyword/CategorySelector';
import { KeywordKpis } from '@/components/keyword/KeywordKpis';
import { FrequencyChart } from '@/components/keyword/FrequencyChart';
import { EngagementScatter } from '@/components/keyword/EngagementScatter';
import { TypeDonut } from '@/components/keyword/TypeDonut';
import { TrendOverview } from '@/components/keyword/TrendOverview';
import { EngagementHeatmap } from '@/components/keyword/EngagementHeatmap';
import { Top50Table } from '@/components/keyword/Top50Table';
import { apiFetch } from '@/lib/api';
import { exportKeywordPdf } from '@/lib/keyword/export-pdf';

export default function KeywordDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeTab, setActiveTab] = useState<'charts' | 'table'>('charts');
  const [searchQuery, setSearchQuery] = useState('');
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <PageShell title="Global Keyword Analysis">
      {/* ── Toolbar with Page Title and Tab/Search controls ── */}
      <div
        className="sticky top-0 z-20 px-6 py-4 border-b flex items-center justify-between gap-4 flex-wrap"
        style={{
          background: 'rgba(248, 248, 246, 0.95)',
          backdropFilter: 'blur(20px)',
          borderColor: TOKENS.divider
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#111', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
          >
            <Type className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black flex items-center gap-2" style={{ color: TOKENS.text }}>
              Global Keyword Analysis
            </h1>
            <p className="text-xs" style={{ color: TOKENS.textMuted }}>
              Analisis keyword & caption hook per kategori
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Tab toggle */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.06)', borderRadius: 9, padding: 3, gap: 2 }}>
            {(['charts', 'table'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 7,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 700,
                  background: activeTab === tab ? TOKENS.card : 'transparent',
                  color: activeTab === tab ? TOKENS.text : TOKENS.textMuted,
                  boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {tab === 'charts' ? 'Charts' : 'Top 50'}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-52 px-4 py-2 pl-10 rounded-xl text-sm outline-none"
              style={{
                background: TOKENS.input,
                border: `1px solid ${TOKENS.inputBorder}`,
                color: TOKENS.text,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: TOKENS.textMuted }}>
              <Search className="w-4 h-4" />
            </div>
          </div>

          {/* Export PDF Button */}
          <button
            onClick={handleExportPdf}
            disabled={!selectedCategory || isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105 active:scale-95 duration-200"
            style={{
              background: !selectedCategory ? '#cbd5e1' : '#111111',
              color: !selectedCategory ? '#64748b' : '#ffffff',
              boxShadow: !selectedCategory ? 'none' : '0 4px 14px rgba(17, 17, 17, 0.25)',
              cursor: !selectedCategory ? 'not-allowed' : 'pointer',
              border: 'none',
            }}
            title={!selectedCategory ? 'Pilih kategori terlebih dahulu untuk ekspor PDF' : 'Ekspor data ke PDF'}
          >
            <FileDown className="w-4 h-4" strokeWidth={2.5} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* Category selector */}
        <div id="keyword-categories">
          <CategorySelector selected={selectedCategory} onSelect={cat => { setSelectedCategory(cat); setSearchQuery(''); }} />
        </div>

        {!selectedCategory ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-8 text-center rounded-2xl border border-dashed bg-white shadow-sm"
               style={{ borderColor: TOKENS.divider }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-gray-400"
                 style={{ background: 'rgba(0,0,0,0.03)', color: TOKENS.textMuted }}>
              <Type className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black" style={{ color: TOKENS.text }}>Silakan Pilih Kategori Terlebih Dahulu</h3>
              <p className="text-xs max-w-sm mt-1" style={{ color: TOKENS.textMuted }}>
                Pilih salah satu kategori di atas untuk menganalisis keyword & caption hook serta mengunduh laporan PDF.
              </p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: '#111 transparent #111 #111' }} />
            <p className="text-sm font-black" style={{ color: TOKENS.textMuted }}>Memuat analisis keyword...</p>
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
            {/* Stat cards / KPIs */}
            <div id="keyword-kpi">
              <KeywordKpis
                topKeyword={top1?.keyword || ''}
                sparkFreq={sparkFreq}
                avgEng={avgEng}
                totalVideos={totalVideos}
                peakViews={topViews}
              />
            </div>

            {activeTab === 'charts' ? (
              <>
                {/* Row 1 — Frequency + Scatter */}
                <div id="keyword-charts-row1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <FrequencyChart keywords={keywords} />
                  <EngagementScatter keywords={keywords} />
                </div>

                {/* Row 2 — Donut + Trend + Heatmap */}
                <div id="keyword-charts-row2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                  <TypeDonut keywords={keywords} />
                  <TrendOverview keywords={keywords} />
                  <EngagementHeatmap keywords={keywords} />
                </div>
              </>
            ) : (
              <div id="keyword-table">
                <Top50Table keywords={keywords} searchQuery={searchQuery} />
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 3px; }
      `}</style>
    </PageShell>
  );
}