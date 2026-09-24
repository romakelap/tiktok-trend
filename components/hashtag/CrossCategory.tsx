import React from 'react';
import { Award, TrendingUp, TrendingDown, Hash, Layers } from "lucide-react";
import { CatData, CAT_COLORS, fmt } from "@/lib/hashtag/mock-data";
import { CAT_ICONS } from "./CategorySelector";

interface CrossCategoryProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  allData?: CatData[];
}

export function CrossCategory({ activeCategory, onSelectCategory, allData = [] }: CrossCategoryProps) {
  const individualData = allData.filter(d => d.category !== 'All');
  const sortedData = [...individualData].sort((a, b) => (b.tags?.length || 0) - (a.tags?.length || 0));
  const maxP = Math.max(...individualData.map(x => x.tags?.length || 0), 1);

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-base text-stone-900 dark:text-white">Perbandingan Lintas Kategori</h2>
              <p className="text-xs text-stone-500 dark:text-neutral-400">Distribusi volume hashtag terindeks & volume tag hot per kategori</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400 border border-stone-200/60 dark:border-neutral-700">
            <Award className="w-3.5 h-3.5" />
            Database Agregat
          </div>
        </div>

        <div className="space-y-2.5">
          {sortedData.map((d, i) => {
            const tagCount = d.tags?.length || 0;
            const pct = Math.max(10, (tagCount / maxP) * 100);
            const CIcon = CAT_ICONS[d.category] ?? Hash;
            const isAct = d.category === activeCategory;
            const gPos = d.weekGrowth >= 0;
            const hotCnt = (d.tags || []).filter((t: any) => t.trend === 'hot').length;

            return (
              <div
                key={d.category}
                onClick={() => onSelectCategory(d.category)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                  isAct
                    ? 'bg-stone-50 dark:bg-neutral-850 border-stone-300 dark:border-neutral-650 shadow-2xs'
                    : 'bg-white dark:bg-neutral-900 border-stone-200/70 dark:border-neutral-800 hover:border-stone-300 dark:hover:border-neutral-700 hover:bg-stone-50/50 dark:hover:bg-neutral-850/40'
                }`}
              >
                <span className="w-5 text-center font-mono font-bold text-xs text-stone-400 dark:text-neutral-500 flex-shrink-0">
                  #{i + 1}
                </span>

                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform ${
                    isAct
                      ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-2xs'
                      : 'bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400'
                  }`}
                >
                  <CIcon className="w-4 h-4" />
                </div>

                <div className="w-24 sm:w-28 flex-shrink-0">
                  <p className="font-bold text-xs text-stone-900 dark:text-white truncate">
                    {d.category}
                  </p>
                  <span className="font-mono text-[10px] text-stone-400 dark:text-neutral-500">
                    {hotCnt} trending hot
                  </span>
                </div>

                <div className="flex-1 min-w-[120px] relative h-7 rounded-lg bg-stone-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className={`h-full rounded-lg transition-all duration-500 ${
                      isAct ? 'bg-stone-900 dark:bg-stone-200' : 'bg-stone-300 dark:bg-neutral-700'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                  <div className="absolute inset-0 flex items-center px-3 justify-between">
                    <span className="font-mono font-bold text-[11px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] select-none">
                      {fmt(tagCount)} hashtags
                    </span>
                    <span className="font-mono text-[10px] text-stone-500 dark:text-neutral-400 hidden sm:inline">
                      {hotCnt} hot tags
                    </span>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold flex-shrink-0 w-20 justify-center ${
                    gPos
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60'
                  }`}
                >
                  {gPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {gPos ? '+' : ''}{d.weekGrowth}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
