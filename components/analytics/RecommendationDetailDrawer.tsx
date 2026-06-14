"use client";

import {
  Bookmark,
  CircleDot,
  Clock,
  Lightbulb,
  Send,
  Target,
  TrendingUp,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { GridBg } from "@/components/layout/GridBg";
import { TOKENS } from "@/lib/design-tokens";
import { formatPct } from "@/lib/analytics/formatters";
import { CONTENT_TYPE_META, PRIORITY_META } from "@/lib/analytics/meta";
import type { Recommendation } from "@/lib/analytics/types";

type RecommendationDetailDrawerProps = {
  rec: Recommendation | null;
  onClose: () => void;
};

/**
 * Right-side drawer that opens when a recommendation card is clicked. Shows
 * the full description, rationale, stats grid, keywords, and hashtags, plus
 * "Simpan" / "Add to Plan" actions.
 */
export function RecommendationDetailDrawer({
  rec,
  onClose,
}: RecommendationDetailDrawerProps) {
  if (!rec) return null;
  const pm = PRIORITY_META[rec.priority];
  const TypeIco = CONTENT_TYPE_META[rec.type] ?? Lightbulb;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40"
        style={{
          background: "rgba(17,17,17,0.55)",
          backdropFilter: "blur(4px)",
        }}
      />
      <div
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg overflow-hidden flex flex-col"
        style={{
          background: TOKENS.bg,
          borderLeft: `1px solid ${TOKENS.divider}`,
          boxShadow: "-12px 0 60px rgba(0,0,0,0.18)",
        }}
      >
        <GridBg theme="light" />

        <div
          className="relative z-10 flex items-center justify-between p-5 flex-shrink-0"
          style={{
            borderBottom: `1px solid ${TOKENS.divider}`,
            background: TOKENS.cardSoft,
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: pm.solid,
                boxShadow: `0 4px 12px ${pm.solid}33`,
              }}
            >
              <TypeIco
                className="w-5 h-5 text-white"
                strokeWidth={2.2}
              />
            </div>
            <div>
              <h3
                className="font-black text-base tracking-tight"
                style={{ color: TOKENS.text }}
              >
                Recommendation Detail
              </h3>
              <p className="text-xs" style={{ color: TOKENS.textMuted }}>
                {rec.type} · Priority {pm.label}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-black/5"
            style={{
              color: TOKENS.textMuted,
              border: `1px solid ${TOKENS.inputBorder}`,
            }}
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="relative z-10 flex-1 overflow-auto p-6 space-y-5">
          <div>
            <span
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md font-black text-[10px] uppercase tracking-wider mb-3"
              style={{
                background: pm.tint,
                color: pm.solid,
                border: `1px solid ${pm.border}`,
              }}
            >
              <CircleDot className="w-2.5 h-2.5" strokeWidth={3} />
              {pm.label} Priority
            </span>
            <h2
              className="text-2xl font-black tracking-tight leading-tight"
              style={{ color: TOKENS.text }}
            >
              {rec.title}
            </h2>
          </div>

          <div>
            <p
              className="text-[10px] font-black uppercase tracking-widest mb-2"
              style={{ color: TOKENS.textMuted }}
            >
              Deskripsi
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: TOKENS.textProse }}
            >
              {rec.description}
            </p>
          </div>

          <div
            className="p-4 rounded-xl"
            style={{ background: pm.tint, border: `1px solid ${pm.border}` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb
                className="w-3.5 h-3.5"
                style={{ color: pm.solid }}
                strokeWidth={2.4}
              />
              <p
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: pm.solid }}
              >
                Rationale
              </p>
            </div>
            <p
              className="text-[12.5px] leading-relaxed italic"
              style={{ color: TOKENS.textProse }}
            >
              {rec.rationale}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div
              className="p-3 rounded-xl"
              style={{
                background: TOKENS.card,
                border: `1px solid ${TOKENS.cardBorder}`,
              }}
            >
              <Clock
                className="w-3.5 h-3.5 mb-2"
                style={{ color: TOKENS.textMuted }}
                strokeWidth={2.4}
              />
              <p
                className="text-[10px] font-black uppercase tracking-wider mb-0.5"
                style={{ color: TOKENS.textMuted }}
              >
                Duration
              </p>
              <p
                className="font-black text-xs"
                style={{ color: TOKENS.text }}
              >
                {rec.duration}
              </p>
            </div>
            <div
              className="p-3 rounded-xl"
              style={{
                background: TOKENS.card,
                border: `1px solid ${TOKENS.cardBorder}`,
              }}
            >
              <Target
                className="w-3.5 h-3.5 mb-2"
                style={{ color: "#059669" }}
                strokeWidth={2.4}
              />
              <p
                className="text-[10px] font-black uppercase tracking-wider mb-0.5"
                style={{ color: TOKENS.textMuted }}
              >
                Confidence
              </p>
              <p className="font-black text-xs" style={{ color: "#059669" }}>
                {formatPct(rec.confidence)}
              </p>
            </div>
            <div
              className="p-3 rounded-xl"
              style={{
                background: TOKENS.card,
                border: `1px solid ${TOKENS.cardBorder}`,
              }}
            >
              <TrendingUp
                className="w-3.5 h-3.5 mb-2"
                style={{ color: TOKENS.textMuted }}
                strokeWidth={2.4}
              />
              <p
                className="text-[10px] font-black uppercase tracking-wider mb-0.5"
                style={{ color: TOKENS.textMuted }}
              >
                Expected
              </p>
              <p
                className="font-black text-[11px] leading-tight"
                style={{ color: TOKENS.text }}
              >
                {rec.expectedReach}
              </p>
            </div>
          </div>

          <div>
            <p
              className="text-[10px] font-black uppercase tracking-widest mb-2"
              style={{ color: TOKENS.textMuted }}
            >
              Suggested Keywords ({rec.keywords.length})
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {rec.keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2 py-1 rounded-md font-bold text-xs"
                  style={{
                    background: "rgba(0,0,0,0.04)",
                    color: TOKENS.text,
                    border: `1px solid ${TOKENS.divider}`,
                  }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p
              className="text-[10px] font-black uppercase tracking-widest mb-2"
              style={{ color: TOKENS.textMuted }}
            >
              Suggested Hashtags ({rec.hashtags.length})
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {rec.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-md font-bold text-xs"
                  style={{
                    background: "rgba(14,165,233,0.07)",
                    color: "#0369a1",
                    border: "1px solid rgba(14,165,233,0.2)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          className="relative z-10 p-4 flex items-center gap-2 flex-shrink-0"
          style={{
            borderTop: `1px solid ${TOKENS.divider}`,
            background: TOKENS.cardSoft,
            backdropFilter: "blur(20px)",
          }}
        >
          <Button
            variant="outline"
            className="flex-1 h-11 rounded-xl font-black"
            style={{
              background: "#fff",
              border: `1px solid ${TOKENS.inputBorder}`,
              color: TOKENS.text,
            }}
          >
            <Bookmark className="w-4 h-4 mr-1.5" strokeWidth={2.5} />
            Simpan
          </Button>
          <Button
            className="flex-1 h-11 rounded-xl font-black"
            style={{ background: "#111", color: "#fff" }}
          >
            <Send className="w-4 h-4 mr-1.5" strokeWidth={2.5} />
            Add to Plan
          </Button>
        </div>
      </div>
    </>
  );
}
