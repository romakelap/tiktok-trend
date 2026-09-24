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
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { formatNum, formatPct } from "@/lib/analytics/formatters";
import type { Recommendation } from "@/lib/analytics/types";

type TacticalSynergyHubProps = {
  hashtags: any[];
  keywords: any[];
  postingTimes: any[];
  contentRecs?: Recommendation[];
  onOpenRec?: (rec: Recommendation) => void;
  loading: boolean;
};

export function TacticalSynergyHub({
  hashtags = [],
  keywords = [],
  postingTimes = [],
  contentRecs = [],
  onOpenRec,
  loading = false,
}: TacticalSynergyHubProps) {
  const [activeTab, setActiveTab] = useState<"hashtags" | "keywords" | "times" | "actions">("hashtags");
  const [hashtagPage, setHashtagPage] = useState(1);
  const [keywordPage, setKeywordPage] = useState(1);

  if (loading) {
    return (
      <div className="h-96 rounded-2xl animate-pulse bg-stone-100 dark:bg-neutral-800 border border-stone-200/80 dark:border-neutral-800" />
    );
  }

  // Build synergy chart data
  const chartData = Array.from({ length: 5 }).map((_, idx) => {
    const rank = idx + 1;
    const h = hashtags[idx];
    const p = postingTimes[idx];
    const k = keywords[idx];

    const hashtagScore = h ? parseFloat((h.recommendationScore * 100).toFixed(1)) : 0;
    const hashtagEng = h ? parseFloat((h.expectedEngagementRate * 100).toFixed(2)) : 0;
    const postingEng = p ? parseFloat((p.expectedEngagementRate * 100).toFixed(2)) : 0;
    const keywordRelevance = k ? parseFloat((k.avgRelevanceScore * 100).toFixed(1)) : 0;

    return {
      name: `Top #${rank}`,
      "Hashtag Score (%)": hashtagScore,
      "Hashtag Eng. Rate (%)": hashtagEng,
      "Posting Slot Eng. (%)": postingEng,
      "Keyword Relevance (%)": keywordRelevance,
      hashtagLabel: h ? h.hashtag : "-",
      postingLabel: p ? `${p.dayName} ${p.timeLabel}` : "-",
      keywordLabel: k ? k.keyword : "-",
    };
  });

  const getCompColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "low":
        return "bg-emerald-50 text-emerald-600 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400";
      case "medium":
        return "bg-amber-50 text-amber-600 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-400";
      case "high":
        return "bg-rose-50 text-rose-600 border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400";
      default:
        return "bg-stone-100 text-stone-600 border-stone-200 dark:bg-neutral-800 dark:text-neutral-400";
    }
  };

  const paginatedHashtags = hashtags.slice((hashtagPage - 1) * 5, hashtagPage * 5);
  const totalHashtagPages = Math.ceil((hashtags.length || 1) / 5);

  const paginatedKeywords = keywords.slice((keywordPage - 1) * 5, keywordPage * 5);
  const totalKeywordPages = Math.ceil((keywords.length || 1) / 5);

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col">
      {/* Header & Metric Synergy Overview */}
      <div className="p-5 border-b border-stone-200/80 dark:border-neutral-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-white dark:text-stone-900 shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-tight">
              ML Tactical Synergy Hub
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-neutral-400">
              Cross-feature scoring combining NLP keywords, tag reach, and posting windows
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100 dark:bg-neutral-800 border border-stone-200/60 dark:border-neutral-700 self-start lg:self-auto">
          {[
            { key: "hashtags", label: "Hashtags", icon: Hash, count: hashtags.length },
            { key: "keywords", label: "Keywords", icon: Key, count: keywords.length },
            { key: "times", label: "Posting Windows", icon: Clock, count: postingTimes.length },
            { key: "actions", label: "Tactical Actions", icon: Lightbulb, count: contentRecs.length },
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
                    ? "bg-white dark:bg-neutral-900 text-stone-900 dark:text-white shadow-sm"
                    : "text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                      active
                        ? "bg-stone-100 text-stone-800 dark:bg-neutral-800 dark:text-stone-200"
                        : "bg-stone-200/60 text-stone-500 dark:bg-neutral-700 dark:text-neutral-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mini Synergy Line Chart */}
      <div className="p-5 border-b border-stone-100 dark:border-neutral-800/80 bg-stone-50/50 dark:bg-neutral-950/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-neutral-500">
            Synergy Potential Across Top 5 Ranks
          </span>
          <div className="flex items-center gap-4 text-[10px] font-semibold text-stone-500 dark:text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
              Hashtag Score
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Hashtag Eng. Rate
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block" />
              Keyword Relevance
            </span>
          </div>
        </div>
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: "#78716c" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 10, fontWeight: 700, fill: "#78716c" }}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e7e5e4",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                }}
              />
              <Line
                type="monotone"
                dataKey="Hashtag Score (%)"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ r: 3, fill: "#0ea5e9" }}
              />
              <Line
                type="monotone"
                dataKey="Hashtag Eng. Rate (%)"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3, fill: "#10b981" }}
              />
              <Line
                type="monotone"
                dataKey="Keyword Relevance (%)"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 3, fill: "#8b5cf6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-5 flex-1">
        {/* 1. HASHTAGS TAB */}
        {activeTab === "hashtags" && (
          <div>
            {hashtags.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-6 text-center">
                Belum ada data rekomendasi hashtag.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200/80 dark:border-neutral-800">
                        <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">#</th>
                        <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">Hashtag</th>
                        <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">ML Score</th>
                        <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">Est. Reach</th>
                        <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">Est. Eng.</th>
                        <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">Competition</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-neutral-800">
                      {paginatedHashtags.map((h, i) => (
                        <tr key={h.hashtagPk || i} className="hover:bg-stone-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                          <td className="py-2.5 px-3 text-xs font-mono font-bold text-stone-400">
                            #{(hashtagPage - 1) * 5 + i + 1}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs font-black text-sky-600 dark:text-sky-400">
                              #{h.hashtag || h.tagTitle}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-stone-900 dark:text-white">
                                {((h.recommendationScore || 0) * 100).toFixed(0)}%
                              </span>
                              <div className="w-12 h-1.5 rounded-full bg-stone-100 dark:bg-neutral-800 overflow-hidden">
                                <div
                                  className="h-full bg-sky-500 rounded-full"
                                  style={{ width: `${(h.recommendationScore || 0) * 100}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-xs font-mono font-medium text-stone-600 dark:text-neutral-300">
                            {formatNum(h.expectedReach || 0)}
                          </td>
                          <td className="py-2.5 px-3 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {((h.expectedEngagementRate || 0) * 100).toFixed(1)}%
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCompColor(h.competitionLevel)}`}>
                              {h.competitionLevel || "Medium"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalHashtagPages > 1 && (
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-neutral-800">
                    <span className="text-[11px] text-stone-400">
                      Page {hashtagPage} of {totalHashtagPages}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={hashtagPage === 1}
                        onClick={() => setHashtagPage((p) => Math.max(p - 1, 1))}
                        className="p-1 rounded-md border border-stone-200 dark:border-neutral-800 disabled:opacity-40 text-stone-600 dark:text-neutral-300"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={hashtagPage === totalHashtagPages}
                        onClick={() => setHashtagPage((p) => Math.min(p + 1, totalHashtagPages))}
                        className="p-1 rounded-md border border-stone-200 dark:border-neutral-800 disabled:opacity-40 text-stone-600 dark:text-neutral-300"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 2. KEYWORDS TAB */}
        {activeTab === "keywords" && (
          <div>
            {keywords.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-6 text-center">
                Belum ada data rekomendasi kata kunci.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200/80 dark:border-neutral-800">
                        <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">#</th>
                        <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">Kata Kunci (NLP)</th>
                        <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">Relevance</th>
                        <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">Sentiment</th>
                        <th className="py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">Frequency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-neutral-800">
                      {paginatedKeywords.map((k, i) => (
                        <tr key={k.keyword || i} className="hover:bg-stone-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                          <td className="py-2.5 px-3 text-xs font-mono font-bold text-stone-400">
                            #{(keywordPage - 1) * 5 + i + 1}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs font-black text-stone-900 dark:text-white">
                              "{k.keyword}"
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-stone-900 dark:text-white">
                                {((k.avgRelevanceScore || 0) * 100).toFixed(0)}%
                              </span>
                              <div className="w-12 h-1.5 rounded-full bg-stone-100 dark:bg-neutral-800 overflow-hidden">
                                <div
                                  className="h-full bg-violet-500 rounded-full"
                                  style={{ width: `${(k.avgRelevanceScore || 0) * 100}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400">
                              {k.sentiment || "Positive"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-xs font-mono font-medium text-stone-600 dark:text-neutral-300">
                            {k.frequency || 12}x occurences
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalKeywordPages > 1 && (
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-neutral-800">
                    <span className="text-[11px] text-stone-400">
                      Page {keywordPage} of {totalKeywordPages}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={keywordPage === 1}
                        onClick={() => setKeywordPage((p) => Math.max(p - 1, 1))}
                        className="p-1 rounded-md border border-stone-200 dark:border-neutral-800 disabled:opacity-40 text-stone-600 dark:text-neutral-300"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={keywordPage === totalKeywordPages}
                        onClick={() => setKeywordPage((p) => Math.min(p + 1, totalKeywordPages))}
                        className="p-1 rounded-md border border-stone-200 dark:border-neutral-800 disabled:opacity-40 text-stone-600 dark:text-neutral-300"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 3. POSTING WINDOWS TAB */}
        {activeTab === "times" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {postingTimes.slice(0, 4).map((p, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-stone-50 dark:bg-neutral-800/60 border border-stone-200/80 dark:border-neutral-700/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                    #{i + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-stone-900 dark:text-white">
                      {p.dayName}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-neutral-400">
                      {p.timeLabel}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                    {((p.expectedEngagementRate || 0) * 100).toFixed(1)}% Eng.
                  </span>
                  <span className="text-[10px] text-stone-400">
                    Conf. {((p.confidenceScore || 0.85) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. TACTICAL ACTIONS TAB */}
        {activeTab === "actions" && (
          <div className="space-y-3">
            {contentRecs.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-6 text-center">
                Belum ada rekomendasi taktis.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contentRecs.slice(0, 4).map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => onOpenRec?.(rec)}
                    className="p-4 rounded-xl border border-stone-200/80 dark:border-neutral-800 bg-stone-50/40 dark:bg-neutral-800/40 hover:bg-stone-50 dark:hover:bg-neutral-800 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                          {rec.category}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-stone-100 text-stone-700 dark:bg-neutral-700 dark:text-neutral-300">
                          {rec.priority}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-stone-900 dark:text-white line-clamp-1 mb-1">
                        {rec.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 dark:text-neutral-400 line-clamp-2">
                        {rec.body}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-stone-200/60 dark:border-neutral-700/60 flex items-center justify-between text-[11px] text-sky-600 dark:text-sky-400 font-semibold">
                      <span>Detail Blueprint & Execution</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
