"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Award,
  BrainCircuit,
  Calendar,
  Check,
  Clock,
  Cpu,
  DollarSign,
  Hash,
  Key,
  Layers,
  Lightbulb,
  ListChecks,
  Loader2,
  ScanLine,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Video,
  X,
} from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { PageShell } from "@/components/layout/PageShell";
import { SectionLabel } from "@/components/dashboard";
import {
  AnalyticsSectionNav,
  AnalyticsToolbar,
  ContentPerformanceTable,
  KpiRow,
  RecommendationDetailDrawer,
  TacticalSynergyHub,
  OptimalScheduleWindow,
  EngagementForecast,
  LSTMForecast,
  CorrelationHeatmap,
  RevenueAnalysis,
  VideoDetailModal,
} from "@/components/analytics";
import { TOKENS } from "@/lib/design-tokens";
import {
  CONTENT_PERFORMANCE,
  HISTORICAL,
  RECOMMENDATIONS,
  SCHEDULE_HEATMAP,
  TOP_SLOTS,
} from "@/lib/analytics/mock-data";
import type {
  Recommendation,
  SortKey,
  HistoricalDay,
  ContentRow,
} from "@/lib/analytics/types";
import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { exportAnalyticsPdf, type AnalyticsExportData } from "@/lib/analytics/export-pdf";
import { resolveAvatarUrl } from "@/lib/utils";
import { formatNum, formatPct } from "@/lib/analytics/formatters";

