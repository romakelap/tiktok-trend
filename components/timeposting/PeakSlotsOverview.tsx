"use client";

import React, { useState, useMemo } from 'react';
import {
  Zap,
  TrendingUp,
  Tag,
  Filter,
  Clock,
  ChevronDown,
  Flame,
  Play,
  Eye,
  Heart,
  MessageCircle,
} from 'lucide-react';
import {
  categoryColors,
  days,
  hours,
  hourSlots,
  formatNum,
} from '@/lib/timeposting/mock-data';
import { TOKENS } from '@/lib/design-tokens';
import { GridBg } from '@/components/layout/GridBg';

const IconMap: Record<string, React.ComponentType<any>> = {
  Zap,
  TrendUp: TrendingUp,
  Tag,
  Filter,
  Clock,
  ChevronDown,
  Flame,
  Play,
  Eye,
  Heart,
  MessageCircle,
};

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

// ─── Optimization Panel ───────────────────────────────────────────
interface OptimizationPanelProps {
  activeCategory: string;
  cells: any[];
}

export function OptimizationPanel({ activeCategory, cells = [] }: OptimizationPanelProps) {
  const recommendationsList = useMemo(() => {
    if (!cells || cells.length === 0) {
      return [
        { iconName: 'Zap',    title: 'Peak Hours (Waktu Puncak)',     desc: '20:00 - 23:00 (Malam) adalah waktu posting paling optimal dengan volume penonton tertinggi.', category: 'Kategori Utama',       performance: 'Sangat Tinggi', color: '#111111' },
        { iconName: 'TrendUp',title: 'Best Day (Hari Terbaik)',        desc: 'Jumat & Sabtu menunjukkan engagement tertinggi untuk semua kategori video.',                  category: 'Pola Mingguan',        performance: 'Tinggi',        color: '#047857' },
        { iconName: 'Tag',    title: 'Optimal Pattern (Pola Posting)', desc: 'Konsistensi waktu posting sangat memengaruhi algoritma TikTok menyebarkan konten Anda.',       category: activeCategory,          performance: 'Konsisten',     color: '#1d4ed8' },
        { iconName: 'Filter', title: 'Avoid Slot (Waktu Dihindari)',   desc: 'Hindari posting antara 00:00 - 06:00 pagi karena tingkat interaksi turun drastis.',             category: 'Rekomendasi Konten',    performance: 'Kritis',        color: '#b91c1c' },
      ];
    }

    // Group views by day to find the best day
    const dayViews: Record<string, { totalViews: number; count: number }> = {};
    // Group views by hour to find the best hour
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

    // Avoid slot: find the hour between 0-23 with the lowest views
    const worstHourAverages = [...hourAverages].reverse();
    const worstHourNum = worstHourAverages[0]?.hour !== undefined ? worstHourAverages[0].hour : 2;
    const worstHourStr = `${worstHourNum.toString().padStart(2, '0')}:00 - ${(worstHourNum + 1).toString().padStart(2, '0')}:00`;

    return [
      {
        iconName: 'Zap',
        title: 'Peak Hours (Waktu Puncak)',
        desc: `Posting pada jam ${bestHourStr} adalah waktu paling optimal dengan rata-rata ${formatNum(bestHourViews)} views.`,
        category: 'Kategori Utama',
        performance: 'Sangat Tinggi',
        color: '#111111'
      },
      {
        iconName: 'TrendUp',
        title: 'Best Day (Hari Terbaik)',
        desc: `Hari ${bestDay} menunjukkan tingkat interaksi dan volume views rata-rata tertinggi untuk konten Anda.`,
        category: 'Pola Mingguan',
        performance: 'Tinggi',
        color: '#047857'
      },
      {
        iconName: 'Tag',
        title: 'Optimal Pattern (Pola Posting)',
        desc: `Menjaga konsistensi posting di jam-jam ramai membantu meningkatkan indeks distribusi algoritma video.`,
        category: activeCategory,
        performance: 'Konsisten',
        color: '#1d4ed8'
      },
      {
        iconName: 'Filter',
        title: 'Avoid Slot (Waktu Dihindari)',
        desc: `Hindari mempublikasikan konten pada jam ${worstHourStr} karena volume penonton aktif menurun drastis.`,
        category: 'Rekomendasi Konten',
        performance: 'Kritis',
        color: '#b91c1c'
      }
    ];
  }, [cells, activeCategory]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden p-6"
      style={{
        background: TOKENS.cardSoft,
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
      }}
    >
      <GridBg theme="light" />
      <div className="relative z-10">
        <h2 className="text-lg font-black mb-4" style={{ color: TOKENS.text }}>
          Rekomendasi Posting Optimal
          {activeCategory !== 'All' && (
            <span
              className="ml-2 text-sm font-semibold"
              style={{ color: categoryColors[activeCategory] }}
            >
              — {activeCategory}
            </span>
          )}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendationsList.map((rec, i) => {
            const RecIcon = IconMap[rec.iconName] || Zap;
            return (
              <div
                key={i}
                className="p-4 rounded-xl relative overflow-hidden"
                style={{
                  background: `${rec.color}08`,
                  border: `1px solid ${rec.color}20`,
                }}
              >
                <div className="relative z-10">
                  <div className="flex items-start gap-3 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: rec.color,
                        boxShadow: `0 0 10px ${rec.color}44`,
                      }}
                    >
                      <RecIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-sm" style={{ color: TOKENS.text }}>
                        {rec.title}
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: TOKENS.textMuted }}>
                        {rec.category}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: TOKENS.textSubtle }}>
                    {rec.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: TOKENS.textMuted }}>
                      Performance:
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-black text-white"
                      style={{ background: rec.color }}
                    >
                      {rec.performance}
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

