import React from 'react';
import { Award, TrendingUp, TrendingDown, Hash } from "lucide-react";
import { GridBg } from "@/components/layout/GridBg";
import { TOKENS } from "@/lib/design-tokens";
import { CatData, CAT_COLORS, fmt } from "@/lib/hashtag/mock-data";
import { CAT_ICONS } from "./CategorySelector";

interface CrossCategoryProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  allData?: CatData[];
}

export function CrossCategory({ activeCategory, onSelectCategory, allData = [] }: CrossCategoryProps) {
  const individualData = allData.filter(d => d.category !== 'All');
  const sortedData = [...individualData].sort((a, b) => (b.tags?.length || 0) - (a.tags?.length || 0));
  const maxP = Math.max(...individualData.map(x => x.tags?.length || 0), 1);

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
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-black text-base" style={{ color: TOKENS.text }}>Perbandingan Lintas Kategori</h2>
            <p className="text-xs mt-0.5" style={{ color: TOKENS.textMuted }}>Total hashtags & hot hashtag tiap kategori minggu ini</p>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold"
            style={{ background: 'rgba(0,0,0,0.05)', color: TOKENS.textMuted, border: `1px solid ${TOKENS.inputBorder}` }}
          >
            <Award className="w-3.5 h-3.5" />
            7 hari terakhir
          </div>
        </div>
        <div className="space-y-3">
          {sortedData.map((d, i) => {
            const tagCount = d.tags?.length || 0;
            const pct = (tagCount / maxP) * 100;
            const col = CAT_COLORS[d.category] ?? '#111';
            const CIcon = CAT_ICONS[d.category] ?? Hash;
            const isAct = d.category === activeCategory;
            const gPos = d.weekGrowth >= 0;
            const hotCnt = (d.tags || []).filter(t => t.trend === 'hot').length;
            return (
              <div
                key={d.category}
                onClick={() => {
                  onSelectCategory(d.category);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <span className="w-5 text-center text-xs font-black flex-shrink-0" style={{ color: TOKENS.textMuted }}>
                  #{i + 1}
                </span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: isAct ? col : `${col}1a` }}
                >
                  <CIcon className="w-4 h-4" style={{ color: isAct ? '#fff' : col }} />
                </div>
                <span className="w-20 font-black text-sm flex-shrink-0" style={{ color: isAct ? col : TOKENS.text }}>
                  {d.category}
                </span>
                <div className="flex-1 relative h-9 rounded-xl overflow-hidden" style={{ background: TOKENS.barBg }}>
                  <div
                    className="h-full rounded-xl transition-all duration-700"
                    style={{ width: `${pct}%`, background: isAct ? col : `${col}55` }}
                  />
                  <div className="absolute inset-0 flex items-center px-3 justify-between">
                    <span className="font-black text-xs" style={{ color: pct > 50 ? '#fff' : TOKENS.text }}>
                      {fmt(tagCount)} hashtags
                    </span>
                    <span className="font-bold text-xs" style={{ color: pct > 70 ? 'rgba(255,255,255,0.7)' : TOKENS.textMuted }}>
                      {hotCnt} hot
                    </span>
                  </div>
                </div>
                <div
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black flex-shrink-0 w-20 justify-center"
                  style={{
                    background: gPos ? TOKENS.positiveBg : TOKENS.negativeBg,
                    color: gPos ? TOKENS.positive : TOKENS.negative,
                    border: `1px solid ${gPos ? 'rgba(26,122,74,0.18)' : 'rgba(185,28,28,0.15)'}`
                  }}
                >
                  {gPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {gPos ? '+' : ''}{d.weekGrowth}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
