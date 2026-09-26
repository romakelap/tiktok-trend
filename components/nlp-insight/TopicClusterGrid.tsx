"use client";

import React from 'react';
import {
  ArrowUpRight, Smile, TrendingUp, Sparkles, MessageSquare, Heart, ShieldCheck
} from 'lucide-react';
import {
  InsightItem,
  NlpMetrics,
  INSIGHT_META,
  SENTIMENT_META
} from '@/lib/nlp-insight/mock-data';
import { formatPct } from './WeeklySummary';

// ─────────────────────────────────────────────────────────────────
// INSIGHT CARDS (Stone Minimalist Luxury)
// ─────────────────────────────────────────────────────────────────
export function InsightCards({ insights }: { insights: InsightItem[] }) {
  const priorityMeta = {
    high:   { label: 'High Impact',   color: '#b91c1c', bg: 'bg-red-50 dark:bg-red-950/40', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800/60' },
    medium: { label: 'Medium Impact', color: '#b45309', bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800/60' },
    low:    { label: 'Standard',      color: '#525252', bg: 'bg-stone-50 dark:bg-stone-800/40', text: 'text-stone-700 dark:text-stone-300', border: 'border-stone-200 dark:border-stone-700/60' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {insights.map(ins => {
        const meta = INSIGHT_META[ins.category];
        if (!meta) return null;
        const Ico  = meta.Ico;
        const pm   = priorityMeta[ins.priority];
        return (
          <div 
            key={ins.id} 
            className="relative p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between overflow-hidden"
          >
            {/* Top subtle line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-stone-900 dark:bg-stone-100 opacity-20" />

            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-3.5">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm"
                  style={{ background: meta.solid }}
                >
                  <Ico className="w-4.5 h-4.5" strokeWidth={2.2} />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${pm.bg} ${pm.text} ${pm.border}`}>
                  {pm.label}
                </span>
              </div>

              {/* Title */}
              <h4 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 mb-2 leading-snug">
                {ins.title}
              </h4>

              {/* Body */}
              <p className="text-xs sm:text-[13px] leading-relaxed text-stone-600 dark:text-stone-400 mb-4">
                {ins.body}
              </p>
            </div>

            {/* Metric footer */}
            <div className="flex items-end justify-between pt-3.5 border-t border-stone-100 dark:border-stone-800">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-0.5">
                  {ins.metricLabel}
                </p>
                <p className="text-xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
                  {ins.metric}
                </p>
              </div>
              <div className="w-7 h-7 rounded-lg bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-stone-400 group-hover:text-stone-800 dark:group-hover:text-stone-200 transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.4} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SENTIMENT BREAKDOWN (Stone Minimalist Luxury)
// ─────────────────────────────────────────────────────────────────
export function SentimentBreakdown({ metrics }: { metrics: NlpMetrics }) {
  const sentiments = [
    { key: 'positive' as const, label: 'Positif', value: metrics.sentimentPositive, color: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400' },
    { key: 'neutral' as const,  label: 'Netral',  value: metrics.sentimentNeutral,  color: 'bg-amber-400',   text: 'text-amber-700 dark:text-amber-400' },
    { key: 'negative' as const, label: 'Negatif', value: metrics.sentimentNegative, color: 'bg-rose-500',    text: 'text-rose-700 dark:text-rose-400' },
  ];

  return (
    <div className="relative rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Smile className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">Sentiment Audiens</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">Analisis respon audiens TikTok</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
          IndoBERT v2.1
        </span>
      </div>

      {/* Main Metric Highlight */}
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
            Skor Sentimen Positif
          </p>
          <p className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
            {formatPct(metrics.sentimentPositive)}
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
          <TrendingUp className="w-3.5 h-3.5" />
          Optimal
        </div>
      </div>

      {/* Multi-segment Bar */}
      <div className="h-3 rounded-full overflow-hidden flex bg-stone-100 dark:bg-stone-800 mb-4 p-0.5 gap-0.5">
        {sentiments.map((s) => {
          const pct = s.value * 100;
          if (pct < 1) return null;
          return (
            <div 
              key={s.key} 
              className={`h-full rounded-sm ${s.color} transition-all duration-500`}
              style={{ width: `${pct}%` }}
              title={`${s.label}: ${pct.toFixed(1)}%`}
            />
          );
        })}
      </div>

      {/* Legend & Stats */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100 dark:border-stone-800 text-center">
        {sentiments.map((s) => (
          <div key={s.key} className="p-2 rounded-xl bg-stone-50/60 dark:bg-stone-800/40">
            <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400 mb-0.5">{s.label}</p>
            <p className={`text-sm font-bold ${s.text}`}>{formatPct(s.value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
