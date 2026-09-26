"use client";

import React, { useState } from 'react';
import { 
  Filter, 
  X, 
  Clock, 
  Layers, 
  BookOpen, 
  Smile, 
  Utensils, 
  Home, 
  Monitor, 
  LucideIcon, 
  Info,
  Moon,
  Sun,
  Coffee,
  Sunset,
  Flame,
  Calendar,
  Sparkles,
  CheckCircle2,
  Activity
} from 'lucide-react';
import {
  CATEGORIES,
  hours,
  days,
  formatNum,
} from '@/lib/timeposting/mock-data';

interface CategoryFilterBarProps {
  selected: string;
  onChange: (cat: string) => void;
}

const CATEGORY_ITEMS: { name: string; icon: LucideIcon }[] = [
  { name: 'All', icon: Layers },
  { name: 'Edukasi', icon: BookOpen },
  { name: 'Komedi', icon: Smile },
  { name: 'Kuliner', icon: Utensils },
  { name: 'Lifestyle', icon: Home },
  { name: 'Teknologi', icon: Monitor },
];

export function CategoryFilterBar({ selected, onChange }: CategoryFilterBarProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-stone-900 dark:text-white">Filter Kategori Posting</span>
        <span className="text-[11px] text-stone-400 dark:text-neutral-500 font-mono">Pilih untuk memfilter waktu optimal per niche</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {CATEGORY_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const isActive = selected === item.name;
          return (
            <button
              key={item.name}
              onClick={() => onChange(item.name)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-sm'
                  : 'bg-stone-50 dark:bg-neutral-850 text-stone-600 dark:text-neutral-300 border border-stone-200/70 dark:border-neutral-800 hover:bg-stone-100 dark:hover:bg-neutral-800'
              }`}
            >
              <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white dark:text-stone-900' : 'text-stone-400'}`} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface HeatmapChartProps {
  activeCategory: string;
  cells: any[];
}

export function HeatmapChart({ activeCategory, cells = [] }: HeatmapChartProps) {
  const [hoveredCell, setHoveredCell] = useState<{ day: string; hour: string; views: number } | null>(null);

  // 1. Initialize grid with 0 values
  const gridData: Record<string, Record<string, number>> = {};
  days.forEach(day => {
    gridData[day] = {};
    hours.forEach(hour => {
      gridData[day][hour] = 0;
    });
  });

  // 2. Populate grid from API cells
  const DAY_MAP = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const allViewsList: number[] = [];

  cells.forEach(cell => {
    const dayName = DAY_MAP[cell.dayOfWeek];
    if (dayName && gridData[dayName]) {
      const hourStr = `${cell.hourOfDay.toString().padStart(2, '0')}:00`;
      const views = cell.averageViews !== undefined ? cell.averageViews : (cell.avgViews !== undefined ? cell.avgViews : 0);
      const viewsNum = Math.round(views);
      gridData[dayName][hourStr] = viewsNum;
      allViewsList.push(viewsNum);
    }
  });

  const maxViews = allViewsList.length > 0 ? Math.max(...allViewsList, 1000) : 1000;
  const minViews = allViewsList.length > 0 ? Math.min(...allViewsList) : 0;

  // Find peak cell coordinates
  let peakDay = 'Jumat';
  let peakHour = '20:00';
  let highestViews = 0;
  days.forEach(d => {
    hours.forEach(h => {
      if (gridData[d][h] > highestViews) {
        highestViews = gridData[d][h];
        peakDay = d;
        peakHour = h;
      }
    });
  });

  const getHeatmapColor = (value: number) => {
    const ratio = Math.min(value / maxViews, 1);
    if (value === 0 || ratio === 0) {
      return { 
        bg: 'bg-stone-100/80 dark:bg-neutral-850 text-stone-400 dark:text-neutral-500 border border-stone-200/50 dark:border-neutral-800',
        text: 'text-stone-400 dark:text-neutral-500',
        level: 'Sepi',
        isPeak: false
      };
    }
    if (ratio < 0.2) {
      return { 
        bg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-900/50',
        text: 'text-sky-700 dark:text-sky-300 font-semibold',
        level: 'Rendah',
        isPeak: false
      };
    }
    if (ratio < 0.4) {
      return { 
        bg: 'bg-sky-200 dark:bg-sky-850 text-sky-900 dark:text-sky-100 border border-sky-300/80 dark:border-sky-700/60',
        text: 'text-sky-900 dark:text-sky-100 font-bold',
        level: 'Normal',
        isPeak: false
      };
    }
    if (ratio < 0.6) {
      return { 
        bg: 'bg-sky-400 dark:bg-sky-650 text-white border border-sky-400/80 shadow-2xs',
        text: 'text-white font-bold',
        level: 'Sedang',
        isPeak: false
      };
    }
    if (ratio < 0.8) {
      return { 
        bg: 'bg-sky-500 dark:bg-sky-600 text-white border border-sky-500 shadow-2xs',
        text: 'text-white font-bold',
        level: 'Tinggi',
        isPeak: false
      };
    }
    return { 
      bg: 'bg-sky-600 dark:bg-sky-500 text-white border-2 border-sky-300 dark:border-sky-300 shadow-xs font-bold',
      text: 'text-white font-bold',
      level: 'Puncak (Prime)',
      isPeak: true
    };
  };

  const activeDisplayCell = hoveredCell || {
    day: peakDay,
    hour: peakHour,
    views: highestViews || maxViews
  };
  const activeRatio = activeDisplayCell.views / (maxViews || 1);
  const activeStatus = activeRatio >= 0.8 
    ? { label: 'Waktu Puncak (Sangat Disarankan)', icon: Flame, color: 'bg-sky-600 text-white' }
    : activeRatio >= 0.5 
    ? { label: 'Waktu Optimal (Potensi Tinggi)', icon: Sparkles, color: 'bg-emerald-600 text-white' }
    : activeRatio >= 0.25 
    ? { label: 'Waktu Normal', icon: CheckCircle2, color: 'bg-indigo-600 text-white' }
    : { label: 'Aktivitas Sepi', icon: Clock, color: 'bg-stone-500 text-white' };

  const StatusIcon = activeStatus.icon;

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden">
      {/* ── Top Header & Live Cell Inspector ── */}
      <div className="p-5 md:p-6 border-b border-stone-100 dark:border-neutral-800">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-600 text-white shadow-sm flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-black text-base md:text-lg text-stone-900 dark:text-white">
                  Matriks Heatmap Jadwal Unggah (7x24 Jam)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">
                  {activeCategory}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-neutral-400">
                Peta visual 24 jam x 7 hari untuk mengidentifikasi waktu audiens paling aktif dan responsif
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-stone-500 dark:text-neutral-400 bg-stone-50 dark:bg-neutral-850 px-3.5 py-2 rounded-xl border border-stone-200/70 dark:border-neutral-750">
            <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0" />
            <span>Arahkan kursor pada kotak jam untuk memeriksa estimasi tayangan</span>
          </div>
        </div>

        {/* ── Prominent Interactive Cell Preview ── */}
        <div className="p-3.5 rounded-xl bg-stone-50/80 dark:bg-neutral-850/80 border border-stone-200/80 dark:border-neutral-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-750 shadow-2xs font-mono font-bold text-xs text-stone-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span>{activeDisplayCell.day}, Pk {activeDisplayCell.hour} WIB</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-stone-500 dark:text-neutral-400">Estimasi Rata-rata:</span>
              <span className="text-sm font-black font-mono text-sky-600 dark:text-sky-400">
                {formatNum(activeDisplayCell.views)} Views
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10.5px] font-mono font-bold px-2.5 py-1 rounded-lg shadow-2xs flex items-center gap-1.5 ${activeStatus.color}`}>
              <StatusIcon className="w-3 h-3" />
              <span>{activeStatus.label}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Large Heatmap Grid Section ── */}
      <div className="p-5 md:p-6 overflow-x-auto">
        <div className="min-w-[980px]">
          {/* Time Slots Category Banners with Professional Icons */}
          <div className="grid grid-cols-[100px_repeat(24,1fr)] gap-1.5 mb-2 text-center">
            <div />
            {/* 00 - 05: Dini Hari */}
            <div className="col-span-6 px-1.5 py-1 rounded-md bg-stone-100 dark:bg-neutral-850 text-[10.5px] font-bold text-stone-600 dark:text-neutral-400 border border-stone-200/50 dark:border-neutral-750 flex items-center justify-center gap-1.5">
              <Moon className="w-3 h-3 text-stone-500" />
              <span>Dini Hari (00 - 05)</span>
            </div>
            {/* 06 - 11: Pagi */}
            <div className="col-span-6 px-1.5 py-1 rounded-md bg-sky-50 dark:bg-sky-950/30 text-[10.5px] font-bold text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-900/40 flex items-center justify-center gap-1.5">
              <Sun className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              <span>Pagi (06 - 11)</span>
            </div>
            {/* 12 - 14: Siang */}
            <div className="col-span-3 px-1.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/30 text-[10.5px] font-bold text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center gap-1.5">
              <Coffee className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>Siang (12 - 14)</span>
            </div>
            {/* 15 - 18: Sore */}
            <div className="col-span-4 px-1.5 py-1 rounded-md bg-orange-50 dark:bg-orange-950/30 text-[10.5px] font-bold text-orange-700 dark:text-orange-300 border border-orange-100 dark:border-orange-900/40 flex items-center justify-center gap-1.5">
              <Sunset className="w-3 h-3 text-orange-600 dark:text-orange-400" />
              <span>Sore (15 - 18)</span>
            </div>
            {/* 19 - 23: Malam */}
            <div className="col-span-5 px-1.5 py-1 rounded-md bg-sky-100/80 dark:bg-sky-900/40 text-[10.5px] font-bold text-sky-800 dark:text-sky-200 border border-sky-200/70 dark:border-sky-800/60 flex items-center justify-center gap-1.5">
              <Flame className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              <span>Prime Malam (19 - 23)</span>
            </div>
          </div>

          {/* Header: Hours */}
          <div className="grid grid-cols-[100px_repeat(24,1fr)] gap-1.5 mb-2 text-center items-center">
            <div className="text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-neutral-400 text-left pl-3">
              Hari / Jam
            </div>
            {hours.map((hour) => (
              <div key={hour} className="text-[11px] font-mono text-stone-700 dark:text-neutral-300 font-bold truncate">
                {hour.replace(':00', '')}
              </div>
            ))}
          </div>

          {/* Days Rows (Enlarged Height & Clear Typography) */}
          <div className="space-y-1.5">
            {days.map((day) => (
              <div key={day} className="grid grid-cols-[100px_repeat(24,1fr)] gap-1.5 items-center">
                <span className="text-xs md:text-sm font-black text-stone-800 dark:text-stone-200 pl-3">
                  {day}
                </span>
                {hours.map((hour) => {
                  const views = gridData[day][hour] || 0;
                  const style = getHeatmapColor(views);
                  const isHovered = hoveredCell?.day === day && hoveredCell?.hour === hour;
                  const isPeak = day === peakDay && hour === peakHour;

                  return (
                    <div
                      key={hour}
                      onMouseEnter={() => setHoveredCell({ day, hour, views })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`h-11 sm:h-12 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-150 relative ${style.bg} ${
                        isHovered 
                          ? 'ring-2 ring-stone-900 dark:ring-white scale-110 z-20 shadow-md' 
                          : 'hover:scale-105'
                      }`}
                      title={`${day} pk ${hour} WIB — ${formatNum(views)} rata-rata tayangan`}
                    >
                      <span className={`text-[10px] sm:text-[11px] font-mono select-none ${style.text || ''}`}>
                        {views > 0 ? formatNum(views) : '—'}
                      </span>
                      {isPeak && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-white dark:ring-neutral-900" title="Slot Tertinggi" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Heatmap Footer with Intensity Scale ── */}
      <div className="p-5 md:p-6 pt-4 border-t border-stone-100 dark:border-neutral-800 flex items-center justify-between flex-wrap gap-4 text-xs bg-stone-50/40 dark:bg-neutral-850/40">
        <div className="text-xs text-stone-500 dark:text-neutral-400 font-mono">
          Rentang Data: <span className="text-stone-700 dark:text-neutral-200 font-bold">{formatNum(minViews)}</span> s/d <span className="font-bold text-sky-600 dark:text-sky-400">{formatNum(maxViews)} Views</span>
        </div>

        {/* Intensity Legend Steps */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-stone-600 dark:text-neutral-400 flex-wrap">
          <span className="font-semibold">Skala:</span>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 dark:bg-neutral-800 border border-stone-200/60 dark:border-neutral-700 text-[10px]">
              <span>Sepi</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 text-[10px]">
              <span>Rendah</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100 text-[10px]">
              <span>Normal</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-400 text-white text-[10px] font-bold">
              <span>Sedang</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-500 text-white text-[10px] font-bold">
              <span>Tinggi</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-600 text-white text-[10px] font-bold shadow-xs">
              <Flame className="w-2.5 h-2.5" />
              <span>Puncak (Optimal)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
