"use client";

import { useState } from "react";
import {
  Calendar,
  Check,
  ChevronDown,
  Download,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { TOKENS } from "@/lib/design-tokens";
import { PERIOD_LABELS } from "@/lib/analytics/meta";

type AnalyticsToolbarProps = {
  period: string;
  onPeriodChange: (period: string) => void;
  accountFilter: string;
  onAccountFilterChange: (account: string) => void;
  accounts: { username: string; type: string; displayName: string }[];
  onExport?: () => void;
};

/**
 * Sticky sub-header beneath the page title that holds the period dropdown,
 * account-scope dropdown, and the Export button. Styled to match DashboardToolbar.
 */
export function AnalyticsToolbar({
  period,
  onPeriodChange,
  accountFilter,
  onAccountFilterChange,
  accounts,
  onExport,
}: AnalyticsToolbarProps) {
  const [periodOpen, setPeriodOpen] = useState(false);

  return (
    <div
      className="sticky top-0 z-30 px-6 py-3.5 border-b border-stone-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md flex items-center justify-between gap-4 flex-wrap"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-white dark:text-stone-900 shadow-sm">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-black text-stone-900 dark:text-white tracking-tight uppercase">
              Analytics Command Center
            </h1>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase bg-sky-50 text-sky-600 border border-sky-200/60 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800/40">
              Pro ML
            </span>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-neutral-400">
            Multi-account diagnostic performance, predictive trends & tactical synergy
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Period dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setPeriodOpen((v) => !v)}
            className="h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 text-stone-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800 shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>Period:</span>
            <span className="font-bold text-stone-900 dark:text-white">{PERIOD_LABELS[period] || period}</span>
            <ChevronDown className="w-3 h-3 text-stone-400 ml-0.5" />
          </button>
          {periodOpen && (
            <div
              className="absolute right-0 top-full mt-1.5 z-40 rounded-xl overflow-hidden w-48 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 shadow-lg py-1 animate-fade-in"
            >
              {Object.entries(PERIOD_LABELS).map(([k, l]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    onPeriodChange(k);
                    setPeriodOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition-colors hover:bg-stone-50 dark:hover:bg-neutral-800"
                >
                  <span className={`font-medium ${period === k ? "text-stone-900 dark:text-white font-bold" : "text-stone-600 dark:text-neutral-400"}`}>
                    {l}
                  </span>
                  {period === k && (
                    <Check className="w-3.5 h-3.5 text-sky-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {onExport && (
          <Button
            size="sm"
            variant="outline"
            onClick={onExport}
            className="h-8 px-3 rounded-lg text-xs font-semibold bg-white dark:bg-neutral-900 border-stone-200 dark:border-neutral-800 text-stone-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-stone-400" />
            Export PDF
          </Button>
        )}
      </div>
    </div>
  );
}

