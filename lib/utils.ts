import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns true for URLs that may block hot-linking from browser origins.
 * Covers TikTok CDN domains, ByteDance, and EchoTik CDN.
 */
export function isTikTokCdnUrl(url?: string | null): boolean {
  if (!url) return false;
  return /(tiktokcdn(?:-us|-eu)?\.com|byteimg\.com|bytedance\.com|echotik\.live)/i.test(url);
}

/**
 * Wraps a TikTok CDN URL in our server-side proxy (`/api/tiktok-image`)
 * so `<img>` renders cleanly without CORS / Referer restrictions.
 */
export function resolveAvatarUrl(rawUrl?: string | null): string {
  if (!rawUrl) return "";
  if (isTikTokCdnUrl(rawUrl)) {
    return `/api/tiktok-image?url=${encodeURIComponent(rawUrl)}`;
  }
  return rawUrl;
}

