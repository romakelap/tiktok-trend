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
import { TOKENS } from "@/lib/design-tokens";
import { formatNum, formatPct } from "@/lib/analytics/formatters";

interface VideoDetailDrawerProps {
  videoId: number | string | null;
  onClose: () => void;
}

type TabKey = "trend" | "diagnosis" | "hashtags";

const TABS: { key: TabKey; label: string }[] = [
  { key: "trend",     label: "Tren Metrik"  },
  { key: "diagnosis", label: "Diagnostik"   },
  { key: "hashtags",  label: "Hashtags"     },
];

// ── helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n ?? 0);
}

function statusIcon(s: string) {
  if (s === "success") return <CheckCircle  className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />;
  if (s === "warning") return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />;
  if (s === "danger")  return <AlertTriangle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />;
  return                       <HelpCircle   className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />;
}
function statusBg(s: string) {
  if (s === "success") return { bg: "rgba(16,185,129,0.05)",  border: "rgba(16,185,129,0.15)"  };
  if (s === "warning") return { bg: "rgba(245,158,11,0.05)",  border: "rgba(245,158,11,0.15)"  };
  if (s === "danger")  return { bg: "rgba(239,68,68,0.05)",   border: "rgba(239,68,68,0.15)"   };
  return                      { bg: "rgba(14,165,233,0.05)",  border: "rgba(14,165,233,0.15)"  };
}

