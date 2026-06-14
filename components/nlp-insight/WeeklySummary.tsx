import React, { useState } from 'react';
import {
  Video, Eye, Activity, Smile, TrendingUp, Wand2, Sparkles, Download, RefreshCw, Brain, Target, Clock, X, Calendar, CalendarDays, Check, Info, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GridBg } from '@/components/layout/GridBg';
import { Mono } from '@/components/dashboard';
import { TOKENS } from '@/lib/design-tokens';
import {
  SummaryData,
  NlpMetrics,
  accountOptions,
  ACCOUNT_TINTS
} from '@/lib/nlp-insight/mock-data';

// Formatting Helpers
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
// SUMMARY METRIC CARDS
// ─────────────────────────────────────────────────────────────────
export function SummaryMetricCards({ metrics }: { metrics: NlpMetrics }) {
  const items = [
    { Ico: Video,    label: 'Videos Analyzed',  value: metrics.videosAnalyzed.toString(),       sub: 'Dari 9 akun yang dilacak',     delta: '+18' },
    { Ico: Eye,      label: 'Views Analyzed',   value: formatNum(metrics.viewsAnalyzed),        sub: 'Akumulasi periode terpilih',   delta: '+22%' },
    { Ico: Activity, label: 'Avg. Engagement',  value: `${metrics.avgEngagement}%`,             sub: 'Across semua video & akun',    delta: '+0.8%' },
    { Ico: Smile,    label: 'Sentiment Overall',value: formatPct(metrics.sentimentPositive),    sub: 'Positif · neutral · negatif',  delta: 'Positif', isText: true },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((c, i) => (
        <div key={i} className="relative p-5 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: TOKENS.cardSoft,
            backdropFilter: 'blur(16px)',
            border: `1px solid ${TOKENS.cardBorder}`,
            boxShadow: '0 2px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
          }}>
          <GridBg theme="light" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: '#111', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}>
                <c.Ico className="w-4.5 h-4.5 text-white" strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-black"
                style={{
                  background: 'rgba(5,150,105,0.08)',
                  color: '#059669',
                  border: '1px solid rgba(5,150,105,0.18)',
                }}>
                {c.isText
                  ? <><Smile className="w-3 h-3" strokeWidth={2.5} />{c.delta}</>
                  : <><TrendingUp className="w-3 h-3" strokeWidth={2.5} />{c.delta}</>}
              </div>
            </div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: TOKENS.textMuted }}>{c.label}</p>
            <p className="text-3xl font-black mb-1 leading-none tracking-tight" style={{ color: TOKENS.text }}>{c.value}</p>
            <p className="text-xs" style={{ color: TOKENS.textMuted }}>{c.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SUMMARY CARD
// ─────────────────────────────────────────────────────────────────
export function SummaryCard({ data, period, onRegenerate }: { data: SummaryData; period: string; onRegenerate: () => void }) {
  return (
    <div className="relative rounded-2xl overflow-hidden"
      style={{
        background: TOKENS.card,
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)'
      }}>
      <GridBg theme="light" />

      {/* Side accent stripe */}
      <div className="absolute top-0 left-0 bottom-0 w-1" style={{ background: '#111' }} />

      <div className="relative z-10 p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#111', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
              <Wand2 className="w-5 h-5 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
                  style={{ background: 'rgba(91,33,182,0.08)', color: '#5b21b6', border: '1px solid rgba(91,33,182,0.2)' }}>
                  <Sparkles className="w-2.5 h-2.5 inline-block mr-1" strokeWidth={2.5} />
                  AI Generated
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: TOKENS.textMuted }}>
                  {period === 'weekly' ? 'Ringkasan Mingguan' : period === 'monthly' ? 'Ringkasan Bulanan' : 'Periode Custom'}
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight" style={{ color: TOKENS.text, lineHeight: 1.15 }}>
                {data.periodLabel}
                <span className="block text-sm font-bold mt-1" style={{ color: TOKENS.textMuted }}>
                  {data.rangeLabel} · NLP analysis terhadap {data.metrics.videosAnalyzed} video
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button onClick={onRegenerate} size="sm" variant="outline"
              className="h-9 rounded-xl text-xs font-bold"
              style={{ background: '#fff', border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.text }}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} />
              Regenerate
            </Button>
            <Button size="sm" variant="outline"
              className="h-9 w-9 p-0 rounded-xl"
              style={{ background: '#fff', border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.textMuted }}>
              <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Button>
          </div>
        </div>

        {/* Highlight strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-7">
          {data.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl"
              style={{ background: 'rgba(0,0,0,0.025)', border: `1px solid ${TOKENS.divider}` }}>
              <span className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 font-black text-white text-[10px]"
                style={{ background: '#111' }}>
                {i + 1}
              </span>
              <p className="text-[12px] font-bold leading-snug" style={{ color: TOKENS.text }}>{h}</p>
            </div>
          ))}
        </div>

        {/* Prose body */}
        <div className="max-w-3xl space-y-4">
          {data.body.map((para, i) => (
            <p key={i} className="text-[15px] leading-relaxed" style={{ color: TOKENS.textProse, letterSpacing: '-0.005em' }}>
              {i === 0 && <span className="text-2xl font-black float-left mr-2 mt-1 leading-none" style={{ color: TOKENS.text }}>
                {para.charAt(0)}
              </span>}
              {i === 0 ? para.substring(1) : para}
            </p>
          ))}
        </div>

        {/* Footer metadata */}
        <div className="flex flex-wrap items-center gap-4 mt-7 pt-5"
          style={{ borderTop: `1px solid ${TOKENS.divider}` }}>
          <div className="flex items-center gap-2">
            <Brain className="w-3.5 h-3.5" style={{ color: TOKENS.textMuted }} strokeWidth={2.4} />
            <span className="text-[11px] font-bold" style={{ color: TOKENS.textMuted }}>Model:</span>
            <Mono size="sm" className="font-black">{data.model}</Mono>
          </div>
          <span className="w-1 h-1 rounded-full" style={{ background: TOKENS.textMuted }} />
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5" style={{ color: TOKENS.textMuted }} strokeWidth={2.4} />
            <span className="text-[11px] font-bold" style={{ color: TOKENS.textMuted }}>Confidence:</span>
            <span className="text-[11px] font-black" style={{ color: '#059669' }}>{formatPct(data.confidence)}</span>
          </div>
          <span className="w-1 h-1 rounded-full" style={{ background: TOKENS.textMuted }} />
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" style={{ color: TOKENS.textMuted }} strokeWidth={2.4} />
            <span className="text-[11px] font-bold" style={{ color: TOKENS.textMuted }}>Generated:</span>
            <span className="text-[11px] font-bold" style={{ color: TOKENS.text }}>{data.generatedAt}</span>
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
      <div onClick={onClose}
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(17,17,17,0.55)', backdropFilter: 'blur(4px)' }} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: TOKENS.bgSoft,
          border: `1px solid ${TOKENS.divider}`,
          boxShadow: '0 24px 80px rgba(0,0,0,0.3)'
        }}>
        <GridBg theme="light" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-5 flex-shrink-0"
          style={{ borderBottom: `1px solid ${TOKENS.divider}`, background: TOKENS.cardSoft, backdropFilter: 'blur(20px)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: '#111', boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>
              <Wand2 className="w-5 h-5 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="font-black text-base tracking-tight" style={{ color: TOKENS.text }}>Generate Summary</h3>
              <p className="text-xs" style={{ color: TOKENS.textMuted }}>NLP analysis pada video & komentar terpilih</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-black/5"
            style={{ color: TOKENS.textMuted, border: `1px solid ${TOKENS.inputBorder}` }}>
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="relative z-10 flex-1 overflow-auto p-5 space-y-5">
          {/* Period */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider mb-2 block" style={{ color: TOKENS.textMuted }}>
              Periode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'weekly',  label: 'Mingguan', Ico: Calendar     },
                { key: 'monthly', label: 'Bulanan',  Ico: CalendarDays },
                { key: 'custom',  label: 'Custom',   Ico: Clock        },
              ].map(p => {
                const sel = period === p.key;
                return (
                  <button key={p.key} type="button" onClick={() => setPeriod(p.key as any)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all"
                    style={{
                      background: sel ? 'rgba(17,17,17,0.04)' : '#fff',
                      border: `1px solid ${sel ? '#111' : TOKENS.inputBorder}`,
                      boxShadow: sel ? '0 0 0 3px rgba(17,17,17,0.05)' : 'none',
                    }}>
                    <p.Ico className="w-5 h-5" style={{ color: sel ? TOKENS.text : TOKENS.textMuted }} strokeWidth={2.2} />
                    <span className="font-black text-xs" style={{ color: sel ? TOKENS.text : TOKENS.textMuted }}>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom date range */}
          {period === 'custom' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider mb-1.5 block" style={{ color: TOKENS.textMuted }}>Dari</label>
                <Input type="date" className="h-10 rounded-xl text-xs" style={{ background: '#fff', border: `1px solid ${TOKENS.inputBorder}` }} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider mb-1.5 block" style={{ color: TOKENS.textMuted }}>Sampai</label>
                <Input type="date" className="h-10 rounded-xl text-xs" style={{ background: '#fff', border: `1px solid ${TOKENS.inputBorder}` }} />
              </div>
            </div>
          )}

          {/* Account scope */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider mb-2 block" style={{ color: TOKENS.textMuted }}>
              Scope Akun
            </label>
            <div className="space-y-1.5 mb-2">
              {[
                { key: 'all',      label: 'Semua akun yang dilacak', desc: '9 akun · 124 video'    },
                { key: 'own',      label: 'Hanya akun saya',         desc: '1 akun · 47 video'     },
                { key: 'select',   label: 'Pilih akun spesifik',     desc: 'Custom selection'      },
              ].map(o => {
                const sel = scope === o.key;
                return (
                  <button key={o.key} type="button" onClick={() => setScope(o.key as any)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                    style={{
                      background: sel ? 'rgba(17,17,17,0.04)' : '#fff',
                      border: `1px solid ${sel ? '#111' : TOKENS.inputBorder}`,
                      boxShadow: sel ? '0 0 0 3px rgba(17,17,17,0.05)' : 'none',
                    }}>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: sel ? '#111' : 'transparent', border: `1.5px solid ${sel ? '#111' : TOKENS.inputBorder}` }}>
                      {sel && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-xs" style={{ color: TOKENS.text }}>{o.label}</p>
                      <p className="text-[10px]" style={{ color: TOKENS.textMuted }}>{o.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Account multi-select when scope === 'select' */}
            {scope === 'select' && (
              <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-auto p-2 rounded-xl"
                style={{ background: '#fff', border: `1px solid ${TOKENS.inputBorder}` }}>
                {accountOptions.map(a => {
                  const sel = selectedAccounts.includes(a.username);
                  return (
                    <button key={a.username} type="button" onClick={() => toggleAccount(a.username)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all hover:bg-black/[0.03]"
                      style={{
                        background: sel ? 'rgba(17,17,17,0.04)' : 'transparent',
                        border: `1px solid ${sel ? '#111' : 'transparent'}`,
                      }}>
                      <div className="w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0"
                        style={{ background: sel ? '#111' : 'transparent', border: `1.5px solid ${sel ? '#111' : TOKENS.inputBorder}` }}>
                        {sel && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                      </div>
                      <span className="font-bold text-[10.5px] truncate" style={{ color: TOKENS.text }}>@{a.username}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 p-3 rounded-xl"
            style={{ background: 'rgba(91,33,182,0.04)', border: '1px solid rgba(91,33,182,0.15)' }}>
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: '#5b21b6' }} strokeWidth={2.4} />
            <p className="text-[11px] leading-snug" style={{ color: '#4c1d95' }}>
              Summary akan diproses oleh <Mono size="xs" className="font-black">NLP-summarizer-v1.3.0</Mono> menggunakan kombinasi keyword extraction (KeyBERT), sentiment analysis (IndoBERT), dan abstractive summarization. Estimasi ~30 detik.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 p-4 flex items-center gap-2 flex-shrink-0"
          style={{ borderTop: `1px solid ${TOKENS.divider}`, background: TOKENS.cardSoft, backdropFilter: 'blur(20px)' }}>
          <Button onClick={onClose} variant="outline"
            className="flex-1 h-10 rounded-xl font-black"
            style={{ background: '#fff', border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.text }}>
            Batal
          </Button>
          <Button onClick={() => { onGenerate({ period, scope, accounts: selectedAccounts }); onClose(); }}
            className="flex-1 h-10 rounded-xl font-black"
            style={{ background: '#111', color: '#fff' }}>
            <Wand2 className="w-4 h-4 mr-1.5" strokeWidth={2.5} />
            Generate
          </Button>
        </div>
      </div>
    </>
  );
}
