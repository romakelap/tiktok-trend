"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type AuthInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  label: string;
  error?: string;
  /** Optional right-side adornment, e.g. password show/hide toggle. */
  rightSlot?: React.ReactNode;
  className?: string;
};

/**
 * Clean, modern input field with focus state matching Landing Page design system.
 */
export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  function AuthInput(
    { label, error, rightSlot, className, ...inputProps },
    ref
  ) {
    return (
      <div className={cn("space-y-1.5 text-left", className)}>
        <label
          className="block text-xs font-semibold text-stone-700 tracking-tight"
          htmlFor={inputProps.id || inputProps.name}
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputProps.id || inputProps.name}
            {...inputProps}
            className={cn(
              "w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border text-sm text-black placeholder:text-stone-400 outline-none transition-all duration-200 shadow-2xs",
              error
                ? "border-red-500 focus:ring-2 focus:ring-red-500/10"
                : "border-stone-200/90 hover:border-stone-300 focus:border-black focus:ring-2 focus:ring-black/5",
              rightSlot ? "pr-11" : undefined
            )}
          />
          {rightSlot ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-stone-400 hover:text-stone-600 transition-colors">
              {rightSlot}
            </div>
          ) : null}
        </div>
        {error ? (
          <p className="text-xs font-medium text-red-600 mt-1">{error}</p>
        ) : null}
      </div>
    );
  }
);
