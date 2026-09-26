import React from 'react';
import { AtSign } from 'lucide-react';
import { TYPE_META, initialsFrom, VideoType } from '@/lib/video-library/mock-data';

interface AccountMiniProps {
  video: VideoType;
  size?: 'sm' | 'md';
}

export function AccountMini({ video, size = 'sm' }: AccountMiniProps) {
  const meta = TYPE_META[video.accountType as keyof typeof TYPE_META] || TYPE_META.inspiration;
  const av = size === 'sm' ? 'w-7 h-7 text-[10px]' : 'w-9 h-9 text-xs';
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div
        className={`${av} rounded-lg flex items-center justify-center flex-shrink-0 font-black text-white shadow-sm`}
        style={{
          background: meta.solid,
        }}>
        {initialsFrom(video.accountDisplayName || video.account)}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`font-bold truncate flex items-center gap-1 text-stone-900 dark:text-white ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          <AtSign className="w-3 h-3 flex-shrink-0 text-stone-400 dark:text-neutral-500" strokeWidth={2.2} />
          {video.account}
        </p>
        <p className="text-[11px] truncate text-stone-500 dark:text-neutral-400">
          {video.accountDisplayName || video.account}
        </p>
      </div>
    </div>
  );
}
