import React from 'react';
import {
  ArrowUpRight, Smile, TrendingUp
} from 'lucide-react';
import { GridBg } from '@/components/layout/GridBg';
import { Mono } from '@/components/dashboard';
import { TOKENS } from '@/lib/design-tokens';
import {
  InsightItem,
  NlpMetrics,
  INSIGHT_META,
  SENTIMENT_META
} from '@/lib/nlp-insight/mock-data';
import { formatPct } from './WeeklySummary';

// ─────────────────────────────────────────────────────────────────
// INSIGHT CARDS
// ─────────────────────────────────────────────────────────────────
export function InsightCards({ insights }: { insights: InsightItem[] }) {
  const priorityMeta = {
    high:   { label: 'High',   color: '#b91c1c', tint: 'rgba(185,28,28,0.08)'  },
    medium: { label: 'Medium', color: '#b45309', tint: 'rgba(180,83,9,0.08)'   },
    low:    { label: 'Low',    color: '#737373', tint: 'rgba(115,115,115,0.08)' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {insights.map(ins => {
        const meta = INSIGHT_META[ins.category];
        if (!meta) return null;
        const Ico  = meta.Ico;
        const pm   = priorityMeta[ins.priority];
        return (
          <div key={ins.id} className="relative p-5 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group"
            style={{
              background: TOKENS.card,
              border: `1px solid ${TOKENS.cardBorder}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 2px 12px rgba(0,0,0,0.04)'
            }}>
            {/* Top accent stripe */}
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: meta.solid }} />
            <GridBg theme="light" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: meta.solid, boxShadow: `0 4px 12px ${meta.solid}33` }}>
                  <Ico className="w-4.5 h-4.5 text-white" strokeWidth={2.2} />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider"
                    style={{ background: pm.tint, color: pm.color, border: `1px solid ${pm.color}33` }}>
                    {pm.label}
                  </span>
                </div>
              </div>

              {/* Title */}
              <p className="font-black text-base leading-tight tracking-tight mb-2" style={{ color: TOKENS.text }}>
                {ins.title}
              </p>

              {/* Body */}
              <p className="text-[12px] leading-relaxed mb-4" style={{ color: TOKENS.textSubtle }}>
                {ins.body}
              </p>

              {/* Metric footer */}
              <div className="flex items-end justify-between pt-3" style={{ borderTop: `1px solid ${TOKENS.divider}` }}>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: TOKENS.textMuted }}>
                    {ins.metricLabel}
                  </p>
                  <p className="text-2xl font-black leading-none tracking-tight" style={{ color: meta.solid }}>
                    {ins.metric}
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ color: TOKENS.textMuted }} strokeWidth={2.4} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SENTIMENT BREAKDOWN
// ─────────────────────────────────────────────────────────────────
export function SentimentBreakdown({ metrics }: { metrics: NlpMetrics }) {
  const sentiments = [
    { key: 'positive' as const, value: metrics.sentimentPositive },
    { key: 'neutral' as const,  value: metrics.sentimentNeutral  },
    { key: 'negative' as const, value: metrics.sentimentNegative },
  ];

  return (
    <div className="relative rounded-2xl overflow-hidden p-6"
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
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: SENTIMENT_META.positive.solid }}>
              <Smile className="w-4 h-4 text-white" strokeWidth={2.4} />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-tight" style={{ color: TOKENS.text }}>Sentiment Audiens</h3>
              <p className="text-[11px]" style={{ color: TOKENS.textMuted }}>Berdasarkan analisis komentar video</p>
            </div>
          </div>
          <Mono size="xs" dim className="font-bold">IndoBERT v2.1</Mono>
        </div>

        {/* Big number */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color: TOKENS.textMuted }}>Sentiment Score</p>
            <p className="text-4xl font-black leading-none tracking-tight" style={{ color: SENTIMENT_META.positive.solid }}>
              {formatPct(metrics.sentimentPositive)}
            </p>
            <p className="text-xs mt-1.5" style={{ color: TOKENS.textSubtle }}>
              <span className="font-black" style={{ color: SENTIMENT_META.positive.solid }}>Positif</span> · audiens menunjukkan respons antusias
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg font-black text-xs"
              style={{ background: 'rgba(5,150,105,0.08)', color: '#059669', border: '1px solid rgba(5,150,105,0.2)' }}>
              <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
              +6.2% vs minggu lalu
            </span>
          </div>
        </div>

        {/* Stacked bar */}
        <div className="mb-3">
          <div className="h-4 rounded-lg overflow-hidden flex" style={{ border: `1px solid ${TOKENS.divider}` }}>
            {sentiments.map((s) => {
              const meta = SENTIMENT_META[s.key];
              const pct = s.value * 100;
              if (pct < 0.5) return null;
              return (
                <div key={s.key} className="h-full transition-all duration-700 relative group/seg"
                  style={{ width: `${pct}%`, background: meta.solid }}>
                  {pct > 8 && (
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
                      {formatPct(s.value, 0)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdown rows */}
        <div className="space-y-2">
          {sentiments.map((s) => {
            const meta = SENTIMENT_META[s.key];
            const Ico = meta.Ico;
            return (
              <div key={s.key} className="flex items-center gap-3">
                <div className="flex items-center gap-2 min-w-[110px]">
                  <span className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: meta.tint, border: `1px solid ${meta.border}` }}>
                    <Ico className="w-3 h-3" style={{ color: meta.solid }} strokeWidth={2.5} />
                  </span>
                  <span className="text-xs font-black" style={{ color: meta.solid }}>{meta.label}</span>
                </div>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: TOKENS.barBg }}>
                  <div className="h-full rounded-full" style={{ width: `${s.value * 100}%`, background: meta.solid }} />
                </div>
                <span className="font-black text-xs w-12 text-right flex-shrink-0" style={{ color: TOKENS.text }}>
                  {formatPct(s.value, 1)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Sample comments preview */}
        <div className="mt-5 pt-4 space-y-2" style={{ borderTop: `1px solid ${TOKENS.divider}` }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: TOKENS.textMuted }}>
            Komentar Representatif
          </p>
          {[
            { sentiment: 'positive' as const, text: 'Tutorialnya jelas banget, langsung praktek di rumah! 🌱' },
            { sentiment: 'positive' as const, text: 'Akhirnya nemu channel yang ngebahas rumput jepang detail.' },
            { sentiment: 'neutral' as const,  text: 'Apa bisa kirim ke luar Bali? Stoknya masih ada?' },
          ].map((c, i) => {
            const meta = SENTIMENT_META[c.sentiment];
            const Ico = meta.Ico;
            return (
              <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg"
                style={{ background: meta.tint, border: `1px solid ${meta.border}` }}>
                <Ico className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: meta.solid }} strokeWidth={2.4} />
                <p className="text-[11px] leading-snug italic" style={{ color: TOKENS.textProse }}>"{c.text}"</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
