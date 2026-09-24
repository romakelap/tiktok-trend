"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, Layers, Target } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import {
  CategoryComparison,
  CategoryDetail,
  CategoryDetailEmpty,
  DashboardToolbar,
  BasicInformation,
  SectionLabel,
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
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(
    null
  );
  const [categoriesData, setCategoriesData] = useState<Category[]>(CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [selectedVideoId, setSelectedVideoId] = useState<string | number | null>(
    null
  );

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setIsSummaryLoading(true);

    try {
      const days = periodToDays(period);

      const [compRes, summaryRes] = await Promise.all([
        apiFetch<any>(API_ENDPOINTS.category.comparison).catch(() => null),
        apiFetch<any>(API_ENDPOINTS.dashboard.summary).catch(() => null),
        apiFetch<any>(
          `${API_ENDPOINTS.dashboard.engagementTrend}?days=${days}`
        ).catch(() => null),
      ]);

      // Category comparison → categoriesData
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
              topHashtags: item.topHashtag
                ? [item.topHashtag]
                : staticCat?.topHashtags || [],
              topKeywords: staticCat?.topKeywords || [],
              bestTime: item.bestTime || staticCat?.bestTime || "",
              insight: staticCat?.insight || "",
            };
          })
          .filter(Boolean);
        if (mapped.length > 0) setCategoriesData(mapped as Category[]);
      }

      // Dashboard summary
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
            title="Global Ecosystem Overview"
            subtitle={`Agregasi database TikTok BI · Periode: ${periodLabel}`}
          />
          <BasicInformation summaryData={summaryData} loading={isSummaryLoading} />
        </section>

        {/* ── 2. Category Performance Matrix (Dual-Axis) ── */}
        <section id="category" className="scroll-mt-36">
          <SectionLabel
            icon={Layers}
            title="Sector Performance Matrix (Reach, Content & Virality)"
            subtitle="Kombinasi grafik Batang (Total Views) serta Garis (Total Konten, Engagement Rate, dan Peluang Viral)"
          />
          <CategoryComparison
            onSelectCategory={handleSelectCategory}
            selectedCategory={selectedCategory}
            categories={categoriesData}
          />
        </section>

        {/* ── 3. Category Deep Dive (on demand) ── */}
        <section id="category-detail" className="scroll-mt-36">
          {selectedCategoryData ? (
            <>
              <SectionLabel
                icon={Target}
                title="Category Deep Dive Analysis"
                subtitle={`Eksplorasi mendalam performa: ${selectedCategoryData.label}`}
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
