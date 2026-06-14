"use client";

import { useState } from "react";
import { Key, ChevronLeft, ChevronRight } from "lucide-react";
import { TOKENS } from "@/lib/design-tokens";

type KeywordRec = {
  keyword: string;
  keywordNormalized: string;
  keywordType: string;
  avgRelevanceScore: number;
  totalFrequency: number;
  totalVideos: number;
};

type MlKeywordRecommendationsProps = {
  recommendations: KeywordRec[];
  loading: boolean;
};

export function MlKeywordRecommendations({ recommendations, loading }: MlKeywordRecommendationsProps) {
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
        <Key className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm font-bold" style={{ color: TOKENS.text }}>
          Tidak ada rekomendasi keyword untuk akun ini.
        </p>
        <p className="text-xs" style={{ color: TOKENS.textMuted }}>
          Hasil NLP ekstraksi keyword belum tersedia.
        </p>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "entity":
        return { solid: "#3b82f6", tint: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)" };
      case "topic":
        return { solid: "#a855f7", tint: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.2)" };
      case "verb":
        return { solid: "#ec4899", tint: "rgba(236,72,153,0.08)", border: "rgba(236,72,153,0.2)" };
      case "adjective":
        return { solid: "#10b981", tint: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" };
      case "noun":
      default:
        return { solid: "#64748b", tint: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.2)" };
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
              <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400">Keyword</th>
              <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400">Tipe</th>
              <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400 text-right">Relevance</th>
              <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400 text-right">Frekuensi</th>
              <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400 text-right">Total Videos</th>
              <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400">Penjelasan (Rationale)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {paginatedData.map((rec, idx) => {
              const globalIdx = startIndex + idx + 1;
              const typeMeta = getTypeColor(rec.keywordType);
              return (
                <tr
                  key={rec.keyword || idx}
                  className="transition-colors hover:bg-black/[0.01]"
                >
                  {/* Rank */}
                  <td className="p-4 align-middle font-black text-xs text-zinc-800">
                    Rank #{globalIdx}
                  </td>

                  {/* Keyword */}
                  <td className="p-4 align-middle">
                    <span className="font-black text-sm text-amber-600 capitalize">
                      "{rec.keyword}"
                    </span>
                  </td>

                  {/* Type */}
                  <td className="p-4 align-middle">
                    <span
                      className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border"
                      style={{
                        background: typeMeta.tint,
                        color: typeMeta.solid,
                        borderColor: typeMeta.border,
                      }}
                    >
                      {rec.keywordType || "Noun"}
                    </span>
                  </td>

                  {/* Relevance */}
                  <td className="p-4 align-middle text-right font-black text-xs text-amber-600">
                    {typeof rec.avgRelevanceScore === "number"
                      ? `${(rec.avgRelevanceScore * 100).toFixed(1)}%`
                      : "N/A"}
                  </td>

                  {/* Frequency */}
                  <td className="p-4 align-middle text-right font-black text-xs text-zinc-800">
                    {rec.totalFrequency || 1}x
                  </td>

                  {/* Total Videos */}
                  <td className="p-4 align-middle text-right font-black text-xs text-zinc-500">
                    {rec.totalVideos || 1} video
                  </td>

                  {/* Reasoning */}
                  <td className="p-4 align-middle text-[11px] leading-relaxed text-zinc-500 max-w-sm">
                    Keyword ini memiliki bobot relevansi tinggi pada caption video yang mendapatkan engagement optimal. Disarankan untuk disematkan pada hook caption.
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
            Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems} keyword
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
