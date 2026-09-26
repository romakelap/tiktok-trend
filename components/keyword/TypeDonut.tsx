import React from 'react';
import { PieChart as PieIcon } from 'lucide-react';
import { KeywordItem } from '@/lib/keyword/mock-data';

interface TypeDonutProps {
  keywords: KeywordItem[];
}

export function TypeDonut({ keywords }: TypeDonutProps) {
  const typeMeta = [
    { key: 'hook', label: 'Hook (Pemicu)', color: '#0284c7', bg: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300' },
    { key: 'brand', label: 'Brand (Entitas)', color: '#8b5cf6', bg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300' },
    { key: 'action', label: 'Action (Aksi)', color: '#10b981', bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' },
    { key: 'emotion', label: 'Emotion (Emosi)', color: '#f59e0b', bg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' },
  ];

  const counts = typeMeta.map(t => keywords.filter(k => k.type === t.key).length);
  const total = counts.reduce((a, b) => a + b, 0) || 1;

  const R = 62, r = 38, cx = 80, cy = 80;
  let angle = -Math.PI / 2;

  const slices = counts.map((c, i) => {
    const sweep = (c / total) * Math.PI * 2;
    const x1 = cx + R * Math.cos(angle);
    const y1 = cy + R * Math.sin(angle);
    const x2 = cx + R * Math.cos(angle + sweep);
    const y2 = cy + R * Math.sin(angle + sweep);
    const xi1 = cx + r * Math.cos(angle);
    const yi1 = cy + r * Math.sin(angle);
    const xi2 = cx + r * Math.cos(angle + sweep);
    const yi2 = cy + r * Math.sin(angle + sweep);
    const large = sweep > Math.PI ? 1 : 0;
    const path = c === 0 ? '' : `M${xi1} ${yi1} L${x1} ${y1} A${R} ${R} 0 ${large} 1 ${x2} ${y2} L${xi2} ${yi2} A${r} ${r} 0 ${large} 0 ${xi1} ${yi1}Z`;
    angle += sweep;
    return {
      path,
      fill: typeMeta[i].color,
      label: typeMeta[i].label,
      bg: typeMeta[i].bg,
      count: c,
      pct: Math.round((c / total) * 100),
    };
  });

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-stone-100 dark:bg-neutral-800 text-stone-700 dark:text-neutral-300">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-black text-xs text-stone-900 dark:text-white">
                Keyword Type Mix
              </h4>
              <p className="text-[10px] text-stone-400 dark:text-neutral-500">
                Komposisi klasifikasi kata kunci
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <svg viewBox="0 0 160 160" className="w-28 flex-shrink-0">
            {slices.map((s, i) => (
              s.path ? (
                <path
                  key={i}
                  d={s.path}
                  fill={s.fill}
                  className="transition-all duration-300 hover:opacity-85"
                />
              ) : null
            ))}
            <text
              x={cx}
              y={cy - 2}
              textAnchor="middle"
              className="fill-stone-900 dark:fill-white font-mono font-black text-lg"
            >
              {total}
            </text>
            <text
              x={cx}
              y={cy + 12}
              textAnchor="middle"
              className="fill-stone-400 dark:fill-neutral-500 font-mono text-[8.5px]"
            >
              keywords
            </text>
          </svg>

          <div className="flex-1 space-y-2">
            {slices.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: s.fill }}
                  />
                  <span className="text-[11px] font-medium text-stone-600 dark:text-neutral-400 truncate">
                    {s.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="font-bold text-stone-900 dark:text-white">{s.count}</span>
                  <span className="text-stone-400 text-[10px]">({s.pct}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
