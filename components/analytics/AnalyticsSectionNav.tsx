"use client";

import {
  Calendar,
  ChartArea,
  DollarSign,
  Lightbulb,
  ListChecks,
  Sparkles,
} from "lucide-react";

import { TOKENS } from "@/lib/design-tokens";

const SECTIONS = [
  { id: "historical", label: "Historical Trends", Ico: ChartArea },
  { id: "performance", label: "Content Performance", Ico: ListChecks },
  { id: "schedule", label: "Optimal Schedule", Ico: Calendar },
  { id: "recs", label: "Recommendations", Ico: Lightbulb },
  { id: "ml-recs", label: "ML recommendations", Ico: Sparkles },
  { id: "revenue", label: "Revenue Analysis", Ico: DollarSign },
] as const;

/**
 * Sticky anchor nav for the analytics page sections. Sits just below the
 * `AnalyticsToolbar`. Uses native `<a href="#id">` jumps; sections rely on
 * `scroll-margin-top` to land below both sticky headers.
 */
export function AnalyticsSectionNav() {
  return (
    <div
      className="sticky top-[60px] z-20 px-6 py-2.5 border-b"
      style={{
        background: TOKENS.header,
        backdropFilter: "blur(20px)",
        borderColor: TOKENS.divider,
      }}
    >
      <div className="flex items-center gap-0.5 overflow-x-auto">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all hover:bg-black/[0.05]"
            style={{ color: TOKENS.textMuted }}
          >
            <s.Ico className="w-3.5 h-3.5" strokeWidth={2.4} />
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}
