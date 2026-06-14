import type { ElementType } from "react";

export type CategoryId =
  | "edukasi"
  | "komedi"
  | "kuliner"
  | "lifestyle"
  | "teknologi";

export interface Category {
  id: CategoryId;
  label: string;
  Ico: ElementType;
  color: string;
  tint: string;
  videos: number;
  views: number;
  likes: number;
  comments: number;
  engagement: number;
  viralProb: number;
  revenue: number;
  topHashtags: string[];
  topKeywords: string[];
  bestTime: string;
  insight: string;
}

export interface CombinationInsight {
  engagementRange: string;
  viralPotential: string;
  revenuePotential: string;
  timeOverlap: string;
  hashtags: string[];
  keywords: string[];
  contentDirection: string;
  insight: string;
}

export interface TopVideo {
  id: number;
  title: string;
  views: number;
  engagement: number;
  viralProb: number;
  tier: VideoTier;
  cluster: string;
  published: string;
}

export type VideoTier = "Top" | "High" | "Mid" | "Low";

export interface TierMeta {
  solid: string;
  tint: string;
  dots: number;
}

export interface TrendPoint {
  date: string;
  views: number;
  engagement: number;
  viralProb: number;
}

export type PeriodKey = "7" | "30";
