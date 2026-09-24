"use client";

import { useState } from "react";
import { RefreshCw, Loader2, Sparkles } from "lucide-react";
import type { PeriodKey } from "@/lib/dashboard/types";
import { PeriodDropdown } from "./PeriodDropdown";

type DashboardToolbarProps = {
  period: PeriodKey;
  onPeriodChange: (v: PeriodKey) => void;
  onRefresh?: () => void;
};

export function DashboardToolbar({
  period,
  onPeriodChange,
  onRefresh,
}: DashboardToolbarProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  return (
    <div className="sticky top-0 z-30 px-6 py-4 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-stone-200/80 dark:border-neutral-800 flex items-center justify-between gap-4 flex-wrap">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 text-[11px] font-semibold text-stone-700 dark:text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>BI PLATFORM</span>
          </div>
          <h1 className="text-lg font-bold text-stone-900 dark:text-white tracking-tight">
            Global Market Intelligence
          </h1>
        </div>
        <p className="text-xs text-stone-500 dark:text-neutral-400 mt-1">
          TikTok cross-category intelligence, real-time hashtag velocity, and viral benchmark metrics.
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <PeriodDropdown value={period} onChange={onPeriodChange} />

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`h-9 px-3.5 rounded-lg text-xs font-semibold border flex items-center gap-2 transition-all ${
            isRefreshing
              ? "bg-stone-100 dark:bg-neutral-800 border-stone-300 dark:border-neutral-700 text-stone-400 cursor-not-allowed"
              : "bg-white dark:bg-neutral-900 border-stone-200 dark:border-neutral-700 text-stone-700 dark:text-neutral-200 hover:bg-stone-50 dark:hover:bg-neutral-800 hover:border-stone-300 shadow-xs cursor-pointer"
          }`}
        >
          {isRefreshing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 flex-shrink-0 animate-spin text-stone-600 dark:text-neutral-300" />
              <span>Memperbarui...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5 flex-shrink-0 text-stone-500" />
              <span>Sync Data</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
