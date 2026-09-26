import React, { useMemo } from 'react';
import { X, GitCompareArrows } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VideoType, CATEGORY_META, formatNum } from '@/lib/video-library/mock-data';

const COMPARE_COLORS = ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6'];

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
    const days = selected[0]?.history?.map((d: any) => d.day) ?? [];
    return days.map((day: any, i: number) => {
      const row: Record<string, any> = { day };
      selected.forEach(v => {
        if (v.history && v.history[i]) {
          row[v.account + '#' + v.id] = v.history[i].views;
        }
      });
      return row;
    });
  }, [selected]);

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
      />
      <div
        className="fixed inset-x-4 sm:inset-x-8 md:inset-x-16 top-8 bottom-8 z-50 rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200/80 dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-900/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-sm">
              <GitCompareArrows className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-white">
                Komparasi Performa Video
              </h3>
              <p className="text-xs text-stone-500 dark:text-neutral-400">
                Membandingkan performa {selected.length} video secara langsung
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-neutral-800 border border-stone-200 dark:border-neutral-700 transition-colors"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Multi-line Comparison Chart */}
          <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white">Pertumbuhan Views Harian</h4>
                <p className="text-xs text-stone-500 dark:text-neutral-400">Tren kumulatif 14 hari pertama pasca posting</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {selected.map((v: any, i: number) => (
                  <div key={v.id} className="flex items-center gap-1.5 text-xs font-semibold">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: COMPARE_COLORS[i % COMPARE_COLORS.length] }}
                    />
                    <span className="text-stone-700 dark:text-neutral-300">@{v.account}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={merged} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tickFormatter={formatNum}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      fontSize: 12,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                    formatter={(v) => formatNum(Number(v))}
                  />
                  {selected.map((v: any, i: number) => (
                    <Line
                      key={v.id}
                      type="monotone"
                      dataKey={v.account + '#' + v.id}
                      stroke={COMPARE_COLORS[i % COMPARE_COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2, fill: COMPARE_COLORS[i % COMPARE_COLORS.length] }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Per-video Stats Cards Matrix */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(240px, 1fr))` }}>
            {selected.map((v: any, i: number) => {
              const cat = CATEGORY_META[v.category as keyof typeof CATEGORY_META] ?? CATEGORY_META.tutorial;
              const color = COMPARE_COLORS[i % COMPARE_COLORS.length];
              return (
                <div
                  key={v.id}
                  className="rounded-xl overflow-hidden bg-white dark:bg-neutral-800/80 border border-stone-200/80 dark:border-neutral-700 shadow-sm"
                >
                  <div className="h-1" style={{ background: color }} />
                  <div className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, ${cat.grad[0]}, ${cat.grad[1]})` }}
                        >
                          <cat.icon className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                            @{v.account}
                          </p>
                          <p className="text-[10px] text-stone-400 dark:text-neutral-500 font-medium">{v.publishedAt}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemove(v)}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-neutral-700 transition-colors"
                      >
                        <X className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>
                    </div>

                    <p className="font-bold text-xs leading-snug line-clamp-2 text-stone-800 dark:text-neutral-200 min-h-[32px]">
                      {v.title}
                    </p>

                    {/* Metric matrix */}
                    <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-neutral-700">
                      {[
                        { label: 'Views',      value: formatNum(v.views) },
                        { label: 'Likes',      value: formatNum(v.likes) },
                        { label: 'Comments',   value: formatNum(v.comments) },
                        { label: 'Shares',     value: formatNum(v.shares) },
                        { label: 'Engagement', value: `${v.engagement}%`, highlight: true },
                      ].map((m, mi) => (
                        <div key={mi} className="flex items-center justify-between text-xs">
                          <span className="text-[11px] font-medium text-stone-500 dark:text-neutral-400">
                            {m.label}
                          </span>
                          <span
                            className={`font-mono font-bold ${
                              m.highlight ? 'text-sky-600 dark:text-sky-400' : 'text-stone-900 dark:text-white'
                            }`}
                          >
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
