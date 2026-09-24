"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/routes";

type AuthBrandProps = {
  /** Color theme. `dark` for dark backgrounds, `light` for light. */
  variant?: "light" | "dark";
};

/**
 * Logo + brand wordmark shown above auth forms. Always linked back to landing.
 */
export function AuthBrand({ variant = "light" }: AuthBrandProps) {
  const isDark = variant === "dark";

  return (
    <Link
      href={ROUTES.landing}
      className="relative z-10 inline-flex items-center gap-2.5 group shrink-0"
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs transition-transform group-hover:scale-105 ${
          isDark ? "bg-white text-black" : "bg-black text-white"
        }`}
      >
        <span className="font-mono text-[11px] tracking-tight">TT</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`font-bold text-base tracking-tight ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          TikTrend BI
        </span>
        <span
          className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${
            isDark
              ? "bg-white/10 text-stone-300 border-white/15"
              : "bg-stone-100 text-stone-600 border-stone-200/80"
          }`}
        >
          v2.5
        </span>
      </div>
    </Link>
  );
}
