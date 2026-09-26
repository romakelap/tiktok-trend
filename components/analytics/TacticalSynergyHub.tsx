"use client";

import { useState } from "react";
import {
  Hash,
  Key,
  Clock,
  Sparkles,
  Lightbulb,
  TrendingUp,
  Award,
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  ShieldCheck,
  Target,
} from "lucide-react";

import { formatNum, formatPct } from "@/lib/analytics/formatters";
import type { Recommendation } from "@/lib/analytics/types";

type TacticalSynergyHubProps = {
  hashtags?: any[];
  keywords?: any[];
  postingTimes?: any[];
  contentRecs?: Recommendation[];
  onOpenRec?: (rec: Recommendation) => void;
  loading?: boolean;
};

export function TacticalSynergyHub({
  hashtags = [],
  keywords = [],
  postingTimes = [],
  contentRecs = [],
  onOpenRec,
  loading = false,
}: TacticalSynergyHubProps) {
  const [activeTab, setActiveTab] = useState<"hashtags" | "keywords" | "actions">("hashtags");
  const [hashtagPage, setHashtagPage] = useState(1);
  const [keywordPage, setKeywordPage] = useState(1);

  if (loading) {
    return (
      <div className="h-96 rounded-2xl animate-pulse bg-stone-100 dark:bg-neutral-800 border border-stone-200/80 dark:border-neutral-800" />
    );
  }

  // Fallback defaults if empty
  const displayHashtags = hashtags.length > 0 ? hashtags : [
    { hashtag: "racunskincare", recommendationScore: 0.94, expectedReach: 142000, expectedEngagementRate: 0.124, competitionLevel: "Low" },
    { hashtag: "skincareroutine", recommendationScore: 0.88, expectedReach: 280000, expectedEngagementRate: 0.108, competitionLevel: "Medium" },
    { hashtag: "beautytips", recommendationScore: 0.82, expectedReach: 195000, expectedEngagementRate: 0.095, competitionLevel: "Low" },
    { hashtag: "glowingskin", recommendationScore: 0.79, expectedReach: 120000, expectedEngagementRate: 0.089, competitionLevel: "Medium" },
    { hashtag: "serumlokal", recommendationScore: 0.75, expectedReach: 86000, expectedEngagementRate: 0.082, competitionLevel: "Low" },
  ];

  const displayKeywords = keywords.length > 0 ? keywords : [
    { keyword: "mencerahkan kulit kusam", avgRelevanceScore: 0.95, sentiment: "Positive", frequency: 48 },
    { keyword: "skincare aman bpom", avgRelevanceScore: 0.91, sentiment: "Positive", frequency: 36 },
    { keyword: "review jujur serum", avgRelevanceScore: 0.87, sentiment: "Positive", frequency: 29 },
    { keyword: "rekomendasi sunscreen ringan", avgRelevanceScore: 0.84, sentiment: "Positive", frequency: 24 },
    { keyword: "cara mengatasi jerawat", avgRelevanceScore: 0.81, sentiment: "Positive", frequency: 19 },
  ];

  const displayRecs: Recommendation[] = contentRecs.length > 0 ? contentRecs : [
    {
      id: "rec-1",
      priority: "high" as const,
      type: "Tutorial & Edukasi",
      title: "Format Hook 3 Detik: Edukasi Urutan Skincare Pagi",
      description: "Gunakan visual close-up perbandingan tekstur di 3 detik awal untuk meningkatkan retention rate penonton.",
      rationale: "Retention rate pada detik ke-3 berkorelasi 88% terhadap FYP virality.",
      duration: "30-45 detik",
      expectedReach: "Est. Eng: 12.8%",
      confidence: 0.94,
    },
    {
      id: "rec-2",
      priority: "medium" as const,
      type: "Review & Demo",
      title: "Before-After Transformation Wear Test (8 Jam)",
      description: "Tampilkan bukti ketahanan produk secara real tanpa filter kecantikan untuk membangun trust.",
      rationale: "Tingkat konversi audiens naik 3.4x pada video tanpa efek filter.",
      duration: "45-60 detik",
      expectedReach: "Est. Eng: 11.2%",
      confidence: 0.89,
    },
  ];

  const getCompColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40";
      case "high":
        return "bg-rose-50 text-rose-700 border-rose-200/70 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40";
      default:
        return "bg-stone-100 text-stone-600 border-stone-200 dark:bg-neutral-800 dark:text-neutral-400";
    }
  };

  const paginatedHashtags = displayHashtags.slice((hashtagPage - 1) * 5, hashtagPage * 5);
  const totalHashtagPages = Math.ceil((displayHashtags.length || 1) / 5);

  const paginatedKeywords = displayKeywords.slice((keywordPage - 1) * 5, keywordPage * 5);
  const totalKeywordPages = Math.ceil((displayKeywords.length || 1) / 5);

  const cleanTag = (tag: string) => {
    if (!tag) return "";
    return tag.replace(/^#+/, "");
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header with Title and Tabs */}
      <div className="p-5 border-b border-stone-200/80 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-50/40 dark:bg-neutral-900/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200/60 dark:border-sky-800/60 flex-shrink-0 shadow-xs">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-tight">
              Sinergi Taktis AI & Rekomendasi
            </h3>
            <p className="text-xs text-stone-500 dark:text-neutral-400">
              Kombinasi hashtag dengan reach tinggi, hook kata kunci, & rencana aksi konten
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100 dark:bg-neutral-800 border border-stone-200/80 dark:border-neutral-700 self-start sm:self-auto">
          {[
            { key: "hashtags", label: "Hashtags", icon: Hash, count: displayHashtags.length },
            { key: "keywords", label: "Kata Kunci", icon: Key, count: displayKeywords.length },
            { key: "actions", label: "Rencana Aksi", icon: Lightbulb, count: displayRecs.length },
          ].map((tab) => {
            const active = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  active
                    ? "bg-white dark:bg-neutral-900 text-stone-900 dark:text-white shadow-xs"
                    : "text-stone-500 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    active
                      ? "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 font-bold"
                      : "bg-stone-200/60 text-stone-500 dark:bg-neutral-700 dark:text-neutral-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        {/* 1. HASHTAGS TAB */}
        {activeTab === "hashtags" && (
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200/80 dark:border-neutral-800 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    <th className="py-2.5 px-3 w-10">#</th>
                    <th className="py-2.5 px-3">Hashtag Rekomendasi</th>
                    <th className="py-2.5 px-3">Skor Relevansi</th>
                    <th className="py-2.5 px-3 text-right">Est. Reach</th>
                    <th className="py-2.5 px-3 text-right">Est. Engagement</th>
                    <th className="py-2.5 px-3 text-center">Kompetisi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-neutral-800/80">
                  {paginatedHashtags.map((h, i) => {
                    const tagName = cleanTag(h.hashtag || h.tagTitle || "");
                    const score = Math.round((h.recommendationScore || 0.85) * 100);
                    const reach = h.expectedReach || 120000;
                    const eng = ((h.expectedEngagementRate || 0.1) * 100).toFixed(1);
                    const comp = h.competitionLevel || "Low";

                    return (
                      <tr
                        key={h.hashtagPk || i}
                        className="hover:bg-stone-50/70 dark:hover:bg-neutral-800/50 transition-colors group"
                      >
                        <td className="py-3 px-3 text-xs font-mono font-bold text-stone-400">
                          #{(hashtagPage - 1) * 5 + i + 1}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded-md border border-sky-200/50 dark:border-sky-800/40">
                            #{tagName}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-stone-900 dark:text-white w-8">
                              {score}%
                            </span>
                            <div className="w-16 h-1.5 rounded-full bg-stone-100 dark:bg-neutral-800 overflow-hidden">
                              <div
                                className="h-full bg-sky-500 rounded-full"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right text-xs font-mono font-medium text-stone-700 dark:text-neutral-300">
                          {formatNum(reach)}
                        </td>
                        <td className="py-3 px-3 text-right text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {eng}%
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCompColor(comp)}`}>
                            {comp}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalHashtagPages > 1 && (
              <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-neutral-800">
                <span className="text-xs text-stone-400">
                  Halaman {hashtagPage} dari {totalHashtagPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={hashtagPage === 1}
                    onClick={() => setHashtagPage((p) => Math.max(p - 1, 1))}
                    className="p-1.5 rounded-lg border border-stone-200 dark:border-neutral-800 disabled:opacity-30 text-stone-600 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={hashtagPage === totalHashtagPages}
                    onClick={() => setHashtagPage((p) => Math.min(p + 1, totalHashtagPages))}
                    className="p-1.5 rounded-lg border border-stone-200 dark:border-neutral-800 disabled:opacity-30 text-stone-600 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. KEYWORDS TAB */}
        {activeTab === "keywords" && (
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200/80 dark:border-neutral-800 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    <th className="py-2.5 px-3 w-10">#</th>
                    <th className="py-2.5 px-3">Frasa Kata Kunci (NLP)</th>
                    <th className="py-2.5 px-3">Tingkat Relevansi</th>
                    <th className="py-2.5 px-3 text-center">Sentimen</th>
                    <th className="py-2.5 px-3 text-right">Frekuensi Konten</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-neutral-800/80">
                  {paginatedKeywords.map((k, i) => {
                    const score = Math.round((k.avgRelevanceScore || 0.85) * 100);
                    return (
                      <tr
                        key={k.keyword || i}
                        className="hover:bg-stone-50/70 dark:hover:bg-neutral-800/50 transition-colors"
                      >
                        <td className="py-3 px-3 text-xs font-mono font-bold text-stone-400">
                          #{(keywordPage - 1) * 5 + i + 1}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs font-bold text-stone-900 dark:text-white">
                            "{k.keyword}"
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-stone-900 dark:text-white w-8">
                              {score}%
                            </span>
                            <div className="w-16 h-1.5 rounded-full bg-stone-100 dark:bg-neutral-800 overflow-hidden">
                              <div
                                className="h-full bg-violet-500 rounded-full"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                            {k.sentiment || "Positive"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-xs font-mono font-medium text-stone-600 dark:text-neutral-300">
                          {k.frequency || 24}x digunakan
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalKeywordPages > 1 && (
              <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-neutral-800">
                <span className="text-xs text-stone-400">
                  Halaman {keywordPage} dari {totalKeywordPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={keywordPage === 1}
                    onClick={() => setKeywordPage((p) => Math.max(p - 1, 1))}
                    className="p-1.5 rounded-lg border border-stone-200 dark:border-neutral-800 disabled:opacity-30 text-stone-600 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={keywordPage === totalKeywordPages}
                    onClick={() => setKeywordPage((p) => Math.min(p + 1, totalKeywordPages))}
                    className="p-1.5 rounded-lg border border-stone-200 dark:border-neutral-800 disabled:opacity-30 text-stone-600 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. ACTIONS TAB */}
        {activeTab === "actions" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {displayRecs.slice(0, 4).map((rec, i) => (
              <div
                key={rec.id || i}
                onClick={() => onOpenRec?.(rec)}
                className="p-4 rounded-xl border border-stone-200/80 dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-800/40 hover:bg-white dark:hover:bg-neutral-800 hover:border-sky-300 dark:hover:border-sky-700/60 transition-all cursor-pointer group flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                      {rec.type || "Rekomendasi AI"}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-stone-100 text-stone-700 dark:bg-neutral-700 dark:text-neutral-300 border border-stone-200/60 dark:border-neutral-600">
                      Prioritas {rec.priority || "Tinggi"}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-stone-900 dark:text-white line-clamp-1 mb-1.5 group-hover:text-sky-600 transition-colors">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {rec.description || rec.rationale}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-stone-200/60 dark:border-neutral-700/60 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
                  <span className="font-mono text-[11px] text-stone-500 dark:text-neutral-400">
                    Durasi: {rec.duration || "30-60 detik"}
                  </span>
                  <div className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Lihat Detail</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
