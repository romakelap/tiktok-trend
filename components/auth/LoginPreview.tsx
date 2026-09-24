"use client";

import { Clock, CheckCircle2 } from "lucide-react";

export function LoginPreview() {
  return (
    <div className="relative z-10 w-full max-w-lg space-y-6 text-left">
      
      {/* Background Radial Glow */}
      <div
        className="absolute -top-20 -left-20 w-80 h-80 pointer-events-none opacity-15 blur-3xl"
        style={{
          background: "radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0.05) 100%)",
        }}
      />

      {/* Header */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-2">
          Applied intelligence<br />
          <span className="text-stone-400 font-normal">for TikTok analytics.</span>
        </h2>

        <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-normal">
          Akses dashboard analitik berbasis 10.000+ video dan 5 algoritma Machine Learning teruji.
        </p>
      </div>

      {/* Main Preview Card - Clean Monochrome & Professional */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-4 shadow-xl">
        
        {/* Cockpit Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
          <div>
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
              STUDI KASUS AKTIF
            </span>
            <span className="font-bold text-white text-xs sm:text-sm">
              @podomorogarden (5 Kategori)
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white/10 text-stone-300 border border-white/15">
            AIVEN MYSQL LIVE
          </span>
        </div>

        {/* 2x2 Metric Grid - Monochrome & Refined */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <span className="text-[10px] font-mono text-stone-400 block">Dataset Video</span>
            <span className="text-lg font-bold font-mono text-white block mt-0.5">10,482</span>
            <span className="text-[10px] text-stone-400">Echotik API 12h</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <span className="text-[10px] font-mono text-stone-400 block">Probabilitas Viral (RF)</span>
            <span className="text-lg font-bold font-mono text-white block mt-0.5">88.4%</span>
            <span className="text-[10px] text-stone-400">Akurasi ≥ 75%</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <span className="text-[10px] font-mono text-stone-400 block">Tier Engagement (SVM)</span>
            <span className="text-sm font-bold font-mono text-white block mt-1">Viral Class</span>
            <span className="text-[10px] text-stone-400">Precision ≥ 70%</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <span className="text-[10px] font-mono text-stone-400 block">LSTM 7-Day Forecast</span>
            <span className="text-lg font-bold font-mono text-white block mt-0.5">+142.5K</span>
            <span className="text-[10px] text-stone-400">PyTorch 2-Layer</span>
          </div>

        </div>

        {/* Optimal Posting Slot Pill */}
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-stone-400">
            <Clock size={13} className="text-stone-400" />
            <span>Rekomendasi Waktu Posting:</span>
          </div>
          <span className="font-bold text-white">Kamis, 19:00 - 21:00 WIB</span>
        </div>

      </div>

      {/* 3 Checkpoint Bullets */}
      <div className="space-y-2 pt-1 text-xs text-stone-300">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-stone-300 shrink-0" />
          <span>Prediksi viral probability sebelum publikasi video</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-stone-300 shrink-0" />
          <span>Peramalan tren views, likes, &amp; shares 7 hari ke depan</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-stone-300 shrink-0" />
          <span>Ringkasan insight otomatis berbasis NLP Transformer</span>
        </div>
      </div>

    </div>
  );
}
