"use client";

import React, { ElementType } from "react";
import {
  Activity,
  DollarSign,
  Hash,
  Key,
  Layers,
  ShoppingBag,
  Users,
  Video,
} from "lucide-react";

import { GridBg } from "@/components/layout/GridBg";
import { TOKENS } from "@/lib/design-tokens";
import { fmt, fmtRp } from "@/lib/dashboard/formatters";

interface BasicInformationProps {
  summaryData: any;
  loading: boolean;
}

type InfoCard = {
  Ico: ElementType;
  label: string;
  value: string | number;
  sub: string;
  color: string;
  tint: string;
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

  // Palette aligned with the 5 category colors used throughout the dashboard,
  // plus a dark-blue for the first card — creating visual harmony across the page.
  const cards: InfoCard[] = [
    {
      Ico: Video,
      label: "Total Videos",
      value: loading ? "..." : fmt(totalVideos),
      sub: "Semua konten aktif terindeks",
      color: "#1d4ed8",
      tint: "rgba(29,78,216,0.07)",
    },
    {
      Ico: Layers,
      label: "Total Categories",
      value: loading ? "..." : totalCategories,
      sub: "Kategori tren terklasifikasi",
      color: "#b91c1c",
      tint: "rgba(185,28,28,0.07)",
    },
    {
      Ico: Hash,
      label: "Total Hashtags",
      value: loading ? "..." : fmt(totalHashtags),
      sub: "Hashtag unik dalam database",
      color: "#0369a1",
      tint: "rgba(3,105,161,0.07)",
    },
    {
      Ico: Key,
      label: "Total Keywords",
      value: loading ? "..." : fmt(totalKeywords),
      sub: "Kata kunci terekstraksi NLP",
      color: "#b45309",
      tint: "rgba(180,83,9,0.07)",
    },
    {
      Ico: Activity,
      label: "Average Engagement",
      value: loading ? "..." : averageEngagement,
      sub: "Rata-rata keterlibatan pemirsa",
      color: "#047857",
      tint: "rgba(4,120,87,0.07)",
    },
    {
      Ico: Users,
      label: "Tracked Accounts",
      value: loading ? "..." : fmt(totalTrackedAccounts),
      sub: "Akun kompetitor & inspirasi",
      color: "#5b21b6",
      tint: "rgba(91,33,182,0.07)",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="relative p-5 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
          style={{
            background: TOKENS.cardSoft,
            border: `1px solid ${TOKENS.cardBorder}`,
            boxShadow:
              "0 4px 20px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          <GridBg theme="light" />
          
          {/* Subtle color glow on hover */}
          <div 
            className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
            style={{ background: c.color }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: c.tint,
                  border: `1.5px solid ${c.color}22`,
                }}
              >
                <c.Ico className="w-5 h-5" style={{ color: c.color }} strokeWidth={2.2} />
              </div>
            </div>

            <p
              className="text-[9.5px] font-black uppercase tracking-[0.14em] mb-1.5"
              style={{ color: TOKENS.textMuted }}
            >
              {c.label}
            </p>
            
            {loading ? (
              <div className="h-8 w-24 bg-black/5 animate-pulse rounded-lg mb-1" />
            ) : (
              <p
                className="text-2xl font-black mb-1 leading-none tracking-tight transition-colors duration-300 group-hover:text-black"
                style={{ color: TOKENS.text }}
              >
                {c.value}
              </p>
            )}
            
            <p
              className="text-[10.5px] font-medium leading-normal"
              style={{ color: TOKENS.textMuted }}
            >
              {c.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
