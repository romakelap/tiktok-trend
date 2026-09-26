import React from 'react';
import { Check, Clock, Calendar, ArrowUpRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoType, CATEGORY_META, TYPE_META, STATUS_META, formatNum, initialsFrom } from '@/lib/video-library/mock-data';

interface VideoListRowProps {
  video: VideoType;
  selected: boolean;
  onSelect: (v: VideoType) => void;
  onOpen: (v: VideoType) => void;
  compareMode: boolean;
  isLast: boolean;
}

export function VideoListRow({ video, selected, onSelect, onOpen, compareMode, isLast }: VideoListRowProps) {
  const cat = CATEGORY_META[video.category as keyof typeof CATEGORY_META] ?? CATEGORY_META.tutorial;
  const Ico = cat.icon;
  const meta = TYPE_META[video.accountType as keyof typeof TYPE_META] || TYPE_META.inspiration;

  return (
    <div
      className={`grid items-center gap-4 px-6 py-3.5 transition-colors cursor-pointer border-b border-stone-100 dark:border-neutral-800 ${
        selected
          ? 'bg-sky-50/50 dark:bg-sky-950/20'
          : 'hover:bg-stone-50/70 dark:hover:bg-neutral-800/50'
      } ${isLast ? 'border-b-0' : ''}`}
      onClick={() => !compareMode && onOpen(video)}
      style={{
        gridTemplateColumns: '32px 1.6fr 0.8fr 90px 90px 90px 110px 90px',
      }}
    >
      {/* select checkbox */}
      {(compareMode || selected) ? (
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(video); }}
          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
            selected
              ? 'bg-sky-600 text-white ring-1 ring-sky-600'
              : 'border border-stone-300 dark:border-neutral-700 bg-white dark:bg-neutral-900'
          }`}
        >
          {selected && <Check className="w-3 h-3 stroke-[3]" />}
        </button>
      ) : (
        <div />
      )}

      {/* title + thumb mini */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-sm"
          style={{ background: `linear-gradient(135deg, ${cat.grad[0]}, ${cat.grad[1]})` }}
        >
          <Ico className="w-4.5 h-4.5 text-white/90" strokeWidth={1.8} />
          {video.status === 'trending' && (
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center z-10 bg-rose-500 shadow-sm">
              <Flame className="w-2 h-2 text-white stroke-[3]" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm truncate text-stone-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
            {video.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-400 dark:text-neutral-500 font-medium">
            <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400 rounded">
              {cat.label}
            </span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Clock className="w-2.5 h-2.5" strokeWidth={2.2} />{video.duration}
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <Calendar className="w-2.5 h-2.5" strokeWidth={2.2} />{video.publishedAt}
            </span>
          </div>
        </div>
      </div>

      {/* account */}
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 font-bold text-white text-[9px] shadow-sm"
          style={{ background: meta.solid }}
        >
          {initialsFrom(video.accountDisplayName || video.account)}
        </div>
        <span className="font-semibold text-xs truncate text-stone-800 dark:text-neutral-200">
          @{video.account}
        </span>
      </div>

      {/* views */}
      <span className="font-mono font-bold text-xs text-stone-900 dark:text-white">
        {formatNum(video.views)}
      </span>
      {/* likes */}
      <span className="font-mono font-semibold text-xs text-stone-600 dark:text-neutral-400">
        {formatNum(video.likes)}
      </span>
      {/* comments */}
      <span className="font-mono font-semibold text-xs text-stone-600 dark:text-neutral-400">
        {formatNum(video.comments)}
      </span>

      {/* engagement */}
      <div>
        <span
          className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md inline-block text-center ${
            video.engagement >= 12
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
              : video.engagement >= 8
              ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
              : 'bg-stone-100 text-stone-700 dark:bg-neutral-800 dark:text-neutral-300'
          }`}
        >
          {video.engagement}%
        </span>
      </div>

      {/* action */}
      <Button
        size="sm"
        variant="outline"
        className="h-7 px-2.5 rounded-lg text-xs font-semibold border-stone-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-stone-50 dark:hover:bg-neutral-700 text-stone-700 dark:text-neutral-200"
        onClick={() => !compareMode && onOpen(video)}
      >
        Detail
        <ArrowUpRight className="w-3 h-3 ml-1" strokeWidth={2.2} />
      </Button>
    </div>
  );
}