// ─── Day & Hour Performance Table ──────────────────────────────────
interface DayHourPerformanceTableProps {
  activeCategory: string;
  cells: any[];
}

export function DayHourPerformanceTable({ activeCategory, cells = [] }: DayHourPerformanceTableProps) {
  // 1. Initialize grid with 0 values
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
          // Wrapping hour range (e.g. 23:00 to 06:00)
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
        topCategory: activeCategory === 'All' ? 'Kuliner' : activeCategory,
        engagement,
      };
    });
  }, [activeCategory, gridData]);

  const accentColor = activeCategory === 'All' ? '#111111' : categoryColors[activeCategory];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: TOKENS.cardSoft,
          border: `1px solid ${TOKENS.cardBorder}`,
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
        }}
      >
        <GridBg theme="light" />
        <div className="relative z-10 p-6">
          <h3 className="text-base font-black mb-4" style={{ color: TOKENS.text }}>
            Performa per Hari
          </h3>
          <div className="space-y-4">
            {dayPerf.map((d, i) => {
              const maxViews = Math.max(...dayPerf.map((x) => x.avgViews));
              const pct = maxViews > 0 ? (d.avgViews / maxViews) * 100 : 0;
              const isTop = d.avgViews === maxViews && maxViews > 0;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm" style={{ color: TOKENS.text }}>
                      {d.day}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm" style={{ color: TOKENS.text }}>
                        {formatNum(d.avgViews)}
                      </span>
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                        style={{
                          background: isTop ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)',
                          color: isTop ? TOKENS.text : TOKENS.textMuted,
                        }}
                      >
                        {d.engagement}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: TOKENS.barBg }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: isTop ? '#111' : 'rgba(0,0,0,0.25)',
                        boxShadow: 'none',
                      }}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: TOKENS.textMuted }}>
                    Peak: {d.topHour}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: TOKENS.cardSoft,
          border: `1px solid ${TOKENS.cardBorder}`,
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
        }}
      >
        <GridBg theme="light" />
        <div className="relative z-10 p-6">
          <h3 className="text-base font-black mb-4" style={{ color: TOKENS.text }}>
            Performa per Jam
          </h3>
          <div className="space-y-4">
            {hourPerf.map((h, i) => {
              const maxViews = Math.max(...hourPerf.map((x) => x.avgViews));
              const pct = maxViews > 0 ? (h.avgViews / maxViews) * 100 : 0;
              const isTop = h.avgViews === maxViews && maxViews > 0;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex-1">
                      <span className="font-bold text-sm" style={{ color: TOKENS.text }}>
                        {h.hour}
                      </span>
                      <span className="text-xs ml-1" style={{ color: TOKENS.textMuted }}>
                        • {h.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-black text-sm" style={{ color: TOKENS.text }}>
                        {formatNum(h.avgViews)}
                      </span>
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                        style={{
                          background: isTop ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)',
                          color: isTop ? TOKENS.text : TOKENS.textMuted,
                        }}
                      >
                        {h.engagement}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: TOKENS.barBg }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: isTop ? '#111' : 'rgba(0,0,0,0.25)',
                        boxShadow: 'none',
                      }}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: TOKENS.textMuted }}>
                    Top: {h.topCategory}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Video List by Time Slot ──────────────────────────────────────
