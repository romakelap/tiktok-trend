"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  Hash,
  Tag,
  Timer,
  X,
  Zap,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { VideoThumbnail } from "@/components/video-library/VideoThumbnail";

import { GridBg } from "@/components/layout/GridBg";
import { TOKENS } from "@/lib/design-tokens";
import { TIER_META, TOP_VIDEOS, FRONTEND_TO_BACKEND_CAT } from "@/lib/dashboard/mock-data";
import { fmt, fmtPct, fmtRp } from "@/lib/dashboard/formatters";
import type { Category, VideoTier } from "@/lib/dashboard/types";
import { Mono } from "./Mono";
import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { VideoDetailDrawer } from "./VideoDetailDrawer";

type CategoryDetailProps = {
  category: Category;
  onClose: () => void;
};

// ─── Posting Time Heatmap ─────────────────────────────────────────────────────
const DAYS_SHORT = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
// Day mapping: API returns 0=Sunday,1=Mon,...,6=Sat → we display Mon-Sun
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Mon first
const TIME_SLOTS = [
  { label: "06–09", start: 6,  end: 9  },
  { label: "09–12", start: 9,  end: 12 },
  { label: "12–15", start: 12, end: 15 },
  { label: "15–18", start: 15, end: 18 },
  { label: "18–21", start: 18, end: 21 },
  { label: "21–24", start: 21, end: 24 },
];

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function PostingTimeHeatmap({
  data,
  categoryColor,
}: {
  data: any[];
  categoryColor: string;
}) {
  // Build lookup: [dayOfWeek][slotIndex] → score
  const grid: (number | null)[][] = DAY_ORDER.map(() => Array(TIME_SLOTS.length).fill(null));
  let maxScore = 0;

  for (const pt of data) {
    const dow = typeof pt.dayOfWeek === "number" ? pt.dayOfWeek : (pt.day_of_week ?? -1);
    const hour = typeof pt.hourOfDay === "number" ? pt.hourOfDay : (pt.hour_of_day ?? -1);
    const score = typeof pt.score === "number" ? pt.score : (pt.posting_score ?? 0);
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

  // Find top-3 slots for badge
  type SlotInfo = { rowIdx: number; slotIdx: number; score: number };
  const allSlots: SlotInfo[] = [];
  grid.forEach((row, ri) =>
    row.forEach((v, si) => {
      if (v !== null) allSlots.push({ rowIdx: ri, slotIdx: si, score: v });
    })
  );
  allSlots.sort((a, b) => b.score - a.score);
  const top3 = allSlots.slice(0, 3);

  function cellColor(score: number | null): string {
    if (score === null) return "rgba(0,0,0,0.04)";
    const intensity = maxScore > 0 ? score / maxScore : 0;
    if (!categoryColor.startsWith("#")) return `rgba(0,0,0,${intensity * 0.5})`;
    const { r, g, b } = hexToRgb(categoryColor);
    const alpha = 0.08 + intensity * 0.82;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function cellTextColor(score: number | null): string {
    if (score === null) return "transparent";
    const intensity = maxScore > 0 ? score / maxScore : 0;
    return intensity > 0.55 ? "#fff" : TOKENS.textSubtle;
  }

  const hasData = data.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p
          className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
          style={{ color: TOKENS.textMuted }}
        >
          <Clock className="w-3.5 h-3.5" strokeWidth={2.5} /> Best Posting Time — Heatmap
        </p>
        <Link
          href="/timeposting"
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black rounded-xl text-white transition-all hover:opacity-90 active:scale-95 shadow-md"
          style={{ background: "#059669" }}
        >
          View All
          <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </Link>
      </div>

      {!hasData ? (
        <div
          className="flex items-center justify-center h-24 rounded-xl border border-dashed text-xs font-bold"
          style={{ borderColor: TOKENS.divider, color: TOKENS.textMuted }}
        >
          Belum ada data posting time
        </div>
      ) : (
        <div
          className="rounded-xl p-4 overflow-x-auto"
          style={{ background: "rgba(0,0,0,0.02)", border: `1px solid ${TOKENS.divider}` }}
        >
          {/* Column headers (time slots) */}
          <div className="grid gap-1.5 mb-1.5" style={{ gridTemplateColumns: `52px repeat(${TIME_SLOTS.length}, 1fr)` }}>
            <div />
            {TIME_SLOTS.map((slot) => (
              <div
                key={slot.label}
                className="text-center text-[9px] font-black uppercase tracking-wider"
                style={{ color: TOKENS.textMuted }}
              >
                {slot.label}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          {DAY_ORDER.map((dow, rowIdx) => (
            <div
              key={dow}
              className="grid gap-1.5 mb-1.5"
              style={{ gridTemplateColumns: `52px repeat(${TIME_SLOTS.length}, 1fr)` }}
            >
              {/* Day label */}
              <div
                className="flex items-center text-[10px] font-black"
                style={{ color: TOKENS.textSubtle }}
              >
                {DAYS_SHORT[rowIdx]}
              </div>

              {/* Cells */}
              {TIME_SLOTS.map((_, slotIdx) => {
                const score = grid[rowIdx][slotIdx];
                const isTop = top3.some((t) => t.rowIdx === rowIdx && t.slotIdx === slotIdx);
                const rank = top3.findIndex((t) => t.rowIdx === rowIdx && t.slotIdx === slotIdx);
                return (
                  <div
                    key={slotIdx}
                    className="relative h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{
                      background: cellColor(score),
                      outline: isTop ? `2px solid ${categoryColor}` : "none",
                      outlineOffset: -1,
                    }}
                    title={
                      score !== null
                        ? `${DAYS_SHORT[rowIdx]} ${TIME_SLOTS[slotIdx].label} · Score: ${score.toFixed(1)}`
                        : "No data"
                    }
                  >
                    {isTop && (
                      <span
                        className="text-[9px] font-black"
                        style={{ color: cellTextColor(score) }}
                      >
                        #{rank + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${TOKENS.divider}` }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ background: "rgba(0,0,0,0.04)" }} />
              <span className="text-[9px] font-bold" style={{ color: TOKENS.textMuted }}>Tidak ada data</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold" style={{ color: TOKENS.textMuted }}>Rendah</span>
              {[0.15, 0.35, 0.55, 0.75, 0.95].map((intensity) => {
                const { r, g, b } = categoryColor.startsWith("#")
                  ? hexToRgb(categoryColor)
                  : { r: 100, g: 100, b: 100 };
                return (
                  <div
                    key={intensity}
                    className="w-4 h-3 rounded"
                    style={{ background: `rgba(${r},${g},${b},${0.08 + intensity * 0.82})` }}
                  />
                );
              })}
              <span className="text-[9px] font-bold" style={{ color: TOKENS.textMuted }}>Tinggi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded border-2"
                style={{ borderColor: categoryColor }}
              />
              <span className="text-[9px] font-bold" style={{ color: TOKENS.textMuted }}>Top 3 slot</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Markdown renderer ────────────────────────────────────────────────────────
function parseBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-extrabold text-[#111]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderLightMarkdown(text: string) {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    if (line.startsWith("### ")) {
      return (
        <h3 key={idx} className="text-base font-black mt-4 mb-2" style={{ color: TOKENS.text }}>
          {line.replace("### ", "")}
        </h3>
      );
    }
    if (line.startsWith("#### ")) {
      return (
        <h4 key={idx} className="text-sm font-black mt-3 mb-1.5" style={{ color: TOKENS.textSubtle }}>
          {line.replace("#### ", "")}
        </h4>
      );
    }
    if (line.trim().startsWith("- ")) {
      const content = line.trim().replace("- ", "");
      return (
        <div key={idx} className="flex items-start gap-2 ml-4 my-1 text-sm leading-relaxed">
          <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500" style={{ background: "#d97706" }} />
          <p style={{ color: TOKENS.textSubtle }}>{parseBoldText(content)}</p>
        </div>
      );
    }
    if (line.trim() === "") return <div key={idx} className="h-2" />;
    return (
      <p key={idx} className="text-sm my-1 leading-relaxed" style={{ color: TOKENS.textSubtle }}>
        {parseBoldText(line)}
      </p>
    );
  });
}

/** Expanded view shown when a category is selected in the comparison table. */
export function CategoryDetail({ category, onClose }: CategoryDetailProps) {
  const [detailData, setDetailData] = useState<any>(null);
  const [hashtagsData, setHashtagsData] = useState<any[]>([]);
  const [keywordsData, setKeywordsData] = useState<any[]>([]);
  const [postingTimeData, setPostingTimeData] = useState<any[]>([]);
  const [topVideosData, setTopVideosData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideoId, setSelectedVideoId] = useState<number | string | null>(null);

  useEffect(() => {
    async function fetchCategoryDetails() {
      try {
        setLoading(true);
        const backendCatName = FRONTEND_TO_BACKEND_CAT[category.id] || category.label;

        const [detailRes, hashtagsRes, keywordsRes, postingTimeRes, topVideosRes] = await Promise.all([
          apiFetch<any>(API_ENDPOINTS.category.detail(backendCatName)).catch((err) => {
            console.error("Detail fetch failed:", err);
            return null;
          }),
          apiFetch<any[]>(API_ENDPOINTS.category.hashtags(backendCatName)).catch((err) => {
            console.error("Hashtags fetch failed:", err);
            return null;
          }),
          apiFetch<any[]>(API_ENDPOINTS.category.keywords(backendCatName)).catch((err) => {
            console.error("Keywords fetch failed:", err);
            return null;
          }),
          apiFetch<any[]>(`${API_ENDPOINTS.category.postingTime(backendCatName)}?limit=50`).catch((err) => {
            console.error("Posting time fetch failed:", err);
            return null;
          }),
          apiFetch<any[]>(API_ENDPOINTS.category.topVideos(backendCatName)).catch((err) => {
            console.error("Top videos fetch failed:", err);
            return null;
          }),
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
  }, [category.id]);

  const viewsVal = detailData ? detailData.totalViews : category.views;
  const engagementVal = detailData ? (detailData.avgEngagementRate * 100).toFixed(2) : category.engagement;
  const viralVal = detailData ? detailData.avgViralScore : category.viralProb;
  // totalGmvLocal is already in IDR from bi_video_revenue_summary.latest_gmv_local
  const revenueVal = detailData ? (detailData.totalGmvLocal ?? 0) : category.revenue;

  const summaryStats = [
    { label: "Total Views", value: fmt(viewsVal) },
    { label: "Engagement", value: `${engagementVal}%` },
    { label: "Viral Score", value: fmtPct(viralVal) },
    { label: "Revenue", value: fmtRp(revenueVal) },
  ];

  const hashtagsTableData = (hashtagsData.length > 0
    ? hashtagsData.map((h) => ({
        hashtag: h.hashtag.startsWith("#") ? h.hashtag : `#${h.hashtag}`,
        videoCount: h.videoCount ?? 0,
        totalViews: h.totalViews ?? 0,
        avgEngagementRate: h.avgEngagementRate ?? 0,
      }))
    : (category.topHashtags || []).map((tag) => ({
        hashtag: tag.startsWith("#") ? tag : `#${tag}`,
        videoCount: "-",
        totalViews: "-",
        avgEngagementRate: "-",
      }))
  ).slice(0, 15);

  const keywordsTableData = (keywordsData.length > 0
    ? keywordsData.map((k) => ({
        keyword: k.keyword,
        videoCount: k.videoCount ?? 0,
        totalViews: k.totalViews ?? 0,
        avgEngagementRate: k.avgEngagementRate ?? 0,
      }))
    : (category.topKeywords || []).map((kw) => ({
        keyword: kw,
        videoCount: "-",
        totalViews: "-",
        avgEngagementRate: "-",
      }))
  ).slice(0, 15);

  const postingTimeTableData = (postingTimeData.length > 0
    ? postingTimeData.map((pt) => ({
        dayName: pt.dayName,
        hourOfDay: pt.hourOfDay,
        videoCount: pt.videoCount ?? 0,
        avgViews: pt.avgViews ?? 0,
        avgEngagementRate: pt.avgEngagementRate ?? 0,
        score: pt.score ?? 0,
      }))
    : [{
        dayName: category.bestTime,
        hourOfDay: null,
        videoCount: "-",
        avgViews: "-",
        avgEngagementRate: "-",
        score: "-",
      }]
  ).slice(0, 3);

  const formatViews = (val: any) => {
    if (typeof val !== "number") return val;
    return fmt(val);
  };

  const formatEngagement = (val: any) => {
    if (typeof val !== "number") return val;
    return `${(val * 100).toFixed(2)}%`;
  };

  const formatScore = (val: any) => {
    if (typeof val !== "number") return val;
    return val.toFixed(1);
  };

  const insightMarkup = detailData?.contentDirection
    ? renderLightMarkdown(detailData.contentDirection)
    : renderLightMarkdown(category.insight);

  const rawVideos = topVideosData.length > 0 ? topVideosData : (TOP_VIDEOS[category.id] || []);
  const videos = rawVideos.map((v: any) => {
    let tier: VideoTier = "Mid";
    const views = typeof v.viewsNum === "number" ? v.viewsNum : (v.views || 0);
    if (views >= 1000000) tier = "Top";
    else if (views >= 300000) tier = "High";
    else if (views < 50000) tier = "Low";

    const engagement = typeof v.engagementRate === "number"
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
    const viralProb = typeof v.viralProbability === "number" ? v.viralProbability : (v.viralProb || 0);

    return {
      id,
      title,
      views,
      likes: typeof v.likesNum === "number" ? v.likesNum : (v.likes || Math.round(views * (engagement / 100) * 0.8)),
      comments: typeof v.commentsNum === "number" ? v.commentsNum : (v.comments || Math.round(views * (engagement / 100) * 0.1)),
      shares: typeof v.sharesNum === "number" ? v.sharesNum : (v.shares || Math.round(views * (engagement / 100) * 0.1)),
      engagement,
      viralProb,
      tier,
      cluster,
      published,
      echotikVideoId: v.echotikVideoId || "",
    };
  });

  return (
    <div
      className="relative rounded-2xl overflow-hidden min-h-[400px]"
      style={{
        background: TOKENS.card,
        border: `2px solid ${category.color}33`,
        boxShadow: `0 8px 32px ${category.color}18,inset 0 1px 0 rgba(255,255,255,1)`,
      }}
    >
      {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-50 flex items-center justify-center transition-all duration-300">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-[3px] border-black/10 border-t-black animate-spin" />
            <p className="text-[11px] font-black tracking-widest uppercase text-[#111]">Loading Insights...</p>
          </div>
        </div>
      )}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: category.color }}
      />
      <GridBg theme="light" />
      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: category.tint,
                border: `1px solid ${category.color}33`,
              }}
            >
              <category.Ico
                className="w-6 h-6"
                style={{ color: category.color }}
                strokeWidth={2}
              />
            </div>
            <div>
              <h2
                className="font-black text-xl tracking-tight"
                style={{ color: TOKENS.text }}
              >
                {category.label}
              </h2>
              <p
                className="text-xs font-medium"
                style={{ color: TOKENS.textMuted }}
              >
                Detail performa & rekomendasi aksi
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-black/5 transition-all"
            style={{ color: TOKENS.textMuted }}
            aria-label="Close detail"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {summaryStats.map((stat) => (
            <div
              key={stat.label}
              className="p-3 rounded-xl"
              style={{
                background: "rgba(0,0,0,0.025)",
                border: `1px solid ${TOKENS.divider}`,
              }}
            >
              <p
                className="text-[9px] font-black uppercase tracking-wider mb-1"
                style={{ color: TOKENS.textMuted }}
              >
                {stat.label}
              </p>
              <p
                className="font-black text-lg leading-none"
                style={{ color: TOKENS.text }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 mb-6">
          {/* Top Hashtags Bar Chart */}
          {hashtagsData.length > 0 && (
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mb-3"
                style={{ color: TOKENS.textMuted }}
              >
                <Hash className="w-3.5 h-3.5" strokeWidth={2.5} /> Top 10 Hashtags — Views
              </p>
              <div
                className="rounded-xl p-4 overflow-hidden"
                style={{ background: "rgba(0,0,0,0.02)", border: `1px solid ${TOKENS.divider}` }}
              >
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    layout="vertical"
                    data={hashtagsData.slice(0, 10).map((h: any) => ({
                      hashtag: (h.hashtag?.startsWith("#") ? h.hashtag : `#${h.hashtag}`).slice(0, 20),
                      views: h.totalViews ?? 0,
                    }))}
                    margin={{ top: 0, right: 40, left: 8, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.06)" />
                    <XAxis
                      type="number"
                      tickFormatter={(v: number) => v >= 1_000_000 ? `${(v/1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v/1_000).toFixed(0)}K` : String(v)}
                      tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="hashtag"
                      width={110}
                      tick={{ fontSize: 10, fontWeight: 700, fill: "#0369a1" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(0,0,0,0.03)" }}
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid rgba(0,0,0,0.1)",
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                      formatter={(val: number) => [
                        val >= 1_000_000 ? `${(val/1_000_000).toFixed(2)}M` : val >= 1_000 ? `${(val/1_000).toFixed(0)}K` : val,
                        "Total Views"
                      ]}
                    />
                    <Bar dataKey="views" radius={[0, 4, 4, 0]} barSize={14}>
                      {hashtagsData.slice(0, 10).map((_: any, i: number) => (
                        <Cell
                          key={i}
                          fill={i === 0 ? category.color : `${category.color}${Math.round(255 * (1 - i * 0.08)).toString(16).padStart(2, "0")}`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Top Hashtags Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p
                className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
                style={{ color: TOKENS.textMuted }}
              >
                <Hash className="w-3.5 h-3.5" strokeWidth={2.5} /> Top 15 Hashtags
              </p>
              <Link
                href="/hashtag"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black rounded-xl text-white transition-all hover:opacity-90 active:scale-95 shadow-md"
                style={{
                  background: "#0284c7",
                }}
              >
                View All
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </Link>
            </div>
            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: TOKENS.divider }}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: `1px solid ${TOKENS.divider}` }}>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest" style={{ color: TOKENS.textMuted }}>#</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest" style={{ color: TOKENS.textMuted }}>Hashtag</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center" style={{ color: TOKENS.textMuted }}>Videos</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-right" style={{ color: TOKENS.textMuted }}>Views</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-right" style={{ color: TOKENS.textMuted }}>Eng. Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {hashtagsTableData.map((h, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-black/[0.01] transition-colors"
                      style={{ borderBottom: idx < hashtagsTableData.length - 1 ? `1px solid ${TOKENS.divider}` : "none" }}
                    >
                      <td className="px-4 py-2.5 text-[11px] font-mono" style={{ color: TOKENS.textMuted }}>{idx + 1}</td>
                      <td className="px-4 py-2.5 text-xs font-bold text-sky-700" style={{ color: "#0369a1" }}>{h.hashtag}</td>
                      <td className="px-4 py-2.5 text-xs font-bold text-center" style={{ color: TOKENS.textSubtle }}>{h.videoCount}</td>
                      <td className="px-4 py-2.5 text-xs font-bold text-right" style={{ color: TOKENS.textSubtle }}>{formatViews(h.totalViews)}</td>
                      <td className="px-4 py-2.5 text-xs font-bold text-right" style={{ color: TOKENS.text }}>{formatEngagement(h.avgEngagementRate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Keywords Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p
                className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
                style={{ color: TOKENS.textMuted }}
              >
                <Tag className="w-3.5 h-3.5" strokeWidth={2.5} /> Top 15 Keywords
              </p>
              <Link
                href="/keyword"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black rounded-xl text-white transition-all hover:opacity-90 active:scale-95 shadow-md"
                style={{
                  background: category.color,
                }}
              >
                View All
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </Link>
            </div>
            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: TOKENS.divider }}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: `1px solid ${TOKENS.divider}` }}>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest" style={{ color: TOKENS.textMuted }}>#</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest" style={{ color: TOKENS.textMuted }}>Keyword</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center" style={{ color: TOKENS.textMuted }}>Videos</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-right" style={{ color: TOKENS.textMuted }}>Views</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-right" style={{ color: TOKENS.textMuted }}>Eng. Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {keywordsTableData.map((k, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-black/[0.01] transition-colors"
                      style={{ borderBottom: idx < keywordsTableData.length - 1 ? `1px solid ${TOKENS.divider}` : "none" }}
                    >
                      <td className="px-4 py-2.5 text-[11px] font-mono" style={{ color: TOKENS.textMuted }}>{idx + 1}</td>
                      <td className="px-4 py-2.5 text-xs font-bold" style={{ color: category.color }}>{k.keyword}</td>
                      <td className="px-4 py-2.5 text-xs font-bold text-center" style={{ color: TOKENS.textSubtle }}>{k.videoCount}</td>
                      <td className="px-4 py-2.5 text-xs font-bold text-right" style={{ color: TOKENS.textSubtle }}>{formatViews(k.totalViews)}</td>
                      <td className="px-4 py-2.5 text-xs font-bold text-right" style={{ color: TOKENS.text }}>{formatEngagement(k.avgEngagementRate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Best Posting Time — Heatmap */}
          <PostingTimeHeatmap
            data={postingTimeData}
            categoryColor={category.color}
          />
        </div>

        <div
          className="mb-6 p-4 rounded-xl"
          style={{
            background: "rgba(0,0,0,0.02)",
            border: `1px solid ${TOKENS.divider}`,
          }}
        >
          <div className="flex items-start gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "#111" }}
            >
              <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-widest mb-1"
                style={{ color: TOKENS.textMuted }}
              >
                Insight & Recommended Action
              </p>
              <div className="space-y-1">
                {insightMarkup}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: TOKENS.textMuted }}
            >
              Top Videos
            </p>
            <Link
              href="/video-library"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black rounded-xl text-white transition-all hover:opacity-90 active:scale-95 shadow-md"
              style={{
                background: "#111",
              }}
            >
              View All
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((v) => {
              const videoUrl = v.echotikVideoId ? `https://www.tiktok.com/@tiktok/video/${v.echotikVideoId}` : "";
              const categoryMetaMap: Record<string, string> = {
                edukasi: "tutorial",
                komedi: "vlog",
                kuliner: "review",
                lifestyle: "tour",
                teknologi: "compare",
              };
              const thumbnailCategory = categoryMetaMap[category.id] || "tutorial";
              return (
                <a
                  key={v.id}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVideoId(v.id);
                  }}
                  className="group relative rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 block cursor-pointer"
                  style={{
                    background: TOKENS.card,
                    border: `1px solid ${TOKENS.cardBorder}`,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03), 0 2px 12px rgba(0,0,0,0.04)",
                  }}
                >
                  <VideoThumbnail
                    category={thumbnailCategory}
                    duration="0:15"
                    status={v.views >= 1000000 ? "top" : v.views >= 300000 ? "trending" : "normal"}
                    videoUrl={videoUrl}
                    size="md"
                  />

                  <div className="p-3">
                    {/* Title */}
                    <p
                      className="font-black text-xs leading-snug mb-3 line-clamp-2"
                      style={{ color: TOKENS.text, minHeight: 32 }}
                    >
                      {v.title}
                    </p>

                    {/* Account & Date */}
                    <div className="flex items-center justify-between gap-1 mb-3 text-[10px]">
                      <span className="font-bold truncate" style={{ color: TOKENS.textSubtle, maxWidth: "70px" }}>
                        @{v.cluster}
                      </span>
                      <span className="flex items-center gap-1 flex-shrink-0" style={{ color: TOKENS.textMuted }}>
                        <Calendar className="w-2.5 h-2.5" strokeWidth={2.5} />
                        {v.published}
                      </span>
                    </div>

                    {/* Stats grid */}
                    <div
                      className="grid grid-cols-4 gap-1 mb-3 p-2 rounded-lg"
                      style={{
                        background: "rgba(0,0,0,0.015)",
                        border: `1px solid ${TOKENS.divider}`,
                      }}
                    >
                      {[
                        { Ico: Eye,            value: fmt(v.views),    color: TOKENS.text },
                        { Ico: Heart,          value: fmt(v.likes),    color: "#dc2626" },
                        { Ico: MessageCircle,  value: fmt(v.comments), color: "#0369a1" },
                        { Ico: Share2,         value: fmt(v.shares),   color: "#059669" },
                      ].map((s, i) => (
                        <div key={i} className="text-center">
                          <s.Ico
                            className="w-2.5 h-2.5 mx-auto mb-0.5"
                            style={{ color: s.color, opacity: 0.7 }}
                            strokeWidth={2.4}
                          />
                          <p className="font-black text-[9px]" style={{ color: TOKENS.text }}>
                            {s.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Engagement bar */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider"
                          style={{ color: TOKENS.textMuted }}
                        >
                          Engagement Rate
                        </span>
                        <span
                          className="text-[10px] font-black"
                          style={{
                            color: v.engagement >= 12 ? "#059669" : v.engagement >= 8 ? TOKENS.text : "#dc2626",
                          }}
                        >
                          {v.engagement}%
                        </span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: TOKENS.barBg }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.min(v.engagement * 5, 100)}%`,
                            background: v.engagement >= 12 ? "#059669" : "#111",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
      {selectedVideoId && (
        <VideoDetailDrawer
          videoId={selectedVideoId}
          onClose={() => setSelectedVideoId(null)}
        />
      )}
    </div>
  );
}
