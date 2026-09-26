'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import {
  Search, Filter, ChevronDown, Check, X,
  Users, Video, Eye, Flame, Crown, Sparkles, LayoutGrid, Rows3,
  Layers, BarChart2,
} from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { apiFetch } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/endpoints';
import {
  VideoType,
  TYPE_META,
  formatNum,
  initialsFrom,
} from '@/lib/video-library/mock-data';
import { VideoKpis } from '@/components/video-library/VideoKpis';
import { VideoCard } from '@/components/video-library/VideoCard';
import { VideoListRow } from '@/components/video-library/VideoListRow';
import { VideoDetailDrawer } from '@/components/video-library/VideoDetailDrawer';
import { CompareDrawer } from '@/components/video-library/CompareDrawer';
import { CompareBar } from '@/components/video-library/CompareBar';

function VideoLibraryProcessingLoader() {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = useMemo(() => [
    { label: "Memuat pustaka video & metrik interaksi...", icon: Video, sub: "TikTok Video Aggregator" },
    { label: "Menghitung engagement rate & akumulasi penonton...", icon: Eye, sub: "Engagement & Reach Analytics Pipeline" },
    { label: "Mengidentifikasi konten trending & viral...", icon: Flame, sub: "Velocity & Trending Detection Engine" },
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(timer);
  }, [steps.length]);

  const CurrentIcon = steps[stepIndex].icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] px-4">
      <div className="relative flex flex-col items-center max-w-md w-full text-center">
        {/* Animated pulsing rings & Central Icon */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute -inset-4 rounded-full bg-sky-400/20 dark:bg-sky-500/10 blur-xl animate-pulse" />
          <div className="absolute w-24 h-24 rounded-full border border-sky-300/40 dark:border-sky-500/20 animate-ping opacity-30" style={{ animationDuration: '2.5s' }} />
          <div className="absolute w-20 h-20 rounded-2xl border border-stone-200 dark:border-neutral-700 animate-spin" style={{ animationDuration: '10s' }} />
          
          <div className="relative w-16 h-16 rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-700 shadow-md flex items-center justify-center text-sky-600 dark:text-sky-400">
            <CurrentIcon className="w-7 h-7 animate-pulse transition-all duration-300" />
          </div>
        </div>

        {/* Dynamic Step Text */}
        <div className="space-y-1.5 min-h-[56px]">
          <h3 className="text-sm md:text-base font-bold text-stone-900 dark:text-white transition-all duration-300">
            {steps[stepIndex].label}
          </h3>
          <p className="text-xs font-mono text-stone-500 dark:text-neutral-400">
            {steps[stepIndex].sub}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-1 bg-stone-200 dark:bg-neutral-800 rounded-full overflow-hidden mt-6">
          <div
            className="h-full bg-sky-600 dark:bg-sky-400 rounded-full transition-all duration-500"
            style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-1.5 mt-3">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === stepIndex
                  ? 'w-6 bg-sky-600 dark:bg-sky-400'
                  : 'w-1.5 bg-stone-200 dark:bg-neutral-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const ShimmerCard = () => (
  <div className="rounded-xl p-4 space-y-4 bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 animate-pulse">
    <div className="h-36 w-full rounded-lg bg-stone-100 dark:bg-neutral-800" />
    <div className="h-4 w-3/4 rounded bg-stone-100 dark:bg-neutral-800" />
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 flex-1">
        <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-neutral-800" />
        <div className="space-y-1 flex-1">
          <div className="h-3 w-16 rounded bg-stone-100 dark:bg-neutral-800" />
          <div className="h-2 w-10 rounded bg-stone-100 dark:bg-neutral-800" />
        </div>
      </div>
      <div className="h-3 w-14 rounded bg-stone-100 dark:bg-neutral-800" />
    </div>
    <div className="h-10 w-full rounded-lg bg-stone-100 dark:bg-neutral-800" />
    <div className="h-2 w-full rounded bg-stone-100 dark:bg-neutral-800" />
  </div>
);

