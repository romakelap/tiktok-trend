"use client";

import * as React from "react";
import { ArrowRight, Loader2 } from "lucide-react";

type AuthSubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  /** Override the button text. */
  children?: React.ReactNode;
};

/**
 * Black submit button used across auth forms. Shows a spinner when `loading`
 * and an arrow icon when idle.
 */
export function AuthSubmitButton({
  loading = false,
  children = "Continue",
  disabled,
  ...buttonProps
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      {...buttonProps}
      className="group relative w-full py-4 rounded-xl text-white font-black text-sm uppercase tracking-widest overflow-hidden transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
      style={{
        background: "#111",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow:
          "0 0 24px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.25)",
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-xl">
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.08) 50%,transparent 100%)",
            animation: "shimmer 2s infinite",
          }}
        />
      </div>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Please wait...
          </>
        ) : (
          <>
            {children}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </>
        )}
      </span>
    </button>
  );
}
