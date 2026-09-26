import {
  ArrowUpRight,
  CircleDot,
  Clock,
  Lightbulb,
  Target,
} from "lucide-react";

import { GridBg } from "@/components/layout/GridBg";
import { TOKENS } from "@/lib/design-tokens";
import { formatPct } from "@/lib/analytics/formatters";
import { CONTENT_TYPE_META, PRIORITY_META } from "@/lib/analytics/meta";
import type { Recommendation } from "@/lib/analytics/types";

type RecommendationCardProps = {
  rec: Recommendation;
  onOpen: (rec: Recommendation) => void;
};

/**
 * Compact card preview for a content recommendation. Clicking opens the
 * detail drawer (`RecommendationDetailDrawer`).
 */
export function RecommendationCard({ rec, onOpen }: RecommendationCardProps) {
  const pm = PRIORITY_META[rec.priority];
  const TypeIco = CONTENT_TYPE_META[rec.type] ?? Lightbulb;

  return (
    <div
      className="group relative rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 cursor-pointer"
      onClick={() => onOpen(rec)}
      style={{
        background: TOKENS.card,
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow:
          "0 1px 3px rgba(0,0,0,0.03), 0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: pm.solid }}
      />
      <GridBg theme="light" />

      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: pm.solid,
                boxShadow: `0 4px 12px ${pm.solid}33`,
              }}
            >
              <TypeIco
                className="w-4 h-4 text-white"
                strokeWidth={2.2}
              />
            </div>
            <div>
              <span
                className="text-[9px] font-black uppercase tracking-widest"
                style={{ color: pm.solid }}
              >
                {rec.type}
              </span>
            </div>
          </div>
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md font-black text-[10px] uppercase tracking-wider"
            style={{
              background: pm.tint,
              color: pm.solid,
              border: `1px solid ${pm.border}`,
            }}
          >
            <CircleDot className="w-2.5 h-2.5" strokeWidth={3} />
            {pm.label}
          </span>
        </div>

        <h3
          className="font-black text-base leading-tight tracking-tight mb-2"
          style={{ color: TOKENS.text }}
        >
          {rec.title}
        </h3>

        <p
          className="text-[12px] leading-relaxed mb-3 line-clamp-3"
          style={{ color: TOKENS.textSubtle }}
        >
          {rec.description}
        </p>

        <div
          className="my-3 pl-3 py-1.5"
          style={{ borderLeft: `2px solid ${pm.solid}66` }}
        >
          <p
            className="text-[11px] leading-relaxed italic"
            style={{ color: TOKENS.textProse }}
          >
            {rec.rationale}
          </p>
        </div>

        {rec.hashtags && rec.hashtags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap mb-3">
            {rec.hashtags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-1.5 py-0.5 rounded-md font-bold"
                style={{
                  background: "rgba(14,165,233,0.07)",
                  color: "#0369a1",
                  border: "1px solid rgba(14,165,233,0.18)",
                  fontSize: 10,
                }}
              >
                {tag}
              </span>
            ))}
            {rec.hashtags.length > 3 && (
              <span
                className="inline-flex items-center px-1.5 py-0.5 rounded-md font-bold"
                style={{
                  background: "rgba(0,0,0,0.04)",
                  color: TOKENS.textMuted,
                  border: `1px solid ${TOKENS.divider}`,
                  fontSize: 10,
                }}
              >
                +{rec.hashtags.length - 3}
              </span>
            )}
          </div>
        )}

        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: `1px solid ${TOKENS.divider}` }}
        >
          <div
            className="flex items-center gap-3 text-[10px]"
            style={{ color: TOKENS.textMuted }}
          >
            <span className="flex items-center gap-1 font-bold">
              <Clock className="w-2.5 h-2.5" strokeWidth={2.5} />
              {rec.duration}
            </span>
            <span
              className="w-0.5 h-0.5 rounded-full"
              style={{ background: TOKENS.textMuted }}
            />
            <span className="flex items-center gap-1 font-bold">
              <Target className="w-2.5 h-2.5" strokeWidth={2.5} />
              {formatPct(rec.confidence)}
            </span>
          </div>
          <ArrowUpRight
            className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            style={{ color: TOKENS.textMuted }}
            strokeWidth={2.4}
          />
        </div>
      </div>
    </div>
  );
}
