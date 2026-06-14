import React from 'react';
import { TOKENS } from '@/lib/design-tokens';

interface HashtagPillProps {
  tag: string;
  muted?: boolean;
}

export function HashtagPill({ tag, muted = false }: HashtagPillProps) {
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded-md font-bold"
      style={{
        background: muted ? 'rgba(0,0,0,0.04)' : 'rgba(14,165,233,0.07)',
        color: muted ? TOKENS.textMuted : '#0369a1',
        border: `1px solid ${muted ? TOKENS.divider : 'rgba(14,165,233,0.18)'}`,
        fontSize: 10,
      }}>
      {tag}
    </span>
  );
}
