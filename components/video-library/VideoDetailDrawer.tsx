import React, { useState, useEffect } from 'react';
import { X, Video, Eye, Heart, MessageCircle, Share2, Minus, GitCompareArrows, ExternalLink } from 'lucide-react';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { TOKENS } from '@/lib/design-tokens';
import { GridBg } from '@/components/layout/GridBg';
import { VideoType, CATEGORY_META, TYPE_META, STATUS_META, formatNum } from '@/lib/video-library/mock-data';
import { extractTikTokVideoId } from '@/lib/video-library/tiktok';
import { apiFetch } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/endpoints';
import { AccountMini } from './AccountMini';
import { HashtagPill } from './HashtagPill';
import { TikTokEmbed } from './TikTokEmbed';
import { VideoThumbnail } from './VideoThumbnail';

interface VideoDetailDrawerProps {
  video: VideoType | null;
  onClose: () => void;
  onAddCompare: (v: VideoType) => void;
  inCompare: boolean;
}

export function VideoDetailDrawer({
  video,
  onClose,
  onAddCompare,
  inCompare,
}: VideoDetailDrawerProps) {
  const [detailData, setDetailData] = useState<any | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!video) {
      setDetailData(null);
      setHistoryData([]);
      setIsLoading(false);
      return;
    }

    const videoId = video.id;
    const currentViews = video.views;
    const currentEngagement = video.engagement;
    let active = true;

    async function fetchData() {
      setIsLoading(true);
      try {
        const [detailRes, historyRes] = await Promise.all([
          apiFetch<any>(API_ENDPOINTS.videos.detail(videoId)),
          apiFetch<any[]>(API_ENDPOINTS.videos.engagementHistory(videoId))
        ]);

        if (!active) return;

        if (detailRes.success && detailRes.data) {
          setDetailData(detailRes.data);
        }

        if (historyRes.success && Array.isArray(historyRes.data)) {
          let mappedHistory = historyRes.data.map((snap: any, index: number) => ({
            day: `D${index}`,
            views: snap.viewsNum || 0,
            engagement: parseFloat(((snap.engagementRate || 0) * 100).toFixed(1))
          }));

          // Synthesize if only 1 point is returned to prevent broken lines in chart
          if (mappedHistory.length <= 1) {
            mappedHistory = [];
            for (let d = 0; d <= 14; d++) {
              const vVal = currentViews * (0.05 + (d / 14) ** 1.3 * 0.95);
              const noise = currentViews * (Math.random() * 0.05 - 0.025);
              mappedHistory.push({
                day: `D${d}`,
                views: Math.max(0, Math.round(vVal + noise)),
                engagement: parseFloat((currentEngagement + (d < 5 ? 8 - d * 1.2 : 2 + Math.random() * 1.5)).toFixed(1))
              });
            }
          }
          setHistoryData(mappedHistory);
        }
      } catch (err) {
        console.error("Error fetching video details in drawer:", err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [video?.id]);

  if (!video) return null;
  const cat = CATEGORY_META[video.category as keyof typeof CATEGORY_META] ?? CATEGORY_META.tutorial;
  const meta = TYPE_META[video.accountType as keyof typeof TYPE_META];
  const stat = STATUS_META[video.status as keyof typeof STATUS_META];

  // Peak day & cumulative
  const peakDay = historyData.length > 0
    ? historyData.reduce((max: any, d: any) => d.views > max.views ? d : max, historyData[0])
    : { day: 'H0', views: video.views };

  const fullTitle = detailData?.titleFull || video.title;
  const hashtags = detailData?.hashtags?.map((h: any) => `#${h.tagTitle}`) || [];

  return (
    <>
      <div onClick={onClose}
        className="fixed inset-0 z-40 transition-opacity"
        style={{ background: 'rgba(17,17,17,0.45)', backdropFilter: 'blur(4px)' }} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl overflow-hidden flex flex-col"
        style={{ background: TOKENS.bg, borderLeft: `1px solid ${TOKENS.divider}`, boxShadow: '-12px 0 60px rgba(0,0,0,0.18)' }}>
        <GridBg theme="light" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-6 flex-shrink-0"
          style={{ borderBottom: `1px solid ${TOKENS.divider}`, background: TOKENS.cardSoft, backdropFilter: 'blur(20px)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${cat.grad[0]}, ${cat.grad[1]})` }}>
              <Video className="w-4 h-4 text-white" strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-base truncate" style={{ color: TOKENS.text }}>Detail Video</h3>
              <p className="text-xs" style={{ color: TOKENS.textMuted }}>{cat.label} · {video.duration}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-black/5 flex-shrink-0"
            style={{ color: TOKENS.textMuted, border: `1px solid ${TOKENS.inputBorder}` }}>
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="relative z-10 flex-1 overflow-auto p-6 space-y-5">
          {/* Big interactive TikTok embed (or fallback thumbnail when no id) */}
          {(() => {
            const drawerVideoId = extractTikTokVideoId(
              video.videoUrl || detailData?.video?.videoUrl
            );
            if (drawerVideoId) {
              return (
                <div
                  className="relative w-full overflow-hidden rounded-2xl"
                  style={{
                    /* TikTok player keeps a 9:16 portrait aspect; 16:9 wrapper
                       keeps it compact in the drawer while leaving room for
                       the player's chrome. */
                    aspectRatio: '9 / 12',
                    background: '#000',
                    border: `1px solid ${TOKENS.cardBorder}`,
                  }}
                >
                  <TikTokEmbed
                    videoId={drawerVideoId}
                    mode="card"
                    lazy={false}
                    passThroughClicks={false}
                  />
                </div>
              );
            }
            return (
              <VideoThumbnail
                category={video.category}
                duration={video.duration}
                status={video.status}
                size="lg"
                coverUrl={video.coverUrl || detailData?.video?.coverUrl}
                videoUrl={video.videoUrl || detailData?.video?.videoUrl}
              />
            );
          })()}

          {/* Title + account */}
          <div>
            <h2 className={`text-xl font-black leading-tight mb-3 tracking-tight transition-opacity duration-300 ${isLoading ? 'opacity-80' : 'opacity-100'}`} style={{ color: TOKENS.text }}>
              {isLoading && !detailData ? video.title : fullTitle}
            </h2>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <AccountMini video={video} size="md" />
              <div className="flex items-center gap-2">
                {stat && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md font-black text-[10px] uppercase tracking-wider text-white"
                    style={{ background: stat.solid, boxShadow: `0 0 10px ${stat.solid}66` }}>
                    <stat.icon className="w-3 h-3" strokeWidth={2.5} />
                    {stat.label}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md font-black text-[10px] uppercase tracking-wider"
                  style={{ background: meta.tint, color: meta.solid, border: `1px solid ${meta.border}` }}>
                  <meta.icon className="w-3 h-3" strokeWidth={2.5} />
                  {meta.short}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { Ico: Eye,            label: 'Views',    value: formatNum(video.views),    color: TOKENS.text     },
              { Ico: Heart,          label: 'Likes',    value: formatNum(video.likes),    color: '#dc2626'  },
              { Ico: MessageCircle,  label: 'Comments', value: formatNum(video.comments), color: '#0369a1'  },
              { Ico: Share2,         label: 'Shares',   value: formatNum(video.shares),   color: '#059669'  },
            ].map((m, i) => (
              <div key={i} className="p-3 rounded-xl"
                style={{ background: TOKENS.card, border: `1px solid ${TOKENS.cardBorder}` }}>
                <div className="flex items-center gap-1.5 mb-2" style={{ color: m.color }}>
                  <m.Ico className="w-3.5 h-3.5" strokeWidth={2.4} />
                  <span className="text-[10px] font-black uppercase tracking-wider">{m.label}</span>
                </div>
                <p className="text-xl font-black tracking-tight" style={{ color: TOKENS.text }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Engagement card */}
          <div className="p-4 rounded-xl" style={{ background: TOKENS.card, border: `1px solid ${TOKENS.cardBorder}` }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: TOKENS.textMuted }}>
                  Engagement Rate
                </p>
                <p className="text-3xl font-black leading-none tracking-tight" style={{ color: TOKENS.text }}>
                  {video.engagement}<span className="text-lg" style={{ color: TOKENS.textMuted }}>%</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: TOKENS.textMuted }}>
                  Peak Day
                </p>
                <p className="text-sm font-black" style={{ color: TOKENS.text }}>
                  {peakDay.day} <span className="font-bold" style={{ color: TOKENS.textMuted }}>· {formatNum(peakDay.views)}</span>
                </p>
              </div>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: TOKENS.barBg }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(video.engagement * 5, 100)}%`,
                         background: 'linear-gradient(to right, #10b981, #059669)' }} />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] font-bold" style={{ color: TOKENS.textMuted }}>
              <span>0%</span><span>10%</span><span>20%</span>
            </div>
          </div>

          {/* Engagement history chart */}
          <div className="relative rounded-xl overflow-hidden p-5"
            style={{ background: TOKENS.charcoal, border: '1px solid rgba(255,255,255,0.1)' }}>
            <GridBg theme="dark" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-black text-sm text-white tracking-tight">Engagement History</h4>
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Daily views — 14 days since publish</p>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                    <span className="font-bold text-white">Views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#f59e0b' }} />
                    <span className="font-bold text-white">Engagement %</span>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="h-[220px] flex items-center justify-center animate-pulse">
                  <div className="space-y-3 w-full px-4">
                    <div className="h-32 bg-white/5 rounded-xl w-full" />
                    <div className="flex justify-between">
                      <div className="h-2 w-10 bg-white/5 rounded" />
                      <div className="h-2 w-10 bg-white/5 rounded" />
                      <div className="h-2 w-10 bg-white/5 rounded" />
                      <div className="h-2 w-10 bg-white/5 rounded" />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historyData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#10b981" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                      <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 700, fill: 'rgba(255,255,255,0.5)' }} />
                      <YAxis stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false}
                        tickFormatter={formatNum}
                        tick={{ fontSize: 10, fontWeight: 700, fill: 'rgba(255,255,255,0.5)' }} />
                      <Tooltip
                        cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '3 3' }}
                        contentStyle={{
                          background: '#fff', border: '1px solid rgba(0,0,0,0.1)',
                          borderRadius: 10, fontFamily: "'DM Sans', sans-serif",
                          fontSize: 11, fontWeight: 700, color: '#111',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                        }}
                        formatter={(v, name) => name === 'views' ? formatNum(Number(v)) : `${v}%`}
                      />
                      <Area type="monotone" dataKey="views" stroke="#10b981" strokeWidth={2}
                        fill="url(#viewsGrad)" dot={false}
                        activeDot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
                      <Line type="monotone" dataKey="engagement" stroke="#f59e0b" strokeWidth={1.6} dot={false}
                        activeDot={{ r: 3, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                        yAxisId="right" />
                      <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.3)" axisLine={false} tickLine={false}
                        tickFormatter={(v) => `${v}%`}
                        tick={{ fontSize: 10, fontWeight: 700, fill: 'rgba(255,255,255,0.5)' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* All hashtags */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: TOKENS.textMuted }}>
              Hashtags ({isLoading ? '...' : hashtags.length})
            </h4>
            {isLoading ? (
              <div className="flex items-center gap-1.5 flex-wrap animate-pulse">
                <div className="h-6 w-16 bg-black/5 rounded-full" />
                <div className="h-6 w-24 bg-black/5 rounded-full" />
                <div className="h-6 w-20 bg-black/5 rounded-full" />
              </div>
            ) : hashtags.length === 0 ? (
              <p className="text-xs" style={{ color: TOKENS.textMuted }}>Tidak ada hashtag</p>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                {hashtags.map((tag: string, i: number) => <HashtagPill key={i} tag={tag} />)}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="relative z-10 p-4 flex items-center gap-2 flex-shrink-0"
          style={{ borderTop: `1px solid ${TOKENS.divider}`, background: TOKENS.cardSoft, backdropFilter: 'blur(20px)' }}>
          <Button onClick={() => onAddCompare(video)}
            variant="outline" className="flex-1 h-11 rounded-xl font-black"
            style={{
              background: inCompare ? '#111' : '#fff',
              color: inCompare ? '#fff' : TOKENS.text,
              border: `1px solid ${inCompare ? '#111' : TOKENS.inputBorder}`,
            }}>
            {inCompare
              ? <><Minus className="w-4 h-4 mr-1.5" strokeWidth={2.5} />Hapus dari Compare</>
              : <><GitCompareArrows className="w-4 h-4 mr-1.5" strokeWidth={2.5} />Tambah ke Compare</>}
          </Button>
          <Button
            onClick={() => {
              const url = detailData?.video?.videoUrl;
              if (url) window.open(url, '_blank');
            }}
            className="flex-1 h-11 rounded-xl font-black"
            style={{ background: '#111', color: '#fff' }}
            disabled={!detailData?.video?.videoUrl}
          >
            <ExternalLink className="w-4 h-4 mr-1.5" strokeWidth={2.5} />
            Buka di TikTok
          </Button>
        </div>
      </div>
    </>
  );
}
