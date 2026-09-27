"use client";

import { motion } from "framer-motion";
import { Cpu, Flame, Layers, FileText, TrendingUp, Clock } from "lucide-react";

export default function LandingMLModels() {
  const models = [
    {
      name: "Random Forest Classifier",
      task: "Prediksi Probabilitas Viral",
      metricColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
      desc: "Mengklasifikasikan kecenderungan video masuk FYP berdasarkan 22 fitur numerik (likes, comments, shares, views velocity, durasi caption).",
      icon: Flame,
      tag: "Supervised Classification",
    },
    {
      name: "K-Means Clustering (K=5)",
      task: "Segmentasi Klaster Semantik",
      metricColor: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800",
      desc: "Pengelompokan otomatis 29 kategori TikTok ke dalam 5 klaster industri utama (Edukasi, Komedi, Kuliner, Lifestyle & Home, Teknologi).",
      icon: Layers,
      tag: "Unsupervised Clustering",
    },
    {
      name: "Bert2Bert Seq2Seq NLP",
      task: "Auto-Summary Narasi & Insight",
      metricColor: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800",
      desc: "Meringkas ribuan komentar & caption video secara otomatis menjadi laporan eksekutif mingguan yang actionable.",
      icon: FileText,
      tag: "NLP Natural Language",
    },
    {
      name: "PyTorch 2-Layer LSTM",
      task: "Peramalan Deret Waktu 7-Hari",
      metricColor: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
      desc: "Memproyeksikan pergerakan engagement rate & views harian untuk 7 hari ke depan dengan arsitektur recurrent neural network.",
      icon: TrendingUp,
      tag: "Deep Time-Series Forecast",
    },
    {
      name: "Posting Time Heatmap Optimizer",
      task: "Rekomendasi Waktu Upload",
      metricColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
      desc: "Menghitung kepadatan interaksi audiens per jam & hari untuk merekomendasikan slot waktu posting paling efektif per kategori.",
      icon: Clock,
      tag: "Matrix Optimization",
    },
  ];

  return (
    <section id="ml-models" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-stone-50/60 dark:bg-neutral-950 border-t border-stone-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
            5 Algoritma Machine Learning Terintegrasi
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-neutral-400 mt-2 leading-relaxed">
            Model statistik &amp; kecerdasan buatan terkonfigurasi untuk memprediksi performa konten TikTok secara akurat.
          </p>
        </div>

        {/* 5-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 flex flex-col justify-between hover:border-stone-400 dark:hover:border-neutral-700 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[9.5px] font-bold font-mono tracking-wider text-stone-400 dark:text-neutral-500 uppercase">
                    {m.tag}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-neutral-800 flex items-center justify-center text-stone-900 dark:text-white flex-shrink-0">
                    <m.icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white tracking-tight">
                    {m.name}
                  </h3>
                </div>

                <p className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 mb-2">
                  {m.task}
                </p>

                <p className="text-xs text-stone-600 dark:text-neutral-400 leading-relaxed mb-4">
                  {m.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-neutral-800 flex items-center justify-between text-[10px] font-mono text-stone-400 dark:text-neutral-500">
                <span>Model Inference Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">ONLINE</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
