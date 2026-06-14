'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import {
  Search, Filter, ChevronDown, Check,
  Users, Video, Eye, Flame, Crown, Sparkles, LayoutGrid, Rows3,
} from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { TOKENS } from '@/lib/design-tokens';
import { GridBg } from '@/components/layout/GridBg';
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

const ShimmerCard = () => (
  <div className="rounded-2xl p-4 space-y-4 animate-pulse"
    style={{ background: TOKENS.card, border: `1px solid ${TOKENS.cardBorder}` }}>
    <div className="h-36 w-full rounded-xl bg-black/5" />
    <div className="h-5 w-3/4 rounded bg-black/5" />
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 flex-1">
        <div className="w-7 h-7 rounded-lg bg-black/5" />
        <div className="space-y-1 flex-1">
          <div className="h-3 w-16 rounded bg-black/5" />
          <div className="h-2 w-10 rounded bg-black/5" />
        </div>
      </div>
      <div className="h-3 w-14 rounded bg-black/5" />
    </div>
    <div className="h-10 w-full rounded-xl bg-black/5" />
    <div className="h-2.5 w-full rounded bg-black/5" />
    <div className="flex gap-1">
      <div className="h-4.5 w-12 rounded bg-black/5" />
      <div className="h-4.5 w-12 rounded bg-black/5" />
    </div>
  </div>
);

const ShimmerRow = () => (
  <div className="grid items-center gap-4 px-6 py-4 animate-pulse"
    style={{
      gridTemplateColumns: '32px 1.6fr 0.8fr 90px 90px 90px 110px 90px',
      borderBottom: `1px solid ${TOKENS.divider}`,
    }}>
    <div className="w-5 h-5 rounded bg-black/5" />
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-lg bg-black/5" />
      <div className="space-y-1.5 flex-1">
        <div className="h-4 w-2/3 rounded bg-black/5" />
        <div className="flex gap-2">
          <div className="h-3 w-12 rounded bg-black/5" />
          <div className="h-3 w-16 rounded bg-black/5" />
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-md bg-black/5" />
      <div className="h-3 w-16 rounded bg-black/5" />
    </div>
    <div className="h-4 w-12 rounded bg-black/5" />
    <div className="h-4 w-10 rounded bg-black/5" />
    <div className="h-4 w-10 rounded bg-black/5" />
    <div className="h-5 w-14 rounded bg-black/5" />
    <div className="h-8 w-16 rounded-lg bg-black/5" />
  </div>
);

