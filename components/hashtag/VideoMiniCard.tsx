import React, { useState } from 'react';
import { Play, Clock, Flame, Eye, Heart, MessageCircle, ExternalLink, Video as VideoIcon } from "lucide-react";
import { fmt, RelatedVideo } from "@/lib/hashtag/mock-data";
import { resolveAvatarUrl } from "@/lib/utils";
import { extractTikTokVideoId } from "@/lib/video-library/tiktok";
import { TikTokEmbed } from "@/components/video-library/TikTokEmbed";

interface VideoMiniCardProps {
  v: RelatedVideo;
  color?: string;
  rank: number;
}

export function VideoMiniCard({ v, color = '#0284c7', rank }: VideoMiniCardProps) {
  const videoLink = v.shareUrl || v.videoUrl || `https://www.tiktok.com`;
  const [imageError, setImageError] = useState(false);

  const videoId = extractTikTokVideoId(v.shareUrl || v.videoUrl);
  const proxiedCoverUrl = v.coverUrl ? resolveAvatarUrl(v.coverUrl) : null;

  return (
    <a
      href={videoLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative rounded-xl overflow-hidden block bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs hover:shadow-md hover:border-sky-400 dark:hover:border-sky-600 transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-[16/10] bg-stone-900 flex items-center justify-center">
        {proxiedCoverUrl && !imageError ? (
          <img
            src={proxiedCoverUrl}
            alt={v.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : videoId ? (
          <TikTokEmbed videoId={videoId} mode="player" lazy passThroughClicks />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-sky-900/60 to-stone-900 text-stone-300 p-3 text-center">
            <VideoIcon className="w-6 h-6 text-sky-400 mb-1 opacity-80" />
            <span className="text-[10px] font-mono text-stone-300 font-bold">TikTok Video</span>
          </div>
        )}

        {/* Play Overlay (Only when using image or fallback) */}
        {(!videoId || (proxiedCoverUrl && !imageError)) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white/95 text-stone-900 shadow-md transition-transform duration-200 group-hover:scale-110">
              <Play className="w-4 h-4 fill-current ml-0.5 text-sky-600" />
            </div>
          </div>
        )}

        {/* Rank Badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md font-mono font-bold text-[10px] text-white bg-stone-900/85 backdrop-blur-xs border border-white/10 z-10">
          #{rank}
        </div>

        {/* Viral Badge */}
        {v.viral && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[9px] text-white bg-rose-600 shadow-xs z-10">
            <Flame className="w-2.5 h-2.5 fill-current" />
            VIRAL
          </div>
        )}

        {/* Duration */}
        {v.duration && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md font-mono text-[9px] text-white bg-black/80 backdrop-blur-xs flex items-center gap-1 z-10">
            <Clock className="w-2.5 h-2.5" />
            {v.duration}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-3.5 space-y-2.5">
        <p className="font-bold text-xs text-stone-900 dark:text-white leading-snug line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
          {v.title}
        </p>

        <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-neutral-400 pt-2 border-t border-stone-100 dark:border-neutral-800">
          <div className="flex items-center gap-3 font-mono font-bold">
            <span className="flex items-center gap-1 text-stone-800 dark:text-neutral-200" title="Total Views">
              <Eye className="w-3 h-3 text-sky-500" />
              {fmt(v.views)}
            </span>
            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400" title="Likes">
              <Heart className="w-3 h-3 fill-current text-rose-500" />
              {fmt(v.likes)}
            </span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400" title="Comments">
              <MessageCircle className="w-3 h-3 text-emerald-500" />
              {fmt(v.comments)}
            </span>
          </div>

          <span className="flex items-center gap-0.5 text-[10px] text-stone-400 group-hover:text-sky-500 transition-colors">
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </a>
  );
}
