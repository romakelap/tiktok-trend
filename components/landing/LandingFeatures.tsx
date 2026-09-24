"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  TrendingUp,
  Target,
  FileText,
  Hash,
  Key,
  Clock,
  DownloadCloud,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function LandingFeatures() {
  const features = [
    {
      icon: LayoutDashboard,
      num: "01",
      title: "Global Analysis Dashboard",
      desc: "Perbandingan KPI lintas 5 kategori konten utama, total video, hashtag trending, dan visualisasi distribusi engagement dalam satu konsol terpadu.",
      tag: "OVERVIEW",
      link: "/dashboard",
    },
    {
      icon: TrendingUp,
      num: "02",
      title: "Analytics & LSTM Forecast",
      desc: "Histori performa engagement harian dan peramalan tren 7 hari ke depan (views, likes, comments, shares) menggunakan arsitektur deep learning LSTM PyTorch.",
      tag: "TIME SERIES",
      link: "/analytics",
    },
    {
      icon: Target,
      num: "03",
      title: "ML Predictive Intelligence",
      desc: "Skor probabilitas video viral (Random Forest Classifier) dan klasifikasi 4 kelas engagement tier (SVM) berbasis 22 fitur numerik konten.",
      tag: "CLASSIFICATION",
      link: "/video-library",
    },
    {
      icon: FileText,
      num: "04",
      title: "NLP Content Summarization",
      desc: "Ekstraksi ringkasan insight otomatis dan sentimen caption video dalam Bahasa Indonesia menggunakan model Transformer HuggingFace Seq2Seq.",
      tag: "NLP TRANSFORMER",
      link: "/nlp-insight",
    },
    {
      icon: Hash,
      num: "05",
      title: "Hashtag Network & Benchmark",
      desc: "Analisis hashtag trending per kategori, indeks tingkat kompetisi, network graph co-occurrence, serta kombinasi rekomendasi hashtag berkinerja tinggi.",
      tag: "HASHTAG GRAPH",
      link: "/hashtag",
    },
    {
      icon: Key,
      num: "06",
      title: "Keyword & Sentiment Analysis",
      desc: "Ekstraksi kata kunci penting dari ribuan caption TikTok via TF-IDF + NLP, korelasi frekuensi kata terhadap engagement, dan tabel top 50 keyword.",
      tag: "SEMANTIC TEXT",
      link: "/keyword",
    },
    {
      icon: Clock,
      num: "07",
      title: "Posting Time Optimizer",
      desc: "Heatmap waktu unggah optimal (jam × hari), analisis pola puncak audiens per kategori, dan rekomendasi 5 slot posting terbaik berbasis formula scoring.",
      tag: "HEATMAP MATRIX",
      link: "/timeposting",
    },
    {
      icon: DownloadCloud,
      num: "08",
      title: "Export & Automated PDF Report",
      desc: "Export dataset komprehensif ke format Excel/CSV, serta generator laporan PDF analitik komparatif berstandar eksekutif langsung dari browser.",
      tag: "EXPORT ENGINE",
      link: "/export",
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-stone-50/50 border-t border-stone-100">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold mb-4">
            <Sparkles size={13} />
            <span>Fitur Analitik Platform</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black tracking-tight leading-[1.15] mb-4">
            8 Modul Analitik Cerdas untuk Pengambilan Keputusan.
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-stone-600 font-normal leading-relaxed">
            Dirancang khusus untuk memenuhi kebutuhan kreator konten, brand digital commerce, dan peneliti dalam memahami dinamika algoritma TikTok secara data-driven.
          </p>
        </motion.div>

        {/* 8 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.45, delay: (idx % 4) * 0.08, ease: "easeOut" }}
                className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-stone-200 hover:border-stone-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-stone-100 border border-stone-200 text-black flex items-center justify-center font-bold">
                      <Icon size={17} />
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-black tracking-tight mb-2">
                    {f.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed font-normal mb-4">
                    {f.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-medium text-stone-500">
                  <span className="font-mono text-stone-400">MODUL {f.num}</span>
                  <Link
                    href={f.link}
                    className="inline-flex items-center gap-1 text-black font-semibold hover:underline"
                  >
                    <span>Buka</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
