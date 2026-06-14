/**
 * Number formatters for the ML Predictions module. Kept separate from
 * `lib/analytics/formatters` and `lib/dashboard/formatters` so each page can
 * tune precision independently — here `formatPct` defaults to 1 decimal
 * place (e.g. "87.0%") which matches how the ML output is typically read.
 */

export function formatPct(n: number, digits = 1): string {
  return `${(n * 100).toFixed(digits)}%`;
}

export function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("id-ID");
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
