"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";

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

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError(null);
    try {
      setSubmittedEmail(values.email.trim());
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal mengirim tautan reset.";
      setServerError(message);
    }
  };

  const handleRetry = () => {
    setSubmittedEmail(null);
    reset();
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-6 sm:p-10 bg-stone-50/70 text-black selection:bg-black selection:text-white">
      
      {/* Top Navbar Brand */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <AuthBrand variant="light" />
        <Link
          href={ROUTES.login}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-black transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Kembali ke Login</span>
        </Link>
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-xl space-y-6"
        >
          {!submittedEmail ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center mb-4 text-stone-800">
                  <Mail size={18} />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-black tracking-tight mb-1.5">
                  Lupa Kata Sandi?
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                  Masukkan alamat email yang terdaftar. Kami akan mengirimkan instruksi untuk mengatur ulang kata sandi Anda.
                </p>
              </div>

              <AuthInput
                label="Alamat Email"
                type="email"
                placeholder="nama@email.com"
                autoComplete="email"
                {...register("email")}
                error={errors.email?.message}
              />

              {serverError ? (
                <AuthAlert variant="error">{serverError}</AuthAlert>
              ) : null}

              <div className="pt-2">
                <AuthSubmitButton loading={isSubmitting}>
                  Kirim Tautan Pemulihan
                </AuthSubmitButton>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-5 py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 size={24} />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-black tracking-tight mb-1.5">
                  Periksa Email Anda
                </h1>
                <p className="text-xs text-stone-500">
                  Tautan pemulihan kata sandi telah dikirimkan ke:
                </p>
                <p className="font-mono font-bold text-xs text-black mt-1 bg-stone-100 py-1.5 px-3 rounded-lg inline-block">
                  {submittedEmail}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-left text-xs text-stone-600 leading-relaxed space-y-1">
                <p className="font-semibold text-black">Catatan Penting:</p>
                <p>
                  Tautan berlaku selama 24 jam. Jika tidak menemukan email di kotak masuk, periksa folder spam Anda.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRetry}
                className="w-full py-3 rounded-full text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Gunakan Alamat Email Lain
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer System Info */}
      <div className="max-w-md w-full mx-auto text-center text-[10px] font-mono text-stone-400">
        <span>© 2026 TikTrend BI · Sistem Informasi STIKOM Surabaya</span>
      </div>

    </div>
  );
}
