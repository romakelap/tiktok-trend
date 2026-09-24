"use client";

import type { ElementType } from "react";
import {
  Activity,
  Eye,
  Flame,
  Video,
} from "lucide-react";

import { formatNum, formatPct } from "@/lib/analytics/formatters";
import type { HistoricalDay } from "@/lib/analytics/types";

type KpiRowProps = {
  data: HistoricalDay[];
};

type InfoCard = {
  Ico: ElementType;
  label: string;
  value: string;
  sub: string;
  tag: string;
  accent: string;
};

/**
 * KPI summary cards matching the exact layout and formatting of BasicInformation on Dashboard.
 */
export function KpiRow({ data }: KpiRowProps) {
  const totalViews = data.reduce((s, d) => s + d.views, 0);
  const totalVideos = data.reduce((s, d) => s + d.videos, 0);
  const avgEng = (
    data.reduce((s, d) => s + d.engagement, 0) / (data.length || 1)
  ).toFixed(1);
  const avgViral = data.reduce((s, d) => s + d.viralProb, 0) / (data.length || 1);

  const cards: InfoCard[] = [
    {
      Ico: Eye,
      label: "Total Views",
      value: formatNum(totalViews),
      sub: "Akumulasi cross-account",
      tag: "+22% Reach",
      accent: "text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-neutral-800 border-stone-200/80 dark:border-neutral-700",
    },
    {
      Ico: Video,
      label: "Total Videos",
      value: totalVideos.toString(),
      sub: `Selama ${data.length} hari periode`,
      tag: `${totalVideos} Active`,
      accent: "text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-neutral-800 border-stone-200/80 dark:border-neutral-700",
    },
    {
      Ico: Activity,
      label: "Avg. Engagement",
      value: `${avgEng}%`,
      sub: "Rata-rata harian tertimbang",
      tag: "+0.8% Baseline",
      accent: "text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-neutral-800 border-stone-200/80 dark:border-neutral-700",
    },
    {
      Ico: Flame,
      label: "Avg. Viral Score",
      value: formatPct(avgViral),
      sub: "Model RF-viral-v2.4",
      tag: "+5.4% Velocity",
      accent: "text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-neutral-800 border-stone-200/80 dark:border-neutral-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((c) => (
        <div
          key={c.label}
          className="group relative p-4 rounded-xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-xs hover:border-stone-400 dark:hover:border-neutral-700 hover:shadow-sm transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10.5px] font-bold text-stone-500 dark:text-neutral-400 uppercase tracking-wider">
                {c.label}
              </span>
              <div
                className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 ${c.accent}`}
              >
                <c.Ico className="w-3.5 h-3.5" strokeWidth={2.2} />
              </div>
            </div>

            <p className="text-2xl font-bold font-mono text-stone-900 dark:text-white tracking-tight leading-none mb-2">
              {c.value}
            </p>
          </div>

          <div className="pt-2 border-t border-stone-100 dark:border-neutral-800 flex items-center justify-between gap-2">
            <span className="text-[10px] text-stone-500 dark:text-neutral-400 truncate">
              {c.sub}
            </span>
            <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-300 flex-shrink-0 font-mono">
              {c.tag}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}



