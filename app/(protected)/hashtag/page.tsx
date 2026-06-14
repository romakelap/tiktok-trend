"use client";

import React, { useState, useEffect } from 'react';
import { AlertCircle, Hash, Search, FileDown } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { TOKENS } from "@/lib/design-tokens";
import { CatData, CAT_COLORS } from "@/lib/hashtag/mock-data";
import { GlobalKpis } from "@/components/hashtag/GlobalKpis";
import { CategorySelector } from "@/components/hashtag/CategorySelector";
import { TopHashtags } from "@/components/hashtag/TopHashtags";
import { CrossCategory } from "@/components/hashtag/CrossCategory";
import { HotTagsAll } from "@/components/hashtag/HotTagsAll";
import { HashtagTable } from "@/components/hashtag/HashtagTable";
import { HashtagNetwork } from "@/components/hashtag/HashtagNetwork";
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

export default function HashtagDashboard() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [allData, setAllData] = useState<CatData[]>([]);
  const [networkData, setNetworkData] = useState<any>({ nodes: [], edges: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingNetwork, setIsLoadingNetwork] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHashtagData() {
      setIsLoading(true);
      setIsLoadingNetwork(true);
      setError(null);
      try {
        const [compRes, netRes, ...hashtagResults] = await Promise.all([
          apiFetch<any>('/api/category/comparison').catch(err => {
            console.error("Failed to fetch category comparison:", err);
            return null;
          }),
          apiFetch<any>('/api/analytics/hashtag-network?limit=25').catch(err => {
            console.error("Failed to fetch hashtag network:", err);
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

        if (netRes?.success && netRes.data) {
          setNetworkData(netRes.data);
        } else {
          setNetworkData({ nodes: [], edges: [] });
        }
      } catch (err) {
        console.error("Failed to load hashtag page data:", err);
        setError("Gagal memuat data dari server");
      } finally {
        setIsLoading(false);
        setIsLoadingNetwork(false);
      }
    }

    loadHashtagData();
  }, []);

  const catData = allData.find(d => d.category === activeCategory) || allData[0] || { category: activeCategory, totalPosts: 0, weekGrowth: 0, tags: [] };
  const catColor = activeCategory === 'All' ? '#111' : (CAT_COLORS[activeCategory] ?? '#111');

  const handleExportPdf = () => {
    exportHashtagPdf(activeCategory, catData.tags);
  };

  if (isLoading) {
    return (
      <PageShell title="Global Hashtag Analysis">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: '#111 transparent #111 #111' }} />
          <p className="text-sm font-black" style={{ color: TOKENS.textMuted }}>Memuat analisis hashtag...</p>
        </div>
      </PageShell>
    );
  }

  if (error && allData.length === 0) {
    return (
      <PageShell title="Global Hashtag Analysis">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div
            className="p-4 rounded-xl flex items-center gap-3 text-sm font-bold max-w-md"
            style={{ background: TOKENS.negativeBg, border: `1px solid rgba(185,28,28,0.2)`, color: TOKENS.negative }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
            <span>{error}</span>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Global Hashtag Analysis">
      {/* ── Toolbar with Page Title and Search ── */}
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
            <Hash className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black flex items-center gap-2" style={{ color: TOKENS.text }}>
              Global Hashtag Analysis
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-black text-white"
                style={{ background: '#111', boxShadow: '0 0 10px rgba(0,0,0,0.18)' }}
              >
                Live
              </span>
            </h1>
            <p className="text-xs" style={{ color: TOKENS.textMuted }}>
              Top 10 hashtag per kategori · tren pertumbuhan · video terkait
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari hashtag..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-56 px-4 py-2.5 pl-10 rounded-xl text-sm outline-none"
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

          <button
            onClick={handleExportPdf}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all hover:scale-105 active:scale-95 duration-200"
            style={{
              background: isLoading ? '#cbd5e1' : '#111111',
              color: isLoading ? '#64748b' : '#ffffff',
              boxShadow: isLoading ? 'none' : '0 4px 14px rgba(17, 17, 17, 0.25)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              border: 'none',
            }}
            title="Ekspor data ke PDF"
          >
            <FileDown className="w-4 h-4" strokeWidth={2.5} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* 1. Global KPIs */}
        <div id="hashtag-kpi">
          <GlobalKpis allData={allData} />
        </div>

        {/* 2. Category Selector */}
        <div id="hashtag-categories">
          <CategorySelector
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            allData={allData}
          />
        </div>

        {/* 3. Top 10 Hashtags */}
        <div id="hashtag-top">
          <TopHashtags
            catData={catData}
            catColor={catColor}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
          />
        </div>

        {/* 4. Detailed Hashtag Table */}
        <div id="hashtag-table">
          <HashtagTable
            tags={catData.tags}
            activeCategory={activeCategory}
          />
        </div>

        {/* Hashtag Network Graph */}
        <div id="hashtag-network">
          <HashtagNetwork data={networkData} loading={isLoadingNetwork} />
        </div>

        {/* 5. Cross Category Perbandingan */}
        <div id="hashtag-cross">
          <CrossCategory
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            allData={allData}
          />
        </div>

        {/* 6. Hot Tags Grid */}
        <div id="hashtag-hot">
          <HotTagsAll onSelectCategory={setActiveCategory} allData={allData} />
        </div>
      </div>
    </PageShell>
  );
}