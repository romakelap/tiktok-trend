"use client";

import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="bg-white dark:bg-neutral-950 border-t border-stone-200/80 dark:border-neutral-800 py-12 px-4 sm:px-6 lg:px-8 text-xs text-stone-500 dark:text-neutral-400">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-stone-100 dark:border-neutral-800">

          {/* Brand & Author Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-stone-900 dark:bg-white text-white dark:text-stone-900 flex items-center justify-center font-black text-xs">
                TT
              </div>
              <span className="font-extrabold text-stone-900 dark:text-white text-base tracking-tight">
                TikTrend
              </span>
            </div>

            <p className="text-xs text-stone-600 dark:text-neutral-400 leading-relaxed max-w-sm">
              Platform Business Intelligence dan Predictive Machine Learning untuk analisis tren performa konten, probabilitas viralitas, dan peramalan engagement TikTok berbasis CRISP-DM framework.
            </p>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 text-[10.5px] font-mono space-y-1">
              <div className="font-bold text-stone-900 dark:text-white">Pengembang &amp; Riset :</div>
              <div className="text-stone-800 dark:text-neutral-200">Nico Revaldo Putra E.A</div>
              <div className="text-stone-400 dark:text-neutral-500">Program Studi S1 Sistem Komputer · ITBS Bali</div>
            </div>
          </div>

          {/* Modul Platform Column */}
          <div className="md:col-span-4 space-y-2.5">
            <span className="font-mono text-[10px] font-bold text-stone-900 dark:text-white uppercase tracking-wider block mb-1">
              MODUL ANALITIK PLATFORM
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="text-stone-900 dark:text-white font-bold hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-2">
                  <span>Global Analysis Dashboard</span>
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-white">
                  Analytics &amp; PyTorch LSTM Forecasting
                </Link>
              </li>
              <li>
                <Link href="/video-library" className="text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-white">
                  ML Predictive Intelligence (Random Forest)
                </Link>
              </li>
              <li>
                <Link href="/nlp-insight" className="text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-white">
                  NLP Transformer Summarization (IndoBERT)
                </Link>
              </li>
              <li>
                <Link href="/timeposting" className="text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-white">
                  Posting Time Heatmap Optimizer
                </Link>
              </li>
            </ul>
          </div>

          {/* Arsitektur Microservice Column */}
          <div className="md:col-span-3 space-y-2.5">
            <span className="font-mono text-[10px] font-bold text-stone-900 dark:text-white uppercase tracking-wider block mb-1">
              ARSITEKTUR MICROSERVICE
            </span>
            <ul className="space-y-1.5 text-xs text-stone-600 dark:text-neutral-400 font-mono">
              <li><a href="#architecture" className="hover:text-stone-900 dark:hover:text-white">Apache Airflow 3 Pipeline</a></li>
              <li><a href="#architecture" className="hover:text-stone-900 dark:hover:text-white">Aiven Cloud MySQL Database</a></li>
              <li><a href="#architecture" className="hover:text-stone-900 dark:hover:text-white">FastAPI ML Engine</a></li>
              <li><a href="#architecture" className="hover:text-stone-900 dark:hover:text-white">Spring Boot REST API</a></li>
              <li><a href="#architecture" className="hover:text-stone-900 dark:hover:text-white">Next.js 16 Vercel Frontend</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-stone-400 dark:text-neutral-500 font-mono">
          <div>&copy; 2026 TikTrend BI · Enterprise Intelligence HQ. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>AUTHOR: NICO REVALDO PUTRA E.A</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
