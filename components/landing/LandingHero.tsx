"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, BarChart2 } from "lucide-react";
import ThreeHeroAnimation from "./ThreeHeroAnimation";

export default function LandingHero() {
  const heroMetrics = [
    {
      label: "DATASET TERINDEKS",
      value: "10,482+",
      sub: "Echotik API Multi-Page",
      color: "text-stone-900 dark:text-white",
    },
    {
      label: "AKURASI PREDIKSI VIRAL",
      value: "88.4%",
      sub: "Random Forest Classifier",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "KLASTER INDUSTRI",
      value: "29",
      sub: "K-Means Silhouette 0.612",
      color: "text-stone-900 dark:text-white",
    },
    {
      label: "PROYEKSI ENGAGEMENT",
      value: "7-Hari",
      sub: "PyTorch 2-Layer LSTM",
      color: "text-sky-600 dark:text-sky-400",
    },
  ];

  return (
    <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-950 overflow-hidden text-center">
      {/* Three.js Interactive 3D Mesh Animation Background */}
      <ThreeHeroAnimation />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Status Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100/90 dark:bg-neutral-900/90 border border-stone-200/80 dark:border-neutral-800 backdrop-blur-md mb-6"
        >
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 dark:text-white tracking-tight leading-[1.12] mb-6 max-w-4xl mx-auto"
        >
          Inteligensi Prediktif &amp; Analisis Tren TikTok Berbasis{" "}
          <span className="text-[#00a3ad] dark:text-[#00f2fe]  decoration-[#00a3ad]/30">
            Machine Learning
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="text-sm sm:text-base lg:text-lg text-stone-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed mb-8"
        >
          Transformasi 10.000+ data video harian menjadi keputusan konten presisi dengan 5 algoritma terintegrasi: Eliminasi tebak-tebakan konten lewat prediksi probabilitas viral, estimasi engagement 7 hari (LSTM), dan rekomendasi jadwal berbasis data empiris.
        </motion.p>

        {/* Hero CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
        >
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#00c4cf] hover:bg-[#00dce6] text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-stone-950" />
            <span>Eksplorasi Live Dashboard Analitik</span>
          </Link>

          <a
            href="#faq"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 text-stone-800 dark:text-neutral-200 font-bold text-xs sm:text-sm hover:bg-stone-50 dark:hover:bg-neutral-800 transition-all shadow-xs"
          >
            <BarChart2 className="w-4 h-4 text-stone-400" />
            <span>Metrik Validasi Model CRISP-DM</span>
          </a>
        </motion.div>

        {/* 4-Card Metric Grid (matching reference) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.26 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-3.5 rounded-xl border border-stone-200/80 dark:border-neutral-800 text-left shadow-xs"
        >
          {heroMetrics.map((m) => (
            <div
              key={m.label}
              className="p-3.5 rounded-lg bg-stone-50/60 dark:bg-neutral-800/40 border border-stone-200/60 dark:border-neutral-800 flex flex-col justify-between"
            >
              <span className="text-[9.5px] font-bold tracking-widest text-stone-400 dark:text-neutral-500 uppercase mb-1">
                {m.label}
              </span>
              <p className={`text-2xl font-black tracking-tight mb-1 ${m.color}`}>
                {m.value}
              </p>
              <p className="text-[10px] font-mono text-stone-400 dark:text-neutral-500 truncate">
                {m.sub}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
