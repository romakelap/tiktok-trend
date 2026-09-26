"use client";

import React, { useState, useMemo } from 'react';
import {
  Zap,
  TrendingUp,
  Tag,
  Filter,
  Clock,
  ChevronDown,
  ChevronUp,
  Flame,
  Play,
  Eye,
  Heart,
  MessageCircle,
  ExternalLink,
  Video as VideoIcon,
  Sparkles,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import {
  days,
  hours,
  hourSlots,
  formatNum,
} from '@/lib/timeposting/mock-data';
import { resolveAvatarUrl } from '@/lib/utils';
import { extractTikTokVideoId } from '@/lib/video-library/tiktok';
import { TikTokEmbed } from '@/components/video-library/TikTokEmbed';

// Helper to convert time slots
const getHourFromPublishedAt = (publishedAt: string): number => {
  if (!publishedAt) return 12;
  try {
    const date = new Date(publishedAt);
    return isNaN(date.getTime()) ? 12 : date.getHours();
  } catch {
    return 12;
  }
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

// ─── 1. Optimization Panel (Compact 4-Card Tactical Recommendations) ────────
interface OptimizationPanelProps {
  activeCategory: string;
  cells: any[];
}

export function OptimizationPanel({ activeCategory, cells = [] }: OptimizationPanelProps) {
  const recommendationsList = useMemo(() => {
    if (!cells || cells.length === 0) {
      return [
        {
          icon: Zap,
          title: 'Prime Slot',
          value: '20:00 - 23:00',
          sub: 'Volume penonton puncak',
          badge: 'Puncak',
        },
        {
          icon: TrendingUp,
          title: 'Hari Terbaik',
          value: 'Jumat & Sabtu',
          sub: 'Tingkat engagement optimal',
          badge: 'Tinggi',
        },
        {
          icon: Tag,
          title: 'Pola Posting',
          value: '1-2 Konten / Hari',
          sub: 'Konsistensi jam tayang',
          badge: 'Rutin',
        },
        {
          icon: AlertTriangle,
          title: 'Slot Dihindari',
          value: '00:00 - 06:00',
          sub: 'Interaksi audiens rendah',
          badge: 'Hindari',
        },
      ];
    }

    const dayViews: Record<string, { totalViews: number; count: number }> = {};
    const hourViews: Record<number, { totalViews: number; count: number }> = {};
    const DAY_MAP = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    cells.forEach(cell => {
      const views = cell.averageViews !== undefined ? cell.averageViews : (cell.avgViews !== undefined ? cell.avgViews : 0);
      const dayName = DAY_MAP[cell.dayOfWeek];
      if (dayName) {
        if (!dayViews[dayName]) dayViews[dayName] = { totalViews: 0, count: 0 };
        dayViews[dayName].totalViews += views;
        dayViews[dayName].count += 1;
      }

      const hr = cell.hourOfDay;
      if (hr !== undefined && hr !== null) {
        if (!hourViews[hr]) hourViews[hr] = { totalViews: 0, count: 0 };
        hourViews[hr].totalViews += views;
        hourViews[hr].count += 1;
      }
    });

    const dayAverages = Object.entries(dayViews).map(([day, d]) => ({
      day,
      avgViews: d.count > 0 ? d.totalViews / d.count : 0
    })).sort((a, b) => b.avgViews - a.avgViews);

    const hourAverages = Object.entries(hourViews).map(([hour, d]) => ({
      hour: parseInt(hour),
      avgViews: d.count > 0 ? d.totalViews / d.count : 0
    })).sort((a, b) => b.avgViews - a.avgViews);

    const bestDay = dayAverages[0]?.day || 'Jumat';
    const bestHourNum = hourAverages[0]?.hour !== undefined ? hourAverages[0].hour : 20;
    const bestHourStr = `${bestHourNum.toString().padStart(2, '0')}:00 - ${(bestHourNum + 1).toString().padStart(2, '0')}:00`;
    const bestHourViews = hourAverages[0]?.avgViews || 0;

    const worstHourAverages = [...hourAverages].reverse();
    const worstHourNum = worstHourAverages[0]?.hour !== undefined ? worstHourAverages[0].hour : 2;
    const worstHourStr = `${worstHourNum.toString().padStart(2, '0')}:00 - ${(worstHourNum + 1).toString().padStart(2, '0')}:00`;

    return [
      {
        icon: Zap,
        title: 'Jam Puncak (Prime)',
        value: bestHourStr,
        sub: `Avg ${formatNum(bestHourViews)} views`,
        badge: 'Optimal',
      },
      {
        icon: TrendingUp,
        title: 'Hari Terbaik',
        value: bestDay,
        sub: 'Engagement tertinggi',
        badge: 'Rekomendasi',
      },
      {
        icon: Tag,
        title: 'Pola Unggah',
        value: 'Konsisten & Rutin',
        sub: `Niche: ${activeCategory}`,
        badge: 'Algoritma',
      },
      {
        icon: AlertTriangle,
        title: 'Slot Dihindari',
        value: worstHourStr,
        sub: 'Penonton aktif sepi',
        badge: 'Hindari',
      }
    ];
  }, [cells, activeCategory]);

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-stone-700 dark:text-stone-300" />
          <h2 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
            Rekomendasi Jadwal Posting Optimal
          </h2>
        </div>
        <span className="text-[11px] text-stone-400 dark:text-neutral-500 font-mono">
          Kategori: <strong className="text-stone-800 dark:text-stone-200">{activeCategory}</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {recommendationsList.map((rec, i) => {
          const IconComponent = rec.icon;
          return (
            <div
              key={i}
              className="p-3.5 rounded-xl border border-stone-200/70 dark:border-neutral-800 bg-stone-50/70 dark:bg-neutral-850/60 flex flex-col justify-between transition-all hover:bg-stone-50 dark:hover:bg-neutral-850 hover:border-stone-300 dark:hover:border-neutral-750"
            >
              <div className="flex items-center justify-between gap-1.5 mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 rounded-md bg-white dark:bg-neutral-900 border border-stone-200/60 dark:border-neutral-750 shadow-2xs text-stone-700 dark:text-stone-300">
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                    {rec.title}
                  </span>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-md font-bold bg-stone-200/70 dark:bg-neutral-800 text-stone-700 dark:text-neutral-300 border border-stone-300/40 dark:border-neutral-700">
                  {rec.badge}
                </span>
              </div>

              <div>
                <div className="text-sm md:text-base font-black font-mono text-stone-900 dark:text-white truncate">
                  {rec.value}
                </div>
                <p className="text-[10.5px] text-stone-500 dark:text-neutral-400 truncate mt-0.5">
                  {rec.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 2. Day & Hour Performance Table ───────────────────────────────────────
interface DayHourPerformanceTableProps {
  activeCategory: string;
  cells: any[];
}

export function DayHourPerformanceTable({ activeCategory, cells = [] }: DayHourPerformanceTableProps) {
  const gridData = useMemo(() => {
    const grid: Record<string, Record<string, { views: number; er: number }>> = {};
    days.forEach(day => {
      grid[day] = {};
      hours.forEach(hour => {
        grid[day][hour] = { views: 0, er: 0 };
      });
    });

    const DAY_MAP = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    cells.forEach(cell => {
      const dayName = DAY_MAP[cell.dayOfWeek];
      if (dayName && grid[dayName]) {
        const hourStr = `${cell.hourOfDay.toString().padStart(2, '0')}:00`;
        const views = cell.averageViews !== undefined ? cell.averageViews : (cell.avgViews !== undefined ? cell.avgViews : 0);
        const er = cell.averageEngagementRate !== undefined ? cell.averageEngagementRate : (cell.avgEngagementRate !== undefined ? cell.avgEngagementRate : 0);
        grid[dayName][hourStr] = { views: Math.round(views), er };
      }
    });

    return grid;
  }, [cells]);

  const dayPerf = useMemo(() => {
    return days.map((day) => {
      const allHourVals = hours.map((h) => gridData[day][h]);
      const avgViews = allHourVals.length > 0 ? Math.round(allHourVals.reduce((a, b) => a + b.views, 0) / allHourVals.length) : 0;
      const avgER = allHourVals.length > 0 ? allHourVals.reduce((a, b) => a + b.er, 0) / allHourVals.length : 0;
      
      const viewsList = allHourVals.map(v => v.views);
      const maxHourIdx = viewsList.indexOf(Math.max(...viewsList));
      const topHour = maxHourIdx !== -1 ? `${hours[maxHourIdx]}-${hours[Math.min(maxHourIdx + 1, 23)]}` : '20:00-21:00';
      const engagement = parseFloat((avgER * 100).toFixed(1));
      return { day, avgViews, topHour, engagement };
    });
  }, [gridData]);

  const hourPerf = useMemo(() => {
    return hourSlots.map((slot) => {
      let totalViews = 0;
      let totalER = 0;
      let count = 0;
      days.forEach((day) => {
        const start = slot.start;
        const end = slot.end;
        if (start <= end) {
          for (let h = start; h <= Math.min(end, 23); h++) {
            const val = gridData[day][`${h.toString().padStart(2, '0')}:00`] || { views: 0, er: 0 };
            totalViews += val.views;
            totalER += val.er;
            count++;
          }
        } else {
          for (let h = start; h <= 23; h++) {
            const val = gridData[day][`${h.toString().padStart(2, '0')}:00`] || { views: 0, er: 0 };
            totalViews += val.views;
            totalER += val.er;
            count++;
          }
          for (let h = 0; h < end; h++) {
            const val = gridData[day][`${h.toString().padStart(2, '0')}:00`] || { views: 0, er: 0 };
            totalViews += val.views;
            totalER += val.er;
            count++;
          }
        }
      });
      const avgViews = count > 0 ? Math.round(totalViews / count) : 0;
      const avgER = count > 0 ? (totalER / count) : 0;
      const engagement = parseFloat((avgER * 100).toFixed(1));
      return {
        hour: slot.label,
        category: slot.category,
        avgViews,
        topCategory: activeCategory === 'All' ? 'Semua Kategori' : activeCategory,
        engagement,
      };
    });
  }, [activeCategory, gridData]);

  const maxDayViews = Math.max(...dayPerf.map(x => x.avgViews), 1);
  const maxHourViews = Math.max(...hourPerf.map(x => x.avgViews), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Performa per Hari */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-stone-900 dark:text-white">
                Performa Rata-rata per Hari
              </h3>
              <p className="text-[11px] text-stone-400 dark:text-neutral-500">
                Peringkat hari berdasarkan volume tayangan mingguan
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {dayPerf.map((d, i) => {
            const pct = Math.max(8, (d.avgViews / maxDayViews) * 100);
            const isTop = d.avgViews === maxDayViews;

            return (
              <div key={i} className="group">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 dark:text-white w-16">
                      {d.day}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 dark:text-neutral-500">
                      Peak: {d.topHour}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-stone-900 dark:text-white">
                      {formatNum(d.avgViews)} views
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                      {d.engagement}%
                    </span>
                  </div>
                </div>

                <div className="h-4 rounded-md bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 overflow-hidden relative">
                  <div
                    className={`h-full rounded-md transition-all duration-700 ${
                      isTop ? 'bg-sky-600 dark:bg-sky-500' : 'bg-sky-500/80 dark:bg-sky-500/70'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                  <div className="absolute inset-0 flex items-center px-2">
                    <span className="font-mono font-bold text-[9.5px] text-white drop-shadow-xs select-none">
                      {formatNum(d.avgViews)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Performa per Slot Jam */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-stone-900 dark:text-white">
                Performa per Slot Jam Utama
              </h3>
              <p className="text-[11px] text-stone-400 dark:text-neutral-500">
                Distribusi performa pada 4 pembagian waktu posting
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {hourPerf.map((h, i) => {
            const pct = Math.max(8, (h.avgViews / maxHourViews) * 100);
            const isTop = h.avgViews === maxHourViews;

            return (
              <div key={i} className="group">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div>
                    <span className="font-bold text-stone-900 dark:text-white">
                      {h.hour}
                    </span>
                    <span className="text-[10px] text-stone-400 dark:text-neutral-500 ml-1.5 font-mono">
                      ({h.category})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-stone-900 dark:text-white">
                      {formatNum(h.avgViews)} views
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                      {h.engagement}%
                    </span>
                  </div>
                </div>

                <div className="h-4 rounded-md bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 overflow-hidden relative">
                  <div
                    className={`h-full rounded-md transition-all duration-700 ${
                      isTop ? 'bg-sky-600 dark:bg-sky-500' : 'bg-sky-500/80 dark:bg-sky-500/70'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                  <div className="absolute inset-0 flex items-center px-2">
                    <span className="font-mono font-bold text-[9.5px] text-white drop-shadow-xs select-none">
                      {formatNum(h.avgViews)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── 3. Video List by Time Slot ───────────────────────────────────────────
interface VideoListByTimeSlotProps {
  activeCategory: string;
  videos: any[];
}

export function VideoListByTimeSlot({ activeCategory, videos = [] }: VideoListByTimeSlotProps) {
  const [expandedSlot, setExpandedSlot] = useState<string | null>('Malam (20-23)');
  const timeSlots = ['Pagi (6-11)', 'Siang (12-16)', 'Sore (17-19)', 'Malam (20-23)'];

  const videosByTimeSlot = useMemo(() => {
    const groups: Record<string, any[]> = {
      'Pagi (6-11)': [],
      'Siang (12-16)': [],
      'Sore (17-19)': [],
      'Malam (20-23)': []
    };

    videos.forEach(v => {
      const hour = getHourFromPublishedAt(v.publishedAt);
      const views = v.viewsNum !== undefined ? v.viewsNum : (v.views !== undefined ? v.views : 0);
      const likes = v.likesNum !== undefined ? v.likesNum : (v.likes !== undefined ? v.likes : 0);
      const comments = v.commentsNum !== undefined ? v.commentsNum : (v.comments !== undefined ? v.comments : 0);
      const engagement = v.engagementRate !== undefined ? v.engagementRate : 0;
      
      const mappedVideo = {
        id: v.videoPk || v.id,
        title: v.titleBrief || 'Untitled Video',
        category: v.category || activeCategory,
        postedAt: v.publishedAt ? `${days[new Date(v.publishedAt).getDay() === 0 ? 6 : new Date(v.publishedAt).getDay() - 1]} ${v.publishedAt.substring(11, 16)}` : '',
        views,
        likes,
        comments,
        duration: v.durationSeconds ? `${Math.floor(v.durationSeconds / 60)}:${(v.durationSeconds % 60).toString().padStart(2, '0')}` : '0:00',
        engagementRate: engagement * 100,
        isViral: views >= 100000,
        coverUrl: v.coverUrl,
        videoUrl: v.videoUrl,
        shareUrl: v.shareUrl,
        echotikVideoId: v.echotikVideoId
      };

      if (hour >= 6 && hour <= 11) {
        groups['Pagi (6-11)'].push(mappedVideo);
      } else if (hour >= 12 && hour <= 16) {
        groups['Siang (12-16)'].push(mappedVideo);
      } else if (hour >= 17 && hour <= 19) {
        groups['Sore (17-19)'].push(mappedVideo);
      } else {
        groups['Malam (20-23)'].push(mappedVideo);
      }
    });

    Object.keys(groups).forEach(slot => {
      groups[slot].sort((a, b) => b.views - a.views);
    });

    return groups;
  }, [videos, activeCategory]);

  return (
    <div className="space-y-4">
      {timeSlots.map((slot) => {
        const slotVideos = videosByTimeSlot[slot] || [];
        const isExpanded = expandedSlot === slot;
        const displayVideos = slotVideos.slice(0, 8);

        return (
          <div
            key={slot}
            className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden transition-all"
          >
            {/* Accordion Header */}
            <div
              className="p-5 cursor-pointer flex items-center justify-between hover:bg-stone-50/50 dark:hover:bg-neutral-850/40 transition-colors"
              onClick={() => setExpandedSlot(isExpanded ? null : slot)}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-600 text-white shadow-2xs flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm text-stone-900 dark:text-white">
                      Slot Waktu {slot}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400">
                      {slotVideos.length} video
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-neutral-400 mt-0.5">
                    Rata-rata tayangan:{' '}
                    <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                      {slotVideos.length > 0
                        ? formatNum(Math.round(slotVideos.reduce((a, v) => a + v.views, 0) / slotVideos.length))
                        : '0'}{' '}
                      views
                    </span>
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-stone-100 dark:bg-neutral-800 text-stone-500 dark:text-neutral-400">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            {/* Accordion Content (Video Grid) */}
            {isExpanded && (
              <div className="p-5 pt-2 border-t border-stone-100 dark:border-neutral-800 bg-stone-50/40 dark:bg-neutral-850/30">
                {displayVideos.length === 0 ? (
                  <div className="py-8 text-center text-xs text-stone-400">
                    Tidak ada video pada slot waktu ini
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {displayVideos.map((v, idx) => {
                      const videoLink = v.shareUrl || v.videoUrl || `https://www.tiktok.com`;
                      const videoId = extractTikTokVideoId(v.shareUrl || v.videoUrl);
                      const proxiedCoverUrl = v.coverUrl ? resolveAvatarUrl(v.coverUrl) : null;

                      return (
                        <a
                          key={v.id + idx}
                          href={videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative rounded-xl overflow-hidden block bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs hover:shadow-md hover:border-sky-400 transition-all duration-200"
                        >
                          {/* Thumbnail */}
                          <div className="relative overflow-hidden aspect-[16/10] bg-stone-900 flex items-center justify-center">
                            {proxiedCoverUrl ? (
                              <img
                                src={proxiedCoverUrl}
                                alt={v.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : videoId ? (
                              <TikTokEmbed videoId={videoId} mode="player" lazy passThroughClicks />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-sky-900/60 to-stone-900 text-stone-300 p-3 text-center">
                                <VideoIcon className="w-6 h-6 text-sky-400 mb-1 opacity-80" />
                                <span className="text-[10px] font-mono text-stone-300 font-bold">TikTok Video</span>
                              </div>
                            )}

                            {/* Rank Badge */}
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md font-mono font-bold text-[10px] text-white bg-stone-900/85 backdrop-blur-xs border border-white/10 z-10">
                              #{idx + 1}
                            </div>

                            {/* Viral Badge */}
                            {v.isViral && (
                              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[9px] text-white bg-rose-600 shadow-xs z-10">
                                <Flame className="w-2.5 h-2.5 fill-current" />
                                VIRAL
                              </div>
                            )}

                            {/* Posted time */}
                            {v.postedAt && (
                              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md font-mono text-[9px] text-white bg-black/80 backdrop-blur-xs z-10">
                                {v.postedAt}
                              </div>
                            )}
                          </div>

                          {/* Info Section */}
                          <div className="p-3.5 space-y-2">
                            <p className="font-bold text-xs text-stone-900 dark:text-white leading-snug line-clamp-2 group-hover:text-sky-600 transition-colors">
                              {v.title}
                            </p>

                            <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-neutral-400 pt-2 border-t border-stone-100 dark:border-neutral-800 font-mono">
                              <div className="flex items-center gap-2.5 font-bold">
                                <span className="flex items-center gap-1 text-stone-800 dark:text-neutral-200">
                                  <Eye className="w-3 h-3 text-sky-500" />
                                  {formatNum(v.views)}
                                </span>
                                <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                                  <Heart className="w-3 h-3 fill-current text-rose-500" />
                                  {formatNum(v.likes)}
                                </span>
                              </div>

                              <span className="text-amber-600 font-bold">
                                {v.engagementRate.toFixed(1)}% eng
                              </span>
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
