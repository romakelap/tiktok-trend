"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Award,
  Calendar,
  Layers,
  Lightbulb,
  ListChecks,
  TrendingUp,
  Sparkles,
  Hash,
  Clock,
  Key,
  DollarSign,
  Users,
  Search,
  Check,
  Loader2,
  TrendingDown,
  X,
  BrainCircuit,
  Cpu,
  ScanLine,
} from "lucide-react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { GridBg } from "@/components/layout/GridBg";
import { PageShell } from "@/components/layout/PageShell";
import { SectionLabel } from "@/components/dashboard";
import {
  AnalyticsSectionNav,
  AnalyticsToolbar,
  ContentPerformanceTable,
  CategoryHypeRanking,
  CategoryTrendLines,
  CategorySnapshotTable,
  KpiRow,
  RecommendationCard,
  RecommendationDetailDrawer,
  ScheduleHeatmap,
  TopSlotsList,
  MlHashtagRecommendations,
  MlPostingTimeRecommendations,
  MlKeywordRecommendations,
  CombinedRecommendationsChart,
  EngagementForecast,
  LSTMForecast,
  CorrelationHeatmap,
  RevenueAnalysis,
  VideoDetailModal,
} from "@/components/analytics";
import { TOKENS } from "@/lib/design-tokens";
import { PRIORITY_META } from "@/lib/analytics/meta";
import {
  CONTENT_PERFORMANCE,
  HISTORICAL,
  RECOMMENDATIONS,
  SCHEDULE_HEATMAP,
  TOP_SLOTS,
} from "@/lib/analytics/mock-data";
import type {
  Priority,
  Recommendation,
  SortKey,
  HistoricalDay,
  ContentRow,
} from "@/lib/analytics/types";
import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { exportAnalyticsPdf, type AnalyticsExportData } from "@/lib/analytics/export-pdf";

type PriorityFilter = "all" | Priority;

const PRIORITY_FILTERS: { key: PriorityFilter; label: string; solid: string }[] = [
  { key: "all", label: "Semua", solid: "#111" },
  { key: "high", label: "High", solid: PRIORITY_META.high.solid },
  { key: "medium", label: "Medium", solid: PRIORITY_META.medium.solid },
  { key: "low", label: "Low", solid: PRIORITY_META.low.solid },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "viralProb", label: "Viral Prob." },
  { key: "engagement", label: "Engagement" },
  { key: "views", label: "Views" },
];

