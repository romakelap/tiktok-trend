"use client";

import React, { useState } from 'react';
import {
  Video, Eye, Activity, Smile, TrendingUp, Wand2, Sparkles, Download, RefreshCw, Brain, Target, Clock, X, Check, ShieldCheck, FileText, AlertCircle, ArrowUpRight, BarChart3, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Mono } from '@/components/dashboard';
import { TOKENS } from '@/lib/design-tokens';
import {
  SummaryData,
  NlpMetrics,
  accountOptions,
} from '@/lib/nlp-insight/mock-data';

export const formatNum = (n: number): string => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString('id-ID');
};

export const formatPct = (n: number, d = 0): string => `${(n * 100).toFixed(d)}%`;

export const initialsFrom = (s: string): string =>
  s.replace(/[._-]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');

// ─────────────────────────────────────────────────────────────────
// SUMMARY METRIC CARDS (Stone Minimalist Luxury)
// ─────────────────────────────────────────────────────────────────
export function SummaryMetricCards({ metrics }: { metrics: NlpMetrics }) {
  const items = [
    { 
      Ico: Video, 
      label: 'Videos Analyzed', 
      value: metrics.videosAnalyzed.toString(), 
      sub: 'Total dataset pada periode aktif', 
      delta: '+18 video',
      isText: false
    },
    { 
      Ico: Eye, 
      label: 'Views Analyzed', 
      value: formatNum(metrics.viewsAnalyzed), 
      sub: 'Akumulasi jangkauan tayangan', 
      delta: '+22%',
      isText: false
    },
    { 
      Ico: Activity, 
      label: 'Avg. Engagement', 
      value: `${metrics.avgEngagement}%`, 
      sub: 'Rata-rata interaksi audiens', 
      delta: '+0.8%',
      isText: false
    },
    { 
      Ico: Smile, 
      label: 'Sentiment Score', 
      value: formatPct(metrics.sentimentPositive), 
      sub: 'Sentimen positif dominan', 
      delta: 'Optimal',
      isText: true
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((c, i) => (
        <div 
          key={i} 
          className="relative p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-white dark:text-stone-900 shadow-sm">
              <c.Ico className="w-4.5 h-4.5" strokeWidth={2} />
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
              <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
              {c.delta}
            </div>
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
            {c.label}
          </p>
          <p className="text-2xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 mb-1">
            {c.value}
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {c.sub}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SUMMARY CARD (Stone Minimalist Luxury Executive Summary)
// ─────────────────────────────────────────────────────────────────
export function SummaryCard({ data, period, onRegenerate }: { data: SummaryData; period: string; onRegenerate: () => void }) {
  // Format body text cleanly without drop-cap glitch
  const cleanedBody = data.body.map(para => {
    let text = para.trim();
    if (text.length > 0) {
      // Capitalize first letter properly if it was lowercase
      text = text.charAt(0).toUpperCase() + text.slice(1);
    }
    return text;
  }).filter(p => p.length > 0);

  return (
    <div className="relative rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-sm overflow-hidden">
      {/* Top ambient luxury accent */}
      <div className="h-1 w-full bg-gradient-to-r from-stone-900 via-stone-700 to-stone-500 dark:from-stone-100 dark:via-stone-400 dark:to-stone-600" />

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6 pb-6 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Wand2 className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                  <Sparkles className="w-2.5 h-2.5" />
                  AI Executive Intelligence
                </span>
                <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                  {period === 'weekly' ? 'Laporan Mingguan' : period === 'monthly' ? 'Laporan Bulanan' : 'Periode Terpilih'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
                {data.periodLabel}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                {data.rangeLabel} · NLP Semantic Analysis terhadap <span className="font-semibold text-stone-800 dark:text-stone-200">{data.metrics.videosAnalyzed} konten video</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button 
              onClick={onRegenerate} 
              size="sm" 
              variant="outline"
              className="h-9 px-3.5 rounded-xl text-xs font-semibold bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-stone-600 dark:text-stone-300" strokeWidth={2.2} />
              Regenerate NLP
            </Button>
          </div>
        </div>

        {/* Highlight Key Takeaways Chips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {data.highlights.map((h, i) => (
            <div 
              key={i} 
              className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50/80 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60"
            >
              <span className="w-5 h-5 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[10px]">
                {i + 1}
              </span>
              <p className="text-xs font-medium leading-snug text-stone-800 dark:text-stone-200">
                {h}
              </p>
            </div>
          ))}
        </div>

        {/* Executive Narrative Body */}
        <div className="space-y-3.5 max-w-4xl">
          {cleanedBody.map((para, i) => (
            <p key={i} className="text-sm sm:text-[15px] leading-relaxed text-stone-700 dark:text-stone-300 font-normal">
              {para}
            </p>
          ))}
        </div>

        {/* Technical Telemetry Metadata Footer */}
        <div className="flex flex-wrap items-center gap-4 mt-8 pt-5 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-stone-400" strokeWidth={2} />
            <span className="font-medium">NLP Model:</span>
            <span className="font-bold text-stone-800 dark:text-stone-200">{data.model || 'v2.0'}</span>
          </div>
          <span className="text-stone-300 dark:text-stone-700">·</span>
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-stone-400" strokeWidth={2} />
            <span className="font-medium">Confidence:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatPct(data.confidence || 0.91)}</span>
          </div>
          <span className="text-stone-300 dark:text-stone-700">·</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-stone-400" strokeWidth={2} />
            <span className="font-medium">Dianalisis:</span>
            <span className="font-medium text-stone-700 dark:text-stone-300">{data.generatedAt || 'Baru saja'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// GENERATE SUMMARY DIALOG
// ─────────────────────────────────────────────────────────────────
interface GenerateSummaryDialogProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (opts: { period: string; scope: string; accounts: string[] }) => void;
}

export function GenerateSummaryDialog({ open, onClose, onGenerate }: GenerateSummaryDialogProps) {
  const [period, setPeriod]   = useState<'weekly' | 'monthly' | 'custom'>('weekly');
  const [scope, setScope]     = useState<'all' | 'own' | 'select'>('all');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  if (!open) return null;

  const toggleAccount = (u: string) => {
    setSelectedAccounts(prev => prev.includes(u) ? prev.filter(x => x !== u) : [...prev, u]);
  };

  return (
    <>
      <div 
        onClick={onClose}
        className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-sm transition-opacity" 
      />
      <div 
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg max-h-[90vh] rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center">
              <Wand2 className="w-4.5 h-4.5" strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">Generate Summary</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">NLP analysis pada data video & hashtag</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-2">
              Pilih Rentang Periode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPeriod('weekly')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                  period === 'weekly' 
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100' 
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                }`}
              >
                7 Hari Terakhir
              </button>
              <button
                type="button"
                onClick={() => setPeriod('monthly')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                  period === 'monthly' 
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100' 
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                }`}
              >
                30 Hari Terakhir
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl text-xs">
            Batal
          </Button>
          <Button 
            size="sm" 
            onClick={() => {
              onGenerate({ period, scope, accounts: selectedAccounts });
              onClose();
            }} 
            className="rounded-xl text-xs bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold"
          >
            Mulai Generate
          </Button>
        </div>
      </div>
    </>
  );
}
