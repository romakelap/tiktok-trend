'use client';

import React, { useState } from 'react';
import { Account, TYPE_META, initialsFrom } from '@/lib/account-management/mock-data';

interface AccountAvatarProps {
  account: Account;
  size?: number;
}

/**
 * Returns true for URLs that may block hot-linking from browser origins.
 * This covers TikTok's own CDN domains AND Echotik's CDN (which re-hosts
 * TikTok user avatars). All matched URLs are routed through our server-side
 * `/api/tiktok-image` proxy to avoid CORS / Referer restrictions.
 */
function isTikTokCdnUrl(url: string): boolean {
  return /(tiktokcdn(?:-us|-eu)?\.com|byteimg\.com|bytedance\.com|echotik\.live)/i.test(url);
}

/**
 * Wraps a TikTok CDN URL in our server-side proxy so `<img>` actually
 * renders. Non-TikTok URLs (e.g. a user-uploaded gravatar URL) are passed
 * through unchanged.
 */
function resolveAvatarSrc(rawUrl: string): string {
  if (!rawUrl) return rawUrl;
  if (isTikTokCdnUrl(rawUrl)) {
    return `/api/tiktok-image?url=${encodeURIComponent(rawUrl)}`;
  }
  return rawUrl;
}

export const AccountAvatar = ({ account, size = 44 }: AccountAvatarProps) => {
  const meta = TYPE_META[account.type];
  const [imgError, setImgError] = useState(false);

  if (account.avatarUrl && account.avatarUrl.startsWith('http') && !imgError) {
    return (
      <img
        src={resolveAvatarSrc(account.avatarUrl)}
        alt={account.displayName}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className="rounded-2xl object-cover flex-shrink-0 relative bg-gray-100"
        style={{
          width: size,
          height: size,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: `1px solid ${TOKENS_BORDER_FALLBACK(meta.solid)}`,
        }}
      />
    );
  }

  return (
    <div
      className="rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-white relative"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${meta.solid}, ${meta.solid}cc)`,
        boxShadow: `0 4px 14px ${meta.solid}33, inset 0 1px 0 rgba(255,255,255,0.18)`,
        fontSize: size * 0.32,
        letterSpacing: '-0.02em',
      }}>
      {initialsFrom(account.displayName)}
    </div>
  );
};

// Simple fallback border color generator to keep a clean avatar outline
function TOKENS_BORDER_FALLBACK(color: string) {
  if (color === '#111111') return 'rgba(17,17,17,0.12)';
  if (color === '#059669') return 'rgba(5,150,105,0.18)';
  if (color === '#b91c1c') return 'rgba(185,28,28,0.12)';
  return 'rgba(30,64,175,0.12)';
}
