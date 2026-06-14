import React from 'react';
import {
  Type, ArrowRight, Hash, Flame, TrendingUp, TrendingDown, Award, ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GridBg } from '@/components/layout/GridBg';
import { Mono } from '@/components/dashboard';
import { TOKENS } from '@/lib/design-tokens';
import {
  KeywordItem,
  HashtagItem,
  VideoItem,
  CAT_META,
  ACCOUNT_TINTS
} from '@/lib/nlp-insight/mock-data';
import { formatNum, initialsFrom } from './WeeklySummary';

// ─────────────────────────────────────────────────────────────────
// KEYWORD CLOUD
// ─────────────────────────────────────────────────────────────────
export function KeywordCloud({ keywords }: { keywords: KeywordItem[] }) {
  const max = Math.max(...keywords.map(k => k.freq));
  const min = Math.min(...keywords.map(k => k.freq));
  const range = max - min || 1;

  // Map freq → style settings
  const getStyle = (freq: number) => {
    const ratio = (freq - min) / range;
    if (ratio >= 0.75) return { fontSize: 22, weight: 900, color: TOKENS.text, bg: 'rgba(17,17,17,0.04)', border: 'rgba(17,17,17,0.15)' };
    if (ratio >= 0.50) return { fontSize: 18, weight: 800, color: TOKENS.text, bg: 'rgba(17,17,17,0.03)', border: 'rgba(17,17,17,0.1)'  };
    if (ratio >= 0.25) return { fontSize: 14, weight: 700, color: TOKENS.textSubtle, bg: 'transparent', border: TOKENS.divider };
    return                  { fontSize: 12, weight: 600, color: TOKENS.textMuted,  bg: 'transparent', border: TOKENS.divider };
  };

  return (
    <div className="relative rounded-2xl overflow-hidden p-6 h-full"
      style={{
        background: TOKENS.cardSoft,
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)'
      }}>
      <GridBg theme="light" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#111' }}>
              <Type className="w-4 h-4 text-white" strokeWidth={2.4} />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-tight" style={{ color: TOKENS.text }}>Top Keywords</h3>
              <p className="text-[11px]" style={{ color: TOKENS.textMuted }}>{keywords.length} keyword diekstrak dari caption & komentar</p>
            </div>
          </div>
          <Mono size="xs" dim className="font-bold">extracted via spaCy + KeyBERT</Mono>
        </div>

        {/* Cloud */}
        <div className="flex flex-wrap items-center gap-2.5 leading-none py-3">
          {keywords.map((k, i) => {
            const s = getStyle(k.freq);
            return (
              <button key={i}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer"
                style={{
                  fontSize: s.fontSize,
                  fontWeight: s.weight,
                  color: s.color,
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  letterSpacing: '-0.02em',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                {k.word}
                <span className="text-[9px] font-bold opacity-50">{k.freq}</span>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-5 pt-4" style={{ borderTop: `1px solid ${TOKENS.divider}` }}>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: TOKENS.textMuted }}>Size:</span>
            <span className="text-xs font-black" style={{ color: TOKENS.text }}>frequency</span>
          </div>
          <span className="w-1 h-1 rounded-full" style={{ background: TOKENS.textMuted }} />
          <div className="flex items-center gap-2 text-[10px] font-bold" style={{ color: TOKENS.textMuted }}>
            <span className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(17,17,17,0.04)', color: TOKENS.text, fontWeight: 900 }}>tinggi</span>
            <ArrowRight className="w-2.5 h-2.5" />
            <span>rendah</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TOP HASHTAGS LIST
// ─────────────────────────────────────────────────────────────────
export function TopHashtagsList({ hashtags }: { hashtags: HashtagItem[] }) {
  const max = Math.max(...hashtags.map(h => h.uses));
  return (
    <div className="relative rounded-2xl overflow-hidden h-full"
      style={{
        background: TOKENS.cardSoft,
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)'
      }}>
      <GridBg theme="light" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${TOKENS.divider}` }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#111' }}>
              <Hash className="w-4 h-4 text-white" strokeWidth={2.4} />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-tight" style={{ color: TOKENS.text }}>Top Hashtags</h3>
              <p className="text-[11px]" style={{ color: TOKENS.textMuted }}>Penggunaan & momentum minggu ini</p>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="divide-y" style={{ borderColor: TOKENS.divider }}>
          {hashtags.map((h, i) => {
            const pct = (h.uses / max) * 100;
            const hot = h.change >= 50;
            return (
              <div key={i} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-black/[0.02]"
                style={{ borderBottom: i < hashtags.length - 1 ? `1px solid ${TOKENS.divider}` : 'none' }}>
                {/* Rank */}
                <span className="w-6 text-center text-xs font-black flex-shrink-0"
                  style={{ color: i < 3 ? TOKENS.text : TOKENS.textMuted }}>
                  {i + 1}
                </span>

                {/* Tag */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-sm" style={{ color: TOKENS.text }}>{h.tag}</span>
                    {hot && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider"
                        style={{ background: 'rgba(225,29,72,0.08)', color: '#e11d48', border: '1px solid rgba(225,29,72,0.2)' }}>
                        <Flame className="w-2.5 h-2.5" strokeWidth={3} />
                        Hot
                      </span>
                    )}
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: TOKENS.barBg }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#111' }} />
                  </div>
                </div>

                {/* Uses */}
                <div className="text-right flex-shrink-0 w-16">
                  <p className="font-black text-sm" style={{ color: TOKENS.text }}>{formatNum(h.uses)}</p>
                  <p className="text-[10px]" style={{ color: TOKENS.textMuted }}>uses</p>
                </div>

                {/* Change */}
                <span className="inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-md w-14 justify-center flex-shrink-0"
                  style={{
                    background: h.change >= 0 ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.07)',
                    color:      h.change >= 0 ? '#059669' : '#dc2626',
                  }}>
                  {h.change >= 0
                    ? <TrendingUp className="w-2.5 h-2.5" strokeWidth={2.5} />
                    : <TrendingDown className="w-2.5 h-2.5" strokeWidth={2.5} />}
                  {h.change >= 0 ? '+' : ''}{h.change}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TOP VIDEOS LIST
// ─────────────────────────────────────────────────────────────────
export function TopVideosList({ videos }: { videos: VideoItem[] }) {
  return (
    <div className="relative rounded-2xl overflow-hidden"
      style={{
        background: TOKENS.cardSoft,
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)'
      }}>
      <GridBg theme="light" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${TOKENS.divider}` }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#111' }}>
              <Award className="w-4 h-4 text-white" strokeWidth={2.4} />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-tight" style={{ color: TOKENS.text }}>Top Videos</h3>
              <p className="text-[11px]" style={{ color: TOKENS.textMuted }}>Performa tertinggi dalam periode terpilih</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="h-9 rounded-lg text-xs font-bold"
            style={{ background: '#fff', border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.text }}>
            Lihat Semua
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" strokeWidth={2.5} />
          </Button>
        </div>

        {/* List */}
        <div>
          {videos.map((v, i) => {
            const cat = CAT_META[v.category];
            const accColor = ACCOUNT_TINTS[v.accountType];
            return (
              <div key={v.rank}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-black/[0.02] cursor-pointer"
                style={{ borderBottom: i < videos.length - 1 ? `1px solid ${TOKENS.divider}` : 'none' }}>
                {/* Rank */}
                <span className="text-xl font-black w-7 text-center flex-shrink-0 tracking-tight"
                  style={{ color: i < 3 ? TOKENS.text : TOKENS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                  {v.rank}
                </span>

                {/* Mini thumbnail */}
                <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 relative"
                  style={{ background: `linear-gradient(135deg, ${cat.grad[0]}, ${cat.grad[1]})` }}>
                  <cat.Ico className="w-4 h-4 text-white" strokeWidth={2} />
                  <span className="absolute -bottom-1 -right-1 px-1 py-0 rounded text-[8px] font-black text-white"
                    style={{ background: 'rgba(0,0,0,0.7)' }}>{v.duration}</span>
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="font-black text-xs leading-tight line-clamp-1 mb-1" style={{ color: TOKENS.text }}>
                    {v.title}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 text-white font-black"
                      style={{ background: accColor, fontSize: 7 }}>
                      {initialsFrom(v.account)}
                    </span>
                    <span className="text-[10.5px] font-bold truncate" style={{ color: TOKENS.textMuted }}>
                      @{v.account}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <p className="font-black text-xs" style={{ color: TOKENS.text }}>{formatNum(v.views)}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: TOKENS.textMuted }}>views</p>
                </div>
                <div className="text-right flex-shrink-0 hidden md:block w-14">
                  <p className="font-black text-xs" style={{ color: v.engagement >= 12 ? '#059669' : TOKENS.text }}>
                    {v.engagement}%
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: TOKENS.textMuted }}>eng.</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
