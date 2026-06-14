"use client";

import { useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";

import { TOKENS } from "@/lib/design-tokens";
import type { PeriodKey } from "@/lib/dashboard/types";
import { PeriodDropdown } from "./PeriodDropdown";

type DashboardToolbarProps = {
  period: PeriodKey;
  onPeriodChange: (v: PeriodKey) => void;
  onRefresh?: () => void;
};

/**
 * Period filter + refresh row, rendered as a sticky sub-header beneath the
 * SiteHeader. Search and category filter have been removed per requirements.
 */
export function DashboardToolbar({
  period,
  onPeriodChange,
  onRefresh,
}: DashboardToolbarProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    // Call the parent refresh handler
    onRefresh?.();
    // Keep animation visible for at least 1.5s
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div
      className="sticky top-0 z-30 px-6 py-3 border-b flex items-center justify-between gap-4 flex-wrap"
      style={{
        background: TOKENS.header,
        backdropFilter: "blur(20px)",
        borderColor: TOKENS.divider,
      }}
    >
      <div>
        <h1
          className="text-base font-black flex items-center gap-2 tracking-tight"
          style={{ color: TOKENS.text }}
        >
          Global Insight Dashboard
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-black text-white"
            style={{ background: "#111" }}
          >
            TikTok
          </span>
        </h1>
        <p className="text-xs" style={{ color: TOKENS.textMuted }}>
          Analyze TikTok performance by category, hashtag, keyword, posting
          time, and insight.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <PeriodDropdown value={period} onChange={onPeriodChange} />

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          style={{
            background: isRefreshing ? "rgba(0,0,0,0.05)" : "#fff",
            border: `1px solid ${isRefreshing ? "rgba(0,0,0,0.15)" : TOKENS.inputBorder}`,
            color: isRefreshing ? "#111" : TOKENS.textMuted,
            cursor: isRefreshing ? "not-allowed" : "pointer",
            minWidth: 120,
          }}
        >
          {isRefreshing ? (
            <>
              {/* Loader2 has built-in Tailwind animate-spin support */}
              <Loader2 className="w-3.5 h-3.5 flex-shrink-0 animate-spin" strokeWidth={2.5} />
              <span className="font-black">Refreshing data...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.5} />
              Refresh
            </>
          )}
        </button>
      </div>
    </div>
  );
}
