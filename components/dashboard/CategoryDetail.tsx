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
  Calendar,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { VideoThumbnail } from "@/components/video-library/VideoThumbnail";
import { TOP_VIDEOS, FRONTEND_TO_BACKEND_CAT } from "@/lib/dashboard/mock-data";
import { fmt, fmtPct, fmtRp } from "@/lib/dashboard/formatters";
import type { Category, VideoTier } from "@/lib/dashboard/types";
import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { VideoDetailDrawer } from "./VideoDetailDrawer";

type CategoryDetailProps = {
  category: Category;
  onClose: () => void;
};

// ─── Compact Posting Time ─────────────────────────────────────────────────────
const DAYS_SHORT = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Mon first
const TIME_SLOTS = [
  { label: "06–09", start: 6, end: 9 },
  { label: "09–12", start: 9, end: 12 },
  { label: "12–15", start: 12, end: 15 },
  { label: "15–18", start: 15, end: 18 },
  { label: "18–21", start: 18, end: 21 },
  { label: "21–24", start: 21, end: 24 },
];

function CompactPostingTime({ data }: { data: any[] }) {
  const grid: (number | null)[][] = DAY_ORDER.map(() =>
    Array(TIME_SLOTS.length).fill(null)
  );
  let maxScore = 0;

  for (const pt of data) {
    const dow =
      typeof pt.dayOfWeek === "number"
        ? pt.dayOfWeek
        : (pt.day_of_week ?? -1);
    const hour =
      typeof pt.hourOfDay === "number"
        ? pt.hourOfDay
        : (pt.hour_of_day ?? -1);
    const score =
      typeof pt.score === "number"
        ? pt.score
        : (pt.posting_score ?? 0);
    if (dow < 0 || hour < 0) continue;

    const rowIdx = DAY_ORDER.indexOf(dow);
    if (rowIdx < 0) continue;

    const slotIdx = TIME_SLOTS.findIndex(
      (s) => hour >= s.start && hour < s.end
    );
    if (slotIdx < 0) continue;

    const existing = grid[rowIdx][slotIdx];
    if (existing === null || score > existing) {
      grid[rowIdx][slotIdx] = score;
      if (score > maxScore) maxScore = score;
    }
  }

  type SlotInfo = {
    dayName: string;
    slotLabel: string;
    score: number;
  };

  const allSlots: SlotInfo[] = [];
  grid.forEach((row, ri) =>
    row.forEach((v, si) => {
      if (v !== null) {
        allSlots.push({
          dayName: DAYS_SHORT[ri],
          slotLabel: TIME_SLOTS[si].label,
          score: v,
        });
      }
    })
  );
  allSlots.sort((a, b) => b.score - a.score);
  const top3 = allSlots.slice(0, 3);

  return (
    <div className="p-4 rounded-xl bg-stone-50/60 dark:bg-neutral-800/40 border border-stone-200/80 dark:border-neutral-800 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-stone-900 dark:text-white uppercase tracking-wider">
              Best Posting Window
            </span>
          </div>
          <Link
            href="/timeposting"
            className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
          >
            <span>Detail Jadwal</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Top 3 Recommendation Cards (Refined Accents) */}
        <div className="space-y-2 mb-3">
          {top3.length > 0 ? (
            top3.map((slot, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                  idx === 0
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300/80 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 shadow-2xs"
                    : "bg-white dark:bg-neutral-900 border-stone-200/70 dark:border-neutral-800 text-stone-800 dark:text-neutral-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[10px] ${
                      idx === 0
                        ? "bg-emerald-600 text-white"
                        : "bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400"
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-bold font-mono">
                      {slot.dayName} · {slot.slotLabel} WIB
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-[10px] text-stone-500 dark:text-neutral-400 uppercase">
                    Score:
                  </span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {slot.score.toFixed(1)}
                  </strong>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-xs text-stone-400 border border-dashed rounded-lg">
              Data posting time belum tersedia
            </div>
          )}
        </div>
      </div>

      {/* Mini Visual Weekday Bar */}
      <div className="pt-2.5 border-t border-stone-200/60 dark:border-neutral-800">
        <div className="flex items-center justify-between text-[10.5px] text-stone-500 dark:text-neutral-400 mb-1.5 font-mono">
          <span>Aktivitas Mingguan (Mon–Sun)</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            Hijau = Peak Slot
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {DAY_ORDER.map((dow, ri) => {
            const hasPeak = top3.some((t) => t.dayName === DAYS_SHORT[ri]);
            return (
              <div
                key={dow}
                className={`h-5 rounded flex items-center justify-center text-[9px] font-mono font-bold ${
                  hasPeak
                    ? "bg-emerald-500 text-white shadow-xs"
                    : "bg-stone-200/80 dark:bg-neutral-700 text-stone-600 dark:text-neutral-300"
                }`}
                title={`Hari ${DAYS_SHORT[ri]}`}
              >
                {DAYS_SHORT[ri]}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function CategoryDetail({ category, onClose }: CategoryDetailProps) {
  const [detailData, setDetailData] = useState<any>(null);
  const [hashtagsData, setHashtagsData] = useState<any[]>([]);
  const [keywordsData, setKeywordsData] = useState<any[]>([]);
  const [postingTimeData, setPostingTimeData] = useState<any[]>([]);
  const [topVideosData, setTopVideosData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [driverTab, setDriverTab] = useState<"hashtags" | "keywords">(
    "hashtags"
  );
  const [selectedVideoId, setSelectedVideoId] = useState<
    number | string | null
  >(null);

  useEffect(() => {
    async function fetchCategoryDetails() {
      try {
        setLoading(true);
        const backendCatName =
          FRONTEND_TO_BACKEND_CAT[category.id] || category.label;

        const [
          detailRes,
          hashtagsRes,
          keywordsRes,
          postingTimeRes,
          topVideosRes,
        ] = await Promise.all([
          apiFetch<any>(API_ENDPOINTS.category.detail(backendCatName)).catch(
            () => null
          ),
          apiFetch<any[]>(
            API_ENDPOINTS.category.hashtags(backendCatName)
          ).catch(() => null),
          apiFetch<any[]>(
            API_ENDPOINTS.category.keywords(backendCatName)
          ).catch(() => null),
          apiFetch<any[]>(
            `${API_ENDPOINTS.category.postingTime(backendCatName)}?limit=50`
          ).catch(() => null),
          apiFetch<any[]>(
            API_ENDPOINTS.category.topVideos(backendCatName)
          ).catch(() => null),
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
  const revenueVal = detailData
    ? (detailData.totalGmvLocal ?? 0)
    : category.revenue;

  const topHashtags = (
    hashtagsData.length > 0 ? hashtagsData : (category.topHashtags || [])
  ).slice(0, 5);

  const topKeywords = (
    keywordsData.length > 0 ? keywordsData : (category.topKeywords || [])
  ).slice(0, 5);

  const rawVideos =
    topVideosData.length > 0
      ? topVideosData.slice(0, 4)
      : (TOP_VIDEOS[category.id] || []).slice(0, 4);

  const videos = rawVideos.map((v: any) => {
    let tier: VideoTier = "Mid";
    const views =
      typeof v.viewsNum === "number" ? v.viewsNum : (v.views || 0);
    if (views >= 1000000) tier = "Top";
    else if (views >= 300000) tier = "High";
    else if (views < 50000) tier = "Low";

    const engagement =
      typeof v.engagementRate === "number"
        ? Number((v.engagementRate * 100).toFixed(2))
        : (v.engagement || 0);

    const cluster = v.influencerDisplayName
      ? v.influencerDisplayName.replace(/^(IG:|YT\s*:\s*)/i, "")
      : (v.cluster || "General");

    const published = v.publishedAt
      ? v.publishedAt.split("T")[0]
      : (v.published || "N/A");

    const title = v.titleBrief || v.title || "TikTok Video";
    const id = v.videoPk || v.id;
    const viralProb =
      typeof v.viralProbability === "number"
        ? v.viralProbability
        : (v.viralProb || 0);

    return {
      id,
      title,
      views,
      likes:
        typeof v.likesNum === "number"
          ? v.likesNum
          : (v.likes || Math.round(views * (engagement / 100) * 0.8)),
      comments:
        typeof v.commentsNum === "number"
          ? v.commentsNum
          : (v.comments || Math.round(views * (engagement / 100) * 0.1)),
      shares:
        typeof v.sharesNum === "number"
          ? v.sharesNum
          : (v.shares || Math.round(views * (engagement / 100) * 0.1)),
      engagement,
      viralProb,
      tier,
      cluster,
      published,
      echotikVideoId: v.echotikVideoId || "",
    };
  });

  return (
    <div className="relative rounded-xl overflow-hidden bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-xs min-h-[360px]">
      {loading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xs z-50 flex items-center justify-center transition-all">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 border-stone-300 border-t-stone-900 dark:border-neutral-700 dark:border-t-white animate-spin" />
            <p className="text-xs font-mono font-medium text-stone-600 dark:text-neutral-400">
              Memuat Data Kategori...
            </p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="p-6 space-y-6">
        {/* 1. Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200/80 dark:border-neutral-800 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-stone-100 dark:bg-neutral-800 border border-stone-200/80 dark:border-neutral-700 flex items-center justify-center text-stone-900 dark:text-white">
              <category.Ico className="w-4 h-4" strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-stone-900 dark:text-white tracking-tight">
                  {category.label}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-stone-100 dark:bg-neutral-800 text-stone-700 dark:text-neutral-300 border border-stone-200 dark:border-neutral-700">
                  Active Deep Dive
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-neutral-400">
                Rangkuman performa inti, akselerasi konten, dan rekomendasi posting
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-stone-200/80 dark:border-neutral-800 hover:bg-stone-100 dark:hover:bg-neutral-800 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Tutup detail kategori"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* 2. Top 4 Core Metrics Banner (Cohesive Accents: Sky Blue & Emerald) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Views (Sky Blue Accent) */}
          <div className="p-3.5 rounded-xl bg-stone-50/60 dark:bg-neutral-800/40 border border-stone-200/80 dark:border-neutral-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-neutral-400 mb-1">
              Total Views
            </p>
            <p className="font-mono font-bold text-lg text-sky-600 dark:text-sky-400">
              {fmt(viewsVal)}
            </p>
          </div>

          {/* Engagement Rate (Emerald Accent) */}
          <div className="p-3.5 rounded-xl bg-stone-50/60 dark:bg-neutral-800/40 border border-stone-200/80 dark:border-neutral-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-neutral-400 mb-1">
              Engagement Rate
            </p>
            <p className="font-mono font-bold text-lg text-emerald-600 dark:text-emerald-400">
              {engagementVal}%
            </p>
          </div>

          {/* Viral Potential */}
          <div className="p-3.5 rounded-xl bg-stone-50/60 dark:bg-neutral-800/40 border border-stone-200/80 dark:border-neutral-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-neutral-400 mb-1">
              Viral Potential
            </p>
            <p className="font-mono font-bold text-lg text-stone-900 dark:text-white">
              {fmtPct(viralVal)}
            </p>
          </div>

          {/* GMV / Revenue */}
          <div className="p-3.5 rounded-xl bg-stone-50/60 dark:bg-neutral-800/40 border border-stone-200/80 dark:border-neutral-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-neutral-400 mb-1">
              GMV / Revenue
            </p>
            <p className="font-mono font-bold text-lg text-stone-900 dark:text-white">
              {fmtRp(revenueVal)}
            </p>
          </div>
        </div>

        {/* 3. Executive Strategic Insight Banner */}
        <div className="p-3.5 rounded-xl bg-stone-50/60 dark:bg-neutral-800/40 border border-stone-200/80 dark:border-neutral-800 flex items-start gap-3">
          <div className="w-6 h-6 rounded-md bg-stone-900 dark:bg-white text-white dark:text-stone-900 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div className="text-xs text-stone-700 dark:text-neutral-300 leading-relaxed">
            <strong className="text-stone-900 dark:text-white font-bold">
              Rekomendasi Aksi & Strategi Konten:{" "}
            </strong>
            {category.insight ||
              detailData?.contentDirection ||
              "Fokus pada hook 3 detik pertama dengan kombinasi hashtag spesifik untuk mempercepat virality."}
          </div>
        </div>

        {/* 4. 2-Column Bento: Content Drivers (Hashtag/Keyword) vs Best Posting Window */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* LEFT: Content Drivers (Hashtags & Keywords Tabbed) */}
          <div className="p-4 rounded-xl bg-stone-50/60 dark:bg-neutral-800/40 border border-stone-200/80 dark:border-neutral-800 flex flex-col justify-between">
            <div>
              {/* Tab Switcher Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-stone-200/60 dark:bg-neutral-800 border border-stone-300/60 dark:border-neutral-700/60">
                  <button
                    type="button"
                    onClick={() => setDriverTab("hashtags")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      driverTab === "hashtags"
                        ? "bg-white dark:bg-neutral-900 text-stone-900 dark:text-white shadow-xs"
                        : "text-stone-600 dark:text-neutral-400 hover:text-stone-900"
                    }`}
                  >
                    <Hash className="w-3 h-3 text-sky-500" />
                    <span>Top Hashtags</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDriverTab("keywords")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      driverTab === "keywords"
                        ? "bg-white dark:bg-neutral-900 text-stone-900 dark:text-white shadow-xs"
                        : "text-stone-600 dark:text-neutral-400 hover:text-stone-900"
                    }`}
                  >
                    <Tag className="w-3 h-3 text-stone-500" />
                    <span>Top Keywords</span>
                  </button>
                </div>

                <Link
                  href={driverTab === "hashtags" ? "/hashtag" : "/keyword"}
                  className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
                >
                  <span>Lihat Semua</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Drivers List */}
              <div className="space-y-2">
                {driverTab === "hashtags" ? (
                  topHashtags.length > 0 ? (
                    topHashtags.map((h: any, i: number) => {
                      const tagTitle =
                        typeof h === "string"
                          ? h.startsWith("#")
                            ? h
                            : `#${h}`
                          : h.hashtag?.startsWith("#")
                          ? h.hashtag
                          : `#${h.hashtag || "tag"}`;
                      const views = h.totalViews ?? 0;
                      const eng = h.avgEngagementRate
                        ? `${(h.avgEngagementRate * 100).toFixed(1)}%`
                        : "—";

                      return (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-stone-200/70 dark:border-neutral-800"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-[10px] bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400 flex-shrink-0">
                              #{i + 1}
                            </span>
                            <span className="font-mono font-bold text-xs text-sky-600 dark:text-sky-400 truncate">
                              {tagTitle}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 font-mono text-xs text-right flex-shrink-0">
                            {views > 0 && (
                              <span className="text-stone-900 dark:text-white font-semibold">
                                {fmt(views)}
                              </span>
                            )}
                            {eng !== "—" && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                {eng}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-3 text-center text-xs text-stone-400 border border-dashed rounded-lg">
                      Belum ada data hashtag
                    </div>
                  )
                ) : topKeywords.length > 0 ? (
                  topKeywords.map((k: any, i: number) => {
                    const kwTitle =
                      typeof k === "string" ? k : k.keyword || "keyword";
                    const views = k.totalViews ?? 0;
                    const eng = k.avgEngagementRate
                      ? `${(k.avgEngagementRate * 100).toFixed(1)}%`
                      : "—";

                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-stone-200/70 dark:border-neutral-800"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-[10px] bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400 flex-shrink-0">
                            #{i + 1}
                          </span>
                          <span className="font-bold text-xs text-stone-900 dark:text-white truncate">
                            {kwTitle}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 font-mono text-xs text-right flex-shrink-0">
                          {views > 0 && (
                            <span className="text-stone-900 dark:text-white font-semibold">
                              {fmt(views)}
                            </span>
                          )}
                          {eng !== "—" && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {eng}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 text-center text-xs text-stone-400 border border-dashed rounded-lg">
                    Belum ada data keyword
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 pt-2 text-[10.5px] text-stone-400 border-t border-stone-200/60 dark:border-neutral-800 flex items-center justify-between font-mono">
              <span>5 entitas pendorong jangkauan utama</span>
              <span className="text-sky-600 dark:text-sky-400 font-semibold">
                Live Data
              </span>
            </div>
          </div>

          {/* RIGHT: Compact Posting Time */}
          <CompactPostingTime data={postingTimeData} />
        </div>

        {/* 5. Curated Top 4 Benchmark Videos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">
                Top Benchmark Videos
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400">
                Top 4 Sample
              </span>
            </div>
            <Link
              href="/video-library"
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5"
            >
              <span>Semua Video di Library</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {videos.map((v) => {
              const videoUrl = v.echotikVideoId
                ? `https://www.tiktok.com/@tiktok/video/${v.echotikVideoId}`
                : "";
              const categoryMetaMap: Record<string, string> = {
                edukasi: "tutorial",
                komedi: "vlog",
                kuliner: "review",
                lifestyle: "tour",
                teknologi: "compare",
              };
              const thumbnailCategory =
                categoryMetaMap[category.id] || "tutorial";

              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVideoId(v.id)}
                  className="group relative rounded-xl overflow-hidden bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-xs hover:border-sky-500 dark:hover:border-sky-400 transition-all text-left block cursor-pointer p-3"
                >
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2.5 bg-stone-100 dark:bg-neutral-800">
                    <VideoThumbnail
                      category={thumbnailCategory}
                      duration="0:15"
                      status={
                        v.views >= 1000000
                          ? "top"
                          : v.views >= 300000
                          ? "trending"
                          : "normal"
                      }
                      videoUrl={videoUrl}
                      size="sm"
                    />
                  </div>

                  <p className="font-bold text-xs leading-snug line-clamp-2 mb-2 text-stone-900 dark:text-white group-hover:text-sky-600 transition-colors h-8">
                    {v.title}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-stone-100 dark:border-neutral-800">
                    <span className="flex items-center gap-1 font-bold text-sky-600 dark:text-sky-400">
                      <Eye className="w-3 h-3" />
                      {fmt(v.views)}
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {v.engagement}% ER
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
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
