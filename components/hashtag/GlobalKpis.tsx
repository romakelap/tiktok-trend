import React from 'react';
import { Globe, Flame, Zap, TrendingUp } from "lucide-react";
import { GridBg } from "@/components/layout/GridBg";
import { TOKENS } from "@/lib/design-tokens";
import { CatData, fmt } from "@/lib/hashtag/mock-data";

export function GlobalKpis({ allData = [] }: { allData?: CatData[] }) {
  const individualData = allData.filter(d => d.category !== 'All');
  const allTags = individualData.flatMap(d => d.tags || []);
  const hotCount = allTags.filter(t => t.trend === 'hot').length;
  
  // Count unique hashtags across all categories (case-insensitive)
  const uniqueHashtagCount = new Set(allTags.map(t => t.tag.toLowerCase())).size;

  const avgEngagement = allTags.length > 0
    ? Math.round(allTags.reduce((s, t) => s + (t.engagement || 0), 0) / allTags.length)
    : 0;
  const fastestTag = allTags.length > 0
    ? [...allTags].sort((a, b) => (b.weekGrowth || 0) - (a.weekGrowth || 0))[0]
    : null;

  const kpiItems = [
    { label: 'Total Hashtags', value: fmt(uniqueHashtagCount), sub: 'Seluruh kategori', icon: Globe, acc: TOKENS.accent },
    { label: 'Hashtag Hot', value: String(hotCount), sub: 'Trending minggu ini', icon: Flame, acc: TOKENS.negative },
    { label: 'Avg Engagement', value: avgEngagement + '%', sub: 'Rata-rata semua tag', icon: Zap, acc: TOKENS.warning },
    { label: 'Fastest Growing', value: fastestTag ? fastestTag.tag : '-', sub: fastestTag ? '+' + fastestTag.weekGrowth + '% minggu ini' : 'Tidak ada data', icon: TrendingUp, acc: TOKENS.positive },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiItems.map((k, i) => {
        const IconComponent = k.icon;
        return (
          <div
            key={i}
            className="relative p-5 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{
              background: TOKENS.card,
              border: `1px solid ${TOKENS.cardBorder}`,
              boxShadow: '0 2px 16px rgba(0,0,0,0.05),inset 0 1px 0 rgba(255,255,255,1)'
            }}
          >
            <GridBg theme="light" />
            <div className="relative z-10">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                style={{
                  background: k.acc,
                  boxShadow: `0 2px 8px ${k.acc}40`
                }}
              >
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: TOKENS.textMuted }}>
                {k.label}
              </p>
              <p className="text-2xl font-black mb-0.5" style={{ color: TOKENS.text }}>
                {k.value}
              </p>
              <p className="text-xs" style={{ color: TOKENS.textMuted }}>
                {k.sub}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
