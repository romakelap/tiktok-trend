"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default function LandingNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-stone-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Version Tag */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-stone-900 dark:bg-white text-white dark:text-stone-900 flex items-center justify-center font-black text-xs shadow-xs transition-transform group-hover:scale-105">
              TT
            </div>
            <span className="font-extrabold text-base tracking-tight text-stone-900 dark:text-white">
              TikTrend
            </span>
          </Link>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-stone-600 dark:text-neutral-400">
          <a
            href="#workbench"
            className="hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            Interactive Workbench
          </a>
          <a
            href="#architecture"
            className="hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            Arsitektur Pipeline
          </a>
          <a
            href="#ml-models"
            className="hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            Model ML &amp; Akurasi
          </a>
          <a
            href="#use-cases"
            className="hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            Studi Kasus
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          <a
            href="#faq"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs font-semibold text-stone-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-stone-400" />
            <span>Dokumentasi CRISP-DM</span>
          </a>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-bold shadow-xs hover:bg-stone-800 dark:hover:bg-stone-100 transition-all cursor-pointer"
          >
            <span>Buka Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
