import React from 'react';
import { Check, Clock, Calendar, ArrowUpRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TOKENS } from '@/lib/design-tokens';
import { VideoType, CATEGORY_META, TYPE_META, STATUS_META, formatNum, initialsFrom } from '@/lib/video-library/mock-data';

interface VideoListRowProps {
  video: VideoType;
  selected: boolean;
  onSelect: (v: VideoType) => void;
  onOpen: (v: VideoType) => void;
  compareMode: boolean;
  isLast: boolean;
}

/**
 * Dense row used in list view. The mini thumbnail is intentionally a
 * category icon (not a TikTok iframe) — iframes don't render well at
 * 48×48 and would tank scroll performance on long lists. The full cover
 * shows up in the card grid (`VideoCard`) and detail drawer.
 */
export function VideoListRow({ video, selected, onSelect, onOpen, compareMode, isLast }: VideoListRowProps) {
  const cat = CATEGORY_META[video.category as keyof typeof CATEGORY_META] ?? CATEGORY_META.tutorial;
  const Ico = cat.icon;
  const meta = TYPE_META[video.accountType as keyof typeof TYPE_META];

  return (
    <div className="grid items-center gap-4 px-6 py-3.5 transition-colors hover:bg-black/[0.02] cursor-pointer"
      onClick={() => !compareMode && onOpen(video)}
      style={{
        borderBottom: isLast ? 'none' : `1px solid ${TOKENS.divider}`,
        gridTemplateColumns: '32px 1.6fr 0.8fr 90px 90px 90px 110px 90px',
        background: selected ? 'rgba(17,17,17,0.025)' : 'transparent',
      }}>
      {/* select */}
      {(compareMode || selected) ? (
        <button onClick={(e) => { e.stopPropagation(); onSelect(video); }}
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{
            background: selected ? '#111' : '#fff',
            border: `1.5px solid ${selected ? '#111' : TOKENS.inputBorder}`,
          }}>
          {selected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
        </button>
      ) : (
        <div />
      )}

      {/* title + thumb mini */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${cat.grad[0]}, ${cat.grad[1]})` }}>
          <Ico className="w-5 h-5 text-white" strokeWidth={1.8} />
          {video.status === 'trending' && (
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center z-10"
              style={{ background: STATUS_META.trending.solid, boxShadow: `0 0 6px ${STATUS_META.trending.solid}88` }}>
              <Flame className="w-2 h-2 text-white" strokeWidth={3} />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-black text-sm truncate" style={{ color: TOKENS.text }}>{video.title}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
              style={{ background: 'rgba(0,0,0,0.04)', color: TOKENS.textMuted, border: `1px solid ${TOKENS.divider}` }}>
              {cat.label}
            </span>
            <span className="flex items-center gap-1 text-[10px]" style={{ color: TOKENS.textMuted }}>
              <Clock className="w-2.5 h-2.5" strokeWidth={2.5} />{video.duration}
            </span>
            <span className="flex items-center gap-1 text-[10px]" style={{ color: TOKENS.textMuted }}>
              <Calendar className="w-2.5 h-2.5" strokeWidth={2.5} />{video.publishedAt}
            </span>
          </div>
        </div>
      </div>

      {/* account */}
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 font-black text-white text-[10px]"
          style={{ background: meta.solid }}>
          {initialsFrom(video.accountDisplayName)}
        </div>
        <span className="font-black text-xs truncate" style={{ color: TOKENS.text }}>@{video.account}</span>
      </div>

      {/* views */}
      <span className="font-black text-sm" style={{ color: TOKENS.text }}>{formatNum(video.views)}</span>
      {/* likes */}
      <span className="font-bold text-sm" style={{ color: '#dc2626' }}>{formatNum(video.likes)}</span>
      {/* comments */}
      <span className="font-bold text-sm" style={{ color: '#0369a1' }}>{formatNum(video.comments)}</span>

      {/* engagement */}
      <span className="font-black text-sm px-2 py-1 rounded-md text-center"
        style={{
          color: video.engagement >= 12 ? '#059669' : TOKENS.text,
          background: video.engagement >= 12 ? 'rgba(5,150,105,0.08)' : 'rgba(0,0,0,0.04)',
        }}>
        {video.engagement}%
      </span>

      {/* action */}
      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs font-bold"
        onClick={() => !compareMode && onOpen(video)}
        style={{ background: '#fff', border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.text }}>
        Detail
        <ArrowUpRight className="w-3 h-3 ml-1" strokeWidth={2.5} />
      </Button>
    </div>
  );
}
