"use client";

import { Calendar, Award, Clock } from "lucide-react";
import { DAYS, TIME_SLOTS } from "@/lib/analytics/meta";
import type { ScheduleMatrix, TopSlot } from "@/lib/analytics/types";
import { formatNum, formatPct } from "@/lib/analytics/formatters";

type OptimalScheduleWindowProps = {
  heatmap: ScheduleMatrix;
  topSlots: TopSlot[];
};

export function OptimalScheduleWindow({ heatmap, topSlots }: OptimalScheduleWindowProps) {
  const flat = (heatmap || []).flat();
  const max = Math.max(...(flat.length ? flat : [1]));
  const min = Math.min(...(flat.length ? flat : [0]));

  const getCellBg = (val: number) => {
    const ratio = max === min ? 0 : (val - min) / (max - min);
    if (ratio >= 0.85) return "bg-emerald-600 text-white font-bold";
    if (ratio >= 0.65) return "bg-emerald-500/80 text-white font-semibold";
    if (ratio >= 0.45) return "bg-emerald-500/40 text-emerald-950 dark:text-emerald-100 font-medium";
    if (ratio >= 0.25) return "bg-emerald-500/20 text-stone-700 dark:text-neutral-300";
    if (ratio >= 0.1) return "bg-stone-100 text-stone-500 dark:bg-neutral-800 dark:text-neutral-400";
    return "bg-stone-50 text-stone-300 dark:bg-neutral-900 dark:text-neutral-600";
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-stone-200/80 dark:border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-sm">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-tight">
              Optimal Posting Schedule
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-neutral-400">
              High-probability engagement windows by hour and day
            </p>
          </div>
        </div>

        {/* Heat Legend */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-stone-400">
          <span>Low</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-stone-100 dark:bg-neutral-800" />
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/30" />
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/70" />
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
          </div>
          <span>Peak</span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Top 3 High-Confidence Recommendation Pills */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-neutral-500 block mb-2.5">
            Top 3 Prime Windows
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {topSlots.slice(0, 3).map((slot, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-stone-200/80 dark:border-neutral-800 bg-stone-50/60 dark:bg-neutral-800/50 flex flex-col justify-between gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-[10px] font-bold flex items-center justify-center">
                      #{i + 1}
                    </span>
                    <span className="text-xs font-black text-stone-900 dark:text-white">
                      {slot.dayLabel}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-800/40">
                    {slot.expectedEng}% Eng.
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-neutral-400 pt-1 border-t border-stone-200/40 dark:border-neutral-700/40">
                  <span>{slot.timeLabel}</span>
                  <span className="font-mono text-[10px]">
                    Est. {formatNum(slot.expectedViews)} views
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day × 6-Slot Compact Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse min-w-[320px]">
            <thead>
              <tr>
                <th className="w-10 text-left py-1 text-[10px] font-bold text-stone-400">Day</th>
                {TIME_SLOTS.map((slot: any) => (
                  <th key={slot.range} className="py-1 text-[10px] font-medium text-stone-400">
                    {slot.range}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day: any, di: number) => (
                <tr key={day}>
                  <td className="text-left py-1 text-[11px] font-bold text-stone-700 dark:text-neutral-300">
                    {typeof day === "string" ? day.substring(0, 3) : day}
                  </td>
                  {TIME_SLOTS.map((_: any, si: number) => {
                    const val = heatmap?.[di]?.[si] ?? 0;
                    return (
                      <td key={si} className="p-0.5">
                        <div
                          className={`h-7 rounded-md flex items-center justify-center text-[10px] font-mono transition-transform hover:scale-105 ${getCellBg(
                            val
                          )}`}
                          title={`${day} ${TIME_SLOTS[si].range}: ${val.toFixed(2)}%`}
                        >
                          {val > 0 ? `${val.toFixed(1)}%` : "-"}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
