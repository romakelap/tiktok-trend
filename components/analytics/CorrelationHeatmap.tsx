"use client";

import { useState } from "react";
import { Layers } from "lucide-react";
import { TOKENS } from "@/lib/design-tokens";

interface CorrelationData {
  features: string[];
  matrix: number[][];
}

const FEATURE_LABELS: Record<string, string> = {
  duration: "Durasi Video",
  title_length: "Panjang Judul",
  hashtags: "Jumlah Hashtag",
  mentions: "Jumlah Mention",
  emojis: "Jumlah Emoji",
  has_question: "Tanya Jawab (?)",
  views: "Views Video",
  engagement_rate: "Engagement %",
};

interface CorrelationHeatmapProps {
  data: CorrelationData;
  loading?: boolean;
}

export function CorrelationHeatmap({ data, loading = false }: CorrelationHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    row: string;
    col: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  const getCellColor = (value: number) => {
    // Value is between -1 and 1
    if (value > 0) {
      // Scale emerald color
      const opacity = Math.min(Math.abs(value) * 0.8 + 0.1, 0.9);
      return `rgba(16, 185, 129, ${opacity})`; // Tailwind emerald-500
    } else if (value < 0) {
      // Scale rose color
      const opacity = Math.min(Math.abs(value) * 0.8 + 0.1, 0.9);
      return `rgba(244, 63, 94, ${opacity})`; // Tailwind rose-500
    }
    return "rgba(255, 255, 255, 0.05)"; // Neutral
  };

  const getTextColor = (value: number) => {
    if (Math.abs(value) > 0.4) {
      return "#ffffff";
    }
    return "rgba(255, 255, 255, 0.7)";
  };

  const formatCorrelationValue = (val: number) => {
    if (val === 1) return "1.00";
    if (val === -1) return "-1.00";
    const sign = val > 0 ? "+" : val < 0 ? "-" : "";
    const absVal = Math.abs(val).toFixed(2).substring(1); // gets ".45" instead of "0.45"
    return sign + absVal;
  };

  const getCorrelationStrengthText = (val: number) => {
    const absVal = Math.abs(val);
    let strength = "Tidak ada korelasi";
    if (absVal > 0.7) strength = "Korelasi Sangat Kuat";
    else if (absVal > 0.5) strength = "Korelasi Kuat";
    else if (absVal > 0.3) strength = "Korelasi Sedang";
    else if (absVal > 0.1) strength = "Korelasi Lemah";
    else if (absVal > 0) strength = "Korelasi Sangat Lemah";

    const direction = val > 0 ? "Positif" : val < 0 ? "Negatif" : "";
    return `${strength} ${direction}`.trim();
  };

  const features = data?.features || [];
  const matrix = data?.matrix || [];

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: TOKENS.card,
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
      }}
    >
      <div className="p-6">
        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20">
            <Layers className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-black text-sm tracking-tight" style={{ color: TOKENS.text }}>
              Diagnostic Statistics (Feature Correlation Matrix)
            </h3>
            <p className="text-[11px]" style={{ color: TOKENS.textMuted }}>
              Koefisien Korelasi Pearson untuk mengukur dampak elemen video terhadap engagement
            </p>
          </div>
        </div>

        {loading ? (
          <div className="h-[320px] flex items-center justify-center text-xs font-bold" style={{ color: TOKENS.textMuted }}>
            Menganalisis korelasi fitur statistik...
          </div>
        ) : features.length === 0 ? (
          <div className="h-[320px] flex items-center justify-center text-xs font-semibold text-center leading-relaxed" style={{ color: TOKENS.textMuted }}>
            Tidak ada data fitur yang tersedia untuk analisis diagnostik.
          </div>
        ) : (
          <div className="overflow-x-auto select-none">
            <div className="min-w-[650px] relative">
              {/* Heatmap Grid */}
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `140px repeat(${features.length}, 1fr)`,
                }}
              >
                {/* Corner Cell */}
                <div className="h-10"></div>

                {/* Column Headers */}
                {features.map((feat) => (
                  <div
                    key={`col-${feat}`}
                    className="h-10 flex items-center justify-center text-center text-[10px] font-black uppercase tracking-wider px-1"
                    style={{ color: TOKENS.textSubtle }}
                  >
                    {FEATURE_LABELS[feat] || feat}
                  </div>
                ))}

                {/* Grid Rows */}
                {features.map((rowFeat, rowIndex) => (
                  <div key={`row-container-${rowFeat}`} className="contents">
                    {/* Row Header */}
                    <div
                      className="h-12 flex items-center text-left text-[11px] font-black"
                      style={{ color: TOKENS.text }}
                    >
                      {FEATURE_LABELS[rowFeat] || rowFeat}
                    </div>

                    {/* Row Cells */}
                    {features.map((colFeat, colIndex) => {
                      const value = matrix[rowIndex]?.[colIndex] ?? 0;
                      return (
                        <div
                          key={`cell-${rowFeat}-${colFeat}`}
                          className="h-12 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-150 relative hover:scale-105 hover:z-20 border border-black/5"
                          style={{
                            background: getCellColor(value),
                            color: getTextColor(value),
                            boxShadow: hoveredCell?.row === rowFeat && hoveredCell?.col === colFeat
                              ? "0 4px 12px rgba(0,0,0,0.15)"
                              : "none",
                          }}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredCell({
                              row: rowFeat,
                              col: colFeat,
                              value,
                              x: rect.left + rect.width / 2,
                              y: rect.top - 8,
                            });
                          }}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          <span className="text-[11px] font-black tracking-tighter">
                            {formatCorrelationValue(value)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Color Legend */}
              <div className="mt-8 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest" style={{ color: TOKENS.textMuted }}>
                <span>Korelasi Negatif Kuat (-1.0)</span>
                <div
                  className="w-40 h-2.5 rounded-full"
                  style={{
                    background: "linear-gradient(to right, rgba(244,63,94,0.9), rgba(255,255,255,0.1), rgba(16,185,129,0.9))",
                    border: `1px solid ${TOKENS.inputBorder}`,
                  }}
                ></div>
                <span>Korelasi Positif Kuat (+1.0)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Custom Tooltip */}
      {hoveredCell && (
        <div
          className="fixed z-[9999] pointer-events-none p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white shadow-2xl flex flex-col gap-1 -translate-x-1/2 -translate-y-full"
          style={{
            left: hoveredCell.x,
            top: hoveredCell.y,
            fontFamily: "'DM Sans', sans-serif",
            maxWidth: 240,
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Korelasi Fitur</span>
            <span
              className="text-[11px] font-black px-1.5 py-0.5 rounded"
              style={{
                background: getCellColor(hoveredCell.value),
                color: getTextColor(hoveredCell.value),
              }}
            >
              {hoveredCell.value > 0 ? "+" : ""}
              {hoveredCell.value.toFixed(4)}
            </span>
          </div>
          <div className="text-[11px] font-bold text-zinc-300 mt-1">
            {FEATURE_LABELS[hoveredCell.row] || hoveredCell.row} vs {FEATURE_LABELS[hoveredCell.col] || hoveredCell.col}
          </div>
          <div className="text-[10px] font-black text-rose-300 mt-1">
            {getCorrelationStrengthText(hoveredCell.value)}
          </div>
        </div>
      )}
    </div>
  );
}
