import React from 'react';
import { Check, Eye, Heart, MessageCircle, Share2, Calendar } from 'lucide-react';
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
  const visibleHashtags = (video.hashtags || []).slice(0, 3);
  const extraHashtags = (video.hashtags || []).length - visibleHashtags.length;

  return (
    <div
      className={`group relative rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-white dark:bg-neutral-900 border shadow-sm hover:shadow-md ${
        selected
          ? 'border-sky-600 ring-2 ring-sky-500/20 dark:border-sky-500'
          : 'border-stone-200/80 dark:border-neutral-800 hover:border-stone-300 dark:hover:border-neutral-700'
      }`}
      onClick={() => !compareMode && onOpen(video)}
    >
      <VideoThumbnail
        category={video.category}
        duration={video.duration}
        status={video.status}
        coverUrl={video.coverUrl}
        videoUrl={video.videoUrl}
      >
        {/* Select checkbox */}
        {(compareMode || selected) && (
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(video); }}
            className={`absolute bottom-2.5 left-2.5 w-6 h-6 rounded-md flex items-center justify-center transition-all z-20 ${
              selected
                ? 'bg-sky-600 text-white shadow-sm ring-2 ring-white/50'
                : 'bg-black/50 text-transparent hover:bg-black/70 border border-white/60'
            }`}
          >
            {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>
        )}
      </VideoThumbnail>

      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-bold text-sm leading-snug line-clamp-2 text-stone-900 dark:text-white min-h-[38px] group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
          {video.title}
        </h3>

        {/* Account & Date */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <AccountMini video={video} />
          <span className="text-[11px] font-medium text-stone-400 dark:text-neutral-500 flex items-center gap-1 flex-shrink-0">
            <Calendar className="w-3 h-3" strokeWidth={2} />
            {video.publishedAt}
          </span>
        </div>

        {/* Stats 4-col grid */}
        <div className="grid grid-cols-4 gap-1 p-2 rounded-lg bg-stone-50/80 dark:bg-neutral-800/60 border border-stone-200/60 dark:border-neutral-700/60">
          <div className="text-center">
            <Eye className="w-3 h-3 mx-auto mb-0.5 text-stone-400 dark:text-neutral-500" strokeWidth={2.2} />
            <p className="font-mono font-bold text-[11px] text-stone-800 dark:text-neutral-200">{formatNum(video.views)}</p>
          </div>
          <div className="text-center">
            <Heart className="w-3 h-3 mx-auto mb-0.5 text-rose-500/80" strokeWidth={2.2} />
            <p className="font-mono font-bold text-[11px] text-stone-800 dark:text-neutral-200">{formatNum(video.likes)}</p>
          </div>
          <div className="text-center">
            <MessageCircle className="w-3 h-3 mx-auto mb-0.5 text-sky-500/80" strokeWidth={2.2} />
            <p className="font-mono font-bold text-[11px] text-stone-800 dark:text-neutral-200">{formatNum(video.comments)}</p>
          </div>
          <div className="text-center">
            <Share2 className="w-3 h-3 mx-auto mb-0.5 text-emerald-500/80" strokeWidth={2.2} />
            <p className="font-mono font-bold text-[11px] text-stone-800 dark:text-neutral-200">{formatNum(video.shares)}</p>
          </div>
        </div>

        {/* Engagement Rate Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-stone-500 dark:text-neutral-400">
              Engagement Rate
            </span>
            <span className="font-mono font-bold text-stone-900 dark:text-white">
              {video.engagement}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-stone-100 dark:bg-neutral-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                video.engagement >= 12
                  ? 'bg-emerald-500'
                  : video.engagement >= 8
                  ? 'bg-sky-500'
                  : 'bg-stone-400 dark:bg-neutral-500'
              }`}
              style={{ width: `${Math.min(video.engagement * 5, 100)}%` }}
            />
          </div>
        </div>

        {/* Hashtags */}
        {visibleHashtags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap pt-0.5">
            {visibleHashtags.map((tag: string, i: number) => (
              <HashtagPill key={i} tag={tag} />
            ))}
            {extraHashtags > 0 && (
              <HashtagPill tag={`+${extraHashtags}`} muted />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
