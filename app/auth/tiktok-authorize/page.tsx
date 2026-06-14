"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, X, Shield, Lock, ArrowLeftRight } from "lucide-react";

function TiktokAuthorizeForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const redirectUri = searchParams.get("redirect_uri");
  const state = searchParams.get("state") ?? "";
  const clientKey = searchParams.get("client_key") ?? "";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuthorize = () => {
    if (!redirectUri) {
      alert("Error: redirect_uri parameter is missing.");
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
    <div className="min-h-screen bg-[#121212] text-white flex flex-col justify-between font-sans selection:bg-red-500 selection:text-white">
      {/* Top Header */}
      <header className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mock TikTok Mini Logo */}
          <div className="w-8 h-8 rounded-full bg-black border border-neutral-800 flex items-center justify-center">
            <span className="font-black text-sm tracking-tight text-white">d</span>
          </div>
          <span className="text-sm font-bold tracking-tight text-neutral-400">TikTok Developer Center</span>
        </div>
        <button onClick={handleCancel} className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1e1e1e] border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-6">
          
          {/* App Connection Info */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-black border border-neutral-800 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.99-1.72-.08-.07-.17-.17-.25-.25v6.23c.04 2.22-.65 4.54-2.28 6.13-1.71 1.69-4.22 2.37-6.55 1.83-2.61-.54-4.85-2.58-5.46-5.18-.73-2.85.32-6.09 2.71-7.75 1.73-1.22 3.93-1.63 6.01-1.18v4.2c-1.27-.47-2.77-.28-3.84.52-1.15.82-1.63 2.36-1.17 3.73.43 1.34 1.86 2.32 3.28 2.29 1.48.06 2.94-1.01 3.12-2.51.05-.33.02-.67.02-1v-14.4c-.01-.01-.01-.02-.02-.02z" />
                </svg>
              </div>
              <ArrowLeftRight className="w-5 h-5 text-neutral-600 animate-pulse" />
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <span className="font-black text-lg text-black tracking-tight">T-BI</span>
              </div>
            </div>
            <h2 className="text-xl font-black mt-2 text-white">Hubungkan ke TikTok Trend</h2>
            <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
              Aplikasi pihak ketiga <strong>TikTok Trend BI</strong> ingin mengakses akun TikTok Anda.
            </p>
          </div>

          {/* Scope Request list */}
          <div className="bg-[#181818] border border-neutral-800 rounded-xl p-4 space-y-4">
            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-red-500" />
              Izin yang Diminta:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={3} />
                <div>
                  <p className="text-xs font-bold text-neutral-200">Informasi Profil Dasar</p>
                  <p className="text-[10px] text-neutral-400">Membaca username unik, nickname tampilan, dan foto profil Anda.</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={3} />
                <div>
                  <p className="text-xs font-bold text-neutral-200">Metrik Profil Publik</p>
                  <p className="text-[10px] text-neutral-400">Membaca jumlah pengikut (followers) dan statistik video publik.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Secure indicator */}
          <div className="flex items-center gap-2 text-[10px] text-neutral-500 bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-800/40">
            <Lock className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
            <span>Koneksi aman. Password Anda tidak akan dibagikan ke TikTok Trend BI.</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleAuthorize}
              className="w-full py-3 rounded-xl font-black text-sm bg-white hover:bg-neutral-100 text-black transition-all cursor-pointer shadow-lg active:scale-98"
            >
              Izinkan Akses (Authorize)
            </button>
            <button
              onClick={handleCancel}
              className="w-full py-3 rounded-xl font-bold text-sm bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all cursor-pointer active:scale-98"
            >
              Batalkan
            </button>
          </div>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="px-6 py-4 border-t border-neutral-800 text-center text-[10px] text-neutral-600">
        <p>© 2026 TikTok Inc. Developer Portal. Dibuat untuk tujuan simulasi otentikasi lokal.</p>
      </footer>
    </div>
  );
}

export default function TiktokAuthorizePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">Loading Auth Consent...</div>}>
      <TiktokAuthorizeForm />
    </Suspense>
  );
}
