"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, X, Shield, Lock, ArrowLeftRight } from "lucide-react";
import { motion } from "framer-motion";

function TiktokAuthorizeForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const redirectUri = searchParams.get("redirect_uri");
  const state = searchParams.get("state") ?? "";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuthorize = () => {
    if (!redirectUri) {
      alert("Error: Parameter redirect_uri tidak ditemukan.");
      return;
    }

    // Generate a random mock authorization code
    const mockCode = `mock_tiktok_code_${Math.random().toString(36).substring(2, 10)}`;

    // Redirect back to client callback
    const callbackUrl = `${decodeURIComponent(redirectUri)}?code=${mockCode}&state=${state}`;
    router.push(callbackUrl);
  };

  const handleCancel = () => {
    router.push("/login");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-stone-50 text-black flex flex-col justify-between font-sans selection:bg-black selection:text-white">
      
      {/* Top Header */}
      <header className="px-6 py-4 bg-white border-b border-stone-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">
            <span>d</span>
          </div>
          <span className="text-xs font-bold text-stone-700 tracking-tight">
            TikTok Developer Portal · Consent Gateway
          </span>
        </div>
        <button
          type="button"
          onClick={handleCancel}
          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-black transition-colors"
          aria-label="Batalkan"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Main Consent Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="max-w-md w-full bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
        >
          {/* Connection Branding Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.99-1.72-.08-.07-.17-.17-.25-.25v6.23c.04 2.22-.65 4.54-2.28 6.13-1.71 1.69-4.22 2.37-6.55 1.83-2.61-.54-4.85-2.58-5.46-5.18-.73-2.85.32-6.09 2.71-7.75 1.73-1.22 3.93-1.63 6.01-1.18v4.2c-1.27-.47-2.77-.28-3.84.52-1.15.82-1.63 2.36-1.17 3.73.43 1.34 1.86 2.32 3.28 2.29 1.48.06 2.94-1.01 3.12-2.51.05-.33.02-.67.02-1v-14.4c-.01-.01-.01-.02-.02-.02z" />
                </svg>
              </div>

              <ArrowLeftRight className="w-4 h-4 text-stone-400" />

              <div className="w-12 h-12 bg-stone-100 border border-stone-200 text-black rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm">
                <span className="font-mono">TT</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-black tracking-tight">
                Hubungkan ke TikTrend BI
              </h2>
              <p className="text-xs text-stone-500 max-w-xs leading-relaxed mt-1">
                Aplikasi riset <strong>TikTrend BI</strong> meminta otorisasi untuk membaca data profil publik TikTok Anda.
              </p>
            </div>
          </div>

          {/* Scope Request list */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-3 text-left">
            <p className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-stone-700" />
              <span>Izin yang Diminta:</span>
            </p>
            
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5 text-xs">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                <div>
                  <p className="font-semibold text-black">Informasi Profil Publik</p>
                  <p className="text-[11px] text-stone-500">Membaca username unik, nickname tampilan, dan foto profil.</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5 text-xs">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                <div>
                  <p className="font-semibold text-black">Statistik &amp; Metrik Konten</p>
                  <p className="text-[11px] text-stone-500">Membaca jumlah pengikut serta rasio performa video publik.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Secure indicator */}
          <div className="flex items-center gap-2 text-[11px] text-stone-500 bg-stone-100/80 p-2.5 rounded-xl border border-stone-200/60 text-left">
            <Lock className="w-3.5 h-3.5 text-stone-600 shrink-0" />
            <span>Koneksi aman. Kata sandi akun Anda tidak pernah dibagikan.</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={handleAuthorize}
              className="w-full py-3 rounded-full font-semibold text-xs sm:text-sm bg-black hover:bg-stone-800 text-white transition-all cursor-pointer shadow-sm active:scale-98"
            >
              Izinkan Akses (Authorize)
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full py-3 rounded-full font-semibold text-xs sm:text-sm bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer border border-stone-200"
            >
              Batalkan
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer Info */}
      <footer className="px-6 py-4 bg-white border-t border-stone-200/80 text-center text-[10px] font-mono text-stone-400">
        <p>© 2026 TikTok Inc. Developer Portal · Simulasi Autentikasi Riset Skripsi</p>
      </footer>
    </div>
  );
}

export default function TiktokAuthorizePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-600 text-xs font-mono">
          Memuat Otorisasi TikTok...
        </div>
      }
    >
      <TiktokAuthorizeForm />
    </Suspense>
  );
}
