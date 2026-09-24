"use client";

import {
  Activity,
  ListChecks,
  Sparkles,
} from "lucide-react";

const SECTIONS = [
  { id: "overview", label: "Overview & Forecast", Ico: Activity },
  { id: "synergy", label: "Tactical Synergy & Schedule", Ico: Sparkles },
  { id: "performance", label: "Content Performance", Ico: ListChecks },
] as const;

/**
 * Sticky anchor nav for the analytics page sections. Sits just below the
 * `AnalyticsToolbar`.
 */
export function AnalyticsSectionNav() {
  return (
    <div className="sticky top-[57px] z-20 px-6 py-2 border-b border-stone-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md">
      <div className="flex items-center gap-1.5 overflow-x-auto">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-neutral-800 transition-all whitespace-nowrap"
          >
            <s.Ico className="w-3.5 h-3.5" />
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}

