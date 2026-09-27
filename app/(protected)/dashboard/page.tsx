"use client";

import { useCallback, useEffect, useState } from "react";

import { PageShell } from "@/components/layout/PageShell";
import {
  CategoryComparison,
  CategoryDetail,
  CategoryDetailEmpty,
  DashboardToolbar,
  BasicInformation,
  SectionNav,
  VideoDetailDrawer,
} from "@/components/dashboard";
import {
  CATEGORIES,
  PERIOD_LABELS,
  BACKEND_CATEGORY_MAP,
} from "@/lib/dashboard/mock-data";
import type { Category, CategoryId, PeriodKey } from "@/lib/dashboard/types";
import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";

function periodToDays(period: PeriodKey): number {
  return parseInt(period, 10);
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<PeriodKey>("30");
  const [activeTab, setActiveTab] = useState<"overview" | "category" | "deepdive">("category");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [categoriesData, setCategoriesData] = useState<Category[]>(CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [selectedVideoId, setSelectedVideoId] = useState<string | number | null>(null);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setIsSummaryLoading(true);

    try {
      const days = periodToDays(period);

      const [compRes, summaryRes] = await Promise.all([
        apiFetch<any>(API_ENDPOINTS.category.comparison).catch(() => null),
        apiFetch<any>(API_ENDPOINTS.dashboard.summary).catch(() => null),
        apiFetch<any>(`${API_ENDPOINTS.dashboard.engagementTrend}?days=${days}`).catch(() => null),
      ]);

      if (compRes?.success && Array.isArray(compRes.data)) {
        const mapped = compRes.data
          .map((item: any) => {
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
              topHashtags: item.topHashtag ? [item.topHashtag] : staticCat?.topHashtags || [],
              topKeywords: staticCat?.topKeywords || [],
              bestTime: item.bestTime || staticCat?.bestTime || "",
              insight: staticCat?.insight || "",
            };
          })
          .filter(Boolean);
        if (mapped.length > 0) setCategoriesData(mapped as Category[]);
      }

      if (summaryRes?.success) setSummaryData(summaryRes.data);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setIsLoading(false);
      setIsSummaryLoading(false);
    }
  }, [period]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const selectedCategoryData = selectedCategory
    ? categoriesData.find((c) => c.id === selectedCategory) ?? null
    : null;

  const handleSelectCategory = (id: CategoryId) => {
    setSelectedCategory((prev) => (prev === id ? null : id));
    window.setTimeout(() => {
      document
        .getElementById("category-detail")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const periodLabel = PERIOD_LABELS[period];

  // Last refresh time
  const now = new Date();
  const refreshTime = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <PageShell title="Global Analysis">
      <DashboardToolbar
        period={period}
        onPeriodChange={setPeriod}
        onRefresh={loadDashboardData}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="p-6 space-y-5">

        {/* ── Page Title + streaming badge ── */}
        <div id="kpi" className="scroll-mt-20 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-xl font-black text-stone-900 dark:text-white tracking-tight">
                Performa Lintas Kategori
              </h1>
              <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                STREAMING ENGINE LIVE
              </span>
            </div>
            <p className="text-xs text-stone-400 dark:text-neutral-500">
              Analisis benchmark viralitas, volume impressions, dan efisiensi interaksi TikTok Regional
            </p>
          </div>
          <span className="text-[11px] font-mono text-stone-400 dark:text-neutral-500 flex-shrink-0 mt-1">
            LAST_REFRESH {refreshTime} WIB
          </span>
        </div>

        {/* ── KPI Cards ── */}
        <BasicInformation summaryData={summaryData} loading={isSummaryLoading} />

        {/* ── Category Performance Matrix ── */}
        <section id="category" className="scroll-mt-20">
          <CategoryComparison
            onSelectCategory={handleSelectCategory}
            selectedCategory={selectedCategory}
            categories={categoriesData}
          />
        </section>

        {/* ── Category Deep Dive ── */}
        <section id="category-detail" className="scroll-mt-20">
          {selectedCategoryData ? (
            <CategoryDetail
              category={selectedCategoryData}
              onClose={() => setSelectedCategory(null)}
            />
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
