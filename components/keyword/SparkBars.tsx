import React from 'react';

interface SparkBarsProps {
  data: number[];
  height?: number;
}

export function SparkBars({ data, height = 32 }: SparkBarsProps) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((v, i) => {
        const isLatest = i === data.length - 1;
        const pct = Math.max(8, (v / max) * 100);
        return (
          <div
            key={i}
            className={`flex-1 rounded-sm transition-all duration-300 ${
              isLatest
                ? 'bg-sky-500 dark:bg-sky-400'
                : 'bg-stone-200 dark:bg-neutral-700'
            }`}
            style={{ height: `${pct}%`, minHeight: 3 }}
            title={`Freq: ${v}%`}
          />
        );
      })}
    </div>
  );
}
