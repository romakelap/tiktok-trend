"use client";

import { useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Compass } from "lucide-react";

export interface CategoryRadarItem {
  id: string;
  label: string;
  color: string;
  views: number;
  engagement: number; // already * 100
  viralProb: number;  // 0–1
  revenue: number;    // IDR
  videos: number;
}

type Props = {
  categories: CategoryRadarItem[];
  loading?: boolean;
};

const AXES = [
  { key: "viewsScore",      label: "Views Vol"   },
  { key: "engagementScore", label: "Engagement"  },
  { key: "viralScore",      label: "Viral Velocity" },
  { key: "revenueScore",    label: "GMV / Revenue" },
  { key: "volumeScore",     label: "Content Supply" },
];

/** Normalize all category values to 0–100 per axis using min-max scaling. */
function normalize(categories: CategoryRadarItem[]) {
  const maxViews     = Math.max(...categories.map((c) => c.views),      1);
  const maxEngage    = Math.max(...categories.map((c) => c.engagement),  1);
  const maxViral     = Math.max(...categories.map((c) => c.viralProb),   1);
  const maxRevenue   = Math.max(...categories.map((c) => c.revenue),     1);
  const maxVideos    = Math.max(...categories.map((c) => c.videos),      1);

  return categories.map((c) => ({
    id:             c.id,
    label:          c.label,
    color:          c.color,
    viewsScore:     Math.round((c.views      / maxViews)   * 100),
    engagementScore:Math.round((c.engagement / maxEngage)  * 100),
    viralScore:     Math.round((c.viralProb  / maxViral)   * 100),
    revenueScore:   Math.round((c.revenue    / maxRevenue) * 100),
    volumeScore:    Math.round((c.videos     / maxVideos)  * 100),
  }));
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl bg-stone-900 text-white p-3.5 text-xs shadow-xl border border-stone-700 min-w-[150px]">
      <p className="font-bold text-white mb-2 border-b border-stone-800 pb-1.5">{d.subject}</p>
      {Object.entries(d)
        .filter(([k]) => k !== "subject")
        .map(([catName, score]) => (
          <div key={catName} className="flex justify-between items-center gap-4 py-0.5 text-stone-300">
            <span className="text-[11px]">{catName}</span>
            <span className="font-mono font-bold text-white">{String(score)}%</span>
          </div>
        ))}
    </div>
  );
}

export function CategoryRadarChart({ categories, loading }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");

  if (loading || !categories || categories.length === 0) {
    return (
      <div className="h-80 rounded-xl bg-stone-100 dark:bg-neutral-800/50 animate-pulse border border-stone-200 dark:border-neutral-800" />
    );
  }

  const normalized = normalize(categories);

  const chartData = AXES.map((axis) => {
    const row: Record<string, any> = { subject: axis.label };
    normalized.forEach((cat) => {
      row[cat.label] = cat[axis.key as keyof typeof cat];
    });
    return row;
  });

  const displayedCategories = activeCategory === "all"
    ? normalized
    : normalized.filter((c) => c.id === activeCategory);

  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 px-6 py-4 border-b border-stone-200/80 dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-900/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-900 dark:bg-white text-white dark:text-stone-900 flex items-center justify-center">
            <Compass className="w-4 h-4" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-white">
              Category Holistic Profile Radar
            </h3>
            <p className="text-xs text-stone-500 dark:text-neutral-400">
              5 dimensi performa relatif (0–100 Normalized Index)
            </p>
          </div>
        </div>

        {/* Category chips selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === "all"
                ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-xs"
                : "bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400 hover:bg-stone-200"
            }`}
          >
            All 5 Sectors
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === c.id
                  ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-xs"
                  : "bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400 hover:bg-stone-200"
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6" style={{ height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="rgba(0,0,0,0.08)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 11, fontWeight: 700, fill: "rgb(87, 83, 78)" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 9, fill: "rgb(168, 162, 158)" }}
              tickCount={4}
            />
            <Tooltip content={<CustomTooltip />} />
            {displayedCategories.map((cat) => (
              <Radar
                key={cat.label}
                name={cat.label}
                dataKey={cat.label}
                stroke={cat.color}
                fill={cat.color}
                fillOpacity={activeCategory === "all" ? 0.08 : 0.25}
                strokeWidth={activeCategory === "all" ? 2 : 2.5}
                dot={{ r: 3.5, fill: cat.color, strokeWidth: 0 }}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
