"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
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
          }, 1200);
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
    <div className="min-h-screen bg-[#111] text-white flex flex-col items-center justify-center p-6 selection:bg-[#00f2fe] selection:text-black">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[#fe0979]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-[#00f2fe]/10 blur-[100px] pointer-events-none" />

      <div className="max-w-sm w-full bg-neutral-900 border border-neutral-800/80 rounded-2xl p-8 shadow-2xl relative z-10 flex flex-col items-center text-center space-y-6">
        
        {/* TikTok / App Logo Pairing */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-black border border-neutral-800 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.99-1.72-.08-.07-.17-.17-.25-.25v6.23c.04 2.22-.65 4.54-2.28 6.13-1.71 1.69-4.22 2.37-6.55 1.83-2.61-.54-4.85-2.58-5.46-5.18-.73-2.85.32-6.09 2.71-7.75 1.73-1.22 3.93-1.63 6.01-1.18v4.2c-1.27-.47-2.77-.28-3.84.52-1.15.82-1.63 2.36-1.17 3.73.43 1.34 1.86 2.32 3.28 2.29 1.48.06 2.94-1.01 3.12-2.51.05-.33.02-.67.02-1v-14.4c-.01-.01-.01-.02-.02-.02z" />
            </svg>
          </div>
          <span className="text-neutral-600 font-black">·</span>
          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="font-black text-sm text-black tracking-tight">T-BI</span>
          </div>
        </div>

        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="w-9 h-9 animate-spin text-[#00f2fe] mx-auto" strokeWidth={2.5} />
            <div>
              <h3 className="text-base font-black tracking-tight">Otentikasi Akun</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Menghubungkan sesi Anda dengan TikTok API dan mengamankan kunci akses...
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-400" strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-emerald-400">Otentikasi Berhasil!</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Akun Anda berhasil dikoneksikan. Mengalihkan ke Dashboard Trend BI...
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-5 animate-in zoom-in-95 duration-300">
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5 text-red-500" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-red-400">Otentikasi Gagal</h3>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={handleGoBack}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Kembali ke Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function TiktokCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#111] flex items-center justify-center text-white">Loading Callback...</div>}>
      <TiktokCallbackForm />
    </Suspense>
  );
}
