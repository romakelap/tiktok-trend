"use client";

import { Activity, Layers, Target } from "lucide-react";

const SECTIONS = [
  { id: "kpi",             label: "Global Info",        Ico: Activity },
  { id: "category",        label: "Category Matrix",    Ico: Layers   },
  { id: "category-detail", label: "Category Deep Dive", Ico: Target   },
] as const;

export function SectionNav() {
  return (
    <div className="sticky top-[61px] z-20 px-6 py-2 bg-stone-50/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-stone-200/80 dark:border-neutral-800">
      <div className="flex items-center gap-1.5 overflow-x-auto">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap"
          >
            <s.Ico className="w-3.5 h-3.5" strokeWidth={2} />
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}
