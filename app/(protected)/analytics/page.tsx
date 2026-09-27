"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDown,
  BarChart2,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Download,
  Eye,
  Flame,
  Globe,
  Layers,
  MoreHorizontal,
  RefreshCw,
  Search,
  Settings2,
  Sparkles,
  Tag,
  TrendingUp,
  UserCheck,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { PageShell } from "@/components/layout/PageShell";
import {
  AnalyticsSetupModal,
  ContentPerformanceTable,
  KpiRow,
  OptimalScheduleWindow,
  VideoDetailModal,
} from "@/components/analytics";
import {
  CONTENT_PERFORMANCE,
  HISTORICAL,
  TOP_SLOTS,
} from "@/lib/analytics/mock-data";
import type {
  SortKey,
  ContentRow,
} from "@/lib/analytics/types";
import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { exportAnalyticsPdf } from "@/lib/analytics/export-pdf";
import { resolveAvatarUrl } from "@/lib/utils";
import { formatNum, formatPct } from "@/lib/analytics/formatters";
import { PERIOD_LABELS } from "@/lib/analytics/meta";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("last_30_days");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("viralProb");
  const [selectedVideo, setSelectedVideo] = useState<ContentRow | null>(null);

  // Account selector states
  const [accountScope, setAccountScope] = useState<"my_account" | "competitors" | "benchmark">("my_account");
  const [selectedMainAccount, setSelectedMainAccount] = useState<any | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>("all");
  const [competitorHandles, setCompetitorHandles] = useState<string[]>([
    "glad2glow.id",
    "somethincofficial",
    "tanamanhias.id",
    "kebun.bali",
  ]);
  const [activeCluster, setActiveCluster] = useState<string>("Beauty & Personal Care #01");
  const [selectedCompetitors, setSelectedCompetitors] = useState<any[]>([]);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);

  // Forecast chart series visibility
  const [visibleSeries, setVisibleSeries] = useState({
    views: true,
    likes: true,
    comments: true,
    shares: true,
  });

  const toggleSeries = (key: keyof typeof visibleSeries) => {
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Category trend active filter
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Dynamic API states
  const [summaryData, setSummaryData] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any[]>(HISTORICAL);
  const [contentRows, setContentRows] = useState<ContentRow[]>(CONTENT_PERFORMANCE);
  const [loadingData, setLoadingData] = useState(false);

  // Fetch accounts and analytics data on mount / period change
  const loadAnalyticsData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [accRes, summaryRes, histRes, perfRes, compRes] = await Promise.all([
        apiFetch<any>(API_ENDPOINTS.accounts.list).catch(() => null),
        apiFetch<any>(API_ENDPOINTS.dashboard.summary).catch(() => null),
        apiFetch<any>(API_ENDPOINTS.analytics.historical).catch(() => null),
        apiFetch<any>(API_ENDPOINTS.analytics.contentPerformance).catch(() => null),
        apiFetch<any>(API_ENDPOINTS.accounts.competitors).catch(() => null),
      ]);

      if (accRes?.success && Array.isArray(accRes.data)) {
        setAccounts(accRes.data);
        if (accRes.data.length > 0 && !selectedMainAccount) {
          setSelectedMainAccount(accRes.data[0]);
        }
      }

      if (compRes?.success && Array.isArray(compRes.data)) {
        setSelectedCompetitors(compRes.data);
      }

      if (summaryRes?.success && summaryRes.data) {
        setSummaryData(summaryRes.data);
      }

      if (histRes?.success && Array.isArray(histRes.data) && histRes.data.length > 0) {
        setHistoricalData(histRes.data);
      }

      if (perfRes?.success && Array.isArray(perfRes.data) && perfRes.data.length > 0) {
        setContentRows(perfRes.data);
      }
    } catch (err) {
      console.error("Error loading analytics data:", err);
    } finally {
      setLoadingData(false);
    }
  }, [selectedMainAccount]);

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  // Reactive filtered content rows based on accountScope, selectedCompetitor, and activeCategory
  const filteredContentRows = useMemo(() => {
    let list = contentRows.length > 0 ? contentRows : CONTENT_PERFORMANCE;

    // 1. Account Scope Filter
    if (accountScope === "my_account") {
      const own = list.filter((r) => r.accountType === "own" || r.account === (selectedMainAccount?.username || "imploracosmetics"));
      if (own.length > 0) list = own;
      else list = list.filter((r) => r.accountType === "own");
      list = list.map((r) => ({
        ...r,
        account: selectedMainAccount?.username || "imploracosmetics",
      }));
    } else if (accountScope === "competitors") {
      let comps = list.filter((r) => r.accountType === "competitor" || r.accountType === "inspiration");
      if (comps.length === 0) comps = CONTENT_PERFORMANCE.filter((r) => r.accountType === "competitor" || r.accountType === "inspiration");
      if (selectedCompetitor !== "all") {
        const filteredComp = comps.filter((r) => r.account === selectedCompetitor);
        if (filteredComp.length > 0) list = filteredComp;
        else list = comps;
      } else {
        list = comps;
      }
    }

    // 2. Category Filter
    if (activeCategory && activeCategory !== "all") {
      const catLower = activeCategory.toLowerCase();
      const catFiltered = list.filter((r) => {
        const titleLower = (r.title || "").toLowerCase();
        if (catLower === "beauty") return titleLower.includes("bunga") || titleLower.includes("tanaman") || titleLower.includes("beauty") || titleLower.includes("lip") || titleLower.includes("care") || r.clusterId === 1 || r.clusterId === 3;
        if (catLower === "kuliner") return titleLower.includes("kuliner") || titleLower.includes("asmr") || r.clusterId === 4;
        if (catLower === "komedi") return titleLower.includes("lucu") || titleLower.includes("unboxing") || r.clusterId === 2;
        if (catLower === "teknologi") return titleLower.includes("stek") || titleLower.includes("vertical") || r.clusterId === 0;
        if (catLower === "edukasi") return titleLower.includes("tips") || titleLower.includes("cara") || titleLower.includes("tour");
        return true;
      });
      if (catFiltered.length > 0) list = catFiltered;
    }

    return list;
  }, [contentRows, accountScope, selectedCompetitor, activeCategory, selectedMainAccount]);

  // Dynamic KPI Summary calculations
  const dynamicKpiSummary = useMemo(() => {
    if (!filteredContentRows || filteredContentRows.length === 0) return summaryData;

    const totalViews = filteredContentRows.reduce((acc, r) => acc + (r.views || 0), 0);
    const totalVideos = filteredContentRows.length;
    const avgEng = filteredContentRows.reduce((acc, r) => acc + (r.engagement || 0), 0) / (totalVideos || 1);
    const avgViral = filteredContentRows.reduce((acc, r) => acc + (r.viralProb || 0), 0) / (totalVideos || 1);
    const totalGmv = totalViews * 0.05 * 12500;

    return {
      totalViews,
      totalVideos,
      averageEngagementRate: avgEng / 100,
      avgViralScore: avgViral,
      totalGmvLocal: totalGmv,
    };
  }, [filteredContentRows, summaryData]);

  // Multi-line chart dataset
  const chartData = useMemo(() => {
    const list = historicalData.length > 0 ? historicalData : HISTORICAL;
    const multiplier = accountScope === "competitors" ? 1.35 : accountScope === "benchmark" ? 1.75 : 1.0;

    return list.map((d, i) => ({
      day: d.date ? `Hari+${i + 1}` : `Hari+${i + 1}`,
      views: Math.round(((d.views || 100_000_000) * multiplier) / 1_000_000), // in M
      likes: Math.round(((d.likes || 50_000) * multiplier) / 1_000), // in K
      comments: Math.round((d.comments || 400) * multiplier),
      shares: Number((((d.shares || 5000) * multiplier) / 1000).toFixed(2)), // in K
    }));
  }, [historicalData, accountScope]);

  // Dynamic Sub-Metrics (below chart)
  const subMetrics = useMemo(() => {
    if (!filteredContentRows || filteredContentRows.length === 0) {
      return { views: "125M", likes: "91K", comments: "446", shares: "5.53K" };
    }
    const len = filteredContentRows.length;
    const avgV = Math.round(filteredContentRows.reduce((s, r) => s + (r.views || 0), 0) / len);
    const avgL = Math.round(filteredContentRows.reduce((s, r) => s + (r.likes || 0), 0) / len);
    const avgC = Math.round(filteredContentRows.reduce((s, r) => s + (r.comments || 0), 0) / len);
    const avgS = Math.round(filteredContentRows.reduce((s, r) => s + (r.shares || 0), 0) / len);

    return {
      views: formatNum(avgV),
      likes: formatNum(avgL),
      comments: avgC.toLocaleString("id-ID"),
      shares: formatNum(avgS),
    };
  }, [filteredContentRows]);

  // Export PDF Handler
  const handleExportPdf = () => {
    exportAnalyticsPdf({
      period,
      accountFilter: selectedMainAccount?.username || "@imploracosmetics",
      historicalData: historicalData.length > 0 ? historicalData : HISTORICAL,
      performanceData: contentRows.length > 0 ? contentRows : CONTENT_PERFORMANCE,
      heatmapMatrix: [],
      topSlots: TOP_SLOTS,
      hashtagRecommendations: [],
      optimalSchedule: [],
      keywordRecommendations: [],
      contentRecs: [],
    });
  };

  // Last refresh timestamp
  const now = new Date();
  const refreshTime = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <PageShell title="Account & Competitor Analytics">
      {/* ── 1. Header Toolbar (Sticky) ── */}
      <div className="sticky top-0 z-30 bg-white dark:bg-neutral-950 border-b border-stone-200 dark:border-neutral-800 px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-stone-900 dark:bg-white text-white dark:text-stone-900 flex items-center justify-center font-bold text-xs flex-shrink-0">
            TT
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-neutral-400">
            <span className="font-semibold text-stone-900 dark:text-white">TikTrend BI</span>
            <span>/</span>
            <span>Analytics</span>
            <span>/</span>
            <span className="text-stone-700 dark:text-neutral-200 font-medium">
              Account &amp; Competitor Analytics
            </span>
          </div>
          <span className="ml-1 px-2 py-0.5 text-[9.5px] font-bold font-mono text-stone-600 dark:text-neutral-400 border border-stone-300 dark:border-neutral-700 rounded">
            PROD_v2.6
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Period selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setPeriodOpen((v) => !v)}
              className="h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-2 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 text-stone-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>{PERIOD_LABELS[period] || "Last 30 Days"}</span>
              <ChevronDown className="w-3 h-3 text-stone-400 ml-0.5" />
            </button>
            {periodOpen && (
              <div className="absolute right-0 top-full mt-1.5 z-50 rounded-xl overflow-hidden w-44 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 shadow-lg py-1">
                {Object.entries(PERIOD_LABELS).map(([k, l]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      setPeriod(k);
                      setPeriodOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 text-left text-xs hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <span className={period === k ? "font-bold text-stone-900 dark:text-white" : "text-stone-600 dark:text-neutral-400"}>
                      {l}
                    </span>
                    {period === k && <Check className="w-3.5 h-3.5 text-sky-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Konfigurasi button */}
          <button
            type="button"
            onClick={() => setIsSetupModalOpen(true)}
            className="h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 text-stone-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5 text-stone-400" />
            <span>Konfigurasi</span>
          </button>

          {/* Export PDF primary button */}
          <button
            type="button"
            onClick={handleExportPdf}
            className="h-8 px-3.5 rounded-lg text-xs font-bold flex items-center gap-1.5 bg-[#00a3ad] dark:bg-[#00f2fe] text-white dark:text-stone-950 hover:opacity-90 transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* ── 2. Page Content Container ── */}
      <div className="p-6 space-y-5">
        {/* Title Area */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-black text-stone-900 dark:text-white tracking-tight">
                Account &amp; Competitor Analytics
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                Pro ML
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 text-[9.5px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                DIAGNOSTIK PREDIKTIF AKTIF
              </span>
            </div>
            <p className="text-xs text-stone-400 dark:text-neutral-500">
              Diagnostik performa, tren prediktif, &amp; komparasi kompetitor TikTok Intelligence.
            </p>
          </div>
          <span className="text-[11px] font-mono text-stone-400 dark:text-neutral-500">
            LAST_REFRESH {refreshTime} WIB
          </span>
        </div>

        {/* ── 3. Account Selector Banner Card ── */}
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 overflow-hidden shadow-xs">
          {/* Top row */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-stone-200 dark:border-neutral-800 flex-wrap gap-4">
            <div className="flex items-center gap-3.5">
              {/* Account Avatar */}
              <div className="w-11 h-11 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-black text-base flex items-center justify-center flex-shrink-0">
                {accountScope === "my_account" ? "I" : accountScope === "competitors" ? "C" : "B"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-stone-900 dark:text-white tracking-tight">
                    {accountScope === "my_account"
                      ? `@${selectedMainAccount?.username || "imploracosmetics"}`
                      : accountScope === "competitors"
                      ? `@${selectedCompetitor === "all" ? "kompetitor_terlacak" : selectedCompetitor}`
                      : "Benchmark & Komparasi Industri"}
                  </h2>
                  <span className={`px-2 py-0.5 text-[9.5px] font-bold rounded ${
                    accountScope === "my_account"
                      ? "text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800"
                      : accountScope === "competitors"
                      ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800"
                      : "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800"
                  }`}>
                    {accountScope === "my_account"
                      ? "Akun Utama Anda"
                      : accountScope === "competitors"
                      ? "Kompetitor Terlacak"
                      : "Head-to-Head Benchmark"}
                  </span>
                </div>
                <p className="text-xs text-stone-400 dark:text-neutral-500 mt-0.5">
                  {accountScope === "my_account"
                    ? "Implora Cosmetics Indonesia • Beauty & Personal Care • 2.4M Followers"
                    : accountScope === "competitors"
                    ? "Monitoring Performa Video & Metrik Kompetitor Niche Beauty & Lifestyle"
                    : "Analisis Komparatif Performa Akun Utama vs Rata-Rata Kompetitor vs Benchmark Industri"}
                </p>
              </div>
            </div>

            {/* Segmented pills on right */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-neutral-800 p-1 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setAccountScope("my_account")}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  accountScope === "my_account"
                    ? "bg-white dark:bg-neutral-900 text-stone-900 dark:text-white shadow-xs font-bold"
                    : "text-stone-500 dark:text-neutral-400 hover:text-stone-700"
                }`}
              >
                ● Akun Saya
              </button>
              <button
                type="button"
                onClick={() => setAccountScope("competitors")}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  accountScope === "competitors"
                    ? "bg-white dark:bg-neutral-900 text-stone-900 dark:text-white shadow-xs font-bold"
                    : "text-stone-500 dark:text-neutral-400 hover:text-stone-700"
                }`}
              >
                Kompetitor
              </button>
              <button
                type="button"
                onClick={() => setAccountScope("benchmark")}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  accountScope === "benchmark"
                    ? "bg-white dark:bg-neutral-900 text-stone-900 dark:text-white shadow-xs font-bold"
                    : "text-stone-500 dark:text-neutral-400 hover:text-stone-700"
                }`}
              >
                Benchmark &amp; Komparasi
              </button>
            </div>
          </div>

          {/* Sub-strip for Competitor Selector when in competitor mode */}
          {accountScope === "competitors" && (
            <div className="px-5 py-2.5 border-b border-stone-100 dark:border-neutral-800 bg-amber-50/30 dark:bg-amber-950/10 flex items-center gap-2 overflow-x-auto text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-300 flex-shrink-0 text-[11px] uppercase tracking-wider">PILIH KOMPETITOR:</span>
              <button
                type="button"
                onClick={() => setSelectedCompetitor("all")}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCompetitor === "all"
                    ? "bg-amber-600 text-white dark:bg-amber-500 dark:text-stone-950 font-bold shadow-xs"
                    : "bg-white dark:bg-neutral-800 text-stone-600 dark:text-neutral-300 hover:bg-amber-100/50"
                }`}
              >
                Semua Kompetitor
              </button>
              {competitorHandles.map((handle) => (
                <button
                  key={handle}
                  type="button"
                  onClick={() => setSelectedCompetitor(handle)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCompetitor === handle
                      ? "bg-amber-600 text-white dark:bg-amber-500 dark:text-stone-950 font-bold shadow-xs"
                      : "bg-white dark:bg-neutral-800 text-stone-600 dark:text-neutral-300 hover:bg-amber-100/50"
                  }`}
                >
                  @{handle}
                </button>
              ))}
            </div>
          )}

          {/* Bottom info bar */}
          <div className="px-5 py-2.5 bg-stone-50/50 dark:bg-neutral-900/50 flex items-center justify-between flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-600 dark:text-neutral-300 font-semibold">
              <Zap className="w-3.5 h-3.5 text-sky-500" />
              <span>Ikhtisar Kinerja &amp; Proyeksi AI (Real-time ML Model)</span>
            </div>

            <span className="text-xs text-stone-400 dark:text-neutral-500 font-medium">
              Klaster Industri: <strong className="text-stone-700 dark:text-neutral-300">{activeCluster}</strong>
            </span>
          </div>
        </div>

        {/* ── 4. 5 Core KPI Metric Row ── */}
        <KpiRow data={historicalData} summaryData={dynamicKpiSummary} />

        {/* ── 5. Category Trend Filter Strip (7H) ── */}
        <div className="rounded-xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 px-5 py-3 flex items-center justify-between flex-wrap gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wide flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-sky-500" />
              TREN KATEGORI (7H):
            </span>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              {[
                { id: "all", label: "Semua Kategori", count: "125p" },
                { id: "beauty", label: "Beauty", count: "31p" },
                { id: "komedi", label: "Komedi", count: "32p" },
                { id: "kuliner", label: "Kuliner", count: "32p" },
                { id: "teknologi", label: "Teknologi", count: "31p" },
                { id: "edukasi", label: "Edukasi", count: "30p" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400 border border-sky-200 dark:border-sky-800 font-bold"
                      : "bg-stone-50 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400 hover:bg-stone-100"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[10px] font-mono opacity-70">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-stone-500 dark:text-neutral-400 italic">
            <strong className="text-stone-700 dark:text-neutral-200 not-italic">Korelasi Strategis:</strong>{" "}
            Beauty &amp; Kuliner mendominasi rasio konversi TikTok Shop
          </p>
        </div>

        {/* ── 6. Two-Column Main Body (2/3 Left, 1/3 Right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── LEFT COLUMN (2/3) ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Card A: Proyeksi Metrik Konten (7 Hari) Recharts Multi-line */}
            <div className="rounded-xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 p-5 shadow-xs">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-neutral-800 flex-wrap gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-sky-500" />
                    Proyeksi Metrik Konten (7 Hari)
                  </h3>
                  <p className="text-xs text-stone-400 dark:text-neutral-500">
                    Grafik gabungan multi-line views (kiri) &amp; interaksi likes/komentar/shares (kanan)
                  </p>
                </div>

                {/* Series Legend Toggles */}
                <div className="flex items-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => toggleSeries("views")}
                    className={`flex items-center gap-1.5 transition-opacity cursor-pointer ${visibleSeries.views ? "opacity-100" : "opacity-30"}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                    <span className="text-stone-600 dark:text-neutral-300 font-medium">Views</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSeries("likes")}
                    className={`flex items-center gap-1.5 transition-opacity cursor-pointer ${visibleSeries.likes ? "opacity-100" : "opacity-30"}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-stone-600 dark:text-neutral-300 font-medium">Likes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSeries("comments")}
                    className={`flex items-center gap-1.5 transition-opacity cursor-pointer ${visibleSeries.comments ? "opacity-100" : "opacity-30"}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-stone-600 dark:text-neutral-300 font-medium">Komentar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSeries("shares")}
                    className={`flex items-center gap-1.5 transition-opacity cursor-pointer ${visibleSeries.shares ? "opacity-100" : "opacity-30"}`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                    <span className="text-stone-600 dark:text-neutral-300 font-medium">Shares</span>
                  </button>
                </div>
              </div>

              {/* Chart */}
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 12, right: 12, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgb(120,113,108)" }} />
                    <YAxis yAxisId="views" orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#0ea5e9" }} tickFormatter={(v) => `${v}M`} />
                    <YAxis yAxisId="rates" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#10b981" }} tickFormatter={(v) => `${v}K`} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div className="rounded-lg p-3 bg-stone-900 text-white shadow-xl text-xs font-mono space-y-1">
                            <div className="font-bold border-b border-stone-700 pb-1 mb-1">{d.day}</div>
                            {visibleSeries.views && <div className="text-sky-400">Views: {d.views}M</div>}
                            {visibleSeries.likes && <div className="text-emerald-400">Likes: {d.likes}K</div>}
                            {visibleSeries.comments && <div className="text-amber-400">Komentar: {d.comments}</div>}
                            {visibleSeries.shares && <div className="text-violet-400">Shares: {d.shares}K</div>}
                          </div>
                        );
                      }}
                    />
                    {visibleSeries.views && (
                      <Line yAxisId="views" type="monotone" dataKey="views" stroke="#0ea5e9" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                    )}
                    {visibleSeries.likes && (
                      <Line yAxisId="rates" type="monotone" dataKey="likes" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                    )}
                    {visibleSeries.comments && (
                      <Line yAxisId="rates" type="monotone" dataKey="comments" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                    )}
                    {visibleSeries.shares && (
                      <Line yAxisId="rates" type="monotone" dataKey="shares" stroke="#8b5cf6" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* 4 Sub-Metric Cards in Footer */}
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-stone-200 dark:divide-neutral-800 border-t border-stone-200 dark:border-neutral-800 pt-4 mt-2">
                <div className="px-3 py-2">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-bold text-stone-400 uppercase">RATA-RATA VIEWS</span>
                    <span className="text-[8px] font-bold px-1 rounded bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400">Harian</span>
                  </div>
                  <p className="text-xl font-black text-stone-900 dark:text-white">{subMetrics.views} <span className="text-xs font-normal text-stone-400">/ video</span></p>
                  <p className="text-[9.5px] text-stone-400 mt-0.5">Akumulasi tayangan ...</p>
                </div>
                <div className="px-3 py-2">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-bold text-stone-400 uppercase">RATA-RATA LIKES</span>
                    <span className="text-[8px] font-bold px-1 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">Interaksi</span>
                  </div>
                  <p className="text-xl font-black text-stone-900 dark:text-white">{subMetrics.likes} <span className="text-xs font-normal text-stone-400">/ video</span></p>
                  <p className="text-[9.5px] text-stone-400 mt-0.5">Interaksi apresiasi au...</p>
                </div>
                <div className="px-3 py-2">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-bold text-stone-400 uppercase">RATA-RATA KOMENTAR</span>
                    <span className="text-[8px] font-bold px-1 rounded bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">Diskusi</span>
                  </div>
                  <p className="text-xl font-black text-stone-900 dark:text-white">{subMetrics.comments} <span className="text-xs font-normal text-stone-400">/ video</span></p>
                  <p className="text-[9.5px] text-stone-400 mt-0.5">Keterlibatan koment...</p>
                </div>
                <div className="px-3 py-2">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-bold text-stone-400 uppercase">RATA-RATA SHARES</span>
                    <span className="text-[8px] font-bold px-1 rounded bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400">Amplifikasi</span>
                  </div>
                  <p className="text-xl font-black text-stone-900 dark:text-white">{subMetrics.shares} <span className="text-xs font-normal text-stone-400">/ video</span></p>
                  <p className="text-[9.5px] text-stone-400 mt-0.5">Distribusi &amp; pembagi...</p>
                </div>
              </div>
            </div>

            {/* Card B: Matriks Performa Konten Video Table */}
            <ContentPerformanceTable
              rows={filteredContentRows}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onRowClick={(v) => setSelectedVideo(v)}
            />
          </div>

          {/* ── RIGHT COLUMN (1/3) ── */}
          <div className="space-y-5">
            {/* Focused Segment Card */}
            <div className="rounded-xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-bold tracking-widest text-stone-400 dark:text-neutral-500 uppercase">
                  FOCUSED SEGMENT
                </span>
                <button type="button" className="text-stone-400 hover:text-stone-600 dark:hover:text-neutral-200">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
                  Beauty &amp; Personal Care
                </h3>
              </div>

              {/* 2-col stats */}
              <div className="grid grid-cols-2 gap-3 bg-stone-50/60 dark:bg-neutral-800/40 p-3 rounded-lg border border-stone-100 dark:border-neutral-800">
                <div>
                  <p className="text-[10px] text-stone-400 dark:text-neutral-500 mb-0.5">Total views</p>
                  <p className="text-xl font-black text-stone-900 dark:text-white">23.3B</p>
                  <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">+18.6%</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 dark:text-neutral-500 mb-0.5">Engagement</p>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">1.91%</p>
                  <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">+0.22%</p>
                </div>
              </div>

              {/* Recommended action box (amber) */}
              <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold text-xs">
                  <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <span>Recommended action</span>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  Thumbnail swatch &amp; ASMR celup lip cream meningkatkan CTR hingga <strong>2.4x</strong>. Tingkatkan frekuensi unggah pada window prima.
                </p>
              </div>

              <div>
                <a
                  href="#category"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  <span>Open deep dive</span>
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                </a>
              </div>
            </div>

            {/* Best Posting Window Card */}
            <OptimalScheduleWindow />

            {/* Top Content Signals Card */}
            <div className="rounded-xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wide">
                  Top Content Signals
                </span>
                <a
                  href="/hashtag"
                  className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
                >
                  Lihat Semua &gt;
                </a>
              </div>

              <div className="space-y-2">
                {[
                  { tag: "#imploracosmetics", vol: "177.6M", delta: "+6.1%", isPos: true },
                  { tag: "#lipcreammatte", vol: "29.5M", delta: "Stable", isPos: false },
                  { tag: "#beautytips", vol: "14.2M", delta: "Stable", isPos: false },
                ].map((s) => (
                  <div
                    key={s.tag}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-stone-50/60 dark:bg-neutral-800/40 border border-stone-100 dark:border-neutral-800 text-xs"
                  >
                    <span className="font-bold text-sky-600 dark:text-sky-400">{s.tag}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-stone-900 dark:text-white">{s.vol}</span>
                      <span className={`text-[10px] font-bold ${s.isPos ? "text-emerald-600 dark:text-emerald-400" : "text-stone-400"}`}>
                        {s.delta}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Detail Modal */}
      {selectedVideo && (
        <VideoDetailModal
          videoId={selectedVideo.id}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Analytics Configuration Modal */}
      <AnalyticsSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        currentMainAccount={selectedMainAccount?.username || "imploracosmetics"}
        currentCompetitors={competitorHandles}
        currentCluster={activeCluster}
        availableAccounts={accounts}
        onSave={(cfg) => {
          if (cfg.mainAccount) {
            setSelectedMainAccount({ username: cfg.mainAccount });
          }
          if (cfg.competitors && cfg.competitors.length > 0) {
            setCompetitorHandles(cfg.competitors);
          }
          if (cfg.cluster) {
            setActiveCluster(cfg.cluster);
          }
        }}
      />
    </PageShell>
  );
}
