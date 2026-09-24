"use client";

import { motion } from "framer-motion";
import { Users, ShoppingBag, GraduationCap, CheckCircle2, Quote } from "lucide-react";

export default function LandingUseCases() {
  const usecases = [
    {
      num: "01",
      persona: "Kreator Konten & Influencer",
      role: "Individual Creator",
      icon: Users,
      quote:
        "“Sebelumnya saya hanya mengandalkan intuisi untuk menentukan hashtag dan waktu posting. Sekarang semua berbasis data aktual dari 10.000+ video.”",
      points: [
        "Prediksi probabilitas video viral sebelum upload",
        "Rekomendasi hashtag berbasis scoring algoritma",
        "Analisis jam posting terbaik per kategori spesifik",
        "Monitoring benchmarking performa akun vs kompetitor",
      ],
    },
    {
      num: "02",
      persona: "Brand & Digital Commerce",
      role: "TikTok Shop & E-commerce",
      icon: ShoppingBag,
      quote:
        "“Dashboard ini membantu kami memahami tren kategori produk dan mengoptimalkan strategi konten TikTok Shop kami secara data-driven.”",
      points: [
        "Analisis tren performa konten per kategori produk",
        "Pemantauan engagement dan strategi akun kompetitor",
        "Insight NLP dari konten dengan konversi tertinggi",
        "Ekspor laporan instan PDF untuk rapat eksekutif",
      ],
    },
    {
      num: "03",
      persona: "Peneliti & Akademisi",
      role: "Studi Kasus Skripsi CRISP-DM",
      icon: GraduationCap,
      quote:
        "“Sistem ini menggabungkan CRISP-DM framework dengan pipeline ML end-to-end — dari collection, ingestion, hingga dashboard visualisasi.”",
      points: [
        "Pipeline Apache Airflow otomatis setiap 12 jam",
        "5 algoritma Machine Learning terintegrasi penuh",
        "Arsitektur microservice Spring Boot & FastAPI",
        "Basis data relasional MySQL dengan 20+ tabel terstruktur",
      ],
    },
  ];

  return (
    <section id="use-cases" className="py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-stone-50/50 border-t border-stone-100">
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
            <Users size={13} />
            <span>Target Persona &amp; Studi Kasus</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black tracking-tight leading-[1.15] mb-4">
            Siapa yang Diuntungkan dari TikTrend BI?
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-stone-600 font-normal leading-relaxed">
            Menjawab kebutuhan operasional konten mulai dari perorangan hingga riset akademis berbasis metodologi CRISP-DM.
          </p>
        </motion.div>

        {/* 3 Use Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 text-left">
          {usecases.map((uc, idx) => {
            const Icon = uc.icon;
            return (
              <motion.div
                key={uc.persona}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: "easeOut" }}
                className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-stone-100 border border-stone-200 text-black flex items-center justify-center font-bold">
                      <Icon size={17} />
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                      {uc.role}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-stone-400 block mb-1">
                    PERSONA {uc.num}
                  </span>

                  <h3 className="text-base font-bold text-black tracking-tight mb-3">
                    {uc.persona}
                  </h3>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 italic leading-relaxed mb-5 relative">
                    <Quote size={12} className="text-stone-300 absolute top-2 right-2" />
                    {uc.quote}
                  </div>

                  <div className="space-y-2 mb-4">
                    {uc.points.map((pt) => (
                      <div key={pt} className="flex items-start gap-2 text-xs text-stone-700 font-medium">
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 text-[10px] font-mono text-stone-400">
                  <span>TIKTREND BI · SOLUTION FIT</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
