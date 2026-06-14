import React, { useMemo } from 'react';
import { X, GitCompareArrows } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TOKENS } from '@/lib/design-tokens';
import { GridBg } from '@/components/layout/GridBg';
import { VideoType, CATEGORY_META, formatNum } from '@/lib/video-library/mock-data';

const COMPARE_COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#ec4899'];

interface CompareDrawerProps {
  videos: VideoType[];
  open: boolean;
  onClose: () => void;
  onRemove: (v: VideoType) => void;
}

export function CompareDrawer({
  videos: selected,
  open,
  onClose,
  onRemove,
}: CompareDrawerProps) {
  if (!open) return null;

  // Build merged chart data
  const merged = useMemo(() => {
    const days = selected[0]?.history.map((d: any) => d.day) ?? [];
    return days.map((day: any, i: number) => {
      const row: Record<string, any> = { day };
      selected.forEach(v => { row[v.account + '#' + v.id] = v.history[i].views; });
      return row;
    });
  }, [selected]);

  return (
    <>
      <div onClick={onClose}
        className="fixed inset-0 z-40 transition-opacity"
        style={{ background: 'rgba(17,17,17,0.55)', backdropFilter: 'blur(6px)' }} />
      <div className="fixed inset-x-4 sm:inset-x-12 top-12 bottom-12 z-50 rounded-3xl overflow-hidden flex flex-col"
        style={{ background: TOKENS.bg, border: `1px solid ${TOKENS.divider}`, boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>
        <GridBg theme="light" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-6 flex-shrink-0"
          style={{ borderBottom: `1px solid ${TOKENS.divider}`, background: TOKENS.cardSoft, backdropFilter: 'blur(20px)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: '#111', boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>
              <GitCompareArrows className="w-5 h-5 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="font-black text-base tracking-tight" style={{ color: TOKENS.text }}>
                Compare Engagement
              </h3>
              <p className="text-xs" style={{ color: TOKENS.textMuted }}>
                Membandingkan {selected.length} video secara berdampingan
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-black/5"
            style={{ color: TOKENS.textMuted, border: `1px solid ${TOKENS.inputBorder}` }}>
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="relative z-10 flex-1 overflow-auto p-6 space-y-5">
          {/* Chart */}
          <div className="relative rounded-2xl overflow-hidden p-6"
            style={{ background: TOKENS.charcoal, border: '1px solid rgba(255,255,255,0.1)' }}>
            <GridBg theme="dark" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                  <h4 className="font-black text-base text-white tracking-tight">Views Over Time</h4>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>14 hari pertama sejak publish</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {selected.map((v: any, i: number) => (
                    <div key={v.id} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full"
                        style={{ background: COMPARE_COLORS[i], boxShadow: `0 0 8px ${COMPARE_COLORS[i]}` }} />
                      <span className="text-xs font-bold text-white">@{v.account}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ height: 340 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={merged} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false}
                      tick={{ fontSize: 11, fontWeight: 700, fill: 'rgba(255,255,255,0.4)' }} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tickFormatter={formatNum} axisLine={false} tickLine={false}
                      tick={{ fontSize: 11, fontWeight: 700, fill: 'rgba(255,255,255,0.4)' }} />
                    <Tooltip
                      cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeDasharray: '3 3' }}
                      contentStyle={{
                        background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 12, fontWeight: 700, color: '#111',
                      }}
                      formatter={(v) => formatNum(Number(v))}
                    />
                    {selected.map((v: any, i: number) => (
                      <Line key={v.id} type="monotone"
                        dataKey={v.account + '#' + v.id}
                        stroke={COMPARE_COLORS[i]} strokeWidth={2.2}
                        dot={false}
                        activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2, fill: COMPARE_COLORS[i] }} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Per-video stats row */}
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${selected.length}, minmax(0, 1fr))` }}>
            {selected.map((v: any, i: number) => {
              const cat = CATEGORY_META[v.category as keyof typeof CATEGORY_META] ?? CATEGORY_META.tutorial;
              return (
                <div key={v.id} className="relative rounded-2xl overflow-hidden"
                  style={{ background: TOKENS.card, border: `1px solid ${TOKENS.cardBorder}`,
                           boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  {/* color stripe */}
                  <div className="h-1" style={{ background: COMPARE_COLORS[i] }} />
                  <div className="p-4">
                    {/* header */}
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, ${cat.grad[0]}, ${cat.grad[1]})` }}>
                          <cat.icon className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-wider truncate" style={{ color: TOKENS.textMuted }}>
                            @{v.account}
                          </p>
                          <p className="text-[10px]" style={{ color: TOKENS.textMuted }}>{v.publishedAt}</p>
                        </div>
                      </div>
                      <button onClick={() => onRemove(v)}
                        className="w-6 h-6 rounded-md flex items-center justify-center transition-all hover:bg-black/5 flex-shrink-0"
                        style={{ color: TOKENS.textMuted, border: `1px solid ${TOKENS.inputBorder}` }}>
                        <X className="w-3 h-3" strokeWidth={2.5} />
                      </button>
                    </div>

                    <p className="font-black text-xs leading-snug mb-3 line-clamp-2" style={{ color: TOKENS.text, minHeight: 32 }}>
                      {v.title}
                    </p>

                    {/* metric matrix */}
                    <div className="space-y-1.5">
                      {[
                        { label: 'Views',      value: formatNum(v.views) },
                        { label: 'Likes',      value: formatNum(v.likes) },
                        { label: 'Comments',   value: formatNum(v.comments) },
                        { label: 'Shares',     value: formatNum(v.shares) },
                        { label: 'Engagement', value: `${v.engagement}%`, highlight: true },
                      ].map((m, mi) => (
                        <div key={mi} className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: TOKENS.textMuted }}>
                            {m.label}
                          </span>
                          <span className="font-black text-xs"
                            style={{ color: m.highlight ? COMPARE_COLORS[i] : TOKENS.text }}>
                            {m.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
