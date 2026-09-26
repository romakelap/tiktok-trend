import React from 'react';
import { Type, Zap, Video, Eye, Sparkles } from 'lucide-react';
import { SparkBars } from './SparkBars';
import { formatNum } from '@/lib/keyword/mock-data';

interface KeywordKpisProps {
  topKeyword: string;
  sparkFreq: number[];
  avgEng: number;
  totalVideos: number;
  peakViews: number;
}

export function KeywordKpis({ topKeyword, sparkFreq, avgEng, totalVideos, peakViews }: KeywordKpisProps) {
  const kpis = [
    {
      label: 'Top Keyword #1',
      value: topKeyword ? `"${topKeyword}"` : '—',
      sub: 'Frekuensi kemunculan tertinggi',
      icon: Type,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200/60 dark:border-sky-800/60',
      spark: sparkFreq,
      badge: 'Rank 1',
    },
    {
      label: 'Avg Engagement Rate',
      value: `${avgEng.toFixed(1)}%`,
      sub: 'Rata-rata rasio interaksi',
      icon: Zap,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/60',
      badge: 'Rata-rata',
    },
    {
      label: 'Total Videos Terindeks',
      value: String(totalVideos),
      sub: 'Dataset video teranalisis',
      icon: Video,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-800/60',
      badge: 'Basis Data',
    },
    {
      label: 'Peak Avg Views',
      value: formatNum(peakViews),
      sub: 'Tayangan rerata kata kunci #1',
      icon: Eye,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/60',
      badge: 'Performa Puncak',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {kpis.map((k, i) => {
        const IconComponent = k.icon;
        return (
          <div
            key={i}
            className="p-4.5 rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs transition-all hover:shadow-sm flex flex-col justify-between"
          >
            <div>
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
            </div>

            {k.spark && (
              <div className="my-2 pt-1">
                <SparkBars data={k.spark} height={24} />
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-neutral-400 pt-2 border-t border-stone-100 dark:border-neutral-800 mt-2">
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
