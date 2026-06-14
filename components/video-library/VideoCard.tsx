import React from 'react';
import { Check, Eye, Heart, MessageCircle, Share2, Calendar } from 'lucide-react';
import { TOKENS } from '@/lib/design-tokens';
import { VideoType, formatNum } from '@/lib/video-library/mock-data';
import { VideoThumbnail } from './VideoThumbnail';
import { AccountMini } from './AccountMini';
import { HashtagPill } from './HashtagPill';

interface VideoCardProps {
  video: VideoType;
  selected: boolean;
  onSelect: (v: VideoType) => void;
  onOpen: (v: VideoType) => void;
  compareMode: boolean;
}

export function VideoCard({ video, selected, onSelect, onOpen, compareMode }: VideoCardProps) {
  const visibleHashtags = video.hashtags.slice(0, 3);
  const extraHashtags = video.hashtags.length - visibleHashtags.length;

  return (
    <div className="group relative rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 cursor-pointer"
      onClick={() => !compareMode && onOpen(video)}
      style={{
        background: TOKENS.card,
        border: `1px solid ${selected ? '#111' : TOKENS.cardBorder}`,
        boxShadow: selected ? '0 0 0 3px rgba(17,17,17,0.08), 0 8px 24px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.03), 0 2px 12px rgba(0,0,0,0.04)',
      }}>
      <VideoThumbnail category={video.category} duration={video.duration} status={video.status} coverUrl={video.coverUrl} videoUrl={video.videoUrl}>
        {/* Select checkbox */}
        {(compareMode || selected) && (
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(video); }}
            className="absolute bottom-2.5 left-2.5 w-7 h-7 rounded-lg flex items-center justify-center transition-all z-10"
            style={{
              background: selected ? '#fff' : 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(8px)',
              border: `1.5px solid ${selected ? '#fff' : 'rgba(255,255,255,0.5)'}`,
              boxShadow: selected ? '0 0 0 3px rgba(17,17,17,0.4)' : 'none',
            }}>
            {selected && <Check className="w-3.5 h-3.5" style={{ color: '#111' }} strokeWidth={3} />}
          </button>
        )}
      </VideoThumbnail>

      <div className="p-4">
        {/* Title */}
        <p className="font-black text-sm leading-snug mb-3 line-clamp-2" style={{ color: TOKENS.text, minHeight: 36 }}>
          {video.title}
        </p>

        {/* Account */}
        <div className="flex items-center justify-between mb-3">
          <AccountMini video={video} />
          <span className="text-[10px] flex items-center gap-1 flex-shrink-0" style={{ color: TOKENS.textMuted }}>
            <Calendar className="w-2.5 h-2.5" strokeWidth={2.5} />
            {video.publishedAt}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-1.5 mb-3 p-2.5 rounded-xl"
          style={{ background: 'rgba(0,0,0,0.025)', border: `1px solid ${TOKENS.divider}` }}>
          {[
            { Ico: Eye,            value: formatNum(video.views),    color: TOKENS.text },
            { Ico: Heart,          value: formatNum(video.likes),    color: '#dc2626' },
            { Ico: MessageCircle,  value: formatNum(video.comments), color: '#0369a1' },
            { Ico: Share2,         value: formatNum(video.shares),   color: '#059669' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <s.Ico className="w-3 h-3 mx-auto mb-0.5" style={{ color: s.color, opacity: 0.7 }} strokeWidth={2.4} />
              <p className="font-black text-[11px]" style={{ color: TOKENS.text }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Engagement bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: TOKENS.textMuted }}>
              Engagement Rate
            </span>
            <span className="text-xs font-black"
              style={{ color: video.engagement >= 12 ? '#059669' : video.engagement >= 8 ? TOKENS.text : '#dc2626' }}>
              {video.engagement}%
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: TOKENS.barBg }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(video.engagement * 5, 100)}%`,
                background: `linear-gradient(to right, ${video.engagement >= 12 ? '#10b981' : '#111'}, ${video.engagement >= 12 ? '#059669' : '#000'})`,
              }} />
          </div>
        </div>

        {/* Hashtags */}
        <div className="flex items-center gap-1 flex-wrap">
          {visibleHashtags.map((tag: string, i: number) => (
            <HashtagPill key={i} tag={tag} />
          ))}
          {extraHashtags > 0 && (
            <HashtagPill tag={`+${extraHashtags}`} muted />
          )}
        </div>
      </div>
    </div>
  );
}
