/**
 * Types shared across the ML Predictions module. Mirrors the shapes returned
 * by the Spring Boot ML API and the Airflow daily inference job so we can
 * swap mock fixtures for real responses later without touching components.
 */

export type AccountType = "own" | "competitor" | "inspiration";

export type Tier = "Low" | "Mid" | "High" | "Top";

export type ClusterId = 0 | 1 | 2 | 3 | 4;

export type SourceKey = "airflow_daily_inference" | "spring_boot_ml_api";

export type ModelStatus = "active" | "archived";

export type RegistryTab = "all" | ModelStatus;

export interface Prediction {
  id: string;
  videoId: number;
  title: string;
  account: string;
  accountType: AccountType;
  category: string;
  viral: boolean;
  viralProb: number;
  tier: Tier;
  tierConf: number;
  clusterId: ClusterId;
  source: SourceKey;
  predictedAt: string;
  predictedAgo: string;
  modelVersions: Record<string, string>;
}

export interface ModelEntry {
  name: string;
  version: string;
  algorithm: string;
  type: string;
  status: ModelStatus;
  trainedAt: string;
  metrics: Record<string, number>;
  trainingSize: number;
  framework: string;
}

export interface LastRun {
  source: SourceKey;
  triggeredBy: string;
  startedAt: string;
  duration: string;
  predictionCount: number;
  status: string;
}

export interface PredictionStats {
  total: number;
  viralCount: number;
  avgViralProb: number;
  avgConfidence: number;
  airflowCount: number;
  springCount: number;
}

export interface InferenceRunOptions {
  scope: string;
  source: string;
}
