"use client";

import { useState } from "react";
import { RefreshCw, Loader2, Clock, Settings } from "lucide-react";
import type { PeriodKey } from "@/lib/dashboard/types";
import { PeriodDropdown } from "./PeriodDropdown";

type DashboardToolbarProps = {
  period: PeriodKey;
  onPeriodChange: (v: PeriodKey) => void;
  onRefresh?: () => void;
  activeTab?: "overview" | "category" | "deepdive";
  onTabChange?: (tab: "overview" | "category" | "deepdive") => void;
};

export function DashboardToolbar({
  period,
  onPeriodChange,
  onRefresh,
  activeTab = "category",
  onTabChange,
}: DashboardToolbarProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "category" as const, label: "Category Matrix" },
    { id: "deepdive" as const, label: "Deep Dive" },
  ];

  return (
    <div className="sticky top-0 z-30 bg-white dark:bg-neutral-950 border-b border-stone-200 dark:border-neutral-800">
      {/* Top row */}
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: breadcrumb + badge */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-stone-900 dark:bg-white text-white dark:text-stone-900 flex items-center justify-center font-bold text-xs flex-shrink-0">
            TT
          </div>
          <div className="flex items-center gap-1.5 text-sm text-stone-500 dark:text-neutral-400 min-w-0">
            <span className="font-semibold text-stone-900 dark:text-white">Intelligence HQ</span>
            <span>/</span>
            <span className="text-stone-600 dark:text-neutral-300">Global Analysis</span>
          </div>
          <span className="ml-1 px-2 py-0.5 text-[10px] font-bold tracking-wide text-stone-600 dark:text-neutral-300 border border-stone-300 dark:border-neutral-600 rounded">
            PROD_v2.6
          </span>
        </div>

        {/* Tab navigation */}
        <div className="hidden md:flex items-center gap-0.5 bg-stone-100 dark:bg-neutral-800 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange?.(tab.id)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white dark:bg-neutral-900 text-stone-900 dark:text-white shadow-sm"
                  : "text-stone-500 dark:text-neutral-400 hover:text-stone-700 dark:hover:text-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: period + sync + timestamp */}
        <div className="flex items-center gap-2.5">
          <PeriodDropdown value={period} onChange={onPeriodChange} />

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`h-8 px-3.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isRefreshing
                ? "bg-stone-100 dark:bg-neutral-800 text-stone-400 cursor-not-allowed"
                : "bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-100 cursor-pointer"
            }`}
          >
            {isRefreshing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>Sync Data</span>
          </button>

          <button
            type="button"
            className="w-8 h-8 rounded-lg border border-stone-200 dark:border-neutral-700 flex items-center justify-center text-stone-500 hover:text-stone-800 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
