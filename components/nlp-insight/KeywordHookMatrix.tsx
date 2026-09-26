"use client";

import React from 'react';
import {
  Type, ArrowRight, Hash, TrendingUp, Award, ArrowUpRight, Video
} from 'lucide-react';
import {
  KeywordItem,
  HashtagItem,
  VideoItem,
} from '@/lib/nlp-insight/mock-data';
import { formatNum } from './WeeklySummary';

// ─────────────────────────────────────────────────────────────────
// KEYWORD CLOUD (Stone Minimalist Luxury)
// ─────────────────────────────────────────────────────────────────
export function KeywordCloud({ keywords }: { keywords: KeywordItem[] }) {
  const max = Math.max(...keywords.map(k => k.freq), 1);
  const min = Math.min(...keywords.map(k => k.freq), 0);
  const range = max - min || 1;

  const getStyle = (freq: number) => {
    const ratio = (freq - min) / range;
    if (ratio >= 0.75) {
      return 'text-base sm:text-lg font-extrabold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-sm';
    }
    if (ratio >= 0.50) {
      return 'text-sm sm:text-base font-bold bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-700';
    }
    if (ratio >= 0.25) {
      return 'text-xs sm:text-sm font-medium bg-stone-50 dark:bg-stone-800/50 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700/60';
    }
    return 'text-xs font-normal bg-white dark:bg-stone-900 text-stone-500 dark:text-stone-400 border-stone-200/80 dark:border-stone-800';
  };

  return (
    <div className="relative rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center">
              <Type className="w-4.5 h-4.5" strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">Top Kata Kunci</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">{keywords.length} kata kunci terpopuler dari konten</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
            NLP Engine
          </span>
        </div>

        {/* Cloud Chips */}
        <div className="flex flex-wrap items-center gap-2 py-2">
          {keywords.map((k, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all hover:scale-105 cursor-default ${getStyle(k.freq)}`}
            >
              {k.word}
              <span className="text-[10px] opacity-60 font-semibold">{k.freq}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between pt-4 mt-6 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400">
        <div className="flex items-center gap-2">
          <span className="font-medium">Distribusi Frekuensi:</span>
          <span className="font-bold text-stone-800 dark:text-stone-200">Tinggi</span>
          <ArrowRight className="w-3 h-3 text-stone-400" />
          <span>Rendah</span>
        </div>
        <span className="font-semibold text-stone-700 dark:text-stone-300">
          TF-IDF Weighted
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TOP HASHTAGS LIST (Stone Minimalist Luxury)
// ─────────────────────────────────────────────────────────────────
export function TopHashtagsList({ hashtags }: { hashtags: HashtagItem[] }) {
  return (
    <div className="relative rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center">
            <Hash className="w-4.5 h-4.5" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">Hashtag Paling Efektif</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">Peringkat hashtag dengan interaksi tertinggi</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {hashtags.map((h, i) => (
          <div 
            key={i} 
            className="flex items-center justify-between p-3 rounded-xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60 hover:border-stone-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <div>
                <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                  #{h.tag}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Digunakan {h.uses || 0} kali
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
                <TrendingUp className="w-3 h-3" />
                {h.change >= 0 ? `+${h.change}%` : `${h.change}%`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TOP VIDEOS LIST (Stone Minimalist Luxury)
// ─────────────────────────────────────────────────────────────────
export function TopVideosList({ videos }: { videos: VideoItem[] }) {
  return (
    <div className="relative rounded-2xl p-6 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center">
            <Video className="w-4.5 h-4.5" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">Top Performing Videos</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">Konten dengan performa NLP & interaksi terbaik</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.slice(0, 6).map((v, i) => (
          <div 
            key={i}
            className="p-4 rounded-xl bg-stone-50/60 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-200/80 dark:bg-stone-700 text-stone-800 dark:text-stone-200">
                  {v.category || 'General'}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  ER {typeof v.engagement === 'number' ? (v.engagement).toFixed(1) : v.engagement}%
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-2 mb-2">
                {v.title || 'Video Tanpa Judul'}
              </h4>
            </div>

            <div className="pt-3 border-t border-stone-200/40 dark:border-stone-700/40 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span>{formatNum(v.views || 0)} views</span>
              <span className="font-medium text-stone-700 dark:text-stone-300">{v.account || '@tiktok'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
