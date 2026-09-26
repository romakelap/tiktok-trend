"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";

import {
  AuthAlert,
  AuthBrand,
  AuthDivider,
  AuthInput,
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const expired = sessionStorage.getItem("session_expired");
    if (expired === "true") {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      sessionStorage.removeItem("session_expired");
    }
  }, []);

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const res = await loginUser({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      const userRole = res?.data?.role?.toUpperCase();
      if (userRole === "ADMIN") {
        toast.success("Login berhasil! Mengalihkan ke Admin Console...");
        router.push(ROUTES.adminDashboard);
      } else {
        toast.success("Login berhasil!");
        router.push(redirectTo);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login gagal dilakukan.";
      setServerError(message);
    }
  };

  const formPanel = (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between flex-1 py-4">
      
      {/* Top Brand Bar */}
      <div className="flex items-center justify-between pb-8">
        <AuthBrand variant="light" />
        <Link
          href={ROUTES.landing}
          className="text-xs font-semibold text-stone-500 hover:text-black transition-colors"
        >
          ← Beranda
        </Link>
      </div>

      {/* Form Content */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="space-y-6 my-auto"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight mb-1.5">
            Masuk ke Akun Anda
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Akses dashboard analitik dan eksplorasi data tren TikTok.
          </p>
        </div>

        {/* Social / OAuth TikTok Sign In */}
        <div>
          <AuthSocialButtons providers={["tiktok"]} />
        </div>

        <AuthDivider label="atau masuk dengan email" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {registered ? (
            <AuthAlert variant="success">
              Registrasi akun berhasil! Silakan masuk dengan kredensial Anda.
            </AuthAlert>
          ) : null}

          <AuthInput
            label="Alamat Email"
            type="email"
            placeholder="nama@email.com"
            autoComplete="email"
            {...register("email")}
            error={errors.email?.message}
          />

          <AuthPasswordInput
            label="Kata Sandi"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("password")}
            error={errors.password?.message}
          />

          {serverError ? (
            <AuthAlert variant="error">{serverError}</AuthAlert>
          ) : null}

          <div className="flex items-center justify-between pt-0.5 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-stone-600 select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-stone-300 accent-black text-black cursor-pointer"
                {...register("rememberMe")}
              />
              <span>Ingat saya</span>
            </label>
            <Link
              href={ROUTES.forgotPassword}
              className="font-semibold text-stone-600 hover:text-black transition-colors"
            >
              Lupa kata sandi?
            </Link>
          </div>

          <div className="pt-2">
            <AuthSubmitButton loading={isSubmitting}>
              Masuk ke Dashboard
            </AuthSubmitButton>
          </div>
        </form>

        <p className="text-xs text-center text-stone-500 pt-2">
          Belum memiliki akun?{" "}
          <Link
            href={ROUTES.signup}
            className="font-bold text-black hover:underline"
          >
            Daftar gratis di sini →
          </Link>
        </p>
      </motion.div>

      {/* Footer System Info */}
      <div className="pt-8 border-t border-stone-200/60 flex items-center justify-between text-[10px] font-mono text-stone-400">
        <span>TIKTREND BI PLATFORM</span>
        <span>SPRING BOOT + FASTAPI</span>
      </div>

    </div>
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