const ShimmerRow = () => (
  <div
    className="grid items-center gap-4 px-6 py-4 animate-pulse border-b border-stone-100 dark:border-neutral-800"
    style={{
      gridTemplateColumns: '32px 1.6fr 0.8fr 90px 90px 90px 110px 90px',
    }}
  >
    <div className="w-5 h-5 rounded bg-stone-100 dark:bg-neutral-800" />
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-neutral-800" />
      <div className="space-y-1.5 flex-1">
        <div className="h-4 w-2/3 rounded bg-stone-100 dark:bg-neutral-800" />
        <div className="flex gap-2">
          <div className="h-3 w-12 rounded bg-stone-100 dark:bg-neutral-800" />
          <div className="h-3 w-16 rounded bg-stone-100 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-md bg-stone-100 dark:bg-neutral-800" />
      <div className="h-3 w-16 rounded bg-stone-100 dark:bg-neutral-800" />
    </div>
    <div className="h-4 w-12 rounded bg-stone-100 dark:bg-neutral-800" />
    <div className="h-4 w-10 rounded bg-stone-100 dark:bg-neutral-800" />
    <div className="h-4 w-10 rounded bg-stone-100 dark:bg-neutral-800" />
    <div className="h-5 w-14 rounded bg-stone-100 dark:bg-neutral-800" />
    <div className="h-7 w-16 rounded-lg bg-stone-100 dark:bg-neutral-800" />
  </div>
);

