"use client";

import { motion } from "framer-motion";
import { Users, ShoppingBag, GraduationCap, CheckCircle2 } from "lucide-react";

export default function LandingUseCases() {
  const usecases = [
    {
      num: "01",
      persona: "Growth Executives & Marketers",
      role: "Enterprise Media Strategist",
      icon: Users,
      desc: "Mengambil keputusan alokasi anggaran & kampanye influencer berbasis estimasi engagement LSTM & probabilitas viralitas empiris.",
      points: [
        "Prediksi probabilitas video viral sebelum upload",
        "Rekomendasi hashtag berbasis scoring algoritma",
        "Analisis jam posting terbaik per kategori",
        "Monitoring benchmarking performa akun vs kompetitor",
      ],
    },
    {
      persona: "Quantitative Creators & Agencies",
      role: "Social Media Agency",
      icon: ShoppingBag,
      desc: "Mengeliminasi tebak-tebakan konten bagi klien agency dengan optimasi hashtag velocity & ekstraksi enititas kata kunci NLP.",
      points: [
        "Analisis tren performa konten per kategori produk",
        "Pemantauan engagement dan strategi akun kompetitor",
        "Insight NLP dari konten dengan konversi tertinggi",
        "Ekspor laporan komparatif instan PDF & CSV",
      ],
    },
    {
      persona: "Enterprise Merchants & Affiliates",
      role: "TikTok Shop Merchant",
      icon: GraduationCap,
      desc: "Memaksimalkan penayangan video jualan dengan optimasi jam posting puncak & klasifikasi klaster konten relevan.",
      points: [
        "Pipeline Apache Airflow otomatis setiap 12 jam",
        "5 algoritma Machine Learning terintegrasi penuh",
        "Arsitektur microservice Spring Boot & FastAPI",
        "Basis data relasional MySQL dengan 20+ tabel terstruktur",
      ],
    },
  ];

  return (
    <section id="use-cases" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-950 border-t border-stone-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
            Dirancang untuk Keputusan Konten Berbasis Data
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-neutral-400 mt-2 leading-relaxed">
            Solusi analitik terpadu untuk berbagai pemangku kepentingan ekosistem TikTok.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {usecases.map((uc, i) => (
            <motion.div
              key={uc.persona}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 flex flex-col justify-between hover:border-stone-400 dark:hover:border-neutral-700 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-neutral-800 flex items-center justify-center text-stone-900 dark:text-white flex-shrink-0">
                    <uc.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9.5px] font-bold font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400 border border-stone-200 dark:border-neutral-700">
                    {uc.role}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 dark:text-white tracking-tight mb-2">
                  {uc.persona}
                </h3>

                <p className="text-xs text-stone-600 dark:text-neutral-400 leading-relaxed mb-4">
                  {uc.desc}
                </p>

                <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-neutral-800">
                  {uc.points.map((pt, pi) => (
                    <div key={pi} className="flex items-start gap-2 text-xs text-stone-600 dark:text-neutral-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
