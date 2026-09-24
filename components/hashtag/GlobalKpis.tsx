import React from 'react';
import { Globe, Flame, Zap, TrendingUp } from "lucide-react";
import { CatData, fmt } from "@/lib/hashtag/mock-data";

export function GlobalKpis({ allData = [] }: { allData?: CatData[] }) {
  const individualData = allData.filter(d => d.category !== 'All');
  const allTags = individualData.flatMap(d => d.tags || []);
  const hotCount = allTags.filter(t => t.trend === 'hot').length;
  
  // Count unique hashtags across all categories (case-insensitive)
  const uniqueHashtagCount = new Set(allTags.map(t => t.tag.toLowerCase())).size;

  const avgEngagement = allTags.length > 0
    ? Math.round(allTags.reduce((s, t) => s + (t.engagement || 0), 0) / allTags.length)
    : 0;
  const fastestTag = allTags.length > 0
    ? [...allTags].sort((a, b) => (b.weekGrowth || 0) - (a.weekGrowth || 0))[0]
    : null;

  const kpiItems = [
    {
      label: 'Total Hashtags',
      value: fmt(uniqueHashtagCount),
      sub: 'Seluruh kategori',
      icon: Globe,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200/60 dark:border-sky-800/60',
      badge: 'Database Aktif'
    },
    {
      label: 'Hashtag Hot',
      value: String(hotCount),
      sub: 'Lonjakan tren > 15%',
      icon: Flame,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-800/60',
      badge: 'Trending Minggu Ini'
    },
    {
      label: 'Avg Engagement',
      value: avgEngagement + '%',
      sub: 'Rata-rata interaksi',
      icon: Zap,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/60',
      badge: 'Rata-rata Semua Tag'
    },
    {
      label: 'Fastest Growing',
      value: fastestTag ? fastestTag.tag : '-',
      sub: fastestTag ? `+${fastestTag.weekGrowth}% minggu ini` : 'Tidak ada data',
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/60',
      badge: 'Pertumbuhan Tertinggi'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {kpiItems.map((k, i) => {
        const IconComponent = k.icon;
        return (
          <div
            key={i}
            className="p-4.5 rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs transition-all hover:shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-neutral-500">
                {k.label}
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${k.bg} ${k.color}`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black font-mono tracking-tight text-stone-900 dark:text-white mb-1 truncate">
              {k.value}
            </p>
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-neutral-400 pt-1 border-t border-stone-100 dark:border-neutral-800">
              <span className="text-[11px] truncate">{k.sub}</span>
              <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400">
                {k.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