interface VideoListByTimeSlotProps {
  activeCategory: string;
  videos: any[];
}

export function VideoListByTimeSlot({ activeCategory, videos = [] }: VideoListByTimeSlotProps) {
  const [expandedSlot, setExpandedSlot] = useState<string | null>('Pagi (6-11)');
  const timeSlots = ['Pagi (6-11)', 'Siang (12-16)', 'Sore (17-19)', 'Malam (20-23)'];

  // Categorize videos dynamically from the database
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
        engagementRate: engagement * 100, // percentage
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

    // Sort by views descending inside each slot
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
        const topVideo = slotVideos[0];

        // Slice to display up to 10 videos max in the list
        const displayVideos = slotVideos.slice(0, 10);

        return (
          <div
            key={slot}
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: TOKENS.cardSoft,
              border: `1px solid ${TOKENS.cardBorder}`,
              boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
            }}
          >
            <GridBg theme="light" />

            <div
              className="relative z-10 px-6 py-4 cursor-pointer transition-all"
              onClick={() => setExpandedSlot(isExpanded ? null : slot)}
              style={{ borderBottom: isExpanded ? `1px solid ${TOKENS.divider}` : 'none' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: '#111', boxShadow: '0 0 14px rgba(0,0,0,0.15)' }}
                  >
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-base" style={{ color: TOKENS.text }}>
                      {slot}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: TOKENS.textMuted }}>
                      {slotVideos.length} video{activeCategory !== 'All' && ` ${activeCategory}`} • Avg{' '}
                      {slotVideos.length > 0
                        ? formatNum(
                            Math.round(slotVideos.reduce((a, v) => a + v.views, 0) / slotVideos.length)
                          )
                        : '0'}{' '}
                      views
                    </p>
                  </div>
                </div>
                <button
                  className="p-2 rounded-xl transition-all"
                  style={{
                    background: 'rgba(0,0,0,0.06)',
                    border: `1px solid ${TOKENS.inputBorder}`,
                  }}
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    style={{ color: TOKENS.text }}
                  />
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="relative z-10">
                {topVideo ? (
                  <>
                    <div
                      className="px-6 py-4"
                      style={{
                        borderBottom: `1px solid ${TOKENS.divider}`,
                        background: 'rgba(0,0,0,0.02)',
                      }}
                    >
                      <p
                        className="text-xs font-bold uppercase tracking-widest mb-3"
                        style={{ color: TOKENS.textMuted }}
                      >
                        Top Video
                      </p>
                      <div className="flex gap-4 items-start flex-wrap md:flex-nowrap">
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-start justify-between mb-2 gap-2">
                            <div className="flex-1">
                              <p className="font-black text-sm leading-snug mb-1" style={{ color: TOKENS.text }}>
                                {topVideo.title}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className="px-2 py-0.5 rounded-full text-[10px] font-black text-white"
                                  style={{ background: categoryColors[topVideo.category] ?? '#666' }}
                                >
                                  {topVideo.category}
                                </span>
                                <span className="text-xs font-semibold" style={{ color: TOKENS.textMuted }}>
                                  {topVideo.postedAt}
                                </span>
                              </div>
                            </div>
                            {topVideo.isViral && (
                              <div
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black text-white flex-shrink-0"
                                style={{
                                  background: 'rgba(0,0,0,0.65)',
                                  boxShadow: 'none',
                                }}
                              >
                                <Flame className="w-3 h-3" />
                                VIRAL
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="w-full md:w-60 flex-shrink-0 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4" style={{ borderColor: TOKENS.divider }}>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <Eye className="w-3.5 h-3.5" style={{ color: TOKENS.textMuted }} />
                              </div>
                              <p className="font-black text-xs" style={{ color: TOKENS.text }}>
                                {formatNum(topVideo.views)}
                              </p>
                              <p className="text-[9px]" style={{ color: TOKENS.textMuted }}>
                                views
                              </p>
                            </div>
                            <div>
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <Heart className="w-3.5 h-3.5" style={{ color: TOKENS.textMuted }} />
                              </div>
                              <p className="font-black text-xs" style={{ color: TOKENS.text }}>
                                {formatNum(topVideo.likes)}
                              </p>
                              <p className="text-[9px]" style={{ color: TOKENS.textMuted }}>
                                likes
                              </p>
                            </div>
                            <div>
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <MessageCircle className="w-3.5 h-3.5" style={{ color: TOKENS.textMuted }} />
                              </div>
                              <p className="font-black text-xs" style={{ color: TOKENS.text }}>
                                {topVideo.engagementRate.toFixed(1)}%
                              </p>
                              <p className="text-[9px]" style={{ color: TOKENS.textMuted }}>
                                eng.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-4">
                      <p
                        className="text-xs font-bold uppercase tracking-widest mb-3"
                        style={{ color: TOKENS.textMuted }}
                      >
                        Daftar Lengkap ({displayVideos.length} videos)
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {displayVideos.map((v, idx) => {
                          const videoUrl = v.videoUrl || (v.echotikVideoId ? `https://www.tiktok.com/video/${v.echotikVideoId}` : 'https://www.tiktok.com');
                          return (
                            <a
                              href={videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              key={v.id}
                              className="group relative rounded-xl overflow-hidden block transition-all duration-200 hover:-translate-y-1"
                              style={{
                                background: '#f5f5f5',
                                border: `1px solid ${TOKENS.cardBorder}`,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                              }}
                            >
                              <div
                                className="relative h-24 flex items-center justify-center overflow-hidden"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(0,0,0,0.06), rgba(0,0,0,0.12))',
                                }}
                              >
                                {v.coverUrl ? (
                                  <img
                                    src={v.coverUrl}
                                    alt={v.title}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                ) : null}
                                <div
                                  className="absolute inset-0 flex items-center justify-center transition-opacity"
                                  style={{ background: 'rgba(0,0,0,0.2)' }}
                                >
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/95 shadow-sm transition-transform duration-200 group-hover:scale-110">
                                    <Play className="w-3 h-3 text-black fill-current ml-0.5" />
                                  </div>
                                </div>
                                <div className="absolute top-1 left-1 w-5 h-5 rounded-md flex items-center justify-center text-white font-black"
                                  style={{ background: 'rgba(0,0,0,0.6)', fontSize: 9 }}>
                                  #{idx + 1}
                                </div>
                                {v.isViral && (
                                  <div
                                    className="absolute top-1 right-1 px-1 py-0.5 rounded text-white text-[8px] font-bold flex items-center gap-0.5"
                                    style={{
                                      background: 'rgba(0,0,0,0.7)',
                                      boxShadow: 'none',
                                    }}
                                  >
                                    <Flame className="w-2 h-2 fill-current" />
                                    VIRAL
                                  </div>
                                )}
                                <div
                                  className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-white text-[9px] font-bold"
                                  style={{ background: 'rgba(0,0,0,0.65)' }}
                                >
                                  {v.duration}
                                </div>
                              </div>
                              <div className="p-2.5">
                                <p
                                  className="font-bold text-[10px] leading-snug mb-2 line-clamp-2"
                                  style={{ color: TOKENS.text }}
                                >
                                  {v.title}
                                </p>
                                <div className="flex items-center gap-1 mb-1.5">
                                  <span
                                    className="px-1.5 py-0.5 rounded text-white font-bold flex-shrink-0"
                                    style={{
                                      background: 'rgba(0,0,0,0.55)',
                                      fontSize: 9,
                                    }}
                                  >
                                    {v.category.slice(0, 3)}
                                  </span>
                                  <span className="text-[10px]" style={{ color: TOKENS.textMuted }}>
                                    •
                                  </span>
                                  <span className="text-[10px] font-bold" style={{ color: TOKENS.textMuted }}>
                                    {v.engagementRate.toFixed(1)}%
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px]">
                                  <Eye className="w-2.5 h-2.5" style={{ color: TOKENS.textMuted }} />
                                  <span className="font-bold" style={{ color: TOKENS.text }}>
                                    {formatNum(v.views)}
                                  </span>
                                </div>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="px-6 py-8 text-center">
                    <p className="text-sm font-bold" style={{ color: TOKENS.textMuted }}>
                      Tidak ada video {activeCategory} di slot waktu ini.
                    </p>
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
