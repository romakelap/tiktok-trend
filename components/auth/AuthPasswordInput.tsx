"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthInput } from "./AuthInput";

type AuthPasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label?: string;
  error?: string;
};

/**
 * Password input with show/hide toggle. Forwards refs for react-hook-form.
 */
export const AuthPasswordInput = React.forwardRef<
  HTMLInputElement,
  AuthPasswordInputProps
>(function AuthPasswordInput(
  { label = "Password", error, ...inputProps },
  ref
) {
  const [show, setShow] = React.useState(false);
  const Icon = show ? EyeOff : Eye;

  return (
    <AuthInput
      ref={ref}
      label={label}
      type={show ? "text" : "password"}
      error={error}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="transition-opacity hover:opacity-50"
          style={{ color: "#aaa" }}
          aria-label={show ? "Hide password" : "Show password"}
        >
          <Icon className="w-5 h-5" />
        </button>
      }
      {...inputProps}
    />
  );
});