export function VideoDetailDrawer({ videoId, onClose }: VideoDetailDrawerProps) {
  const [loading,           setLoading]           = useState(true);
  const [videoDetail,       setVideoDetail]       = useState<any>(null);
  const [engagementHistory, setEngagementHistory] = useState<any[]>([]);
  const [mlPrediction,      setMlPrediction]      = useState<any>(null);
  const [activeTab,         setActiveTab]         = useState<TabKey>("trend");
  const [chartMetric,       setChartMetric]       = useState<"views"|"likes"|"comments"|"shares">("views");
  const [videoError,        setVideoError]        = useState(false);
  const [isMuted,           setIsMuted]           = useState(true);

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

      if (histRes.status === "fulfilled" && histRes.value?.success && Array.isArray(histRes.value.data)) {
        setEngagementHistory(
          histRes.value.data.map((d: any) => ({
            ...d,
            dateLabel: d.snapshotAt ? d.snapshotAt.substring(5, 10).split("-").reverse().join("/") : "",
            views: d.viewsNum || 0, likes: d.likesNum || 0,
            comments: d.commentsNum || 0, shares: d.sharesNum || 0,
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

  const v          = videoDetail?.video;
  const hashtags   = videoDetail?.hashtags || [];
  const viralProb  = mlPrediction?.viralProbability ? parseFloat(mlPrediction.viralProbability) : (v?.viralProbability || 0);
  const tier       = mlPrediction?.engagementTier || "Mid";
  const cluster    = mlPrediction?.clusterLabel   || "General";
  const tiktokUrl  = v?.echotikVideoId && v?.nickName
    ? `https://www.tiktok.com/@${v.nickName}/video/${v.echotikVideoId}`
    : null;

  // ── Factor evaluations (compact version) ───────────────────────────────────
  const factors: { title: string; desc: string; status: string }[] = [];
  if (v) {
    const cap = v.titleLength ?? 0;
    if (cap >= 80 && cap <= 150) factors.push({ title: "Caption Optimal",  desc: `${cap} karakter — dalam rentang SEO optimal (80–150).`, status: "success" });
    else if (cap < 80)           factors.push({ title: "Caption Singkat",  desc: `${cap} karakter — tambah keyword untuk SEO.`,           status: "warning" });
    else                         factors.push({ title: "Caption Panjang",  desc: `${cap} karakter — terlalu padat, audiens bisa teralih.`, status: "info"    });

    const dur = v.durationSeconds ?? 0;
    if (dur >= 15 && dur <= 60)  factors.push({ title: "Durasi Ideal",     desc: `${dur}s — retention rate optimal di rentang ini.`,       status: "success" });
    else if (dur < 15)           factors.push({ title: "Durasi Singkat",   desc: `${dur}s — pastikan hook 3 detik pertama kuat.`,           status: "warning" });
    else                         factors.push({ title: "Durasi Panjang",   desc: `${dur}s — butuh storytelling kuat agar tidak di-skip.`,  status: "info"    });

    const h = v.hashtagCount ?? 0;
    if (h >= 3 && h <= 5)        factors.push({ title: "Hashtag Sesuai",   desc: `${h} hashtag — ideal untuk kategorisasi algoritma.`,     status: "success" });
    else if (h === 0)            factors.push({ title: "Tanpa Hashtag",    desc: "Tambah min. 3 hashtag relevan untuk SEO TikTok.",         status: "danger"  });
    else if (h > 5)              factors.push({ title: "Hashtag Banyak",   desc: `${h} hashtag — berpotensi dianggap spam algoritma.`,     status: "warning" });

    if (v.emojiCount >= 1 && v.emojiCount <= 4)
      factors.push({ title: "Emoji Seimbang",    desc: `${v.emojiCount} emoji — menarik perhatian tanpa berlebihan.`,  status: "success" });
    if (videoDetail?.isPromote)
      factors.push({ title: "Iklan Berbayar",    desc: "Video diidentifikasi sebagai konten promoted.",                 status: "info"    });
    if (videoDetail?.isAiVideo)
      factors.push({ title: "Konten AI",         desc: "Video diproduksi / diedit menggunakan AI generatif.",           status: "info"    });
  }

  // ── Published date string ───────────────────────────────────────────────────
  let dateStr = "—";
  if (v?.publishedAt) {
    const d = new Date(v.publishedAt);
    if (!isNaN(d.getTime()))
      dateStr = d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
        + ", " + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }) + " WIB";
  }

  // ── CHART COLORS ─────────────────────────────────────────────────────────────
  const METRIC_COLOR: Record<string, string> = {
    views: "#10b981", likes: "#f43f5e", comments: "#0ea5e9", shares: "#a855f7",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      />

      {/* Modal — centered, fixed height = 88vh */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="relative w-full flex flex-col overflow-hidden"
          style={{
            maxWidth: 1100,
            height: "88vh",
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 32px 80px rgba(0,0,0,0.28)",
            pointerEvents: "all",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {/* ── Top bar ───────────────────────────────────────────────────── */}
          <div
            className="flex items-center justify-between px-5 py-3 flex-shrink-0"
            style={{ borderBottom: `1px solid ${TOKENS.divider}`, background: "#fafafa" }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4 text-white" strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-sm font-black" style={{ color: TOKENS.text }}>Video Detail</p>
                <p className="text-[10px]" style={{ color: TOKENS.textMuted }}>Performa & ML diagnosis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {tiktokUrl && !loading && v && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white transition-all hover:opacity-80"
                  style={{ background: "#111", boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }}
                >
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Buka di TikTok
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-black/5"
                style={{ border: `1px solid ${TOKENS.divider}`, color: TOKENS.textMuted }}
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* ── Body ──────────────────────────────────────────────────────── */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full border-[3px] border-black/10 border-t-black animate-spin" />
              <p className="text-xs font-black" style={{ color: TOKENS.textMuted }}>Memuat data video...</p>
            </div>
          ) : !v ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <AlertTriangle className="w-10 h-10 text-rose-400" />
              <p className="text-sm font-black text-gray-600">Gagal memuat data video</p>
              <button type="button" onClick={onClose}
                className="px-4 py-2 bg-black text-white text-xs font-black rounded-xl">Tutup</button>
            </div>
          ) : (
            <div className="flex-1 flex overflow-hidden min-h-0">

              {/* ── LEFT: Video player ──────────────────────────────────── */}
              <div
                className="flex-shrink-0 flex flex-col"
                style={{ width: 340, background: "#0d0d0d", borderRight: "1px solid #1e1e1e" }}
              >
                {/* Video — aspect-ratio 9:16 wrapper, fills panel width */}
                <div className="flex-1 flex items-center justify-center p-3 min-h-0 overflow-hidden">
                  <div
                    className="relative w-full overflow-hidden rounded-2xl"
                    style={{ aspectRatio: "9/16", maxHeight: "100%", margin: "0 auto" }}
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
                        className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                      />
                    ) : v.echotikVideoId ? (
                      <iframe
                        src={`https://www.tiktok.com/embed/v2/${v.echotikVideoId}`}
                        className="absolute inset-0 w-full h-full border-0 rounded-2xl"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                        style={{ background: "#1a1a1a" }}>
                        {v.coverUrl && (
                          <img src={v.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
                        )}
                        <p className="text-[11px] text-white/40 font-bold relative z-10">Video tidak tersedia</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex-shrink-0 px-3 pb-3 flex gap-2">
                  {v.videoUrl && !videoError && (
                    <button type="button" onClick={() => setIsMuted(m => !m)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold transition hover:opacity-75"
                      style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}>
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      {isMuted ? "Unmute" : "Mute"}
                    </button>
                  )}
                  {tiktokUrl && (
                    <a href={tiktokUrl} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold transition hover:opacity-75"
                      style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}>
                      <ExternalLink className="w-3.5 h-3.5" />
                      TikTok
                    </a>
                  )}
                </div>
              </div>

              {/* ── RIGHT: Info panel ──────────────────────────────────── */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* A. Title + meta (fixed height) */}
                <div className="flex-shrink-0 px-5 pt-4 pb-3" style={{ borderBottom: `1px solid ${TOKENS.divider}` }}>
                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black text-white" style={{ background: "#fb7185" }}>
                      Viral {(viralProb * 100).toFixed(0)}%
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black border" style={{ background: "rgba(0,0,0,0.03)", color: TOKENS.text, borderColor: TOKENS.divider }}>
                      Tier: {tier}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black" style={{ background: "#ede9fe", color: "#6d28d9" }}>
                      {cluster}
                    </span>
                  </div>

                  {/* Title */}
                  <p className="text-sm font-black leading-snug line-clamp-2 mb-1.5" style={{ color: TOKENS.text }}>
                    {videoDetail?.titleFull || v.titleBrief || "Untitled"}
                  </p>

                  {/* Account + Date */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-black" style={{ color: TOKENS.text }}>@{v.nickName}</span>
                    <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: TOKENS.textMuted }}>
                      <Calendar className="w-3 h-3" strokeWidth={2.5} />
                      {dateStr}
                    </span>
                  </div>
                </div>

                {/* B. 4 Stats (fixed height) */}
                <div className="flex-shrink-0 grid grid-cols-4 gap-2 px-5 py-3" style={{ borderBottom: `1px solid ${TOKENS.divider}` }}>
                  {[
                    { Ico: Eye,           label: "Views",    val: v.viewsNum,    color: "#10b981" },
                    { Ico: Heart,         label: "Likes",    val: v.likesNum,    color: "#f43f5e" },
                    { Ico: MessageSquare, label: "Komentar", val: v.commentsNum, color: "#0ea5e9" },
                    { Ico: Share2,        label: "Shares",   val: v.sharesNum,   color: "#a855f7" },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col items-center gap-0.5 p-2.5 rounded-xl border"
                      style={{ background: `${s.color}08`, borderColor: `${s.color}20` }}>
                      <s.Ico className="w-3.5 h-3.5 mb-0.5" style={{ color: s.color }} strokeWidth={2.2} />
                      <p className="text-xs font-black" style={{ color: TOKENS.text }}>{fmt(s.val ?? 0)}</p>
                      <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: TOKENS.textMuted }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* C. Content chips (fixed height) */}
                <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 flex-wrap" style={{ borderBottom: `1px solid ${TOKENS.divider}` }}>
                  {[
                    { Ico: Type,     label: "Karakter", val: v.titleLength ?? 0      },
                    { Ico: Clock,    label: "Durasi",   val: `${v.durationSeconds ?? 0}s` },
                    { Ico: Hash,     label: "Hashtag",  val: v.hashtagCount ?? 0      },
                    { Ico: Sparkles, label: "Emoji",    val: v.emojiCount ?? 0        },
                  ].map((c) => (
                    <div key={c.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold"
                      style={{ background: "rgba(0,0,0,0.02)", borderColor: TOKENS.divider, color: TOKENS.text }}>
                      <c.Ico className="w-3 h-3" style={{ color: TOKENS.textMuted }} strokeWidth={2.2} />
                      <span style={{ color: TOKENS.textMuted }}>{c.label}:</span>
                      <span className="font-black">{c.val}</span>
                    </div>
                  ))}
                </div>

                {/* D. Tabs (fixed height) */}
                <div className="flex-shrink-0 flex items-center gap-0 px-5 pt-2" style={{ borderBottom: `1px solid ${TOKENS.divider}` }}>
                  {TABS.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className="px-4 py-2 text-xs font-black border-b-2 transition-all"
                      style={{
                        borderColor: activeTab === tab.key ? "#111" : "transparent",
                        color: activeTab === tab.key ? TOKENS.text : TOKENS.textMuted,
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* E. Tab content (flex-1, fills remaining) */}
                <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">

                  {/* Tab: Tren Metrik */}
                  {activeTab === "trend" && (
                    <div className="flex flex-col gap-3 h-full">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(["views","likes","comments","shares"] as const).map((m) => (
                          <button key={m} type="button" onClick={() => setChartMetric(m)}
                            className="px-3 py-1 rounded-lg text-[10px] font-black transition-all border"
                            style={{
                              background: chartMetric === m ? METRIC_COLOR[m] : "transparent",
                              color: chartMetric === m ? "#fff" : TOKENS.textMuted,
                              borderColor: chartMetric === m ? METRIC_COLOR[m] : TOKENS.divider,
                            }}>
                            {m === "comments" ? "Komentar" : m.charAt(0).toUpperCase() + m.slice(1)}
                          </button>
                        ))}
                      </div>

                      {engagementHistory.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-xs font-bold rounded-2xl border border-dashed"
                          style={{ color: TOKENS.textMuted, borderColor: TOKENS.divider }}>
                          Belum ada snapshot historis
                        </div>
                      ) : (
                        <div className="flex-1 min-h-0" style={{ minHeight: 180 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={engagementHistory} margin={{ top: 6, right: 8, left: -16, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                              <XAxis dataKey="dateLabel" tickLine={false} axisLine={false}
                                tick={{ fontSize: 9, fontWeight: 700, fill: "#94a3b8" }} />
                              <YAxis tickLine={false} axisLine={false} tickFormatter={fmt}
                                tick={{ fontSize: 9, fontWeight: 700, fill: "#94a3b8" }} />
                              <Tooltip
                                contentStyle={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}
                                formatter={(val: number) => [fmt(val), chartMetric.toUpperCase()]}
                              />
                              <Line type="monotone" dataKey={chartMetric}
                                stroke={METRIC_COLOR[chartMetric]} strokeWidth={2.5}
                                dot={{ r: 3, fill: METRIC_COLOR[chartMetric], strokeWidth: 0 }}
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
                    <div className="space-y-2">
                      {factors.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">Tidak ada faktor diagnostik.</p>
                      ) : (
                        factors.map((f, i) => {
                          const { bg, border } = statusBg(f.status);
                          return (
                            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl border"
                              style={{ background: bg, borderColor: border }}>
                              {statusIcon(f.status)}
                              <div>
                                <p className="text-xs font-black mb-0.5" style={{ color: TOKENS.text }}>{f.title}</p>
                                <p className="text-[11px] leading-relaxed" style={{ color: TOKENS.textMuted }}>{f.desc}</p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* Tab: Hashtags */}
                  {activeTab === "hashtags" && (
                    <div>
                      {hashtags.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">Tidak ada hashtag terdeteksi.</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {hashtags.map((tag: any) => (
                            <div key={tag.hashtagPk || tag.tagTitle}
                              className="flex items-center justify-between px-3 py-2.5 rounded-xl border"
                              style={{ background: "rgba(14,165,233,0.03)", borderColor: "rgba(14,165,233,0.15)" }}>
                              <span className="text-xs font-black text-sky-600 truncate">#{tag.tagTitle}</span>
                              <div className="flex flex-col items-end flex-shrink-0 ml-2">
                                <span className="text-[9px] font-bold" style={{ color: TOKENS.textMuted }}>{fmt(tag.viewsCountNum || 0)} views</span>
                                <span className="text-[9px] font-bold" style={{ color: TOKENS.textMuted }}>{formatPct(tag.avgEngagementRate || 0)} eng</span>
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
