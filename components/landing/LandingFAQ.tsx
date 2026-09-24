"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, CheckCircle2 } from "lucide-react";

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
      a: "Sistem mendukung 29 kategori konten TikTok yang diklasifikasikan menggunakan pipeline TF-IDF + Classifier. Pada dashboard visualisasi, sistem menyoroti 5 kategori utama: Edukasi & Tutorial, Komedi & Hiburan, Kuliner & Resep, Lifestyle & Home, serta Teknologi & Gadget untuk studi kasus akun @podomorogarden.",
      tag: "KATEGORI KONTEN",
    },
    {
      q: "Bagaimana arsitektur deployment microservice berjalan?",
      a: "Arsitektur backend di-host pada AWS EC2 (Singapore region) yang menjalankan Spring Boot REST API di port :8082, FastAPI ML inference di port :8001, dan Apache Airflow di port :8080/8085. Basis data relasional menggunakan Aiven Cloud MySQL terkelola, sedangkan frontend Next.js 16 dideploy secara serverless di Vercel dengan proteksi proxy reverse-rewrites.",
      tag: "INFRASTRUKTUR",
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white border-t border-stone-100">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold mb-4">
            <HelpCircle size={13} />
            <span>Pertanyaan Umum (FAQ)</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black tracking-tight leading-[1.15] mb-4">
            Pertanyaan Seputar Riset &amp; Platform.
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-stone-600 font-normal leading-relaxed">
            Penjelasan teknis terkait sumber data, validasi model machine learning, dan arsitektur sistem.
          </p>
        </motion.div>

        {/* FAQ Accordion List */}
        <div className="space-y-3 sm:space-y-4 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.08, ease: "easeOut" }}
                className="rounded-2xl border border-stone-200 bg-stone-50/70 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-700 block w-fit mb-2">
                      {faq.tag}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-black tracking-tight">
                      {faq.q}
                    </h3>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-600 shrink-0 mt-1 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-black text-white" : ""
                    }`}
                  >
                    <ChevronDown size={15} />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-200/60 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
