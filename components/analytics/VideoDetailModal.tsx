"use client";

import { useEffect, useState } from "react";
import { 
  X, 
  Video, 
  TrendingUp, 
  Activity, 
  Sparkles, 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2, 
  Clock, 
  FileText, 
  Hash, 
  Smile, 
  User, 
  HelpCircle,
  HelpCircle as QuestionIcon,
  Bot,
  Megaphone,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { TOKENS } from "@/lib/design-tokens";
import { formatNum, formatPct } from "@/lib/analytics/formatters";
import { Mono } from "@/components/dashboard";
import { GridBg } from "@/components/layout/GridBg";
import { resolveAvatarUrl } from "@/lib/utils";

interface VideoDetailModalProps {
  videoId: number | string;
  onClose: () => void;
}

export function VideoDetailModal({ videoId, onClose }: VideoDetailModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for API data
  const [videoDetail, setVideoDetail] = useState<any>(null);
  const [engagementHistory, setEngagementHistory] = useState<any[]>([]);
  const [mlPrediction, setMlPrediction] = useState<any>(null);

  // Chart active metric state
  const [chartMetric, setChartMetric] = useState<"views" | "likes" | "comments" | "shares">("views");

  useEffect(() => {
    async function fetchVideoAllData() {
      setLoading(true);
      setError(null);

      try {
        const [detailRes, historyRes, predRes] = await Promise.allSettled([
          apiFetch<any>(API_ENDPOINTS.videos.detail(videoId)),
          apiFetch<any[]>(API_ENDPOINTS.videos.engagementHistory(videoId)),
          apiFetch<any>(API_ENDPOINTS.ml.predictionDetail(videoId))
        ]);

        // Process Detail Response
        if (detailRes.status === "fulfilled" && detailRes.value?.success) {
          setVideoDetail(detailRes.value.data);
        } else {
          console.error("Failed to load video details:", detailRes);
        }

        // Process History Response
        if (historyRes.status === "fulfilled" && historyRes.value?.success && Array.isArray(historyRes.value.data)) {
          // Format date for history chart points
          const formattedHistory = historyRes.value.data.map((item: any) => {
            let label = "";
            if (item.snapshotAt) {
              const parts = item.snapshotAt.substring(0, 10).split("-");
              if (parts.length === 3) {
                label = `${parts[2]}/${parts[1]}`; // DD/MM
              } else {
                label = item.snapshotAt;
              }
            }
            return {
              ...item,
              dateLabel: label,
              views: item.viewsNum || 0,
              likes: item.likesNum || 0,
              comments: item.commentsNum || 0,
              shares: item.sharesNum || 0,
            };
          });
          setEngagementHistory(formattedHistory);
        } else {
          console.error("Failed to load engagement history:", historyRes);
        }

        // Process Prediction Response (Prediction might be missing for some videos, so treat as optional)
        if (predRes.status === "fulfilled" && predRes.value?.success) {
          setMlPrediction(predRes.value.data);
        } else {
          console.warn("Prediction details not found or failed, falling back to basic data.");
        }
      } catch (err) {
        console.error("Error fetching video detail pop up data:", err);
        setError("Gagal memuat data detail video. Silakan coba kembali.");
      } finally {
        setLoading(false);
      }
    }

    if (videoId) {
      fetchVideoAllData();
    }
  }, [videoId]);

  // Derived variables for quick UI display
  const videoObj = videoDetail?.video;
  const isAi = videoDetail?.isAiVideo;
  const isPromo = videoDetail?.isPromote;
  const listHashtags = videoDetail?.hashtags || [];
  
  // Use prediction values or fallback to row values
  const viralProbability = mlPrediction?.viralProbability 
    ? parseFloat(mlPrediction.viralProbability) 
    : (videoObj?.viralProbability || 0);

  const engagementTier = mlPrediction?.engagementTier || "Mid";
  const clusterLabel = mlPrediction?.clusterLabel || "General";

  // Evaluasi Taktis ML Factors
  const evaluateFactors = () => {
    if (!videoObj) return [];
    
    const factors = [];

    // 1. Caption length
    const capLen = videoObj.titleLength ?? 0;
    if (capLen >= 80 && capLen <= 150) {
      factors.push({
        title: "Panjang Caption Optimal",
        desc: `Caption memiliki panjang ${capLen} karakter, yang berada di rentang optimal SEO TikTok (80-150 karakter).`,
        status: "success"
      });
    } else if (capLen < 80) {
      factors.push({
        title: "Caption Terlalu Singkat",
        desc: `Panjang caption ${capLen} karakter. Disarankan menambah keyword penjelas untuk memaksimalkan pencarian SEO TikTok.`,
        status: "warning"
      });
    } else {
      factors.push({
        title: "Caption Sangat Panjang",
        desc: `Panjang caption ${capLen} karakter. Hindari caption yang terlalu padat agar audiens fokus ke video.`,
        status: "info"
      });
    }

    // 2. Duration seconds
    const durSec = videoObj.durationSeconds ?? 0;
    if (durSec >= 15 && durSec <= 60) {
      factors.push({
        title: "Durasi Video Ideal",
        desc: `Durasi video ${durSec} detik ideal untuk menjaga tingkat retention rate audiens.`,
        status: "success"
      });
    } else if (durSec < 15) {
      factors.push({
        title: "Durasi Terlalu Pendek",
        desc: `Durasi ${durSec} detik sangat singkat. Pastikan hook 3 detik pertama dapat langsung menyampaikan pesan utama.`,
        status: "warning"
      });
    } else {
      factors.push({
        title: "Durasi Video Panjang",
        desc: `Durasi video ${durSec} detik membutuhkan penceritaan (storytelling) yang kuat agar audiens tidak lekas skip.`,
        status: "info"
      });
    }

    // 3. Hashtags
    const hashCount = videoObj.hashtagCount ?? 0;
    if (hashCount >= 3 && hashCount <= 5) {
      factors.push({
        title: "Jumlah Hashtag Sesuai",
        desc: `Menggunakan ${hashCount} hashtag terpilih, ideal bagi algoritma untuk merekomendasikan kategori konten.`,
        status: "success"
      });
    } else if (hashCount === 0) {
      factors.push({
        title: "Tanpa Hashtag",
        desc: "Sangat disarankan menyisipkan minimal 3 hashtag relevan agar video terindeks di sistem pencarian TikTok.",
        status: "danger"
      });
    } else if (hashCount > 5) {
      factors.push({
        title: "Hashtag Terlalu Banyak",
        desc: `Menggunakan ${hashCount} hashtag. Tag berlebihan berpotensi membingungkan kategorisasi algoritma dan terlihat spam.`,
        status: "warning"
      });
    }

    // 4. Mention
    const mentionCount = videoObj.mentionCount ?? 0;
    if (mentionCount > 3) {
      factors.push({
        title: "Mention/Tag Akun Berlebih",
        desc: `Melakukan mention ke ${mentionCount} akun. Batasi penyebutan akun jika tidak berhubungan langsung dengan konten.`,
        status: "warning"
      });
    }

    // 5. Emojis
    const emojiCount = videoObj.emojiCount ?? 0;
    if (emojiCount >= 1 && emojiCount <= 4) {
      factors.push({
        title: "Visual Emoji Yang Seimbang",
        desc: `Menyertakan ${emojiCount} emoji yang membantu menarik perhatian mata penonton pada teks caption.`,
        status: "success"
      });
    }

    // 6. AI & Promotion
    if (isAi) {
      factors.push({
        title: "Dideteksi Konten AI",
        desc: "Video diidentifikasi diproduksi/diedit menggunakan teknologi AI generatif.",
        status: "info"
      });
    }
    if (isPromo) {
      factors.push({
        title: "Iklan Berbayar (Promoted)",
        desc: "Video ini didistribusikan melalui skema promosi berbayar/TikTok Ads.",
        status: "info"
      });
    }

    return factors;
  };

  const factorEvaluations = evaluateFactors();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
      case "danger":
        return <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />;
      case "info":
      default:
        return <HelpCircle className="w-4 h-4 text-sky-500 flex-shrink-0" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "success":
        return "rgba(16, 185, 129, 0.05)";
      case "warning":
        return "rgba(245, 158, 11, 0.05)";
      case "danger":
        return "rgba(239, 68, 68, 0.05)";
      case "info":
      default:
        return "rgba(14, 165, 233, 0.05)";
    }
  };

  const getStatusBorder = (status: string) => {
    switch (status) {
      case "success":
        return "rgba(16, 185, 129, 0.15)";
      case "warning":
        return "rgba(245, 158, 11, 0.15)";
      case "danger":
        return "rgba(239, 68, 68, 0.15)";
      case "info":
      default:
        return "rgba(14, 165, 233, 0.15)";
    }
  };

  return (
    <>
      {/* Background Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[100] transition-opacity duration-300"
        style={{
          background: "rgba(17,17,17,0.65)",
          backdropFilter: "blur(6px)",
        }}
      />

      {/* Main Modal Container */}
      <div
        className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-6"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div
          className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col transition-all duration-300 transform scale-100"
          style={{
            background: TOKENS.bg,
            border: `1px solid ${TOKENS.cardBorder}`,
            boxShadow: "0 24px 80px rgba(0, 0, 0, 0.35)",
          }}
        >
          <GridBg theme="light" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-8 h-8 rounded-lg flex items-center justify-center border transition-all hover:bg-black/5"
            style={{
              borderColor: TOKENS.inputBorder,
              color: TOKENS.textMuted,
            }}
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[400px]">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500 mb-3" />
              <p className="text-xs font-bold" style={{ color: TOKENS.textMuted }}>
                Menganalisis data video & performa ML...
              </p>
            </div>
          ) : error || !videoObj ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[400px]">
              <AlertTriangle className="w-12 h-12 text-rose-500 mb-3" />
              <p className="text-sm font-black text-center mb-1">{error || "Gagal memuat detail video"}</p>
              <button 
                type="button" 
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-[#111] text-white font-bold text-xs rounded-xl"
              >
                Tutup Modal
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto z-10 flex flex-col">
              
              {/* Header Info */}
              <div 
                className="p-6 md:p-8 flex flex-col md:flex-row gap-5 items-start"
                style={{ borderBottom: `1px solid ${TOKENS.divider}` }}
              >
                {/* Cover Preview */}
                {videoObj.coverUrl ? (
                  <div className="w-20 h-28 rounded-xl overflow-hidden flex-shrink-0 border bg-black shadow-md relative">
                    <img 
                      src={resolveAvatarUrl(videoObj.coverUrl)} 
                      alt="video-cover" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent flex items-end p-1.5 justify-center">
                      <Video className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-28 rounded-xl flex items-center justify-center flex-shrink-0 border bg-zinc-100 shadow-md">
                    <Video className="w-6 h-6 text-zinc-400" />
                  </div>
                )}

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white"
                      style={{ background: "#fb7185", boxShadow: "0 2px 8px rgba(251,113,133,0.3)" }}
                    >
                      Viral Prob: {formatPct(viralProbability)}
                    </span>
                    <span className="px-2 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wider bg-black/5 text-black border border-black/10">
                      Tier: {engagementTier}
                    </span>
                    <span className="px-2 py-0.5 rounded-md font-black text-[9px] uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200">
                      Topic: {clusterLabel}
                    </span>
                  </div>

                  <h2 className="text-xl font-black tracking-tight leading-snug" style={{ color: TOKENS.text }}>
                    {videoDetail.titleFull || videoObj.titleBrief}
                  </h2>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: TOKENS.textMuted }}>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      <span>@{videoObj.nickName}</span>
                    </div>
                    <span>•</span>
                    <div>
                      <span>Terbit: <strong>{new Date(videoObj.publishedAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Contents Grid */}
              <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 flex-shrink-0">
                
                {/* Left Column: Historical Metrics Chart */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-500" />
                      <h4 className="font-black text-sm tracking-tight" style={{ color: TOKENS.text }}>
                        Riwayat Metrik Kinerja Video
                      </h4>
                    </div>

                    {/* Chart metric buttons */}
                    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/[0.04] border">
                      {(["views", "likes", "comments", "shares"] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setChartMetric(m)}
                          className="px-2 py-1 rounded-md text-[10px] font-black capitalize transition-all"
                          style={{
                            background: chartMetric === m ? "#fff" : "transparent",
                            color: chartMetric === m ? TOKENS.text : TOKENS.textMuted,
                            boxShadow: chartMetric === m ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                          }}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {engagementHistory.length === 0 ? (
                    <div className="h-56 flex items-center justify-center text-xs font-bold rounded-xl border border-dashed bg-black/[0.01]" style={{ color: TOKENS.textMuted }}>
                      Belum ada snapshot historis metrik terkumpul untuk video ini.
                    </div>
                  ) : (
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={engagementHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.04)" />
                          <XAxis
                            dataKey="dateLabel"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 9, fontWeight: 900, fill: TOKENS.textMuted }}
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={formatNum}
                            tick={{ fontSize: 9, fontWeight: 900, fill: TOKENS.textMuted }}
                          />
                          <Tooltip
                            contentStyle={{
                              background: "#fff",
                              border: "1px solid rgba(0,0,0,0.08)",
                              borderRadius: 12,
                              fontSize: 10,
                              fontFamily: "'DM Sans', sans-serif",
                              fontWeight: 700,
                              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                            }}
                            formatter={(val: number) => [formatNum(val), chartMetric.toUpperCase()]}
                          />
                          <Line
                            type="monotone"
                            dataKey={chartMetric}
                            stroke={
                              chartMetric === "views" ? "#10b981" :
                              chartMetric === "likes" ? "#f43f5e" :
                              chartMetric === "comments" ? "#0ea5e9" : "#a855f7"
                            }
                            strokeWidth={3}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Video Current Stats Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="p-2.5 rounded-xl border bg-black/[0.01] text-center">
                      <div className="flex items-center justify-center gap-1 mb-1 text-zinc-400">
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-wider">Views</span>
                      </div>
                      <p className="text-xs font-black" style={{ color: TOKENS.text }}>
                        {formatNum(videoObj.viewsNum ?? 0)}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl border bg-black/[0.01] text-center">
                      <div className="flex items-center justify-center gap-1 mb-1 text-rose-400">
                        <Heart className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-wider">Likes</span>
                      </div>
                      <p className="text-xs font-black" style={{ color: TOKENS.text }}>
                        {formatNum(videoObj.likesNum ?? 0)}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl border bg-black/[0.01] text-center">
                      <div className="flex items-center justify-center gap-1 mb-1 text-sky-400">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-wider">Comments</span>
                      </div>
                      <p className="text-xs font-black" style={{ color: TOKENS.text }}>
                        {formatNum(videoObj.commentsNum ?? 0)}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl border bg-black/[0.01] text-center">
                      <div className="flex items-center justify-center gap-1 mb-1 text-purple-400">
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-wider">Shares</span>
                      </div>
                      <p className="text-xs font-black" style={{ color: TOKENS.text }}>
                        {formatNum(videoObj.sharesNum ?? 0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Viral Probability Factors Diagnostic */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-500" />
                    <h4 className="font-black text-sm tracking-tight" style={{ color: TOKENS.text }}>
                      Mengapa Video ini Memiliki Probabilitas Viral?
                    </h4>
                  </div>

                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {factorEvaluations.length === 0 ? (
                      <p className="text-xs text-zinc-400 text-center py-6">
                        Tidak ada parameter analisis diagnostik yang mencukupi.
                      </p>
                    ) : (
                      factorEvaluations.map((f, idx) => (
                        <div 
                          key={idx}
                          className="p-3 rounded-xl border flex items-start gap-3 transition-colors"
                          style={{
                            background: getStatusBg(f.status),
                            borderColor: getStatusBorder(f.status),
                          }}
                        >
                          {getStatusIcon(f.status)}
                          <div className="space-y-0.5">
                            <h5 className="font-black text-xs" style={{ color: TOKENS.text }}>
                              {f.title}
                            </h5>
                            <p className="text-[10.5px] leading-relaxed text-zinc-500">
                              {f.desc}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Detail Metadata & Hashtags Bottom Section */}
              <div 
                className="p-6 md:p-8 bg-zinc-50 flex-1 space-y-6"
                style={{ borderTop: `1px solid ${TOKENS.divider}` }}
              >
                {/* Highlight/Transcription Description */}
                {videoDetail.highlight && (
                  <div className="space-y-1.5">
                    <h4 className="font-black text-xs uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Ringkasan Deteksi Narasi
                    </h4>
                    <p className="text-xs leading-relaxed italic p-3 rounded-xl bg-white border" style={{ color: TOKENS.textProse }}>
                      "{videoDetail.highlight}"
                    </p>
                  </div>
                )}

                {/* Hashtags list */}
                <div className="space-y-2">
                  <h4 className="font-black text-xs uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" /> Hashtags Terikat ({listHashtags.length})
                  </h4>
                  {listHashtags.length === 0 ? (
                    <p className="text-[11px] text-zinc-400 italic">Tidak ada hashtag yang terdeteksi di caption video ini.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {listHashtags.map((tag: any) => (
                        <div
                          key={tag.hashtagPk || tag.tagTitle}
                          className="px-3 py-2 rounded-xl bg-white border flex flex-col gap-0.5 shadow-sm"
                        >
                          <span className="font-black text-xs text-sky-600">
                            #{tag.tagTitle}
                          </span>
                          <span className="text-[9px] text-zinc-400 font-bold">
                            Views: {formatNum(tag.viewsCountNum || 0)} · Eng: {formatPct(tag.avgEngagementRate || 0)}
                          </span>
                        </div>
                      ))}
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
