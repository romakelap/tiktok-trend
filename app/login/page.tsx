"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  AuthAlert,
  AuthBrand,
  AuthDivider,
  AuthInput,
  AuthPanelBg,
  AuthPasswordInput,
  AuthSocialButtons,
  AuthSplitLayout,
  AuthSubmitButton,
} from "@/components/auth";
import { LoginPreview } from "@/components/auth/LoginPreview";
import { loginUser } from "@/lib/auth-api";
import { ROUTES } from "@/lib/routes";
import { loginSchema, type LoginFormValues } from "@/lib/schemas/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const registered = searchParams.get("registered") === "true";
  const redirectTo = searchParams.get("redirect") ?? ROUTES.dashboard;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  // Surface session-expired warnings set by other parts of the app
  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const expired = sessionStorage.getItem("session_expired");
    if (expired === "true") {
      toast.error("Your session has expired. Please login again.");
      sessionStorage.removeItem("session_expired");
    }
  }, []);

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await loginUser({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      router.push(redirectTo);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setServerError(message);
    }
  };

  const formPanel = (
    <>
      <AuthPanelBg variant="light" />

      <AuthBrand variant="light" />

      <div
        className={`relative z-10 flex-1 flex items-center justify-center transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1
              className="text-4xl font-black mb-2 leading-tight"
              style={{ color: "#111", fontFamily: "'DM Serif Display', serif" }}
            >
              Login
            </h1>
            <p className="text-sm" style={{ color: "#888" }}>
              Welcome back! Please enter your details.
            </p>
          </div>

          <div className="mb-6">
            <AuthSocialButtons />
          </div>

          <div className="mb-6">
            <AuthDivider />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {registered ? (
              <AuthAlert variant="success">
                Registration successful. Please login.
              </AuthAlert>
            ) : null}

            <AuthInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
              error={errors.email?.message}
            />

            <AuthPasswordInput
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("password")}
              error={errors.password?.message}
            />

            {serverError ? (
              <AuthAlert variant="error">{serverError}</AuthAlert>
            ) : null}

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer text-sm text-neutral-600">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-neutral-300 accent-black"
                  {...register("rememberMe")}
                />
                Remember me
              </label>
              <Link
                href={ROUTES.forgotPassword}
                className="text-sm font-black transition-opacity hover:opacity-50"
                style={{ color: "#333" }}
              >
                Forgot password?
              </Link>
            </div>

            <AuthSubmitButton loading={isSubmitting}>Login</AuthSubmitButton>
          </form>

          <p
            className="text-sm text-center mt-7"
            style={{ color: "#999" }}
          >
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.signup}
              className="font-black transition-opacity hover:opacity-60"
              style={{ color: "#111" }}
            >
              Sign up for free →
            </Link>
          </p>
        </div>
      </div>
    </>
  );

  return (
    <AuthSplitLayout
      formSide="right"
      preview={<LoginPreview />}
      form={formPanel}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
