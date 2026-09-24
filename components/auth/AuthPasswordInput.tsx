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
 * Password input with show/hide toggle matching the Landing Page design system.
 */
export const AuthPasswordInput = React.forwardRef<
  HTMLInputElement,
  AuthPasswordInputProps
>(function AuthPasswordInput(
  { label = "Kata Sandi", error, ...inputProps },
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
          className="p-1 rounded-md text-stone-400 hover:text-black transition-colors focus:outline-none"
          aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
        >
          <Icon className="w-4 h-4" />
        </button>
      }
      {...inputProps}
    />
  );
});
