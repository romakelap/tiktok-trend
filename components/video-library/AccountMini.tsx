import React from 'react';
import { AtSign } from 'lucide-react';
import { TYPE_META, initialsFrom, VideoType } from '@/lib/video-library/mock-data';
import { TOKENS } from '@/lib/design-tokens';

interface AccountMiniProps {
  video: VideoType;
  size?: 'sm' | 'md';
}

export function AccountMini({ video, size = 'sm' }: AccountMiniProps) {
  const meta = TYPE_META[video.accountType as keyof typeof TYPE_META];
  const av = size === 'sm' ? 28 : 36;
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div
        className="rounded-lg flex items-center justify-center flex-shrink-0 font-black text-white"
        style={{
          width: av, height: av,
          background: `linear-gradient(135deg, ${meta.solid}, ${meta.solid}cc)`,
          boxShadow: `0 2px 8px ${meta.solid}33`,
          fontSize: av * 0.34,
          letterSpacing: '-0.02em',
        }}>
        {initialsFrom(video.accountDisplayName)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-black truncate flex items-center gap-1" style={{ color: TOKENS.text, fontSize: size === 'sm' ? 11.5 : 13 }}>
          <AtSign className="w-2.5 h-2.5 flex-shrink-0" style={{ color: TOKENS.textMuted }} strokeWidth={2.5} />
          {video.account}
        </p>
        <p className="text-[10px] truncate" style={{ color: TOKENS.textMuted }}>{video.accountDisplayName}</p>
      </div>
    </div>
  );
}
