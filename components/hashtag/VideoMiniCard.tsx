import React from 'react';
import { Play, Clock, Flame, Eye, Heart, MessageCircle } from "lucide-react";
import { TOKENS } from "@/lib/design-tokens";
import { fmt, RelatedVideo } from "@/lib/hashtag/mock-data";

interface VideoMiniCardProps {
  v: RelatedVideo;
  color: string;
  rank: number;
}

export function VideoMiniCard({ v, color, rank }: VideoMiniCardProps) {
  const videoLink = v.shareUrl || v.videoUrl || `https://www.tiktok.com`;

  const handleClick = () => {
    window.open(videoLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <a 
      href={videoLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative rounded-xl overflow-hidden block transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        background: '#fff',
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow: '0 2px 10px rgba(0,0,0,0.04),inset 0 1px 0 rgba(255,255,255,1)'
      }}
    >
      {/* thumb */}
      <div 
        className="relative overflow-hidden" 
        style={{ height: 80, background: `linear-gradient(135deg,${color}18,${color}2e)` }}
      >
        {v.coverUrl ? (
          <img 
            src={v.coverUrl} 
            alt={v.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : null}
        
        {/* overlay play button */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-colors duration-200"
          style={{ background: 'rgba(0,0,0,0.2)' }}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/95 shadow-sm transition-transform duration-200 group-hover:scale-110">
            <Play className="w-3.5 h-3.5 text-black fill-current ml-0.5" />
          </div>
        </div>

        {/* rank */}
        <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-md flex items-center justify-center text-white font-black"
          style={{ background: 'rgba(0,0,0,0.6)', fontSize: 9 }}>#{rank}</div>
        {v.viral && (
          <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-black text-white"
            style={{ background: TOKENS.negative, fontSize: 8 }}>
            <Flame className="w-2 h-2 fill-current"/>VIRAL
          </div>
        )}
        <div className="absolute bottom-1.5 right-1.5 px-1 py-0.5 rounded font-bold text-white flex items-center gap-0.5"
          style={{ background: 'rgba(0,0,0,0.6)', fontSize: 9 }}>
          <Clock className="w-2 h-2"/>{v.duration}
        </div>
      </div>
      {/* info */}
      <div className="p-2.5">
        <p className="font-bold leading-tight mb-1.5 line-clamp-2" style={{ color: TOKENS.text, fontSize: 10 }}>{v.title}</p>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-0.5" style={{ color: TOKENS.textMuted, fontSize: 9 }}>
            <Eye className="w-2.5 h-2.5"/>{fmt(v.views)}
          </span>
          <span className="flex items-center gap-0.5" style={{ color: TOKENS.negative, fontSize: 9 }}>
            <Heart className="w-2.5 h-2.5 fill-current"/>{fmt(v.likes)}
          </span>
          <span className="flex items-center gap-0.5" style={{ color: TOKENS.accent, fontSize: 9 }}>
            <MessageCircle className="w-2.5 h-2.5"/>{fmt(v.comments)}
          </span>
          <span className="ml-auto" style={{ color: TOKENS.textMuted, fontSize: 8 }}>{v.date}</span>
        </div>
      </div>
    </a>
  );
}
