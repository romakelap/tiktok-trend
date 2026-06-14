"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  BarChart2,
  Flame,
  Hash,
  Layers,
  Target,
} from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import {
  CategoryComparison,
  CategoryDetail,
  CategoryDetailEmpty,
  CategoryRadarChart,
  DashboardToolbar,
  BasicInformation,
  SectionLabel,
  SectionNav,
  TrendingHashtagsLeaderboard,
  TopViralVideosLeaderboard,
  VideoDetailDrawer,
} from "@/components/dashboard";
import { CATEGORIES, PERIOD_LABELS, BACKEND_CATEGORY_MAP } from "@/lib/dashboard/mock-data";
import type { Category, CategoryId, PeriodKey } from "@/lib/dashboard/types";
import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";

function periodToDays(period: PeriodKey): number {
  return parseInt(period, 10);
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<PeriodKey>("30");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [categoriesData, setCategoriesData] = useState<Category[]>(CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  // New global view states
  const [trendingHashtags, setTrendingHashtags] = useState<any[]>([]);
  const [isLoadingHashtags, setIsLoadingHashtags] = useState(true);
  const [topVideos, setTopVideos] = useState<any[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [selectedVideoId, setSelectedVideoId] = useState<string | number | null>(null);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setIsSummaryLoading(true);
    setIsLoadingHashtags(true);
    setIsLoadingVideos(true);

    try {
      const days = periodToDays(period);

      const [compRes, summaryRes, hashRes, videosRes] = await Promise.all([
        apiFetch<any>(API_ENDPOINTS.category.comparison).catch(() => null),
        apiFetch<any>(API_ENDPOINTS.dashboard.summary).catch(() => null),
        apiFetch<any>(`${API_ENDPOINTS.hashtags.trending}?limit=15`).catch(() => null),
        apiFetch<any>(API_ENDPOINTS.videos.top).catch(() => null),
        // keep engagement trend fetch (unused in UI but harmless)
        apiFetch<any>(`${API_ENDPOINTS.dashboard.engagementTrend}?days=${days}`).catch(() => null),
      ]);

      // Category comparison → categoriesData
      if (compRes?.success && Array.isArray(compRes.data)) {
        const mapped = compRes.data.map((item: any) => {
          const backendName = item.category;
          const meta = BACKEND_CATEGORY_MAP[backendName];
          if (!meta) return null;
          const staticCat = CATEGORIES.find((c) => c.id === meta.id);
          return {
            id: meta.id,
            label: meta.label,
            Ico: meta.Ico,
            color: meta.color,
            tint: meta.tint,
            videos: item.videoCount ?? 0,
            views: item.totalViews ?? 0,
            likes: item.totalLikes ?? 0,
            comments: item.totalComments ?? 0,
            engagement: Number((item.avgEngagementRate * 100).toFixed(2)),
            viralProb: item.avgViralScore ?? 0,
            revenue: item.totalGmvLocal ?? 0,
            topHashtags: item.topHashtag ? [item.topHashtag] : (staticCat?.topHashtags || []),
            topKeywords: staticCat?.topKeywords || [],
            bestTime: item.bestTime || staticCat?.bestTime || "",
            insight: staticCat?.insight || "",
          };
        }).filter(Boolean);
        if (mapped.length > 0) setCategoriesData(mapped as Category[]);
      }

      // Dashboard summary
      if (summaryRes?.success) setSummaryData(summaryRes.data);

      // Trending hashtags
      if (hashRes?.success && Array.isArray(hashRes.data)) {
        setTrendingHashtags(hashRes.data);
      } else {
        setTrendingHashtags([]);
      }

      // Top videos
      if (videosRes?.success && Array.isArray(videosRes.data)) {
        setTopVideos(videosRes.data.slice(0, 10));
      } else {
        setTopVideos([]);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setIsLoading(false);
      setIsSummaryLoading(false);
      setIsLoadingHashtags(false);
      setIsLoadingVideos(false);
    }
  }, [period]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const selectedCategoryData = selectedCategory
    ? (categoriesData.find((c) => c.id === selectedCategory) ?? null)
    : null;

  const handleSelectCategory = (id: CategoryId) => {
    setSelectedCategory((prev) => (prev === id ? null : id));
    window.setTimeout(() => {
      document
        .getElementById("category-detail")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // Radar data — derived from categoriesData (no extra fetch needed)
  const radarData = categoriesData.map((c) => ({
    id:         c.id,
    label:      c.label,
    color:      c.color,
    views:      c.views,
    engagement: c.engagement,
    viralProb:  c.viralProb,
    revenue:    c.revenue,
    videos:     c.videos,
  }));

  const periodLabel = PERIOD_LABELS[period];

  return (
    <PageShell title="Global Analysis">
      <DashboardToolbar
        period={period}
        onPeriodChange={setPeriod}
        onRefresh={loadDashboardData}
      />
      <SectionNav />

      <div
        className="p-6 space-y-8"
        style={{ fontFamily: "'DM Sans',sans-serif" }}
      >
        {/* ── 1. Global Info KPIs ── */}
        <section id="kpi" className="scroll-mt-36">
          <SectionLabel
            icon={Activity}
            title="Global Information"
            subtitle={`Periode: ${periodLabel}`}
          />
          <BasicInformation summaryData={summaryData} loading={isSummaryLoading} />
        </section>

        {/* ── 2. Category Comparison Bar Chart ── */}
        <section id="category" className="scroll-mt-36">
          <SectionLabel
            icon={Layers}
            title="Category Comparison"
            subtitle="Bandingkan performa semua kategori · klik untuk detail"
          />
          <CategoryComparison
            onSelectCategory={handleSelectCategory}
            selectedCategory={selectedCategory}
            categories={categoriesData}
          />
        </section>

        {/* ── 3. Category Profile Radar ── */}
        <section id="radar" className="scroll-mt-36">
          <SectionLabel
            icon={BarChart2}
            title="Category Profile Radar"
            subtitle="5 dimensi performa per kategori (normalized) · helicopter view"
          />
          <CategoryRadarChart
            categories={radarData}
            loading={isLoading}
          />
        </section>

        {/* ── 4. Trending Hashtags Cross-Category ── */}
        <section id="trending-hash" className="scroll-mt-36">
          <SectionLabel
            icon={Hash}
            title="Trending Hashtags"
            subtitle="Top 15 hashtag global · ranking berdasarkan trending score"
          />
          <TrendingHashtagsLeaderboard
            data={trendingHashtags}
            loading={isLoadingHashtags}
          />
        </section>

        {/* ── 5. Top Viral Videos Global ── */}
        <section id="top-videos" className="scroll-mt-36">
          <SectionLabel
            icon={Flame}
            title="Top Viral Videos"
            subtitle="10 video dengan views & engagement tertinggi secara global"
          />
          <TopViralVideosLeaderboard
            data={topVideos}
            loading={isLoadingVideos}
            onVideoClick={(id) => setSelectedVideoId(id)}
          />
        </section>

        {/* ── 6. Category Detail (on demand) ── */}
        <section id="category-detail" className="scroll-mt-36">
          {selectedCategoryData ? (
            <>
              <SectionLabel
                icon={Target}
                title="Category Detail"
                subtitle={`Detail performa: ${selectedCategoryData.label}`}
              />
              <CategoryDetail
                category={selectedCategoryData}
                onClose={() => setSelectedCategory(null)}
              />
            </>
          ) : (
            <CategoryDetailEmpty />
          )}
        </section>
      </div>
      {/* Video Detail Drawer */}
      {selectedVideoId !== null && (
        <VideoDetailDrawer
          videoId={selectedVideoId}
          onClose={() => setSelectedVideoId(null)}
        />
      )}
    </PageShell>
  );
}
