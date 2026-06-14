"use client";

import { useState } from "react";
import { Calendar, Check, ChevronDown } from "lucide-react";
import { TOKENS } from "@/lib/design-tokens";
import { PERIOD_LABELS } from "@/lib/dashboard/mock-data";
import type { PeriodKey } from "@/lib/dashboard/types";

type PeriodDropdownProps = {
  value: PeriodKey;
  onChange: (v: PeriodKey) => void;
};

/** Date-range selector used in the dashboard toolbar. */
export function PeriodDropdown({ value, onChange }: PeriodDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:opacity-80"
        style={{
          background: "#fff",
          border: `1px solid ${TOKENS.inputBorder}`,
          color: TOKENS.text,
        }}
      >
        <Calendar className="w-3.5 h-3.5" strokeWidth={2.5} />
        <span className="font-black">{PERIOD_LABELS[value]}</span>
        <ChevronDown
          className="w-3 h-3"
          strokeWidth={2.5}
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </button>
      {open ? (
        <div
          className="absolute right-0 top-full mt-1.5 z-50 rounded-xl overflow-hidden w-44"
          style={{
            background: "#fff",
            border: `1px solid ${TOKENS.cardBorder}`,
            boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          }}
        >
          {(Object.entries(PERIOD_LABELS) as [PeriodKey, string][]).map(
            ([k, l], i, arr) => (
              <button
                type="button"
                key={k}
                onClick={() => {
                  onChange(k);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left transition-all hover:bg-black/[0.03]"
                style={{
                  borderBottom:
                    i < arr.length - 1
                      ? `1px solid ${TOKENS.divider}`
                      : "none",
                }}
              >
                <span
                  className="font-bold text-xs flex-1"
                  style={{ color: TOKENS.text }}
                >
                  {l}
                </span>
                {value === k ? (
                  <Check
                    className="w-4 h-4"
                    style={{ color: "#111" }}
                    strokeWidth={2.5}
                  />
                ) : null}
              </button>
            )
          )}
        </div>
      ) : null}
    </div>
  );
}
