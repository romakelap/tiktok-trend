'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Filter, ChevronDown, Wand2, Loader2, Clock, Sparkles, Lightbulb, Users, Check, AlertCircle, TrendingUp, TrendingDown,
  Target, Hash, CalendarClock, Search, BarChart2, RefreshCw, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageShell } from '@/components/layout/PageShell';
import { Mono } from '@/components/dashboard';
import { TOKENS } from '@/lib/design-tokens';
import { ACCOUNT_TINTS } from '@/lib/nlp-insight/mock-data';
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

export default function NLPInsights() {
  const [period, setPeriod]               = useState<'weekly' | 'monthly'>('weekly');
  const [accountFilter, setAccountFilter] = useState('all');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [dialogOpen, setDialogOpen]   = useState(false);
  const [generating, setGenerating]   = useState(false);
  const [refreshing, setRefreshing]   = useState(false);

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
            influencerId: a.influencerId
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: TOKENS.textMuted }} />
          <p className="text-sm font-black" style={{ color: TOKENS.textMuted }}>Memuat analisis NLP...</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="NLP Insights & Summary">
      {/* Action Toolbar */}
      <div id="nlp-toolbar" className="border-b bg-white/50 backdrop-blur-md px-6 py-3 flex items-center justify-between gap-4 flex-wrap" style={{ borderColor: TOKENS.divider }}>
        <span className="text-xs font-bold" style={{ color: TOKENS.textMuted }}>
          NLP Analysis · Analisis caption &amp; performa konten berbasis ML
        </span>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} disabled={refreshing}
            className="h-10 rounded-xl px-4 font-black text-sm disabled:opacity-50"
            style={{ background: '#111', color: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>
            {refreshing ? (
              <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" strokeWidth={2.5} />Merangkum...</>
            ) : (
              <><Wand2 className="w-4 h-4 mr-1.5" strokeWidth={2.5} />Refresh Summary</>
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
            className="h-10 rounded-xl px-4 font-black text-sm disabled:opacity-40"
            style={{ background: '#fff', color: '#111', border: '1px solid #e5e5e5', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <FileDown className="w-4 h-4 mr-1.5" strokeWidth={2.5} />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Full-screen overlay saat refreshing */}
      {refreshing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4"
          style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center">
            <Wand2 className="w-7 h-7 text-white animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-gray-900">Merangkum data...</p>
            <p className="text-sm text-gray-400 mt-1">AI sedang menganalisis pola konten &amp; engagement</p>
          </div>
          <div className="flex gap-1.5 mt-2">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-black animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      )}

      <div className="p-6 space-y-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {error && (
          <div
            className="p-4 rounded-xl flex items-center gap-3 text-sm font-bold"
            style={{ background: TOKENS.negativeBg, border: `1px solid rgba(185,28,28,0.2)`, color: TOKENS.negative }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {accountFilter === 'all' && comparativeData ? (
          <div className="space-y-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>

            {/* Period selector */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ background: 'rgba(0,0,0,0.04)', border: `1px solid ${TOKENS.inputBorder}` }}>
                {[{ key: 'weekly', label: 'Mingguan' }, { key: 'monthly', label: 'Bulanan' }].map(p => {
                  const sel = period === p.key;
                  return (
                    <button key={p.key} onClick={() => setPeriod(p.key as any)} type="button"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer"
                      style={{ background: sel ? '#fff' : 'transparent', color: sel ? TOKENS.text : TOKENS.textMuted, boxShadow: sel ? '0 1px 6px rgba(0,0,0,0.08)' : 'none', border: sel ? `1px solid ${TOKENS.inputBorder}` : '1px solid transparent' }}>
                      {p.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold" style={{ color: TOKENS.textMuted }}>
                <Clock className="w-3.5 h-3.5" strokeWidth={2.4} />
                <span className="font-black" style={{ color: TOKENS.text }}>{period === 'weekly' ? '7 Hari Terakhir' : '30 Hari Terakhir'}</span>
              </div>
            </div>

            {/* Account Banner */}
            {(() => {
              const mainId = localStorage.getItem("analytics_main_influencer_id");
              const compIdsRaw = localStorage.getItem("analytics_competitor_influencer_ids");
              const compIds: string[] = compIdsRaw ? (() => { try { return JSON.parse(compIdsRaw); } catch { return []; } })() : [];
              const mainAcc = accounts.find((a: any) => a.influencerId?.toString() === mainId);
              const compAccs = compIds.map((id: string) => accounts.find((a: any) => a.influencerId?.toString() === id)).filter(Boolean);
              if (!mainId) return (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <p className="text-xs font-bold text-amber-700">Buka halaman <strong>Analytics</strong>, pilih akun utama &amp; kompetitor, lalu klik <strong>Analisis Data</strong> agar laporan ini terisi.</p>
                </div>
              );
              return (
                <div className="bg-white rounded-2xl border p-4 flex items-start gap-4 flex-wrap shadow-sm" style={{ borderColor: TOKENS.divider }}>
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white text-[9px] font-black">M</div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Akun Utama</p>
                      <p className="text-xs font-black text-gray-900">@{mainAcc?.username || mainId}</p>
                    </div>
                  </div>
                  {compAccs.length > 0 && (
                    <>
                      <div className="w-px h-8 bg-neutral-200 self-center flex-shrink-0" />
                      <div className="flex items-center gap-2 flex-wrap flex-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex-shrink-0">Kompetitor</p>
                        {compAccs.map((acc: any) => (
                          <span key={acc.influencerId} className="px-2 py-1 rounded-lg text-[11px] font-bold bg-neutral-100 text-gray-700">@{acc.username}</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })()}

            {isLoadingComparative || isLoadingContentTrend ? (
              <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-bold">Memuat data analitik...</span>
              </div>
            ) : contentTrendData.length === 0 ? (
              <div className="bg-white rounded-3xl border p-10 flex flex-col items-center gap-3 text-center shadow-sm" style={{ borderColor: TOKENS.divider }}>
                <AlertCircle className="w-8 h-8 text-amber-400" />
                <p className="text-sm font-black text-gray-700">Data Analytics belum tersedia</p>
                <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                  Buka halaman <strong>Analytics</strong> → pilih akun utama &amp; kompetitor → klik <strong>Analisis Data</strong>. Setelah data tersedia, halaman ini akan otomatis menampilkan laporan lengkap.
                </p>
              </div>
            ) : (() => {
              // ── Build narrative from ML data ──────────────────────────────────
              const top = contentTrendData[0];
              const rising = contentTrendData.filter((c: any) => c.trendDirection === 'rising');
              const stable = contentTrendData.filter((c: any) => c.trendDirection === 'stable');
              const declining = contentTrendData.filter((c: any) => c.trendDirection === 'declining');
              const mainAcc = accounts.find((a: any) => a.influencerId?.toString() === localStorage.getItem("analytics_main_influencer_id"));
              const mainName = mainAcc?.username || 'akun utama';
              const compCount = comparativeData.competitorSummaries?.length || 0;

              const execSummary = (() => {
                const risingNames = rising.map((c: any) => c.category).join(', ') || 'tidak ada';
                const topScore = top ? Math.round(top.potentialScore) : 0;
                const topEng = (() => { const l = top?.forecastTrend?.[top.forecastTrend.length - 1]; return l ? (l.avgEngagementRate * 100).toFixed(2) : '0.00'; })();
                return `Berdasarkan analisis ${period === 'weekly' ? '7 hari' : '30 hari'} terakhir terhadap @${mainName}${compCount > 0 ? ` dan ${compCount} akun kompetitor` : ''}, sistem mendeteksi bahwa kategori konten <strong>${top?.category || '—'}</strong> memiliki peluang terbesar dengan Opportunity Score <strong>${topScore}/100</strong> dan estimasi engagement rate <strong>${topEng}%</strong> dalam 7 hari ke depan. Kategori yang sedang naik tren: <strong>${risingNames}</strong>. ${rising.length === 0 ? 'Saat ini tidak ada kategori yang signifikan naik tren — fokus pada konsistensi konten.' : 'Waktu yang tepat untuk mulai membuat konten pada kategori tersebut.'}`;
              })();

              const categoryNarrative = contentTrendData.map((c: any) => {
                const last = c.forecastTrend?.[c.forecastTrend.length - 1];
                const est = last ? (last.avgEngagementRate * 100).toFixed(2) : '0.00';
                const trendWord = c.trendDirection === 'rising' ? 'sedang naik tren' : c.trendDirection === 'declining' ? 'menunjukkan penurunan tren' : 'berada dalam tren stabil';
                const supportWord = c.trendDirection === 'rising' ? 'Tren saat ini mendukung kategori ini — momentum yang baik untuk segera posting.' : c.trendDirection === 'stable' ? 'Tren stabil — konsistensi posting akan memberikan hasil terbaik.' : 'Tren sedang melemah — pertimbangkan inovasi konten atau shift ke kategori lain.';
                return { ...c, est, trendWord, supportWord };
              });

              return (
                <>
                  {/* ── 1. EXECUTIVE SUMMARY ── */}
                  <div className="bg-neutral-900 text-white rounded-3xl p-6 flex flex-col gap-4 shadow-lg">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black">Executive Summary</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-bold border border-white/10">AI Generated · ML Data</span>
                        </div>
                        <p className="text-[10px] text-white/40 mt-0.5">Ringkasan otomatis dari hasil analisis Analytics · {period === 'weekly' ? '7 hari terakhir' : '30 hari terakhir'}</p>
                      </div>
                    </div>
                    {isLoadingNlp ? (
                      <div className="flex items-center gap-2 text-white/40 text-xs">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        NLP model sedang merangkum data analitik...
                      </div>
                    ) : nlpAnalyticsSummary ? (
                      <p className="text-sm text-white/80 leading-relaxed">{nlpAnalyticsSummary}</p>
                    ) : (
                      <p className="text-sm text-white/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: execSummary }} />
                    )}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <p className="text-2xl font-black text-white">{rising.length}</p>
                        <p className="text-[10px] text-emerald-400 font-bold mt-0.5">Kategori Naik</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <p className="text-2xl font-black text-white">{Math.round(top?.potentialScore || 0)}</p>
                        <p className="text-[10px] text-white/40 font-bold mt-0.5">Top Score</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <p className="text-2xl font-black text-white">{compCount}</p>
                        <p className="text-[10px] text-white/40 font-bold mt-0.5">Kompetitor</p>
                      </div>
                    </div>
                  </div>

                  {/* ── 2. MAIN ACCOUNT vs COMPETITOR BENCHMARK ── */}
                  <div className="bg-white rounded-3xl border p-6 flex flex-col gap-5 shadow-sm" style={{ borderColor: TOKENS.divider }}>
                    <div className="border-b pb-4" style={{ borderColor: TOKENS.divider }}>
                      <h3 className="text-sm font-black text-gray-800">Benchmark: Akun Utama vs Kompetitor</h3>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Perbandingan engagement, volume, keyword, dan kategori konten antar akun</p>
                    </div>

                    {/* Table 1: Per-account performance */}
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Performa Per Akun</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b" style={{ borderColor: TOKENS.divider }}>
                              <th className="text-left py-2 pr-4 font-black text-gray-500 text-[10px] uppercase tracking-widest w-36">Akun</th>
                              <th className="text-right py-2 px-3 font-black text-gray-500 text-[10px] uppercase tracking-widest">Avg Engagement</th>
                              <th className="text-right py-2 px-3 font-black text-gray-500 text-[10px] uppercase tracking-widest">Total Video</th>
                              <th className="text-right py-2 px-3 font-black text-gray-500 text-[10px] uppercase tracking-widest">Sentiment</th>
                              <th className="text-right py-2 pl-3 font-black text-gray-500 text-[10px] uppercase tracking-widest">Top Keywords</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Main account row */}
                            <tr className="border-b" style={{ borderColor: TOKENS.divider }}>
                              <td className="py-2.5 pr-4">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded bg-black flex items-center justify-center text-white text-[8px] font-black flex-shrink-0">M</span>
                                  <span className="font-black text-gray-900">@{mainName}</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <span className="font-black text-gray-900">
                                  {(() => {
                                    const total = contentTrendData.reduce((s, c) => s + (c.mainAccountVideoCount || 0), 0);
                                    const weighted = contentTrendData.reduce((s, c) => s + (c.mainAccountEngagementRate || 0) * (c.mainAccountVideoCount || 0), 0);
                                    const avg = total > 0 ? weighted / total : 0;
                                    return total > 0 ? `${(avg * 100).toFixed(2)}%` : <span className="text-gray-400 italic font-normal">—</span>;
                                  })()}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-black text-gray-900">
                                {contentTrendData.reduce((s, c) => s + (c.mainAccountVideoCount || 0), 0) || <span className="text-gray-400 italic font-normal">—</span>}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                {comparativeData.mainSummary?.sentimentOverall
                                  ? <span className="px-2 py-0.5 rounded-full text-[10px] font-black" style={{ background: comparativeData.mainSummary.sentimentOverall === 'positive' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: comparativeData.mainSummary.sentimentOverall === 'positive' ? '#059669' : '#d97706' }}>{comparativeData.mainSummary.sentimentOverall}</span>
                                  : <span className="text-gray-400 italic text-[10px]">—</span>}
                              </td>
                              <td className="py-2.5 pl-3 text-right">
                                <div className="flex flex-wrap gap-1 justify-end">
                                  {comparativeData.mainKeywords?.slice(0, 3).map((k: any, i: number) => (
                                    <span key={i} className="px-1.5 py-0.5 rounded bg-neutral-100 text-[10px] font-bold text-gray-700">{k.keyword}</span>
                                  ))}
                                  {(!comparativeData.mainKeywords || comparativeData.mainKeywords.length === 0) && <span className="text-gray-400 italic text-[10px]">—</span>}
                                </div>
                              </td>
                            </tr>
                            {/* Competitor rows — from localStorage compIds, fallback to accounts with keywords */}
                            {(() => {
                              const compIdsRaw = localStorage.getItem("analytics_competitor_influencer_ids");
                              const compIds: string[] = compIdsRaw ? (() => { try { return JSON.parse(compIdsRaw); } catch { return []; } })() : [];
                              // merge: prefer summary data, fallback to keyword-only
                              const allCompIds = compIds.length > 0
                                ? compIds
                                : Array.from(new Set<string>(comparativeData.competitorKeywords?.map((k: any) => k.influencerId) || []));
                              if (allCompIds.length === 0) return (
                                <tr><td colSpan={5} className="py-4 text-center text-xs text-gray-400 italic">Tidak ada kompetitor yang dikonfigurasi</td></tr>
                              );
                              return allCompIds.map((id: string) => {
                                const accObj = accounts.find((a: any) => a.influencerId?.toString() === id);
                                const username = accObj?.username || id;
                                const summaryData = comparativeData.competitorSummaries?.find((c: any) => c.influencerId === id)?.data;
                                const insightData = comparativeData.competitorInsights?.find((ins: any) => ins.influencerId?.toString() === id);
                                const ctStats = competitorStatsMap[id];
                                const compKws = comparativeData.competitorKeywords?.filter((k: any) => k.influencerId?.toString() === id) || [];
                                return (
                                  <tr key={id} className="border-b" style={{ borderColor: TOKENS.divider }}>
                                    <td className="py-2.5 pr-4">
                                      <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded bg-neutral-300 flex items-center justify-center text-white text-[8px] font-black flex-shrink-0">{username.substring(0,2).toUpperCase()}</span>
                                        <span className="font-bold text-gray-700">@{username}</span>
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-black text-gray-700">
                                      {(ctStats?.avgEngagementRate || insightData?.avgEngagementRate || summaryData?.avgEngagementRate)
                                        ? `${(Number(ctStats?.avgEngagementRate ?? insightData?.avgEngagementRate ?? summaryData?.avgEngagementRate) * 100).toFixed(2)}%`
                                        : <span className="text-gray-400 text-[10px]">—</span>}
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-bold text-gray-700">
                                      {ctStats?.totalVideos ?? insightData?.totalVideos ?? summaryData?.totalVideosAnalyzed ?? <span className="text-gray-400 text-[10px]">—</span>}
                                    </td>
                                    <td className="py-2.5 px-3 text-right">
                                      {summaryData?.sentimentOverall
                                        ? <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(0,0,0,0.05)', color: '#666' }}>{summaryData.sentimentOverall}</span>
                                        : <span className="text-gray-400 italic text-[10px]">—</span>}
                                    </td>
                                    <td className="py-2.5 pl-3 text-right">
                                      <div className="flex flex-wrap gap-1 justify-end">
                                        {compKws.slice(0, 3).map((k: any, i: number) => (
                                          <span key={i} className="px-1.5 py-0.5 rounded bg-neutral-100 text-[10px] font-bold text-gray-500">{k.keyword}</span>
                                        ))}
                                        {compKws.length === 0 && <span className="text-gray-400 italic text-[10px]">—</span>}
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

                    {/* Table 2: Category breakdown main vs competitor */}
                    {contentTrendData.some((c: any) => c.mainAccountVideoCount > 0 || c.competitorVideoCount > 0) && (
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Distribusi Kategori: Akun Utama vs Kompetitor</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b" style={{ borderColor: TOKENS.divider }}>
                                <th className="text-left py-2 pr-4 font-black text-gray-500 text-[10px] uppercase tracking-widest">Kategori</th>
                                <th className="text-right py-2 px-3 font-black text-gray-500 text-[10px] uppercase tracking-widest">Main Videos</th>
                                <th className="text-right py-2 px-3 font-black text-gray-500 text-[10px] uppercase tracking-widest">Main Eng%</th>
                                <th className="text-right py-2 px-3 font-black text-gray-500 text-[10px] uppercase tracking-widest">Komp Videos</th>
                                <th className="text-right py-2 px-3 font-black text-gray-500 text-[10px] uppercase tracking-widest">Komp Eng%</th>
                                <th className="text-right py-2 pl-3 font-black text-gray-500 text-[10px] uppercase tracking-widest">Gap</th>
                              </tr>
                            </thead>
                            <tbody>
                              {contentTrendData.map((c: any) => {
                                const gap = c.mainAccountEngagementRate - c.competitorEngagementRate;
                                const gapColor = gap > 0 ? '#10b981' : gap < 0 ? '#ef4444' : '#6b7280';
                                return (
                                  <tr key={c.category} className="border-b" style={{ borderColor: TOKENS.divider }}>
                                    <td className="py-2.5 pr-4 font-black text-gray-800">{c.category}</td>
                                    <td className="py-2.5 px-3 text-right font-bold text-gray-700">{c.mainAccountVideoCount || 0}</td>
                                    <td className="py-2.5 px-3 text-right font-bold text-gray-700">
                                      {c.mainAccountVideoCount > 0 ? `${(c.mainAccountEngagementRate * 100).toFixed(2)}%` : <span className="text-gray-400">—</span>}
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-bold text-gray-500">{c.competitorVideoCount || 0}</td>
                                    <td className="py-2.5 px-3 text-right font-bold text-gray-500">
                                      {c.competitorVideoCount > 0 ? `${(c.competitorEngagementRate * 100).toFixed(2)}%` : <span className="text-gray-400">—</span>}
                                    </td>
                                    <td className="py-2.5 pl-3 text-right">
                                      {(c.mainAccountVideoCount > 0 && c.competitorVideoCount > 0)
                                        ? <span className="font-black text-[11px]" style={{ color: gapColor }}>{gap > 0 ? '+' : ''}{(gap * 100).toFixed(2)}%</span>
                                        : <span className="text-gray-400 text-[10px]">—</span>}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2">* Gap = Main Engagement% − Kompetitor Engagement%. Positif = akun utama unggul di kategori tersebut.</p>
                      </div>
                    )}

                    {/* Keyword overlap */}
                    {comparativeData.mainKeywords?.length > 0 && comparativeData.competitorKeywords?.length > 0 && (() => {
                      const mainKwSet = new Set<string>(comparativeData.mainKeywords.map((k: any) => k.keyword));
                      const compKwSet = new Set<string>(comparativeData.competitorKeywords.map((k: any) => k.keyword));
                      const overlap = [...mainKwSet].filter(k => compKwSet.has(k));
                      const mainOnly = [...mainKwSet].filter(k => !compKwSet.has(k));
                      const compOnly = [...compKwSet].filter(k => !mainKwSet.has(k));
                      return (
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Keyword Overlap Analysis</p>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 rounded-2xl border" style={{ borderColor: TOKENS.divider, background: 'rgba(16,185,129,0.04)' }}>
                              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2">Unik Main ({mainOnly.length})</p>
                              <div className="flex flex-wrap gap-1">
                                {mainOnly.slice(0, 6).map((k, i) => <span key={i} className="px-1.5 py-0.5 rounded bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-100">{k}</span>)}
                              </div>
                            </div>
                            <div className="p-3 rounded-2xl border" style={{ borderColor: TOKENS.divider, background: 'rgba(0,0,0,0.02)' }}>
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Overlap ({overlap.length})</p>
                              <div className="flex flex-wrap gap-1">
                                {overlap.slice(0, 6).map((k, i) => <span key={i} className="px-1.5 py-0.5 rounded bg-neutral-100 text-[10px] font-bold text-gray-600">{k}</span>)}
                              </div>
                            </div>
                            <div className="p-3 rounded-2xl border" style={{ borderColor: TOKENS.divider, background: 'rgba(245,158,11,0.04)' }}>
                              <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2">Unik Kompetitor ({compOnly.length})</p>
                              <div className="flex flex-wrap gap-1">
                                {compOnly.slice(0, 6).map((k, i) => <span key={i} className="px-1.5 py-0.5 rounded bg-amber-50 text-[10px] font-bold text-amber-700 border border-amber-100">{k}</span>)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* ── 3. CATEGORY ANALYSIS NARRATIVE ── */}
                  <div className="bg-white rounded-3xl border p-6 flex flex-col gap-5 shadow-sm" style={{ borderColor: TOKENS.divider }}>
                    <div className="border-b pb-4" style={{ borderColor: TOKENS.divider }}>
                      <h3 className="text-sm font-black text-gray-800">Analisis Kategori Konten</h3>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Prediksi tren · rekomendasi konten · potensi engagement per kategori</p>
                    </div>
                    <div className="space-y-4">
                      {categoryNarrative.map((c: any, idx: number) => {
                        const trendColor = c.trendDirection === 'rising' ? '#10b981' : c.trendDirection === 'declining' ? '#ef4444' : '#f59e0b';
                        const TIcon = c.trendDirection === 'rising' ? TrendingUp : c.trendDirection === 'declining' ? TrendingDown : null;
                        return (
                          <div key={c.category} className="p-4 rounded-2xl border" style={{ borderColor: TOKENS.divider }}>
                            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-black text-gray-600">{idx + 1}</span>
                                <span className="text-sm font-black text-gray-800">{c.category}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: trendColor + '18', color: trendColor }}>
                                  {TIcon && <TIcon className="w-3 h-3" />}{c.trendDirection === 'rising' ? 'Naik Tren' : c.trendDirection === 'declining' ? 'Menurun' : 'Stabil'}
                                  {c.predictedChangePct !== 0 && ` ${c.predictedChangePct > 0 ? '+' : ''}${c.predictedChangePct?.toFixed(1)}%`}
                                </span>
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-black text-white">Score {Math.round(c.potentialScore)}</span>
                              </div>
                            </div>
                            {/* Narrative answers */}
                            <div className="space-y-2 text-xs text-gray-600 leading-relaxed">
                              <p><span className="font-black text-gray-800">Cocok untuk akun utama?</span> {c.mainAccountVideoCount > 0 ? `Ya — akun sudah memiliki ${c.mainAccountVideoCount} video di kategori ini dengan avg engagement ${(c.mainAccountEngagementRate * 100).toFixed(2)}%.` : `Belum ada video di kategori ini — peluang untuk mengeksplorasi niche baru.`}</p>
                              <p><span className="font-black text-gray-800">Potensi engagement 7 hari ke depan:</span> Estimasi <strong>{c.est}%</strong> — {parseFloat(c.est) > 3 ? 'di atas rata-rata, sangat menjanjikan.' : parseFloat(c.est) > 1 ? 'cukup baik, konsisten posting akan meningkatkan performa.' : 'rendah, pertimbangkan optimasi caption & hashtag.'}</p>
                              <p><span className="font-black text-gray-800">Apakah tren mendukung?</span> {c.supportWord}</p>
                              {c.competitorVideoCount > 0 && (
                                <p><span className="font-black text-gray-800">Benchmark kompetitor:</span> Kompetitor memiliki {c.competitorVideoCount} video di kategori ini dengan avg engagement {(c.competitorEngagementRate * 100).toFixed(2)}% — {c.competitorEngagementRate > c.mainAccountEngagementRate ? 'kompetitor lebih unggul, analisis strategi mereka.' : 'akun utama lebih unggul dari kompetitor di kategori ini.'}</p>
                              )}
                              <p className="flex items-start gap-1.5 text-gray-500 italic border-t pt-2" style={{ borderColor: '#f0f0f0' }}>
                                <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                                {c.recommendation}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── 3. HASHTAG + POSTING TIME NARRATIVE ── */}
                  <div className="bg-white rounded-3xl border p-6 flex flex-col gap-4 shadow-sm" style={{ borderColor: TOKENS.divider }}>
                    <div className="border-b pb-4" style={{ borderColor: TOKENS.divider }}>
                      <h3 className="text-sm font-black text-gray-800">Rekomendasi Hashtag &amp; Waktu Posting</h3>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Strategi distribusi konten berbasis ML untuk akun utama</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Hashtag Prioritas</p>
                        {hashtagRecs.length > 0 ? (
                          <div className="space-y-2">
                            {hashtagRecs.slice(0, 5).map((h: any, i: number) => {
                              const compColor = h.competitionLevel?.toLowerCase() === 'low' ? '#10b981' : h.competitionLevel?.toLowerCase() === 'medium' ? '#f59e0b' : '#ef4444';
                              return (
                                <div key={h.hashtag} className="flex items-center gap-3 p-2.5 rounded-xl border" style={{ borderColor: TOKENS.divider }}>
                                  <span className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-[9px] font-black text-gray-600 flex-shrink-0">{i + 1}</span>
                                  <span className="text-xs font-black text-gray-800 flex-1">#{h.hashtag}</span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: compColor + '18', color: compColor }}>{h.competitionLevel}</span>
                                  <span className="text-[10px] font-black text-emerald-600 flex-shrink-0">{(h.expectedEngagementRate * 100).toFixed(1)}%</span>
                                </div>
                              );
                            })}
                            <p className="text-[11px] text-gray-400 leading-relaxed pt-1">
                              Gunakan kombinasi hashtag kompetisi rendah–menengah untuk memperluas jangkauan organik tanpa tenggelam di antara konten populer.
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic py-4">Rekomendasi hashtag belum tersedia — pastikan akun utama sudah dikonfigurasi di Analytics.</p>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Slot Waktu Terbaik</p>
                        {postingRecs.length > 0 ? (
                          <div className="space-y-2">
                            {postingRecs.slice(0, 5).map((t: any, i: number) => (
                              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border" style={{ borderColor: TOKENS.divider }}>
                                <span className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white text-[9px] font-black flex-shrink-0">{i + 1}</span>
                                <span className="text-xs font-black text-gray-800 flex-1">{t.dayName} · {t.timeLabel}</span>
                                <span className="text-[10px] font-black text-gray-600 flex-shrink-0">{(t.expectedEngagementRate * 100).toFixed(1)}% eng</span>
                              </div>
                            ))}
                            <p className="text-[11px] text-gray-400 leading-relaxed pt-1">
                              Posting pada slot waktu ini memaksimalkan visibilitas organik. Hindari posting bersamaan dengan jadwal sibuk kompetitor.
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic py-4">Data waktu posting optimal belum tersedia.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── 4. DATA USED + KEYWORDS ── */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-3xl border p-6 flex flex-col gap-4 shadow-sm" style={{ borderColor: TOKENS.divider }}>
                      <h3 className="text-sm font-black text-gray-800 border-b pb-3" style={{ borderColor: TOKENS.divider }}>Data yang Digunakan Prediksi</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Prediksi peluang performa konten didasarkan pada analisis historis multi-dimensi:
                      </p>
                      <div className="space-y-2 text-xs text-gray-600">
                        {[
                          { label: 'Metrik Video', desc: 'Views, likes, comments, shares, engagement rate dari semua akun yang dianalisis' },
                          { label: 'ML Predictions', desc: 'Viral probability (Random Forest), engagement tier (SVM), content cluster (K-Means)' },
                          { label: 'Teks Konten', desc: 'Caption, hashtag, mention, emoji, panjang judul, pertanyaan dalam caption' },
                          { label: 'Pola Temporal', desc: 'Hari posting, jam posting, tren 14 hari vs 15–30 hari sebelumnya' },
                          { label: 'Benchmark', desc: `Data perbandingan dari ${comparativeData.competitorSummaries?.length || 0} akun kompetitor` },
                        ].map(item => (
                          <div key={item.label} className="flex items-start gap-2 p-2 rounded-xl" style={{ background: 'rgba(0,0,0,0.02)' }}>
                            <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={3} />
                            <div><span className="font-black text-gray-800">{item.label}:</span> {item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-3xl border p-6 flex flex-col gap-4 shadow-sm" style={{ borderColor: TOKENS.divider }}>
                      <h3 className="text-sm font-black text-gray-800 border-b pb-3" style={{ borderColor: TOKENS.divider }}>Keyword Comparison</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Main Account</p>
                          <div className="flex flex-wrap gap-1.5">
                            {comparativeData.mainKeywords?.length > 0
                              ? comparativeData.mainKeywords.slice(0, 10).map((k: any, i: number) => <span key={i} className="px-2 py-1 rounded-lg bg-neutral-100 font-bold text-neutral-800 text-[11px]">{k.keyword}</span>)
                              : <span className="text-gray-400 italic text-[11px]">Tidak ada data</span>}
                          </div>
                        </div>
                        <div className="border-l pl-4" style={{ borderColor: TOKENS.divider }}>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Kompetitor</p>
                          <div className="flex flex-wrap gap-1.5">
                            {comparativeData.competitorKeywords?.length > 0
                              ? Array.from(new Set<string>(comparativeData.competitorKeywords.map((k: any) => k.keyword))).slice(0, 10).map((w, i) => <span key={i} className="px-2 py-1 rounded-lg bg-neutral-100 font-bold text-neutral-500 text-[11px]">{w}</span>)
                              : <span className="text-gray-400 italic text-[11px]">Tidak ada data</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── 5. IMPROVEMENT STRATEGY ── */}
                  <div className="bg-neutral-900 text-white rounded-3xl p-6 flex flex-col gap-4 shadow-lg">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black">Content Improvement Strategy</h3>
                        <p className="text-[10px] text-white/40">Rekomendasi aksi berbasis hasil analisis ML — siap dieksekusi</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-xs leading-relaxed text-neutral-300">
                      <p className="text-white/60 text-[11px] leading-relaxed">
                        Berikut adalah rekomendasi strategi konten yang dihasilkan dari analisis {contentTrendData.length} kategori, {hashtagRecs.length} hashtag, dan {postingRecs.length} slot waktu optimal:
                      </p>
                      {([
                        top && { Icon: Target, color: '#f472b6', title: 'Prioritas Kategori', body: `Fokuskan produksi konten pada kategori <strong>${top.category}</strong> (Score ${Math.round(top.potentialScore)}/100). ${top.trendDirection === 'rising' ? 'Momentum sedang naik — segera buat minimal 2–3 konten dalam minggu ini.' : 'Konsistensi adalah kunci — jadwalkan konten secara rutin untuk membangun momentum.'}` },
                        hashtagRecs.length > 0 && { Icon: Hash, color: '#60a5fa', title: 'Strategi Hashtag', body: `Gunakan <strong>${hashtagRecs.slice(0,3).map((h: any) => '#' + h.hashtag).join(', ')}</strong> sebagai hashtag utama. Pilih 3–5 hashtag kompetisi rendah untuk memperbesar peluang masuk FYP.` },
                        postingRecs.length > 0 && { Icon: CalendarClock, color: '#34d399', title: 'Jadwal Posting', body: `Posting pada <strong>${postingRecs[0]?.dayName} ${postingRecs[0]?.timeLabel}</strong> untuk engagement maksimal. Hindari overlap jadwal dengan kompetitor di hari/jam yang sama.` },
                        comparativeData.competitorKeywords?.length > 0 && { Icon: Search, color: '#fbbf24', title: 'Gap Konten', body: `Kompetitor aktif menggunakan kata kunci <strong>${Array.from(new Set<string>(comparativeData.competitorKeywords.map((k: any) => k.keyword))).slice(0,3).join(', ')}</strong>. Buat konten yang menjawab topik ini dengan sudut pandang akun Anda.` },
                        { Icon: BarChart2, color: '#a78bfa', title: 'Format Konten', body: 'Gunakan format tanya-jawab interaktif di 3 detik pertama video. Caption yang mengandung pertanyaan terbukti meningkatkan engagement rate secara signifikan.' },
                        { Icon: RefreshCw, color: '#94a3b8', title: 'Siklus Review', body: 'Evaluasi performa konten setiap 7 hari. Bandingkan engagement rate aktual vs proyeksi ML. Sesuaikan kategori dan jadwal posting berdasarkan data terbaru.' },
                      ] as any[]).filter(Boolean).map((item: any, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: item.color + '20' }}>
                            <item.Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                          </div>
                          <div>
                            <p className="font-black text-white text-xs mb-0.5">{item.title}</p>
                            <p className="text-white/60 text-[11px] leading-relaxed" dangerouslySetInnerHTML={{ __html: item.body }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        ) : summary ? (
          <>
            {/* Period tabs (prominent, secondary header) */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 p-1 rounded-xl"
                style={{ background: 'rgba(0,0,0,0.04)', border: `1px solid ${TOKENS.inputBorder}` }}>
                {[
                  { key: 'weekly',  label: 'Mingguan' },
                  { key: 'monthly', label: 'Bulanan' },
                ].map(p => {
                  const sel = period === p.key;
                  return (
                    <button key={p.key} onClick={() => setPeriod(p.key as any)}
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all"
                      style={{
                        background: sel ? '#fff' : 'transparent',
                        color:      sel ? TOKENS.text : TOKENS.textMuted,
                        boxShadow:  sel ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
                        border:     sel ? `1px solid ${TOKENS.inputBorder}` : '1px solid transparent',
                      }}>
                      {p.label}
                    </button>
                  );
                })}
              </div>

              {/* Period info */}
              <div className="flex items-center gap-2 text-xs font-bold" style={{ color: TOKENS.textMuted }}>
                <Clock className="w-3.5 h-3.5" strokeWidth={2.4} />
                Periode aktif: <span className="font-black" style={{ color: TOKENS.text }}>{summary.periodLabel}</span>
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
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#111' }}>
                    <Lightbulb className="w-4 h-4 text-white" strokeWidth={2.4} />
                  </div>
                  <div>
                    <h2 className="font-black text-sm tracking-tight" style={{ color: TOKENS.text }}>Key Insights</h2>
                    <p className="text-[11px]" style={{ color: TOKENS.textMuted }}>{insightsData.length} insight actionable dari analisis NLP</p>
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
          <div className="text-center py-20 bg-white rounded-2xl border" style={{ borderColor: TOKENS.cardBorder }}>
            <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: TOKENS.textMuted }} />
            <h3 className="text-base font-black mb-1" style={{ color: TOKENS.text }}>Belum Ada Analisis NLP</h3>
            <p className="text-xs mb-6 max-w-sm mx-auto" style={{ color: TOKENS.textMuted }}>Sistem belum menemukan ringkasan NLP untuk akun atau periode ini. Silakan generate ringkasan baru sekarang.</p>
            <Button onClick={() => setDialogOpen(true)}
              className="rounded-xl px-5 font-black text-xs"
              style={{ background: '#111', color: '#fff' }}>
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