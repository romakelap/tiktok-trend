"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function LandingCTA() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-950 border-t border-stone-200/80 dark:border-neutral-800 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-xl p-8 sm:p-12 bg-stone-900 text-white relative overflow-hidden border border-stone-800 shadow-xl">
          {/* Subtle cyan glow accent */}
          <div
            className="absolute top-0 right-0 w-72 h-72 pointer-events-none opacity-20 blur-3xl"
            style={{
              background: "radial-gradient(circle, #00f2fe 0%, #38bdf8 100%)",
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Siap Mengeksplorasi Analitik Tren TikTok?
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl mx-auto">
              Akses dashboard interaktif, uji prediksi probabilitas viral video, dan dapatkan peramalan engagement 7 hari ke depan berbasis machine learning.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#00c4cf] hover:bg-[#00dce6] text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-stone-950" />
                <span>Buka Dashboard Analitik</span>
              </Link>
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-stone-800 text-stone-200 text-xs sm:text-sm font-bold hover:bg-stone-700 transition-all border border-stone-700"
              >
                <span>Daftar Akun Baru</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono text-stone-400">
              <span>✓ 10,482+ DATASET VIDEO</span>
              <span>·</span>
              <span>✓ 5 MODEL ML PREDIKSI</span>
              <span>·</span>
              <span>✓ 29 KATEGORI KONTEN</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
