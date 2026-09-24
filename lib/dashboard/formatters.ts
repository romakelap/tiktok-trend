import type { CategoryId } from "./types";

/** Compact number formatter (e.g. 1.2B / 1.2M / 12K / 1,234). */
export function fmt(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)
    return (n / 1_000).toFixed(n >= 100_000 ? 0 : 1) + "K";
  return n?.toLocaleString("id-ID") ?? "0";
}

/** Rupiah formatter with M / jt buckets. */
export function fmtRp(n: number): string {
  if (n >= 1_000_000_000)
    return "Rp " + (n / 1_000_000_000).toFixed(1) + "M";
  if (n >= 1_000_000) return "Rp " + (n / 1_000_000).toFixed(0) + "jt";
  return "Rp " + n?.toLocaleString("id-ID");
}

/** Percentage formatter (0.72 -> "72%"). */
export function fmtPct(n: number, d = 0): string {
  return `${(n * 100).toFixed(d)}%`;
}

/** Compute a stable key for a pair of category ids, ignoring order. */
export function getCombinationKey(a: CategoryId, b: CategoryId): string {
  const order: CategoryId[] = [
    "edukasi",
    "komedi",
    "kuliner",
    "lifestyle",
    "teknologi",
  ];
  const sorted = [a, b].sort(
    (x, y) => order.indexOf(x) - order.indexOf(y)
  );
  return `${sorted[0]}-${sorted[1]}`;
}
