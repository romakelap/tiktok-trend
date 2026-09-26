"use client";

import { useMemo } from "react";
import { Clock, Sparkles, TrendingUp, Calendar } from "lucide-react";
import { DAYS, TIME_SLOTS } from "@/lib/analytics/meta";
import type { ScheduleMatrix, TopSlot } from "@/lib/analytics/types";
import { formatNum } from "@/lib/analytics/formatters";
import { SCHEDULE_HEATMAP, TOP_SLOTS } from "@/lib/analytics/mock-data";

type OptimalScheduleWindowProps = {
  heatmap?: ScheduleMatrix;
  topSlots?: TopSlot[];
};

const DAY_LABELS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const DAY_SHORT = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export function OptimalScheduleWindow({ heatmap, topSlots }: OptimalScheduleWindowProps) {
  // Use fallback if empty or all zero
  const matrix = useMemo(() => {
    if (!heatmap || heatmap.length === 0) return SCHEDULE_HEATMAP;
    const flat = heatmap.flat();
    const hasData = flat.some((v) => v > 0);
    return hasData ? heatmap : SCHEDULE_HEATMAP;
  }, [heatmap]);

  const primeSlots = useMemo(() => {
    if (topSlots && topSlots.length > 0) return topSlots;
    return TOP_SLOTS;
  }, [topSlots]);

  const flat = matrix.flat();
  const max = Math.max(...(flat.length ? flat : [1]));
  const min = Math.min(...(flat.length ? flat : [0]));

  const getCellBg = (val: number) => {
    const ratio = max === min ? 0 : (val - min) / (max - min);
    if (ratio >= 0.85) return "bg-emerald-600 text-white font-black shadow-xs";
    if (ratio >= 0.65) return "bg-emerald-500/80 text-white font-bold";
    if (ratio >= 0.45) return "bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200 font-semibold";
    if (ratio >= 0.25) return "bg-stone-100 text-stone-700 dark:bg-neutral-800 dark:text-neutral-300 font-medium";
    return "bg-stone-50 text-stone-400 dark:bg-neutral-900/60 dark:text-neutral-600";
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-stone-200/80 dark:border-neutral-800 flex items-center justify-between bg-stone-50/40 dark:bg-neutral-900/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60 flex-shrink-0 shadow-xs">
            <Clock className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-tight">
              Jam Emas Posting (7x24)
            </h3>
            <p className="text-xs text-stone-500 dark:text-neutral-400">
              Matriks probabilitas engagement tertinggi per hari dan jam
            </p>
          </div>
        </div>

        {/* Heat Legend */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold text-stone-400">
          <span>Rendah</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-stone-100 dark:bg-neutral-800" />
            <span className="w-3 h-3 rounded-sm bg-emerald-100 dark:bg-emerald-950/60" />
            <span className="w-3 h-3 rounded-sm bg-emerald-500/80" />
            <span className="w-3 h-3 rounded-sm bg-emerald-600" />
          </div>
          <span>Puncak</span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-5 flex-1 justify-between">
        {/* Top 3 High-Confidence Prime Windows */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-neutral-500 block mb-2.5">
            Top 3 Jadwal Paling Optimal
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {primeSlots.slice(0, 3).map((slot, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-stone-200/80 dark:border-neutral-800 bg-stone-50/60 dark:bg-neutral-800/50 flex flex-col justify-between gap-2 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-[10px] font-black flex items-center justify-center">
                      #{i + 1}
                    </span>
                    <span className="text-xs font-black text-stone-900 dark:text-white">
                      {slot.dayLabel || slot.day}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
                    {slot.expectedEng}% Eng
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-neutral-400 pt-1.5 border-t border-stone-200/60 dark:border-neutral-700/60">
                  <span className="font-semibold text-stone-800 dark:text-neutral-200">{slot.timeLabel}</span>
                  <span className="font-mono text-[11px]">
                    ~{formatNum(slot.expectedViews)} vws
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day × 6-Slot Compact Heatmap Matrix */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-neutral-500 block mb-2">
            Matriks Interaksi 7 Hari
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse min-w-[320px]">
              <thead>
                <tr>
                  <th className="w-12 text-left py-1 text-[10px] font-bold uppercase text-stone-400">Hari</th>
                  {TIME_SLOTS.map((slot: any) => (
                    <th key={slot.range} className="py-1 text-[10px] font-bold text-stone-500 dark:text-neutral-400">
                      {slot.range}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAY_SHORT.map((day, di) => (
                  <tr key={day}>
                    <td className="text-left py-1 text-xs font-bold text-stone-800 dark:text-neutral-200">
                      {day}
                    </td>
                    {TIME_SLOTS.map((_: any, si: number) => {
                      const val = matrix?.[di]?.[si] ?? 0;
                      return (
                        <td key={si} className="p-0.5">
                          <div
                            className={`h-7 rounded-lg flex items-center justify-center text-[10px] font-mono transition-transform hover:scale-105 cursor-default ${getCellBg(
                              val
                            )}`}
                            title={`${DAY_LABELS[di]} ${TIME_SLOTS[si].range}: ${val.toFixed(1)}% Est. Engagement`}
                          >
                            {val.toFixed(1)}%
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
    </div>
  );
}
