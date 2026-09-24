'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Filter, ChevronDown, Wand2, Loader2, Clock, Sparkles, Lightbulb, Users, Check, AlertCircle, TrendingUp, TrendingDown,
  Target, Hash, CalendarClock, Search, BarChart2, RefreshCw, MessageSquare, ArrowRight, BookOpen, Layers, LayoutGrid, Award,
  Smile, Utensils, Home, Monitor, Video, Brain, Cpu, Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageShell } from '@/components/layout/PageShell';
import { Mono } from '@/components/dashboard';
import { TOKENS } from '@/lib/design-tokens';
import {
  SummaryMetricCards,
  SummaryCard,
  InsightCards,
  KeywordCloud,
  TopHashtagsList,
  SentimentBreakdown,
  TopVideosList,
  GenerateSummaryDialog
} from '@/components/nlp-insight';
import { initialsFrom } from '@/components/nlp-insight/WeeklySummary';
import { apiFetch } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/endpoints';
import { exportNlpInsightPdf } from '@/lib/nlp-insight/export-pdf';
import { FileDown } from 'lucide-react';
import { resolveAvatarUrl } from '@/lib/utils';

const CATEGORY_PALETTE: Record<
  string,
  { color: string; border: string; bg: string; text: string; lightBg: string; icon: React.ElementType }
> = {
  Edukasi: {
    color: '#0284c7',
    border: 'border-sky-200 dark:border-sky-800/80',
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    text: 'text-sky-700 dark:text-sky-300',
    lightBg: 'bg-sky-50/50 dark:bg-sky-950/20',
    icon: BookOpen,
  },
  Komedi: {
    color: '#d97706',
    border: 'border-amber-200 dark:border-amber-800/80',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    lightBg: 'bg-amber-50/50 dark:bg-amber-950/20',
    icon: Smile,
  },
  Kuliner: {
    color: '#e11d48',
    border: 'border-rose-200 dark:border-rose-800/80',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    lightBg: 'bg-rose-50/50 dark:bg-rose-950/20',
    icon: Utensils,
  },
  'Lifestyle & Home': {
    color: '#059669',
    border: 'border-emerald-200 dark:border-emerald-800/80',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    lightBg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    icon: Home,
  },
  Lifestyle: {
    color: '#059669',
    border: 'border-emerald-200 dark:border-emerald-800/80',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    lightBg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    icon: Home,
  },
  Teknologi: {
    color: '#7c3aed',
    border: 'border-purple-200 dark:border-purple-800/80',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-300',
    lightBg: 'bg-purple-50/50 dark:bg-purple-950/20',
    icon: Monitor,
  },
  Gaming: {
    color: '#db2777',
    border: 'border-pink-200 dark:border-pink-800/80',
    bg: 'bg-pink-50 dark:bg-pink-950/40',
    text: 'text-pink-700 dark:text-pink-300',
    lightBg: 'bg-pink-50/50 dark:bg-pink-950/20',
    icon: Layers,
  },
};

function getCategoryMeta(cat: string) {
  if (CATEGORY_PALETTE[cat]) return CATEGORY_PALETTE[cat];
  const keys = Object.keys(CATEGORY_PALETTE);
  const foundKey = keys.find(k => cat.toLowerCase().includes(k.toLowerCase()));
  if (foundKey) return CATEGORY_PALETTE[foundKey];
  return {
    color: '#0f766e',
    border: 'border-teal-200 dark:border-teal-800/80',
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    text: 'text-teal-700 dark:text-teal-300',
    lightBg: 'bg-teal-50/50 dark:bg-teal-950/20',
    icon: Layers,
  };
}

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

