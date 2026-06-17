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

/**
 * Thumbnail block used in `VideoCard` and the drawer header. When a TikTok
 * video id can be extracted from `videoUrl`, this renders TikTok's own
 * iframe player as the cover (bypasses the CDN hot-link block that makes
 * `<img src={coverUrl}>` 403). Falls back to a category-coloured gradient
 * with an icon when no id is available.
 *
 * The iframe is non-interactive so card clicks still open the detail
 * drawer (set `pointer-events: auto` on the embed in the drawer itself if
 * you want playback there).
 */
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
  const heights = { sm: 'h-24', md: 'h-36', lg: 'h-56' };
  const iconSize = { sm: 'w-7 h-7', md: 'w-10 h-10', lg: 'w-14 h-14' };

  const videoId = extractTikTokVideoId(videoUrl);
  const [imageError, setImageError] = React.useState(false);

  return (
    <div className={`relative ${heights[size]} overflow-hidden rounded-t-2xl flex items-center justify-center group/thumb`}
      style={{
        background: `linear-gradient(135deg, ${cat.grad[0]}, ${cat.grad[1]})`,
      }}>
      {/* Use proxied cover image if available, falling back to TikTokEmbed or icon gradient */}
      {coverUrl && !imageError ? (
        <img
          src={`/api/tiktok-image?url=${encodeURIComponent(coverUrl)}`}
          alt="Video Cover"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
          onError={() => setImageError(true)}
        />
      ) : videoId ? (
        <TikTokEmbed videoId={videoId} mode="player" lazy passThroughClicks />
      ) : (
        // Texture + category icon fallback when no video id is available
        <>
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }} />
          <Ico className={`${iconSize[size]} text-white relative z-10`} style={{ opacity: 0.85, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.25))' }} strokeWidth={1.6} />
        </>
      )}

      {/* hover play overlay (purely decorative — actual play happens in drawer) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 z-10 pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.35)' }}>
        <div className="w-11 h-11 rounded-full flex items-center justify-center bg-white" style={{ boxShadow: '0 0 24px rgba(255,255,255,0.45)' }}>
          <Play className="w-4 h-4 text-black" fill="currentColor" />
        </div>
      </div>

      {/* status badge top-left */}
      {statusMeta && StatusIco && (
        <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md flex items-center gap-1 text-white z-20"
          style={{
            background: statusMeta.solid,
            boxShadow: `0 0 10px ${statusMeta.solid}66`,
            fontSize: 10, fontWeight: 800, letterSpacing: '0.04em',
          }}>
          <StatusIco className="w-3 h-3" strokeWidth={2.5} />
          {statusMeta.label.toUpperCase()}
        </div>
      )}

      {/* category label top-right */}
      <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md z-20"
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
        {cat.label.toUpperCase()}
      </div>

      {/* duration bottom-right */}
      <div className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded text-white flex items-center gap-1 z-20"
        style={{ background: 'rgba(0,0,0,0.7)', fontSize: 10, fontWeight: 700 }}>
        <Clock className="w-2.5 h-2.5" strokeWidth={2.5} />
        {duration}
      </div>

      {children}
    </div>
  );
}
