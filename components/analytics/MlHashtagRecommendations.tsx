"use client";

import { useState } from "react";
import { Award, Eye, Flame, Hash, HelpCircle, Sparkles, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { GridBg } from "@/components/layout/GridBg";
import { TOKENS } from "@/lib/design-tokens";
import { formatNum } from "@/lib/analytics/formatters";

type HashtagRec = {
  hashtagPk: number;
  tagTitle: string;
  hashtag: string;
  recommendationScore: number;
  rankPosition: number;
  expectedReach: number;
  expectedEngagementRate: number;
  competitionLevel: string;
  recommendationType: string;
  reasoning: string;
  modelVersion: string;
};

type MlHashtagRecommendationsProps = {
  recommendations: HashtagRec[];
  loading: boolean;
};

export function MlHashtagRecommendations({ recommendations, loading }: MlHashtagRecommendationsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-10 rounded-xl animate-pulse bg-black/[0.04]" />
        <div className="h-32 rounded-2xl animate-pulse bg-black/[0.04]" />
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div
        className="rounded-2xl p-8 text-center border"
        style={{
          background: TOKENS.card,
          borderColor: TOKENS.cardBorder,
        }}
      >
        <Hash className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm font-bold" style={{ color: TOKENS.text }}>
          Tidak ada rekomendasi hashtag untuk akun ini.
        </p>
        <p className="text-xs" style={{ color: TOKENS.textMuted }}>
          Hasil ML prediksi hashtag belum tersedia atau belum digenerate.
        </p>
      </div>
    );
  }

  const getCompetitionColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "low":
        return { solid: "#10b981", tint: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" };
      case "medium":
        return { solid: "#f59e0b", tint: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" };
      case "high":
        return { solid: "#ef4444", tint: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" };
      case "extreme":
      default:
        return { solid: "#ec4899", tint: "rgba(236,72,153,0.08)", border: "rgba(236,72,153,0.2)" };
    }
  };

  // Pagination calculations
  const totalItems = recommendations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = recommendations.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div
      className="overflow-hidden rounded-2xl border flex flex-col"
      style={{
        background: TOKENS.card,
        borderColor: TOKENS.cardBorder,
        boxShadow: "0 1px 3px rgba(0,0,0,0.03), 0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              style={{
                background: "rgba(0,0,0,0.02)",
                borderBottom: `1px solid ${TOKENS.divider}`,
              }}
            >
              <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400 w-24">Rank</th>
              <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400">Hashtag</th>
              <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400 text-right">ML Score</th>
              <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400 text-right">Exp. Reach</th>
              <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400 text-right">Est. Eng Rate</th>
              <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400">Kompetisi</th>
              <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400">Penjelasan (Rationale)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {paginatedData.map((rec) => {
              const comp = getCompetitionColor(rec.competitionLevel);
              return (
                <tr
                  key={rec.hashtagPk || rec.hashtag}
                  className="transition-colors hover:bg-black/[0.01]"
                >
                  {/* Rank */}
                  <td className="p-4 align-middle font-black text-xs text-zinc-800">
                    Rank #{rec.rankPosition}
                  </td>

                  {/* Hashtag */}
                  <td className="p-4 align-middle">
                    <span className="font-black text-sm text-purple-600">
                      {rec.hashtag.startsWith("#") ? rec.hashtag : `#${rec.hashtag}`}
                    </span>
                  </td>

                  {/* ML Score */}
                  <td className="p-4 align-middle text-right font-black text-xs text-purple-600">
                    {typeof rec.recommendationScore === "number"
                      ? `${(rec.recommendationScore * 100).toFixed(1)}%`
                      : "N/A"}
                  </td>

                  {/* Exp Reach */}
                  <td className="p-4 align-middle text-right font-black text-xs text-zinc-800">
                    {rec.expectedReach ? formatNum(rec.expectedReach) : "N/A"}
                  </td>

                  {/* Est. Eng Rate */}
                  <td className="p-4 align-middle text-right font-black text-xs text-emerald-600">
                    {typeof rec.expectedEngagementRate === "number"
                      ? `${(rec.expectedEngagementRate * 100).toFixed(2)}%`
                      : "N/A"}
                  </td>

                  {/* Competition */}
                  <td className="p-4 align-middle">
                    <span
                      className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border"
                      style={{
                        background: comp.tint,
                        color: comp.solid,
                        borderColor: comp.border,
                      }}
                    >
                      {rec.competitionLevel || "Medium"}
                    </span>
                  </td>

                  {/* Reasoning */}
                  <td className="p-4 align-middle text-[11px] leading-relaxed text-zinc-500 max-w-sm">
                    {rec.reasoning}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div
          className="p-4 flex items-center justify-between border-t"
          style={{ borderColor: TOKENS.divider, background: "rgba(0,0,0,0.01)" }}
        >
          <span className="text-[10px] font-bold text-zinc-400">
            Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems} rekomendasi
          </span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border transition-all hover:bg-black/5 disabled:opacity-40 disabled:hover:bg-transparent"
              style={{ borderColor: TOKENS.inputBorder }}
            >
              <ChevronLeft className="w-3.5 h-3.5 text-zinc-600" />
            </button>
            <span className="text-xs font-black text-zinc-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border transition-all hover:bg-black/5 disabled:opacity-40 disabled:hover:bg-transparent"
              style={{ borderColor: TOKENS.inputBorder }}
            >
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