function SafeAvatar({
  src,
  alt,
  username,
  size = 28,
  className = "",
}: {
  src?: string | null;
  alt?: string;
  username?: string;
  size?: number;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const resolvedSrc = useMemo(() => resolveAvatarUrl(src), [src]);

  const initials = useMemo(() => {
    if (!username) return "?";
    return (
      username
        .replace(/[._-]/g, " ")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("") || username.substring(0, 2).toUpperCase()
    );
  }, [username]);

  if (resolvedSrc && !error) {
    return (
      <img
        src={resolvedSrc}
        alt={alt || username || "Avatar"}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setError(true)}
        className={`rounded-full object-cover flex-shrink-0 bg-stone-100 dark:bg-neutral-800 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-stone-200 dark:bg-neutral-700 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-stone-600 dark:text-neutral-300 select-none ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(8, Math.round(size * 0.36)),
      }}
    >
      {initials}
    </div>
  );
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "viralProb", label: "Viral Prob." },
  { key: "engagement", label: "Engagement" },
  { key: "views", label: "Views" },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("last_30_days");
  const [accountFilter, setAccountFilter] = useState("");
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
  const [compVisibleSeries, setCompVisibleSeries] = useState({
    views: true,
    followers: true,
    score: true,
    engagement: true,
  });

  const toggleCompSeries = (key: keyof typeof compVisibleSeries) => {
    setCompVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [benchmarkData, setBenchmarkData] = useState<any>(null);
  const [isLoadingComparison, setIsLoadingComparison] = useState(false);

  // Dynamic API states
  const [accounts, setAccounts] = useState<any[]>([]);

  const renderedMainAccounts = useMemo(() => {
    const matched = accounts.filter(
      (acc: any) =>
        acc.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const selected = accounts.find((acc: any) => acc.influencerId.toString() === tempMainId);
    const list = [...matched];
    if (selected && !list.some((a) => a.influencerId.toString() === selected.influencerId.toString())) {
      list.push(selected);
    }

    return list
      .sort((a, b) => {
        const aSelected = a.influencerId.toString() === tempMainId;
        const bSelected = b.influencerId.toString() === tempMainId;
        if (aSelected && !bSelected) return -1;
        if (!aSelected && bSelected) return 1;
        return 0;
      })
      .slice(0, 150);
  }, [accounts, searchTerm, tempMainId]);

  const renderedCompetitors = useMemo(() => {
    const listWithoutMain = accounts.filter((acc: any) => acc.influencerId.toString() !== tempMainId);
    const matched = listWithoutMain.filter(
      (acc: any) =>
        acc.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const selected = listWithoutMain.filter((acc: any) => tempCompIds.includes(acc.influencerId.toString()));

    const list = [...matched];
    selected.forEach((item) => {
      if (!list.some((a) => a.influencerId.toString() === item.influencerId.toString())) {
        list.push(item);
      }
    });

    return list
      .sort((a, b) => {
        const aChecked = tempCompIds.includes(a.influencerId.toString());
        const bChecked = tempCompIds.includes(b.influencerId.toString());
        if (aChecked && !bChecked) return -1;
        if (!aChecked && bChecked) return 1;
        return 0;
      })
      .slice(0, 150);
  }, [accounts, searchTerm, tempMainId, tempCompIds]);

  const filteredComparisonData = useMemo(() => {
    if (!selectedMainAccount) return [];
    const selectedIds = [
      selectedMainAccount.influencerId?.toString(),
      ...selectedCompetitors.map((c: any) => c.influencerId?.toString()),
    ].filter(Boolean);
    return comparisonData.filter((item: any) =>
      selectedIds.includes(item.influencerId?.toString())
    );
  }, [comparisonData, selectedMainAccount, selectedCompetitors]);

  const computedBenchmarkData = useMemo(() => {
    if (!selectedMainAccount || filteredComparisonData.length === 0) return null;

    const ownAccs = filteredComparisonData.filter(
      (item) =>
        item.trackingType === "own" ||
        item.influencerId?.toString() === selectedMainAccount.influencerId?.toString()
    );
    const compAccs = filteredComparisonData.filter(
      (item) =>
        item.trackingType === "competitor" ||
        selectedCompetitors.some((c) => c.influencerId?.toString() === item.influencerId?.toString())
    );

    const ownAverageScore =
      ownAccs.length > 0
        ? ownAccs.reduce((acc, item) => acc + (item.performanceScore || 0), 0) / ownAccs.length
        : 0;

    const competitorAverageScore =
      compAccs.length > 0
        ? compAccs.reduce((acc, item) => acc + (item.performanceScore || 0), 0) / compAccs.length
        : 0;

    const gapScore = ownAverageScore - competitorAverageScore;

    return {
      ownAverageScore,
      competitorAverageScore,
      gapScore,
    };
  }, [filteredComparisonData, selectedMainAccount, selectedCompetitors]);

  const comparisonChartData = useMemo(() => {
    return filteredComparisonData.map((item) => {
      const isOwn =
        item.trackingType === "own" ||
        item.influencerId?.toString() === selectedMainAccount?.influencerId?.toString();
      return {
        name: `@${item.uniqueId}`,
        uniqueId: item.uniqueId,
        displayName: item.displayName || item.uniqueId,
        avatarUrl: item.avatarUrl,
        isOwn,
        views: item.totalViews || 0,
        followers: item.followerCountNum || 0,
        score: Number((item.performanceScore || 0).toFixed(1)),
        engagement: Number(((item.averageEngagementRate || 0) * 100).toFixed(1)),
      };
    });
  }, [filteredComparisonData, selectedMainAccount]);

  const [historicalData, setHistoricalData] = useState<HistoricalDay[]>(HISTORICAL);
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
      setTempCompIds(selectedCompetitors.map((c) => c.influencerId.toString()));
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

        localStorage.setItem("analytics_main_influencer_id", tempMainId);
        localStorage.setItem("analytics_competitor_influencer_ids", JSON.stringify(tempCompIds));

        apiFetch<any>("/api/accounts/configuration", {
          method: "PUT",
          body: {
            mainInfluencerId: tempMainId,
            competitorInfluencerIds: tempCompIds,
          },
        }).catch((err) => {
          console.error("Failed to persist account configurations on backend:", err);
        });
      }, 3200);
    }
  };

  const handleClearAnalysis = () => {
    setSelectedMainAccount(null);
    setSelectedCompetitors([]);
    setAccountFilter("");
    setTempMainId("");
    setTempCompIds([]);
    setSearchTerm("");
    setSearchInput("");
    setActiveTab("main");
    setActiveCompetitorUsername("");

    localStorage.removeItem("analytics_main_influencer_id");
    localStorage.removeItem("analytics_competitor_influencer_ids");

    apiFetch<any>("/api/accounts/configuration", {
      method: "PUT",
      body: {
        mainInfluencerId: null,
        competitorInfluencerIds: [],
      },
    }).catch((err) => {
      console.error("Failed to clear account configuration on backend:", err);
    });

    setIsSetupModalOpen(true);
  };

  // Fetch account configuration from backend on mount
  useEffect(() => {
    async function loadConfiguration() {
      try {
        const res = await apiFetch<any>("/api/accounts/configuration");
        if (res?.success && res.data) {
          const mainAcc = res.data.mainAccount
            ? {
                username: res.data.mainAccount.uniqueId,
                influencerId: res.data.mainAccount.influencerId,
                type: res.data.mainAccount.trackingType || "inspiration",
                displayName:
                  res.data.mainAccount.displayName ||
                  res.data.mainAccount.nickname ||
                  res.data.mainAccount.uniqueId,
                avatarUrl: res.data.mainAccount.avatarUrl || null,
              }
            : null;

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

        setIsSetupModalOpen(true);
      } catch (err) {
        console.error("Failed to load account configuration:", err);
        setIsSetupModalOpen(true);
      }
    }
    loadConfiguration();
  }, []);

  // Fetch accounts list when search term changes
  useEffect(() => {
    async function fetchAccounts() {
      try {
        const query = searchTerm ? `search=${encodeURIComponent(searchTerm)}` : "";
        const res = await apiFetch<any>(`${API_ENDPOINTS.accounts.list}?size=100&${query}`);
        const content =
          res.success && res.data && Array.isArray(res.data.content) ? res.data.content : [];

        const mapped = content.map((acc: any) => ({
          username: acc.uniqueId,
          influencerId: acc.influencerId,
          type: acc.trackingType || "inspiration",
          displayName: acc.displayName || acc.nickname || acc.uniqueId,
          avatarUrl: acc.avatarUrl || null,
        }));

        setAccounts((prev) => {
          const merged = [...mapped];
          if (
            selectedMainAccount &&
            !merged.some((a) => a.influencerId.toString() === selectedMainAccount.influencerId.toString())
          ) {
            merged.push(selectedMainAccount);
          }
          selectedCompetitors.forEach((comp) => {
            if (comp && !merged.some((a) => a.influencerId.toString() === comp.influencerId.toString())) {
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

      const activeAcc = accounts.find((a) => a.username === accountFilter);
      const influencerId = activeAcc ? activeAcc.influencerId : null;

      try {
        const contentTrendMainId = influencerId || "";
        const contentTrendCompIds = selectedCompetitors
          .map((c: any) => c.influencerId)
          .filter(Boolean)
          .join(",");
        const contentTrendUrl = `${API_ENDPOINTS.analytics.contentTrend}?mainInfluencerId=${contentTrendMainId}${
          contentTrendCompIds ? `&competitorIds=${contentTrendCompIds}` : ""
        }`;

        const [
          histRes,
          perfRes,
          schedRes,
          recsRes,
          hashRes,
          keyRes,
          forecastRes,
          lstmRes,
          corrRes,
          revenueRes,
        ] = await Promise.all([
          apiFetch<any[]>(
            `${API_ENDPOINTS.analytics.historical}?influencerId=${influencerId || ""}&periodType=${period}`
          ).catch(() => null),
          apiFetch<any[]>(
            `${API_ENDPOINTS.analytics.contentPerformance}?influencerId=${influencerId || ""}`
          ).catch(() => null),
          apiFetch<any[]>(
            `${API_ENDPOINTS.analytics.optimalSchedule}?influencerId=${influencerId || ""}`
          ).catch(() => null),
          apiFetch<any[]>(
            `${API_ENDPOINTS.analytics.contentRecommend}?influencerId=${influencerId || ""}`
          ).catch(() => null),
          apiFetch<any[]>(
            `${API_ENDPOINTS.hashtags.recommend}?accountId=${influencerId || ""}`
          ).catch(() => null),
          apiFetch<any[]>(
            `${API_ENDPOINTS.summary.keywords}?influencerId=${influencerId || ""}`
          ).catch(() => null),
          apiFetch<any[]>(contentTrendUrl).catch(() => null),
          apiFetch<any[]>(
            `${API_ENDPOINTS.analytics.forecast}?influencerId=${influencerId || ""}`
          ).catch(() => null),
          apiFetch<any>(
            `${API_ENDPOINTS.analytics.correlation}?influencerId=${influencerId || ""}`
          ).catch(() => null),
          apiFetch<any>(
            `${API_ENDPOINTS.analytics.revenueAnalysis}?influencerId=${influencerId || ""}`
          ).catch(() => null),
        ]);

        if (histRes?.success && Array.isArray(histRes.data)) {
          if (histRes.data.length > 0) {
            const mapped = histRes.data.map((d: any) => ({
              date: d.date ? d.date.substring(5, 10).split("-").reverse().join("/") : "",
              videos: d.totalVideos ?? 0,
              views: d.totalViews ?? 0,
              likes: d.totalLikes ?? 0,
              comments: d.totalComments ?? 0,
              shares: d.totalShares ?? 0,
              engagement: parseFloat(((d.avgEngagementRate ?? 0) * 100).toFixed(1)),
              viralProb: parseFloat((d.avgViralProbability ?? 0).toFixed(2)),
            }));
            setHistoricalData(mapped);
          } else {
            setHistoricalData([]);
          }
        } else {
          setHistoricalData(HISTORICAL);
        }

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

        if (schedRes?.success && Array.isArray(schedRes.data)) {
          setOptimalSchedule(schedRes.data);

          if (schedRes.data.length > 0) {
            const matrix: number[][] = Array.from({ length: 7 }, () => Array(6).fill(0));
            schedRes.data.forEach((rec: any) => {
              const dayIdx = rec.dayOfWeek === 0 ? 6 : rec.dayOfWeek - 1;
              let slotIdx = 5;
              const hour = rec.hourOfDay;
              if (hour >= 6 && hour < 9) slotIdx = 0;
              else if (hour >= 9 && hour < 12) slotIdx = 1;
              else if (hour >= 12 && hour < 15) slotIdx = 2;
              else if (hour >= 15 && hour < 18) slotIdx = 3;
              else if (hour >= 18 && hour < 21) slotIdx = 4;

              matrix[dayIdx][slotIdx] = parseFloat((rec.expectedEngagementRate * 100).toFixed(1));
            });
            setHeatmapMatrix(matrix);

            const DAY_MAP_SHORT: Record<string, string> = {
              Monday: "Sen",
              Tuesday: "Sel",
              Wednesday: "Rab",
              Thursday: "Kam",
              Friday: "Jum",
              Saturday: "Sab",
              Sunday: "Min",
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

        if (recsRes?.success && Array.isArray(recsRes.data)) {
          if (recsRes.data.length > 0) {
            const mapped = recsRes.data.map((rec: any) => ({
              id: rec.recId,
              priority: (rec.priorityLevel || "medium").toLowerCase(),
              type: rec.contentType || "Tutorial Series",
              title: rec.recommendationTitle || "ML Recommendation",
              description: rec.description || "",
              rationale: rec.rationale || "",
              keywords: rec.suggestedKeywords
                ? rec.suggestedKeywords.split(",").map((s: string) => s.trim())
                : [],
              hashtags: rec.suggestedHashtags
                ? rec.suggestedHashtags.split(",").map((s: string) => s.trim())
                : [],
              duration: rec.suggestedDuration ? `${rec.suggestedDuration} menit` : "3-5 menit",
              expectedReach: rec.expectedEngagement
                ? `Est. Eng Rate: ${(rec.expectedEngagement * 100).toFixed(1)}%`
                : "",
              confidence: parseFloat((rec.confidenceScore || 0.8).toFixed(2)),
            }));
            setContentRecs(mapped);
          } else {
            setContentRecs([]);
          }
        } else {
          setContentRecs(RECOMMENDATIONS);
        }

        if (hashRes?.success && Array.isArray(hashRes.data)) {
          setHashtagRecommendations(hashRes.data);
        } else {
          setHashtagRecommendations([]);
        }

        if (keyRes?.success && Array.isArray(keyRes.data)) {
          setKeywordRecommendations(keyRes.data);
        } else {
          setKeywordRecommendations([]);
        }

        if (forecastRes?.success && Array.isArray(forecastRes.data)) {
          setForecastData(forecastRes.data);
        } else {
          setForecastData([]);
        }

        if (lstmRes?.success && Array.isArray(lstmRes.data) && lstmRes.data.length > 0) {
          const lstmPoints = lstmRes.data.map((d: any) => ({
            date: d.forecastDate || "",
            predictedViews: d.predictedViews || 0,
            predictedLikes: d.predictedLikes || 0,
            predictedComments: d.predictedComments || 0,
            predictedShares: d.predictedShares || 0,
            isForecast: true,
          }));
          setLstmForecastData(lstmPoints);
        } else {
          setLstmForecastData([]);
        }

        if (corrRes?.success && corrRes.data) {
          setCorrelationData(corrRes.data);
        } else {
          setCorrelationData({ features: [], matrix: [] });
        }

        if (revenueRes?.success && revenueRes.data) {
          setRevenueData(revenueRes.data);
        } else {
          setRevenueData(null);
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
      }
    }

    loadAnalyticsData();
  }, [accountFilter, period, accounts]);

  useEffect(() => {
    if (!selectedMainAccount) return;
    if (activeTab === "main") {
      setAccountFilter(selectedMainAccount.username);
    } else if (activeTab === "competitors" && activeCompetitorUsername) {
      setAccountFilter(activeCompetitorUsername);
    }
  }, [activeTab, activeCompetitorUsername, selectedMainAccount]);

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
        <div className="w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto relative border border-stone-200 dark:border-neutral-800">
          {isAnalyzing && (
            <div className="absolute inset-0 z-10 rounded-3xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 animate-fade-in">
              <div className="relative flex items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-stone-900 dark:bg-stone-100 flex items-center justify-center shadow-2xl">
                  <BrainCircuit
                    className="w-10 h-10 text-white dark:text-stone-900 animate-spin"
                    style={{ animationDuration: "3s" }}
                  />
                </div>
              </div>

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
                        background:
                          isDone || isActive ? "rgba(0,0,0,0.04)" : "transparent",
                        opacity: isDone || isActive ? 1 : 0.3,
                        transform: isActive ? "scale(1.02)" : "scale(1)",
                      }}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isDone
                            ? "bg-emerald-600 text-white"
                            : isActive
                            ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                            : "bg-stone-200 text-stone-400 dark:bg-neutral-800"
                        }`}
                      >
                        {isDone ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <StepIcon className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          isDone || isActive
                            ? "text-stone-900 dark:text-white"
                            : "text-stone-400"
                        }`}
                      >
                        {step.text}
                      </span>
                      {isActive && (
                        <Loader2 className="w-3.5 h-3.5 ml-auto animate-spin text-stone-400" />
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-stone-400 font-medium animate-pulse">
                Sedang mempersiapkan analisis privat...
              </p>
            </div>
          )}

          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-black tracking-tight text-stone-900 dark:text-white uppercase">
                Private Analysis Configuration
              </h2>
              <p className="text-xs mt-1 text-stone-500 dark:text-neutral-400">
                Konfigurasikan akun utama Anda dan kompetitor untuk memproses data model ML.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsSetupModalOpen(false)}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-stone-100 dark:hover:bg-neutral-800 text-stone-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Cari username atau nama akun pelacakan..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-200 dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-800 text-xs font-semibold outline-none focus:border-stone-900 dark:focus:border-stone-100 transition-all text-stone-900 dark:text-white"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[280px]">
            <div className="flex flex-col gap-2 min-w-0">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Main Account (Akun Utama - Pilih 1)
              </label>
              <div className="flex-1 border border-stone-200 dark:border-neutral-800 rounded-2xl p-2.5 space-y-1 overflow-y-auto max-h-[300px]">
                {renderedMainAccounts.length === 0 ? (
                  <p className="text-xs text-stone-400 italic text-center py-8">
                    Tidak ada akun yang cocok
                  </p>
                ) : (
                  renderedMainAccounts.map((acc: any) => {
                    const isSelected = tempMainId === acc.influencerId.toString();
                    return (
                      <button
                        key={acc.influencerId}
                        type="button"
                        onClick={() => {
                          setTempMainId(acc.influencerId.toString());
                          setTempCompIds((prev) =>
                            prev.filter((id) => id !== acc.influencerId.toString())
                          );
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all text-left border ${
                          isSelected
                            ? "border-stone-900 bg-stone-100/80 dark:border-stone-100 dark:bg-neutral-800"
                            : "border-transparent hover:bg-stone-50 dark:hover:bg-neutral-800/40"
                        }`}
                      >
                        <SafeAvatar
                          src={acc.avatarUrl}
                          username={acc.username}
                          alt={acc.displayName}
                          size={28}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                            @{acc.username}
                          </p>
                          <p className="text-[10px] text-stone-400 truncate">{acc.displayName}</p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? "border-stone-900 dark:border-stone-100"
                              : "border-stone-300 dark:border-neutral-700"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-stone-900 dark:bg-stone-100" />
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-0">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Competitors (Maks 5)
                </label>
                <span className="text-[10px] font-mono font-bold text-stone-400">
                  {tempCompIds.length}/5 selected
                </span>
              </div>
              <div className="flex-1 border border-stone-200 dark:border-neutral-800 rounded-2xl p-2.5 space-y-1 overflow-y-auto max-h-[300px]">
                {renderedCompetitors.length === 0 ? (
                  <p className="text-xs text-stone-400 italic text-center py-8">
                    Tidak ada competitor yang cocok
                  </p>
                ) : (
                  renderedCompetitors.map((acc: any) => {
                    const isChecked = tempCompIds.includes(acc.influencerId.toString());
                    return (
                      <button
                        key={acc.influencerId}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setTempCompIds((prev) =>
                              prev.filter((id) => id !== acc.influencerId.toString())
                            );
                          } else {
                            if (tempCompIds.length >= 5) {
                              alert("Anda hanya dapat memilih maksimal 5 akun kompetitor!");
                              return;
                            }
                            setTempCompIds((prev) => [...prev, acc.influencerId.toString()]);
                          }
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all text-left border ${
                          isChecked
                            ? "border-stone-900 bg-stone-100/80 dark:border-stone-100 dark:bg-neutral-800"
                            : "border-transparent hover:bg-stone-50 dark:hover:bg-neutral-800/40"
                        }`}
                      >
                        <SafeAvatar
                          src={acc.avatarUrl}
                          username={acc.username}
                          alt={acc.displayName}
                          size={28}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                            @{acc.username}
                          </p>
                          <p className="text-[10px] text-stone-400 truncate">{acc.displayName}</p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                            isChecked
                              ? "border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
                              : "border-stone-300 dark:border-neutral-700"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 pt-2 border-t border-stone-200/80 dark:border-neutral-800">
            {selectedMainAccount && (
              <button
                type="button"
                onClick={() => setIsSetupModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold border border-stone-200 dark:border-neutral-800 text-stone-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Batal
              </button>
            )}
            <button
              type="button"
              disabled={!tempMainId || isAnalyzing}
              onClick={handleSaveSetup}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-40"
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center bg-stone-50/50 dark:bg-neutral-900/50 m-6 rounded-2xl border border-dashed border-stone-300 dark:border-neutral-800">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-stone-100 dark:bg-neutral-800 text-stone-400">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-black text-stone-900 dark:text-white uppercase tracking-tight">
              Setup Private Analysis
            </h3>
            <p className="text-xs max-w-sm mt-1 text-stone-500 dark:text-neutral-400">
              Silakan konfigurasikan akun utama Anda dan kompetitor untuk memulai analisis performa
              privat dengan machine learning.
            </p>
          </div>
          <button
            onClick={openSetupModal}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 shadow-sm transition-all"
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

      {/* ── Active Configuration Strip ── */}
      <div className="mx-6 mt-5 p-3.5 rounded-2xl bg-white/90 dark:bg-neutral-900/90 border border-stone-200/80 dark:border-neutral-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Main Account:
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-bold shadow-sm">
              <SafeAvatar
                src={selectedMainAccount.avatarUrl}
                username={selectedMainAccount.username}
                alt={selectedMainAccount.displayName}
                size={16}
              />
              @{selectedMainAccount.username}
            </div>
          </div>

          {selectedCompetitors.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Competitors:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedCompetitors.map((comp) => (
                  <div
                    key={comp.influencerId}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-neutral-800 border border-stone-200/80 dark:border-neutral-700 text-stone-800 dark:text-neutral-200 text-[11px] font-medium"
                  >
                    <SafeAvatar
                      src={comp.avatarUrl}
                      username={comp.username}
                      alt={comp.displayName}
                      size={14}
                    />
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
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={openSetupModal}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-stone-200 dark:border-neutral-800 text-stone-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Configure
          </button>
        </div>
      </div>

      {/* ── Tab Selection ── */}
      <div className="mx-6 mt-4 flex border-b border-stone-200/80 dark:border-neutral-800">
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
                if (
                  t.key === "competitors" &&
                  !activeCompetitorUsername &&
                  selectedCompetitors.length > 0
                ) {
                  setActiveCompetitorUsername(selectedCompetitors[0].username);
                }
              }}
              className={`px-5 py-3 text-xs font-bold transition-all border-b-2 outline-none cursor-pointer ${
                isActive
                  ? "border-stone-900 dark:border-stone-100 text-stone-900 dark:text-white"
                  : "border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-neutral-300"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === "competitors" && (
        <div className="mx-6 mt-3 p-2.5 bg-stone-50 dark:bg-neutral-900 rounded-xl border border-stone-200/80 dark:border-neutral-800 flex items-center gap-3 animate-fade-in">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider pl-1">
            Active Competitor:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {selectedCompetitors.length === 0 ? (
              <span className="text-xs text-stone-400 italic">
                Belum ada kompetitor yang dikonfigurasi.
              </span>
            ) : (
              selectedCompetitors.map((comp) => {
                const isActive = activeCompetitorUsername === comp.username;
                return (
                    <button
                    key={comp.influencerId}
                    onClick={() => setActiveCompetitorUsername(comp.username)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                      isActive
                        ? "bg-stone-900 border-stone-900 text-white dark:bg-stone-100 dark:border-stone-100 dark:text-stone-900 shadow-sm"
                        : "bg-white border-stone-200 text-stone-700 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 hover:bg-stone-50"
                    }`}
                  >
                    <SafeAvatar
                      src={comp.avatarUrl}
                      username={comp.username}
                      alt={comp.displayName}
                      size={14}
                    />
                    @{comp.username}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === "main" || activeTab === "competitors" ? (
        <>
          <AnalyticsSectionNav />

          <div className="p-6 space-y-8 animate-fade-in">
            {/* SECTION 1: OVERVIEW & FORECAST */}
            <section id="overview" className="scroll-mt-40 space-y-5">
              <SectionLabel
                icon={Activity}
                title="Executive Overview & Forecast"
                subtitle={`Periode: ${period} · ${
                  accountFilter === "all" ? "semua akun" : `@${accountFilter}`
                }`}
              />

              {/* KPI Row */}
              <KpiRow data={historicalData} />

              {/* 2-Column Grid: Proyeksi Tren Kategori (Left) + Proyeksi Metrik Konten (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <EngagementForecast
                  data={forecastData}
                  loading={isLoadingForecast}
                  hasMainAccount={!!selectedMainAccount}
                  hashtagRecs={hashtagRecommendations}
                  postingTimeRecs={optimalSchedule}
                />

                <LSTMForecast
                  data={lstmForecastData}
                  historicalData={historicalData}
                  loading={isLoadingLstm}
                />
              </div>
            </section>

            {/* SECTION 2: TACTICAL SYNERGY & SCHEDULE */}
            <section id="synergy" className="scroll-mt-40 space-y-5">
              <SectionLabel
                icon={Sparkles}
                title="Tactical ML Synergy & Optimal Schedule"
                subtitle={`Rekomendasi taktis berbasis algoritma ML dan analisis NLP untuk @${accountFilter}`}
              />

              {/* 2-Column Bento Grid: ML Synergy Hub (Left) + Optimal Schedule Window (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <TacticalSynergyHub
                    hashtags={hashtagRecommendations}
                    keywords={keywordRecommendations}
                    postingTimes={optimalSchedule}
                    contentRecs={contentRecs}
                    onOpenRec={(rec) => setOpenRec(rec)}
                    loading={isLoadingRecommendations}
                  />
                </div>
                <div className="lg:col-span-5">
                  <OptimalScheduleWindow
                    heatmap={heatmapMatrix}
                    topSlots={topSlots}
                  />
                </div>
              </div>
            </section>

            {/* SECTION 3: CONTENT PERFORMANCE MATRIX */}
            <section id="performance" className="scroll-mt-40 space-y-5">
              <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-stone-200/80 dark:border-neutral-800">
                  <SectionLabel
                    icon={ListChecks}
                    title="Content Performance Matrix"
                    subtitle={`${sortedPerformance.length} video · joined dengan ML predictions (viral prob, tier, cluster)`}
                    action={
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                          Sort:
                        </span>
                        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-stone-100 dark:bg-neutral-800 border border-stone-200/60 dark:border-neutral-700">
                          {SORT_OPTIONS.map((s) => {
                            const sel = sortBy === s.key;
                            return (
                              <button
                                key={s.key}
                                type="button"
                                onClick={() => setSortBy(s.key)}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                                  sel
                                    ? "bg-white dark:bg-neutral-900 text-stone-900 dark:text-white shadow-sm"
                                    : "text-stone-500 dark:text-neutral-400 hover:text-stone-900"
                                }`}
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
            </section>
          </div>
        </>
      ) : (
        /* COMPARISON TAB */
        <div className="p-6 space-y-6 animate-fade-in">
          {isLoadingComparison ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
              <p className="text-xs font-bold text-stone-400">
                Memproses perbandingan metrik...
              </p>
            </div>
          ) : (
            <>
              {/* Benchmark Summary cards */}
              {computedBenchmarkData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-stone-200/80 dark:border-neutral-800 flex flex-col justify-between gap-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        Own Average Score
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-50 text-sky-600 border border-sky-200/60 dark:bg-sky-950/40 dark:text-sky-400">
                        Akun Anda
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono text-stone-900 dark:text-white">
                        {(computedBenchmarkData.ownAverageScore || 0).toFixed(1)}
                      </span>
                      <span className="text-xs text-stone-400">pts</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-stone-200/80 dark:border-neutral-800 flex flex-col justify-between gap-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        Competitor Average Score
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-stone-100 text-stone-600 border border-stone-200 dark:bg-neutral-800 dark:text-neutral-400">
                        Kompetitor
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono text-stone-900 dark:text-white">
                        {(computedBenchmarkData.competitorAverageScore || 0).toFixed(1)}
                      </span>
                      <span className="text-xs text-stone-400">pts</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-stone-200/80 dark:border-neutral-800 flex flex-col justify-between gap-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        Score Gap
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold border flex items-center gap-1 ${
                          computedBenchmarkData.gapScore >= 0
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-rose-50 text-rose-600 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400"
                        }`}
                      >
                        {computedBenchmarkData.gapScore >= 0 ? (
                          <TrendingUp className="w-2.5 h-2.5" />
                        ) : (
                          <TrendingDown className="w-2.5 h-2.5" />
                        )}
                        {computedBenchmarkData.gapScore >= 0 ? "Unggul" : "Tertinggal"}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-2xl font-black font-mono ${
                          computedBenchmarkData.gapScore >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {computedBenchmarkData.gapScore >= 0 ? "+" : ""}
                        {(computedBenchmarkData.gapScore || 0).toFixed(1)}
                      </span>
                      <span className="text-xs text-stone-400">pts vs kompetitor</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Unified Recharts ComposedChart (Bar + Line) */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-stone-200/80 dark:border-neutral-800 p-6 flex flex-col gap-4 shadow-sm">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-tight">
                      Visualisasi Perbandingan Terpadu (Bar + Line)
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-neutral-400">
                      Perbandingan Total Views & Followers (Bar) dengan Skor Performa & Engagement (Line)
                    </p>
                  </div>

                  {/* Interactive Legend Filters */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => toggleCompSeries("views")}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                        compVisibleSeries.views
                          ? "bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800"
                          : "bg-stone-50 text-stone-400 border-stone-200 dark:bg-neutral-800 opacity-50"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-xs bg-sky-500" />
                      <span>Total Views (Bar)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleCompSeries("followers")}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                        compVisibleSeries.followers
                          ? "bg-slate-50 text-slate-700 border-slate-300 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-700"
                          : "bg-stone-50 text-stone-400 border-stone-200 dark:bg-neutral-800 opacity-50"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-xs bg-slate-400" />
                      <span>Followers (Bar)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleCompSeries("score")}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                        compVisibleSeries.score
                          ? "bg-violet-50 text-violet-700 border-violet-300 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800"
                          : "bg-stone-50 text-stone-400 border-stone-200 dark:bg-neutral-800 opacity-50"
                      }`}
                    >
                      <span className="w-2 h-0.5 bg-violet-500" />
                      <span>Performance Score (Line)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleCompSeries("engagement")}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                        compVisibleSeries.engagement
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                          : "bg-stone-50 text-stone-400 border-stone-200 dark:bg-neutral-800 opacity-50"
                      }`}
                    >
                      <span className="w-2 h-0.5 bg-emerald-500" />
                      <span>Engagement Rate (Line)</span>
                    </button>
                  </div>
                </div>

                <div style={{ height: 300 }} className="w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={comparisonChartData}
                      margin={{ top: 12, right: 12, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fontWeight: 700, fill: "#78716c" }}
                        axisLine={{ stroke: "#e7e5e4" }}
                        tickLine={false}
                      />
                      {/* Left Y-Axis for Volume (Views & Followers) */}
                      <YAxis
                        yAxisId="volume"
                        orientation="left"
                        tick={{ fontSize: 10, fontWeight: 600, fill: "#0ea5e9" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={formatNum}
                      />
                      {/* Right Y-Axis for Scores & Rates (0-100) */}
                      <YAxis
                        yAxisId="rates"
                        orientation="right"
                        tick={{ fontSize: 10, fontWeight: 600, fill: "#8b5cf6" }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 100]}
                        tickFormatter={(v) => `${v}`}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(14, 165, 233, 0.04)" }}
                        content={({ active, payload }) => {
                          if (!active || !payload || !payload.length) return null;
                          const dataPoint = payload[0]?.payload;

                          return (
                            <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-xl p-3 shadow-lg text-xs space-y-2 min-w-[200px]">
                              <div className="flex items-center justify-between pb-1.5 border-b border-stone-100 dark:border-neutral-800">
                                <span className="font-bold text-stone-900 dark:text-white">
                                  {dataPoint.name}
                                </span>
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    dataPoint.isOwn
                                      ? "bg-sky-50 text-sky-600 border border-sky-200/60 dark:bg-sky-950/40 dark:text-sky-400"
                                      : "bg-stone-100 text-stone-600 dark:bg-neutral-800 dark:text-neutral-300"
                                  }`}
                                >
                                  {dataPoint.isOwn ? "Akun Anda" : "Kompetitor"}
                                </span>
                              </div>

                              <div className="space-y-1.5 font-mono text-[11px]">
                                <div className="flex items-center justify-between">
                                  <span className="text-sky-600 font-bold flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-xs bg-sky-500" />
                                    Total Views:
                                  </span>
                                  <span className="font-bold text-stone-900 dark:text-white">
                                    {formatNum(dataPoint.views)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-600 dark:text-slate-400 font-bold flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-xs bg-slate-400" />
                                    Followers:
                                  </span>
                                  <span className="font-bold text-stone-900 dark:text-white">
                                    {formatNum(dataPoint.followers)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-violet-600 font-bold flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                                    Score:
                                  </span>
                                  <span className="font-bold text-stone-900 dark:text-white">
                                    {dataPoint.score} pts
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    Engagement:
                                  </span>
                                  <span className="font-bold text-stone-900 dark:text-white">
                                    {dataPoint.engagement}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }}
                      />

                      {/* Bar 1: Total Views (Sky Blue) */}
                      {compVisibleSeries.views && (
                        <Bar
                          yAxisId="volume"
                          dataKey="views"
                          name="Total Views"
                          fill="#0ea5e9"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={28}
                        />
                      )}

                      {/* Bar 2: Followers (Slate) */}
                      {compVisibleSeries.followers && (
                        <Bar
                          yAxisId="volume"
                          dataKey="followers"
                          name="Followers"
                          fill="#94a3b8"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={28}
                        />
                      )}

                      {/* Line 1: Performance Score (Violet) */}
                      {compVisibleSeries.score && (
                        <Line
                          yAxisId="rates"
                          type="monotone"
                          dataKey="score"
                          name="Performance Score"
                          stroke="#8b5cf6"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: "#8b5cf6", stroke: "#ffffff", strokeWidth: 2 }}
                          activeDot={{ r: 6, fill: "#8b5cf6", stroke: "#ffffff", strokeWidth: 2 }}
                        />
                      )}

                      {/* Line 2: Engagement Rate (Emerald) */}
                      {compVisibleSeries.engagement && (
                        <Line
                          yAxisId="rates"
                          type="monotone"
                          dataKey="engagement"
                          name="Engagement Rate"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
                          activeDot={{ r: 6, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
                        />
                      )}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Comparison ranking leaderboard table */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-stone-200/80 dark:border-neutral-800 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-stone-200/80 dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-950/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-neutral-400">
                    Tabel Peringkat Performa Pelacakan
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200/80 dark:border-neutral-800">
                        {[
                          "#",
                          "Akun",
                          "Followers",
                          "Total Video",
                          "Total Views",
                          "Avg Engagement",
                          "Performance Score",
                        ].map((h, i) => (
                          <th
                            key={i}
                            className="px-6 py-3.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-neutral-800">
                      {filteredComparisonData
                        .sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0))
                        .map((row, idx) => {
                          const isOwn = row.trackingType === "own";
                          return (
                            <tr
                              key={row.influencerId}
                              className={`transition-colors hover:bg-stone-50/70 dark:hover:bg-neutral-800/40 ${
                                isOwn ? "bg-sky-50/20 dark:bg-sky-950/10" : ""
                              }`}
                            >
                              <td className="px-6 py-4 text-xs font-mono font-bold text-stone-900 dark:text-white">
                                #{idx + 1}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2.5">
                                  <SafeAvatar
                                    src={row.avatarUrl}
                                    username={row.uniqueId}
                                    alt={row.displayName}
                                    size={28}
                                  />
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-stone-900 dark:text-white">
                                        @{row.uniqueId}
                                      </span>
                                      {isOwn && (
                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold text-sky-600 bg-sky-50 border border-sky-200/60 dark:bg-sky-950/40 dark:text-sky-400 uppercase">
                                          Anda
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-stone-400">
                                      {row.displayName}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-xs font-mono font-medium text-stone-700 dark:text-neutral-300">
                                {(row.followerCountNum || 0).toLocaleString("id-ID")}
                              </td>
                              <td className="px-6 py-4 text-xs font-mono font-medium text-stone-700 dark:text-neutral-300">
                                {(row.totalVideos || 0).toLocaleString("id-ID")}
                              </td>
                              <td className="px-6 py-4 text-xs font-mono font-medium text-stone-700 dark:text-neutral-300">
                                {(row.totalViews || 0).toLocaleString("id-ID")}
                              </td>
                              <td className="px-6 py-4 text-xs font-mono font-bold">
                                <span
                                  className={`px-2 py-0.5 rounded border text-[10px] ${
                                    (row.averageEngagementRate || 0) >= 0.07
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400"
                                      : "bg-amber-50 text-amber-600 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-400"
                                  }`}
                                >
                                  {((row.averageEngagementRate || 0) * 100).toFixed(1)}%
                                </span>
                              </td>
                              <td className="px-6 py-4 text-xs font-mono font-black text-stone-900 dark:text-white">
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
