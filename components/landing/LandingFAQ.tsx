"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Dari mana data TikTok dikumpulkan dan seberapa sering diperbarui?",
      a: "Data dikumpulkan otomatis dari Echotik API (echotik.live) — platform analitik TikTok pihak ketiga. Apache Airflow DAG berjalan setiap 12 jam mengekstraksi data dari 3 endpoint utama: video library, hashtag leaderboard, dan video selling dengan pagination 14 halaman × 30 record per endpoint (mencapai 10.000+ total video).",
      tag: "DATA INGESTION",
    },
    {
      q: "Model Machine Learning apa saja yang digunakan dalam sistem?",
      a: "Sistem mengintegrasikan 5 algoritma ML yang berbeda: Random Forest untuk klasifikasi biner viralitas video (Accuracy ≥ 75%), SVM untuk klasifikasi 4 kelas engagement tier (Precision ≥ 70%), K-Means untuk clustering konten (K=5, Silhouette 0.612), PyTorch 2-Layer LSTM untuk peramalan engagement 7 hari, dan HuggingFace Transformer Seq2Seq untuk NLP auto-summarization dalam Bahasa Indonesia.",
      tag: "ML PIPELINE",
    },
    {
      q: "Berapa banyak kategori konten TikTok yang didukung oleh dashboard?",
      a: "Sistem mendukung 29 kategori konten TikTok yang diklasifikasikan menggunakan pipeline TF-IDF + Classifier. Pada dashboard visualisasi, sistem menyoroti 5 kategori utama: Edukasi & Tutorial, Komedi & Hiburan, Kuliner & Resep, Lifestyle & Home, serta Teknologi & Gadget.",
      tag: "KATEGORI KONTEN",
    },
    {
      q: "Bagaimana arsitektur deployment microservice berjalan?",
      a: "Arsitektur backend di-host pada AWS EC2 (Singapore region) yang menjalankan Spring Boot REST API, FastAPI ML inference, dan Apache Airflow. Basis data relasional menggunakan Aiven Cloud MySQL terkelola, sedangkan frontend Next.js 16 dideploy secara serverless di Vercel.",
      tag: "INFRASTRUKTUR",
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-stone-50/60 dark:bg-neutral-950 border-t border-stone-200/80 dark:border-neutral-800">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
            Pertanyaan Umum &amp; Metodologi Sistem
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-neutral-400 mt-2 leading-relaxed">
            Penjelasan teknis terkait sumber data, validasi model machine learning, dan arsitektur sistem.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-xl border border-stone-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div>
                    <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400 border border-stone-200 dark:border-neutral-700 inline-block mb-2">
                      {faq.tag}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white tracking-tight">
                      {faq.q}
                    </h3>
                  </div>

                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center text-stone-400 shrink-0 mt-1 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-stone-900 dark:text-white" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 sm:px-5 pb-5 pt-0 text-xs text-stone-600 dark:text-neutral-400 leading-relaxed border-t border-stone-100 dark:border-neutral-800/80"
                    >
                      <p className="pt-3">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
