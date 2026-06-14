import type { CSSProperties, ReactNode } from "react";

import { TOKENS } from "@/lib/design-tokens";

type MonoSize = "xs" | "sm" | "md";

const SIZE_PX: Record<MonoSize, number> = {
  xs: 10,
  sm: 11,
  md: 12,
};

/**
 * Inline monospace text used for small numeric labels (e.g. tier dots,
 * count badges, axis ticks) across dashboard and analytics tables. Uses
 * JetBrains Mono and tracks slightly tighter than the body text.
 *
 * Sizes:
 *   - `xs` 10px
 *   - `sm` 11px (default)
 *   - `md` 12px
 *
 * Pass `dim` to switch to the muted text color, or override via `style`.
 */
export function Mono({
  children,
  size = "sm",
  dim = false,
  className = "",
  style,
}: {
  children: ReactNode;
  size?: MonoSize;
  dim?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: SIZE_PX[size],
        letterSpacing: "-0.02em",
        color: dim ? TOKENS.textMuted : TOKENS.text,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
