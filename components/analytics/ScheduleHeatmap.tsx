import { Calendar } from "lucide-react";

import { GridBg } from "@/components/layout/GridBg";
import { Mono, SectionLabel } from "@/components/dashboard";
import { TOKENS } from "@/lib/design-tokens";
import { DAYS, TIME_SLOTS } from "@/lib/analytics/meta";
import type { ScheduleMatrix } from "@/lib/analytics/types";

type ScheduleHeatmapProps = {
  heatmap: ScheduleMatrix;
};

type CellStyle = {
  bg: string;
  text: string;
};

function pickCellStyle(val: number, min: number, max: number): CellStyle {
  const ratio = max === min ? 0 : (val - min) / (max - min);
  if (ratio >= 0.85) return { bg: "#111", text: "#fff" };
  if (ratio >= 0.65) return { bg: "rgba(17,17,17,0.7)", text: "#fff" };
  if (ratio >= 0.45) return { bg: "rgba(17,17,17,0.4)", text: "#fff" };
  if (ratio >= 0.25) return { bg: "rgba(17,17,17,0.18)", text: TOKENS.text };
  if (ratio >= 0.1) return { bg: "rgba(17,17,17,0.08)", text: TOKENS.textSubtle };
  return { bg: "rgba(17,17,17,0.04)", text: TOKENS.textMuted };
}

/**
 * 7-day × 6-slot expected-engagement heatmap. Top 3 cells get a glowing
 * green outline so they're easy to spot.
 */
export function ScheduleHeatmap({ heatmap }: ScheduleHeatmapProps) {
  const flat = heatmap.flat();
  const max = Math.max(...flat);
  const min = Math.min(...flat);
  const top3Values = [...flat].sort((a, b) => b - a).slice(0, 3);

  return (
    <div
      className="relative rounded-2xl overflow-hidden p-6"
      style={{
        background: TOKENS.cardSoft,
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)",
      }}
    >
      <GridBg theme="light" />

      <div className="relative z-10">
        <SectionLabel
          icon={Calendar}
          title="Expected Engagement Heatmap"
          subtitle="Prediksi engagement rate per slot waktu — 7 hari × 6 segmen"
          action={
            <div
              className="flex items-center gap-2 text-[10px] font-bold"
              style={{ color: TOKENS.textMuted }}
            >
              <span>Rendah</span>
              <div className="flex items-center gap-0.5">
                {[0.05, 0.12, 0.2, 0.4, 0.7, 1].map((o, i) => (
                  <span
                    key={i}
                    className="w-3.5 h-3.5 rounded-sm"
                    style={{ background: `rgba(17,17,17,${o})` }}
                  />
                ))}
              </div>
              <span>Tinggi</span>
            </div>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr>
                <th className="w-12" />
                {TIME_SLOTS.map((slot) => {
                  const Ico = slot.Ico;
                  return (
                    <th key={slot.range} className="p-1.5">
                      <div className="flex flex-col items-center gap-0.5">
                        <Ico
                          className="w-3 h-3"
                          strokeWidth={2.2}
                        />
                        <Mono size="xs" dim className="font-bold">
                          {slot.range}
                        </Mono>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day, di) => (
                <tr key={day}>
                  <td className="p-1.5">
                    <span
                      className="text-[11px] font-black uppercase tracking-wider"
                      style={{ color: TOKENS.text }}
                    >
                      {day}
                    </span>
                  </td>
                  {heatmap[di].map((val, si) => {
                    const c = pickCellStyle(val, min, max);
                    const isTop = top3Values.includes(val);
                    return (
                      <td key={si} className="p-1">
                        <button
                          type="button"
                          className="w-full h-12 rounded-lg flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer relative group"
                          style={{
                            background: c.bg,
                            boxShadow: isTop
                              ? "0 0 0 2px #10b981, 0 0 16px rgba(16,185,129,0.4)"
                              : "none",
                          }}
                        >
                          <Mono
                            size="sm"
                            className="font-black"
                            style={{ color: c.text }}
                          >
                            {val.toFixed(1)}
                          </Mono>
                          <span
                            className="text-[8px] font-bold"
                            style={{ color: c.text, opacity: 0.6 }}
                          >
                            %
                          </span>
                          {isTop && (
                            <span
                              className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                              style={{
                                background: "#10b981",
                                boxShadow: "0 0 4px #10b981",
                              }}
                            />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="mt-4 pt-4 flex items-center gap-4"
          style={{ borderTop: `1px solid ${TOKENS.divider}` }}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#10b981", boxShadow: "0 0 6px #10b981" }}
            />
            <span
              className="text-[10px] font-bold"
              style={{ color: TOKENS.textMuted }}
            >
              Top 3 slots
            </span>
          </div>
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: TOKENS.textMuted }}
          />
          <Mono size="xs" dim className="font-bold">
            model: schedule-optimizer-v1.2 · WITA (UTC+8)
          </Mono>
        </div>
      </div>
    </div>
  );
}
