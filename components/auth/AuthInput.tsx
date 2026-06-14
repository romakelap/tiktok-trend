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
 * Styled label + input pair with an animated focus ring and inline error
 * message. Forwards refs so it works with `react-hook-form`'s `register`.
 */
export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  function AuthInput(
    { label, error, rightSlot, className, ...inputProps },
    ref
  ) {
    const [focused, setFocused] = React.useState(false);

    return (
      <div className={cn("space-y-1.5", className)}>
        <label
          className="block text-xs font-black uppercase tracking-widest"
          style={{ color: "#555" }}
          htmlFor={inputProps.id || inputProps.name}
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputProps.id || inputProps.name}
            {...inputProps}
            onFocus={(e) => {
              setFocused(true);
              inputProps.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              inputProps.onBlur?.(e);
            }}
            className={cn(
              "w-full px-4 py-3 rounded-xl outline-none transition-all duration-250",
              rightSlot ? "pr-12" : undefined
            )}
            style={{
              background: "#fff",
              border: error
                ? "1.5px solid #b91c1c"
                : focused
                  ? "1.5px solid #333"
                  : "1px solid rgba(0,0,0,0.12)",
              boxShadow: focused
                ? "0 0 0 3px rgba(51,51,51,0.08), 0 2px 10px rgba(0,0,0,0.07)"
                : "0 2px 6px rgba(0,0,0,0.04)",
              color: "#111",
              fontSize: "14px",
            }}
          />
          {rightSlot ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {rightSlot}
            </div>
          ) : null}
        </div>
        {error ? (
          <p className="text-xs font-semibold" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);
