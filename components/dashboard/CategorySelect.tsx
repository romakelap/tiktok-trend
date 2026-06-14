"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { TOKENS } from "@/lib/design-tokens";
import { CATEGORIES } from "@/lib/dashboard/mock-data";
import type { CategoryId } from "@/lib/dashboard/types";

type CategorySelectProps = {
  value: CategoryId | "";
  onChange: (v: CategoryId | "") => void;
  label: string;
  exclude: CategoryId | "";
};

/**
 * Compact category picker used in CombinationAnalysis. Reuses the global
 * category list and allows excluding the value selected in the paired input.
 */
export function CategorySelect({
  value,
  onChange,
  label,
  exclude,
}: CategorySelectProps) {
  const [open, setOpen] = useState(false);
  const options = CATEGORIES.filter((c) => c.id !== exclude);
  const selected = CATEGORIES.find((c) => c.id === value);

  return (
    <div className="relative flex-1">
      <p
        className="text-[10px] font-black uppercase tracking-widest mb-1.5"
        style={{ color: TOKENS.textMuted }}
      >
        {label}
      </p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full h-10 px-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:opacity-80 text-left"
        style={{
          background: "#fff",
          border: `1px solid ${
            selected ? `${selected.color}44` : TOKENS.inputBorder
          }`,
          color: TOKENS.text,
        }}
      >
        {selected ? (
          <>
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ background: selected.tint }}
            >
              <selected.Ico
                className="w-3 h-3"
                style={{ color: selected.color }}
                strokeWidth={2.2}
              />
            </div>
            <span className="font-black flex-1">{selected.label}</span>
          </>
        ) : (
          <span
            className="font-semibold flex-1"
            style={{ color: TOKENS.textMuted }}
          >
            Pilih kategori…
          </span>
        )}
        <ChevronDown
          className="w-3.5 h-3.5 flex-shrink-0"
          strokeWidth={2.5}
          style={{ color: TOKENS.textMuted }}
        />
      </button>
      {open ? (
        <div
          className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl overflow-hidden"
          style={{
            background: "#fff",
            border: `1px solid ${TOKENS.cardBorder}`,
            boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          }}
        >
          {options.map((cat, i) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => {
                onChange(cat.id);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all hover:bg-black/[0.03]"
              style={{
                borderBottom:
                  i < options.length - 1
                    ? `1px solid ${TOKENS.divider}`
                    : "none",
              }}
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ background: cat.tint }}
              >
                <cat.Ico
                  className="w-3 h-3"
                  style={{ color: cat.color }}
                  strokeWidth={2.2}
                />
              </div>
              <span
                className="font-bold text-xs flex-1"
                style={{ color: TOKENS.text }}
              >
                {cat.label}
              </span>
              {value === cat.id ? (
                <Check
                  className="w-3.5 h-3.5"
                  style={{ color: "#111" }}
                  strokeWidth={2.5}
                />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
