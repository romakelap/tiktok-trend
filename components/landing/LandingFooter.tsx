"use client";

import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="bg-white border-t border-stone-200/60 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-xs text-stone-500 text-left">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 sm:pb-12 border-b border-stone-100">
          
          {/* Brand & Academic Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs">
                <span className="font-mono">TT</span>
              </div>
              <span className="font-bold text-black text-sm sm:text-base tracking-tight">
                TikTrend BI
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                THESIS RESEARCH
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed max-w-sm">
              Platform Business Intelligence dan Predictive Machine Learning untuk analisis tren performa konten, probabilitas viralitas, dan peramalan engagement TikTok berbasis CRISP-DM framework.
            </p>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-[10px] sm:text-[11px] text-stone-700 font-mono space-y-1">
              <div className="font-bold text-black">Penulis Skripsi &amp; Pengembang :</div>
              <div className="text-stone-900">Nico Revaldo Putra E.A, S.Kom</div>
              <div className="text-stone-500">Program Studi S1 Sistem Informasi · STIKOM Surabaya</div>
            </div>
          </div>

          {/* Modul Platform Column */}
          <div className="md:col-span-4 space-y-2.5">
            <span className="font-mono text-[10px] font-bold text-black uppercase tracking-wider block mb-1">
              MODUL ANALITIK PLATFORM
            </span>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li>
                <Link href="/dashboard" className="hover:text-black flex items-center gap-2 font-medium text-black">
                  <span>Global Analysis Dashboard</span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] bg-emerald-100 text-emerald-800 font-bold">Live</span>
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-black text-stone-600">
                  Analytics &amp; LSTM Forecasting
                </Link>
              </li>
              <li>
                <Link href="/video-library" className="hover:text-black text-stone-600">
                  ML Predictive Intelligence (RF &amp; SVM)
                </Link>
              </li>
              <li>
                <Link href="/nlp-insight" className="hover:text-black text-stone-600">
                  NLP Transformer Summarization
                </Link>
              </li>
              <li>
                <Link href="/hashtag" className="hover:text-black text-stone-600">
                  Hashtag &amp; Keyword Discovery
                </Link>
              </li>
              <li>
                <Link href="/timeposting" className="hover:text-black text-stone-600">
                  Posting Time Optimizer Heatmap
                </Link>
              </li>
              <li>
                <Link href="/export" className="hover:text-black text-stone-600">
                  Export Dataset &amp; PDF Report
                </Link>
              </li>
            </ul>
          </div>

          {/* Arsitektur Microservice Column */}
          <div className="md:col-span-3 space-y-2.5">
            <span className="font-mono text-[10px] font-bold text-black uppercase tracking-wider block mb-1">
              ARSITEKTUR MICROSERVICE
            </span>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li><a href="#architecture" className="hover:text-black font-semibold text-black">Apache Airflow 3 (:8085)</a></li>
              <li><a href="#architecture" className="hover:text-black">Aiven Cloud MySQL (:16095)</a></li>
              <li><a href="#architecture" className="hover:text-black">FastAPI ML Engine (:8001)</a></li>
              <li><a href="#architecture" className="hover:text-black">Spring Boot REST API (:8082)</a></li>
              <li><a href="#architecture" className="hover:text-black">Next.js 16 Vercel Frontend</a></li>
              <li><span className="text-stone-400">AWS EC2 (ap-southeast-1)</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-[11px] text-stone-400 font-mono text-center sm:text-left">
          <div>&copy; 2026 TikTrend BI · Thesis Research Project. All rights reserved.</div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            <span>AUTHOR: NICO REVALDO PUTRA E.A, S.KOM</span>
            <span>SYSTEM v2.5.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
