import { TOKENS } from "@/lib/design-tokens";

type GridBgProps = {
  /** Color theme. `light` for light backgrounds, `dark` for charcoal cards. */
  theme?: "light" | "dark";
  /** Grid cell size in pixels. */
  size?: number;
};

/**
 * Decorative grid pattern + radial fade. Used as a background layer in
 * dashboard cards and section containers. Place inside a `relative` parent;
 * the layers are absolutely positioned and ignore pointer events.
 */
export function GridBg({ theme = "light", size = 40 }: GridBgProps) {
  const gridLine =
    theme === "dark" ? "rgba(255,255,255,0.04)" : TOKENS.gridLine;
  const fade =
    theme === "dark"
      ? "radial-gradient(ellipse 80% 75% at 50% 50%,transparent 20%,rgba(26,26,26,0.5) 100%)"
      : "radial-gradient(ellipse 85% 80% at 50% 40%,rgba(255,255,255,0.88) 20%,rgba(255,255,255,0.3) 100%)";

  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${gridLine} 1px,transparent 1px),linear-gradient(90deg,${gridLine} 1px,transparent 1px)`,
          backgroundSize: `${size}px ${size}px`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: fade }}
      />
    </>
  );
}
