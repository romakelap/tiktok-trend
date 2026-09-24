"use client";

import { useEffect, useState } from "react";
import {
  X,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Hash,
  Calendar,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Volume2,
  VolumeX,
  Activity,
  Sparkles,
  Clock,
  Type,
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

import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";

interface VideoDetailDrawerProps {
  videoId: number | string | null;
  onClose: () => void;
}

type TabKey = "trend" | "diagnosis" | "hashtags";

const TABS: { key: TabKey; label: string }[] = [
  { key: "trend", label: "Tren Metrik" },
  { key: "diagnosis", label: "Diagnostik & NLP" },
  { key: "hashtags", label: "Hashtags" },
];

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n ?? 0);
}

function statusIcon(s: string) {
  if (s === "success")
    return <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
  if (s === "warning")
    return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
  if (s === "danger")
    return <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />;
  return <HelpCircle className="w-4 h-4 text-sky-500 flex-shrink-0" />;
}

function statusBadgeClass(s: string) {
  if (s === "success")
    return "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300";
  if (s === "warning")
    return "bg-amber-50/70 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-800/60 text-amber-900 dark:text-amber-300";
  if (s === "danger")
    return "bg-rose-50/70 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-800/60 text-rose-900 dark:text-rose-300";
  return "bg-sky-50/70 dark:bg-sky-950/40 border-sky-200/80 dark:border-sky-800/60 text-sky-900 dark:text-sky-300";
}

