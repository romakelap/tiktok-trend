"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { href: "#architecture", label: "Arsitektur" },
    { href: "#features", label: "Fitur Platform" },
    { href: "#ml-pipeline", label: "Model ML" },
    { href: "#use-cases", label: "Studi Kasus" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? "bg-white/90 backdrop-blur-md border-b border-stone-200/70 shadow-xs py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between">

          {/* Brand Left */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs shadow-xs transition-transform group-hover:scale-105">
              <span className="font-mono text-[11px] tracking-tight">TT</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-black text-base tracking-tight">
                TikTrend BI
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200/80">
                v2.5
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links - Spacious & Clean */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-medium text-stone-600">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-black transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action: Telemetry + Login + CTA Button */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black text-white text-xs font-semibold shadow-xs hover:bg-stone-800 transition-all active:scale-98"
            >
              <span>Dashboard</span>
              <ArrowUpRight size={13} className="text-stone-400 shrink-0" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:text-black hover:bg-stone-100 transition-colors"
              aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden border-t border-stone-200/80 bg-white/98 backdrop-blur-lg px-6 py-5 shadow-lg overflow-hidden"
          >
            <nav className="flex flex-col space-y-2 text-sm font-medium text-stone-700 mb-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl hover:bg-stone-100 transition-colors flex items-center justify-between"
                >
                  <span className="font-semibold text-black">{link.label}</span>
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                Masuk Akun
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-xs font-semibold text-white bg-black hover:bg-stone-800 transition-colors"
              >
                Buka Dashboard Analitik
              </Link>
            </div>

            <div className="pt-4 mt-3 border-t border-stone-100 text-[10px] text-stone-500 font-mono flex items-center justify-between">
              <span>TIKTREND BI SYSTEM</span>
              <span className="text-black font-semibold">SPRING BOOT + FASTAPI</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