export default function VideoLibraryPage() {
  const [videos, setVideos]             = useState<VideoType[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [isKpisLoading, setIsKpisLoading] = useState(true);
  const [searchVal, setSearchVal]       = useState('');
  const [searchQuery, setSearchQuery]   = useState('');
  const [accountFilter, setAccountFilter] = useState('all');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy]             = useState('recent');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [viewMode, setViewMode]         = useState('grid');
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
      if (diffMin < 60) return `${diffMin} menit lalu`;
      if (diffHour < 24) return `${diffHour} jam lalu`;
      if (diffDay === 1) return 'kemarin';
      if (diffDay < 30) return `${diffDay} hari lalu`;
      const diffMonth = Math.floor(diffDay / 30);
      if (diffMonth < 12) return `${diffMonth} bulan lalu`;
      return `${Math.floor(diffMonth / 12)} tahun lalu`;
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
      }
    }

    loadMetadata();
  }, [mapBackendVideo]);

  // 2. Fetch paginated data from API when page, pageSize, searchQuery, or accountFilter changes (under general statuses)
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

  // Unique accounts options for selector
  const accountOptions = useMemo(() => {
    return trackedAccounts;
  }, [trackedAccounts]);

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

  return (
    <PageShell title="Video & Content Library">
      <div className="p-6 space-y-6">
        {/* Sticky filter & search header */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2">
          <div>
            <h1 className="text-xl font-black flex items-center gap-2 tracking-tight" style={{ color: TOKENS.text }}>
              Video & Content Library
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-white" style={{ background: '#111' }}>
                {statusFilter === 'trending' ? trendingCount : statusFilter === 'top' ? topCount : (isLoading ? '...' : totalItems)}
              </span>
            </h1>
            <p className="text-xs" style={{ color: TOKENS.textMuted }}>
              Telusuri, bandingkan, dan analisis performa video TikTok yang Anda lacak.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: TOKENS.textMuted }} strokeWidth={2.4} />
              <Input value={searchVal} onChange={e => setSearchVal(e.target.value)}
                placeholder="Cari judul video..."
                className="w-72 pl-9 h-10 rounded-xl text-sm"
                style={{ background: TOKENS.input, border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.text }} />
            </div>
          </div>
        </div>

        {/* ── 1. KPI Row ─────────────────────────────────────── */}
        <div id="video-kpis">
          <VideoKpis
            totalCount={kpis.total}
            totalViews={kpis.views}
            avgEngagement={kpis.avgEng}
            trendingCount={kpis.trending}
          />
        </div>

        {/* ── 2. Filter & Video Grid ─────────────────────────── */}
        <div id="video-list-container" className="relative rounded-2xl overflow-hidden"
          style={{ background: TOKENS.cardSoft, border: `1px solid ${TOKENS.cardBorder}`,
                   boxShadow: '0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)' }}>
          <GridBg theme="light" />

          <div className="relative z-10">
            {/* Filter bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
              style={{ borderBottom: `1px solid ${TOKENS.divider}` }}>
              {/* Status pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl"
                style={{ background: 'rgba(0,0,0,0.04)', border: `1px solid ${TOKENS.inputBorder}` }}>
                {[
                  { key: 'all',      label: 'Semua',    Ico: Video,    count: allCount },
                  { key: 'trending', label: 'Trending', Ico: Flame,    count: trendingCount },
                  { key: 'top',      label: 'Top',      Ico: Crown,    count: topCount },
                  { key: 'normal',   label: 'Reguler',  Ico: Video,    count: normalCount },
                ].map(f => {
                  const active = statusFilter === f.key;
                  return (
                    <button key={f.key} onClick={() => { setStatusFilter(f.key); setPage(0); }}
                      className="px-3 py-1.5 rounded-lg text-xs font-black transition-all duration-200 flex items-center gap-1.5"
                      style={{
                        background: active ? '#fff' : 'transparent',
                        color:      active ? TOKENS.text : TOKENS.textMuted,
                        boxShadow:  active ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
                        border:     active ? `1px solid ${TOKENS.inputBorder}` : '1px solid transparent',
                      }}>
                      <f.Ico className="w-3 h-3" strokeWidth={2.5} />
                      {f.label}
                      <span className="px-1.5 py-0 rounded text-[10px] font-black"
                        style={{ background: active ? '#111' : 'rgba(0,0,0,0.08)', color: active ? '#fff' : TOKENS.textMuted }}>
                        {f.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right side filters */}
              <div className="flex items-center gap-2">
                {/* Account filter dropdown */}
                <div className="relative">
                  <button onClick={() => { setAccountDropdownOpen(!accountDropdownOpen); setSortDropdownOpen(false); }}
                    className="h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:opacity-75"
                    style={{ background: '#fff', border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.text }}>
                    <Filter className="w-3.5 h-3.5" strokeWidth={2.5} />
                    Akun: <span className="font-black">
                      {accountFilter === 'all' ? 'Semua' : `@${accountFilter}`}
                    </span>
                    <ChevronDown className="w-3 h-3" strokeWidth={2.5} />
                  </button>
                  {accountDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 z-20 rounded-xl overflow-hidden w-64"
                      style={{ background: '#fff', border: `1px solid ${TOKENS.cardBorder}`, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}>
                      <button onClick={() => { setAccountFilter('all'); setAccountDropdownOpen(false); setPage(0); }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-left transition-all hover:bg-black/5"
                        style={{ borderBottom: `1px solid ${TOKENS.divider}` }}>
                        <span className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(0,0,0,0.06)' }}>
                          <Users className="w-3.5 h-3.5" style={{ color: TOKENS.text }} strokeWidth={2.2} />
                        </span>
                        <span className="font-black text-xs flex-1" style={{ color: TOKENS.text }}>Semua Akun</span>
                        {accountFilter === 'all' && <Check className="w-4 h-4" style={{ color: '#111' }} strokeWidth={2.5} />}
                      </button>
                      {accountOptions.map((opt, i) => {
                        const meta = TYPE_META[opt.type as keyof typeof TYPE_META] || { solid: '#111' };
                        const sel = accountFilter === opt.username;
                        return (
                          <button key={opt.username}
                            onClick={() => { setAccountFilter(opt.username); setAccountDropdownOpen(false); setPage(0); }}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-left transition-all hover:bg-black/5"
                            style={{ borderBottom: i < accountOptions.length - 1 ? `1px solid ${TOKENS.divider}` : 'none' }}>
                            <span className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 text-white font-black"
                              style={{ background: meta.solid, fontSize: 9 }}>
                              {initialsFrom(opt.displayName)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-xs truncate" style={{ color: TOKENS.text }}>@{opt.username}</p>
                              <p className="text-[10px] truncate" style={{ color: TOKENS.textMuted }}>{opt.displayName}</p>
                            </div>
                            {sel && <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#111' }} strokeWidth={2.5} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Sort dropdown */}
                <div className="relative">
                  <button onClick={() => { setSortDropdownOpen(!sortDropdownOpen); setAccountDropdownOpen(false); }}
                    className="h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:opacity-75"
                    style={{ background: '#fff', border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.text }}>
                    Sort: <span className="font-black">
                      {sortBy === 'recent' ? 'Terbaru' : sortBy === 'views' ? 'Most Views' : sortBy === 'engagement' ? 'Best Engagement' : 'Most Likes'}
                    </span>
                    <ChevronDown className="w-3 h-3" strokeWidth={2.5} />
                  </button>
                  {sortDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 z-20 rounded-xl overflow-hidden w-48"
                      style={{ background: '#fff', border: `1px solid ${TOKENS.cardBorder}`, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}>
                      {[
                        { key: 'recent',     label: 'Terbaru' },
                        { key: 'views',      label: 'Most Views' },
                        { key: 'engagement', label: 'Best Engagement' },
                        { key: 'likes',      label: 'Most Likes' },
                      ].map((o, i, arr) => (
                        <button key={o.key} onClick={() => { setSortBy(o.key); setSortDropdownOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-left transition-all hover:bg-black/5"
                          style={{ borderBottom: i < arr.length - 1 ? `1px solid ${TOKENS.divider}` : 'none' }}>
                          <span className="font-bold text-xs flex-1" style={{ color: TOKENS.text }}>{o.label}</span>
                          {sortBy === o.key && <Check className="w-4 h-4" style={{ color: '#111' }} strokeWidth={2.5} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* View toggle */}
                <div className="flex p-0.5 rounded-xl"
                  style={{ background: 'rgba(0,0,0,0.04)', border: `1px solid ${TOKENS.inputBorder}` }}>
                  {[
                    { key: 'grid', Ico: LayoutGrid },
                    { key: 'list', Ico: Rows3 },
                  ].map(v => {
                    const active = viewMode === v.key;
                    return (
                      <button key={v.key} onClick={() => setViewMode(v.key)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                        style={{
                          background: active ? '#fff' : 'transparent',
                          color: active ? TOKENS.text : TOKENS.textMuted,
                          boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                        }}>
                        <v.Ico className="w-3.5 h-3.5" strokeWidth={2.4} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Videos */}
            <div className={viewMode === 'grid' ? 'p-6' : 'py-2'}>
              {showShimmers ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <ShimmerCard key={i} />
                    ))}
                  </div>
                ) : (
                  <div>
                    {/* table header */}
                    <div className="grid items-center gap-4 px-6 py-3"
                      style={{
                        gridTemplateColumns: '32px 1.6fr 0.8fr 90px 90px 90px 110px 90px',
                        borderBottom: `1px solid ${TOKENS.divider}`,
                      }}>
                      {['', 'Judul Video', 'Akun', 'Views', 'Likes', 'Comments', 'Engagement', ''].map((h, i) => (
                        <span key={i} className="text-[10px] font-black uppercase tracking-widest" style={{ color: TOKENS.textMuted }}>{h}</span>
                      ))}
                    </div>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <ShimmerRow key={i} />
                    ))}
                  </div>
                )
              ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.04)', border: `1px solid ${TOKENS.divider}` }}>
                    <Video className="w-6 h-6" style={{ color: TOKENS.textMuted }} strokeWidth={1.8} />
                  </div>
                  <p className="font-black text-sm mb-1" style={{ color: TOKENS.text }}>Tidak ada video ditemukan</p>
                  <p className="text-xs" style={{ color: TOKENS.textMuted }}>Coba ubah filter atau kata kunci pencarian</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map(v => (
                    <VideoCard key={v.id} video={v}
                      selected={selectedIds.includes(v.id)}
                      onSelect={toggleSelect}
                      onOpen={setOpenVideo}
                      compareMode={compareMode} />
                  ))}
                </div>
              ) : (
                <div>
                  {/* table header */}
                  <div className="grid items-center gap-4 px-6 py-3"
                    style={{
                      gridTemplateColumns: '32px 1.6fr 0.8fr 90px 90px 90px 110px 90px',
                      borderBottom: `1px solid ${TOKENS.divider}`,
                    }}>
                    {['', 'Judul Video', 'Akun', 'Views', 'Likes', 'Comments', 'Engagement', ''].map((h, i) => (
                      <span key={i} className="text-[10px] font-black uppercase tracking-widest" style={{ color: TOKENS.textMuted }}>{h}</span>
                    ))}
                  </div>
                  {filtered.map((v, idx) => (
                    <VideoListRow key={v.id} video={v}
                      selected={selectedIds.includes(v.id)}
                      onSelect={toggleSelect}
                      onOpen={setOpenVideo}
                      compareMode={compareMode}
                      isLast={idx === filtered.length - 1} />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {(statusFilter === 'all' || statusFilter === 'normal') && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4"
                style={{ borderTop: `1px solid ${TOKENS.divider}` }}>
                {/* Left: Item range */}
                <div className="text-xs font-bold" style={{ color: TOKENS.textMuted }}>
                  Menampilkan <span className="font-black" style={{ color: TOKENS.text }}>{(page * pageSize) + 1}</span> - <span className="font-black" style={{ color: TOKENS.text }}>{Math.min((page + 1) * pageSize, totalItems)}</span> dari <span className="font-black" style={{ color: TOKENS.text }}>{totalItems}</span> video
                </div>

                {/* Center: Page numbers */}
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="h-8 px-2.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5"
                    style={{ border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.text, background: '#fff' }}
                  >
                    Sebelumnya
                  </button>

                  {/* Render page numbers intelligently */}
                  {(() => {
                    const pages: (number | string)[] = [];
                    const maxVisible = 5;
                    if (totalPages <= maxVisible) {
                      for (let i = 0; i < totalPages; i++) pages.push(i);
                    } else {
                      pages.push(0);
                      if (page > 2) {
                        pages.push('...');
                      }
                      const start = Math.max(1, page - 1);
                      const end = Math.min(totalPages - 2, page + 1);
                      for (let i = start; i <= end; i++) {
                        pages.push(i);
                      }
                      if (page < totalPages - 3) {
                        pages.push('...');
                      }
                      pages.push(totalPages - 1);
                    }

                    return pages.map((p, idx) => {
                      if (p === '...') {
                        return (
                          <span key={`dots-${idx}`} className="px-2 text-xs font-bold" style={{ color: TOKENS.textMuted }}>
                            ...
                          </span>
                        );
                      }
                      const active = page === p;
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(Number(p))}
                          className="w-8 h-8 rounded-lg text-xs font-black transition-all"
                          style={{
                            background: active ? '#111' : '#fff',
                            color: active ? '#fff' : TOKENS.text,
                            border: `1px solid ${active ? '#111' : TOKENS.inputBorder}`,
                            boxShadow: active ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                          }}
                        >
                          {Number(p) + 1}
                        </button>
                      );
                    });
                  })()}

                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="h-8 px-2.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5"
                    style={{ border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.text, background: '#fff' }}
                  >
                    Selanjutnya
                  </button>
                </div>

                {/* Right: Page size selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: TOKENS.textMuted }}>Tampilkan:</span>
                  <select
                    value={pageSize}
                    onChange={e => {
                      setPageSize(Number(e.target.value));
                      setPage(0);
                    }}
                    className="h-8 px-2 rounded-lg text-xs font-bold outline-none cursor-pointer"
                    style={{ border: `1px solid ${TOKENS.inputBorder}`, background: '#fff', color: TOKENS.text }}
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

      {/* Sticky compare bar */}
      <CompareBar
        count={selectedIds.length}
        onOpenCompare={() => setCompareOpen(true)}
        onClear={clearSelection}
      />
    </PageShell>
  );
}