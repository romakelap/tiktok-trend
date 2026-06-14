"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { TOKENS } from "@/lib/design-tokens";

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
  { key: "viewsScore",      label: "Views"      },
  { key: "engagementScore", label: "Engagement" },
  { key: "viralScore",      label: "Viral Score"},
  { key: "revenueScore",    label: "Revenue"    },
  { key: "volumeScore",     label: "Volume"     },
];

/** Normalize all category values to 0–100 per axis using min-max scaling. */
function normalize(categories: CategoryRadarItem[]) {
  const maxViews     = Math.max(...categories.map((c) => c.views),      1);
  const maxEngage    = Math.max(...categories.map((c) => c.engagement),  1);
  const maxViral     = Math.max(...categories.map((c) => c.viralProb),   1);
  const maxRevenue   = Math.max(...categories.map((c) => c.revenue),     1);
  const maxVideos    = Math.max(...categories.map((c) => c.videos),      1);

  return categories.map((c) => ({
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
    <div
      className="rounded-xl shadow-xl p-3 text-xs font-bold min-w-[130px]"
      style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.1)", fontFamily: "'DM Sans',sans-serif" }}
    >
      <p className="font-black text-gray-800 mb-2">{d.label}</p>
      {AXES.map((a) => (
        <div key={a.key} className="flex justify-between gap-4 mb-0.5">
          <span className="text-gray-500">{a.label}</span>
          <span className="font-black text-gray-900">{d[a.key]}</span>
        </div>
      ))}
    </div>
  );
}

export function CategoryRadarChart({ categories, loading }: Props) {
  if (loading || !categories || categories.length === 0) {
    return (
      <div className="h-72 rounded-2xl animate-pulse" style={{ background: "rgba(0,0,0,0.04)" }} />
    );
  }

  const normalized = normalize(categories);

  // Build chart data: one row per axis label, each category is a key
  const chartData = AXES.map((axis) => {
    const row: Record<string, any> = { subject: axis.label };
    normalized.forEach((cat) => {
      row[cat.label] = cat[axis.key as keyof typeof cat];
    });
    return row;
  });

  return (
    <div
      className="rounded-2xl p-5 border"
      style={{
        background: "#fff",
        borderColor: TOKENS.divider,
        boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
      }}
    >
      <div className="mb-1">
        <h3 className="text-sm font-black" style={{ color: TOKENS.text }}>
          Category Profile Radar
        </h3>
        <p className="text-[11px] mt-0.5" style={{ color: TOKENS.textMuted }}>
          5 dimensi performa — Views · Engagement · Viral · Revenue · Volume (normalized 0–100)
        </p>
      </div>

      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="rgba(0,0,0,0.07)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 11, fontWeight: 700, fill: "#64748b" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 9, fill: "#94a3b8" }}
              tickCount={4}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, fontWeight: 700, paddingTop: 8 }}
            />
            {normalized.map((cat) => (
              <Radar
                key={cat.label}
                name={cat.label}
                dataKey={cat.label}
                stroke={cat.color}
                fill={cat.color}
                fillOpacity={0.1}
                strokeWidth={2}
                dot={{ r: 3, fill: cat.color, strokeWidth: 0 }}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
