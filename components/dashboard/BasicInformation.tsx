"use client";

import React, { ElementType } from "react";
import { Hash, Key, Layers, Users, Video, Activity } from "lucide-react";
import { fmt } from "@/lib/dashboard/formatters";

interface BasicInformationProps {
  summaryData: any;
  loading: boolean;
}

type InfoCard = {
  Ico: ElementType;
  label: string;
  value: string | number;
  sub: string;
  badge: string;
  badgeColor: string;
};

export function BasicInformation({ summaryData, loading }: BasicInformationProps) {
  const totalVideos = summaryData?.totalVideos ?? 8500;
  const totalCategories = 5;
  const totalHashtags = summaryData?.totalHashtags ?? 3300;
  const totalKeywords = summaryData?.totalKeywords ?? 9700;
  const averageEngagement = summaryData?.averageEngagementRate
    ? `${(summaryData.averageEngagementRate * 100).toFixed(2)}%`
    : "2.41%";
  const totalTrackedAccounts = summaryData?.totalTrackedAccounts ?? 3200;

  const cards: InfoCard[] = [
    {
      Ico: Video,
      label: "TOTAL VIDEOS",
      value: loading ? "..." : fmt(totalVideos),
      sub: "Konten terindeks & dianalisis",
      badge: "Live",
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    },
    {
      Ico: Layers,
      label: "CATEGORIES",
      value: loading ? "..." : `${totalCategories} Klaster`,
      sub: "Klaster industri utama",
      badge: "100% Match",
      badgeColor: "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400",
    },
    {
      Ico: Hash,
      label: "HASHTAGS DB",
      value: loading ? "..." : fmt(totalHashtags),
      sub: "Tag unik terpantau algoritma",
      badge: "Velocity",
      badgeColor: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400",
    },
    {
      Ico: Key,
      label: "NLP KEYWORDS",
      value: loading ? "..." : fmt(totalKeywords),
      sub: "Entitas semantik terekstraksi",
      badge: "IndoBERT",
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
    },
    {
      Ico: Activity,
      label: "ENGAGEMENT",
      value: loading ? "..." : averageEngagement,
      sub: "Rata-rata interaksi audiens",
      badge: "Healthy",
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    },
    {
      Ico: Users,
      label: "TRACKED CREATORS",
      value: loading ? "..." : fmt(totalTrackedAccounts),
      sub: "Kreator & profil terjukuan",
      badge: "Multi-Tier",
      badgeColor: "bg-stone-100 text-stone-600 dark:bg-neutral-800 dark:text-neutral-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-stone-200 dark:divide-neutral-800 border border-stone-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-900">
      {cards.map((c, i) => (
        <div
          key={c.label}
          className="px-4 py-4 flex flex-col gap-1 hover:bg-stone-50 dark:hover:bg-neutral-800/50 transition-colors"
        >
          {/* Label + badge row */}
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className="text-[9.5px] font-bold tracking-widest text-stone-400 dark:text-neutral-500 uppercase">
              {c.label}
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${c.badgeColor} flex-shrink-0`}>
              {c.badge}
            </span>
          </div>

          {/* Value */}
          {loading ? (
            <div className="h-8 w-16 bg-stone-100 dark:bg-neutral-800 animate-pulse rounded" />
          ) : (
            <p className="text-2xl font-black text-stone-900 dark:text-white tracking-tight leading-none">
              {c.value}
            </p>
          )}

          {/* Engagement delta (only for engagement card) */}
          {c.label === "ENGAGEMENT" && !loading && (
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              +0.2%
            </span>
          )}

          {/* Sub label */}
          <p className="text-[10px] text-stone-400 dark:text-neutral-500 leading-tight mt-auto">
            {c.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