const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("last_30_days");
  const [accountFilter, setAccountFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [sortBy, setSortBy] = useState<SortKey>("viralProb");
  const [openRec, setOpenRec] = useState<Recommendation | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<ContentRow | null>(null);

  // Setup configuration states
  const [selectedMainAccount, setSelectedMainAccount] = useState<any | null>(null);
  const [selectedCompetitors, setSelectedCompetitors] = useState<any[]>([]);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [tempMainId, setTempMainId] = useState<string>("");
  const [tempCompIds, setTempCompIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);

  // Debounce search query to avoid laggy character-by-character UI redraws
  useEffect(() => {
    if (searchInput.endsWith(" ")) {
      setSearchTerm(searchInput.trim());
      return;
    }

    const handler = setTimeout(() => {
      setSearchTerm(searchInput.trim());
    }, 450);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchTerm(searchInput.trim());
    }
  };

  // Tab and comparison states
  const [activeTab, setActiveTab] = useState<"main" | "competitors" | "comparison">("main");
  const [activeCompetitorUsername, setActiveCompetitorUsername] = useState<string>("");
  const [comparisonMetric, setComparisonMetric] = useState<"performanceScore" | "followerCountNum" | "totalViews" | "averageEngagementRate">("performanceScore");
  
  const METRIC_LABELS = {
    performanceScore: "Performance Score",
    followerCountNum: "Followers",
    totalViews: "Total Views",
    averageEngagementRate: "Engagement Rate",
  };

  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [benchmarkData, setBenchmarkData] = useState<any>(null);
  const [isLoadingComparison, setIsLoadingComparison] = useState(false);

  // Dynamic API states
  const [accounts, setAccounts] = useState<any[]>([]);

  const renderedMainAccounts = useMemo(() => {
    const matched = accounts.filter((acc: any) =>
      acc.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const selected = accounts.find((acc: any) => acc.influencerId.toString() === tempMainId);
    const list = [...matched];
    if (selected && !list.some(a => a.influencerId.toString() === selected.influencerId.toString())) {
      list.push(selected);
    }
    
    return list.sort((a, b) => {
      const aSelected = a.influencerId.toString() === tempMainId;
      const bSelected = b.influencerId.toString() === tempMainId;
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    }).slice(0, 150);
  }, [accounts, searchTerm, tempMainId]);

  const renderedCompetitors = useMemo(() => {
    const listWithoutMain = accounts.filter((acc: any) => acc.influencerId.toString() !== tempMainId);
    const matched = listWithoutMain.filter((acc: any) =>
      acc.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const selected = listWithoutMain.filter((acc: any) => tempCompIds.includes(acc.influencerId.toString()));
    
    const list = [...matched];
    selected.forEach(item => {
      if (!list.some(a => a.influencerId.toString() === item.influencerId.toString())) {
        list.push(item);
      }
    });

    return list.sort((a, b) => {
      const aChecked = tempCompIds.includes(a.influencerId.toString());
      const bChecked = tempCompIds.includes(b.influencerId.toString());
      if (aChecked && !bChecked) return -1;
      if (!aChecked && bChecked) return 1;
      return 0;
    }).slice(0, 150);
  }, [accounts, searchTerm, tempMainId, tempCompIds]);

  const filteredComparisonData = useMemo(() => {
    if (!selectedMainAccount) return [];
    const selectedIds = [
      selectedMainAccount.influencerId?.toString(),
      ...selectedCompetitors.map((c: any) => c.influencerId?.toString())
    ].filter(Boolean);
    return comparisonData.filter((item: any) =>
      selectedIds.includes(item.influencerId?.toString())
    );
  }, [comparisonData, selectedMainAccount, selectedCompetitors]);

  const computedBenchmarkData = useMemo(() => {
    if (!selectedMainAccount || filteredComparisonData.length === 0) return null;
    
    const ownAccs = filteredComparisonData.filter(
      item => item.trackingType === 'own' || item.influencerId?.toString() === selectedMainAccount.influencerId?.toString()
    );
    const compAccs = filteredComparisonData.filter(
      item => item.trackingType === 'competitor' || selectedCompetitors.some(c => c.influencerId?.toString() === item.influencerId?.toString())
    );
    
    const ownAverageScore = ownAccs.length > 0
      ? ownAccs.reduce((acc, item) => acc + (item.performanceScore || 0), 0) / ownAccs.length
      : 0;
      
    const competitorAverageScore = compAccs.length > 0
      ? compAccs.reduce((acc, item) => acc + (item.performanceScore || 0), 0) / compAccs.length
      : 0;
      
    const gapScore = ownAverageScore - competitorAverageScore;
    
    return {
      ownAverageScore,
      competitorAverageScore,
      gapScore
    };
  }, [filteredComparisonData, selectedMainAccount, selectedCompetitors]);
  const [historicalData, setHistoricalData] = useState<HistoricalDay[]>(HISTORICAL);
  const [categorySnapshotData, setCategorySnapshotData] = useState<any[]>([]);
  const [isLoadingSnapshot, setIsLoadingSnapshot] = useState(true);
  const [performanceData, setPerformanceData] = useState<ContentRow[]>(CONTENT_PERFORMANCE);
  const [optimalSchedule, setOptimalSchedule] = useState<any[]>([]);
  const [heatmapMatrix, setHeatmapMatrix] = useState<number[][]>(SCHEDULE_HEATMAP);
  const [topSlots, setTopSlots] = useState<any[]>(TOP_SLOTS);
  const [contentRecs, setContentRecs] = useState<Recommendation[]>(RECOMMENDATIONS);
  const [hashtagRecommendations, setHashtagRecommendations] = useState<any[]>([]);
  const [keywordRecommendations, setKeywordRecommendations] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [lstmForecastData, setLstmForecastData] = useState<any[]>([]);
  const [correlationData, setCorrelationData] = useState<any>({ features: [], matrix: [] });
  const [revenueData, setRevenueData] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [isLoadingForecast, setIsLoadingForecast] = useState(true);
  const [isLoadingLstm, setIsLoadingLstm] = useState(true);
  const [isLoadingCorrelation, setIsLoadingCorrelation] = useState(true);
  const [isLoadingRevenue, setIsLoadingRevenue] = useState(true);

  // Setup modal handlers
  const openSetupModal = () => {
    setSearchTerm("");
    setSearchInput("");
    if (selectedMainAccount) {
      setTempMainId(selectedMainAccount.influencerId.toString());
      setTempCompIds(selectedCompetitors.map(c => c.influencerId.toString()));
    } else {
      setTempMainId("");
      setTempCompIds([]);
    }
    setIsSetupModalOpen(true);
  };

  const handleSaveSetup = () => {
    if (!tempMainId) return;

    const mainAcc = accounts.find((acc: any) => acc.influencerId.toString() === tempMainId);
    const competitorAccs = accounts.filter((acc: any) => tempCompIds.includes(acc.influencerId.toString()));

    if (mainAcc) {
      // Start analyzing animation
      setIsAnalyzing(true);
      setAnalyzeStep(0);

      const steps = [0, 1, 2, 3];
      steps.forEach((step, i) => {
        setTimeout(() => setAnalyzeStep(step), i * 750);
      });

      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalyzeStep(0);
        setSelectedMainAccount(mainAcc);
        setSelectedCompetitors(competitorAccs);
        setAccountFilter(mainAcc.username);
        setActiveTab("main");
        setActiveCompetitorUsername(competitorAccs.length > 0 ? competitorAccs[0].username : "");
        setIsSetupModalOpen(false);

        // Persist selection in localStorage
        localStorage.setItem("analytics_main_influencer_id", tempMainId);
        localStorage.setItem("analytics_competitor_influencer_ids", JSON.stringify(tempCompIds));

        // Persist configuration in database
        apiFetch<any>("/api/accounts/configuration", {
          method: "PUT",
          body: {
            mainInfluencerId: tempMainId,
            competitorInfluencerIds: tempCompIds
          }
        }).catch(err => {
          console.error("Failed to persist account configurations on backend:", err);
        });
      }, 3200);
    }
  };

  // Clear all selected accounts and reset back to setup modal
  const handleClearAnalysis = () => {
    // Clear all state
    setSelectedMainAccount(null);
    setSelectedCompetitors([]);
    setAccountFilter("");
    setTempMainId("");
    setTempCompIds([]);
    setSearchTerm("");
    setSearchInput("");
    setActiveTab("main");
    setActiveCompetitorUsername("");

    // Clear localStorage
    localStorage.removeItem("analytics_main_influencer_id");
    localStorage.removeItem("analytics_competitor_influencer_ids");

    // Clear configuration in database
    apiFetch<any>("/api/accounts/configuration", {
      method: "PUT",
      body: {
        mainInfluencerId: null,
        competitorInfluencerIds: []
      }
    }).catch(err => {
      console.error("Failed to clear account configuration on backend:", err);
    });

    // Open setup modal so user can pick new accounts
    setIsSetupModalOpen(true);
  };

  // Fetch account configuration from backend on mount, falling back to localStorage
  useEffect(() => {
    async function loadConfiguration() {
      try {
        const res = await apiFetch<any>("/api/accounts/configuration");
        if (res?.success && res.data) {
          const mainAcc = res.data.mainAccount ? {
            username: res.data.mainAccount.uniqueId,
            influencerId: res.data.mainAccount.influencerId,
            type: res.data.mainAccount.trackingType || "inspiration",
            displayName: res.data.mainAccount.displayName || res.data.mainAccount.nickname || res.data.mainAccount.uniqueId,
            avatarUrl: res.data.mainAccount.avatarUrl || null,
          } : null;

          const competitorAccs: any[] = Array.isArray(res.data.competitorAccounts) 
            ? res.data.competitorAccounts.map((acc: any) => ({
                username: acc.uniqueId,
                influencerId: acc.influencerId,
                type: acc.trackingType || "inspiration",
                displayName: acc.displayName || acc.nickname || acc.uniqueId,
                avatarUrl: acc.avatarUrl || null,
              }))
            : [];

          if (mainAcc) {
            setSelectedMainAccount(mainAcc);
            setAccountFilter(mainAcc.username);
            setTempMainId(mainAcc.influencerId.toString());

            setSelectedCompetitors(competitorAccs);
            if (competitorAccs.length > 0) {
              setActiveCompetitorUsername(competitorAccs[0].username);
            }
            setTempCompIds(competitorAccs.map((c: any) => c.influencerId.toString()));
            setIsLoading(true);
            return;
          }
        }

        // Fallback to localStorage if database configuration is empty
        const savedMainId = localStorage.getItem("analytics_main_influencer_id");
        const savedCompIdsRaw = localStorage.getItem("analytics_competitor_influencer_ids");

        if (savedMainId) {
          // If we fallback, it will trigger setup modal which will load list dynamically
        }
        setIsSetupModalOpen(true);
      } catch (err) {
        console.error("Failed to load account configuration:", err);
        setIsSetupModalOpen(true);
      }
    }
    loadConfiguration();
  }, []);

  // Fetch accounts list from backend when search term changes
  useEffect(() => {
    async function fetchAccounts() {
      try {
        const query = searchTerm ? `search=${encodeURIComponent(searchTerm)}` : "";
        const res = await apiFetch<any>(`${API_ENDPOINTS.accounts.list}?size=100&${query}`);
        const content = (res.success && res.data && Array.isArray(res.data.content)) ? res.data.content : [];
        
        const mapped = content.map((acc: any) => ({
          username: acc.uniqueId,
          influencerId: acc.influencerId,
          type: acc.trackingType || "inspiration",
          displayName: acc.displayName || acc.nickname || acc.uniqueId,
          avatarUrl: acc.avatarUrl || null,
        }));

        setAccounts(prev => {
          const merged = [...mapped];
          if (selectedMainAccount && !merged.some(a => a.influencerId.toString() === selectedMainAccount.influencerId.toString())) {
            merged.push(selectedMainAccount);
          }
          selectedCompetitors.forEach(comp => {
            if (comp && !merged.some(a => a.influencerId.toString() === comp.influencerId.toString())) {
              merged.push(comp);
            }
          });
          return merged;
        });
      } catch (err) {
        console.error("Failed to fetch accounts:", err);
      }
    }
    fetchAccounts();
  }, [searchTerm, selectedMainAccount, selectedCompetitors]);

  // Fetch main analytics data when selectedMainAccount or period changes
  useEffect(() => {
    if (accounts.length === 0 || !selectedMainAccount) return;

    async function loadAnalyticsData() {
      setIsLoading(true);
      setIsLoadingRecommendations(true);
      setIsLoadingForecast(true);
      setIsLoadingLstm(true);
      setIsLoadingCorrelation(true);
      setIsLoadingRevenue(true);
      setIsLoadingSnapshot(true);

      const activeAcc = accounts.find((a) => a.username === accountFilter);
      const influencerId = activeAcc ? activeAcc.influencerId : null;

      try {
        // Build content-trend URL with competitor IDs
        const contentTrendMainId = influencerId || "";
        const contentTrendCompIds = selectedCompetitors.map((c: any) => c.influencerId).filter(Boolean).join(",");
        const contentTrendUrl = `${API_ENDPOINTS.analytics.contentTrend}?mainInfluencerId=${contentTrendMainId}${contentTrendCompIds ? `&competitorIds=${contentTrendCompIds}` : ""}`;

        // Fetch all analytics data concurrently including LSTM forecast
        const [histRes, perfRes, schedRes, recsRes, hashRes, keyRes, forecastRes, lstmRes, corrRes, revenueRes, snapshotRes] = await Promise.all([
          apiFetch<any[]>(`${API_ENDPOINTS.analytics.historical}?influencerId=${influencerId || ""}&periodType=${period}`).catch(() => null),
          apiFetch<any[]>(`${API_ENDPOINTS.analytics.contentPerformance}?influencerId=${influencerId || ""}`).catch(() => null),
          apiFetch<any[]>(`${API_ENDPOINTS.analytics.optimalSchedule}?influencerId=${influencerId || ""}`).catch(() => null),
          apiFetch<any[]>(`${API_ENDPOINTS.analytics.contentRecommend}?influencerId=${influencerId || ""}`).catch(() => null),
          apiFetch<any[]>(`${API_ENDPOINTS.hashtags.recommend}?accountId=${influencerId || ""}`).catch(() => null),
          apiFetch<any[]>(`${API_ENDPOINTS.summary.keywords}?influencerId=${influencerId || ""}`).catch(() => null),
          apiFetch<any[]>(contentTrendUrl).catch(() => null),
          apiFetch<any[]>(`${API_ENDPOINTS.analytics.forecast}?influencerId=${influencerId || ""}`).catch(() => null),
          apiFetch<any>(`${API_ENDPOINTS.analytics.correlation}?influencerId=${influencerId || ""}`).catch(() => null),
          apiFetch<any>(`${API_ENDPOINTS.analytics.revenueAnalysis}?influencerId=${influencerId || ""}`).catch(() => null),
          apiFetch<any>(API_ENDPOINTS.category.comparison).catch(() => null),
        ]);

        // 0. Process Historical (for KpiRow only — HistoricalTrends removed)
        if (histRes?.success && Array.isArray(histRes.data)) {
          if (histRes.data.length > 0) {
            const mapped = histRes.data.map((d: any) => ({
              date:       d.date ? d.date.substring(5, 10).split("-").reverse().join("/") : "",
              videos:     d.totalVideos   ?? 0,
              views:      d.totalViews    ?? 0,
              likes:      d.totalLikes    ?? 0,
              comments:   d.totalComments ?? 0,
              shares:     d.totalShares   ?? 0,
              engagement: parseFloat(((d.avgEngagementRate ?? 0) * 100).toFixed(1)),
              viralProb:  parseFloat((d.avgViralProbability ?? 0).toFixed(2)),
            }));
            setHistoricalData(mapped);
          } else {
            setHistoricalData([]);
          }
        } else {
          setHistoricalData(HISTORICAL);
        }

        // 1. Process Performance Table
        if (perfRes?.success && Array.isArray(perfRes.data)) {
          if (perfRes.data.length > 0) {
            const mapped = perfRes.data.map((item: any) => ({
              id: item.videoPk,
              title: item.titleBrief || "Untitled Video",
              account: item.influencerUniqueId || "Anonymous",
              accountType: (activeAcc?.type || "inspiration") as any,
              views: item.views || 0,
              likes: item.likes || 0,
              comments: item.comments || 0,
               shares: item.shares || 0,
              engagement: parseFloat(((item.engagementRate || 0) * 100).toFixed(1)),
              viralProb: parseFloat((item.viralProbability || 0).toFixed(2)),
              tier: (() => {
                const norm = (item.engagementTier || "").toLowerCase();
                if (norm === "low") return "Low";
                if (norm === "medium" || norm === "mid") return "Mid";
                if (norm === "high") return "High";
                if (norm === "viral" || norm === "top") return "Top";
                return "Mid";
              })() as any,
              clusterId: item.clusterId || 0,
            }));
            setPerformanceData(mapped);
          } else {
            setPerformanceData([]);
          }
        } else {
          setPerformanceData(CONTENT_PERFORMANCE);
        }

        // 3. Process Optimal Schedule & Heatmap
        if (schedRes?.success && Array.isArray(schedRes.data)) {
          setOptimalSchedule(schedRes.data);

          if (schedRes.data.length > 0) {
            // Build heatmap matrix (7 days x 6 time slots)
            const matrix: number[][] = Array.from({ length: 7 }, () => Array(6).fill(0));
            schedRes.data.forEach((rec: any) => {
              // Map day_of_week: 0=Sunday, 1-6=Mon-Sat. Heatmap Days: Mon=0, Tue=1 ... Sun=6
              const dayIdx = rec.dayOfWeek === 0 ? 6 : rec.dayOfWeek - 1;
              
              // Map hourOfDay (0-23) to 6 slots: 06-09, 09-12, 12-15, 15-18, 18-21, 21-24
              let slotIdx = 5; // default 21-24 or late night
              const hour = rec.hourOfDay;
              if (hour >= 6 && hour < 9) slotIdx = 0;
              else if (hour >= 9 && hour < 12) slotIdx = 1;
              else if (hour >= 12 && hour < 15) slotIdx = 2;
              else if (hour >= 15 && hour < 18) slotIdx = 3;
              else if (hour >= 18 && hour < 21) slotIdx = 4;

              matrix[dayIdx][slotIdx] = parseFloat((rec.expectedEngagementRate * 100).toFixed(1));
            });
            setHeatmapMatrix(matrix);

            // Build top slots list
            const DAY_MAP_SHORT: Record<string, string> = {
              Monday: "Sen", Tuesday: "Sel", Wednesday: "Rab", Thursday: "Kam", Friday: "Jum", Saturday: "Sab", Sunday: "Min"
            };
            const mappedSlots = schedRes.data.slice(0, 5).map((rec: any) => ({
              day: DAY_MAP_SHORT[rec.dayName] || rec.dayName.substring(0, 3),
              time: `${rec.hourOfDay}-${rec.hourOfDay + 3}`,
              dayLabel: rec.dayName,
              timeLabel: rec.timeLabel || `${rec.hourOfDay.toString().padStart(2, "0")}:00`,
              expectedEng: parseFloat((rec.expectedEngagementRate * 100).toFixed(1)),
              expectedViews: rec.expectedViews || 0,
              confidence: parseFloat(rec.confidenceScore.toFixed(2)),
              reasoning: rec.reasoning,
            }));
            setTopSlots(mappedSlots);
          } else {
            setHeatmapMatrix(Array.from({ length: 7 }, () => Array(6).fill(0)));
            setTopSlots([]);
          }
        } else {
          setHeatmapMatrix(SCHEDULE_HEATMAP);
          setTopSlots(TOP_SLOTS);
        }

        // 4. Process Content Recommendations
        if (recsRes?.success && Array.isArray(recsRes.data)) {
          if (recsRes.data.length > 0) {
            const mapped = recsRes.data.map((rec: any) => ({
              id: rec.recId,
              priority: (rec.priorityLevel || "medium").toLowerCase() as Priority,
              type: rec.contentType || "Tutorial Series",
              title: rec.recommendationTitle || "ML Recommendation",
              description: rec.description || "",
              rationale: rec.rationale || "",
              keywords: rec.suggestedKeywords ? rec.suggestedKeywords.split(",").map((s: string) => s.trim()) : [],
              hashtags: rec.suggestedHashtags ? rec.suggestedHashtags.split(",").map((s: string) => s.trim()) : [],
              duration: rec.suggestedDuration ? `${rec.suggestedDuration} menit` : "3-5 menit",
              expectedReach: rec.expectedEngagement ? `Est. Eng Rate: ${(rec.expectedEngagement * 100).toFixed(1)}%` : "",
              confidence: parseFloat((rec.confidenceScore || 0.8).toFixed(2)),
            }));
            setContentRecs(mapped);
          } else {
            setContentRecs([]);
          }
        } else {
          setContentRecs(RECOMMENDATIONS);
        }

        // 5. Process ML Hashtag Recommendations
        if (hashRes?.success && Array.isArray(hashRes.data)) {
          setHashtagRecommendations(hashRes.data);
        } else {
          setHashtagRecommendations([]);
        }

        // 6. Process ML Keyword Recommendations
        if (keyRes?.success && Array.isArray(keyRes.data)) {
          setKeywordRecommendations(keyRes.data);
        } else {
          setKeywordRecommendations([]);
        }

        // 7. Process Content Trend Intelligence (new)
        if (forecastRes?.success && Array.isArray(forecastRes.data)) {
          setForecastData(forecastRes.data);
        } else {
          setForecastData([]);
        }

        // 8. Process LSTM Forecast from ml_engagement_forecasts
        if (lstmRes?.success && Array.isArray(lstmRes.data) && lstmRes.data.length > 0) {
          const lstmPoints = lstmRes.data.map((d: any) => ({
            date: d.forecastDate || "",
            predictedViews:    d.predictedViews    || 0,
            predictedLikes:    d.predictedLikes    || 0,
            predictedComments: d.predictedComments || 0,
            predictedShares:   d.predictedShares   || 0,
            isForecast: true,
          }));
          setLstmForecastData(lstmPoints);
        } else {
          setLstmForecastData([]);
        }

        // 9. Process Correlation Matrix
        if (corrRes?.success && corrRes.data) {
          setCorrelationData(corrRes.data);
        } else {
          setCorrelationData({ features: [], matrix: [] });
        }

        // 9. Process Revenue Analysis
        if (revenueRes?.success && revenueRes.data) {
          setRevenueData(revenueRes.data);
        } else {
          setRevenueData(null);
        }

        // 10. Process Category Snapshot (global market data)
        if (snapshotRes?.success && Array.isArray(snapshotRes.data)) {
          const mapped = snapshotRes.data.map((d: any) => ({
            category:           d.category,
            videoCount:         d.videoCount        ?? 0,
            totalViews:         d.totalViews        ?? 0,
            totalLikes:         d.totalLikes        ?? 0,
            totalComments:      d.totalComments     ?? 0,
            avgEngagementRate:  d.avgEngagementRate ?? 0,
            avgViralScore:      d.avgViralScore     ?? 0,
            totalGmvLocal:      d.totalGmvLocal     ?? 0,
            topHashtag:         d.topHashtag        ?? null,
            bestTime:           d.bestTime          ?? null,
          }));
          setCategorySnapshotData(mapped);
        } else {
          setCategorySnapshotData([]);
        }

      } catch (err) {
        console.error("Failed to load analytics data:", err);
      } finally {
        setIsLoading(false);
        setIsLoadingRecommendations(false);
        setIsLoadingForecast(false);
        setIsLoadingLstm(false);
        setIsLoadingCorrelation(false);
        setIsLoadingRevenue(false);
        setIsLoadingSnapshot(false);
      }
    }

    loadAnalyticsData();
  }, [accountFilter, period, accounts]);

  // Synchronize accountFilter when activeTab or activeCompetitorUsername changes
  useEffect(() => {
    if (!selectedMainAccount) return;
    if (activeTab === "main") {
      setAccountFilter(selectedMainAccount.username);
    } else if (activeTab === "competitors" && activeCompetitorUsername) {
      setAccountFilter(activeCompetitorUsername);
    }
  }, [activeTab, activeCompetitorUsername, selectedMainAccount]);

  // Fetch performance comparison and competitor benchmark when comparison tab is active
  useEffect(() => {
    if (activeTab === "comparison") {
      setIsLoadingComparison(true);
      Promise.all([
        apiFetch<any>(API_ENDPOINTS.dashboard.performanceComparison).catch(() => null),
        apiFetch<any>(API_ENDPOINTS.dashboard.competitorBenchmark).catch(() => null),
      ]).then(([compRes, benchRes]) => {
        if (compRes?.success && Array.isArray(compRes.data)) {
          setComparisonData(compRes.data);
        }
        if (benchRes?.success && benchRes.data) {
          setBenchmarkData(benchRes.data);
        }
        setIsLoadingComparison(false);
      });
    }
  }, [activeTab]);

  const sortedPerformance = useMemo(
    () =>
      [...performanceData].sort(
        (a, b) => (b[sortBy] as number) - (a[sortBy] as number)
      ),
    [sortBy, performanceData]
  );

  const filteredRecs = useMemo(() => {
    const subset =
      priorityFilter === "all"
        ? contentRecs
        : contentRecs.filter((r) => r.priority === priorityFilter);
    return [...subset].sort(
      (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    );
  }, [priorityFilter, contentRecs]);

  const handleExport = useCallback(() => {
    const exportData: AnalyticsExportData = {
      accountFilter,
      period,
      historicalData,
      performanceData,
      heatmapMatrix,
      topSlots,
      hashtagRecommendations,
      optimalSchedule,
      keywordRecommendations,
      contentRecs,
    };
    exportAnalyticsPdf(exportData);
  }, [
    accountFilter,
    period,
    historicalData,
    performanceData,
    heatmapMatrix,
    topSlots,
    hashtagRecommendations,
optimalSchedule,
    keywordRecommendations,
    contentRecs,
  ]);

  // Setup modal rendering function
  const renderSetupModal = () => {
    if (!isSetupModalOpen) return null;

    const analyzeSteps = [
      { icon: ScanLine, text: "Memuat data akun..." },
      { icon: BrainCircuit, text: "Menginisialisasi model ML..." },
      { icon: Cpu, text: "Memproses konfigurasi kompetitor..." },
      { icon: Sparkles, text: "Analisis siap dimulai!" },
    ];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div
          className="w-full max-w-4xl bg-white rounded-3xl p-8 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto relative"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {/* Analyzing overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 z-10 rounded-3xl bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 animate-fade-in">
              {/* Animated machine icon */}
              <div className="relative flex items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-black flex items-center justify-center shadow-2xl" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
                  <BrainCircuit className="w-10 h-10 text-white" style={{ animation: 'spin 2s linear infinite' }} />
                </div>
                <div className="absolute -inset-3 rounded-3xl border-2 border-black/10" style={{ animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                <div className="absolute -inset-6 rounded-3xl border border-black/5" style={{ animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite 0.3s' }} />
              </div>

              {/* Steps progress */}
              <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                {analyzeSteps.map((step, i) => {
                  const StepIcon = step.icon;
                  const isDone = analyzeStep > i;
                  const isActive = analyzeStep === i;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all duration-500"
                      style={{
                        background: isDone ? 'rgba(0,0,0,0.04)' : isActive ? 'rgba(0,0,0,0.06)' : 'transparent',
                        opacity: isDone || isActive ? 1 : 0.3,
                        transform: isActive ? 'scale(1.02)' : 'scale(1)',
                      }}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: isDone ? '#111' : isActive ? '#333' : '#e5e7eb' }}>
                        {isDone ? (
                          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                        ) : (
                          <StepIcon className="w-3.5 h-3.5" style={{ color: isActive ? '#fff' : '#9ca3af' }} />
                        )}
                      </div>
                      <span className="text-sm font-semibold" style={{ color: isDone || isActive ? '#111' : '#9ca3af' }}>
                        {step.text}
                      </span>
                      {isActive && (
                        <Loader2 className="w-3.5 h-3.5 ml-auto animate-spin" style={{ color: '#6b7280' }} />
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-gray-400 font-medium animate-pulse">Sedang mempersiapkan analisis privat...</p>
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-black tracking-tight" style={{ color: TOKENS.text }}>
                Private Analysis Configuration
              </h2>
              <p className="text-xs mt-1" style={{ color: TOKENS.textMuted }}>
                Konfigurasikan akun utama Anda dan kompetitor untuk memproses data model ML.
              </p>
            </div>
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsSetupModalOpen(false)}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0 ml-4"
              style={{ color: TOKENS.textMuted }}
              aria-label="Tutup modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari username atau nama akun pelacakan..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full px-4 py-3 pl-10 rounded-xl border text-sm font-semibold outline-none transition-all focus:border-black"
              style={{ borderColor: TOKENS.inputBorder, color: TOKENS.text }}
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
            {/* Column 1: Main Account */}
            <div className="flex flex-col gap-2 min-w-0">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Main Account (Akun Utama - Pilih 1)
              </label>
              <div 
                className="flex-1 border rounded-2xl p-3 space-y-1.5 overflow-y-auto max-h-[320px]"
                style={{ borderColor: TOKENS.inputBorder }}
              >
                {renderedMainAccounts.length === 0 ? (
                  <p className="text-xs text-gray-400 italic text-center py-8">Tidak ada akun yang cocok</p>
                ) : (
                  renderedMainAccounts.map((acc: any) => {
                    const isSelected = tempMainId === acc.influencerId.toString();
                    return (
                      <button
                        key={acc.influencerId}
                        type="button"
                        onClick={() => {
                          setTempMainId(acc.influencerId.toString());
                          setTempCompIds(prev => prev.filter(id => id !== acc.influencerId.toString()));
                        }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left border"
                        style={{ 
                          borderColor: isSelected ? '#111' : 'transparent',
                          background: isSelected ? 'rgba(0,0,0,0.03)' : 'transparent'
                        }}
                      >
                        <div className="w-8 h-8 rounded-full bg-neutral-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500">
                          {acc.avatarUrl ? (
                            <img src={acc.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            acc.username.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-gray-800 truncate">@{acc.username}</p>
                          <p className="text-[10px] text-gray-400 truncate">{acc.displayName}</p>
                        </div>
                        <div 
                          className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0"
                          style={{ borderColor: isSelected ? '#111' : TOKENS.inputBorder }}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Column 2: Competitor Accounts */}
            <div className="flex flex-col gap-2 min-w-0">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Competitors (Maks 5)
                </label>
                <span className="text-[10px] font-black text-gray-400">
                  {tempCompIds.length} terpilih
                </span>
              </div>
              <div 
                className="flex-1 border rounded-2xl p-3 space-y-1.5 overflow-y-auto max-h-[320px]"
                style={{ borderColor: TOKENS.inputBorder }}
              >
                {renderedCompetitors.length === 0 ? (
                  <p className="text-xs text-gray-400 italic text-center py-8">Tidak ada competitor yang cocok</p>
                ) : (
                  renderedCompetitors.map((acc: any) => {
                    const isChecked = tempCompIds.includes(acc.influencerId.toString());
                    return (
                      <button
                        key={acc.influencerId}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setTempCompIds(prev => prev.filter(id => id !== acc.influencerId.toString()));
                          } else {
                            if (tempCompIds.length >= 5) {
                              alert("Anda hanya dapat memilih maksimal 5 akun kompetitor!");
                              return;
                            }
                            setTempCompIds(prev => [...prev, acc.influencerId.toString()]);
                          }
                        }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left border"
                        style={{ 
                          borderColor: isChecked ? '#111' : 'transparent',
                          background: isChecked ? 'rgba(0,0,0,0.03)' : 'transparent'
                        }}
                      >
                        <div className="w-8 h-8 rounded-full bg-neutral-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500">
                          {acc.avatarUrl ? (
                            <img src={acc.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            acc.username.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-gray-800 truncate">@{acc.username}</p>
                          <p className="text-[10px] text-gray-400 truncate">{acc.displayName}</p>
                        </div>
                        <div 
                          className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 bg-white"
                          style={{ borderColor: isChecked ? '#111' : TOKENS.inputBorder }}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2.5 pt-2">
            {selectedMainAccount && (
              <button
                type="button"
                onClick={() => setIsSetupModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl text-xs font-bold border hover:bg-black/5"
                style={{ borderColor: TOKENS.inputBorder, color: TOKENS.text }}
              >
                Batal
              </button>
            )}
            <button
              type="button"
              disabled={!tempMainId || isAnalyzing}
              onClick={handleSaveSetup}
              className="flex-1 px-4 py-3 rounded-xl text-xs font-black text-white transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                background: (!tempMainId || isAnalyzing) ? '#cbd5e1' : '#111',
                cursor: (!tempMainId || isAnalyzing) ? 'not-allowed' : 'pointer',
                boxShadow: (!tempMainId || isAnalyzing) ? 'none' : '0 4px 14px rgba(17, 17, 17, 0.25)',
              }}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Menganalisis...
                </>
              ) : (
                "Start Analysis"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!selectedMainAccount) {
    return (
      <PageShell title="Analytics">
        <AnalyticsToolbar
          period={period}
          onPeriodChange={setPeriod}
          accountFilter={accountFilter}
          onAccountFilterChange={setAccountFilter}
          accounts={accounts}
          onExport={handleExport}
        />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center bg-gray-50/50 m-6 rounded-2xl border border-dashed" style={{ borderColor: TOKENS.divider }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-gray-400"
               style={{ background: 'rgba(0,0,0,0.03)', color: TOKENS.textMuted }}>
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black" style={{ color: TOKENS.text }}>Setup Private Analysis</h3>
            <p className="text-xs max-w-sm mt-1" style={{ color: TOKENS.textMuted }}>
              Silakan konfigurasikan akun utama Anda dan kompetitor di popup/modal untuk memulai analisis performa privat dengan machine learning.
            </p>
          </div>
          <button
            onClick={openSetupModal}
            className="px-5 py-2.5 rounded-xl text-xs font-black text-white transition-all hover:scale-105 active:scale-95 duration-200"
            style={{ background: '#111', boxShadow: '0 4px 14px rgba(17, 17, 17, 0.25)' }}
          >
            Pilih Akun & Mulai Analisis
          </button>
          {renderSetupModal()}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Analytics">
      <AnalyticsToolbar
        period={period}
        onPeriodChange={setPeriod}
        accountFilter={accountFilter}
        onAccountFilterChange={setAccountFilter}
        accounts={accounts}
        onExport={handleExport}
      />
      
      {/* ── Active Configuration Banner ── */}
      <div 
        className="mx-6 mt-6 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border" 
        style={{ 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(8px)',
          borderColor: TOKENS.divider,
          boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
        }}
      >
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Main Account</span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black text-white text-xs font-black shadow-sm">
              {selectedMainAccount.avatarUrl ? (
                <img src={selectedMainAccount.avatarUrl} alt="" className="w-4 h-4 rounded-full object-cover" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-neutral-700 flex items-center justify-center text-[9px] font-black">
                  {selectedMainAccount.username.substring(0, 2).toUpperCase()}
                </div>
              )}
              @{selectedMainAccount.username}
            </div>
          </div>
          
          {selectedCompetitors.length > 0 && (
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Competitors</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedCompetitors.map(comp => (
                  <div key={comp.influencerId} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 border text-neutral-800 text-[11px] font-black" style={{ borderColor: TOKENS.divider }}>
                    {comp.avatarUrl ? (
                      <img src={comp.avatarUrl} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full bg-neutral-300 flex items-center justify-center text-[8px] font-black">
                        {comp.username.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    @{comp.username}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearAnalysis}
            className="px-3.5 py-2 rounded-xl text-xs font-black transition-all hover:bg-red-50"
            style={{ border: `1px solid #fecaca`, color: '#ef4444' }}
          >
            Clear Analysis
          </button>
          <button
            onClick={openSetupModal}
            className="px-3.5 py-2 rounded-xl text-xs font-black transition-all hover:bg-neutral-100"
            style={{ border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.text }}
          >
            Configure Accounts
          </button>
        </div>
      </div>

      {/* Tab Selection */}
      <div className="mx-6 mt-6 flex border-b" style={{ borderColor: TOKENS.divider }}>
        {[
          { key: "main", label: "Main Account Analysis" },
          { key: "competitors", label: "Competitor Analysis" },
          { key: "comparison", label: "Comparison & Benchmark" },
        ].map((t) => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => {
                setActiveTab(t.key as any);
                if (t.key === "competitors" && !activeCompetitorUsername && selectedCompetitors.length > 0) {
                  setActiveCompetitorUsername(selectedCompetitors[0].username);
                }
              }}
              className="px-6 py-3.5 text-xs font-black transition-all border-b-2 outline-none relative cursor-pointer"
              style={{
                borderColor: isActive ? "#111" : "transparent",
                color: isActive ? TOKENS.text : TOKENS.textMuted,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === "competitors" && (
        <div className="mx-6 mt-4 p-3 bg-neutral-50 rounded-2xl border flex items-center gap-3 animate-fade-in" style={{ borderColor: TOKENS.divider }}>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Select Competitor:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {selectedCompetitors.length === 0 ? (
              <span className="text-xs text-gray-400 italic">Belum ada kompetitor yang dikonfigurasi.</span>
            ) : (
              selectedCompetitors.map((comp) => {
                const isActive = activeCompetitorUsername === comp.username;
                return (
                  <button
                    key={comp.influencerId}
                    onClick={() => setActiveCompetitorUsername(comp.username)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer"
                    style={{
                      background: isActive ? '#111' : '#fff',
                      borderColor: isActive ? '#111' : TOKENS.inputBorder,
                      color: isActive ? '#fff' : TOKENS.text,
                      boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    {comp.avatarUrl ? (
                      <img src={comp.avatarUrl} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full bg-neutral-300 flex items-center justify-center text-[8px] font-black text-neutral-800">
                        {comp.username.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    @{comp.username}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {(activeTab === "main" || activeTab === "competitors") ? (
        <>
          <AnalyticsSectionNav />

          <div
            className="p-6 space-y-8 animate-fade-in"
            style={{ fontFamily: "'DM Sans',sans-serif" }}
          >
            <section id="kpi" className="scroll-mt-40">
              <SectionLabel
                icon={Layers}
                title="KPI Summary"
                subtitle={`Periode: ${period} · ${accountFilter === "all" ? "semua akun" : `@${accountFilter}`}`}
              />
              <KpiRow data={historicalData} />
            </section>

            <section id="historical" className="scroll-mt-40 space-y-5">
              <SectionLabel
                icon={TrendingUp}
                title="Category Trend Intelligence"
                subtitle="Tren pasar per kategori konten · ranking peluang · snapshot global"
              />

              {/* 1. Hype Ranking */}
              <CategoryHypeRanking
                data={(forecastData ?? []).map((d: any) => ({
                  category:               d.category,
                  trendDirection:         d.trendDirection         ?? "stable",
                  potentialScore:         d.potentialScore         ?? 0,
                  globalAvgEngagementRate:d.globalAvgEngagementRate?? 0,
                  avgViralProbability:    d.avgViralProbability    ?? 0,
                  predictedChangePct:     d.predictedChangePct     ?? 0,
                  recommendation:         d.recommendation         ?? "",
                }))}
                loading={isLoadingForecast}
              />

              {/* 2. Trend Lines */}
              <CategoryTrendLines
                data={(forecastData ?? []).map((d: any) => ({
                  category:       d.category,
                  historicalTrend:(d.historicalTrend ?? []).map((p: any) => ({
                    date:               p.date ?? "",
                    avgViews:           p.avgViews           ?? 0,
                    avgEngagementRate:  p.avgEngagementRate  ?? 0,
                    isForecast:         p.isForecast         ?? false,
                  })),
                  forecastTrend:(d.forecastTrend ?? []).map((p: any) => ({
                    date:               p.date ?? "",
                    avgViews:           p.avgViews           ?? 0,
                    avgEngagementRate:  p.avgEngagementRate  ?? 0,
                    isForecast:         true,
                  })),
                }))}
                loading={isLoadingForecast}
              />

              {/* 3. Snapshot Table */}
              <CategorySnapshotTable
                data={categorySnapshotData}
                loading={isLoadingSnapshot}
              />
            </section>

            <section id="forecast" className="scroll-mt-40 space-y-6">
              {/* Content Trend Intelligence */}
              <EngagementForecast
                data={forecastData}
                loading={isLoadingForecast}
                hasMainAccount={!!selectedMainAccount}
                hashtagRecs={hashtagRecommendations}
                postingTimeRecs={optimalSchedule}
              />

              {/* LSTM Engagement Forecasting */}
              <LSTMForecast
                data={lstmForecastData}
                loading={isLoadingLstm}
              />
            </section>

            <section id="performance" className="scroll-mt-40">
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: TOKENS.cardSoft,
                  border: `1px solid ${TOKENS.cardBorder}`,
                  boxShadow:
                    "0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)",
                }}
              >
                <GridBg theme="light" />
                <div className="relative z-10">
                  <div
                    className="px-6 py-5"
                    style={{ borderBottom: `1px solid ${TOKENS.divider}` }}
                  >
                    <SectionLabel
                      icon={ListChecks}
                      title="Content Performance"
                      subtitle={`${sortedPerformance.length} video · joined dengan ML predictions (viral prob, tier, cluster)`}
                      action={
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider"
                            style={{ color: TOKENS.textMuted }}
                          >
                            Sort by:
                          </span>
                          <div
                            className="flex items-center gap-1 p-0.5 rounded-lg"
                            style={{
                              background: "rgba(0,0,0,0.04)",
                              border: `1px solid ${TOKENS.inputBorder}`,
                            }}
                          >
                            {SORT_OPTIONS.map((s) => {
                              const sel = sortBy === s.key;
                              return (
                                <button
                                  key={s.key}
                                  type="button"
                                  onClick={() => setSortBy(s.key)}
                                  className="px-2.5 py-1 rounded-md text-[11px] font-black transition-all"
                                  style={{
                                    background: sel ? "#fff" : "transparent",
                                    color: sel ? TOKENS.text : TOKENS.textMuted,
                                    boxShadow: sel
                                      ? "0 1px 4px rgba(0,0,0,0.06)"
                                      : "none",
                                  }}
                                >
                                  {s.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      }
                    />
                  </div>
                  <ContentPerformanceTable
                    rows={sortedPerformance}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    onRowClick={(video) => setSelectedVideo(video)}
                  />
                </div>
              </div>
            </section>

            <section id="schedule" className="scroll-mt-40 space-y-4">
              <SectionLabel
                icon={Calendar}
                title="Optimal Schedule"
                subtitle="Prediksi engagement per slot waktu + top 5 slot rekomendasi"
              />
              <ScheduleHeatmap heatmap={heatmapMatrix} />

              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "#047857" }}
                  >
                    <Award
                      className="w-3.5 h-3.5 text-white"
                      strokeWidth={2.4}
                    />
                  </div>
                  <div>
                    <h3
                      className="font-black text-sm tracking-tight"
                      style={{ color: TOKENS.text }}
                    >
                      Top 5 Recommended Slots
                    </h3>
                    <p
                      className="text-[11px]"
                      style={{ color: TOKENS.textMuted }}
                    >
                      Slot dengan kombinasi engagement & confidence tertinggi
                    </p>
                  </div>
                </div>
                <TopSlotsList slots={topSlots} />
              </div>
            </section>

            <section id="correlation" className="scroll-mt-40">
              <CorrelationHeatmap data={correlationData} loading={isLoadingCorrelation} />
            </section>

            {/* New ML Recommendations & Synergy Section */}
            <section id="ml-recs" className="scroll-mt-40 space-y-6">
              <SectionLabel
                icon={Sparkles}
                title="ML Recommendations & Synergy"
                subtitle={`Rekomendasi taktis berbasis algoritma ML dan analisis NLP untuk @${accountFilter}`}
              />

              <CombinedRecommendationsChart
                hashtags={hashtagRecommendations}
                postingTimes={optimalSchedule}
                keywords={keywordRecommendations}
                loading={isLoadingRecommendations}
              />

              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "#0369a1" }}
                  >
                    <Hash className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm tracking-tight" style={{ color: TOKENS.text }}>
                      Hashtag Recommendations
                    </h3>
                    <p className="text-[11px]" style={{ color: TOKENS.textMuted }}>
                      Rekomendasi hashtag berbasis ML scoring
                    </p>
                  </div>
                </div>
                <MlHashtagRecommendations
                  recommendations={hashtagRecommendations}
                  loading={isLoadingRecommendations}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "#047857" }}
                  >
                    <Clock className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm tracking-tight" style={{ color: TOKENS.text }}>
                      Posting Time Recommendations
                    </h3>
                    <p className="text-[11px]" style={{ color: TOKENS.textMuted }}>
                      Waktu posting optimal berdasarkan pola engagement
                    </p>
                  </div>
                </div>
                <MlPostingTimeRecommendations
                  recommendations={optimalSchedule}
                  loading={isLoadingRecommendations}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "#b45309" }}
                  >
                    <Key className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm tracking-tight" style={{ color: TOKENS.text }}>
                      Keyword Recommendations
                    </h3>
                    <p className="text-[11px]" style={{ color: TOKENS.textMuted }}>
                      Kata kunci berperforma tinggi dari analisis NLP
                    </p>
                  </div>
                </div>
                <MlKeywordRecommendations
                  recommendations={keywordRecommendations}
                  loading={isLoadingRecommendations}
                />
              </div>
            </section>

            <section id="recs" className="scroll-mt-40">
              <SectionLabel
                icon={Lightbulb}
                title="Content Recommendations"
                action={
                  <div
                    className="flex items-center gap-1.5 p-1 rounded-xl"
                    style={{
                      background: "rgba(0,0,0,0.04)",
                      border: `1px solid ${TOKENS.inputBorder}`,
                    }}
                  >
                    {PRIORITY_FILTERS.map((p) => {
                      const sel = priorityFilter === p.key;
                      const count =
                        p.key === "all"
                          ? contentRecs.length
                          : contentRecs.filter((r) => r.priority === p.key).length;
                      return (
                        <button
                          key={p.key}
                          type="button"
                          onClick={() => setPriorityFilter(p.key)}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-black transition-all flex items-center gap-1.5"
                          style={{
                            background: sel ? p.solid : "transparent",
                            color: sel ? "#fff" : TOKENS.textMuted,
                          }}
                        >
                          {p.label}
                          <span
                            className="px-1.5 py-0 rounded text-[10px] font-black"
                            style={{
                              background: sel
                                ? "rgba(255,255,255,0.25)"
                                : "rgba(0,0,0,0.08)",
                              color: sel ? "#fff" : TOKENS.textMuted,
                            }}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-fade-in">
                {filteredRecs.map((rec) => (
                  <RecommendationCard
                    key={rec.id}
                    rec={rec}
                    onOpen={setOpenRec}
                  />
                ))}
              </div>
            </section>

            <section id="revenue" className="scroll-mt-40">
              <SectionLabel
                icon={DollarSign}
                title="Revenue Analysis"
                subtitle={`Analisis komersial dan rincian e-commerce tingkat kategori untuk @${accountFilter}`}
              />
              <RevenueAnalysis data={revenueData} loading={isLoadingRevenue} />
            </section>
          </div>
        </>
      ) : (
        <div className="p-6 space-y-6 animate-fade-in" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {isLoadingComparison ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              <p className="text-xs font-black text-gray-400">Memproses perbandingan metrik...</p>
            </div>
          ) : (
            <>
              {/* Benchmark Summary cards */}
              {computedBenchmarkData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div 
                    className="p-6 bg-white rounded-2xl border flex flex-col gap-1.5 shadow-sm relative overflow-hidden" 
                    style={{ borderColor: TOKENS.divider }}
                  >
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Own Average Score</span>
                    <span className="text-3xl font-black text-gray-900">{(computedBenchmarkData.ownAverageScore || 0).toFixed(1)}</span>
                    <span className="text-[10px] text-gray-400 font-semibold mt-1">Rata-rata skor performa akun utama Anda</span>
                  </div>
                  
                  <div 
                    className="p-6 bg-white rounded-2xl border flex flex-col gap-1.5 shadow-sm relative overflow-hidden" 
                    style={{ borderColor: TOKENS.divider }}
                  >
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Competitor Average Score</span>
                    <span className="text-3xl font-black text-gray-900">{(computedBenchmarkData.competitorAverageScore || 0).toFixed(1)}</span>
                    <span className="text-[10px] text-gray-400 font-semibold mt-1">Rata-rata skor performa kompetitor pilihan</span>
                  </div>

                  <div 
                    className="p-6 bg-white rounded-2xl border flex flex-col gap-1.5 shadow-sm relative overflow-hidden" 
                    style={{ borderColor: TOKENS.divider }}
                  >
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Score Gap</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-3xl font-black ${computedBenchmarkData.gapScore >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {computedBenchmarkData.gapScore >= 0 ? '+' : ''}{(computedBenchmarkData.gapScore || 0).toFixed(1)}
                      </span>
                      {computedBenchmarkData.gapScore >= 0 ? (
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 font-semibold mt-1">Selisih skor dengan rata-rata kompetitor</span>
                  </div>
                </div>
              )}

              {/* Recharts BarChart metric comparison */}
              <div className="bg-white rounded-2xl border p-6 flex flex-col gap-4 shadow-sm" style={{ borderColor: TOKENS.divider }}>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="text-sm font-black text-gray-800">Visualisasi Diagram Perbandingan</h3>
                    <p className="text-[10px] text-gray-400 font-semibold">Bandingkan performa akun utama dan kompetitor berdasarkan metrik</p>
                  </div>
                  <div className="flex gap-1 p-1 rounded-xl bg-neutral-100 border border-neutral-200" style={{ borderColor: TOKENS.divider }}>
                    {(Object.keys(METRIC_LABELS) as Array<keyof typeof METRIC_LABELS>).map((m) => {
                      const active = comparisonMetric === m;
                      return (
                        <button
                          key={m}
                          onClick={() => setComparisonMetric(m)}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer"
                          style={{
                            background: active ? '#fff' : 'transparent',
                            color: active ? TOKENS.text : TOKENS.textMuted,
                            boxShadow: active ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                          }}
                        >
                          {METRIC_LABELS[m]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ height: 280 }} className="w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredComparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis 
                        dataKey="uniqueId" 
                        tickFormatter={(v) => `@${v}`}
                        tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tickFormatter={(v) => {
                          if (comparisonMetric === 'averageEngagementRate') return `${(v * 100).toFixed(1)}%`;
                          if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
                          if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
                          return v;
                        }}
                        tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                        contentStyle={{
                          background: '#fff',
                          border: '1px solid rgba(0,0,0,0.1)',
                          borderRadius: 12,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          fontFamily: 'inherit',
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                        formatter={(v: any) => {
                          if (comparisonMetric === 'averageEngagementRate') return [`${(v * 100).toFixed(1)}%`, 'Engagement Rate'];
                          return [v.toLocaleString('id-ID'), METRIC_LABELS[comparisonMetric]];
                        }}
                      />
                      <Bar dataKey={comparisonMetric} radius={[6, 6, 0, 0]} barSize={36}>
                        {filteredComparisonData.map((entry, index) => {
                          const isOwn = entry.trackingType === 'own';
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={isOwn ? '#111' : 'rgba(0,0,0,0.25)'} 
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Comparison ranking table */}
              <div className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: TOKENS.divider }}>
                <div className="px-6 py-4 border-b bg-gray-50/20" style={{ borderColor: TOKENS.divider }}>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">Tabel Peringkat Performa Pelacakan</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b" style={{ borderColor: TOKENS.divider }}>
                        {["#", "Akun", "Followers", "Total Video", "Total Views", "Avg Engagement", "Performance Score"].map((h, i) => (
                          <th key={i} className="px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComparisonData
                        .sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0))
                        .map((row, idx) => {
                          const isOwn = row.trackingType === 'own';
                          return (
                            <tr
                              key={row.influencerId}
                              className="border-b transition-colors hover:bg-neutral-50"
                              style={{
                                background: isOwn ? 'rgba(0,0,0,0.015)' : 'transparent',
                                borderColor: TOKENS.divider
                              }}
                            >
                              <td className="px-6 py-4 text-xs font-black text-gray-800">
                                #{idx + 1}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center text-xs font-bold text-gray-500">
                                    {row.avatarUrl ? (
                                      <img src={row.avatarUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      row.uniqueId.substring(0, 2).toUpperCase()
                                    )}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-black text-gray-800">@{row.uniqueId}</span>
                                      {isOwn && (
                                        <span className="px-1.5 py-0.5 rounded text-[8px] font-black text-white bg-black uppercase">
                                          Anda
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-semibold">{row.displayName}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-xs font-bold text-gray-700">
                                {(row.followerCountNum || 0).toLocaleString('id-ID')}
                              </td>
                              <td className="px-6 py-4 text-xs font-bold text-gray-700">
                                {(row.totalVideos || 0).toLocaleString('id-ID')}
                              </td>
                              <td className="px-6 py-4 text-xs font-bold text-gray-700">
                                {(row.totalViews || 0).toLocaleString('id-ID')}
                              </td>
                              <td className="px-6 py-4 text-xs font-black">
                                <span 
                                  className="px-2 py-1 rounded-md"
                                  style={{
                                    color: (row.averageEngagementRate || 0) >= 0.07 ? '#059669' : '#b45309',
                                    background: (row.averageEngagementRate || 0) >= 0.07 ? 'rgba(5,150,105,0.08)' : 'rgba(180,83,9,0.08)'
                                  }}
                                >
                                  {((row.averageEngagementRate || 0) * 100).toFixed(1)}%
                                </span>
                              </td>
                              <td className="px-6 py-4 text-xs font-black text-gray-900">
                                {(row.performanceScore || 0).toFixed(1)}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <RecommendationDetailDrawer
        rec={openRec}
        onClose={() => setOpenRec(null)}
      />

      {selectedVideo && (
        <VideoDetailModal
          videoId={selectedVideo.id}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {renderSetupModal()}
    </PageShell>
  );
}
