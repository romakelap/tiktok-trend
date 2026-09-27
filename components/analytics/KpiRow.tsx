"use client";

import { useMemo } from "react";
import { formatNum, formatPct } from "@/lib/analytics/formatters";
import type { HistoricalDay } from "@/lib/analytics/types";
import { HISTORICAL } from "@/lib/analytics/mock-data";

type KpiRowProps = {
  data?: HistoricalDay[];
  summaryData?: any;
};

type InfoCard = {
  label: string;
  value: string;
  sub: string;
  badge: string;
  badgeColor: string;
  delta?: string;
};

export function KpiRow({ data = [], summaryData }: KpiRowProps) {
  const displayData = useMemo(() => {
    if (data && data.length > 0) return data;
    return HISTORICAL;
  }, [data]);

  const totalViews = summaryData?.totalViews ?? displayData.reduce((s, d) => s + (d.views || 0), 0);
  const totalVideos = summaryData?.totalVideos ?? displayData.reduce((s, d) => s + (d.videos || 0), 0);
  const avgEng = summaryData?.averageEngagementRate
    ? (summaryData.averageEngagementRate * 100).toFixed(1)
    : (displayData.reduce((s, d) => s + (d.engagement || 0), 0) / (displayData.length || 1)).toFixed(1);
  const avgViral = summaryData?.avgViralScore ?? (displayData.reduce((s, d) => s + (d.viralProb || 0), 0) / (displayData.length || 1));
  const estimatedGmv = summaryData?.totalGmvLocal ?? 48200000;

  const fmtRp = (n: number) => {
    if (n >= 1_000_000_000) return "Rp " + (n / 1_000_000_000).toFixed(1) + "B";
    if (n >= 1_000_000) return "Rp " + (n / 1_000_000).toFixed(1) + "M";
    return "Rp " + n.toLocaleString("id-ID");
  };

  const cards: InfoCard[] = [
    {
      label: "TOTAL VIEWS",
      value: formatNum(totalViews),
      sub: "Akumulasi tayangan & reach",
      badge: "Live",
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    },
    {
      label: "TOTAL VIDEO",
      value: totalVideos.toLocaleString("id-ID"),
      sub: `${displayData.length || 14} hari analisis konten aktif`,
      badge: "100% Match",
      badgeColor: "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400",
    },
    {
      label: "ENGAGEMENT",
      value: `${avgEng}%`,
      delta: "+1.4%",
      sub: "Rata-rata interaksi audiens",
      badge: "Healthy",
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    },
    {
      label: "VIRAL SCORE",
      value: formatPct(avgViral),
      sub: "Potensi viralitas tinggi",
      badge: "Model RF",
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
    },
    {
      label: "ESTIMATED GMV",
      value: fmtRp(estimatedGmv),
      sub: "Estimasi konversi penjualan",
      badge: "Multi-Tier",
      badgeColor: "bg-stone-100 text-stone-600 dark:bg-neutral-800 dark:text-neutral-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-stone-200 dark:divide-neutral-800 border border-stone-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-900 shadow-xs">
      {cards.map((c) => (
        <div
          key={c.label}
          className="px-4 py-3.5 flex flex-col justify-between gap-1 hover:bg-stone-50/60 dark:hover:bg-neutral-800/40 transition-colors"
        >
          {/* Header row: Label & Badge */}
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="text-[9.5px] font-bold tracking-widest text-stone-400 dark:text-neutral-500 uppercase truncate">
              {c.label}
            </span>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${c.badgeColor} flex-shrink-0`}
            >
              {c.badge}
            </span>
          </div>

          {/* Value + Delta */}
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl font-black text-stone-900 dark:text-white tracking-tight leading-none">
              {c.value}
            </p>
            {c.delta && (
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                {c.delta}
              </span>
            )}
          </div>

          {/* Subtitle */}
          <p className="text-[10px] text-stone-400 dark:text-neutral-500 leading-tight mt-auto">
            {c.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
