"use client";

import React from 'react';
import { Filter, X } from 'lucide-react';
import {
  categoryColors,
  CATEGORIES,
  hours,
  days,
  categoryHeatmaps,
  hexToRgb,
  formatNum,
} from '@/lib/timeposting/mock-data';
import { TOKENS } from '@/lib/design-tokens';
import { GridBg } from '@/components/layout/GridBg';

interface CategoryFilterBarProps {
  selected: string;
  onChange: (cat: string) => void;
}

export function CategoryFilterBar({ selected, onChange }: CategoryFilterBarProps) {
  const allOptions = ['All', ...CATEGORIES];
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: TOKENS.cardSoft,
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
      }}
    >
      <GridBg theme="light" />
      <div className="relative z-10 px-6 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: '#111' }}
            >
              <Filter className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-black" style={{ color: TOKENS.text }}>
              Filter Kategori:
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {allOptions.map((cat) => {
              const isActive = selected === cat;
              const color = cat === 'All' ? '#111' : categoryColors[cat];
              const [r, g, b] = cat === 'All' ? [17, 17, 17] : hexToRgb(color);
              return (
                <button
                  key={cat}
                  onClick={() => onChange(cat)}
                  className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: isActive ? color : `rgba(${r},${g},${b},0.08)`,
                    color: isActive ? '#fff' : color,
                    border: `1.5px solid ${isActive ? color : `rgba(${r},${g},${b},0.2)`}`,
                    boxShadow: isActive ? `0 0 12px rgba(${r},${g},${b},0.35)` : 'none',
                  }}
                >
                  {cat !== 'All' && (
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: isActive ? 'rgba(255,255,255,0.7)' : color }}
                    />
                  )}
                  {cat}
                </button>
              );
            })}
          </div>
          {selected !== 'All' && (
            <button
              onClick={() => onChange('All')}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-70"
              style={{ color: TOKENS.textMuted, border: `1px solid ${TOKENS.inputBorder}` }}
            >
              <X className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
        {selected !== 'All' && (
          <p className="mt-2 text-xs" style={{ color: TOKENS.textMuted }}>
            Menampilkan heatmap untuk kategori{' '}
            <span className="font-black" style={{ color: categoryColors[selected] }}>
              {selected}
            </span>{' '}
            — pola jam & hari disesuaikan.
          </p>
        )}
      </div>
    </div>
  );
}

interface HeatmapChartProps {
  activeCategory: string;
  cells: any[];
}

export function HeatmapChart({ activeCategory, cells = [] }: HeatmapChartProps) {
  const accentColor = activeCategory === 'All' ? '#111111' : categoryColors[activeCategory];
  const [r, g, b] = activeCategory === 'All' ? [17, 17, 17] : hexToRgb(accentColor);

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

  const getHeatmapColor = (value: number) => {
    const ratio = Math.min(value / maxViews, 1);
    if (value === 0 || ratio === 0) return { bg: 'rgba(0,0,0,0.03)', text: TOKENS.textMuted };
    if (ratio < 0.2) return { bg: `rgba(${r},${g},${b},0.10)`, text: accentColor };
    if (ratio < 0.4) return { bg: `rgba(${r},${g},${b},0.25)`, text: accentColor };
    if (ratio < 0.6) return { bg: `rgba(${r},${g},${b},0.45)`, text: '#fff' };
    if (ratio < 0.8) return { bg: `rgba(${r},${g},${b},0.65)`, text: '#fff' };
    return { bg: `rgba(${r},${g},${b},0.88)`, text: '#fff' };
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-500 w-full max-w-full"
      style={{
        background: TOKENS.cardSoft,
        border: `1.5px solid rgba(${r},${g},${b},0.18)`,
        boxShadow: `0 4px 24px rgba(${r},${g},${b},0.08)`,
      }}
    >
      <GridBg theme="light" />

      <div className="relative z-10 p-6">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-black flex items-center gap-2" style={{ color: TOKENS.text }}>
              Heatmap Waktu Posting Optimal
              {activeCategory !== 'All' && (
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-black text-white"
                  style={{ background: accentColor, boxShadow: `0 0 10px rgba(${r},${g},${b},0.4)` }}
                >
                  {activeCategory}
                </span>
              )}
            </h2>
            <p className="text-xs mt-1" style={{ color: TOKENS.textMuted }}>
              {activeCategory === 'All'
                ? 'Rata-rata views semua kategori berdasarkan jam dan hari dalam seminggu'
                : `Pola posting optimal untuk konten ${activeCategory}`}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto w-full max-w-full">
          <div className="inline-block min-w-full">
            <div className="flex gap-1 mb-2">
              <div className="w-20 flex-shrink-0" />
              {hours.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 text-center min-w-[44px]"
                  style={{ fontSize: 10, color: TOKENS.textMuted, fontWeight: 600 }}
                >
                  {h}
                </div>
              ))}
            </div>

            {days.map((day) => (
              <div key={day} className="flex gap-1 mb-1">
                <div
                  className="w-20 flex-shrink-0 flex items-center justify-end pr-3"
                  style={{ fontSize: 12, fontWeight: 700, color: TOKENS.text }}
                >
                  {day}
                </div>
                {hours.map((hour) => {
                  const value = gridData[day][hour];
                  const color = getHeatmapColor(value);
                  // Highlight cell if it's within the top 15% tier and has views
                  const isTop = value >= maxViews * 0.85 && value > 0;
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className="group relative rounded-md transition-all duration-200 hover:scale-110 hover:z-10 cursor-pointer"
                      style={{
                        flex: '1 1 0%',
                        minWidth: 44,
                        minHeight: 40,
                        background: color.bg,
                        border: isTop ? `2px solid ${accentColor}` : '1px solid rgba(0,0,0,0.08)',
                        boxShadow: isTop ? `0 0 12px rgba(${r},${g},${b},0.3)` : 'none',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ color: color.text, fontSize: 9, fontWeight: 700 }}
                      >
                        {value > 0 ? (value / 1000000).toFixed(1) + 'M' : '0.0M'}
                      </div>
                      <div
                        className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap px-2 py-1 rounded-lg text-xs font-bold text-white"
                        style={{ background: '#111', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                      >
                        {formatNum(value)} views
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-6 pt-6 flex items-center gap-4 flex-wrap"
          style={{ borderTop: `1px solid ${TOKENS.divider}` }}
        >
          <span className="text-xs font-bold" style={{ color: TOKENS.textMuted }}>
            Intensitas:
          </span>
          {[
            { label: 'Sepi', bg: 'rgba(0,0,0,0.03)' },
            { label: 'Rendah', bg: `rgba(${r},${g},${b},0.10)` },
            { label: 'Normal', bg: `rgba(${r},${g},${b},0.45)` },
            { label: 'Tinggi', bg: `rgba(${r},${g},${b},0.65)` },
            { label: 'Puncak', bg: `rgba(${r},${g},${b},0.88)` },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md transition-all duration-500"
                style={{ background: item.bg, border: '1px solid rgba(0,0,0,0.1)' }}
              />
              <span className="text-xs font-semibold" style={{ color: TOKENS.textMuted }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
