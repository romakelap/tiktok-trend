import React, { useState, useMemo } from 'react';
import { Flame, TrendingUp, TrendingDown, ChevronDown, ChevronUp, Hash, Award, Video, Eye, Heart, MessageCircle } from "lucide-react";
import { GridBg } from "@/components/layout/GridBg";
import { TOKENS } from "@/lib/design-tokens";
import { CatData, Tag, getTrendConfig, fmt } from "@/lib/hashtag/mock-data";
import { apiFetch } from "@/lib/api";
import { CAT_ICONS } from "./CategorySelector";
import { VideoMiniCard } from "./VideoMiniCard";

interface TopHashtagsProps {
  catData: CatData;
  catColor: string;
  activeCategory: string;
  searchQuery: string;
}

export function TopHashtags({ catData, catColor, activeCategory, searchQuery }: TopHashtagsProps) {
  const [expandedTag, setExpandedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'uses' | 'growth' | 'engagement'>('uses');
  const [tagVideos, setTagVideos] = useState<Record<string, any[]>>({});
  const [loadingVideos, setLoadingVideos] = useState<Record<string, boolean>>({});

  const CatIcon = CAT_ICONS[activeCategory] ?? Hash;

  const sortedTags = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const filtered = (catData?.tags || []).filter(t => t.tag.toLowerCase().includes(q));
    return [...filtered].sort((a, b) => {
      if (sortBy === 'uses') return b.uses - a.uses;
      if (sortBy === 'growth') return b.weekGrowth - a.weekGrowth;
      return b.engagement - a.engagement;
    }).slice(0, 10);
  }, [catData, sortBy, searchQuery]);

  const handleToggleExpand = async (tagTitle: string) => {
    const isExpanding = expandedTag !== tagTitle;
    setExpandedTag(isExpanding ? tagTitle : null);

    if (isExpanding && !tagVideos[tagTitle]) {
      try {
        setLoadingVideos(prev => ({ ...prev, [tagTitle]: true }));
        const searchTag = tagTitle.startsWith('#') ? tagTitle.substring(1) : tagTitle;
        const res = await apiFetch<any>(`/api/videos?page=0&size=4&search=${encodeURIComponent(searchTag)}`);
        
        if (res.success && res.data && Array.isArray(res.data.items)) {
          const mapped = res.data.items.map((item: any) => {
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
              if (diffMin < 60) return `${diffMin} mnt lalu`;
              if (diffHour < 24) return `${diffHour} jam lalu`;
              return `${diffDay} hari lalu`;
            };

            return {
              id: item.videoPk,
              title: item.titleBrief || 'Untitled Video',
              views: item.viewsNum || 0,
              likes: item.likesNum || 0,
              comments: item.commentsNum || 0,
              duration: formatDuration(item.durationSeconds),
              date: getRelativeTime(item.publishedAt),
              viral: (item.viewsNum || 0) >= 100000,
              coverUrl: item.coverUrl,
              videoUrl: item.videoUrl,
              shareUrl: item.shareUrl,
            };
          });
          setTagVideos(prev => ({ ...prev, [tagTitle]: mapped }));
        }
      } catch (err) {
        console.error("Failed to fetch related videos:", err);
      } finally {
        setLoadingVideos(prev => ({ ...prev, [tagTitle]: false }));
      }
    }
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: '#FFFFFF',
        border: `1px solid rgba(0,0,0,0.08)`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)'
      }}
    >
      <GridBg theme="light" />

      <div className="relative z-10 p-6">
        {/* ── Panel header ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            {/* Category icon */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: catColor, boxShadow: `0 2px 10px rgba(0,0,0,0.15)` }}
            >
              <CatIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="font-black text-lg" style={{ color: TOKENS.text }}>Top 10 Hashtag</h2>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-black text-white"
                  style={{ background: catColor }}
                >
                  {activeCategory}
                </span>
              </div>
              <p className="text-xs" style={{ color: TOKENS.textMuted }}>
                {fmt(catData?.tags?.length || 0)} total hashtags ·{' '}
                <span style={{ color: (catData?.weekGrowth || 0) >= 0 ? TOKENS.positive : TOKENS.negative, fontWeight: 700 }}>
                  {(catData?.weekGrowth || 0) >= 0 ? '+' : ''}{catData?.weekGrowth || 0}% minggu ini
                </span>
              </p>
            </div>
          </div>
          {/* Sort tabs */}
          <div
            className="flex gap-1 p-1 rounded-xl"
            style={{ background: '#F2F1EF', border: '1px solid rgba(0,0,0,0.08)' }}
          >
            {(['uses', 'growth', 'engagement'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-black transition-all duration-200"
                style={{
                  background: sortBy === s ? '#fff' : 'transparent',
                  color: sortBy === s ? TOKENS.text : TOKENS.textMuted,
                  boxShadow: sortBy === s ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  border: sortBy === s ? '1px solid rgba(0,0,0,0.08)' : '1px solid transparent',
                }}
              >
                {s === 'uses' ? 'Penggunaan' : s === 'growth' ? 'Pertumbuhan' : 'Engagement'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Hashtag rows ── */}
        <div className="space-y-1.5">
          {sortedTags.map((tag, idx) => {
            const maxUses = sortedTags[0]?.uses || 1;
            const pct = (tag.uses / maxUses) * 100;
            const isNo1 = idx === 0;
            const tc = getTrendConfig(tag.trend);
            const isExpand = expandedTag === tag.tag;

            // Row bg: #1 gets a very light category tint, rest alternate white/slate
            const rowBg = isExpand
              ? `${catColor}0e`
              : isNo1
              ? `${catColor}08`
              : idx % 2 === 0 ? '#FFFFFF' : '#F9F8F7';

            return (
              <div key={tag.tag}>
                {/* ── Row ── */}
                <div
                  onClick={() => handleToggleExpand(tag.tag)}
                  className="group cursor-pointer rounded-xl transition-all duration-150 hover:shadow-sm"
                  style={{
                    background: rowBg,
                    border: isExpand
                      ? `1.5px solid ${catColor}55`
                      : isNo1
                      ? `1px solid ${catColor}30`
                      : '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <div className="flex items-center gap-3 px-4 py-3">
                    {/* Rank */}
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-xs"
                      style={{
                        background: isNo1 ? catColor : '#ECEAE7',
                        color: isNo1 ? '#fff' : TOKENS.textMuted,
                      }}
                    >
                      {idx + 1}
                    </div>

                    {/* Tag name + video count */}
                    <div className="flex-shrink-0 w-36">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-sm" style={{ color: TOKENS.text }}>{tag.tag}</span>
                        {isNo1 && (
                          <span
                            className="px-1.5 py-0.5 rounded font-black text-white"
                            style={{ background: catColor, fontSize: 8 }}
                          >
                            TOP
                          </span>
                        )}
                      </div>
                      <span className="font-medium" style={{ color: TOKENS.textMuted, fontSize: 10 }}>
                        {fmt(tag.videoCount)} video
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="flex-1 flex items-center gap-2.5">
                      <div
                        className="flex-1 relative h-6 rounded-lg overflow-hidden"
                        style={{ background: '#ECEAE7' }}
                      >
                        <div
                          className="h-full rounded-lg transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            background: isNo1 ? catColor : `${catColor}55`,
                          }}
                        />
                        {/* Uses label — sits on top of bar */}
                        <div className="absolute inset-0 flex items-center px-2.5">
                          <span
                            className="font-bold text-xs"
                            style={{ color: pct > 48 ? '#fff' : TOKENS.text }}
                          >
                            {fmt(tag.uses)} uses
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats — avg views + engagement */}
                    <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                      <div className="text-right min-w-[54px]">
                        <p className="font-black text-sm" style={{ color: TOKENS.text }}>{fmt(tag.avgViews)}</p>
                        <p className="font-medium" style={{ color: TOKENS.textMuted, fontSize: 9 }}>avg views</p>
                      </div>
                      <div className="text-right min-w-[42px]">
                        <p className="font-black text-sm" style={{ color: TOKENS.text }}>{tag.engagement}%</p>
                        <p className="font-medium" style={{ color: TOKENS.textMuted, fontSize: 9 }}>eng. rate</p>
                      </div>

                      {/* Trend badge */}
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black min-w-[64px] justify-center"
                        style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}
                      >
                        {tag.trend === 'hot' ? <Flame className="w-2.5 h-2.5 fill-current" />
                          : tag.trend === 'up' ? <TrendingUp className="w-2.5 h-2.5" />
                          : tag.trend === 'down' ? <TrendingDown className="w-2.5 h-2.5" />
                          : null}
                        {tag.weekGrowth >= 0 ? '+' : ''}{tag.weekGrowth}%
                      </span>
                    </div>

                    {/* Expand chevron */}
                    <div className="ml-1 flex-shrink-0" style={{ color: TOKENS.textMuted }}>
                      {isExpand ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* ── Expanded detail ── */}
                {isExpand && (
                  <div
                    className="mt-1 mb-1 rounded-xl overflow-hidden"
                    style={{ background: `${catColor}06`, border: `1px solid ${catColor}20` }}
                  >
                    {/* 4 stat mini-cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 pb-3">
                      {[
                        { label: 'Total Uses', value: fmt(tag.uses), accent: catColor },
                        { label: 'Avg Views/Video', value: fmt(tag.avgViews), accent: TOKENS.accent },
                        { label: 'Engagement Rate', value: tag.engagement + '%', accent: TOKENS.positive },
                        { label: 'Total Video', value: fmt(tag.videoCount), accent: TOKENS.textSubtle },
                      ].map((s, si) => (
                        <div
                          key={si}
                          className="p-3 rounded-xl"
                          style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                        >
                          <p className="text-xs font-semibold mb-1" style={{ color: TOKENS.textMuted }}>{s.label}</p>
                          <p className="font-black text-xl" style={{ color: s.accent }}>{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Status bar */}
                    <div
                      className="mx-4 mb-3 px-4 py-2.5 rounded-xl flex items-center justify-between"
                      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}
                    >
                      <div className="flex items-center gap-2">
                        <span style={{ color: catColor }} className="inline-flex"><Hash className="w-4 h-4" /></span>
                        <span className="font-black text-sm" style={{ color: catColor }}>{tag.tag}</span>
                        <span style={{ color: TOKENS.textMuted }}>·</span>
                        <span className="text-xs font-semibold" style={{ color: TOKENS.textMuted }}>
                          Status: <span style={{ color: tc.text, fontWeight: 800 }}>{tc.label}</span>
                        </span>
                      </div>
                      <span
                        className="text-xs font-black px-2.5 py-1 rounded-lg"
                        style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}
                      >
                        {tag.weekGrowth >= 0 ? '+' : ''}{tag.weekGrowth}% 7 hari
                      </span>
                    </div>

                    {/* Video list */}
                    <div className="flex items-center gap-2 px-4 mb-2.5">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center"
                        style={{ background: catColor }}
                      >
                        <Video className="w-3 h-3 text-white" />
                      </div>
                      <p className="font-black text-sm" style={{ color: TOKENS.text }}>
                        Video dengan{' '}
                        <span style={{ color: catColor }}>{tag.tag}</span>
                      </p>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-md font-bold"
                        style={{ background: 'rgba(0,0,0,0.06)', color: TOKENS.textMuted }}
                      >
                        {loadingVideos[tag.tag] ? '...' : (tagVideos[tag.tag] || []).length} video
                      </span>
                    </div>

                    {loadingVideos[tag.tag] ? (
                      <div className="flex items-center justify-center py-8 w-full col-span-full">
                        <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${catColor} transparent ${catColor} ${catColor}` }} />
                        <span className="text-xs font-bold ml-2" style={{ color: TOKENS.textMuted }}>Memuat video terkait...</span>
                      </div>
                    ) : (tagVideos[tag.tag] || []).length === 0 ? (
                      <div className="text-center py-6 w-full col-span-full">
                        <span className="text-xs font-bold" style={{ color: TOKENS.textMuted }}>Tidak ada video terkait ditemukan</span>
                      </div>
                    ) : (
                      <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
                        {(tagVideos[tag.tag] || []).map((v, vi) => (
                          <VideoMiniCard key={v.id} v={v} color={catColor} rank={vi + 1} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {sortedTags.length === 0 && (
            <div className="py-14 text-center">
              <p className="font-bold text-sm" style={{ color: TOKENS.textMuted }}>
                Tidak ada hashtag yang cocok dengan pencarian
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

