"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import {
  Database,
  Cpu,
  Layers,
  Sparkles,
  Server,
  ArrowRight,
  CheckCircle2,
  GitBranch,
  Cloud,
} from "lucide-react";

export default function LandingArchitecture() {
  const containerRef = useRef<HTMLDivElement>(null);

  const stages = [
    {
      num: "01",
      name: "Airflow Ingestion Pipeline",
      focus: "Data Collection & Extraction",
      question: "“Bagaimana data diekstraksi?”",
      port: "AIRFLOW :8085",
      status: "SCHEDULED 12H",
      active: true,
      desc: "Menjalankan DAG otomatis setiap 12 jam untuk mengambil raw data dari Echotik API (video library, hashtag leaderboard, video selling) dengan pagination 14 halaman × 30 record per endpoint.",
      tech: "Apache Airflow 3 · Python · Echotik REST API · Cron 12h",
      icon: Cloud,
    },
    {
      num: "02",
      name: "Feature Engineering & OLTP",
      focus: "Data Store & Preprocessing",
      question: "“Bagaimana data distrukturkan?”",
      port: "MYSQL :3306",
      status: "20+ TABLES",
      active: true,
      desc: "Membersihkan data mentah, mengekstraksi 22 fitur numerik, menghitung rasio engagement, dan menyimpan dataset terstruktur pada basis data relasional MySQL tiktok_oltp.",
      tech: "MySQL 8.0 · Aiven Cloud · SQLAlchemy · Data Validator",
      icon: Database,
    },
    {
      num: "03",
      name: "FastAPI ML Predictive Service",
      focus: "Model Inference & Analytics",
      question: "“Apa pola dan prediksi ke depan?”",
      port: "FASTAPI :8001",
      status: "5 ML ALGORITHMS",
      active: true,
      desc: "Mengeksekusi inferensi model: Random Forest (viral prob), SVM (tier engagement), K-Means (clustering K=5), PyTorch LSTM (7-day forecast), dan HuggingFace Seq2Seq (summarization).",
      tech: "FastAPI · PyTorch · Scikit-Learn · Transformers mBERT",
      icon: Cpu,
    },
    {
      num: "04",
      name: "Spring Boot & Next.js Frontend",
      focus: "Business Intelligence & Decision UI",
      question: "“Bagaimana hasil disajikan ke user?”",
      port: "SPRING :8082 / NEXT :3000",
      status: "PRODUCTION UI",
      active: true,
      desc: "Menyajikan dashboard interaktif, analitik 29 kategori TikTok, heatmaps waktu posting optimal, visualisasi Recharts, ekspor PDF komparatif, dan JWT authentication.",
      tech: "Spring Boot 3 · Next.js 16 · React 19 · Tailwind CSS",
      icon: Layers,
    },
  ];

  return (
    <section
      ref={containerRef}
      id="architecture"
      className="py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white border-t border-stone-100 text-center relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto mb-10 sm:mb-16 px-2 sm:px-0"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold mb-4">
            <Server size={13} />
            <span>Arsitektur Microservice End-to-End</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black tracking-tight leading-[1.15] mb-3 sm:mb-4">
            4 Komponen Independen Terintegrasi.<br />
            <span className="text-stone-500 font-normal text-lg sm:text-2xl lg:text-3xl block mt-1">
              Ingestion → Feature Store → ML Engine → BI Dashboard
            </span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-stone-600 font-normal leading-relaxed">
            Seluruh pipeline dibangun berbasis framework CRISP-DM pada server AWS EC2 Singapore yang terhubung ke Aiven Cloud Database dan frontend Next.js di Vercel.
          </p>
        </motion.div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left mb-12 sm:mb-16">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5, delay: (idx % 2) * 0.12, ease: "easeOut" }}
                className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 border bg-stone-50/70 border-stone-200 hover:border-stone-300 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 bg-black text-white">
                        <Icon size={17} />
                      </div>
                      <div>
                        <span className="text-[10px] sm:text-xs font-mono text-stone-400 font-semibold block leading-none">
                          TAHAP {stage.num} · {stage.focus}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-black tracking-tight mt-1">
                          {stage.name}
                        </h3>
                      </div>
                    </div>

                    <span className="self-start xs:self-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-semibold bg-stone-200 text-stone-800 shrink-0">
                      {stage.port}
                    </span>
                  </div>

                  <div className="text-[11px] sm:text-xs font-mono font-bold text-stone-900 bg-stone-100 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg mb-3 inline-block">
                    Fokus Inti: {stage.question}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-3.5 sm:pt-4 border-t border-stone-200/70 text-[10px] sm:text-[11px] font-mono text-stone-500">
                  <span className="text-stone-400 block text-[9px] uppercase tracking-wider">Teknologi &amp; Stack</span>
                  <span className="font-semibold text-stone-800">{stage.tech}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trigger Workflow Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-stone-50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-stone-200 text-left space-y-4 shadow-xs"
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 text-xs">
            <span className="font-bold text-black flex items-center gap-1.5">
              <GitBranch size={15} className="text-black" />
              Alur Eksekusi Data Pipeline (E2E Workflow)
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] text-stone-500">
              PIPELINE TRIGGER FLOW
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
              <span className="text-[9px] font-mono text-stone-400 block">LANGKAH 1</span>
              <p className="font-semibold text-black text-xs sm:text-sm">Echotik Scraping</p>
              <p className="text-[11px] text-stone-500">Airflow trigger DAG setiap 12 jam mengekstrak video &amp; hashtag.</p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
              <span className="text-[9px] font-mono text-stone-400 block">LANGKAH 2</span>
              <p className="font-semibold text-black text-xs sm:text-sm">Feature Store Upsert</p>
              <p className="text-[11px] text-stone-500">Validasi skema database &amp; normalisasi data ke tabel MySQL.</p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
              <span className="text-[9px] font-mono text-stone-400 block">LANGKAH 3</span>
              <p className="font-semibold text-black text-xs sm:text-sm">ML Batch Inference</p>
              <p className="text-[11px] text-stone-500">FastAPI menjalankan model Random Forest, SVM, K-Means &amp; LSTM.</p>
            </div>

            <div className="p-3 rounded-xl bg-black text-white space-y-1 shadow-xs">
              <span className="text-[9px] font-mono text-stone-400 block">LANGKAH 4</span>
              <p className="font-semibold text-white text-xs sm:text-sm">BI Visualization</p>
              <p className="text-[11px] text-stone-300">Spring Boot menyajikan API ke Next.js UI untuk eksplorasi analitik.</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
