"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AuthAlert,
  AuthBrand,
  AuthInput,
  AuthSubmitButton,
} from "@/components/auth";
import { ROUTES } from "@/lib/routes";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/schemas/auth";

export default function ForgotPasswordPage() {
  const [mounted, setMounted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError(null);
    // TODO: wire to backend forgot-password endpoint when ready.
    // For now, the UI confirms locally so the flow is testable.
    try {
      setSubmittedEmail(values.email.trim());
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not send reset link";
      setServerError(message);
    }
  };

  const handleRetry = () => {
    setSubmittedEmail(null);
    reset();
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6 relative"
      style={{
        background: "#f5f5f5",
        fontFamily: "'DM Sans', sans-serif",
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
    >
      <div
        className={`relative z-10 w-full max-w-md transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex justify-center mb-10">
          <AuthBrand variant="light" />
        </div>

        <div
          className="p-8 rounded-3xl bg-white"
          style={{
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
          }}
        >
          {!submittedEmail ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="text-center mb-2">
                <h1
                  className="text-2xl font-black text-black mb-2 leading-tight"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  Forgot Password?
                </h1>
                <p className="text-gray-500 text-sm">
                  Enter your email and we&rsquo;ll send a reset link.
                </p>
              </div>

              <AuthInput
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email")}
                error={errors.email?.message}
              />

              {serverError ? (
                <AuthAlert variant="error">{serverError}</AuthAlert>
              ) : null}

              <AuthSubmitButton loading={isSubmitting}>
                Send Reset Link
              </AuthSubmitButton>
            </form>
          ) : (
            <div className="text-center space-y-5">
              <h1
                className="text-2xl font-black text-black leading-tight"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Check Your Email
              </h1>
              <div>
                <p className="text-gray-500 text-sm mb-1">
                  We&rsquo;ve sent a reset link to:
                </p>
                <p className="text-black font-medium">{submittedEmail}</p>
              </div>

              <div
                className="p-4 rounded-xl text-left"
                style={{
                  background: "#f3f3f3",
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <p className="text-gray-600 text-sm">
                  The link expires in 24 hours. Check your spam folder if it
                  doesn&rsquo;t arrive within a few minutes.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRetry}
                className="w-full px-6 py-3 rounded-xl text-black font-medium transition-all hover:bg-gray-100"
                style={{ border: "1px solid rgba(0,0,0,0.1)" }}
              >
                Try a different email
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <Link
            href={ROUTES.login}
            className="text-gray-500 hover:text-black text-sm transition-all"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
