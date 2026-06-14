"use client";

import { useState } from "react";
import { Award, Calendar, Clock, Flame, Target, ChevronLeft, ChevronRight } from "lucide-react";
import { GridBg } from "@/components/layout/GridBg";
import { TOKENS } from "@/lib/design-tokens";

type OptimalScheduleRec = {
  scheduleId: number;
  influencerId: number;
  dayOfWeek: number;
  hourOfDay: number;
  dayName: string;
  timeLabel: string;
  expectedEngagementRate: number;
  expectedViews: number;
  confidenceScore: number;
  rankPosition: number;
  sampleSize: number;
  reasoning: string;
};

type MlPostingTimeRecommendationsProps = {
  recommendations: OptimalScheduleRec[];
  loading: boolean;
};

const DAY_MAP: Record<string, string> = {
  Monday: "Senin",
  Tuesday: "Selasa",
  Wednesday: "Rabu",
  Thursday: "Kamis",
  Friday: "Jumat",
  Saturday: "Sabtu",
  Sunday: "Minggu",
};

export function MlPostingTimeRecommendations({ recommendations, loading }: MlPostingTimeRecommendationsProps) {
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
        <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm font-bold" style={{ color: TOKENS.text }}>
          Tidak ada rekomendasi waktu posting untuk akun ini.
        </p>
        <p className="text-xs" style={{ color: TOKENS.textMuted }}>
          Hasil ML prediksi waktu posting belum tersedia.
        </p>
      </div>
    );
  }

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
              <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400">Hari</th>
              <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400">Jam Posting</th>
              <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400 text-right">Est. Eng Rate</th>
              <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400 text-right">Confidence</th>
              <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400 text-center w-32">Sample Size</th>
              <th className="p-4 text-[9px] font-black uppercase tracking-wider text-zinc-400">Penjelasan (Rationale)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {paginatedData.map((rec) => {
              const indonesianDay = DAY_MAP[rec.dayName] || rec.dayName;
              return (
                <tr
                  key={rec.scheduleId}
                  className="transition-colors hover:bg-black/[0.01]"
                >
                  {/* Rank */}
                  <td className="p-4 align-middle font-black text-xs text-zinc-800">
                    Rank #{rec.rankPosition}
                  </td>

                  {/* Hari */}
                  <td className="p-4 align-middle font-black text-xs text-zinc-800">
                    {indonesianDay}
                  </td>

                  {/* Jam Posting */}
                  <td className="p-4 align-middle font-bold text-xs text-emerald-600">
                    {rec.timeLabel || `${rec.hourOfDay.toString().padStart(2, "0")}:00`}
                  </td>

                  {/* Est. Eng Rate */}
                  <td className="p-4 align-middle text-right font-black text-xs text-emerald-600">
                    {typeof rec.expectedEngagementRate === "number"
                      ? `${(rec.expectedEngagementRate * 100).toFixed(2)}%`
                      : "N/A"}
                  </td>

                  {/* Confidence */}
                  <td className="p-4 align-middle text-right font-black text-xs text-zinc-800">
                    {typeof rec.confidenceScore === "number"
                      ? `${(rec.confidenceScore * 100).toFixed(0)}%`
                      : "N/A"}
                  </td>

                  {/* Sample Size */}
                  <td className="p-4 align-middle text-center text-xs font-bold text-zinc-500">
                    {rec.sampleSize ? `${rec.sampleSize} video` : "1 video"}
                  </td>

                  {/* Reasoning */}
                  <td className="p-4 align-middle text-[11px] leading-relaxed text-zinc-500 max-w-sm">
                    {rec.reasoning || `Waktu posting direkomendasikan berdasarkan history video.`}
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

