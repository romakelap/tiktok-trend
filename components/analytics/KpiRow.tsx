"use client";

import { useMemo, type ElementType } from "react";
import {
  Activity,
  Eye,
  Flame,
  Video,
} from "lucide-react";

import { formatNum, formatPct } from "@/lib/analytics/formatters";
import type { HistoricalDay } from "@/lib/analytics/types";
import { HISTORICAL } from "@/lib/analytics/mock-data";

type KpiRowProps = {
  data?: HistoricalDay[];
};

type InfoCard = {
  Ico: ElementType;
  label: string;
  value: string;
  sub: string;
  tag: string;
  iconBg: string;
  iconColor: string;
};

export function KpiRow({ data = [] }: KpiRowProps) {
  const displayData = useMemo(() => {
    if (data && data.length > 0) return data;
    return HISTORICAL;
  }, [data]);

  const totalViews = displayData.reduce((s, d) => s + (d.views || 0), 0);
  const totalVideos = displayData.reduce((s, d) => s + (d.videos || 0), 0);
  const avgEng = (
    displayData.reduce((s, d) => s + (d.engagement || 0), 0) / (displayData.length || 1)
  ).toFixed(1);
  const avgViral = displayData.reduce((s, d) => s + (d.viralProb || 0), 0) / (displayData.length || 1);

  const cards: InfoCard[] = [
    {
      Ico: Eye,
      label: "Total Views",
      value: formatNum(totalViews),
      sub: "Akumulasi tayangan",
      tag: "Jangkauan",
      iconBg: "bg-sky-50 dark:bg-sky-950/40",
      iconColor: "text-sky-600 dark:text-sky-400",
    },
    {
      Ico: Video,
      label: "Total Video",
      value: totalVideos.toLocaleString("id-ID"),
      sub: `${displayData.length} hari analisis`,
      tag: "Konten Aktif",
      iconBg: "bg-stone-100 dark:bg-neutral-800",
      iconColor: "text-stone-700 dark:text-neutral-200",
    },
    {
      Ico: Activity,
      label: "Avg. Engagement",
      value: `${avgEng}%`,
      sub: "Rata-rata interaksi",
      tag: "Interaksi",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      Ico: Flame,
      label: "Viral Score",
      value: formatPct(avgViral),
      sub: "Model RF-viral",
      tag: "Potensi Viral",
      iconBg: "bg-amber-50 dark:bg-amber-950/40",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-xs hover:border-stone-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between gap-2"
        >
          {/* Header row: Label & Icon */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-stone-500 dark:text-neutral-400 uppercase tracking-wider truncate">
              {c.label}
            </span>
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${c.iconBg} ${c.iconColor}`}
            >
              <c.Ico className="w-3.5 h-3.5" strokeWidth={2.2} />
            </div>
          </div>

          {/* Metric value */}
          <div>
            <p className="text-lg sm:text-xl font-black font-mono text-stone-900 dark:text-white tracking-tight leading-none">
              {c.value}
            </p>
          </div>

          {/* Compact footer */}
          <div className="pt-1.5 border-t border-stone-100 dark:border-neutral-800 flex items-center justify-between gap-1 text-[10px]">
            <span className="text-stone-400 truncate">
              {c.sub}
            </span>
            <span className="font-semibold text-stone-600 dark:text-neutral-300 bg-stone-100 dark:bg-neutral-800 px-1.5 py-0.2 rounded text-[9px] flex-shrink-0">
              {c.tag}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
