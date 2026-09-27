"use client";

import { motion } from "framer-motion";
import { Cloud, Database, Cpu, Layers, ArrowRight } from "lucide-react";

export default function LandingArchitecture() {
  const stages = [
    {
      num: "01",
      name: "Airflow Ingestion Pipeline",
      focus: "Data Collection & Extraction",
      port: "AIRFLOW SERVICE",
      status: "SCHEDULED 12H",
      desc: "Menjalankan DAG otomatis setiap 12 jam untuk mengambil raw data dari Echotik API (video library, hashtag leaderboard, video selling) dengan pagination 14 halaman × 30 record per endpoint.",
      tech: "Apache Airflow 3 · Python · Echotik REST API",
      icon: Cloud,
    },
    {
      num: "02",
      name: "Feature Engineering & OLTP",
      focus: "Data Store & Preprocessing",
      port: "MANAGED MYSQL",
      status: "20+ TABLES",
      desc: "Membersihkan data mentah, mengekstraksi 22 fitur numerik, menghitung rasio engagement, dan menyimpan dataset terstruktur pada basis data relasional MySQL tiktok_oltp.",
      tech: "MySQL 8.0 · Aiven Cloud · SQLAlchemy",
      icon: Database,
    },
    {
      num: "03",
      name: "FastAPI ML Predictive Service",
      focus: "Model Inference & Analytics",
      port: "FASTAPI ML ENGINE",
      status: "5 ML MODELS",
      desc: "Mengeksekusi inferensi model: Random Forest (viral prob), SVM (tier engagement), K-Means (clustering K=5), PyTorch LSTM (7-day forecast), dan HuggingFace Seq2Seq.",
      tech: "FastAPI · PyTorch · Scikit-Learn · Transformers",
      icon: Cpu,
    },
    {
      num: "04",
      name: "Spring Boot & Next.js BI UI",
      focus: "Business Intelligence & Action UI",
      port: "NEXT.JS APP",
      status: "PRODUCTION UI",
      desc: "Menyajikan dashboard interaktif, analitik 29 kategori TikTok, heatmaps waktu posting optimal, visualisasi Recharts, ekspor PDF komparatif, dan JWT authentication.",
      tech: "Spring Boot 3 · Next.js 16 · React 19 · Recharts",
      icon: Layers,
    },
  ];

  return (
    <section id="architecture" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-950 border-t border-stone-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
            4-Stage Microservice Value Creation Architecture
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-neutral-400 mt-2 leading-relaxed">
            Arsitektur pengolahan data end-to-end dari scraping API, vektorisasi semantik, inferensi ML, hingga visualisasi BI interaktif.
          </p>
        </div>

        {/* 4-Stage Horizontal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((stg, i) => (
            <motion.div
              key={stg.num}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 flex flex-col justify-between hover:border-sky-400 dark:hover:border-sky-500 transition-all shadow-xs group"
            >
              <div>
                {/* Stage header */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xl font-black font-mono text-stone-300 dark:text-neutral-600 group-hover:text-sky-500 transition-colors">
                    {stg.num}
                  </span>
                  <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400 border border-stone-200 dark:border-neutral-700">
                    {stg.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <stg.icon className="w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0" />
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white tracking-tight">
                    {stg.name}
                  </h3>
                </div>

                <p className="text-[10px] font-mono text-stone-400 dark:text-neutral-500 mb-3 uppercase tracking-wide">
                  {stg.focus}
                </p>

                <p className="text-xs text-stone-600 dark:text-neutral-400 leading-relaxed mb-4">
                  {stg.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-neutral-800 flex items-center justify-between text-[10px] font-mono text-stone-400 dark:text-neutral-500">
                <span className="truncate">{stg.tech}</span>
                <span className="font-bold text-stone-600 dark:text-neutral-300 flex-shrink-0">{stg.port}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