export function VideoDetailDrawer({ videoId, onClose }: VideoDetailDrawerProps) {
  const [loading, setLoading] = useState(true);
  const [videoDetail, setVideoDetail] = useState<any>(null);
  const [engagementHistory, setEngagementHistory] = useState<any[]>([]);
  const [mlPrediction, setMlPrediction] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("trend");
  const [chartMetric, setChartMetric] = useState<
    "views" | "likes" | "comments" | "shares"
  >("views");
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!videoId) return;
    setLoading(true);
    setVideoError(false);
    setActiveTab("trend");

    async function load() {
      const [detailRes, histRes, predRes] = await Promise.allSettled([
        apiFetch<any>(API_ENDPOINTS.videos.detail(videoId!)),
        apiFetch<any[]>(API_ENDPOINTS.videos.engagementHistory(videoId!)),
        apiFetch<any>(API_ENDPOINTS.ml.predictionDetail(videoId!)),
      ]);

      if (detailRes.status === "fulfilled" && detailRes.value?.success)
        setVideoDetail(detailRes.value.data);

      if (
        histRes.status === "fulfilled" &&
        histRes.value?.success &&
        Array.isArray(histRes.value.data)
      ) {
        setEngagementHistory(
          histRes.value.data.map((d: any) => ({
            ...d,
            dateLabel: d.snapshotAt
              ? d.snapshotAt.substring(5, 10).split("-").reverse().join("/")
              : "",
            views: d.viewsNum || 0,
            likes: d.likesNum || 0,
            comments: d.commentsNum || 0,
            shares: d.sharesNum || 0,
          }))
        );
      }

      if (predRes.status === "fulfilled" && predRes.value?.success)
        setMlPrediction(predRes.value.data);

      setLoading(false);
    }

    load();
  }, [videoId]);

  if (!videoId) return null;

  const v = videoDetail?.video;
  const hashtags = videoDetail?.hashtags || [];
  const viralProb = mlPrediction?.viralProbability
    ? parseFloat(mlPrediction.viralProbability)
    : v?.viralProbability || 0;
  const tier = mlPrediction?.engagementTier || "Mid";
  const cluster = mlPrediction?.clusterLabel || "General";
  const tiktokUrl =
    v?.echotikVideoId && v?.nickName
      ? `https://www.tiktok.com/@${v.nickName}/video/${v.echotikVideoId}`
      : null;

  // Factor evaluations
  const factors: { title: string; desc: string; status: string }[] = [];
  if (v) {
    const cap = v.titleLength ?? 0;
    if (cap >= 80 && cap <= 150)
      factors.push({
        title: "Caption Optimal",
        desc: `${cap} karakter — dalam rentang SEO optimal (80–150).`,
        status: "success",
      });
    else if (cap < 80)
      factors.push({
        title: "Caption Singkat",
        desc: `${cap} karakter — tambah keyword untuk SEO.`,
        status: "warning",
      });
    else
      factors.push({
        title: "Caption Panjang",
        desc: `${cap} karakter — terlalu padat, audiens bisa teralih.`,
        status: "info",
      });

    const dur = v.durationSeconds ?? 0;
    if (dur >= 15 && dur <= 60)
      factors.push({
        title: "Durasi Ideal",
        desc: `${dur}s — retention rate optimal di rentang ini.`,
        status: "success",
      });
    else if (dur < 15)
      factors.push({
        title: "Durasi Singkat",
        desc: `${dur}s — pastikan hook 3 detik pertama kuat.`,
        status: "warning",
      });
    else
      factors.push({
        title: "Durasi Panjang",
        desc: `${dur}s — butuh storytelling kuat agar tidak di-skip.`,
        status: "info",
      });

    const h = v.hashtagCount ?? 0;
    if (h >= 3 && h <= 5)
      factors.push({
        title: "Hashtag Sesuai",
        desc: `${h} hashtag — ideal untuk kategorisasi algoritma.`,
        status: "success",
      });
    else if (h === 0)
      factors.push({
        title: "Tanpa Hashtag",
        desc: "Tambah min. 3 hashtag relevan untuk SEO TikTok.",
        status: "danger",
      });
    else if (h > 5)
      factors.push({
        title: "Hashtag Banyak",
        desc: `${h} hashtag — berpotensi dianggap spam algoritma.`,
        status: "warning",
      });

    if (v.emojiCount >= 1 && v.emojiCount <= 4)
      factors.push({
        title: "Emoji Seimbang",
        desc: `${v.emojiCount} emoji — menarik perhatian tanpa berlebihan.`,
        status: "success",
      });
    if (videoDetail?.isPromote)
      factors.push({
        title: "Iklan Berbayar",
        desc: "Video diidentifikasi sebagai konten promoted.",
        status: "info",
      });
    if (videoDetail?.isAiVideo)
      factors.push({
        title: "Konten AI",
        desc: "Video diproduksi / diedit menggunakan AI generatif.",
        status: "info",
      });
  }

  let dateStr = "—";
  if (v?.publishedAt) {
    const d = new Date(v.publishedAt);
    if (!isNaN(d.getTime()))
      dateStr =
        d.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }) +
        ", " +
        d.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }) +
        " WIB";
  }

  const METRIC_CONFIG = {
    views: { label: "Views", color: "#0ea5e9" },
    likes: { label: "Likes", color: "#f43f5e" },
    comments: { label: "Komentar", color: "#10b981" },
    shares: { label: "Shares", color: "#8b5cf6" },
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="relative w-full max-w-5xl h-[88vh] bg-white dark:bg-neutral-900 rounded-2xl border border-stone-200/80 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/80 dark:border-neutral-800 bg-stone-50/60 dark:bg-neutral-900/60 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone-900 dark:bg-white text-white dark:text-stone-900 flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4" strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900 dark:text-white">
                  Video Intelligence Detail
                </p>
                <p className="text-xs text-stone-500 dark:text-neutral-400">
                  Performa diagnostik & prediksi machine learning
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {tiktokUrl && !loading && v && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-white dark:bg-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-100 transition-all shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka di TikTok</span>
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg border border-stone-200/80 dark:border-neutral-800 hover:bg-stone-100 dark:hover:bg-neutral-800 text-stone-500 hover:text-stone-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Body Content */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-stone-900 dark:border-neutral-700 dark:border-t-white animate-spin" />
              <p className="text-xs font-mono font-medium text-stone-600 dark:text-neutral-400">
                Memuat intelijen video...
              </p>
            </div>
          ) : !v ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <AlertTriangle className="w-10 h-10 text-rose-500" />
              <p className="text-sm font-bold text-stone-700 dark:text-neutral-300">
                Gagal memuat data video
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Tutup
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
              {/* LEFT: Video Player */}
              <div className="md:w-80 flex-shrink-0 flex flex-col bg-stone-950 border-r border-stone-800">
                <div className="flex-1 flex items-center justify-center p-4 min-h-0 overflow-hidden">
                  <div
                    className="relative w-full overflow-hidden rounded-xl bg-stone-900"
                    style={{ aspectRatio: "9/16", maxHeight: "100%" }}
                  >
                    {v.videoUrl && !videoError ? (
                      <video
                        key={v.videoUrl}
                        src={v.videoUrl}
                        poster={v.coverUrl || undefined}
                        controls
                        muted={isMuted}
                        loop
                        playsInline
                        onError={() => setVideoError(true)}
                        className="absolute inset-0 w-full h-full object-cover rounded-xl"
                      />
                    ) : v.echotikVideoId ? (
                      <iframe
                        src={`https://www.tiktok.com/embed/v2/${v.echotikVideoId}`}
                        className="absolute inset-0 w-full h-full border-0 rounded-xl"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-stone-900 p-4 text-center">
                        {v.coverUrl && (
                          <img
                            src={v.coverUrl}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover opacity-20"
                          />
                        )}
                        <p className="text-xs text-stone-400 font-medium relative z-10">
                          Video preview tidak tersedia
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video controls */}
                <div className="flex-shrink-0 p-3 pt-0 flex gap-2">
                  {v.videoUrl && !videoError && (
                    <button
                      type="button"
                      onClick={() => setIsMuted((m) => !m)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-800 text-stone-300 hover:bg-stone-700 transition-colors cursor-pointer"
                    >
                      {isMuted ? (
                        <VolumeX className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                      <span>{isMuted ? "Unmute" : "Mute"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* RIGHT: Intelligence Panel */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-neutral-900">
                {/* Title & Metadata */}
                <div className="flex-shrink-0 px-6 pt-5 pb-4 border-b border-stone-200/80 dark:border-neutral-800">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Viral Potential: {(viralProb * 100).toFixed(0)}%
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                      Tier: {tier}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 dark:bg-neutral-800 text-stone-700 dark:text-neutral-300 border border-stone-200 dark:border-neutral-700">
                      {cluster}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-stone-900 dark:text-white leading-snug line-clamp-2 mb-2">
                    {videoDetail?.titleFull || v.titleBrief || "Untitled Video"}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-neutral-400">
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      @{v.nickName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                  </div>
                </div>

                {/* 4 Stats Cards */}
                <div className="flex-shrink-0 grid grid-cols-4 gap-2.5 px-6 py-3 border-b border-stone-200/80 dark:border-neutral-800 bg-stone-50/40 dark:bg-neutral-900/40">
                  {[
                    {
                      Ico: Eye,
                      label: "Views",
                      val: v.viewsNum,
                      color: "text-sky-500",
                    },
                    {
                      Ico: Heart,
                      label: "Likes",
                      val: v.likesNum,
                      color: "text-rose-500",
                    },
                    {
                      Ico: MessageSquare,
                      label: "Komentar",
                      val: v.commentsNum,
                      color: "text-emerald-500",
                    },
                    {
                      Ico: Share2,
                      label: "Shares",
                      val: v.sharesNum,
                      color: "text-stone-600 dark:text-stone-300",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="flex flex-col items-center p-2 rounded-xl bg-white dark:bg-neutral-800/80 border border-stone-200/70 dark:border-neutral-800"
                    >
                      <s.Ico className={`w-3.5 h-3.5 mb-1 ${s.color}`} />
                      <p className="text-xs font-mono font-bold text-stone-900 dark:text-white">
                        {fmt(s.val ?? 0)}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-neutral-400">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Content Feature Chips */}
                <div className="flex-shrink-0 flex items-center gap-2 px-6 py-2.5 border-b border-stone-200/80 dark:border-neutral-800 flex-wrap">
                  {[
                    {
                      Ico: Type,
                      label: "Karakter",
                      val: `${v.titleLength ?? 0} char`,
                    },
                    {
                      Ico: Clock,
                      label: "Durasi",
                      val: `${v.durationSeconds ?? 0}s`,
                    },
                    {
                      Ico: Hash,
                      label: "Hashtag",
                      val: `${v.hashtagCount ?? 0} tags`,
                    },
                    {
                      Ico: Sparkles,
                      label: "Emoji",
                      val: `${v.emojiCount ?? 0} emoji`,
                    },
                  ].map((c) => (
                    <div
                      key={c.label}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100/70 dark:bg-neutral-800 border border-stone-200/80 dark:border-neutral-700 text-[11px] font-mono"
                    >
                      <c.Ico className="w-3 h-3 text-stone-500" />
                      <span className="text-stone-500 dark:text-neutral-400">
                        {c.label}:
                      </span>
                      <span className="font-bold text-stone-900 dark:text-white">
                        {c.val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tabs Navigation */}
                <div className="flex-shrink-0 flex items-center gap-4 px-6 border-b border-stone-200/80 dark:border-neutral-800">
                  {TABS.map((tab) => {
                    const active = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                          active
                            ? "border-sky-500 text-sky-600 dark:text-sky-400"
                            : "border-transparent text-stone-500 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-white"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-6 min-h-0">
                  {/* Tab: Tren Metrik */}
                  {activeTab === "trend" && (
                    <div className="flex flex-col gap-3 h-full">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(
                          ["views", "likes", "comments", "shares"] as const
                        ).map((m) => {
                          const active = chartMetric === m;
                          return (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setChartMetric(m)}
                              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                                active
                                  ? "bg-sky-500 text-white border-sky-500 shadow-xs"
                                  : "bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400 border-stone-200 dark:border-neutral-700 hover:text-stone-900"
                              }`}
                            >
                              {m === "comments"
                                ? "Komentar"
                                : m.charAt(0).toUpperCase() + m.slice(1)}
                            </button>
                          );
                        })}
                      </div>

                      {engagementHistory.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-xs font-medium text-stone-400 rounded-xl border border-dashed border-stone-200 dark:border-neutral-800">
                          Belum ada snapshot historis
                        </div>
                      ) : (
                        <div className="flex-1 min-h-[180px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={engagementHistory}
                              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="rgba(0,0,0,0.05)"
                              />
                              <XAxis
                                dataKey="dateLabel"
                                tickLine={false}
                                axisLine={false}
                                tick={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  fill: "rgb(120, 113, 108)",
                                }}
                              />
                              <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={fmt}
                                tick={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  fill: "rgb(120, 113, 108)",
                                }}
                              />
                              <Tooltip
                                contentStyle={{
                                  background: "#1c1917",
                                  border: "1px solid rgba(255,255,255,0.1)",
                                  borderRadius: 8,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: "#fff",
                                }}
                                formatter={(val: number) => [
                                  fmt(val),
                                  chartMetric.toUpperCase(),
                                ]}
                              />
                              <Line
                                type="monotone"
                                dataKey={chartMetric}
                                stroke="#0ea5e9"
                                strokeWidth={2.5}
                                dot={{
                                  r: 3,
                                  fill: "#0ea5e9",
                                  stroke: "#fff",
                                  strokeWidth: 2,
                                }}
                                activeDot={{ r: 5 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab: Diagnostik */}
                  {activeTab === "diagnosis" && (
                    <div className="space-y-2.5">
                      {factors.length === 0 ? (
                        <p className="text-xs text-stone-400 italic">
                          Tidak ada faktor diagnostik.
                        </p>
                      ) : (
                        factors.map((f, i) => (
                          <div
                            key={i}
                            className={`flex items-start gap-3 p-3.5 rounded-xl border ${statusBadgeClass(
                              f.status
                            )}`}
                          >
                            {statusIcon(f.status)}
                            <div>
                              <p className="text-xs font-bold mb-0.5">
                                {f.title}
                              </p>
                              <p className="text-xs opacity-90 leading-relaxed">
                                {f.desc}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Tab: Hashtags */}
                  {activeTab === "hashtags" && (
                    <div>
                      {hashtags.length === 0 ? (
                        <p className="text-xs text-stone-400 italic">
                          Tidak ada hashtag terdeteksi.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {hashtags.map((tag: any) => (
                            <div
                              key={tag.hashtagPk || tag.tagTitle}
                              className="flex items-center justify-between p-3 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200/70 dark:border-sky-800/50"
                            >
                              <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 truncate">
                                #{tag.tagTitle}
                              </span>
                              <div className="flex flex-col items-end flex-shrink-0 ml-2 text-[10.5px] font-mono text-stone-500 dark:text-neutral-400">
                                <span>{fmt(tag.viewsCountNum || 0)} views</span>
                                <span>
                                  {((tag.avgEngagementRate || 0) * 100).toFixed(
                                    1
                                  )}
                                  % ER
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
