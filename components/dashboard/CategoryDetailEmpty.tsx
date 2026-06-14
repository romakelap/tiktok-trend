import { Target } from "lucide-react";

import { GridBg } from "@/components/layout/GridBg";
import { TOKENS } from "@/lib/design-tokens";

/** Placeholder shown in the Category Detail slot before a category is picked. */
export function CategoryDetailEmpty() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: TOKENS.cardSoft,
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <GridBg theme="light" />
      <div className="relative z-10 px-6 py-10 flex flex-col items-center justify-center text-center">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{
            background: "rgba(0,0,0,0.05)",
            border: `1px solid ${TOKENS.divider}`,
          }}
        >
          <Target
            className="w-6 h-6"
            style={{ color: TOKENS.textMuted }}
            strokeWidth={1.8}
          />
        </div>
        <p
          className="font-black text-sm mb-1"
          style={{ color: TOKENS.text }}
        >
          Belum ada kategori dipilih
        </p>
        <p className="text-xs" style={{ color: TOKENS.textMuted }}>
          Klik bar chart atau baris tabel di atas untuk melihat detail kategori
        </p>
      </div>
    </div>
  );
}
