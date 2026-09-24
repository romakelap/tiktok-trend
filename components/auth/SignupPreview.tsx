"use client";

import {
  TrendingUp,
  Sparkles,
  Target,
} from "lucide-react";

export function SignupPreview() {
  const highlights = [
    {
      num: "01",
      title: "Viral & Tier Classification",
      desc: "Skor probabilitas viralitas Random Forest dan 4 kelas engagement tier SVM dari 22 fitur numerik konten.",
      icon: Target,
      badge: "Accuracy ≥ 75%",
    },
    {
      num: "02",
      title: "LSTM 7-Day Time-Series",
      desc: "Peramalan views, likes, comments, dan shares 7 hari ke depan dari histori 14 hari menggunakan PyTorch recurrent.",
      icon: TrendingUp,
      badge: "PyTorch 2-Layer",
    },
    {
      num: "03",
      title: "NLP Content Summarization",
      desc: "Peringkasan otomatis ribuan caption dan analisis sentimen audiens menggunakan model Transformer Seq2Seq.",
      icon: Sparkles,
      badge: "Seq2Seq mBERT",
    },
  ];

  return (
    <div className="relative z-10 w-full max-w-lg space-y-6 text-left">
      
      {/* Background Radial Glow */}
      <div
        className="absolute -top-20 -right-20 w-80 h-80 pointer-events-none opacity-15 blur-3xl"
        style={{
          background: "radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0.05) 100%)",
        }}
      />

      {/* Header */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-2">
          Solusi data-driven<br />
          <span className="text-stone-400 font-normal">untuk analitik TikTok.</span>
        </h2>

        <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-normal">
          Daftarkan akun Anda dan mulai eksplorasi analitik 10.000+ video, prediksi machine learning, serta rekomendasi waktu posting optimal.
        </p>
      </div>

      {/* 3 Highlight Cards - Monochrome */}
      <div className="space-y-3">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-1.5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white">
                    <Icon size={13} />
                  </div>
                  <span className="font-bold text-white text-xs sm:text-sm">
                    {item.title}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-white/10 text-stone-300 border border-white/15">
                  {item.badge}
                </span>
              </div>

              <p className="text-xs text-stone-400 leading-relaxed pl-8">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Academic Citation Footer Note */}
      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-[11px] text-stone-400 font-mono flex items-center justify-between">
        <span>STIKOM SURABAYA · SISTEM INFORMASI</span>
        <span className="text-white font-bold">RESEARCH PLATFORM</span>
      </div>

    </div>
  );
}
