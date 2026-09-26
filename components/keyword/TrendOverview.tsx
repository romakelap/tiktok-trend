import React from 'react';
import { Activity, Flame, TrendingUp, Minus, TrendingDown } from 'lucide-react';
import { KeywordItem } from '@/lib/keyword/mock-data';

interface TrendOverviewProps {
  keywords: KeywordItem[];
}

export function TrendOverview({ keywords }: TrendOverviewProps) {
  const trendGroups = {
    hot: keywords.filter(k => k.trend === 'hot').length,
    up: keywords.filter(k => k.trend === 'up').length,
    stable: keywords.filter(k => k.trend === 'stable').length,
    down: keywords.filter(k => k.trend === 'down').length,
  };
  const total = Object.values(trendGroups).reduce((a, b) => a + b, 0) || 1;

  const items = [
    { key: 'hot', label: 'Hot', icon: Flame, count: trendGroups.hot, color: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-800/60' },
    { key: 'up', label: 'Naik', icon: TrendingUp, count: trendGroups.up, color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/60' },
    { key: 'stable', label: 'Stabil', icon: Minus, count: trendGroups.stable, color: 'bg-stone-400', text: 'text-stone-600 dark:text-neutral-400', bg: 'bg-stone-50 dark:bg-neutral-850 border-stone-200/60 dark:border-neutral-750' },
    { key: 'down', label: 'Turun', icon: TrendingDown, count: trendGroups.down, color: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/60' },
  ];

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-stone-100 dark:bg-neutral-800 text-stone-700 dark:text-neutral-300">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-black text-xs text-stone-900 dark:text-white">
                Keyword Momentum
              </h4>
              <p className="text-[10px] text-stone-400 dark:text-neutral-500">
                Sinyal tren 7 hari terakhir
              </p>
            </div>
          </div>
        </div>

        {/* Stacked segmented bar */}
        <div className="flex h-2.5 rounded-full overflow-hidden bg-stone-100 dark:bg-neutral-800 mb-4 p-0.5 gap-0.5">
          {items.map((item) => (
            <div
              key={item.key}
              className={`h-full rounded-full transition-all duration-500 ${item.color}`}
              style={{ width: `${(item.count / total) * 100}%` }}
              title={`${item.label}: ${item.count} (${Math.round((item.count / total) * 100)}%)`}
            />
          ))}
        </div>

        {/* 4 Momentum Mini Cards */}
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.key}
                className={`p-2.5 rounded-xl border flex items-center justify-between ${item.bg}`}
              >
                <div className="flex items-center gap-1.5">
                  <IconComponent className={`w-3.5 h-3.5 ${item.text}`} />
                  <span className="text-[11px] font-bold text-stone-700 dark:text-neutral-300">
                    {item.label}
                  </span>
                </div>
                <span className={`font-mono font-bold text-xs ${item.text}`}>
                  {item.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
