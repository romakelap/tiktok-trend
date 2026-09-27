"use client";

import { Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

export function OptimalScheduleWindow() {
  const topSlots = [
    { rank: 1, day: "Jum", time: "09–12 WIB", desc: "Prime nighttime engagement peak", score: "10.4", isPeak: true },
    { rank: 2, day: "Kam", time: "18–21 WIB", desc: "", score: "9.7", isPeak: false },
    { rank: 3, day: "Sab", time: "12–15 WIB", desc: "", score: "9.4", isPeak: false },
  ];

  const days = [
    { name: "Sen", peak: false },
    { name: "Sel", peak: false },
    { name: "Rab", peak: false },
    { name: "Kam", peak: true },
    { name: "Jum", peak: true },
    { name: "Sab", peak: true },
    { name: "Min", peak: false },
  ];

  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 p-5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            <h3 className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wide">
              Best Posting Window
            </h3>
          </div>
          <Link
            href="/timeposting"
            className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
          >
            Detail Jadwal <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* 3 Ranked Slots */}
        <div className="space-y-2 mb-4">
          {topSlots.map((slot) => (
            <div
              key={slot.rank}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-all ${
                slot.isPeak
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50"
                  : "border border-stone-200 dark:border-neutral-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    slot.isPeak
                      ? "bg-emerald-600 text-white"
                      : "bg-stone-100 dark:bg-neutral-800 text-stone-500 dark:text-neutral-400"
                  }`}
                >
                  {slot.rank}
                </span>
                <div>
                  <p className="text-xs font-bold text-stone-900 dark:text-white">
                    {slot.day} · {slot.time}
                  </p>
                  {slot.desc && (
                    <p className="text-[9.5px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {slot.desc}
                    </p>
                  )}
                </div>
              </div>
              <div
                className={`text-[10px] font-black px-2 py-1 rounded font-mono ${
                  slot.isPeak
                    ? "bg-emerald-600 text-white"
                    : "text-stone-500 dark:text-neutral-400 border border-stone-200 dark:border-neutral-700"
                }`}
              >
                SCORE {slot.score}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Activity Bar */}
      <div>
        <div className="flex items-center justify-between text-[10px] text-stone-400 dark:text-neutral-500 mb-2">
          <span>Distribusi Aktivitas Mingguan</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            Hijau = Peak Slot
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => (
            <div
              key={d.name}
              className={`h-6 rounded flex items-center justify-center text-[9px] font-bold ${
                d.peak
                  ? "bg-emerald-500 text-white"
                  : "bg-stone-100 dark:bg-neutral-800 text-stone-500 dark:text-neutral-400"
              }`}
            >
              {d.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
