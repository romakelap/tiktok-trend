/**
 * Number formatters shared across analytics components. Kept separate from
 * `lib/dashboard/formatters` to preserve analytics' slightly different
 * rounding rules (e.g. drop trailing zeros for mid-range K values).
 */

export function formatNum(n: number): string {
  if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1) + "M";
  }
  if (n >= 1_000) {
    return (
      (n / 1_000).toFixed(n >= 10_000 ? 1 : 2).replace(/\.0+$/, "") + "K"
    );
  }
  return n.toLocaleString("id-ID");
}

export function formatPct(n: number, d = 0): string {
  return `${(n * 100).toFixed(d)}%`;
}

/** Two-letter initials derived from an account handle (e.g. `kebun.bali` -> `KB`). */
export function initialsFrom(s: string): string {
  return s
    .replace(/[._-]/g, " ")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}
