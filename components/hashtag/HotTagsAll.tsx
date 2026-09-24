import React from 'react';
import { Flame, TrendingUp, Hash } from "lucide-react";
import { CatData, CAT_COLORS, fmt } from "@/lib/hashtag/mock-data";
import { CAT_ICONS } from "./CategorySelector";

interface HotTagsAllProps {
  onSelectCategory: (category: string) => void;
  allData?: CatData[];
}

export function HotTagsAll({ onSelectCategory, allData = [] }: HotTagsAllProps) {
  const hotTags = allData
    .filter(d => d.category !== 'All')
    .flatMap(d => (d.tags || []).filter((t: any) => t.trend === 'hot').map((t: any) => ({ ...t, category: d.category })))
    .sort((a, b) => b.weekGrowth - a.weekGrowth)
    .slice(0, 20);

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-600 text-white shadow-sm">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-black text-base text-stone-900 dark:text-white">Hashtag Viral & Hot (Semua Kategori)</h2>
              <p className="text-xs text-stone-500 dark:text-neutral-400">Hashtag dengan laju pertumbuhan frekuensi tertinggi (&gt;15%) minggu ini</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60">
            {hotTags.length} Hashtag Hot
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
          {hotTags.map((t, i) => {
            const IconComponent = CAT_ICONS[t.category] ?? Hash;
            return (
              <button
                key={i}
                onClick={() => onSelectCategory(t.category)}
                className="group text-left rounded-xl p-3 bg-white dark:bg-neutral-850 border border-stone-200/70 dark:border-neutral-750 hover:border-stone-400 dark:hover:border-neutral-600 hover:shadow-2xs transition-all duration-150 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-stone-100 dark:bg-neutral-800 text-[10px] font-bold text-stone-600 dark:text-neutral-300">
                    <IconComponent className="w-3 h-3 text-stone-500" />
                    <span>{t.category}</span>
                  </div>
                  <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60">
                    <Flame className="w-2.5 h-2.5 fill-current" />
                    HOT
                  </span>
                </div>

                <p className="font-bold text-xs text-stone-900 dark:text-white truncate mb-1">
                  {t.tag}
                </p>

                <p className="font-mono text-[11px] text-stone-500 dark:text-neutral-400 mb-2">
                  {fmt(t.uses)} uses
                </p>

                <div className="pt-2 border-t border-stone-100 dark:border-neutral-800 flex items-center justify-between text-[10px] font-mono">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />+{t.weekGrowth}%
                  </span>
                  <span className="text-stone-400 dark:text-neutral-500">
                    {t.engagement}% eng
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
