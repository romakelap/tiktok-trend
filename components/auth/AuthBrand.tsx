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
  const textColor = variant === "dark" ? "#fff" : "#111";

  return (
    <Link
      href={ROUTES.landing}
      className="relative z-10 flex items-center gap-3 group"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
        style={{ background: "#111", boxShadow: "0 4px 16px rgba(0,0,0,0.22)" }}
      >
        <svg
          className="w-5 h-5 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>
      </div>
      <span
        className="font-black text-lg tracking-tight"
        style={{ color: textColor }}
      >
        TikAnalytics
      </span>
    </Link>
  );
}
