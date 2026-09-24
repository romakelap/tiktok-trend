"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Activity } from "lucide-react";

export default function LandingCTA() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white text-center relative overflow-hidden border-t border-stone-100">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-3xl p-8 sm:p-14 bg-black text-white relative overflow-hidden shadow-2xl"
        >
          {/* Subtle Ambient Background Gradient in Dark Card */}
          <div
            className="absolute top-0 right-0 w-80 h-80 pointer-events-none opacity-25 blur-3xl"
            style={{
              background: "radial-gradient(circle, #a855f7 0%, #06b6d4 100%)",
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono text-stone-200">
              <Activity size={12} className="text-emerald-400 animate-pulse" />
              <span>PRODUCTION LIVE · TIKTREND BI</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white">
              Siap Mengeksplorasi Analitik Tren TikTok?
            </h2>

            <p className="text-xs sm:text-base text-stone-300 leading-relaxed max-w-xl mx-auto font-normal">
              Akses dashboard interaktif, uji prediksi probabilitas viral video, dan dapatkan peramalan engagement 7 hari ke depan berbasis machine learning.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-black text-xs sm:text-sm font-semibold hover:bg-stone-100 transition-all shadow-lg"
              >
                <span>Buka Dashboard Analitik</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 text-white text-xs sm:text-sm font-semibold hover:bg-white/20 transition-all border border-white/15"
              >
                <span>Daftar Akun Baru</span>
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-[10px] sm:text-[11px] font-mono text-stone-400">
              <span>✓ 10,000+ DATASET VIDEO</span>
              <span>•</span>
              <span>✓ 5 MODEL ML PREDIKSI</span>
              <span>•</span>
              <span>✓ 29 KATEGORI KONTEN</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
