import React from 'react';
import { Flame, TrendingUp, Hash } from "lucide-react";
import { GridBg } from "@/components/layout/GridBg";
import { TOKENS } from "@/lib/design-tokens";
import { CatData, CAT_COLORS, fmt } from "@/lib/hashtag/mock-data";
import { CAT_ICONS } from "./CategorySelector";

interface HotTagsAllProps {
  onSelectCategory: (category: string) => void;
  allData?: CatData[];
}

export function HotTagsAll({ onSelectCategory, allData = [] }: HotTagsAllProps) {
  const hotTags = allData
    .filter(d => d.category !== 'All')
    .flatMap(d => (d.tags || []).filter(t => t.trend === 'hot').map(t => ({ ...t, category: d.category })))
    .sort((a, b) => b.weekGrowth - a.weekGrowth)
    .slice(0, 20);

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: TOKENS.card,
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.05),inset 0 1px 0 rgba(255,255,255,1)'
      }}
    >
      <GridBg theme="light" />
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: TOKENS.negative, boxShadow: '0 2px 8px rgba(185,28,28,0.25)' }}
          >
            <Flame className="w-5 h-5 text-white fill-current" />
          </div>
          <div>
            <h2 className="font-black text-base" style={{ color: TOKENS.text }}>Hashtag HOT — Semua Kategori</h2>
            <p className="text-xs mt-0.5" style={{ color: TOKENS.textMuted }}>Pertumbuhan tertinggi minggu ini lintas semua kategori</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {hotTags.map((t, i) => {
            const col = CAT_COLORS[t.category] ?? '#111';
            const IconComponent = CAT_ICONS[t.category] ?? Hash;
            return (
              <button
                key={i}
                onClick={() => {
                  onSelectCategory(t.category);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group text-left relative rounded-xl overflow-hidden p-3 transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: '#FFFFFF', border: `1px solid rgba(0,0,0,0.08)`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: col }}
                  >
                    <IconComponent className="w-3 h-3 text-white" />
                  </div>
                  <span
                    className="font-black rounded-full px-1.5 py-0.5"
                    style={{ background: TOKENS.negativeBg, color: TOKENS.negative, fontSize: 8 }}
                  >
                    HOT
                  </span>
                </div>
                <p className="font-black text-sm mb-0.5 truncate" style={{ color: TOKENS.text }}>{t.tag}</p>
                <p className="text-xs font-semibold mb-1.5" style={{ color: TOKENS.textMuted }}>{fmt(t.uses)} uses</p>
                <div className="flex items-center gap-1 text-xs font-black" style={{ color: TOKENS.positive }}>
                  <TrendingUp className="w-3 h-3" />+{t.weekGrowth}% minggu ini
                </div>
                <div className="mt-1.5 text-xs" style={{ color: TOKENS.textMuted, fontSize: 9 }}>
                  avg {fmt(t.avgViews)} views · {t.engagement}% eng
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
