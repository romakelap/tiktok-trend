"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  TrendingUp,
  Sparkles,
  Flame,
  Clock,
  Database,
  Cpu,
  Layers,
  CheckCircle2,
  BarChart3,
  Search,
  Globe,
  Activity,
  Terminal,
} from "lucide-react";

export default function LandingHero() {
  const metricStats = [
    { label: "Dataset Terkumpul", value: "10,480+", sub: "Video Echotik API" },
    { label: "Model ML Khusus", value: "5 Algoritma", sub: "RF · SVM · LSTM · KM · NLP" },
    { label: "Kategori Konten", value: "29 Kategori", sub: "Klasifikasi Otomatis" },
    { label: "Pipeline Ingestion", value: "12 Jam", sub: "Apache Airflow DAG" },
    { label: "Peramalan Deret Waktu", value: "7 Hari", sub: "PyTorch 2-Layer LSTM" },
  ];

  return (
    <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-10 bg-white text-center relative overflow-hidden">

      {/* Background Subtle Gradient Glow */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] pointer-events-none opacity-35 blur-3xl -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.09) 0%, rgba(59, 130, 246, 0.07) 45%, transparent 75%)",
        }}
      />

      <div className="max-w-6xl mx-auto">

        {/* Academic Authorship Header Badge */}
        <motion.div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: "easeOut" }}
          className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold text-black tracking-tight leading-[1.12] mb-5 sm:mb-6 max-w-4xl mx-auto"
        >
          Sistem Business Intelligence &amp; Predictive Machine Learning Analisis Tren TikTok.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
          className="text-sm sm:text-base lg:text-lg text-stone-600 max-w-3xl mx-auto font-normal leading-relaxed mb-8 sm:mb-10"
        >
          Platform analitik end-to-end berbasis <strong className="text-black font-semibold">10.000+ video TikTok</strong> dari Echotik API. Mengintegrasikan 5 model Machine Learning untuk klasifikasi kategori, deteksi viralitas, analisis sentimen NLP, dan forecasting engagement harian.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 sm:mb-16 w-full sm:w-auto"
        >
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-black text-white text-xs sm:text-sm font-semibold shadow-sm hover:bg-stone-800 transition-all active:scale-98"
          >
            <span>Buka Dashboard Analitik</span>
            <ArrowRight size={14} className="text-stone-400" />
          </Link>
          <a
            href="#architecture"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-stone-100 text-stone-800 text-xs sm:text-sm font-semibold hover:bg-stone-200 transition-all border border-stone-200/90 active:scale-98"
          >
            <span>Eksplorasi Arsitektur Pipeline</span>
          </a>
        </motion.div>

        {/* 5-Column High-Impact Metric Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-stone-50/90 border border-stone-200/90 text-left mb-12 sm:mb-16 shadow-xs"
        >
          {metricStats.map((item, idx) => (
            <div
              key={item.label}
              className={`p-2.5 sm:p-3 ${
                idx < metricStats.length - 1 ? "md:border-r md:border-stone-200" : ""
              }`}
            >
              <div className="text-lg sm:text-2xl font-bold text-black font-mono tracking-tight">
                {item.value}
              </div>
              <div className="text-xs font-semibold text-stone-800 mt-0.5">
                {item.label}
              </div>
              <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                {item.sub}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Clean, Non-Tilted Enterprise Studio Window Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.25, ease: "easeOut" }}
          className="rounded-2xl sm:rounded-3xl border border-stone-300/80 bg-white shadow-xl overflow-hidden text-left"
        >

          {/* Top Window Header (Browser / Studio Bar) */}
          <div className="px-4 py-3 bg-stone-100/90 border-b border-stone-200 flex items-center justify-between gap-4">

            {/* Mac Window Dots */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-400/80 inline-block" />
            </div>

            {/* Simulated Clean Address Bar */}
            <div className="hidden sm:flex items-center justify-center flex-1 max-w-md mx-auto px-3 py-1 rounded-lg bg-white border border-stone-200/80 text-[11px] font-mono text-stone-600 gap-2 shadow-2xs">
              <Globe size={12} className="text-stone-400 shrink-0" />
              <span className="truncate">https://tiktrend.bi/analytics/podomorogarden/overview</span>
            </div>

            {/* Server Status Indicator */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-600 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="hidden xs:inline">AWS EC2 · AIVEN MYSQL</span>
            </div>
          </div>

          {/* Window Body Cockpit */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-white">

            {/* Context Sub-Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
              <div>
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                  STUDI KASUS AKTIF
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h2 className="text-base sm:text-lg font-bold text-black tracking-tight">
                    @podomorogarden — Analisis Benchmark 5 Kategori
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800">
                    LIVE DATA
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                <span>Sinkronisasi Terakhir:</span>
                <span className="font-bold text-black bg-stone-100 px-2 py-0.5 rounded">
                  12 Jam Lalu (Airflow DAG)
                </span>
              </div>
            </div>

            {/* 4 Core In-Cockpit Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                  Total Dataset Video
                </div>
                <div className="text-2xl font-bold font-mono text-black mt-1">
                  10,482
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp size={12} />
                  <span>14 Halaman × 30 Record</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80">
                <div className="text-[10px] font-mono text-purple-700 uppercase tracking-wider">
                  Prediksi Viralitas (RF)
                </div>
                <div className="text-2xl font-bold font-mono text-purple-950 mt-1">
                  88.4% Prob
                </div>
                <div className="text-[11px] text-purple-700 font-semibold flex items-center gap-1 mt-1">
                  <Flame size={12} />
                  <span>Akurasi Model ≥ 75%</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80">
                <div className="text-[10px] font-mono text-blue-700 uppercase tracking-wider">
                  Engagement Tier (SVM)
                </div>
                <div className="text-2xl font-bold font-mono text-blue-950 mt-1">
                  Viral Class
                </div>
                <div className="text-[11px] text-blue-700 font-semibold flex items-center gap-1 mt-1">
                  <CheckCircle2 size={12} />
                  <span>Precision ≥ 70%</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                <div className="text-[10px] font-mono text-amber-800 uppercase tracking-wider">
                  LSTM 7-Day Projection
                </div>
                <div className="text-2xl font-bold font-mono text-amber-950 mt-1">
                  +142.5K
                </div>
                <div className="text-[11px] text-amber-800 font-semibold flex items-center gap-1 mt-1">
                  <Activity size={12} />
                  <span>PyTorch 2-Layer Recurrent</span>
                </div>
              </div>

            </div>

            {/* Split Panel: Left Visual Chart / Right Live Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">

              {/* Left Column: Visual Forecast & Posting Time Heatmap Summary */}
              <div className="lg:col-span-7 p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-black flex items-center gap-1.5">
                    <BarChart3 size={15} />
                    Proyeksi Engagement 7-Hari vs Histori 14-Hari
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                    LSTM DEEP LEARNING
                  </span>
                </div>

                {/* Simulated Clean Chart Curve */}
                <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                    <span>14 Hari Histori</span>
                    <span className="text-blue-600 font-bold">7 Hari Proyeksi LSTM →</span>
                  </div>

                  {/* SVG Chart Line */}
                  <div className="h-24 w-full flex items-end pt-2">
                    <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,75 Q40,65 80,70 T160,55 T240,40 T320,25 T400,15"
                        fill="none"
                        stroke="#000000"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M240,40 T320,25 T400,15"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeDasharray="4 4"
                      />
                      <circle cx="240" cy="40" r="4" fill="#000" />
                      <circle cx="400" cy="15" r="5" fill="#3b82f6" />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono pt-1">
                    <span>H-14</span>
                    <span>Hari Ini (T=0)</span>
                    <span className="text-blue-600 font-bold">H+7 Target</span>
                  </div>
                </div>

                {/* Posting Time Slot Callout */}
                <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Clock size={15} className="text-stone-700" />
                    <span className="text-stone-700">Rekomendasi Waktu Posting Optimal:</span>
                  </div>
                  <span className="font-bold text-black font-mono bg-stone-100 px-2 py-0.5 rounded">
                    Kamis, 19:00 - 21:00 WIB
                  </span>
                </div>
              </div>

              {/* Right Column: NLP Insights & Model Inference Summary */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-black flex items-center gap-1.5">
                    <Sparkles size={15} />
                    Ringkasan NLP HuggingFace &amp; K-Means
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                    TRANSFORMER NLP
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-stone-200 text-xs space-y-2">
                  <div className="text-[10px] font-mono font-bold text-stone-400 uppercase">
                    Auto-Generated Executive Insight:
                  </div>
                  <p className="text-stone-700 leading-relaxed text-[11px]">
                    &ldquo;Kategori <strong className="text-black">Edukasi &amp; Teknologi</strong> menghasilkan rasio interaksi tertinggi (+8.4%). Kombinasi hashtag #EdukasiTikTok dan durasi 20–35 detik memiliki konversi engagement rate optimal.&rdquo;
                  </p>
                </div>

                <div className="space-y-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                    <span className="text-stone-500">K-Means Content Cluster:</span>
                    <span className="font-bold text-black">Cluster #2 (High Viral)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                    <span className="text-stone-500">FastAPI ML Inference Latency:</span>
                    <span className="font-bold text-emerald-600">38ms (Realtime)</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </motion.div>

        {/* 3 Pillars Below Hero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 mt-14 sm:mt-20 text-left">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-2 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-stone-50/80 border border-stone-200 hover:border-stone-300 hover:shadow-xs transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-mono font-bold text-stone-400">01 / INGESTION</span>
              <span className="px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-bold bg-emerald-100 text-emerald-800">
                AIRFLOW DAG
              </span>
            </div>
            <h3 className="text-base font-bold text-black tracking-tight">
              Echotik Ingestion Pipeline
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              Pengumpulan data otomatis setiap 12 jam dari Echotik API mencakup 14 halaman &times; 30 record untuk video library, hashtag leaderboard, dan video selling.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="space-y-2 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-stone-50/80 border border-stone-200 hover:border-stone-300 hover:shadow-xs transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-mono font-bold text-stone-400">02 / PREDICTIVE ML</span>
              <span className="text-[8px] sm:text-[9px] font-mono text-stone-700 font-bold bg-stone-200 px-2 py-0.5 rounded">
                FASTAPI :8001
              </span>
            </div>
            <h3 className="text-base font-bold text-black tracking-tight">
              Predictive ML Services
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              Inferensi 5 model Machine Learning (Random Forest, SVM, K-Means, LSTM PyTorch, dan Seq2Seq HuggingFace) yang teruji akurat pada data aktual TikTok.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="space-y-2 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-stone-50/80 border border-stone-200 hover:border-stone-300 hover:shadow-xs transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-mono font-bold text-stone-400">03 / DECISION BI</span>
              <span className="text-[8px] sm:text-[9px] font-mono text-stone-700 font-bold bg-stone-200 px-2 py-0.5 rounded">
                SPRING &amp; NEXT.JS
              </span>
            </div>
            <h3 className="text-base font-bold text-black tracking-tight">
              Business Intelligence Dashboard
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
              Dashboard analitik 29 kategori, heatmaps jam posting terbaik, grafik interaktif Recharts, dan export PDF laporan komparatif berstandar eksekutif.
            </p>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
