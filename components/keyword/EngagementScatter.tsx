import React, { useState } from 'react';
import { ScatterChart as ScatterIcon, Info } from 'lucide-react';
import { KeywordItem, formatNum } from '@/lib/keyword/mock-data';

interface EngagementScatterProps {
  keywords: KeywordItem[];
}

export function EngagementScatter({ keywords }: EngagementScatterProps) {
  const [hoveredKw, setHoveredKw] = useState<KeywordItem | null>(null);
  const top20 = keywords.slice(0, 20);
  const W = 420, H = 240, PAD = 42;
  const maxViews = Math.max(...top20.map(k => k.avgViews), 1);
  const maxEng = Math.max(...top20.map(k => k.engagement), 1);
  const minEng = Math.max(0, Math.min(...top20.map(k => k.engagement)) - 1);

  const xScale = (v: number) => PAD + ((v / maxViews) * (W - PAD * 2));
  const yScale = (e: number) => H - PAD - (((e - minEng) / (maxEng - minEng || 1)) * (H - PAD * 2));

  // Grid lines
  const xTicks = [0.25, 0.5, 0.75, 1].map(f => maxViews * f);
  const yTicks = [0.2, 0.4, 0.6, 0.8, 1].map(f => minEng + f * (maxEng - minEng));

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
              <ScatterIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-stone-900 dark:text-white">
                Engagement Rate vs Avg Views
              </h3>
              <p className="text-[11px] text-stone-400 dark:text-neutral-500">
                Korelasi sebaran volume penayangan terhadap rasio interaksi
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-stone-400 dark:text-neutral-500">
            Top 20 Keywords
          </span>
        </div>

        <div className="relative w-full">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible">
            {/* Horizontal Grid */}
            {yTicks.map((t, i) => (
              <g key={i}>
                <line
                  x1={PAD}
                  y1={yScale(t)}
                  x2={W - PAD + 10}
                  y2={yScale(t)}
                  stroke="currentColor"
                  className="text-stone-200 dark:text-neutral-800"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <text
                  x={PAD - 6}
                  y={yScale(t) + 3}
                  textAnchor="end"
                  className="fill-stone-400 dark:fill-neutral-500 font-mono text-[9px]"
                >
                  {t.toFixed(1)}%
                </text>
              </g>
            ))}

            {/* Vertical Grid */}
            {xTicks.map((t, i) => (
              <g key={i}>
                <line
                  x1={xScale(t)}
                  y1={PAD - 10}
                  x2={xScale(t)}
                  y2={H - PAD}
                  stroke="currentColor"
                  className="text-stone-200 dark:text-neutral-800"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <text
                  x={xScale(t)}
                  y={H - PAD + 14}
                  textAnchor="middle"
                  className="fill-stone-400 dark:fill-neutral-500 font-mono text-[9px]"
                >
                  {formatNum(t)}
                </text>
              </g>
            ))}

            {/* Axes */}
            <line
              x1={PAD}
              y1={PAD - 10}
              x2={PAD}
              y2={H - PAD}
              stroke="currentColor"
              className="text-stone-300 dark:text-neutral-700"
              strokeWidth={1.5}
            />
            <line
              x1={PAD}
              y1={H - PAD}
              x2={W - PAD + 10}
              y2={H - PAD}
              stroke="currentColor"
              className="text-stone-300 dark:text-neutral-700"
              strokeWidth={1.5}
            />

            {/* Points */}
            {top20.map((kw, i) => {
              const cx = xScale(kw.avgViews);
              const cy = yScale(kw.engagement);
              const r = 4 + (kw.frequency / 22);
              const isTop = i < 3;
              const isHovered = hoveredKw?.rank === kw.rank;

              return (
                <g
                  key={kw.rank}
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredKw(kw)}
                  onMouseLeave={() => setHoveredKw(null)}
                >
                  {isHovered && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r + 6}
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth={1.5}
                      className="animate-ping opacity-75"
                    />
                  )}

                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? r + 2 : r}
                    fill={isTop ? '#0284c7' : isHovered ? '#38bdf8' : '#64748b'}
                    stroke="#ffffff"
                    strokeWidth={1.5}
                    style={{
                      filter: isTop || isHovered ? 'drop-shadow(0 2px 4px rgba(2, 132, 199, 0.4))' : 'none',
                    }}
                  />

                  {isTop && (
                    <text
                      x={cx + r + 4}
                      y={cy + 3}
                      className="fill-stone-900 dark:fill-white font-bold text-[9px]"
                    >
                      #{kw.rank} {kw.keyword.slice(0, 10)}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Axis labels */}
            <text
              x={W / 2}
              y={H - 2}
              textAnchor="middle"
              className="fill-stone-400 dark:fill-neutral-500 font-mono text-[9px] font-bold"
            >
              Rata-rata Tayangan (Views) →
            </text>
            <text
              x={12}
              y={H / 2}
              textAnchor="middle"
              className="fill-stone-400 dark:fill-neutral-500 font-mono text-[9px] font-bold"
              transform={`rotate(-90, 12, ${H / 2})`}
            >
              Engagement Rate (%) →
            </text>
          </svg>
        </div>

        {/* Dynamic Tooltip / Legend Footer */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-neutral-800 text-xs flex items-center justify-between min-h-[32px]">
          {hoveredKw ? (
            <div className="flex items-center gap-3 font-mono">
              <span className="font-bold text-stone-900 dark:text-white">
                #{hoveredKw.rank} &quot;{hoveredKw.keyword}&quot;
              </span>
              <span className="text-sky-600 dark:text-sky-400">
                {formatNum(hoveredKw.avgViews)} views
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {hoveredKw.engagement}% eng
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] text-stone-400 dark:text-neutral-500">
              <Info className="w-3.5 h-3.5" />
              <span>Arahkan kursor ke titik koordinat untuk melihat statistik kata kunci</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
