"use client";

import * as React from "react";
import { ArrowRight, Loader2 } from "lucide-react";

type AuthSubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  /** Override the button text. */
  children?: React.ReactNode;
};

/**
 * Clean primary black button used across auth forms matching Landing Page styling.
 */
export function AuthSubmitButton({
  loading = false,
  children = "Lanjutkan",
  disabled,
  ...buttonProps
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      {...buttonProps}
      className="group relative w-full py-3 sm:py-3.5 px-5 rounded-full bg-black text-white font-semibold text-xs sm:text-sm tracking-tight overflow-hidden transition-all duration-200 hover:bg-stone-800 disabled:opacity-60 disabled:cursor-not-allowed active:scale-98 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-stone-300" />
          <span>Memproses...</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
        </>
      )}
    </button>
  );
}
