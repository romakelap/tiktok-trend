import React from 'react';
import { Gamepad2, BookOpen, Smile, Shirt, Utensils, Music, Sun, Monitor, Hash, Layers, LucideIcon } from "lucide-react";
import { CatData, CAT_COLORS } from "@/lib/hashtag/mock-data";

export const CAT_ICONS: Record<string, LucideIcon> = {
  All: Layers,
  Gaming: Gamepad2,
  Edukasi: BookOpen,
  Komedi: Smile,
  Fashion: Shirt,
  Kuliner: Utensils,
  Musik: Music,
  Lifestyle: Sun,
  Teknologi: Monitor,
};

interface CategorySelectorProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  allData?: CatData[];
}

export function CategorySelector({ activeCategory, onSelectCategory, allData = [] }: CategorySelectorProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-stone-900 dark:text-white">Filter Kategori Hashtag</span>
        <span className="text-[11px] text-stone-400 dark:text-neutral-500 font-mono">Pilih untuk memfilter analisis</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {allData.map(d => {
          const IconComponent = CAT_ICONS[d.category] ?? Hash;
          const isActive = d.category === activeCategory;
          const gPos = d.weekGrowth >= 0;
          return (
            <button
              key={d.category}
              onClick={() => onSelectCategory(d.category)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-sm'
                  : 'bg-stone-50 dark:bg-neutral-850 text-stone-600 dark:text-neutral-300 border border-stone-200/70 dark:border-neutral-800 hover:bg-stone-100 dark:hover:bg-neutral-800'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{d.category}</span>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                  isActive
                    ? 'bg-white/20 text-white dark:bg-stone-900/20 dark:text-stone-900'
                    : gPos
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                }`}
              >
                {gPos ? '+' : ''}{d.weekGrowth}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
