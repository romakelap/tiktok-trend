"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  Hash,
  Tag,
  X,
  Zap,
  Eye,
  TrendingUp,
} from "lucide-react";

import { TOP_VIDEOS, FRONTEND_TO_BACKEND_CAT } from "@/lib/dashboard/mock-data";
import { fmt, fmtPct, fmtRp } from "@/lib/dashboard/formatters";
import type { Category, VideoTier } from "@/lib/dashboard/types";
import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { resolveAvatarUrl } from "@/lib/utils";
import { VideoDetailDrawer } from "./VideoDetailDrawer";

type CategoryDetailProps = {
  category: Category;
  onClose: () => void;
};

function VideoCardCover({
  coverUrl,
  title,
  thumbnailCategory,
  isTop,
}: {
  coverUrl?: string;
  title: string;
  thumbnailCategory: string;
  isTop?: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const resolvedUrl = coverUrl ? resolveAvatarUrl(coverUrl) : "";

  return (
    <div className="relative w-full aspect-video overflow-hidden bg-stone-900">
      {resolvedUrl && !imgError ? (
        <img
          src={resolvedUrl}
          alt={title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
        />
      ) : (
        /* Gradient background per category fallback */
        <div
          className="absolute inset-0"
          style={{
            background: (() => {
              const gradMap: Record<string, string> = {
                tutorial: "linear-gradient(135deg, #1e40af, #3b82f6)",
                vlog: "linear-gradient(135deg, #92400e, #f59e0b)",
                review: "linear-gradient(135deg, #991b1b, #ef4444)",
                tour: "linear-gradient(135deg, #065f46, #10b981)",
                compare: "linear-gradient(135deg, #4c1d95, #8b5cf6)",
              };
              return gradMap[thumbnailCategory] ?? gradMap.tutorial;
            })(),
          }}
        />
      )}
      {/* Subtle dot pattern overlay when fallback */}
      {(!resolvedUrl || imgError) && (
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        />
      )}
      {/* Bottom gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />
      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-9 h-9 rounded-full bg-white/25 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/40 transition-colors shadow-sm">
          <svg
            className="w-3.5 h-3.5 text-white fill-current ml-0.5"
            viewBox="0 0 16 16"
          >
            <path d="M3 2.5l10 5.5-10 5.5V2.5z" />
          </svg>
        </div>
      </div>
      {/* Status badge top-left */}
      {isTop && (
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-white text-[9px] font-bold bg-amber-500 z-10 flex items-center gap-1 shadow-xs">
          ★ Top
        </div>
      )}
      {/* Duration bottom-right */}
      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono z-10 backdrop-blur-xs">
        0:15
      </div>
    </div>
  );
}

// ─── Posting Time Helpers ───────────────────────────────────────────────────
const DAYS_SHORT = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const TIME_SLOTS = [
  { label: "06–09", start: 6, end: 9 },
  { label: "09–12", start: 9, end: 12 },
  { label: "12–15", start: 12, end: 15 },
  { label: "15–18", start: 15, end: 18 },
  { label: "18–21", start: 18, end: 21 },
  { label: "21–24", start: 21, end: 24 },
];

function computePostingSlots(data: any[]) {
  const grid: (number | null)[][] = DAY_ORDER.map(() =>
    Array(TIME_SLOTS.length).fill(null)
  );
  let maxScore = 0;

  for (const pt of data) {
    const dow =
      typeof pt.dayOfWeek === "number" ? pt.dayOfWeek : (pt.day_of_week ?? -1);
    const hour =
      typeof pt.hourOfDay === "number" ? pt.hourOfDay : (pt.hour_of_day ?? -1);
    const score =
      typeof pt.score === "number" ? pt.score : (pt.posting_score ?? 0);
    if (dow < 0 || hour < 0) continue;

    const rowIdx = DAY_ORDER.indexOf(dow);
    if (rowIdx < 0) continue;
    const slotIdx = TIME_SLOTS.findIndex((s) => hour >= s.start && hour < s.end);
    if (slotIdx < 0) continue;

    const existing = grid[rowIdx][slotIdx];
    if (existing === null || score > existing) {
      grid[rowIdx][slotIdx] = score;
      if (score > maxScore) maxScore = score;
    }
  }

  const allSlots: { dayName: string; slotLabel: string; score: number }[] = [];
  grid.forEach((row, ri) =>
    row.forEach((v, si) => {
      if (v !== null) allSlots.push({ dayName: DAYS_SHORT[ri], slotLabel: TIME_SLOTS[si].label, score: v });
    })
  );
  allSlots.sort((a, b) => b.score - a.score);
  return allSlots;
}

export function CategoryDetail({ category, onClose }: CategoryDetailProps) {
  const [detailData, setDetailData] = useState<any>(null);
  const [hashtagsData, setHashtagsData] = useState<any[]>([]);
  const [keywordsData, setKeywordsData] = useState<any[]>([]);
  const [postingTimeData, setPostingTimeData] = useState<any[]>([]);
  const [topVideosData, setTopVideosData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [driverTab, setDriverTab] = useState<"hashtags" | "keywords">("hashtags");
  const [selectedVideoId, setSelectedVideoId] = useState<number | string | null>(null);

  useEffect(() => {
    async function fetchCategoryDetails() {
      try {
        setLoading(true);
        const backendCatName = FRONTEND_TO_BACKEND_CAT[category.id] || category.label;

        const [detailRes, hashtagsRes, keywordsRes, postingTimeRes, topVideosRes] =
          await Promise.all([
            apiFetch<any>(API_ENDPOINTS.category.detail(backendCatName)).catch(() => null),
            apiFetch<any[]>(API_ENDPOINTS.category.hashtags(backendCatName)).catch(() => null),
            apiFetch<any[]>(API_ENDPOINTS.category.keywords(backendCatName)).catch(() => null),
            apiFetch<any[]>(`${API_ENDPOINTS.category.postingTime(backendCatName)}?limit=50`).catch(() => null),
            apiFetch<any[]>(API_ENDPOINTS.category.topVideos(backendCatName)).catch(() => null),
          ]);

        if (detailRes?.success) setDetailData(detailRes.data);
        if (hashtagsRes?.success) setHashtagsData(hashtagsRes.data);
        if (keywordsRes?.success) setKeywordsData(keywordsRes.data);
        if (postingTimeRes?.success) setPostingTimeData(postingTimeRes.data);
        if (topVideosRes?.success) setTopVideosData(topVideosRes.data);
      } catch (error) {
        console.error("Error fetching category details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryDetails();
  }, [category.id, category.label]);

  const viewsVal = detailData ? detailData.totalViews : category.views;
  const engagementVal = detailData
    ? (detailData.avgEngagementRate * 100).toFixed(2)
    : category.engagement;
  const viralVal = detailData ? detailData.avgViralScore : category.viralProb;
  const revenueVal = detailData ? (detailData.totalGmvLocal ?? 0) : category.revenue;

  const topHashtags = (hashtagsData.length > 0 ? hashtagsData : category.topHashtags || []).slice(0, 5);
  const topKeywords = (keywordsData.length > 0 ? keywordsData : category.topKeywords || []).slice(0, 5);

  const rawVideos =
    topVideosData.length > 0
      ? topVideosData.slice(0, 4)
      : (TOP_VIDEOS[category.id] || []).slice(0, 4);

  const videos = rawVideos.map((v: any) => {
    const views = typeof v.viewsNum === "number" ? v.viewsNum : (v.views || 0);
    const engagement =
      typeof v.engagementRate === "number"
        ? Number((v.engagementRate * 100).toFixed(2))
        : (v.engagement || 0);
    const cluster = v.influencerDisplayName
      ? v.influencerDisplayName.replace(/^(IG:|YT\s*:\s*)/i, "")
      : (v.cluster || "General");
    const published = v.publishedAt ? v.publishedAt.split("T")[0] : (v.published || "N/A");
    const title = v.titleBrief || v.title || "TikTok Video";
    const id = v.videoPk || v.id;
    const viralProb = typeof v.viralProbability === "number" ? v.viralProbability : (v.viralProb || 0);

    const coverUrl =
      v.coverUrl ||
      v.cover_url ||
      v.videoCoverUrl ||
      v.video_cover_url ||
      v.cover ||
      v.coverImage ||
      v.imageUrl ||
      v.video_cover ||
      v.videoCover ||
      "";

    return {
      id, title, views,
      likes: typeof v.likesNum === "number" ? v.likesNum : Math.round(views * (engagement / 100) * 0.8),
      comments: typeof v.commentsNum === "number" ? v.commentsNum : Math.round(views * (engagement / 100) * 0.1),
      shares: typeof v.sharesNum === "number" ? v.sharesNum : Math.round(views * (engagement / 100) * 0.1),
      engagement, viralProb, cluster, published,
      echotikVideoId: v.echotikVideoId || "",
      coverUrl,
    };
  });

  const allSlots = computePostingSlots(postingTimeData);
  const top3Slots = allSlots.slice(0, 3);
  const peakDays = top3Slots.map((s) => s.dayName);

  const categoryMetaMap: Record<string, string> = {
    edukasi: "tutorial", komedi: "vlog", kuliner: "review",
    lifestyle: "tour", teknologi: "compare",
  };
  const thumbnailCategory = categoryMetaMap[category.id] || "tutorial";

  return (
    <div className="relative rounded-xl overflow-hidden bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800">
      {loading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xs z-50 flex items-center justify-center">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full border-2 border-stone-200 border-t-stone-900 dark:border-neutral-700 dark:border-t-white animate-spin" />
            <span className="text-xs font-medium text-stone-500 dark:text-neutral-400">Memuat data kategori...</span>
          </div>
        </div>
      )}

      {/* ── Section Header (inline, no card border) ── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          {/* Color dot */}
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: category.color }}
          />
          <span className="text-sm font-bold text-stone-900 dark:text-white">{category.label}</span>
          <span className="px-2 py-0.5 text-[9.5px] font-bold tracking-wide text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded uppercase">
            Active Deep Dive
          </span>
          <span className="text-xs text-stone-400 dark:text-neutral-500">
            · Rangkuman performa inti, akselerasi konten, dan rekomendasi posting
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-neutral-800 text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── 4 Metric Tiles ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-stone-200 dark:divide-neutral-800 border-b border-stone-200 dark:border-neutral-800">
        <div className="px-5 py-4">
          <p className="text-[9.5px] font-bold tracking-widest text-stone-400 dark:text-neutral-500 uppercase mb-1">
            Total Views
          </p>
          <p className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">{fmt(viewsVal)}</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-[9.5px] font-bold tracking-widest text-stone-400 dark:text-neutral-500 uppercase mb-1">
            Engagement Rate
          </p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{engagementVal}%</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-[9.5px] font-bold tracking-widest text-stone-400 dark:text-neutral-500 uppercase mb-1">
            Viral Potential
          </p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight">{fmtPct(viralVal)}</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-[9.5px] font-bold tracking-widest text-stone-400 dark:text-neutral-500 uppercase mb-1">
            Estimated GMV / Rev
          </p>
          <p className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">{fmtRp(revenueVal)}</p>
        </div>
      </div>

      {/* ── Insight Banner (amber) ── */}
      <div className="px-5 py-3 border-b border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 flex items-start gap-2.5">
        <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          <strong>Rekomendasi Aksi & Strategi Konten:</strong>{" "}
          {category.insight ||
            detailData?.contentDirection ||
            "Fokus pada hook 3 detik pertama dengan kombinasi hashtag spesifik untuk mempercepat virality."}
        </p>
      </div>

      {/* ── 2-col Body: Signals + Posting ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-stone-200 dark:divide-neutral-800">

        {/* LEFT: Content Signals */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wide">
                Top Content Signals
              </span>
              {/* Tab switcher */}
              <div className="flex items-center gap-0.5 bg-stone-100 dark:bg-neutral-800 rounded-md p-0.5 ml-1">
                <button
                  type="button"
                  onClick={() => setDriverTab("hashtags")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10.5px] font-semibold transition-all cursor-pointer ${
                    driverTab === "hashtags"
                      ? "bg-white dark:bg-neutral-900 text-stone-900 dark:text-white shadow-sm"
                      : "text-stone-500 dark:text-neutral-400"
                  }`}
                >
                  <Hash className="w-3 h-3" />
                  Top Hashtags
                </button>
                <button
                  type="button"
                  onClick={() => setDriverTab("keywords")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10.5px] font-semibold transition-all cursor-pointer ${
                    driverTab === "keywords"
                      ? "bg-white dark:bg-neutral-900 text-stone-900 dark:text-white shadow-sm"
                      : "text-stone-500 dark:text-neutral-400"
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  Top Keywords
                </button>
              </div>
            </div>
            <Link
              href={driverTab === "hashtags" ? "/hashtag" : "/keyword"}
              className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
            >
              Lihat Semua <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-3 text-[9.5px] font-bold tracking-wider text-stone-400 dark:text-neutral-500 uppercase px-2 mb-1.5">
            <span>Rank & {driverTab === "hashtags" ? "Hashtag" : "Keyword"}</span>
            <span className="text-right">Volume</span>
            <span className="text-right">Velocity</span>
          </div>

          {/* Table rows */}
          <div className="space-y-0.5">
            {driverTab === "hashtags" ? (
              topHashtags.length > 0 ? topHashtags.map((h: any, i: number) => {
                const tagTitle =
                  typeof h === "string"
                    ? h.startsWith("#") ? h : `#${h}`
                    : h.hashtag?.startsWith("#") ? h.hashtag : `#${h.hashtag || "tag"}`;
                const views = h.totalViews ?? 0;
                const eng = h.avgEngagementRate ? `+${(h.avgEngagementRate * 100).toFixed(1)}%` : "Stable";

                return (
                  <div key={i} className="grid grid-cols-3 items-center px-2 py-2 rounded-lg hover:bg-stone-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-stone-400 w-5">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-xs font-bold text-sky-600 dark:text-sky-400">{tagTitle}</span>
                    </div>
                    <span className="text-right text-xs font-semibold text-stone-700 dark:text-neutral-200">
                      {views > 0 ? fmt(views) : "—"}
                    </span>
                    <span className={`text-right text-xs font-bold ${eng.startsWith("+") ? "text-emerald-600 dark:text-emerald-400" : "text-stone-400"}`}>
                      {eng}
                    </span>
                  </div>
                );
              }) : (
                <div className="py-6 text-center text-xs text-stone-400">Belum ada data hashtag</div>
              )
            ) : (
              topKeywords.length > 0 ? topKeywords.map((k: any, i: number) => {
                const kwTitle = typeof k === "string" ? k : k.keyword || "keyword";
                const views = k.totalViews ?? 0;
                const eng = k.avgEngagementRate ? `+${(k.avgEngagementRate * 100).toFixed(1)}%` : "Stable";

                return (
                  <div key={i} className="grid grid-cols-3 items-center px-2 py-2 rounded-lg hover:bg-stone-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-stone-400 w-5">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-xs font-bold text-stone-900 dark:text-white">{kwTitle}</span>
                    </div>
                    <span className="text-right text-xs font-semibold text-stone-700 dark:text-neutral-200">
                      {views > 0 ? fmt(views) : "—"}
                    </span>
                    <span className={`text-right text-xs font-bold ${eng.startsWith("+") ? "text-emerald-600 dark:text-emerald-400" : "text-stone-400"}`}>
                      {eng}
                    </span>
                  </div>
                );
              }) : (
                <div className="py-6 text-center text-xs text-stone-400">Belum ada data keyword</div>
              )
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-stone-100 dark:border-neutral-800 flex items-center justify-between text-[10px]">
            <span className="text-stone-400 dark:text-neutral-500 italic">Algoritma pendorong jangkauan views utama</span>
            <span className="font-bold text-sky-600 dark:text-sky-400">Live Data Engine</span>
          </div>
        </div>

        {/* RIGHT: Posting Window */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wide">
                Best Posting Window & Schedule
              </span>
            </div>
            <Link
              href="/timeposting"
              className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
            >
              Detail Jadwal <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Top slots */}
          <div className="space-y-2 mb-4">
            {top3Slots.length > 0 ? (
              top3Slots.map((slot, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-all ${
                    idx === 0
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50"
                      : "border border-stone-200 dark:border-neutral-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        idx === 0
                          ? "bg-emerald-600 text-white"
                          : "bg-stone-100 dark:bg-neutral-800 text-stone-500 dark:text-neutral-400"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-stone-900 dark:text-white">
                        {slot.dayName} · {slot.slotLabel} WIB
                      </p>
                      {idx === 0 && (
                        <p className="text-[9.5px] text-emerald-600 dark:text-emerald-400 font-medium">
                          Prime nighttime engagement peak
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={`text-[10px] font-black px-2 py-1 rounded ${
                    idx === 0 
                      ? "bg-emerald-600 text-white" 
                      : "text-stone-500 dark:text-neutral-400 border border-stone-200 dark:border-neutral-700"
                  }`}>
                    SCORE {slot.score.toFixed(1)}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-stone-400 border border-dashed border-stone-200 dark:border-neutral-700 rounded-lg">
                Data posting time belum tersedia
              </div>
            )}
          </div>

          {/* Weekly activity bar */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-stone-400 dark:text-neutral-500 mb-2">
              <span>Distribusi Aktivitas Mingguan (Sen – Min)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Hijau = Peak Slot</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {DAY_ORDER.map((dow, ri) => {
                const hasPeak = peakDays.includes(DAYS_SHORT[ri]);
                return (
                  <div
                    key={dow}
                    className={`h-6 rounded flex items-center justify-center text-[9px] font-bold ${
                      hasPeak
                        ? "bg-emerald-500 text-white"
                        : "bg-stone-100 dark:bg-neutral-800 text-stone-500 dark:text-neutral-400"
                    }`}
                  >
                    {DAYS_SHORT[ri]}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Top Benchmark Videos ── */}
      <div className="border-t border-stone-200 dark:border-neutral-800 p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-900 dark:text-white">Top Benchmark Videos</span>
            <span className="px-2 py-0.5 text-[9.5px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 rounded">
              Top 4 Sample
            </span>
          </div>
          <Link
            href="/video-library"
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
          >
            Semua Video di Library <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <p className="text-[11px] text-stone-400 dark:text-neutral-500 mb-4">
          Materi video dengan rasio penyebaran tertinggi dalam klaster terpilih
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {videos.map((v) => {
            const videoUrl = v.echotikVideoId
              ? `https://www.tiktok.com/@tiktok/video/${v.echotikVideoId}`
              : "";

            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVideoId(v.id)}
                className="group text-left rounded-xl overflow-hidden border border-stone-200 dark:border-neutral-800 hover:border-stone-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900 transition-all hover:shadow-sm cursor-pointer"
              >
                <VideoCardCover
                  coverUrl={v.coverUrl}
                  title={v.title}
                  thumbnailCategory={thumbnailCategory}
                  isTop={v.views >= 1_000_000}
                />

                {/* Info */}
                <div className="p-2.5">
                  {/* Creator line */}
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-3.5 h-3.5 rounded-full bg-stone-200 dark:bg-neutral-700 flex-shrink-0" />
                    <span className="text-[10px] text-stone-500 dark:text-neutral-400 truncate">{v.cluster}</span>
                    {v.views >= 300_000 && (
                      <span className="text-[8px] font-bold text-sky-600 dark:text-sky-400 ml-auto flex-shrink-0">✓ Verified</span>
                    )}
                  </div>

                  {/* Title */}
                  <p className="text-[11px] font-semibold text-stone-800 dark:text-neutral-100 leading-snug line-clamp-2 mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors h-8">
                    {v.title}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px] text-stone-500 dark:text-neutral-400">
                      <Eye className="w-3 h-3" />
                      {fmt(v.views)}
                    </span>
                    <span className={`text-[11px] font-bold ${v.engagement > 5 ? "text-emerald-600 dark:text-emerald-400" : "text-stone-500"}`}>
                      {v.engagement}% ER
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Video Detail Modal */}
      {selectedVideoId && (
        <VideoDetailDrawer
          videoId={selectedVideoId}
          onClose={() => setSelectedVideoId(null)}
        />
      )}
    </div>
  );
}
