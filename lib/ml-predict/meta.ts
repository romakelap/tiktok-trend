import {
  BookOpen,
  Compass,
  Flame,
  Server,
  Star,
  Workflow,
  Wrench,
} from "lucide-react";
import type { ComponentType, CSSProperties } from "react";

import type { AccountType, ClusterId, SourceKey, Tier } from "./types";

type IconCmp = ComponentType<{ className?: string; strokeWidth?: number; fill?: string; style?: CSSProperties }>;

/** Account type meta — same accent palette used across the app. */
export const TYPE_META: Record<
  AccountType,
  { label: string; short: string; solid: string; tint: string; border: string }
> = {
  own:         { label: "Akun Saya",  short: "Own",  solid: "#111111", tint: "rgba(17,17,17,0.06)",  border: "rgba(17,17,17,0.18)" },
  competitor:  { label: "Kompetitor", short: "Comp", solid: "#b91c1c", tint: "rgba(185,28,28,0.07)", border: "rgba(185,28,28,0.2)" },
  inspiration: { label: "Inspirasi",  short: "Insp", solid: "#1e40af", tint: "rgba(30,64,175,0.07)", border: "rgba(30,64,175,0.2)" },
};

/**
 * K-Means cluster meta — restrained palette with one accent per cluster.
 * Consistent with `lib/analytics/meta::CLUSTER_META` so chip colors line up
 * across the analytics and ML pages.
 */
export const CLUSTER_META: Record<
  ClusterId,
  { label: string; short: string; solid: string; tint: string; border: string; Ico: IconCmp }
> = {
  0: { label: "Educational Tutorials", short: "EDU",   solid: "#0369a1", tint: "rgba(3,105,161,0.07)", border: "rgba(3,105,161,0.2)", Ico: BookOpen },
  1: { label: "Viral Tips Content",    short: "VIRAL", solid: "#b91c1c", tint: "rgba(185,28,28,0.07)", border: "rgba(185,28,28,0.2)", Ico: Flame    },
  2: { label: "Showcase & Tour",       short: "SHOW",  solid: "#047857", tint: "rgba(4,120,87,0.07)",  border: "rgba(4,120,87,0.2)",  Ico: Compass  },
  3: { label: "Reviews & Unboxing",    short: "REV",   solid: "#b45309", tint: "rgba(180,83,9,0.07)",  border: "rgba(180,83,9,0.2)",  Ico: Star     },
  4: { label: "DIY & ASMR",            short: "DIY",   solid: "#5b21b6", tint: "rgba(91,33,182,0.07)", border: "rgba(91,33,182,0.2)", Ico: Wrench   },
};

/** Engagement tier meta — 4 tiers with corresponding "dots" count. */
export const TIER_META: Record<
  Tier,
  { label: Tier; solid: string; tint: string; border: string; dots: number }
> = {
  Low:  { label: "Low",  solid: "#737373", tint: "rgba(115,115,115,0.08)", border: "rgba(115,115,115,0.2)", dots: 1 },
  Mid:  { label: "Mid",  solid: "#0369a1", tint: "rgba(3,105,161,0.08)",   border: "rgba(3,105,161,0.2)",   dots: 2 },
  High: { label: "High", solid: "#047857", tint: "rgba(4,120,87,0.08)",    border: "rgba(4,120,87,0.2)",    dots: 3 },
  Top:  { label: "Top",  solid: "#b45309", tint: "rgba(180,83,9,0.08)",    border: "rgba(180,83,9,0.2)",    dots: 4 },
};

/** Inference source meta — Airflow (batch) vs Spring Boot API (on-demand). */
export const SOURCE_META: Record<
  SourceKey,
  { label: string; short: string; Ico: IconCmp; color: string }
> = {
  airflow_daily_inference: { label: "Airflow Daily",   short: "airflow", Ico: Workflow, color: "#0369a1" },
  spring_boot_ml_api:      { label: "Spring Boot API", short: "spring",  Ico: Server,   color: "#047857" },
};

export const MODEL_VERSIONS = {
  viral: "RF-viral-v2.4.1",
  engagement: "SVM-engage-v1.8.0",
  cluster: "KMeans-v3.0.2",
} as const;
