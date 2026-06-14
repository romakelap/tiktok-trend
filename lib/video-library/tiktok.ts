/**
 * Helpers for working with TikTok video URLs in the video library.
 *
 * TikTok's CDN cover images (`p16-…tiktokcdn.com`) reject hot-linking from
 * non-tiktok.com origins, which is why a raw `<img src={coverUrl}>` shows up
 * blank or 403. The reliable way to display the cover/preview is to use an
 * iframe pointing at `tiktok.com/player/v1/{id}` (or `embed/v2/{id}`),
 * because the iframe loads from TikTok's own domain.
 */

/**
 * Extract the numeric video id from a TikTok URL.
 *
 * Examples accepted:
 *   - `https://www.tiktok.com/@user/video/7638276140452334866`
 *   - `https://www.tiktok.com/@user/video/7638276140452334866?lang=en`
 *   - `https://m.tiktok.com/v/7638276140452334866.html`
 *
 * Returns `null` when no id can be found.
 */
export function extractTikTokVideoId(
  videoUrl?: string | null
): string | null {
  if (!videoUrl) return null;
  // /video/{id} (web format)
  const m1 = videoUrl.match(/\/video\/(\d{6,})/);
  if (m1) return m1[1];
  // /v/{id}.html (mobile share format)
  const m2 = videoUrl.match(/\/v\/(\d{6,})/);
  if (m2) return m2[1];
  // Last resort: a long numeric token anywhere in the URL
  const m3 = videoUrl.match(/(\d{15,})/);
  if (m3) return m3[1];
  return null;
}

/** Iframe URL for the lightweight TikTok video player (no comments UI). */
export function tiktokPlayerUrl(videoId: string): string {
  // music_info/description set to 0 to keep the player chrome minimal
  return `https://www.tiktok.com/player/v1/${videoId}?music_info=0&description=0`;
}

/** Iframe URL for the full TikTok card embed (caption, account, comments). */
export function tiktokEmbedUrl(videoId: string): string {
  return `https://www.tiktok.com/embed/v2/${videoId}?lang=en-US`;
}
