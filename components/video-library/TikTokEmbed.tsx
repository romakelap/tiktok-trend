"use client";

import { useEffect, useRef, useState } from "react";

import {
  tiktokEmbedUrl,
  tiktokPlayerUrl,
} from "@/lib/video-library/tiktok";

type TikTokEmbedMode = "player" | "card";

interface TikTokEmbedProps {
  /** Numeric TikTok video id (e.g. "7638276140452334866"). */
  videoId: string;
  /**
   * `player` (default) renders the lightweight `tiktok.com/player/v1/{id}`
   * iframe — small chrome, just video. Good for grid thumbnails.
   * `card` renders the full `tiktok.com/embed/v2/{id}` styled card.
   * Good for detail drawers.
   */
  mode?: TikTokEmbedMode;
  /**
   * When true (default), the iframe is only mounted once the container
   * enters the viewport via IntersectionObserver. Keeps long video grids
   * fast — only on-screen cards pay the embed cost.
   */
  lazy?: boolean;
  /**
   * When true, the iframe gets `pointer-events: none` so clicks pass
   * through to the parent (e.g. card opens detail drawer instead of
   * playing video inline). Defaults to true.
   */
  passThroughClicks?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Embeds a TikTok video using TikTok's first-party iframe. Bypasses the
 * hot-link blocking that prevents `<img src={coverUrl}>` from rendering
 * because the iframe loads from `tiktok.com` itself.
 *
 * The component is *just* the iframe layer — caller is responsible for
 * giving it a sized container (`width`/`height` or aspect-ratio).
 */
export function TikTokEmbed({
  videoId,
  mode = "player",
  lazy = true,
  passThroughClicks = true,
  className = "",
  style,
}: TikTokEmbedProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [shouldMount, setShouldMount] = useState(!lazy);

  useEffect(() => {
    if (!lazy || shouldMount) return;
    const el = wrapperRef.current;
    if (!el) return;

    // SSR guard
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      setShouldMount(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldMount(true);
          obs.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [lazy, shouldMount]);

  const src = mode === "card" ? tiktokEmbedUrl(videoId) : tiktokPlayerUrl(videoId);

  return (
    <div
      ref={wrapperRef}
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      style={style}
    >
      {shouldMount ? (
        <iframe
          src={src}
          title={`TikTok video ${videoId}`}
          allow="encrypted-media; clipboard-write"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full h-full block"
          style={{
            border: 0,
            background: "transparent",
            pointerEvents: passThroughClicks ? "none" : "auto",
          }}
        />
      ) : null}
    </div>
  );
}
