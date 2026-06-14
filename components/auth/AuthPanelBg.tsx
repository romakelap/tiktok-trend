"use client";

import { useEffect, useState } from "react";

type Variant = "light" | "dark";

type AuthPanelBgProps = {
  variant: Variant;
  /** When true, attaches a mouse-tracked decorative orb (use sparingly). */
  trackMouse?: boolean;
};

type Theme = {
  grid: string;
  dot: string;
  fadeStop1: string;
  fadeStop2: string;
  decorStroke: string;
  decorFill: string;
  decorOpacity: number;
  sparkleStroke: string;
  sparkleGlow: string;
  sparkleOpacity: number;
  orbHighlight: string;
  orbSoft: string;
  vignette: string;
};

const THEMES: Record<Variant, Theme> = {
  light: {
    grid: "rgba(0,0,0,0.07)",
    dot: "rgba(0,0,0,0.18)",
    fadeStop1: "rgba(249,249,249,0.93)",
    fadeStop2: "rgba(249,249,249,0.45)",
    decorStroke: "#333",
    decorFill: "rgba(51,51,51,0.4)",
    decorOpacity: 0.07,
    sparkleStroke: "#333",
    sparkleGlow: "none",
    sparkleOpacity: 0.1,
    orbHighlight: "rgba(0,0,0,0.04)",
    orbSoft: "rgba(0,0,0,0.03)",
    vignette: "transparent",
  },
  dark: {
    grid: "rgba(255,255,255,0.08)",
    dot: "rgba(255,255,255,0.2)",
    fadeStop1: "transparent",
    fadeStop2: "rgba(28,28,28,0.5)",
    decorStroke: "#fff",
    decorFill: "rgba(255,255,255,0.3)",
    decorOpacity: 0.22,
    sparkleStroke: "#fff",
    sparkleGlow: "drop-shadow(0 0 4px rgba(255,255,255,0.6))",
    sparkleOpacity: 0.4,
    orbHighlight: "rgba(255,255,255,0.1)",
    orbSoft: "rgba(210,210,210,0.07)",
    vignette:
      "radial-gradient(ellipse 90% 80% at 50% 50%,transparent 25%,rgba(28,28,28,0.5) 100%)",
  },
};

const SPARKLE_POSITIONS = [
  { x: "88%", y: "14%", size: 13, delay: "0s" },
  { x: "6%", y: "30%", size: 9, delay: "1.1s" },
  { x: "78%", y: "84%", size: 12, delay: "0.6s" },
  { x: "10%", y: "78%", size: 8, delay: "2s" },
];

/**
 * Decorative background shared by the auth pages.
 *
 * Renders the grid + dot pattern, corner SVG decorations, animated sparkles
 * and optional mouse-tracked glow orbs. Place inside a `relative` parent.
 */
export function AuthPanelBg({ variant, trackMouse = false }: AuthPanelBgProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const theme = THEMES[variant];

  useEffect(() => {
    if (!trackMouse) return;
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [trackMouse]);

  return (
    <>
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${theme.grid} 1px,transparent 1px),linear-gradient(90deg,${theme.grid} 1px,transparent 1px)`,
          backgroundSize: "44px 44px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle,${theme.dot} 1.2px,transparent 1.2px)`,
          backgroundSize: "44px 44px",
        }}
      />

      {/* Center fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 50% 50%,${theme.fadeStop1} 22%,${theme.fadeStop2} 100%)`,
        }}
      />

      {/* Mouse-tracked orbs (dark variant only) */}
      {trackMouse && variant === "dark" ? (
        <>
          <div
            className="absolute pointer-events-none"
            style={{
              width: 550,
              height: 550,
              borderRadius: "50%",
              background: `radial-gradient(circle,${theme.orbHighlight} 0%,transparent 60%)`,
              top: -140,
              left: -120,
              transform: `translate(${mouse.x * 0.013}px,${mouse.y * 0.013}px)`,
              transition: "transform 1.2s ease-out",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: `radial-gradient(circle,${theme.orbSoft} 0%,transparent 65%)`,
              bottom: -80,
              right: -80,
              transform: `translate(${-mouse.x * 0.009}px,${
                -mouse.y * 0.009
              }px)`,
              transition: "transform 1.2s ease-out",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: theme.vignette }}
          />
        </>
      ) : null}

      {/* Corner ring decoration */}
      <svg
        className="absolute top-10 right-10 pointer-events-none"
        style={{ opacity: theme.decorOpacity }}
        width="118"
        height="118"
        viewBox="0 0 118 118"
        fill="none"
      >
        <circle
          cx="59"
          cy="59"
          r="54"
          stroke={theme.decorStroke}
          strokeWidth="0.8"
          strokeDasharray="6 5"
        />
        <circle
          cx="59"
          cy="59"
          r="36"
          stroke={theme.decorStroke}
          strokeWidth="0.8"
          strokeDasharray="3 6"
          opacity={0.6}
        />
        <circle
          cx="59"
          cy="59"
          r="16"
          stroke={theme.decorStroke}
          strokeWidth="1.2"
        />
        <circle cx="59" cy="59" r="4" fill={theme.decorFill} />
      </svg>

      {/* Corner rect decoration */}
      <svg
        className="absolute bottom-10 left-10 pointer-events-none"
        style={{ opacity: theme.decorOpacity * 0.85 }}
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
      >
        <rect
          x="5"
          y="5"
          width="70"
          height="70"
          stroke={theme.decorStroke}
          strokeWidth="0.8"
          strokeDasharray="5 4"
          opacity={0.7}
        />
        <rect
          x="17"
          y="17"
          width="46"
          height="46"
          stroke={theme.decorStroke}
          strokeWidth="1.2"
        />
        <rect
          x="30"
          y="30"
          width="20"
          height="20"
          stroke={theme.decorStroke}
          strokeWidth="0.8"
          opacity={0.7}
        />
      </svg>

      {/* Sparkles */}
      {SPARKLE_POSITIONS.map((s, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: s.x,
            top: s.y,
            opacity: theme.sparkleOpacity,
            animation: `sparkFloat 4s ease-in-out infinite ${s.delay}`,
            filter: theme.sparkleGlow,
          }}
        >
          <svg
            width={s.size}
            height={s.size}
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M10 0 L10 20 M0 10 L20 10"
              stroke={theme.sparkleStroke}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M3 3 L17 17 M17 3 L3 17"
              stroke={theme.sparkleStroke}
              strokeWidth="0.8"
              strokeLinecap="round"
              opacity="0.55"
            />
          </svg>
        </div>
      ))}
    </>
  );
}
