"use client";

import { motion } from "framer-motion";
import { Brain, Cpu, Target, TrendingUp, Sparkles, CheckCircle2, BarChart2 } from "lucide-react";

export default function LandingMLModels() {
  const models = [
    {
      num: "01",
      name: "Random Forest Classifier",
      task: "Viral Probability Prediction",
      type: "Supervised Classification",
      metricBadge: "Accuracy ≥ 75%",
      metricLabel: "EVALUASI METRIK",
      popular: true,
      desc: "Memprediksi apakah sebuah konten video memiliki probabilitas tinggi untuk viral menggunakan 22 fitur numerik yang diekstraksi dari profil dan performa konten.",
      features: [
        "Follower count & ratio author authority",
        "Video duration (detik) & caption word length",
        "Jumlah & density hashtag trending",
        "Initial engagement velocity (like/view ratio)",
      ],
      icon: Target,
    },
    {
      num: "02",
      name: "Support Vector Machine (SVM)",
      task: "Engagement Tier Classification",
      type: "Multi-class Classification",
      metricBadge: "Precision ≥ 70%",
      metricLabel: "4 TIER KELAS",
      popular: false,
      desc: "Mengklasifikasikan performa engagement video ke dalam 4 tingkatan spesifik: Low, Medium, High, dan Viral untuk segmentasi performa konten.",
      features: [
        "Hyperplane margin optimization",
        "Kernel RBF multi-dimensional mapping",
        "Klasifikasi 4 tingkat: Low / Med / High / Viral",
        "Segmentasi benchmark performa akun",
      ],
      icon: BarChart2,
    },
    {
      num: "03",
      name: "K-Means Clustering",
      task: "Semantic Content Grouping",
      type: "Unsupervised Clustering",
      metricBadge: "Silhouette 0.612",
      metricLabel: "K = 5 CLUSTERS",
      popular: false,
      desc: "Mengelompokkan 10.000+ video ke dalam 5 klaster konten berdasarkan kemiripan pola semantik dan karakteristik engagement tanpa label manual.",
      features: [
        "Optimasi Elbow Method & Silhouette Score",
        "5 Klaster konten dominan di ekosistem TikTok",
        "Identifikasi pola konten dengan engagement tertinggi",
        "Karakterisasi tipe video per klaster",
      ],
      icon: Brain,
    },
    {
      num: "04",
      name: "PyTorch 2-Layer LSTM",
      task: "7-Day Time-Series Forecasting",
      type: "Deep Learning (Recurrent)",
      metricBadge: "PyTorch 2-Layer",
      metricLabel: "14-DAY LAG INPUT",
      popular: false,
      desc: "Model peramalan deret waktu untuk memproyeksikan metrik engagement (views, likes, comments, shares) selama 7 hari ke depan dari 14 hari riwayat data.",
      features: [
        "Arsitektur 2-Layer LSTM dengan Dropout regularizer",
        "Input sekuensial 14 hari riwayat metrik akun",
        "Output multi-step 7 hari proyeksi harian",
        "Estimasi pertumbuhan audiens dan batas keyakinan",
      ],
      icon: TrendingUp,
    },
    {
      num: "05",
      name: "HuggingFace Transformer",
      task: "NLP Auto Summarization & Sentiment",
      type: "Seq2Seq Language Model",
      metricBadge: "Seq2Seq · mBERT",
      metricLabel: "BAHASA INDONESIA",
      popular: false,
      desc: "Model transformer Seq2Seq terlatih untuk membaca ribuan caption video dan menyusun ringkasan insight performa mingguan dalam Bahasa Indonesia.",
      features: [
        "Ekstraksi sentimen caption & keyword dominan",
        "Generasi teks ringkasan eksekutif otomatis",
        "Peringkasan insight audiens lintas kategori",
        "Integrasi langsung ke modul NLP Insight",
      ],
      icon: Sparkles,
    },
  ];

  return (
    <section id="ml-pipeline" className="py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white border-t border-stone-100">
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
            <Brain size={13} />
            <span>Machine Learning Pipeline</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black tracking-tight leading-[1.15] mb-4">
            5 Algoritma Machine Learning Khusus.
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-stone-600 font-normal leading-relaxed">
            Setiap algoritma memiliki peranan spesifik dalam pipeline analitik — mulai dari klasifikasi biner viralitas hingga deep learning time-series forecasting.
          </p>
        </motion.div>

        {/* 5 Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 text-left mb-12">
          {models.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.1, ease: "easeOut" }}
                className={`rounded-2xl sm:rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                  m.popular
                    ? "bg-black text-white border-black shadow-xl ring-2 ring-black/10 hover:-translate-y-1"
                    : "bg-stone-50/70 border-stone-200 hover:border-stone-300 hover:shadow-md hover:-translate-y-1"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        m.popular ? "bg-white/15 text-white" : "bg-stone-200 text-black"
                      }`}
                    >
                      <Icon size={17} />
                    </div>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        m.popular
                          ? "bg-white/15 text-white border border-white/20"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {m.type}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold block mb-1 uppercase tracking-wider ${
                      m.popular ? "text-stone-400" : "text-stone-400"
                    }`}
                  >
                    MODEL {m.num} · {m.task}
                  </span>

                  <h3
                    className={`text-lg font-bold tracking-tight mb-3 ${
                      m.popular ? "text-white" : "text-black"
                    }`}
                  >
                    {m.name}
                  </h3>

                  <p
                    className={`text-xs leading-relaxed font-normal mb-5 ${
                      m.popular ? "text-stone-300" : "text-stone-600"
                    }`}
                  >
                    {m.desc}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    {m.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2 text-[11px]">
                        <CheckCircle2
                          size={13}
                          className={`shrink-0 mt-0.5 ${
                            m.popular ? "text-emerald-400" : "text-emerald-600"
                          }`}
                        />
                        <span className={m.popular ? "text-stone-200" : "text-stone-700"}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`pt-3.5 border-t flex items-center justify-between text-xs ${
                    m.popular ? "border-white/10" : "border-stone-200"
                  }`}
                >
                  <span
                    className={`font-mono text-[9px] uppercase tracking-wider ${
                      m.popular ? "text-stone-400" : "text-stone-400"
                    }`}
                  >
                    {m.metricLabel}
                  </span>
                  <span
                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                      m.popular
                        ? "bg-white text-black"
                        : "bg-black text-white"
                    }`}
                  >
                    {m.metricBadge}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
