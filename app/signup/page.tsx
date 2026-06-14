"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { SignupPreview } from "@/components/auth/SignupPreview";
import { registerUser } from "@/lib/auth-api";
import { ROUTES } from "@/lib/routes";
import { signupSchema, type SignupFormValues } from "@/lib/schemas/auth";

export default function SignupPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setServerError(null);
    try {
      await registerUser({
        fullName: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      router.push(`${ROUTES.login}?registered=true`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
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
              Create
              <br />
              <span style={{ fontStyle: "italic", color: "#333" }}>
                Account
              </span>
            </h1>
            <p className="text-sm" style={{ color: "#888" }}>
              Start your 14-day free trial. No credit card needed.
            </p>
          </div>

          <div className="mb-6">
            <AuthSocialButtons />
          </div>

          <div className="mb-6">
            <AuthDivider />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AuthInput
              label="Full Name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              {...register("fullName")}
              error={errors.fullName?.message}
            />

            <AuthInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
              error={errors.email?.message}
            />

            <AuthPasswordInput
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              {...register("password")}
              error={errors.password?.message}
            />

            {serverError ? (
              <AuthAlert variant="error">{serverError}</AuthAlert>
            ) : null}

            <AuthSubmitButton loading={isSubmitting}>
              Create Account
            </AuthSubmitButton>
          </form>

          <p
            className="text-xs text-center mt-5 leading-relaxed"
            style={{ color: "#bbb" }}
          >
            By signing up, you agree to our{" "}
            <Link
              href={ROUTES.landing}
              className="underline transition-opacity hover:opacity-60"
              style={{ color: "#555" }}
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href={ROUTES.landing}
              className="underline transition-opacity hover:opacity-60"
              style={{ color: "#555" }}
            >
              Privacy Policy
            </Link>
          </p>
          <p className="text-sm text-center mt-4" style={{ color: "#999" }}>
            Already have an account?{" "}
            <Link
              href={ROUTES.login}
              className="font-black transition-opacity hover:opacity-60"
              style={{ color: "#111" }}
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </>
  );

  return (
    <AuthSplitLayout
      formSide="left"
      preview={<SignupPreview />}
      form={formPanel}
    />
  );
}
