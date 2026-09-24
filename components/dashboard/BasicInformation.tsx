"use client";

import React, { ElementType } from "react";
import {
  Activity,
  Hash,
  Key,
  Layers,
  Users,
  Video,
  TrendingUp,
} from "lucide-react";

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
  tag: string;
  accent: string;
};

export function BasicInformation({ summaryData, loading }: BasicInformationProps) {
  const totalVideos = summaryData?.totalVideos ?? 5012;
  const totalCategories = 5; // Edukasi, Komedi, Kuliner, Lifestyle & Home, Teknologi
  const totalHashtags = summaryData?.totalHashtags ?? 734;
  const totalKeywords = summaryData?.totalKeywords ?? 9;
  const averageEngagement = summaryData?.averageEngagementRate
    ? `${(summaryData.averageEngagementRate * 100).toFixed(2)}%`
    : "2.21%";
  const totalTrackedAccounts = summaryData?.totalTrackedAccounts ?? 3112;

  const cards: InfoCard[] = [
    {
      Ico: Video,
      label: "Total Videos",
      value: loading ? "..." : fmt(totalVideos),
      sub: "Konten video terindeks & dianalisis",
      tag: "Live Pipeline",
      accent: "text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-neutral-800 border-stone-200/80 dark:border-neutral-700",
    },
    {
      Ico: Layers,
      label: "Classified Categories",
      value: loading ? "..." : totalCategories,
      sub: "Klaster industri konten utama",
      tag: "100% Coverage",
      accent: "text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-neutral-800 border-stone-200/80 dark:border-neutral-700",
    },
    {
      Ico: Hash,
      label: "Hashtag Database",
      value: loading ? "..." : fmt(totalHashtags),
      sub: "Tag unik terpantau algoritmik",
      tag: "Trending Velocity",
      accent: "text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-neutral-800 border-stone-200/80 dark:border-neutral-700",
    },
    {
      Ico: Key,
      label: "NLP Keywords",
      value: loading ? "..." : fmt(totalKeywords),
      sub: "Entitas semantik terekstraksi",
      tag: "IndoBERT NLP",
      accent: "text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-neutral-800 border-stone-200/80 dark:border-neutral-700",
    },
    {
      Ico: Activity,
      label: "Benchmark Engagement",
      value: loading ? "..." : averageEngagement,
      sub: "Rata-rata interaksi audiens",
      tag: "Healthy Baseline",
      accent: "text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-neutral-800 border-stone-200/80 dark:border-neutral-700",
    },
    {
      Ico: Users,
      label: "Tracked Creators",
      value: loading ? "..." : fmt(totalTrackedAccounts),
      sub: "Kreator & profil ter-benchmark",
      tag: "Multi-Tier",
      accent: "text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-neutral-800 border-stone-200/80 dark:border-neutral-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
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

            {loading ? (
              <div className="h-7 w-20 bg-stone-100 dark:bg-neutral-800 animate-pulse rounded my-1" />
            ) : (
              <p className="text-2xl font-bold font-mono text-stone-900 dark:text-white tracking-tight leading-none mb-2">
                {c.value}
              </p>
            )}
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
