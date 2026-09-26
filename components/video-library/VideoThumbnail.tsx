import React from 'react';
import { Play, Clock } from 'lucide-react';
import { CATEGORY_META, STATUS_META } from '@/lib/video-library/mock-data';
import { extractTikTokVideoId } from '@/lib/video-library/tiktok';
import { TikTokEmbed } from './TikTokEmbed';

interface VideoThumbnailProps {
  category: string;
  duration: string;
  status: 'trending' | 'top' | 'normal' | null;
  size?: 'sm' | 'md' | 'lg';
  coverUrl?: string;
  videoUrl?: string;
  children?: React.ReactNode;
}

export function VideoThumbnail({
  category,
  duration,
  status,
  size = 'md',
  coverUrl,
  videoUrl,
  children = null,
}: VideoThumbnailProps) {
  const cat = CATEGORY_META[category as keyof typeof CATEGORY_META] ?? CATEGORY_META.tutorial;
  const Ico = cat.icon;
  const statusKey = (status && status !== 'normal') ? (status as 'trending' | 'top') : null;
  const statusMeta = statusKey ? STATUS_META[statusKey] : null;
  const StatusIco = statusMeta?.icon;
  const heights = { sm: 'h-24', md: 'h-40', lg: 'h-60' };
  const iconSize = { sm: 'w-7 h-7', md: 'w-10 h-10', lg: 'w-12 h-12' };

  const videoId = extractTikTokVideoId(videoUrl);
  const [imageError, setImageError] = React.useState(false);

  return (
    <div className={`relative ${heights[size]} overflow-hidden rounded-t-xl flex items-center justify-center group/thumb bg-stone-900`}>
      {/* Use proxied cover image if available, falling back to TikTokEmbed or icon gradient */}
      {coverUrl && !imageError ? (
        <img
          src={`/api/tiktok-image?url=${encodeURIComponent(coverUrl)}`}
          alt="Video Cover"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-105"
          onError={() => setImageError(true)}
        />
      ) : videoId ? (
        <TikTokEmbed videoId={videoId} mode="player" lazy passThroughClicks />
      ) : (
        // Texture + category icon fallback when no video id is available
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${cat.grad[0]}, ${cat.grad[1]})` }}>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }} />
          <Ico className={`${iconSize[size]} text-white/90 relative z-10`} strokeWidth={1.75} />
        </div>
      )}

      {/* Subtle bottom gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

      {/* hover play overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 z-10 pointer-events-none bg-black/30 backdrop-blur-[2px]">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-stone-900 shadow-lg transform transition-transform group-hover/thumb:scale-110">
          <Play className="w-4 h-4 fill-current ml-0.5" />
        </div>
      </div>

      {/* status badge top-left */}
      {statusMeta && StatusIco && (
        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md flex items-center gap-1 text-white z-20 text-[10px] font-bold shadow-sm"
          style={{ background: statusMeta.solid }}>
          <StatusIco className="w-3 h-3" strokeWidth={2.4} />
          <span>{statusMeta.label}</span>
        </div>
      )}

      {/* category label top-right */}
      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md z-20 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-wide">
        {cat.label}
      </div>

      {/* duration bottom-right */}
      <div className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded-md text-white flex items-center gap-1 z-20 bg-black/70 backdrop-blur-sm text-[10px] font-mono">
        <Clock className="w-2.5 h-2.5" strokeWidth={2.2} />
        {duration}
      </div>

      {children}
    </div>
  );
}