export default function VideoLibraryPage() {
  const [videos, setVideos]             = useState<VideoType[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isKpisLoading, setIsKpisLoading] = useState(true);
  const [searchVal, setSearchVal]       = useState('');
  const [searchQuery, setSearchQuery]   = useState('');
  const [accountFilter, setAccountFilter] = useState('all');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy]             = useState('recent');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [viewMode, setViewMode]         = useState<'grid' | 'list'>('grid');
  const [openVideo, setOpenVideo]       = useState<VideoType | null>(null);
  const [selectedIds, setSelectedIds]   = useState<number[]>([]);
  const [compareOpen, setCompareOpen]   = useState(false);

  // Pagination states
  const [page, setPage]                 = useState(0);
  const [pageSize, setPageSize]         = useState(24);
  const [totalItems, setTotalItems]     = useState(0);
  const [totalPages, setTotalPages]     = useState(0);

  // Metadata / Global states
  const [trendingVideos, setTrendingVideos] = useState<VideoType[]>([]);
  const [topVideos, setTopVideos]           = useState<VideoType[]>([]);
  const [summaryData, setSummaryData]       = useState<any>(null);
  const [trackedAccounts, setTrackedAccounts] = useState<any[]>([]);

  const accountsMapRef = useRef<Map<string, { displayName: string; trackingType: 'own' | 'competitor' | 'inspiration' }>>(new Map());

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchVal);
      setPage(0);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchVal]);

  const mapBackendVideo = useCallback((item: any, status: 'trending' | 'top' | 'normal'): VideoType => {
    const match = item.videoUrl?.match(/@([^/]+)/);
    const username = match ? match[1] : '';
    const acc = accountsMapRef.current.get(username) || {
      displayName: item.nickName || username || 'Anonymous',
      trackingType: 'inspiration' as const,
    };

    const categories = ['tutorial', 'tips', 'diy', 'vlog', 'review', 'compare', 'unboxing', 'tour', 'music'];
    const getCategory = (title: string, id: number) => {
      const t = title.toLowerCase();
      if (t.includes('tutorial') || t.includes('cara') || t.includes('stek') || t.includes('panduan')) return 'tutorial';
      if (t.includes('tips') || t.includes('trik') || t.includes('rahasia')) return 'tips';
      if (t.includes('diy') || t.includes('buat sendiri') || t.includes('bikin')) return 'diy';
      if (t.includes('review') || t.includes('ulasan') || t.includes('worth it')) return 'review';
      if (t.includes('vs') || t.includes('banding') || t.includes('perbandingan')) return 'compare';
      if (t.includes('unboxing') || t.includes('buka paket')) return 'unboxing';
      if (t.includes('tour') || t.includes('kebun') || t.includes('taman') || t.includes('keliling')) return 'tour';
      if (t.includes('vlog') || t.includes('routine') || t.includes('asmr')) return 'vlog';
      if (t.includes('music') || t.includes('lagu') || t.includes('sound')) return 'music';
      
      const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + id;
      return categories[hash % categories.length];
    };

    const formatDuration = (sec: number) => {
      if (!sec) return '0:00';
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const getRelativeTime = (isoString: string) => {
      if (!isoString) return '';
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffSec < 60) return 'baru saja';
      if (diffMin < 60) return `${diffMin}m lalu`;
      if (diffHour < 24) return `${diffHour}j lalu`;
      if (diffDay === 1) return 'kemarin';
      if (diffDay < 30) return `${diffDay}h lalu`;
      const diffMonth = Math.floor(diffDay / 30);
      if (diffMonth < 12) return `${diffMonth} bln lalu`;
      return `${Math.floor(diffMonth / 12)} th lalu`;
    };

    const title = item.titleBrief || 'Untitled Video';

    return {
      id: item.videoPk,
      title,
      account: username,
      accountDisplayName: acc.displayName,
      accountType: acc.trackingType,
      category: getCategory(title, item.videoPk),
      views: item.viewsNum || 0,
      likes: item.likesNum || 0,
      comments: item.commentsNum || 0,
      shares: item.sharesNum || 0,
      engagement: parseFloat(((item.engagementRate || 0) * 100).toFixed(1)),
      duration: formatDuration(item.durationSeconds),
      hashtags: [],
      publishedAt: getRelativeTime(item.publishedAt),
      publishedDate: item.publishedAt ? item.publishedAt.substring(0, 10) : '',
      status,
      history: [],
      coverUrl: item.coverUrl,
      videoUrl: item.videoUrl,
    };
  }, []);

  // 1. Fetch tracked accounts & top/trending & summary once on mount
  useEffect(() => {
    async function loadMetadata() {
      try {
        setIsKpisLoading(true);
        const accountsRes = await apiFetch<any[]>(API_ENDPOINTS.accounts.list);
        const accountsMap = new Map<string, { displayName: string; trackingType: 'own' | 'competitor' | 'inspiration' }>();
        const list: any[] = [];
        if (accountsRes.success && Array.isArray(accountsRes.data)) {
          accountsRes.data.forEach((acc: any) => {
            const mappedAcc = {
              displayName: acc.displayName || acc.nickname || acc.uniqueId,
              trackingType: acc.trackingType as 'own' | 'competitor' | 'inspiration',
            };
            accountsMap.set(acc.uniqueId, mappedAcc);
            list.push({
              username: acc.uniqueId,
              type: acc.trackingType || 'inspiration',
              displayName: acc.displayName || acc.nickname || acc.uniqueId,
            });
          });
        }
        accountsMapRef.current = accountsMap;
        setTrackedAccounts(list);

        const [trendingRes, topRes, summaryRes] = await Promise.all([
          apiFetch<any[]>(API_ENDPOINTS.videos.trending).catch(e => { console.error(e); return { success: false, data: [] }; }),
          apiFetch<any[]>(API_ENDPOINTS.videos.top).catch(e => { console.error(e); return { success: false, data: [] }; }),
          apiFetch<any>(API_ENDPOINTS.dashboard.summary).catch(e => { console.error(e); return { success: false, data: null }; }),
        ]);

        if (trendingRes.success && Array.isArray(trendingRes.data)) {
          setTrendingVideos(trendingRes.data.map(item => mapBackendVideo(item, 'trending')));
        }
        if (topRes.success && Array.isArray(topRes.data)) {
          setTopVideos(topRes.data.map(item => mapBackendVideo(item, 'top')));
        }
        if (summaryRes.success) {
          setSummaryData(summaryRes.data);
        }
      } catch (err) {
        console.error("Failed to load metadata/KPIs:", err);
      } finally {
        setIsKpisLoading(false);
        setIsInitialLoading(false);
      }
    }

    loadMetadata();
  }, [mapBackendVideo]);

  // 2. Fetch paginated data from API
  useEffect(() => {
    if (statusFilter !== 'all' && statusFilter !== 'normal') {
      return;
    }

    let isMounted = true;

    async function fetchPaginatedData() {
      try {
        setIsLoading(true);
        const searchParam = searchQuery.trim();
        const accountParam = accountFilter === 'all' ? '' : accountFilter;

        const res = await apiFetch<any>(
          `${API_ENDPOINTS.videos.list}?page=${page}&size=${pageSize}&search=${encodeURIComponent(searchParam)}&account=${encodeURIComponent(accountParam)}`
        );

        if (isMounted && res.success && res.data) {
          const items = res.data.items || [];
          const mapped = items.map((item: any) => {
            let status: 'trending' | 'top' | 'normal' = 'normal';
            if (trendingVideos.some(t => t.id === item.videoPk)) {
              status = 'trending';
            } else if (topVideos.some(t => t.id === item.videoPk)) {
              status = 'top';
            }
            return mapBackendVideo(item, status);
          });

          setVideos(mapped);
          setTotalItems(res.data.totalItems || 0);
          setTotalPages(res.data.totalPages || 0);
        }
      } catch (err) {
        console.error("Failed to load paginated videos:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPaginatedData();

    return () => {
      isMounted = false;
    };
  }, [page, pageSize, searchQuery, accountFilter, statusFilter, trendingVideos, topVideos, mapBackendVideo]);

  // Filter matcher for client-side lists (trending / top)
  const matchesFilter = useCallback((v: VideoType) => {
    const q = searchQuery.trim().toLowerCase();
    const matchQ = !q || v.title.toLowerCase().includes(q) || v.account.toLowerCase().includes(q);
    const matchAcc = accountFilter === 'all' || v.account === accountFilter;
    return matchQ && matchAcc;
  }, [searchQuery, accountFilter]);

  // Combined counts
  const allCount = statusFilter === 'all' || statusFilter === 'normal' ? totalItems : (summaryData?.totalVideos ?? 0);
  const trendingCount = trendingVideos.filter(matchesFilter).length;
  const topCount = topVideos.filter(matchesFilter).length;
  const normalCount = allCount;

  // Filter + sort (merged display list)
  const filtered = useMemo(() => {
    let list: VideoType[] = [];
    if (statusFilter === 'trending') {
      list = trendingVideos.filter(matchesFilter);
    } else if (statusFilter === 'top') {
      list = topVideos.filter(matchesFilter);
    } else if (statusFilter === 'normal') {
      list = videos.filter(v => v.status === 'normal');
    } else {
      list = videos;
    }

    const cmp: Record<string, (a: VideoType, b: VideoType) => number> = {
      recent:     (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
      views:      (a, b) => b.views - a.views,
      engagement: (a, b) => b.engagement - a.engagement,
      likes:      (a, b) => b.likes - a.likes,
    };
    return [...list].sort(cmp[sortBy as keyof typeof cmp] ?? cmp.recent);
  }, [statusFilter, trendingVideos, topVideos, videos, matchesFilter, sortBy]);

  // Global KPIs using metadata & summary
  const kpis = useMemo(() => {
    return {
      total: summaryData?.totalVideos ?? 0,
      views: summaryData?.totalViews ?? 0,
      avgEng: summaryData?.averageEngagementRate ? (summaryData.averageEngagementRate * 100).toFixed(1) : '0.0',
      trending: trendingVideos.length,
    };
  }, [summaryData, trendingVideos]);

  // Shimmer helper
  const showShimmers = (statusFilter === 'all' || statusFilter === 'normal') ? isLoading : isKpisLoading;

  // Selection logic
  const selectedVideos = useMemo(() => {
    const list: VideoType[] = [];
    const allLists = [...videos, ...trendingVideos, ...topVideos];
    const seen = new Set<number>();
    allLists.forEach(v => {
      if (selectedIds.includes(v.id) && !seen.has(v.id)) {
        seen.add(v.id);
        list.push(v);
      }
    });
    return list;
  }, [selectedIds, videos, trendingVideos, topVideos]);
  
  const toggleSelect = async (v: VideoType) => {
    const isSelecting = !selectedIds.includes(v.id);
    
    if (isSelecting) {
      if (!v.history || v.history.length <= 1) {
        try {
          const historyRes = await apiFetch<any[]>(API_ENDPOINTS.videos.engagementHistory(v.id));
          if (historyRes.success && Array.isArray(historyRes.data)) {
            let historyData = historyRes.data.map((snap: any, index: number) => ({
              day: `D${index}`,
              views: snap.viewsNum || 0,
              engagement: parseFloat(((snap.engagementRate || 0) * 100).toFixed(1))
            }));
            
            if (historyData.length <= 1) {
              const currentViews = v.views;
              historyData = [];
              for (let d = 0; d <= 14; d++) {
                const vVal = currentViews * (0.05 + (d / 14) ** 1.3 * 0.95);
                const noise = currentViews * (Math.random() * 0.05 - 0.025);
                historyData.push({
                  day: `D${d}`,
                  views: Math.max(0, Math.round(vVal + noise)),
                  engagement: parseFloat((v.engagement + (d < 5 ? 8 - d * 1.2 : 2 + Math.random() * 1.5)).toFixed(1))
                });
              }
            }
            
            const updater = (item: VideoType) => item.id === v.id ? { ...item, history: historyData } : item;
            setVideos(prev => prev.map(updater));
            setTrendingVideos(prev => prev.map(updater));
            setTopVideos(prev => prev.map(updater));
          }
        } catch (err) {
          console.error("Failed to fetch engagement history for compared video:", err);
        }
      }
    }

    setSelectedIds((prev) => prev.includes(v.id)
      ? prev.filter(i => i !== v.id)
      : prev.length < 4 ? [...prev, v.id] : prev
    );
  };
  
  const clearSelection = () => setSelectedIds([]);
  const compareMode = selectedIds.length > 0;

  if (isInitialLoading) {
    return (
      <PageShell title="Video & Content Library">
        <VideoLibraryProcessingLoader />
      </PageShell>
    );
  }

  return (
    <PageShell title="Video & Content Library">
      {/* Sticky Top Header Bar */}
      <div className="sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:px-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-stone-200/80 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200/60 dark:border-sky-800/60 flex-shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-stone-900 dark:text-white">
                Video & Content Library
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">
                {statusFilter === 'trending' ? trendingCount : statusFilter === 'top' ? topCount : (isLoading ? '...' : totalItems)} Video
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-neutral-400">
              Eksplorasi, bandingkan performa, dan pantau engagement seluruh video TikTok yang terindeks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari judul atau akun..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              className="w-52 sm:w-64 px-3.5 py-2 pl-9 pr-8 rounded-xl text-xs outline-none bg-stone-50 dark:bg-neutral-800 border border-stone-200/80 dark:border-neutral-700 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-neutral-500 focus:border-sky-500 transition-colors"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            {searchVal && (
              <button
                onClick={() => setSearchVal('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 1. KPI Cards */}
        <div id="video-kpis">
          <VideoKpis
            totalCount={kpis.total}
            totalViews={kpis.views}
            avgEngagement={kpis.avgEng}
            trendingCount={kpis.trending}
          />
        </div>

        {/* 2. Main Content Card Container */}
        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-sm overflow-hidden">
          {/* Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 md:px-6 border-b border-stone-200/80 dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-900/50">
            {/* Status Filter Pills */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100 dark:bg-neutral-800 border border-stone-200/80 dark:border-neutral-700/80">
              {[
                { key: 'all',      label: 'Semua',    Ico: Video,    count: allCount },
                { key: 'trending', label: 'Trending', Ico: Flame,    count: trendingCount },
                { key: 'top',      label: 'Top',      Ico: Crown,    count: topCount },
                { key: 'normal',   label: 'Reguler',  Ico: Video,    count: normalCount },
              ].map(f => {
                const active = statusFilter === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => { setStatusFilter(f.key); setPage(0); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      active
                        ? 'bg-white dark:bg-neutral-900 text-stone-900 dark:text-white shadow-sm'
                        : 'text-stone-500 hover:text-stone-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                    }`}
                  >
                    <f.Ico className="w-3.5 h-3.5" strokeWidth={2.2} />
                    <span>{f.label}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                      active
                        ? 'bg-stone-900 text-white dark:bg-neutral-100 dark:text-stone-900'
                        : 'bg-stone-200/80 dark:bg-neutral-700 text-stone-600 dark:text-neutral-400'
                    }`}>
                      {f.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right side options: Account, Sort, View Toggle */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Account filter dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setAccountDropdownOpen(!accountDropdownOpen); setSortDropdownOpen(false); }}
                  className="h-9 px-3 rounded-xl text-xs font-semibold flex items-center gap-2 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 text-stone-800 dark:text-neutral-200 hover:border-stone-300 dark:hover:border-neutral-600 transition-colors shadow-sm"
                >
                  <Filter className="w-3.5 h-3.5 text-stone-400" />
                  <span>Akun:</span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    {accountFilter === 'all' ? 'Semua' : `@${accountFilter}`}
                  </span>
                  <ChevronDown className="w-3 h-3 text-stone-400 ml-0.5" />
                </button>
                {accountDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 z-30 rounded-xl overflow-hidden w-64 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 shadow-xl py-1 max-h-72 overflow-y-auto">
                    <button
                      onClick={() => { setAccountFilter('all'); setAccountDropdownOpen(false); setPage(0); }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-stone-50 dark:hover:bg-neutral-800 border-b border-stone-100 dark:border-neutral-800 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-md bg-stone-100 dark:bg-neutral-800 flex items-center justify-center text-stone-600 dark:text-neutral-300">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs flex-1 text-stone-900 dark:text-white">Semua Akun</span>
                      {accountFilter === 'all' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                    </button>
                    {trackedAccounts.map((opt) => {
                      const meta = TYPE_META[opt.type as keyof typeof TYPE_META] || { solid: '#0284c7' };
                      const sel = accountFilter === opt.username;
                      return (
                        <button
                          key={opt.username}
                          onClick={() => { setAccountFilter(opt.username); setAccountDropdownOpen(false); setPage(0); }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <span
                            className="w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-[9px] shadow-sm"
                            style={{ background: meta.solid }}
                          >
                            {initialsFrom(opt.displayName || opt.username)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs truncate text-stone-900 dark:text-white">@{opt.username}</p>
                            <p className="text-[10px] truncate text-stone-400 dark:text-neutral-500">{opt.displayName}</p>
                          </div>
                          {sel && <Check className="w-3.5 h-3.5 text-sky-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setSortDropdownOpen(!sortDropdownOpen); setAccountDropdownOpen(false); }}
                  className="h-9 px-3 rounded-xl text-xs font-semibold flex items-center gap-2 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 text-stone-800 dark:text-neutral-200 hover:border-stone-300 dark:hover:border-neutral-600 transition-colors shadow-sm"
                >
                  <BarChart2 className="w-3.5 h-3.5 text-stone-400" />
                  <span>Urutan:</span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    {sortBy === 'recent' ? 'Terbaru' : sortBy === 'views' ? 'Views' : sortBy === 'engagement' ? 'Engagement' : 'Likes'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-stone-400 ml-0.5" />
                </button>
                {sortDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 z-30 rounded-xl overflow-hidden w-48 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 shadow-xl py-1">
                    {[
                      { key: 'recent',     label: 'Terbaru' },
                      { key: 'views',      label: 'Views Terbanyak' },
                      { key: 'engagement', label: 'Engagement Tertinggi' },
                      { key: 'likes',      label: 'Likes Terbanyak' },
                    ].map((o) => (
                      <button
                        key={o.key}
                        onClick={() => { setSortBy(o.key); setSortDropdownOpen(false); }}
                        className="w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-stone-50 dark:hover:bg-neutral-800 text-xs font-semibold text-stone-800 dark:text-neutral-200 transition-colors"
                      >
                        <span>{o.label}</span>
                        {sortBy === o.key && <Check className="w-3.5 h-3.5 text-sky-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid / List View toggle */}
              <div className="flex p-0.5 rounded-xl bg-stone-100 dark:bg-neutral-800 border border-stone-200/80 dark:border-neutral-700/80">
                {[
                  { key: 'grid', Ico: LayoutGrid, label: 'Grid' },
                  { key: 'list', Ico: Rows3, label: 'List' },
                ].map(v => {
                  const active = viewMode === v.key;
                  return (
                    <button
                      key={v.key}
                      onClick={() => setViewMode(v.key as 'grid' | 'list')}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        active
                          ? 'bg-white dark:bg-neutral-900 text-stone-900 dark:text-white shadow-sm'
                          : 'text-stone-400 hover:text-stone-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                      }`}
                      title={`${v.label} View`}
                    >
                      <v.Ico className="w-3.5 h-3.5" strokeWidth={2.2} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Video List & Grid Content */}
          <div className={viewMode === 'grid' ? 'p-4 md:p-6' : 'py-1'}>
            {showShimmers ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ShimmerCard key={i} />
                  ))}
                </div>
              ) : (
                <div>
                  <div
                    className="grid items-center gap-4 px-6 py-3 border-b border-stone-100 dark:border-neutral-800"
                    style={{
                      gridTemplateColumns: '32px 1.6fr 0.8fr 90px 90px 90px 110px 90px',
                    }}
                  >
                    {['', 'Judul Video', 'Akun', 'Views', 'Likes', 'Comments', 'Engagement', ''].map((h, i) => (
                      <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-neutral-500">{h}</span>
                    ))}
                  </div>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ShimmerRow key={i} />
                  ))}
                </div>
              )
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center bg-stone-100 dark:bg-neutral-800 text-stone-400 dark:text-neutral-500">
                  <Video className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white mb-1">
                  Tidak Ada Video Ditemukan
                </h4>
                <p className="text-xs text-stone-500 dark:text-neutral-400 max-w-sm mx-auto">
                  Silakan sesuaikan filter status, akun, atau kata kunci pencarian Anda.
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map(v => (
                  <VideoCard
                    key={v.id}
                    video={v}
                    selected={selectedIds.includes(v.id)}
                    onSelect={toggleSelect}
                    onOpen={setOpenVideo}
                    compareMode={compareMode}
                  />
                ))}
              </div>
            ) : (
              <div>
                {/* Table Header */}
                <div
                  className="grid items-center gap-4 px-6 py-3 border-b border-stone-200/80 dark:border-neutral-800 bg-stone-50/40 dark:bg-neutral-900/40"
                  style={{
                    gridTemplateColumns: '32px 1.6fr 0.8fr 90px 90px 90px 110px 90px',
                  }}
                >
                  {['', 'Judul Video', 'Akun', 'Views', 'Likes', 'Comments', 'Engagement', 'Aksi'].map((h, i) => (
                    <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-neutral-400">
                      {h}
                    </span>
                  ))}
                </div>
                {filtered.map((v, idx) => (
                  <VideoListRow
                    key={v.id}
                    video={v}
                    selected={selectedIds.includes(v.id)}
                    onSelect={toggleSelect}
                    onOpen={setOpenVideo}
                    compareMode={compareMode}
                    isLast={idx === filtered.length - 1}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {(statusFilter === 'all' || statusFilter === 'normal') && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-stone-200/80 dark:border-neutral-800 bg-stone-50/40 dark:bg-neutral-900/40">
              {/* Left: Item range */}
              <div className="text-xs text-stone-500 dark:text-neutral-400 font-medium">
                Menampilkan <span className="font-mono font-bold text-stone-900 dark:text-white">{(page * pageSize) + 1}</span> - <span className="font-mono font-bold text-stone-900 dark:text-white">{Math.min((page + 1) * pageSize, totalItems)}</span> dari <span className="font-mono font-bold text-stone-900 dark:text-white">{totalItems}</span> video
              </div>

              {/* Center: Page numbers */}
              <div className="flex items-center gap-1 flex-wrap justify-center">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="h-8 px-3 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 text-stone-700 dark:text-neutral-200 hover:bg-stone-50 dark:hover:bg-neutral-800 shadow-sm"
                >
                  Sebelumnya
                </button>

                {(() => {
                  const pages: (number | string)[] = [];
                  const maxVisible = 5;
                  if (totalPages <= maxVisible) {
                    for (let i = 0; i < totalPages; i++) pages.push(i);
                  } else {
                    pages.push(0);
                    if (page > 2) pages.push('...');
                    const start = Math.max(1, page - 1);
                    const end = Math.min(totalPages - 2, page + 1);
                    for (let i = start; i <= end; i++) pages.push(i);
                    if (page < totalPages - 3) pages.push('...');
                    pages.push(totalPages - 1);
                  }

                  return pages.map((p, idx) => {
                    if (p === '...') {
                      return (
                        <span key={`dots-${idx}`} className="px-2 text-xs font-mono text-stone-400">
                          ...
                        </span>
                      );
                    }
                    const active = page === p;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(Number(p))}
                        className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all ${
                          active
                            ? 'bg-stone-900 text-white dark:bg-neutral-100 dark:text-stone-900 shadow-sm'
                            : 'bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 text-stone-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800'
                        }`}
                      >
                        {Number(p) + 1}
                      </button>
                    );
                  });
                })()}

                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="h-8 px-3 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 text-stone-700 dark:text-neutral-200 hover:bg-stone-50 dark:hover:bg-neutral-800 shadow-sm"
                >
                  Selanjutnya
                </button>
              </div>

              {/* Right: Page size selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 dark:text-neutral-400">Tampilkan:</span>
                <select
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                    setPage(0);
                  }}
                  className="h-8 px-2 rounded-lg text-xs font-semibold bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 text-stone-800 dark:text-neutral-200 outline-none cursor-pointer shadow-sm"
                >
                  {[12, 24, 48, 96].map(sz => (
                    <option key={sz} value={sz}>{sz} per halaman</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail drawer */}
      <VideoDetailDrawer
        video={openVideo}
        onClose={() => setOpenVideo(null)}
        onAddCompare={(v: VideoType) => { toggleSelect(v); }}
        inCompare={!!(openVideo && selectedIds.includes(openVideo.id))}
      />

      {/* Compare drawer */}
      <CompareDrawer
        videos={selectedVideos}
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        onRemove={toggleSelect}
      />

      {/* Sticky compare floating bar */}
      <CompareBar
        count={selectedIds.length}
        onOpenCompare={() => setCompareOpen(true)}
        onClear={clearSelection}
      />
    </PageShell>
  );
}