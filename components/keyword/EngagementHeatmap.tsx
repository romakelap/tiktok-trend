import React from 'react';
import { Grid } from 'lucide-react';
import { KeywordItem } from '@/lib/keyword/mock-data';

interface EngagementHeatmapProps {
  keywords: KeywordItem[];
}

export function EngagementHeatmap({ keywords }: EngagementHeatmapProps) {
  const top20 = keywords.slice(0, 20);
  const maxEng = Math.max(...top20.map(k => k.engagement), 1);
  const minEng = Math.min(...top20.map(k => k.engagement), 0);

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-stone-100 dark:bg-neutral-800 text-stone-700 dark:text-neutral-300">
              <Grid className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-black text-xs text-stone-900 dark:text-white">
                Engagement Intensity
              </h4>
              <p className="text-[10px] text-stone-400 dark:text-neutral-500">
                Heatmap intensitas 20 keyword
              </p>
            </div>
          </div>
        </div>

        {/* 5x4 Heatmap Grid */}
        <div className="grid grid-cols-5 gap-1.5 mb-4">
          {top20.map((kw) => {
            const intensity = Math.max(0.12, kw.engagement / maxEng);
            const isHigh = intensity > 0.55;

            return (
              <div
                key={kw.rank}
                title={`${kw.keyword}: ${kw.engagement}% (${kw.frequency}% usage)`}
                className="aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105"
                style={{
                  backgroundColor: `rgba(2, 132, 199, ${intensity})`,
                }}
              >
                <span
                  className={`font-mono font-bold text-[9px] leading-none ${
                    isHigh ? 'text-white' : 'text-stone-800 dark:text-stone-200'
                  }`}
                >
                  #{kw.rank}
                </span>
                <span
                  className={`font-mono text-[8px] leading-tight mt-0.5 ${
                    isHigh ? 'text-sky-100' : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {kw.engagement.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Min-Max Bar */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-stone-400 dark:text-neutral-500">
          <span>Low ({minEng.toFixed(1)}%)</span>
          <div className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-sky-200 via-sky-400 to-sky-600 dark:from-sky-950 dark:via-sky-600 dark:to-sky-400" />
          <span>High ({maxEng.toFixed(1)}%)</span>
        </div>
      </div>
    </div>
  );
}
