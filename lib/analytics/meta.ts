import {
  BookOpen,
  Coffee,
  Compass,
  Flame,
  Moon,
  Star,
  Sun,
  Sunrise,
  Sunset,
  Wrench,
  Layers,
  Mic2,
  Radio,
  CalendarDays,
  Smile,
} from "lucide-react";
import type { ComponentType } from "react";

import type { AccountType, Priority, Tier, TimeSlot } from "./types";

type IconCmp = ComponentType<{ className?: string; strokeWidth?: number }>;

/**
 * ML cluster meta (consistent with the ML Predictions page). Each cluster id
 * maps to a label, short code, solid + tint colors, and a representative icon.
 */
export const CLUSTER_META: Record<
  number,
  { label: string; short: string; solid: string; tint: string; Ico: IconCmp }
> = {
  0: { label: "Educational", short: "EDU", solid: "#0369a1", tint: "rgba(3,105,161,0.08)", Ico: BookOpen },
  1: { label: "Viral Tips", short: "VIRAL", solid: "#b91c1c", tint: "rgba(185,28,28,0.08)", Ico: Flame },
  2: { label: "Showcase", short: "SHOW", solid: "#047857", tint: "rgba(4,120,87,0.08)", Ico: Compass },
  3: { label: "Reviews", short: "REV", solid: "#b45309", tint: "rgba(180,83,9,0.08)", Ico: Star },
  4: { label: "DIY & ASMR", short: "DIY", solid: "#5b21b6", tint: "rgba(91,33,182,0.08)", Ico: Wrench },
};

/** Engagement tier meta — solid color, tint, and a "dots" count for the chip. */
export const TIER_META: Record<Tier, { solid: string; tint: string; dots: number }> = {
  Low: { solid: "#737373", tint: "rgba(115,115,115,0.08)", dots: 1 },
  Mid: { solid: "#0369a1", tint: "rgba(3,105,161,0.08)", dots: 2 },
  High: { solid: "#047857", tint: "rgba(4,120,87,0.08)", dots: 3 },
  Top: { solid: "#b45309", tint: "rgba(180,83,9,0.08)", dots: 4 },
};

export const PRIORITY_META: Record<
  Priority,
  { label: string; solid: string; tint: string; border: string }
> = {
  high: { label: "High", solid: "#b91c1c", tint: "rgba(185,28,28,0.08)", border: "rgba(185,28,28,0.2)" },
  medium: { label: "Medium", solid: "#b45309", tint: "rgba(180,83,9,0.08)", border: "rgba(180,83,9,0.2)" },
  low: { label: "Low", solid: "#737373", tint: "rgba(115,115,115,0.08)", border: "rgba(115,115,115,0.2)" },
};

/** Content-type label to icon lookup used in recommendation cards. */
export const CONTENT_TYPE_META: Record<string, IconCmp> = {
  "Tutorial Series": Wrench,
  "Video Series": Layers,
  "ASMR/Lifestyle": Mic2,
  "Live/Engagement": Radio,
  "Update/Reguler": CalendarDays,
  "Vlog/BTS": Smile,
};

export const ACCOUNT_TINTS: Record<AccountType, string> = {
  own: "#111111",
  competitor: "#b91c1c",
  inspiration: "#1e40af",
};

export const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"] as const;

export const TIME_SLOTS: readonly TimeSlot[] = [
  { range: "06-09", label: "06:00-09:00", Ico: Sunrise },
  { range: "09-12", label: "09:00-12:00", Ico: Coffee },
  { range: "12-15", label: "12:00-15:00", Ico: Sun },
  { range: "15-18", label: "15:00-18:00", Ico: Sun },
  { range: "18-21", label: "18:00-21:00", Ico: Sunset },
  { range: "21-24", label: "21:00-24:00", Ico: Moon },
] as const;

export const PERIOD_LABELS: Record<string, string> = {
  daily: "Harian",
  weekly: "Mingguan",
  monthly: "Bulanan",
  last_30_days: "Last 30 Days",
  all: "Semua Waktu",
};