function NlpProcessingLoader() {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = useMemo(() => [
    { label: "Mengekstrak teks caption, hashtag & kata kunci...", icon: Search, sub: "KeyBERT & spaCy Tokenizer Engine" },
    { label: "Menganalisis sentimen komentar & emosi audiens...", icon: Sparkles, sub: "IndoBERT Sentiment Classifier" },
    { label: "Mengalkulasi benchmark akun utama vs kompetitor...", icon: BarChart2, sub: "Comparative Engagement Analytics" },
    { label: "Menyusun proyeksi tren 7 hari & rekomendasi taktis...", icon: Brain, sub: "Machine Learning Opportunity Forecasting" },
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 1300);
    return () => clearInterval(timer);
  }, [steps.length]);

  const CurrentIcon = steps[stepIndex].icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] px-4">
      <div className="relative flex flex-col items-center max-w-md w-full text-center">
        {/* Animated pulsing rings & Central Icon */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute -inset-4 rounded-full bg-sky-400/20 dark:bg-sky-500/10 blur-xl animate-pulse" />
          <div className="absolute w-24 h-24 rounded-full border border-sky-300/40 dark:border-sky-500/20 animate-ping opacity-30" style={{ animationDuration: '2.5s' }} />
          <div className="absolute w-20 h-20 rounded-2xl border border-stone-200 dark:border-neutral-700 animate-spin" style={{ animationDuration: '10s' }} />
          
          <div className="relative w-16 h-16 rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-700 shadow-md flex items-center justify-center text-stone-900 dark:text-white">
            <CurrentIcon className="w-7 h-7 text-sky-500 animate-pulse transition-all duration-300" />
          </div>
        </div>

        {/* Dynamic Step Text */}
        <div className="space-y-1.5 min-h-[56px]">
          <h3 className="text-sm md:text-base font-bold text-stone-900 dark:text-white transition-all duration-300">
            {steps[stepIndex].label}
          </h3>
          <p className="text-[11px] font-mono text-stone-400 dark:text-neutral-500">
            {steps[stepIndex].sub}
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-56 bg-stone-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden my-4 relative">
          <div
            className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-sky-400 rounded-full transition-all duration-500 ease-in-out"
            style={{
              width: `${((stepIndex + 1) / steps.length) * 100}%`,
            }}
          />
        </div>

        {/* Step Indicator Badges */}
        <div className="flex items-center gap-1.5 mt-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === stepIndex
                  ? 'w-6 bg-stone-900 dark:bg-white'
                  : i < stepIndex
                  ? 'w-2 bg-sky-400 dark:bg-sky-500'
                  : 'w-2 bg-stone-200 dark:bg-neutral-800'
              }`}
            />
          ))}
        </div>

        {/* Floating tech badges */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-6 pt-4 border-t border-stone-100 dark:border-neutral-800/80 max-w-xs">
          {['Natural Language Processing', 'KeyBERT', 'IndoBERT', 'Sentiment ML', 'Trend Projection'].map((tag) => (
            <span
              key={tag}
              className="text-[9.5px] font-mono font-medium px-2 py-0.5 rounded-md bg-stone-50 dark:bg-neutral-850 text-stone-500 dark:text-neutral-400 border border-stone-200/50 dark:border-neutral-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NLPInsights() {
  const [period, setPeriod]               = useState<'weekly' | 'monthly'>('weekly');
  const [accountFilter, setAccountFilter] = useState('all');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen]   = useState(false);
  const [generating, setGenerating]   = useState(false);
  const [refreshing, setRefreshing]   = useState(false);
  const [activeTab, setActiveTab]     = useState<'benchmark' | 'categories' | 'strategy'>('benchmark');

  // API State
  const [summary, setSummary] = useState<any>(null);
  const [insightsData, setInsightsData] = useState<any[]>([]);
  const [keywordsData, setKeywordsData] = useState<any[]>([]);
  const [topHashtagsData, setTopHashtagsData] = useState<any[]>([]);
  const [topVideosData, setTopVideosData] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Comparative NLP States
  const [configuredMainId, setConfiguredMainId] = useState<string | null>(null);
  const [configuredCompIds, setConfiguredCompIds] = useState<string[]>([]);
  const [comparativeData, setComparativeData] = useState<{
    mainSummary: any;
    competitorSummaries: any[];
    mainKeywords: any[];
    competitorKeywords: any[];
    mainInsights: any[];
    competitorInsights: any[];
  } | null>(null);
  const [isLoadingComparative, setIsLoadingComparative] = useState(false);
  const [contentTrendData, setContentTrendData] = useState<any[]>([]);
  const [isLoadingContentTrend, setIsLoadingContentTrend] = useState(false);
  const [hashtagRecs, setHashtagRecs] = useState<any[]>([]);
  const [postingRecs, setPostingRecs] = useState<any[]>([]);
  const [nlpAnalyticsSummary, setNlpAnalyticsSummary] = useState<string>('');
  const [isLoadingNlp, setIsLoadingNlp] = useState(false);
  // Per-competitor content trend stats (mainAccount* fields = that competitor's stats)
  const [competitorStatsMap, setCompetitorStatsMap] = useState<Record<string, any>>({});

  // Load configured accounts on mount
  useEffect(() => {
    const mainId = localStorage.getItem("analytics_main_influencer_id");
    const compIdsRaw = localStorage.getItem("analytics_competitor_influencer_ids");
    if (mainId) setConfiguredMainId(mainId);
    if (compIdsRaw) {
      try {
        setConfiguredCompIds(JSON.parse(compIdsRaw));
      } catch (e) {}
    }
  }, []);

  const loadNlpData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch tracked accounts if not already loaded
      let accountsList = accounts;
      if (accountsList.length === 0) {
        const accountsRes = await apiFetch<any>(API_ENDPOINTS.accounts.list);
        if (accountsRes?.success && accountsRes.data?.content) {
          accountsList = accountsRes.data.content.map((a: any) => ({
            username: a.uniqueId,
            displayName: a.displayName || a.nickname || a.uniqueId,
            type: a.trackingType || 'competitor',
            influencerId: a.influencerId,
            avatarUrl: a.avatarUrl || a.avatarThumb || a.avatarMedium || null
          }));
          setAccounts(accountsList);
        }
      }

      // Find the influencerId from username filter
      let influencerId: number | string | undefined = undefined;
      if (accountFilter !== 'all') {
        const selected = accountsList.find(a => a.username === accountFilter);
        influencerId = selected?.influencerId;
      }

      const summaryEndpoint = period === 'weekly' ? API_ENDPOINTS.summary.weekly : API_ENDPOINTS.summary.monthly;

      // Comparative NLP fetching if filter is 'all'
      if (accountFilter === 'all') {
        const mainId = localStorage.getItem("analytics_main_influencer_id");
        const compIdsRaw = localStorage.getItem("analytics_competitor_influencer_ids");
        let compIds: string[] = [];
        if (compIdsRaw) {
          try { compIds = JSON.parse(compIdsRaw); } catch(e) {}
        }

        if (mainId) {
          setIsLoadingComparative(true);
          const mainSummaryUrl = `${summaryEndpoint}?influencerId=${mainId}`;
          const mainKeywordsUrl = `${API_ENDPOINTS.summary.keywords}?periodType=${period}&influencerId=${mainId}`;
          const mainInsightsUrl = `${API_ENDPOINTS.summary.insights}?periodType=${period}&influencerId=${mainId}`;

          const compSummariesPromises = compIds.map(id => apiFetch<any>(`${summaryEndpoint}?influencerId=${id}`).catch(() => null));
          const compKeywordsPromises = compIds.map(id => apiFetch<any>(`${API_ENDPOINTS.summary.keywords}?periodType=${period}&influencerId=${id}`).catch(() => null));
          const compInsightsPromises = compIds.map(id => apiFetch<any>(`${API_ENDPOINTS.summary.insights}?periodType=${period}&influencerId=${id}`).catch(() => null));

          const [
            mainSumRes, mainKeyRes, mainInsRes,
            compSums, compKeys, compInss
          ] = await Promise.all([
            // Try specific influencer first, fallback to cross-account (null)
            apiFetch<any>(mainSummaryUrl).catch(() => null).then(async r =>
              r?.success ? r : apiFetch<any>(summaryEndpoint).catch(() => null)
            ),
            apiFetch<any>(mainKeywordsUrl).catch(() => null).then(async r =>
              r?.success ? r : apiFetch<any>(`${API_ENDPOINTS.summary.keywords}?periodType=${period}`).catch(() => null)
            ),
            apiFetch<any>(mainInsightsUrl).catch(() => null).then(async r =>
              r?.success ? r : apiFetch<any>(`${API_ENDPOINTS.summary.insights}?periodType=${period}`).catch(() => null)
            ),
            Promise.all(compSummariesPromises),
            Promise.all(compKeywordsPromises),
            Promise.all(compInsightsPromises),
          ]);

          const mainSummary = mainSumRes?.success ? mainSumRes.data : null;
          const mainKeywords = mainKeyRes?.success ? mainKeyRes.data : [];
          const mainInsights = mainInsRes?.success ? mainInsRes.data : [];

          const competitorSummaries = compSums.map((res, i) => ({
            influencerId: compIds[i],
            data: res?.success ? res.data : null
          })).filter(c => c.data !== null);

          const competitorKeywords = compKeys.flatMap((res, i) => {
            const list = res?.success && Array.isArray(res.data) ? res.data : [];
            return list.map(item => ({ ...item, influencerId: compIds[i] }));
          });

          const competitorInsights = compInss.flatMap((res, i) => {
            const list = res?.success && Array.isArray(res.data) ? res.data : [];
            return list.map(item => ({ ...item, influencerId: compIds[i] }));
          });

          setComparativeData({
            mainSummary,
            competitorSummaries,
            mainKeywords,
            competitorKeywords,
            mainInsights,
            competitorInsights
          });
          setIsLoadingComparative(false);

          // Fetch Content Trend Intelligence (same endpoint as Analytics page)
          setIsLoadingContentTrend(true);
          const trendCompIds = compIds.join(",");
          const trendUrl = `${API_ENDPOINTS.analytics.contentTrend}?mainInfluencerId=${mainId}${trendCompIds ? `&competitorIds=${trendCompIds}` : ""}`;
          const trendRes = await apiFetch<any[]>(trendUrl).catch(() => null);
          if (trendRes?.success && Array.isArray(trendRes.data)) {
            setContentTrendData(trendRes.data);
          } else {
            setContentTrendData([]);
          }
          setIsLoadingContentTrend(false);

          // Fetch per-competitor stats in parallel (each comp as mainInfluencerId)
          if (compIds.length > 0) {
            const compStatsResults = await Promise.all(
              compIds.map(id =>
                apiFetch<any>(`${API_ENDPOINTS.analytics.contentTrend}?mainInfluencerId=${id}`)
                  .catch(() => null)
              )
            );
            const statsMap: Record<string, any> = {};
            compIds.forEach((id, i) => {
              const res = compStatsResults[i];
              if (res?.success && Array.isArray(res.data)) {
                const totalVideos = res.data.reduce((s: number, c: any) => s + (c.mainAccountVideoCount || 0), 0);
                const totalEngWeighted = res.data.reduce((s: number, c: any) => s + (c.mainAccountEngagementRate || 0) * (c.mainAccountVideoCount || 0), 0);
                const avgEng = totalVideos > 0 ? totalEngWeighted / totalVideos : 0;
                statsMap[id] = { totalVideos, avgEngagementRate: avgEng };
              }
            });
            setCompetitorStatsMap(statsMap);
          }

          // Fetch hashtag recommendations + optimal schedule for main account
          const [hashRes, schedRes] = await Promise.all([
            apiFetch<any>(`${API_ENDPOINTS.hashtags.recommend}?accountId=${mainId}`).catch(() => null),
            apiFetch<any>(`${API_ENDPOINTS.analytics.optimalSchedule}?influencerId=${mainId}`).catch(() => null),
          ]);
          const hashtagRecsData = hashRes?.success && Array.isArray(hashRes.data) ? hashRes.data : [];
          const postingRecsData = schedRes?.success && Array.isArray(schedRes.data) ? schedRes.data : [];
          setHashtagRecs(hashtagRecsData);
          setPostingRecs(postingRecsData);

          // Generate NLP narrative from Analytics data
          if (trendRes?.success && Array.isArray(trendRes.data) && trendRes.data.length > 0) {
            setIsLoadingNlp(true);
            const mainAccObj = accountsList.find((a: any) => a.influencerId?.toString() === mainId);
            const nlpPayload = {
              account_name: mainAccObj?.username || mainId,
              period,
              categories: trendRes.data.map((c: any) => ({
                category: c.category,
                trend_direction: c.trendDirection,
                potential_score: c.potentialScore,
                predicted_change_pct: c.predictedChangePct,
                global_avg_views: c.globalAvgViews,
                global_avg_engagement_rate: c.globalAvgEngagementRate,
                avg_viral_probability: c.avgViralProbability,
                main_account_video_count: c.mainAccountVideoCount,
                main_account_avg_views: c.mainAccountAvgViews,
                main_account_engagement_rate: c.mainAccountEngagementRate,
                competitor_video_count: c.competitorVideoCount,
                competitor_avg_views: c.competitorAvgViews,
                competitor_engagement_rate: c.competitorEngagementRate,
                recommendation: c.recommendation,
              })),
              top_hashtags: hashtagRecsData.slice(0, 5).map((h: any) => h.hashtag),
              top_posting_times: postingRecsData.slice(0, 3).map((t: any) => `${t.dayName} ${t.timeLabel}`),
              main_keywords: mainKeywords.slice(0, 5).map((k: any) => k.keyword),
              competitor_keywords: Array.from(new Set<string>(
                competitorKeywords.map((k: any) => k.keyword)
              )).slice(0, 5) as string[],
              competitor_count: compIds.length,
            };
            const nlpRes = await apiFetch<any>('/api/summary/generate-analytics', {
              method: 'POST',
              body: nlpPayload,
            }).catch(() => null);
            setNlpAnalyticsSummary(nlpRes?.success ? (nlpRes.data?.summary_text || '') : '');
            setIsLoadingNlp(false);
          }
        } else {
          setComparativeData(null);
          setContentTrendData([]);
          setHashtagRecs([]);
          setPostingRecs([]);
        }
      }

      // 2. Fetch weekly/monthly summary
      const summaryUrl = influencerId ? `${summaryEndpoint}?influencerId=${influencerId}` : summaryEndpoint;
      const summaryRes = await apiFetch<any>(summaryUrl).catch(err => {
        console.error("Failed to fetch summary:", err);
        return null;
      });

      // 3. Fetch keywords
      const keywordsUrl = `${API_ENDPOINTS.summary.keywords}?periodType=${period}${influencerId ? `&influencerId=${influencerId}` : ''}`;
      const keywordsRes = await apiFetch<any[]>(keywordsUrl).catch(err => {
        console.error("Failed to fetch keywords:", err);
        return null;
      });

      // 4. Fetch insights
      const insightsUrl = `${API_ENDPOINTS.summary.insights}?periodType=${period}${influencerId ? `&influencerId=${influencerId}` : ''}`;
      const insightsRes = await apiFetch<any[]>(insightsUrl).catch(err => {
        console.error("Failed to fetch insights:", err);
        return null;
      });

      // 5. Fetch top videos for display
      const topVideosRes = await apiFetch<any[]>(API_ENDPOINTS.videos.top).catch(err => {
        console.error("Failed to fetch top videos:", err);
        return null;
      });

      if (summaryRes?.success && summaryRes.data) {
        const s = summaryRes.data;
        
        // Map summary response to the component shape
        const start = s.periodStart ? new Date(s.periodStart).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '';
        const end = s.periodEnd ? new Date(s.periodEnd).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
        const periodLabel = start && end ? `${start} – ${end}` : period === 'weekly' ? '7 Hari Terakhir' : '30 Hari Terakhir';
        
        const summaryText = s.summaryTextId || s.summaryTextEn || '';
        const bodyParagraphs = summaryText.split('\n').map((p: string) => p.trim()).filter((p: string) => p.length > 0);

        let highlights = [
          'Pertumbuhan views dan interaksi dominan stabil.',
          'Rekomendasi taktis AI berdasarkan performa terdeteksi.',
          'Audiens memberikan komentar sentimen mayoritas positif.'
        ];

        if (s.topKeywords) {
          try {
            const kwList = JSON.parse(s.topKeywords);
            if (Array.isArray(kwList) && kwList.length >= 2) {
              highlights[0] = `Kata kunci terpenting: "${kwList[0]}" dan "${kwList[1]}"`;
            }
          } catch (e) {}
        }
        if (s.topHashtags) {
          try {
            const htList = JSON.parse(s.topHashtags);
            if (Array.isArray(htList) && htList.length > 0) {
              const firstTag = htList[0].tag || htList[0];
              highlights[1] = `Hashtag terpopuler: #${firstTag}`;
            }
          } catch (e) {}
        }

        let sentimentPositive = 0.78;
        let sentimentNeutral = 0.17;
        let sentimentNegative = 0.05;
        if (s.sentimentOverall) {
          const sent = s.sentimentOverall.toLowerCase();
          if (sent === 'positive') {
            sentimentPositive = 0.82;
            sentimentNeutral = 0.13;
            sentimentNegative = 0.05;
          } else if (sent === 'neutral') {
            sentimentPositive = 0.20;
            sentimentNeutral = 0.75;
            sentimentNegative = 0.05;
          } else if (sent === 'negative') {
            sentimentPositive = 0.10;
            sentimentNeutral = 0.15;
            sentimentNegative = 0.75;
          }
        }

        setSummary({
          periodLabel,
          rangeLabel: period === 'weekly' ? 'Laporan Mingguan' : 'Laporan Bulanan',
          generatedAt: s.generatedAt ? new Date(s.generatedAt).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long', year: 'numeric' }) : 'Baru saja',
          model: s.modelVersion || 'NLP-summarizer-v1.3.0',
          confidence: s.rougeScore ? Number(s.rougeScore) : 0.91,
          metrics: {
            videosAnalyzed: s.totalVideosAnalyzed || 0,
            viewsAnalyzed: s.totalViewsAnalyzed || 0,
            avgEngagement: s.avgEngagementRate ? Number((Number(s.avgEngagementRate) * 100).toFixed(1)) : 0,
            sentimentPositive,
            sentimentNeutral,
            sentimentNegative
          },
          body: bodyParagraphs.length > 0 ? bodyParagraphs : ['Belum ada narasi ringkasan yang tersedia.'],
          highlights
        });

        // Set top hashtags from summary if possible
        if (s.topHashtags) {
          try {
            const htList = JSON.parse(s.topHashtags);
            if (Array.isArray(htList)) {
              setTopHashtagsData(htList.map((item: any) => ({
                tag: (item.tag || item).startsWith('#') ? (item.tag || item) : `#${item.tag || item}`,
                uses: item.score || item.videoCount || 10,
                change: 12
              })));
            }
          } catch (e) {}
        }
      } else {
        setSummary(null);
      }

      // Process keywords
      if (keywordsRes?.success && Array.isArray(keywordsRes.data)) {
        setKeywordsData(keywordsRes.data.map((item: any) => ({
          word: item.keyword,
          freq: item.totalFrequency || Math.round((item.avgRelevanceScore || 0) * 100)
        })));
      } else {
        setKeywordsData([]);
      }

      // Process insights
      if (insightsRes?.success && Array.isArray(insightsRes.data)) {
        setInsightsData(insightsRes.data.flatMap((ins: any, idx: number) => [
          {
            id: idx * 2 + 1,
            category: 'engagement',
            priority: 'high',
            title: `Rekomendasi @${ins.influencerUniqueId}`,
            body: ins.recommendation || `Rasio interaksi rata-rata ${(ins.avgEngagementRate * 100).toFixed(1)}% dengan total ${ins.totalVideos} video.`,
            metric: `${(ins.avgEngagementRate * 100).toFixed(1)}%`,
            metricLabel: 'avg engagement'
          },
          {
            id: idx * 2 + 2,
            category: 'timing',
            priority: 'medium',
            title: `Waktu Posting @${ins.influencerUniqueId}`,
            body: `Waktu publikasi dengan performa optimal terdeteksi pada hari ${ins.bestTimeLabel || 'tidak diketahui'}.`,
            metric: ins.bestTimeLabel || 'N/A',
            metricLabel: 'best posting time'
          }
        ]));
      } else {
        setInsightsData([]);
      }

      // Process top videos
      if (topVideosRes?.success && Array.isArray(topVideosRes.data)) {
        setTopVideosData(topVideosRes.data.slice(0, 7).map((v: any, idx: number) => ({
          rank: idx + 1,
          title: v.titleBrief || "Video Terpopuler",
          account: v.nickName || "unknown",
          accountType: 'competitor',
          category: 'tips',
          views: v.viewsNum || 0,
          engagement: v.engagementRate ? Number((v.engagementRate * 100).toFixed(1)) : 0,
          duration: v.durationSeconds ? `${Math.floor(v.durationSeconds / 60)}:${String(v.durationSeconds % 60).padStart(2, '0')}` : '0:15'
        })));
      } else {
        setTopVideosData([]);
      }

    } catch (err: any) {
      console.error("Failed to load nlp data:", err);
      setError(err?.message || "Gagal memuat data analisis NLP dari server.");
    } finally {
      setIsLoading(false);
    }
  }, [period, accountFilter, accounts]);

  useEffect(() => {
    loadNlpData();
  }, [loadNlpData]);

  const handleGenerate = async (opts: { period: string; scope: string; accounts: string[] }) => {
    setGenerating(true);
    try {
      let influencerId: number | string | null = null;
      if (accountFilter !== 'all') {
        const selected = accounts.find(a => a.username === accountFilter);
        influencerId = selected?.influencerId || null;
      }

      const body = {
        periodType: opts.period || period,
        influencerId: influencerId,
        periodStart: null,
        periodEnd: null,
        maxVideos: 30
      };

      const genRes = await apiFetch<any>(API_ENDPOINTS.summary.generate, {
        method: 'POST',
        body
      });

      if (genRes?.success) {
        await loadNlpData();
      }
    } catch (err) {
      console.error("Failed to generate summary:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const mainId = localStorage.getItem("analytics_main_influencer_id");
      const compIdsRaw = localStorage.getItem("analytics_competitor_influencer_ids");
      const compIds: string[] = compIdsRaw ? (() => { try { return JSON.parse(compIdsRaw); } catch { return []; } })() : [];
      const allIds = [mainId, ...compIds].filter(Boolean);

      // Generate cross-account summary first (influencerId: null)
      await apiFetch<any>(API_ENDPOINTS.summary.generate, {
        method: 'POST',
        body: { periodType: period, influencerId: null, periodStart: null, periodEnd: null, maxVideos: 50 }
      }).catch(() => null);

      // Then try each specific account
      for (const id of allIds) {
        await apiFetch<any>(API_ENDPOINTS.summary.generate, {
          method: 'POST',
          body: { periodType: period, influencerId: id, periodStart: null, periodEnd: null, maxVideos: 30 }
        }).catch(() => null);
      }

      await loadNlpData();
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading && !summary) {
    return (
      <PageShell title="NLP Insights & Summary">
        <NlpProcessingLoader />
      </PageShell>
    );
  }

  return (
    <PageShell title="NLP Insights & Summary">
      {/* Action Toolbar */}
      <div id="nlp-toolbar" className="border-b border-stone-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">
            <Sparkles className="w-3.5 h-3.5" />
            NLP Intelligence
          </span>
          <span className="text-xs text-stone-500 dark:text-neutral-400 hidden sm:inline">
            Ekstraksi kata kunci, benchmark kompetitor &amp; rekomendasi taktis
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Quick period switcher in toolbar */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100/80 dark:bg-neutral-800/80 border border-stone-200/60 dark:border-neutral-700/60">
            {[{ key: 'weekly', label: '7 Hari' }, { key: 'monthly', label: '30 Hari' }].map(p => {
              const sel = period === p.key;
              return (
                <button key={p.key} onClick={() => setPeriod(p.key as any)} type="button"
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sel
                      ? 'bg-white dark:bg-neutral-900 text-stone-900 dark:text-white shadow-2xs border border-stone-200/80 dark:border-neutral-700'
                      : 'text-stone-500 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-white'
                  }`}>
                  {p.label}
                </button>
              );
            })}
          </div>

          <Button onClick={handleRefresh} disabled={refreshing}
            className="h-8.5 rounded-xl px-3.5 font-bold text-xs bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white shadow-2xs disabled:opacity-50 transition-all">
            {refreshing ? (
              <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" strokeWidth={2.5} />Merangkum...</>
            ) : (
              <><Wand2 className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} />Refresh</>
            )}
          </Button>

          <Button
            onClick={() => {
              const mainId = localStorage.getItem("analytics_main_influencer_id");
              const mainAcc = accounts.find((a: any) => a.influencerId?.toString() === mainId);
              const compIdsRaw = localStorage.getItem("analytics_competitor_influencer_ids");
              const compIds: string[] = compIdsRaw ? (() => { try { return JSON.parse(compIdsRaw); } catch { return []; } })() : [];
              const compNames = compIds.map(id => accounts.find((a: any) => a.influencerId?.toString() === id)?.username || id);
              exportNlpInsightPdf({
                mainAccountName: mainAcc?.username || mainId || "unknown",
                competitorNames: compNames,
                period,
                nlpSummaryText: nlpAnalyticsSummary,
                contentTrendData,
                hashtagRecs,
                postingRecs,
                mainKeywords: comparativeData?.mainKeywords || [],
                competitorKeywords: comparativeData?.competitorKeywords || [],
                competitorStatsMap,
                comparativeData,
                accounts,
              });
            }}
            disabled={contentTrendData.length === 0}
            className="h-8.5 rounded-xl px-3.5 font-bold text-xs bg-white dark:bg-neutral-800 text-stone-700 dark:text-neutral-200 border border-stone-200 dark:border-neutral-700 hover:bg-stone-50 dark:hover:bg-neutral-750 shadow-2xs disabled:opacity-40 transition-all">
            <FileDown className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Full-screen overlay saat refreshing */}
      {refreshing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
          <div className="w-14 h-14 rounded-2xl bg-stone-900 dark:bg-stone-100 flex items-center justify-center shadow-lg">
            <Wand2 className="w-6 h-6 text-white dark:text-stone-900 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-stone-900 dark:text-white">Merangkum Analisis NLP...</p>
            <p className="text-xs text-stone-500 dark:text-neutral-400 mt-1">AI sedang menganalisis pola konten, kata kunci &amp; engagement</p>
          </div>
          <div className="flex gap-1.5 mt-2">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-stone-900 dark:bg-stone-100 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      )}

      <div className="p-6 space-y-6">
        {error && (
          <div className="p-4 rounded-xl flex items-center gap-3 text-sm font-bold bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {accountFilter === 'all' && comparativeData ? (
          <div className="space-y-6">

            {/* ── 1. EXECUTIVE SUMMARY & ACCOUNT INFO (Hero Block) ── */}
            {(() => {
              const mainId = localStorage.getItem("analytics_main_influencer_id");
              const compIdsRaw = localStorage.getItem("analytics_competitor_influencer_ids");
              const compIds: string[] = compIdsRaw ? (() => { try { return JSON.parse(compIdsRaw); } catch { return []; } })() : [];
              const mainAcc = accounts.find((a: any) => a.influencerId?.toString() === mainId);
              const compAccs = compIds.map((id: string) => accounts.find((a: any) => a.influencerId?.toString() === id)).filter(Boolean);

              if (!mainId) return (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-300">Buka halaman <strong>Analytics</strong>, pilih akun utama &amp; kompetitor, lalu klik <strong>Analisis Data</strong> agar laporan ini terisi.</p>
                </div>
              );

              const top = contentTrendData[0];
              const rising = contentTrendData.filter((c: any) => c.trendDirection === 'rising');
              const mainName = mainAcc?.username || 'akun utama';
              const compCount = comparativeData.competitorSummaries?.length || 0;

              const execSummary = (() => {
                const risingNames = rising.map((c: any) => c.category).join(', ') || 'tidak ada';
                const topScore = top ? Math.round(top.potentialScore) : 0;
                const topEng = (() => { const l = top?.forecastTrend?.[top.forecastTrend.length - 1]; return l ? (l.avgEngagementRate * 100).toFixed(2) : '0.00'; })();
                return `Berdasarkan analisis <strong>${period === 'weekly' ? '7 hari' : '30 hari'}</strong> terakhir terhadap @${mainName}${compCount > 0 ? ` dan ${compCount} akun kompetitor` : ''}, kategori konten <strong>${top?.category || '—'}</strong> diproyeksikan memiliki peluang terbesar dengan Opportunity Score <strong>${topScore}/100</strong> (est. engagement rate <strong>${topEng}%</strong>). Kategori naik tren: <strong>${risingNames}</strong>. ${rising.length === 0 ? 'Fokus pada konsistensi dan optimasi hashtag.' : 'Momentum yang tepat untuk mulai meningkatkan produksi konten.'}`;
              })();

              return (
                <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-sm p-5 space-y-4">
                  {/* Account strip & status */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-stone-100 dark:border-neutral-800 flex-wrap gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <SafeAvatar src={mainAcc?.avatarUrl} username={mainAcc?.username || mainId} size={28} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">Utama</span>
                            <span className="text-xs font-bold text-stone-900 dark:text-white">@{mainAcc?.username || mainId}</span>
                          </div>
                        </div>
                      </div>

                      {compAccs.length > 0 && (
                        <>
                          <div className="w-px h-5 bg-stone-200 dark:bg-neutral-800 hidden sm:block" />
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold text-stone-400 dark:text-neutral-500 uppercase tracking-wider">Komp:</span>
                            {compAccs.map((acc: any) => (
                              <div key={acc.influencerId} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-stone-50 dark:bg-neutral-800 border border-stone-200/60 dark:border-neutral-700 text-stone-600 dark:text-neutral-300">
                                <SafeAvatar src={acc.avatarUrl} username={acc.username} size={14} />
                                <span>@{acc.username}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500 dark:text-neutral-400">
                      <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                      <span>AI Executive Summary</span>
                    </div>
                  </div>

                  {/* Summary Text Box */}
                  {isLoadingNlp ? (
                    <div className="flex items-center gap-2 text-stone-400 text-xs py-2">
                      <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                      <span>NLP model sedang merangkum data analitik...</span>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-stone-50/70 dark:bg-neutral-800/40 border border-stone-200/60 dark:border-neutral-700/60">
                      <p className="text-xs md:text-sm text-stone-700 dark:text-neutral-300 leading-relaxed font-normal">
                        {nlpAnalyticsSummary ? nlpAnalyticsSummary : <span dangerouslySetInnerHTML={{ __html: execSummary }} />}
                      </p>
                    </div>
                  )}

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-white dark:bg-neutral-850 border border-stone-200/80 dark:border-neutral-750 shadow-2xs">
                      <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400 dark:text-neutral-500">Kategori Naik Tren</span>
                      <div className="flex items-baseline justify-between mt-0.5">
                        <p className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">{rising.length}</p>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60">Momentum Positif</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-neutral-850 border border-stone-200/80 dark:border-neutral-750 shadow-2xs">
                      <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400 dark:text-neutral-500">Top Opportunity Score</span>
                      <div className="flex items-baseline justify-between mt-0.5">
                        <p className="text-xl font-black font-mono text-sky-600 dark:text-sky-400">{Math.round(top?.potentialScore || 0)}<span className="text-xs text-stone-400 font-normal">/100</span></p>
                        <span className="text-[10px] font-bold text-stone-600 dark:text-neutral-300 bg-stone-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded truncate max-w-[120px]">{top?.category || '—'}</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-neutral-850 border border-stone-200/80 dark:border-neutral-750 shadow-2xs">
                      <span className="text-[9.5px] font-bold uppercase tracking-wider text-stone-400 dark:text-neutral-500">Kompetitor Dianalisis</span>
                      <div className="flex items-baseline justify-between mt-0.5">
                        <p className="text-xl font-black font-mono text-stone-800 dark:text-neutral-200">{compCount}</p>
                        <span className="text-[10px] font-bold text-stone-500 dark:text-neutral-400 bg-stone-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">Akun Pembanding</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── 2. TABBED DEEP DIVE NAVIGATION ── */}
            <div className="flex items-center gap-1.5 border-b border-stone-200 dark:border-neutral-800 pb-2 overflow-x-auto">
              {[
                { key: 'benchmark', label: 'Benchmark & Komparasi', icon: Users, desc: 'Performa akun & gap kategori' },
                { key: 'categories', label: 'Tren & Kategori Konten', icon: TrendingUp, desc: 'Proyeksi kategori & keywords' },
                { key: 'strategy', label: 'Rekomendasi Taktis & Jadwal', icon: Target, desc: 'Hashtag, jadwal & blueprint' },
              ].map(t => {
                const isSelected = activeTab === t.key;
                const Icon = t.icon;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-sm'
                        : 'bg-white dark:bg-neutral-850 text-stone-600 dark:text-neutral-300 border border-stone-200/80 dark:border-neutral-800 hover:bg-stone-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ── TAB 1: BENCHMARK & KOMPARASI ── */}
            {activeTab === 'benchmark' && (
              <div className="space-y-6">
                {/* Table 1: Per-account performance */}
                <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-sm p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-stone-900 dark:text-white tracking-tight">Performa Akun: Utama vs Kompetitor</h3>
                      <p className="text-xs text-stone-400 dark:text-neutral-500 mt-0.5">Perbandingan engagement, total konten video, sentimen audiens, dan kata kunci utama</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-stone-200/60 dark:border-neutral-800">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-stone-50/80 dark:bg-neutral-800/50 border-b border-stone-200/60 dark:border-neutral-800">
                          <th className="text-left py-2.5 px-3.5 font-bold text-stone-500 dark:text-neutral-400 text-[10px] uppercase tracking-widest">Akun</th>
                          <th className="text-right py-2.5 px-3.5 font-bold text-stone-500 dark:text-neutral-400 text-[10px] uppercase tracking-widest">Avg Engagement</th>
                          <th className="text-right py-2.5 px-3.5 font-bold text-stone-500 dark:text-neutral-400 text-[10px] uppercase tracking-widest">Total Video</th>
                          <th className="text-right py-2.5 px-3.5 font-bold text-stone-500 dark:text-neutral-400 text-[10px] uppercase tracking-widest">Sentiment</th>
                          <th className="text-right py-2.5 px-3.5 font-bold text-stone-500 dark:text-neutral-400 text-[10px] uppercase tracking-widest">Top Keywords</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-neutral-800">
                        {/* Main account row */}
                        {(() => {
                          const mainId = localStorage.getItem("analytics_main_influencer_id");
                          const mainAcc = accounts.find((a: any) => a.influencerId?.toString() === mainId);
                          const mainName = mainAcc?.username || mainId || 'akun utama';
                          return (
                            <tr className="bg-sky-50/30 dark:bg-sky-950/10">
                              <td className="py-2.5 px-3.5">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded bg-stone-900 text-white dark:bg-white dark:text-stone-900 flex items-center justify-center text-[9px] font-black flex-shrink-0">M</span>
                                  <span className="font-bold text-stone-900 dark:text-white">@{mainName}</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3.5 text-right">
                                <span className="font-mono font-bold text-stone-900 dark:text-white">
                                  {(() => {
                                    const total = contentTrendData.reduce((s, c) => s + (c.mainAccountVideoCount || 0), 0);
                                    const weighted = contentTrendData.reduce((s, c) => s + (c.mainAccountEngagementRate || 0) * (c.mainAccountVideoCount || 0), 0);
                                    const avg = total > 0 ? weighted / total : 0;
                                    return total > 0 ? `${(avg * 100).toFixed(2)}%` : <span className="text-stone-400 italic font-normal">—</span>;
                                  })()}
                                </span>
                              </td>
                              <td className="py-2.5 px-3.5 text-right font-mono font-bold text-stone-800 dark:text-neutral-200">
                                {contentTrendData.reduce((s, c) => s + (c.mainAccountVideoCount || 0), 0) || <span className="text-stone-400 italic font-normal">—</span>}
                              </td>
                              <td className="py-2.5 px-3.5 text-right">
                                {comparativeData.mainSummary?.sentimentOverall
                                  ? <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">{comparativeData.mainSummary.sentimentOverall}</span>
                                  : <span className="text-stone-400 italic text-[10px]">—</span>}
                              </td>
                              <td className="py-2.5 px-3.5 text-right">
                                <div className="flex flex-wrap gap-1 justify-end">
                                  {comparativeData.mainKeywords?.slice(0, 3).map((k: any, i: number) => (
                                    <span key={i} className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-neutral-800 text-[10px] font-semibold text-stone-700 dark:text-neutral-300">{k.keyword}</span>
                                  ))}
                                  {(!comparativeData.mainKeywords || comparativeData.mainKeywords.length === 0) && <span className="text-stone-400 italic text-[10px]">—</span>}
                                </div>
                              </td>
                            </tr>
                          );
                        })()}

                        {/* Competitor rows */}
                        {(() => {
                          const compIdsRaw = localStorage.getItem("analytics_competitor_influencer_ids");
                          const compIds: string[] = compIdsRaw ? (() => { try { return JSON.parse(compIdsRaw); } catch { return []; } })() : [];
                          const allCompIds = compIds.length > 0
                            ? compIds
                            : Array.from(new Set<string>(comparativeData.competitorKeywords?.map((k: any) => k.influencerId) || []));
                          if (allCompIds.length === 0) return (
                            <tr><td colSpan={5} className="py-3 text-center text-xs text-stone-400 italic">Tidak ada kompetitor yang dikonfigurasi</td></tr>
                          );
                          return allCompIds.map((id: string) => {
                            const accObj = accounts.find((a: any) => a.influencerId?.toString() === id);
                            const username = accObj?.username || id;
                            const summaryData = comparativeData.competitorSummaries?.find((c: any) => c.influencerId === id)?.data;
                            const insightData = comparativeData.competitorInsights?.find((ins: any) => ins.influencerId?.toString() === id);
                            const ctStats = competitorStatsMap[id];
                            const compKws = comparativeData.competitorKeywords?.filter((k: any) => k.influencerId?.toString() === id) || [];
                            return (
                              <tr key={id} className="hover:bg-stone-50/50 dark:hover:bg-neutral-850/50 transition-colors">
                                <td className="py-2.5 px-3.5">
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded bg-stone-200 dark:bg-neutral-700 flex items-center justify-center text-stone-600 dark:text-neutral-300 text-[8px] font-black flex-shrink-0">{username.substring(0,2).toUpperCase()}</span>
                                    <span className="font-semibold text-stone-700 dark:text-neutral-300">@{username}</span>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3.5 text-right font-mono font-bold text-stone-700 dark:text-neutral-300">
                                  {(ctStats?.avgEngagementRate || insightData?.avgEngagementRate || summaryData?.avgEngagementRate)
                                    ? `${(Number(ctStats?.avgEngagementRate ?? insightData?.avgEngagementRate ?? summaryData?.avgEngagementRate) * 100).toFixed(2)}%`
                                    : <span className="text-stone-400 text-[10px]">—</span>}
                                </td>
                                <td className="py-2.5 px-3.5 text-right font-mono font-medium text-stone-700 dark:text-neutral-300">
                                  {ctStats?.totalVideos ?? insightData?.totalVideos ?? summaryData?.totalVideosAnalyzed ?? <span className="text-stone-400 text-[10px]">—</span>}
                                </td>
                                <td className="py-2.5 px-3.5 text-right">
                                  {summaryData?.sentimentOverall
                                    ? <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400">{summaryData.sentimentOverall}</span>
                                    : <span className="text-stone-400 italic text-[10px]">—</span>}
                                </td>
                                <td className="py-2.5 px-3.5 text-right">
                                  <div className="flex flex-wrap gap-1 justify-end">
                                    {compKws.slice(0, 3).map((k: any, i: number) => (
                                      <span key={i} className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-neutral-800 text-[10px] font-medium text-stone-500 dark:text-neutral-400">{k.keyword}</span>
                                    ))}
                                    {compKws.length === 0 && <span className="text-stone-400 italic text-[10px]">—</span>}
                                  </div>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table 2: Category Distribution & Engagement Gap */}
                {contentTrendData.some((c: any) => c.mainAccountVideoCount > 0 || c.competitorVideoCount > 0) && (
                  <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-sm p-5 space-y-4">
                    <div>
                      <h3 className="text-sm font-black text-stone-900 dark:text-white tracking-tight">Distribusi Kategori Konten &amp; Engagement Gap</h3>
                      <p className="text-xs text-stone-400 dark:text-neutral-500 mt-0.5">Membandingkan konsentrasi video dan selisih performa interaksi di setiap kategori</p>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-stone-200/60 dark:border-neutral-800">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-stone-50/80 dark:bg-neutral-800/50 border-b border-stone-200/60 dark:border-neutral-800">
                            <th className="text-left py-2.5 px-3.5 font-bold text-stone-500 dark:text-neutral-400 text-[10px] uppercase tracking-widest">Kategori</th>
                            <th className="text-right py-2.5 px-3.5 font-bold text-stone-500 dark:text-neutral-400 text-[10px] uppercase tracking-widest">Main Videos</th>
                            <th className="text-right py-2.5 px-3.5 font-bold text-stone-500 dark:text-neutral-400 text-[10px] uppercase tracking-widest">Main Eng%</th>
                            <th className="text-right py-2.5 px-3.5 font-bold text-stone-500 dark:text-neutral-400 text-[10px] uppercase tracking-widest">Komp Videos</th>
                            <th className="text-right py-2.5 px-3.5 font-bold text-stone-500 dark:text-neutral-400 text-[10px] uppercase tracking-widest">Komp Eng%</th>
                            <th className="text-right py-2.5 px-3.5 font-bold text-stone-500 dark:text-neutral-400 text-[10px] uppercase tracking-widest">Gap</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 dark:divide-neutral-800">
                          {contentTrendData.map((c: any) => {
                            const gap = c.mainAccountEngagementRate - c.competitorEngagementRate;
                            const isPositive = gap > 0;
                            const isNegative = gap < 0;
                            return (
                              <tr key={c.category} className="hover:bg-stone-50/50 dark:hover:bg-neutral-850/50 transition-colors">
                                <td className="py-2.5 px-3.5 font-bold text-stone-800 dark:text-neutral-200">{c.category}</td>
                                <td className="py-2.5 px-3.5 text-right font-mono font-semibold text-stone-700 dark:text-neutral-300">{c.mainAccountVideoCount || 0}</td>
                                <td className="py-2.5 px-3.5 text-right font-mono font-bold text-stone-800 dark:text-neutral-200">
                                  {c.mainAccountVideoCount > 0 ? `${(c.mainAccountEngagementRate * 100).toFixed(2)}%` : <span className="text-stone-400 font-normal">—</span>}
                                </td>
                                <td className="py-2.5 px-3.5 text-right font-mono font-medium text-stone-500 dark:text-neutral-400">{c.competitorVideoCount || 0}</td>
                                <td className="py-2.5 px-3.5 text-right font-mono font-medium text-stone-500 dark:text-neutral-400">
                                  {c.competitorVideoCount > 0 ? `${(c.competitorEngagementRate * 100).toFixed(2)}%` : <span className="text-stone-400 font-normal">—</span>}
                                </td>
                                <td className="py-2.5 px-3.5 text-right">
                                  {(c.mainAccountVideoCount > 0 && c.competitorVideoCount > 0) ? (
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${
                                      isPositive
                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                                        : isNegative
                                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60'
                                        : 'bg-stone-100 text-stone-600 dark:bg-neutral-800 dark:text-neutral-400'
                                    }`}>
                                      {gap > 0 ? '+' : ''}{(gap * 100).toFixed(2)}%
                                    </span>
                                  ) : <span className="text-stone-400 text-[10px]">—</span>}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Overlap Keyword Analysis */}
                {comparativeData.mainKeywords?.length > 0 && comparativeData.competitorKeywords?.length > 0 && (() => {
                  const mainKwSet = new Set<string>(comparativeData.mainKeywords.map((k: any) => k.keyword));
                  const compKwSet = new Set<string>(comparativeData.competitorKeywords.map((k: any) => k.keyword));
                  const overlap = [...mainKwSet].filter(k => compKwSet.has(k));
                  const mainOnly = [...mainKwSet].filter(k => !compKwSet.has(k));
                  const compOnly = [...compKwSet].filter(k => !mainKwSet.has(k));
                  return (
                    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-sm p-5 space-y-3">
                      <div>
                        <h3 className="text-sm font-black text-stone-900 dark:text-white tracking-tight">Analisis Overlap Kata Kunci</h3>
                        <p className="text-xs text-stone-400 dark:text-neutral-500 mt-0.5">Memetakan topik unik akun utama vs topik bersama vs topik eksklusif kompetitor</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Unik Akun Utama</span>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">{mainOnly.length}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {mainOnly.slice(0, 6).map((k, i) => <span key={i} className="px-2 py-0.5 rounded-md bg-white dark:bg-neutral-800 text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 shadow-2xs">{k}</span>)}
                          </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-stone-50/70 dark:bg-neutral-800/40 border border-stone-200/60 dark:border-neutral-700/60">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-stone-600 dark:text-neutral-400 uppercase tracking-wider">Overlap / Bersama</span>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-200/70 text-stone-800 dark:bg-neutral-700 dark:text-neutral-200">{overlap.length}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {overlap.slice(0, 6).map((k, i) => <span key={i} className="px-2 py-0.5 rounded-md bg-white dark:bg-neutral-800 text-[10.5px] font-semibold text-stone-700 dark:text-neutral-300 border border-stone-200/60 dark:border-neutral-700/60 shadow-2xs">{k}</span>)}
                          </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">Unik Kompetitor</span>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100/80 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">{compOnly.length}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {compOnly.slice(0, 6).map((k, i) => <span key={i} className="px-2 py-0.5 rounded-md bg-white dark:bg-neutral-800 text-[10.5px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 shadow-2xs">{k}</span>)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ── TAB 2: TREN & KATEGORI KONTEN (Redesigned & Distinct Colors) ── */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                {/* Header & Subtitle */}
                <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-sm p-5 space-y-5">
                  <div className="border-b border-stone-100 dark:border-neutral-800 pb-3">
                    <h3 className="text-sm font-black text-stone-900 dark:text-white tracking-tight">Proyeksi Peluang Tren Kategori Konten</h3>
                    <p className="text-xs text-stone-400 dark:text-neutral-500 mt-0.5">Analisis potensi engagement 7 hari ke depan, perbandingan akun utama vs kompetitor, dan rekomendasi taktis</p>
                  </div>

                  {/* 2-Column Responsive Distinct Category Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contentTrendData.map((c: any, idx: number) => {
                      const meta = getCategoryMeta(c.category);
                      const Icon = meta.icon;
                      const isRising = c.trendDirection === 'rising';
                      const isDeclining = c.trendDirection === 'declining';
                      const TIcon = isRising ? TrendingUp : isDeclining ? TrendingDown : null;
                      const last = c.forecastTrend?.[c.forecastTrend.length - 1];
                      const est = last ? (last.avgEngagementRate * 100).toFixed(2) : '0.00';
                      const score = Math.round(c.potentialScore || 0);
                      const hasMain = (c.mainAccountVideoCount || 0) > 0;
                      const hasComp = (c.competitorVideoCount || 0) > 0;
                      const mainEng = (c.mainAccountEngagementRate * 100).toFixed(2);
                      const compEng = (c.competitorEngagementRate * 100).toFixed(2);
                      const isWinning = hasMain && hasComp && c.mainAccountEngagementRate >= c.competitorEngagementRate;

                      return (
                        <div
                          key={c.category}
                          className={`rounded-2xl border bg-white dark:bg-neutral-900 transition-all p-4.5 flex flex-col justify-between gap-3.5 shadow-2xs hover:shadow-md ${meta.border}`}
                        >
                          {/* 1. Header Bar: Icon, Name, Rank, Score & Trend */}
                          <div>
                            <div className="flex items-start justify-between gap-2.5 flex-wrap mb-3">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.text}`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-stone-100 text-stone-700 dark:bg-neutral-800 dark:text-neutral-300">
                                      #{idx + 1}
                                    </span>
                                    <h4 className="text-sm font-bold text-stone-900 dark:text-white">{c.category}</h4>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                                    isRising
                                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                      : isDeclining
                                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                  }`}
                                >
                                  {TIcon && <TIcon className="w-3.5 h-3.5" />}
                                  {isRising ? 'Naik Tren' : isDeclining ? 'Menurun' : 'Stabil'}
                                  {c.predictedChangePct !== 0 && ` (${c.predictedChangePct > 0 ? '+' : ''}${c.predictedChangePct?.toFixed(1)}%)`}
                                </span>

                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-900 text-white dark:bg-white dark:text-stone-900 text-[11px] font-mono font-bold">
                                  <span>Score {score}</span>
                                  <span className="text-[9px] opacity-60">/100</span>
                                </div>
                              </div>
                            </div>

                            {/* 2. Clear 2-Column Comparison & Forecast Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-2.5">
                              {/* Box Kiri: Performa Akun Utama vs Kompetitor */}
                              <div className="p-3 rounded-xl bg-stone-50/90 dark:bg-neutral-850/60 border border-stone-200/70 dark:border-neutral-800 space-y-2">
                                <span className="text-[9.5px] font-black uppercase tracking-wider text-stone-400 dark:text-neutral-500 block">
                                  Volume &amp; Interaksi
                                </span>
                                <div className="space-y-1.5 text-xs">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-4 h-4 rounded bg-sky-500 text-white text-[8px] font-bold flex items-center justify-center">M</span>
                                      <span className="font-medium text-stone-700 dark:text-neutral-300">Utama:</span>
                                    </div>
                                    <span className="font-mono font-bold text-stone-900 dark:text-white">
                                      {hasMain ? `${c.mainAccountVideoCount} vid (${mainEng}%)` : <span className="text-stone-400 font-normal italic">0 vid</span>}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-4 h-4 rounded bg-stone-400 text-white text-[8px] font-bold flex items-center justify-center">K</span>
                                      <span className="font-medium text-stone-500 dark:text-neutral-400">Kompetitor:</span>
                                    </div>
                                    <span className="font-mono font-semibold text-stone-600 dark:text-neutral-300">
                                      {hasComp ? `${c.competitorVideoCount} vid (${compEng}%)` : <span className="text-stone-400 font-normal italic">0 vid</span>}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Box Kanan: Forecast 7 Hari & Bar Potensi */}
                              <div className="p-3 rounded-xl bg-sky-50/50 dark:bg-sky-950/25 border border-sky-100 dark:border-sky-900/40 space-y-1.5 flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9.5px] font-black uppercase tracking-wider text-sky-800 dark:text-sky-300">
                                    Proyeksi 7 Hari
                                  </span>
                                  <span className="text-xs font-mono font-black text-sky-700 dark:text-sky-300">
                                    ~{est}% Eng
                                  </span>
                                </div>
                                <div>
                                  <div className="w-full bg-stone-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full transition-all duration-500"
                                      style={{ width: `${Math.min(100, score)}%`, backgroundColor: meta.color }}
                                    />
                                  </div>
                                  <p className="text-[10px] font-medium text-stone-500 dark:text-neutral-400 mt-1 truncate">
                                    {!hasMain ? '✨ Eksplorasi Niche Baru' : isWinning ? '🏆 Akun Unggul di Kategori Ini' : '⚡ Peluang Optimasi Hook'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 3. Actionable Tactical Advice Footer */}
                          <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/50 flex items-start gap-2 text-xs text-stone-800 dark:text-neutral-200">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="leading-snug text-[11.5px]">{c.recommendation}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Keyword Comparison & ML Metadata */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-sm p-5 space-y-3">
                    <div className="flex items-center gap-2 border-b border-stone-100 dark:border-neutral-800 pb-2.5">
                      <Brain className="w-4 h-4 text-sky-500" />
                      <h3 className="text-sm font-black text-stone-900 dark:text-white tracking-tight">Data yang Digunakan Prediksi</h3>
                    </div>
                    <div className="space-y-1.5 text-xs text-stone-600 dark:text-neutral-300">
                      {[
                        { label: 'Metrik Video', desc: 'Views, likes, comments, shares, engagement rate historis' },
                        { label: 'ML Predictions', desc: 'Viral probability (Random Forest), Tier (SVM), K-Means cluster' },
                        { label: 'Teks Konten', desc: 'Caption, hashtag, mention, emoji, pertanyaan dalam caption' },
                        { label: 'Pola Temporal', desc: 'Hari posting, jam posting, tren 14 hari vs 15–30 hari' },
                        { label: 'Benchmark', desc: `Komparasi data dari ${comparativeData.competitorSummaries?.length || 0} akun kompetitor` },
                      ].map(item => (
                        <div key={item.label} className="flex items-start gap-2 p-2 rounded-lg bg-stone-50/70 dark:bg-neutral-800/40 border border-stone-200/40 dark:border-neutral-700/40">
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                          <div><strong className="font-bold text-stone-800 dark:text-neutral-200">{item.label}:</strong> <span className="text-stone-500 dark:text-neutral-400">{item.desc}</span></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-sm p-5 space-y-3">
                    <div className="flex items-center gap-2 border-b border-stone-100 dark:border-neutral-800 pb-2.5">
                      <Search className="w-4 h-4 text-amber-500" />
                      <h3 className="text-sm font-black text-stone-900 dark:text-white tracking-tight">Keyword Comparison</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-sky-50/30 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40">
                        <p className="text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-widest mb-2">Akun Utama</p>
                        <div className="flex flex-wrap gap-1">
                          {comparativeData.mainKeywords?.length > 0
                            ? comparativeData.mainKeywords.slice(0, 8).map((k: any, i: number) => <span key={i} className="px-2 py-0.5 rounded-md bg-white dark:bg-neutral-800 font-semibold text-sky-800 dark:text-sky-300 text-[11px] border border-sky-200/60 dark:border-sky-800/60 shadow-2xs">{k.keyword}</span>)
                            : <span className="text-stone-400 italic text-xs">Tidak ada data</span>}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-50/30 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
                        <p className="text-[10px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-widest mb-2">Kompetitor</p>
                        <div className="flex flex-wrap gap-1">
                          {comparativeData.competitorKeywords?.length > 0
                            ? Array.from(new Set<string>(comparativeData.competitorKeywords.map((k: any) => k.keyword))).slice(0, 8).map((w, i) => <span key={i} className="px-2 py-0.5 rounded-md bg-white dark:bg-neutral-800 font-semibold text-amber-800 dark:text-amber-300 text-[11px] border border-amber-200/60 dark:border-amber-800/60 shadow-2xs">{w}</span>)
                            : <span className="text-stone-400 italic text-xs">Tidak ada data</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 3: REKOMENDASI TAKTIS & JADWAL ── */}
            {activeTab === 'strategy' && (
              <div className="space-y-6">
                {/* 2-Column: Hashtags & Posting Slots */}
                <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-sm p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-black text-stone-900 dark:text-white tracking-tight">Rekomendasi Hashtag &amp; Waktu Posting</h3>
                    <p className="text-xs text-stone-400 dark:text-neutral-500 mt-0.5">Strategi distribusi konten berbasis Machine Learning untuk akun utama</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Hashtags list */}
                    <div>
                      <p className="text-[10px] font-black text-stone-400 dark:text-neutral-500 uppercase tracking-widest mb-2.5">Hashtag Prioritas</p>
                      {hashtagRecs.length > 0 ? (
                        <div className="space-y-1.5">
                          {hashtagRecs.slice(0, 5).map((h: any, i: number) => {
                            const comp = h.competitionLevel?.toLowerCase();
                            return (
                              <div key={h.hashtag} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-stone-200/60 dark:border-neutral-800 bg-stone-50/40 dark:bg-neutral-850/40">
                                <span className="w-5 h-5 rounded bg-stone-200 dark:bg-neutral-750 flex items-center justify-center text-[10px] font-mono font-bold text-stone-700 dark:text-neutral-300 flex-shrink-0">{i + 1}</span>
                                <span className="text-xs font-bold text-stone-800 dark:text-neutral-200 flex-1">#{h.hashtag}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  comp === 'low'
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                                    : comp === 'medium'
                                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60'
                                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60'
                                }`}>
                                  {h.competitionLevel || 'Low'}
                                </span>
                                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">{(h.expectedEngagementRate * 100).toFixed(1)}% Eng</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-stone-400 italic py-3">Rekomendasi hashtag belum tersedia.</p>
                      )}
                    </div>

                    {/* Posting Slots */}
                    <div>
                      <p className="text-[10px] font-black text-stone-400 dark:text-neutral-500 uppercase tracking-widest mb-2.5">Slot Waktu Terbaik</p>
                      {postingRecs.length > 0 ? (
                        <div className="space-y-1.5">
                          {postingRecs.slice(0, 5).map((t: any, i: number) => (
                            <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-stone-200/60 dark:border-neutral-800 bg-stone-50/40 dark:bg-neutral-850/40">
                              <span className="w-5 h-5 rounded bg-stone-900 text-white dark:bg-white dark:text-stone-900 flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0">{i + 1}</span>
                              <span className="text-xs font-bold text-stone-800 dark:text-neutral-200 flex-1">{t.dayName} · {t.timeLabel}</span>
                              <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 flex-shrink-0">{(t.expectedEngagementRate * 100).toFixed(1)}% Eng</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-stone-400 italic py-3">Data waktu posting optimal belum tersedia.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Improvement Strategy (6 Action Cards) */}
                <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-sm p-5 space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-stone-900 dark:text-white tracking-tight">Content Improvement Strategy</h3>
                      <p className="text-xs text-stone-400 dark:text-neutral-500 mt-0.5">Rekomendasi taktis berbasis AI &amp; Machine Learning — siap dieksekusi</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(() => {
                      const top = contentTrendData[0];
                      return ([
                        top && { Icon: Target, bg: 'bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border-sky-200/60 dark:border-sky-800/60', title: 'Prioritas Kategori', body: `Fokuskan produksi konten pada kategori <strong>${top.category}</strong> (Score ${Math.round(top.potentialScore)}/100). ${top.trendDirection === 'rising' ? 'Momentum sedang naik — buat 2–3 konten minggu ini.' : 'Jadwalkan konten secara konsisten.'}` },
                        hashtagRecs.length > 0 && { Icon: Hash, bg: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60', title: 'Strategi Hashtag', body: `Gunakan <strong>${hashtagRecs.slice(0,3).map((h: any) => '#' + h.hashtag).join(', ')}</strong> sebagai hashtag utama dengan variasi kompetisi rendah.` },
                        postingRecs.length > 0 && { Icon: CalendarClock, bg: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60', title: 'Jadwal Posting', body: `Posting pada <strong>${postingRecs[0]?.dayName} ${postingRecs[0]?.timeLabel}</strong> untuk interaksi maksimal dan menghindari overlap kompetitor.` },
                        comparativeData.competitorKeywords?.length > 0 && { Icon: Search, bg: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-200/60 dark:border-purple-800/60', title: 'Gap Konten', body: `Kompetitor aktif di kata kunci <strong>${Array.from(new Set<string>(comparativeData.competitorKeywords.map((k: any) => k.keyword))).slice(0,3).join(', ')}</strong>. Buat konten alternatif dari sudut pandang unik Anda.` },
                        { Icon: BarChart2, bg: 'bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 border-cyan-200/60 dark:border-cyan-800/60', title: 'Format Hook', body: 'Gunakan pertanyaan atau kontras visual di 3 detik pertama caption & video untuk mendongkrak retensi audiens.' },
                        { Icon: RefreshCw, bg: 'bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400 border-stone-200/60 dark:border-neutral-700/60', title: 'Siklus Review', body: 'Evaluasi performa konten per 7 hari. Bandingkan engagement aktual vs proyeksi ML untuk menyempurnakan strategi.' },
                      ] as any[]).filter(Boolean).map((item: any, i: number) => (
                        <div key={i} className="p-3.5 rounded-xl bg-stone-50/60 dark:bg-neutral-850/50 border border-stone-200/70 dark:border-neutral-800 flex flex-col justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border ${item.bg}`}>
                              <item.Icon className="w-3.5 h-3.5" />
                            </div>
                            <p className="font-bold text-stone-900 dark:text-white text-xs">{item.title}</p>
                          </div>
                          <p className="text-stone-600 dark:text-neutral-300 text-[11px] leading-relaxed" dangerouslySetInnerHTML={{ __html: item.body }} />
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : summary ? (
          <>
            {/* Single account view */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100/80 dark:bg-neutral-800/80 border border-stone-200/60 dark:border-neutral-700/60">
                {[
                  { key: 'weekly',  label: 'Mingguan' },
                  { key: 'monthly', label: 'Bulanan' },
                ].map(p => {
                  const sel = period === p.key;
                  return (
                    <button key={p.key} onClick={() => setPeriod(p.key as any)}
                      type="button"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        sel
                          ? 'bg-white dark:bg-neutral-900 text-stone-900 dark:text-white shadow-2xs border border-stone-200/80 dark:border-neutral-700'
                          : 'text-stone-500 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-white'
                      }`}>
                      {p.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-neutral-400 bg-stone-50 dark:bg-neutral-800/50 px-3 py-1.5 rounded-xl border border-stone-200/60 dark:border-neutral-700/60">
                <Clock className="w-3.5 h-3.5 text-stone-400" strokeWidth={2.4} />
                <span>Periode aktif: <strong className="font-mono text-stone-800 dark:text-neutral-200">{summary.periodLabel}</strong></span>
              </div>
            </div>

            {/* 1. Summary metric cards */}
            <div id="nlp-metrics">
              <SummaryMetricCards metrics={summary.metrics} />
            </div>

            {/* 2. Hero summary card */}
            <div id="nlp-summary">
              <SummaryCard data={summary} period={period} onRegenerate={() => setDialogOpen(true)} />
            </div>

            {/* 3. Key Insights */}
            <div id="nlp-insights">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-stone-900 dark:bg-white flex items-center justify-center text-white dark:text-stone-900 shadow-2xs">
                    <Lightbulb className="w-4 h-4" strokeWidth={2.4} />
                  </div>
                  <div>
                    <h2 className="font-black text-sm tracking-tight text-stone-900 dark:text-white">Key Insights</h2>
                    <p className="text-[11px] text-stone-400 dark:text-neutral-500">{insightsData.length} insight actionable dari analisis NLP</p>
                  </div>
                </div>
                <Mono size="xs" dim className="font-bold">priority: high → low</Mono>
              </div>
              <InsightCards insights={insightsData} />
            </div>

            {/* 4. Keyword cloud + Hashtags (2 columns) */}
            <div id="nlp-cloud" className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <KeywordCloud keywords={keywordsData.length > 0 ? keywordsData : []} />
              </div>
              <div className="lg:col-span-2">
                <TopHashtagsList hashtags={topHashtagsData.length > 0 ? topHashtagsData : []} />
              </div>
            </div>

            {/* 5. Sentiment + Top videos (2 columns) */}
            <div id="nlp-sentiment" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SentimentBreakdown metrics={summary.metrics} />
              <TopVideosList videos={topVideosData} />
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-2xl border border-stone-200/80 dark:border-neutral-800 shadow-sm">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-stone-300 dark:text-neutral-600" />
            <h3 className="text-base font-bold mb-1 text-stone-900 dark:text-white">Belum Ada Analisis NLP</h3>
            <p className="text-xs mb-6 max-w-sm mx-auto text-stone-400 dark:text-neutral-500">Sistem belum menemukan ringkasan NLP untuk akun atau periode ini. Silakan generate ringkasan baru sekarang.</p>
            <Button onClick={() => setDialogOpen(true)}
              className="rounded-xl px-5 font-bold text-xs bg-stone-900 text-white hover:bg-stone-800 dark:bg-white dark:text-stone-900 shadow-2xs">
              <Wand2 className="w-4 h-4 mr-1.5" />
              Generate Ringkasan Pertama
            </Button>
          </div>
        )}
      </div>

      <GenerateSummaryDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onGenerate={handleGenerate} />

      <style jsx global>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
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