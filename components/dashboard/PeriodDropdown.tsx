"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, Check, ChevronDown } from "lucide-react";
import { PERIOD_LABELS } from "@/lib/dashboard/mock-data";
import type { PeriodKey } from "@/lib/dashboard/types";

type PeriodDropdownProps = {
  value: PeriodKey;
  onChange: (v: PeriodKey) => void;
};

export function PeriodDropdown({ value, onChange }: PeriodDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-9 px-3 rounded-lg text-xs font-medium flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 shadow-xs cursor-pointer transition-colors"
      >
        <Calendar className="w-3.5 h-3.5 text-neutral-500" />
        <span className="font-semibold text-neutral-900 dark:text-white">
          {PERIOD_LABELS[value]}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 rounded-lg overflow-hidden w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg py-1">
          {(Object.entries(PERIOD_LABELS) as [PeriodKey, string][]).map(([k, l]) => (
            <button
              type="button"
              key={k}
              onClick={() => {
                onChange(k);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-left text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <span className={value === k ? "font-semibold text-neutral-900 dark:text-white" : ""}>
                {l}
              </span>
              {value === k && (
                <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-white stroke-[2.5]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
