import { Mono } from "@/components/dashboard";
import { TOKENS } from "@/lib/design-tokens";
import { formatNum, formatPct } from "@/lib/analytics/formatters";
import type { TopSlot } from "@/lib/analytics/types";

type TopSlotsListProps = {
  slots: TopSlot[];
};

/**
 * Grid of cards highlighting the top-recommended posting slots with expected
 * engagement/views, model confidence, and a short rationale.
 */
export function TopSlotsList({ slots }: TopSlotsListProps) {
  return (
    <div
      className="overflow-x-auto rounded-2xl border"
      style={{
        background: TOKENS.card,
        borderColor: TOKENS.cardBorder,
        boxShadow: "0 1px 3px rgba(0,0,0,0.03), 0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <table className="w-full text-left border-collapse">
        <thead>
          <tr
            style={{
              background: "rgba(0,0,0,0.02)",
              borderBottom: `1px solid ${TOKENS.divider}`,
            }}
          >
            <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400 w-20">Rank</th>
            <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400">Hari</th>
            <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400">Jam Posting</th>
            <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400 text-right">Est. Engagement</th>
            <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400 text-right">Est. Views</th>
            <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400 w-48">Confidence</th>
            <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400">Rekomendasi Rationale</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {slots.map((s, i) => (
            <tr
              key={`${s.day}-${s.time}`}
              className="transition-colors hover:bg-black/[0.01]"
            >
              {/* Rank */}
              <td className="p-4 align-middle">
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-md flex items-center justify-center font-black text-[10px] text-white"
                    style={{ background: i === 0 ? "#10b981" : "#111" }}
                  >
                    #{i + 1}
                  </span>
                  {i === 0 && (
                    <span
                      className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider text-white bg-emerald-500"
                    >
                      Best
                    </span>
                  )}
                </div>
              </td>

              {/* Hari */}
              <td className="p-4 align-middle font-black text-xs text-zinc-800">
                {s.dayLabel}
              </td>

              {/* Jam Posting */}
              <td className="p-4 align-middle font-bold text-xs text-zinc-500">
                {s.timeLabel}
              </td>

              {/* Expected Engagement */}
              <td className="p-4 align-middle text-right font-black text-xs text-emerald-600">
                {s.expectedEng}%
              </td>

              {/* Expected Views */}
              <td className="p-4 align-middle text-right font-black text-xs text-zinc-800">
                {formatNum(s.expectedViews)}
              </td>

              {/* Confidence */}
              <td className="p-4 align-middle">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-400">
                    <span className="text-[8px]">Confidence</span>
                    <Mono size="xs" className="font-black text-zinc-800">
                      {formatPct(s.confidence)}
                    </Mono>
                  </div>
                  <div
                    className="h-1 rounded-full overflow-hidden"
                    style={{ background: TOKENS.barBg }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${s.confidence * 100}%`,
                        background: i === 0 ? "#10b981" : "#111",
                      }}
                    />
                  </div>
                </div>
              </td>

              {/* Reasoning */}
              <td className="p-4 align-middle text-[11px] leading-relaxed text-zinc-500 italic max-w-sm">
                {s.reasoning}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
