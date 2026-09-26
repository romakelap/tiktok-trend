import React from 'react';
import { BookOpen, Smile, Utensils, Home, Monitor, Type, Layers, LucideIcon } from 'lucide-react';

interface CategorySelectorProps {
  selected: string;
  onSelect: (category: string) => void;
}

const CATEGORY_ITEMS: { name: string; icon: LucideIcon }[] = [
  { name: 'Edukasi', icon: BookOpen },
  { name: 'Komedi', icon: Smile },
  { name: 'Kuliner', icon: Utensils },
  { name: 'Lifestyle', icon: Home },
  { name: 'Teknologi', icon: Monitor },
];

export function CategorySelector({ selected, onSelect }: CategorySelectorProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-stone-900 dark:text-white">Filter Kategori Keyword</span>
        <span className="text-[11px] text-stone-400 dark:text-neutral-500 font-mono">Pilih kategori untuk menganalisis caption hooks</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {CATEGORY_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const isSelected = selected === item.name;
          return (
            <button
              key={item.name}
              onClick={() => onSelect(item.name)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-sm'
                  : 'bg-stone-50 dark:bg-neutral-850 text-stone-600 dark:text-neutral-300 border border-stone-200/70 dark:border-neutral-800 hover:bg-stone-100 dark:hover:bg-neutral-800'
              }`}
            >
              <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-white dark:text-stone-900' : 'text-stone-400'}`} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
