"use client";

import { useState } from "react";
import { Check, ChevronDown, Filter } from "lucide-react";
import { TOKENS } from "@/lib/design-tokens";
import { CATEGORIES } from "@/lib/dashboard/mock-data";

export type CategoryFilterValue = "all" | (typeof CATEGORIES)[number]["id"];

type CategoryFilterDropdownProps = {
  value: CategoryFilterValue;
  onChange: (v: CategoryFilterValue) => void;
};

/** Filter by category (or "all") for the dashboard toolbar. */
export function CategoryFilterDropdown({
  value,
  onChange,
}: CategoryFilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const options: { id: CategoryFilterValue; label: string }[] = [
    { id: "all", label: "Semua Kategori" },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
  ];
  const selected = options.find((o) => o.id === value);

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
        <Filter className="w-3.5 h-3.5" strokeWidth={2.5} />
        <span className="font-black">{selected?.label}</span>
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
          className="absolute right-0 top-full mt-1.5 z-50 rounded-xl overflow-hidden w-52"
          style={{
            background: "#fff",
            border: `1px solid ${TOKENS.cardBorder}`,
            boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          }}
        >
          {options.map((opt, i) => (
            <button
              type="button"
              key={opt.id}
              onClick={() => {
                onChange(opt.id);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left transition-all hover:bg-black/[0.03]"
              style={{
                borderBottom:
                  i < options.length - 1
                    ? `1px solid ${TOKENS.divider}`
                    : "none",
              }}
            >
              <span
                className="font-bold text-xs flex-1"
                style={{ color: TOKENS.text }}
              >
                {opt.label}
              </span>
              {value === opt.id ? (
                <Check
                  className="w-4 h-4"
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
