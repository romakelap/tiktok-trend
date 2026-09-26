/**
 * Shared types for the Analytics module. These mirror the shapes consumed by
 * the analytics page components (HistoricalTrends, ContentPerformanceTable,
 * ScheduleHeatmap, RecommendationCard, etc.) so we can swap mock data for
 * real API responses later without touching the components.
 */

export type AccountType = "own" | "competitor" | "inspiration";

export type Tier = "Low" | "Mid" | "High" | "Top";

export type Priority = "high" | "medium" | "low";

export type SortKey =
  | "viralProb"
  | "engagement"
  | "views"
  | "likes"
  | "comments"
  | "shares";

export type PeriodKey =
  | "daily"
  | "weekly"
  | "monthly"
  | "last_30_days"
  | "all";

export interface HistoricalDay {
  date: string;
  videos: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  viralProb: number;
}

export interface ContentRow {
  id: number | string;
  title: string;
  account: string;
  accountType: AccountType;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  viralProb: number;
  tier: Tier;
  clusterId: number;
  coverUrl?: string;
  videoUrl?: string;
}

export interface TopSlot {
  day: string;
  time: string;
  dayLabel: string;
  timeLabel: string;
  expectedEng: number;
  expectedViews: number;
  confidence: number;
  reasoning: string;
}

export interface AccountOption {
  username: string;
  type: AccountType;
}

export interface Recommendation {
  id: number | string;
  priority: Priority;
  type: string;
  title: string;
  description: string;
  rationale: string;
  keywords?: string[];
  hashtags?: string[];
  duration: string;
  expectedReach: string;
  confidence: number;
}

export interface TimeSlot {
  range: string;
  label: string;
  Ico: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

/** 7 rows (days) × 6 columns (time-slots) of expected engagement %. */
export type ScheduleMatrix = number[][];
