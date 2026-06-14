import { Activity, Eye, Flame, TrendingUp, Video } from "lucide-react";

import { GridBg } from "@/components/layout/GridBg";
import { TOKENS } from "@/lib/design-tokens";
import { formatNum, formatPct } from "@/lib/analytics/formatters";
import type { HistoricalDay } from "@/lib/analytics/types";

type KpiRowProps = {
  data: HistoricalDay[];
};

/**
 * Four headline KPI tiles summarising the historical period: total videos
 * processed, total views, average engagement %, and average viral prob.
 * The delta values are placeholders until backend wiring lands.
 */
export function KpiRow({ data }: KpiRowProps) {
  const totalViews = data.reduce((s, d) => s + d.views, 0);
  const totalVideos = data.reduce((s, d) => s + d.videos, 0);
  const avgEng = (
    data.reduce((s, d) => s + d.engagement, 0) / data.length
  ).toFixed(1);
  const avgViral = data.reduce((s, d) => s + d.viralProb, 0) / data.length;

  const items = [
    {
      Ico: Video,
      label: "Videos Diproses",
      value: totalVideos.toString(),
      sub: `Selama ${data.length} hari periode`,
      delta: "+18",
      pos: true,
    },
    {
      Ico: Eye,
      label: "Total Views",
      value: formatNum(totalViews),
      sub: "Akumulasi semua akun",
      delta: "+22%",
      pos: true,
    },
    {
      Ico: Activity,
      label: "Avg. Engagement",
      value: `${avgEng}%`,
      sub: "Rata-rata harian",
      delta: "+0.8%",
      pos: true,
    },
    {
      Ico: Flame,
      label: "Avg. Viral Prob.",
      value: formatPct(avgViral),
      sub: "Model RF-viral-v2.4.1",
      delta: "+5.4%",
      pos: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((c) => (
        <div
          key={c.label}
          className="relative p-5 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: TOKENS.cardSoft,
            backdropFilter: "blur(16px)",
            border: `1px solid ${TOKENS.cardBorder}`,
            boxShadow:
              "0 2px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)",
          }}
        >
          <GridBg theme="light" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "#111",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                }}
              >
                <c.Ico
                  className="w-4 h-4 text-white"
                  strokeWidth={2}
                />
              </div>
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-black"
                style={{
                  background: c.pos
                    ? "rgba(5,150,105,0.08)"
                    : "rgba(220,38,38,0.07)",
                  color: c.pos ? "#059669" : "#dc2626",
                  border: `1px solid ${c.pos ? "rgba(5,150,105,0.18)" : "rgba(220,38,38,0.18)"}`,
                }}
              >
                <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
                {c.delta}
              </div>
            </div>
            <p
              className="text-[10.5px] font-bold uppercase tracking-[0.14em] mb-1.5"
              style={{ color: TOKENS.textMuted }}
            >
              {c.label}
            </p>
            <p
              className="text-3xl font-black mb-1 leading-none tracking-tight"
              style={{ color: TOKENS.text }}
            >
              {c.value}
            </p>
            <p className="text-xs" style={{ color: TOKENS.textMuted }}>
              {c.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
