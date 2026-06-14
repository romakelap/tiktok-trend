/**
 * Shared design tokens used across dashboard pages.
 *
 * Replaces the per-page `T` object that was duplicated across every
 * protected page. Inline color constants in pages should be progressively
 * migrated to read from `TOKENS` instead.
 * 
 * Uses CSS variables mapped in globals.css to support dark/light modes seamlessly.
 */
export const TOKENS = {
  // Backgrounds
  bg: "var(--bg-custom, #f8f8f6)",
  bgSoft: "var(--bg-soft-custom, #f9f9f9)",
  card: "var(--card-custom, #ffffff)",
  cardSoft: "var(--card-soft-custom, rgba(255,255,255,0.9))",
  cardBorder: "var(--card-border-custom, rgba(0,0,0,0.07))",
  sidebar: "var(--sidebar-custom, #ffffff)",
  header: "var(--header-custom, rgba(248,248,246,0.95))",

  // Text
  text: "var(--text-custom, #111111)",
  textMuted: "var(--text-muted-custom, rgba(0,0,0,0.42))",
  textSubtle: "var(--text-subtle-custom, rgba(0,0,0,0.62))",
  textProse: "var(--text-prose-custom, rgba(0,0,0,0.78))",

  // Form
  input: "var(--input-custom, #ffffff)",
  inputBorder: "var(--input-border-custom, rgba(0,0,0,0.09))",
  inputFocus: "var(--input-focus-custom, rgba(26,107,255,0.35))",

  // Dividers / decoration
  divider: "var(--divider-custom, rgba(0,0,0,0.06))",
  barBg: "var(--bar-bg-custom, rgba(0,0,0,0.06))",
  charcoal: "var(--charcoal-custom, #1a1a1a)",

  // Grid background pattern
  gridLine: "var(--grid-line-custom, rgba(0,0,0,0.05))",
  gridDot: "var(--grid-dot-custom, rgba(0,0,0,0.13))",

  // Accent / semantic palette
  accent: "#f43f5e", // Rose-500 for TikTok BI branding theme
  accentSoft: "rgba(244,63,94,0.09)",
  positive: "#1A7A4A",
  positiveBg: "rgba(26,122,74,0.08)",
  negative: "#B91C1C",
  negativeBg: "rgba(185,28,28,0.07)",
  warning: "#92400E",
  warningBg: "rgba(146,64,14,0.08)",
} as const;

export type DesignTokens = typeof TOKENS;
