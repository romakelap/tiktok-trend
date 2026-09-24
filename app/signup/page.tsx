"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { SignupPreview } from "@/components/auth/SignupPreview";
import { registerUser } from "@/lib/auth-api";
import { ROUTES } from "@/lib/routes";
import { signupSchema, type SignupFormValues } from "@/lib/schemas/auth";

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

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
        err instanceof Error ? err.message : "Pendaftaran akun gagal dilakukan.";
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
        className="space-y-5 my-auto"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight mb-1.5">
            Buat Akun Baru
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Daftar untuk mengakses dashboard analitik tren TikTok.
          </p>
        </div>

        {/* Social / OAuth TikTok Sign In */}
        <div>
          <AuthSocialButtons providers={["tiktok"]} />
        </div>

        <AuthDivider label="atau daftar dengan email" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AuthInput
            label="Nama Lengkap"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            {...register("fullName")}
            error={errors.fullName?.message}
          />

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
            placeholder="Min. 8 karakter"
            autoComplete="new-password"
            {...register("password")}
            error={errors.password?.message}
          />

          {serverError ? (
            <AuthAlert variant="error">{serverError}</AuthAlert>
          ) : null}

          <div className="pt-2">
            <AuthSubmitButton loading={isSubmitting}>
              Daftar Akun Sekarang
            </AuthSubmitButton>
          </div>
        </form>

        <p className="text-[11px] text-center text-stone-400 leading-relaxed pt-1">
          Dengan mendaftar, Anda menyetujui{" "}
          <Link href={ROUTES.landing} className="underline hover:text-black">
            Syarat &amp; Ketentuan
          </Link>{" "}
          serta{" "}
          <Link href={ROUTES.landing} className="underline hover:text-black">
            Kebijakan Privasi
          </Link>{" "}
          TikTrend BI.
        </p>

        <p className="text-xs text-center text-stone-500 pt-2">
          Sudah memiliki akun?{" "}
          <Link
            href={ROUTES.login}
            className="font-bold text-black hover:underline"
          >
            Masuk di sini →
          </Link>
        </p>
      </motion.div>

      {/* Footer System Info */}
      <div className="pt-8 border-t border-stone-200/60 flex items-center justify-between text-[10px] font-mono text-stone-400">
        <span>TIKTREND BI PLATFORM</span>
        <span>AIVEN MYSQL · PRODUCTION</span>
      </div>

    </div>
  );

  return (
    <AuthSplitLayout
      formSide="left"
      preview={<SignupPreview />}
      form={formPanel}
    />
  );
}
