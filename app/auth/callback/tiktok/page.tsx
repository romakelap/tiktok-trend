"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { loginWithTikTok } from "@/lib/auth-api";
import { ROUTES } from "@/lib/routes";

function TiktokCallbackForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setStatus("error");
      setErrorMessage("Kode otentikasi TikTok tidak ditemukan dalam URL.");
      return;
    }

    let active = true;

    // Call backend endpoint to exchange code for session JWT tokens
    loginWithTikTok(code)
      .then((res) => {
        if (!active) return;
        if (res.success) {
          setStatus("success");
          // Short delay for high-end micro-animation feel before redirect
          setTimeout(() => {
            router.push(ROUTES.dashboard);
          }, 1000);
        } else {
          setStatus("error");
          setErrorMessage(res.message || "Gagal melakukan otentikasi dengan TikTok backend.");
        }
      })
      .catch((err) => {
        if (!active) return;
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Terjadi kesalahan jaringan.");
      });

    return () => {
      active = false;
    };
  }, [searchParams, router]);

  const handleGoBack = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-stone-50 text-black flex flex-col items-center justify-center p-6 selection:bg-black selection:text-white">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="max-w-sm w-full bg-white border border-stone-200/90 rounded-3xl p-8 shadow-xl relative z-10 flex flex-col items-center text-center space-y-6"
      >
        {/* TikTok / App Logo Pairing */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-black text-white rounded-2xl flex items-center justify-center shadow-xs">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.99-1.72-.08-.07-.17-.17-.25-.25v6.23c.04 2.22-.65 4.54-2.28 6.13-1.71 1.69-4.22 2.37-6.55 1.83-2.61-.54-4.85-2.58-5.46-5.18-.73-2.85.32-6.09 2.71-7.75 1.73-1.22 3.93-1.63 6.01-1.18v4.2c-1.27-.47-2.77-.28-3.84.52-1.15.82-1.63 2.36-1.17 3.73.43 1.34 1.86 2.32 3.28 2.29 1.48.06 2.94-1.01 3.12-2.51.05-.33.02-.67.02-1v-14.4c-.01-.01-.01-.02-.02-.02z" />
            </svg>
          </div>
          <span className="text-stone-300 font-bold">·</span>
          <div className="w-11 h-11 bg-stone-100 border border-stone-200 rounded-2xl flex items-center justify-center text-black font-bold text-xs shadow-xs">
            <span className="font-mono">TT</span>
          </div>
        </div>

        {status === "loading" && (
          <div className="space-y-3 py-2">
            <Loader2 className="w-8 h-8 animate-spin text-black mx-auto" strokeWidth={2.5} />
            <div>
              <h3 className="text-base font-bold text-black tracking-tight">
                Memverifikasi Sesi Akun
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Menghubungkan akun Anda dengan backend TikTrend BI dan mengamankan JWT token...
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-3 py-2 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-black tracking-tight">
                Otentikasi Berhasil!
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Akun berhasil diverifikasi. Mengalihkan ke Dashboard TikTrend BI...
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4 py-2 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-black tracking-tight">
                Otentikasi Gagal
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <button
              type="button"
              onClick={handleGoBack}
              className="w-full py-3 rounded-full font-semibold text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-stone-200"
            >
              <RefreshCw size={13} />
              <span>Kembali ke Halaman Login</span>
            </button>
          </div>
        )}

        <div className="pt-2 text-[10px] font-mono text-stone-400">
          <span>TIKTREND BI · JWT SESSION AUTH</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function TiktokCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-600 text-xs font-mono">
          Memuat Callback...
        </div>
      }
    >
      <TiktokCallbackForm />
    </Suspense>
  );
}
