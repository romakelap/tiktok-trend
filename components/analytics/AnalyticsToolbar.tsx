"use client";

import { useState } from "react";
import {
  Calendar,
  Check,
  ChevronDown,
  Download,
  Filter,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { TOKENS } from "@/lib/design-tokens";
import { initialsFrom } from "@/lib/analytics/formatters";
import { ACCOUNT_TINTS, PERIOD_LABELS } from "@/lib/analytics/meta";
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
 * account-scope dropdown, and the Export button. Mirrors the
 * `DashboardToolbar` pattern but with analytics-specific filters.
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
  const [accountOpen, setAccountOpen] = useState(false);

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
          Analytics Command Center
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-black text-white"
            style={{ background: "#111" }}
          >
            Pro
          </span>
        </h1>
        <p className="text-xs" style={{ color: TOKENS.textMuted }}>
          Performance, trends, scheduling, dan content recommendations.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Period dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setPeriodOpen((v) => !v);
              setAccountOpen(false);
            }}
            className="h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:opacity-75"
            style={{
              background: "#fff",
              border: `1px solid ${TOKENS.inputBorder}`,
              color: TOKENS.text,
            }}
          >
            <Calendar className="w-3.5 h-3.5" strokeWidth={2.5} />
            Period: <span className="font-black">{PERIOD_LABELS[period]}</span>
            <ChevronDown className="w-3 h-3" strokeWidth={2.5} />
          </button>
          {periodOpen && (
            <div
              className="absolute right-0 top-full mt-2 z-20 rounded-xl overflow-hidden w-48"
              style={{
                background: "#fff",
                border: `1px solid ${TOKENS.cardBorder}`,
                boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
              }}
            >
              {Object.entries(PERIOD_LABELS).map(([k, l], i, arr) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    onPeriodChange(k);
                    setPeriodOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-left transition-all hover:bg-black/5"
                  style={{
                    borderBottom:
                      i < arr.length - 1
                        ? `1px solid ${TOKENS.divider}`
                        : "none",
                  }}
                >
                  <span
                    className="font-bold text-xs flex-1"
                    style={{ color: TOKENS.text }}
                  >
                    {l}
                  </span>
                  {period === k && (
                    <Check
                      className="w-4 h-4"
                      style={{ color: "#111" }}
                      strokeWidth={2.5}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={onExport}
          className="h-9 rounded-xl text-xs font-bold"
          style={{
            background: "#fff",
            border: `1px solid ${TOKENS.inputBorder}`,
            color: TOKENS.text,
          }}
        >
          <Download className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} />
          Export
        </Button>
      </div>
    </div>
  );
}
