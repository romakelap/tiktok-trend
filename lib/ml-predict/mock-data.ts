import { MODEL_VERSIONS } from "./meta";
import type { LastRun, ModelEntry, Prediction } from "./types";

/**
 * 12 mock prediction records joined with ML output (viral, tier, cluster).
 * Sourced from the same fixture used across the dashboard, analytics, and
 * video library pages so the numbers stay consistent.
 */
export const PREDICTIONS: Prediction[] = [
  {
    id: "pred_a1b2c3d4", videoId: 1,
    title: "Rumput Jepang vs Rumput Gajah Mini — Mana Lebih Tahan Panas?",
    account: "podomorogarden", accountType: "own", category: "compare",
    viral: true,  viralProb: 0.87, tier: "High", tierConf: 0.92,
    clusterId: 4, source: "airflow_daily_inference",
    predictedAt: "2026-05-21T07:32:14Z", predictedAgo: "2 jam lalu",
    modelVersions: { ...MODEL_VERSIONS },
  },
  {
    id: "pred_b2c3d4e5", videoId: 2,
    title: "Cara Stek Bunga Bougenville Biar Cepat Tumbuh dalam 2 Minggu",
    account: "podomorogarden", accountType: "own", category: "tutorial",
    viral: true,  viralProb: 0.74, tier: "High", tierConf: 0.88,
    clusterId: 0, source: "airflow_daily_inference",
    predictedAt: "2026-05-21T07:32:18Z", predictedAgo: "2 jam lalu",
    modelVersions: { ...MODEL_VERSIONS },
  },
  {
    id: "pred_c3d4e5f6", videoId: 3,
    title: "Tour Kebun Podo Moro — Koleksi Tanaman Hias Lengkap di Gianyar",
    account: "podomorogarden", accountType: "own", category: "tour",
    viral: false, viralProb: 0.31, tier: "Mid",  tierConf: 0.79,
    clusterId: 2, source: "airflow_daily_inference",
    predictedAt: "2026-05-21T07:32:22Z", predictedAgo: "2 jam lalu",
    modelVersions: { ...MODEL_VERSIONS },
  },
  {
    id: "pred_d4e5f6g7", videoId: 4,
    title: "Tips Perawatan Rumput Mutiara Tetap Hijau di Musim Kemarau",
    account: "podomorogarden", accountType: "own", category: "tips",
    viral: false, viralProb: 0.42, tier: "Mid",  tierConf: 0.81,
    clusterId: 0, source: "spring_boot_ml_api",
    predictedAt: "2026-05-21T09:14:08Z", predictedAgo: "23 menit lalu",
    modelVersions: { ...MODEL_VERSIONS },
  },
  {
    id: "pred_e5f6g7h8", videoId: 5,
    title: "Unboxing 50 Pot Tanaman Hias Kiriman dari Bandung",
    account: "podomorogarden", accountType: "own", category: "unboxing",
    viral: false, viralProb: 0.58, tier: "High", tierConf: 0.71,
    clusterId: 3, source: "airflow_daily_inference",
    predictedAt: "2026-05-21T07:32:30Z", predictedAgo: "2 jam lalu",
    modelVersions: { ...MODEL_VERSIONS },
  },
  {
    id: "pred_f6g7h8i9", videoId: 6,
    title: "5 Tanaman Hias 2025 yang Bakal Booming — Wajib Punya!",
    account: "tanamanhias.id", accountType: "competitor", category: "tips",
    viral: true,  viralProb: 0.94, tier: "Top",  tierConf: 0.96,
    clusterId: 1, source: "airflow_daily_inference",
    predictedAt: "2026-05-21T07:32:34Z", predictedAgo: "2 jam lalu",
    modelVersions: { ...MODEL_VERSIONS },
  },
  {
    id: "pred_g7h8i9j0", videoId: 7,
    title: "Review Monstera Albo Variegata Termahal di Indonesia — Worth It?",
    account: "tanamanhias.id", accountType: "competitor", category: "review",
    viral: true,  viralProb: 0.81, tier: "High", tierConf: 0.89,
    clusterId: 3, source: "airflow_daily_inference",
    predictedAt: "2026-05-21T07:32:38Z", predictedAgo: "2 jam lalu",
    modelVersions: { ...MODEL_VERSIONS },
  },
  {
    id: "pred_h8i9j0k1", videoId: 8,
    title: "Workshop Vertical Garden di Rumah — Hemat Lahan Sempit",
    account: "kebun.bali", accountType: "competitor", category: "tutorial",
    viral: true,  viralProb: 0.78, tier: "High", tierConf: 0.85,
    clusterId: 0, source: "spring_boot_ml_api",
    predictedAt: "2026-05-21T09:14:22Z", predictedAgo: "23 menit lalu",
    modelVersions: { ...MODEL_VERSIONS },
  },
  {
    id: "pred_i9j0k1l2", videoId: 9,
    title: "Membuat Taman Tropis Ala Bali di Halaman Belakang",
    account: "kebun.bali", accountType: "competitor", category: "diy",
    viral: false, viralProb: 0.46, tier: "Mid",  tierConf: 0.77,
    clusterId: 4, source: "airflow_daily_inference",
    predictedAt: "2026-05-21T07:32:46Z", predictedAgo: "2 jam lalu",
    modelVersions: { ...MODEL_VERSIONS },
  },
  {
    id: "pred_j0k1l2m3", videoId: 10,
    title: "5 Plants That Absolutely Thrive in Tropical Climate",
    account: "gardenup.official", accountType: "inspiration", category: "tips",
    viral: true,  viralProb: 0.97, tier: "Top",  tierConf: 0.98,
    clusterId: 1, source: "airflow_daily_inference",
    predictedAt: "2026-05-21T07:32:50Z", predictedAgo: "2 jam lalu",
    modelVersions: { ...MODEL_VERSIONS },
  },
  {
    id: "pred_k1l2m3n4", videoId: 11,
    title: "My Plant Care Routine — 200+ Plant Collection Tour",
    account: "plantkween", accountType: "inspiration", category: "tour",
    viral: true,  viralProb: 0.83, tier: "Top",  tierConf: 0.90,
    clusterId: 2, source: "airflow_daily_inference",
    predictedAt: "2026-05-21T07:32:54Z", predictedAgo: "2 jam lalu",
    modelVersions: { ...MODEL_VERSIONS },
  },
  {
    id: "pred_l2m3n4o5", videoId: 12,
    title: "ASMR Repotting Calathea — Soothing Plant Therapy",
    account: "plantkween", accountType: "inspiration", category: "vlog",
    viral: false, viralProb: 0.62, tier: "High", tierConf: 0.74,
    clusterId: 4, source: "spring_boot_ml_api",
    predictedAt: "2026-05-21T09:14:36Z", predictedAgo: "23 menit lalu",
    modelVersions: { ...MODEL_VERSIONS },
  },
];

/**
 * Versioned model registry — currently active + archived versions of the
 * Viral / Engagement / Clustering models.
 */
export const MODELS: ModelEntry[] = [
  {
    name: "Viral Prediction Model",
    version: "v2.4.1",
    algorithm: "Random Forest",
    type: "Binary Classification",
    status: "active",
    trainedAt: "15 Mei 2026",
    metrics: { accuracy: 0.892, precision: 0.875, recall: 0.823, f1: 0.848 },
    trainingSize: 12_450,
    framework: "scikit-learn",
  },
  {
    name: "Engagement Tier Model",
    version: "v1.8.0",
    algorithm: "SVM (RBF Kernel)",
    type: "Multi-class Classification",
    status: "active",
    trainedAt: "12 Mei 2026",
    metrics: { accuracy: 0.847, precision: 0.831, recall: 0.819, f1: 0.825 },
    trainingSize: 12_450,
    framework: "scikit-learn",
  },
  {
    name: "Content Clustering Model",
    version: "v3.0.2",
    algorithm: "K-Means (K=5)",
    type: "Unsupervised Clustering",
    status: "active",
    trainedAt: "10 Mei 2026",
    metrics: { silhouette: 0.612, inertia: 14_820, davies_bouldin: 0.78 },
    trainingSize: 12_450,
    framework: "scikit-learn",
  },
  {
    name: "Viral Prediction Model",
    version: "v2.3.0",
    algorithm: "Random Forest",
    type: "Binary Classification",
    status: "archived",
    trainedAt: "28 Apr 2026",
    metrics: { accuracy: 0.871, precision: 0.852, recall: 0.798, f1: 0.824 },
    trainingSize: 11_200,
    framework: "scikit-learn",
  },
  {
    name: "Engagement Tier Model",
    version: "v1.7.5",
    algorithm: "SVM (Linear)",
    type: "Multi-class Classification",
    status: "archived",
    trainedAt: "20 Apr 2026",
    metrics: { accuracy: 0.812, precision: 0.798, recall: 0.781, f1: 0.789 },
    trainingSize: 10_800,
    framework: "scikit-learn",
  },
];

export const LAST_RUN: LastRun = {
  source: "spring_boot_ml_api",
  triggeredBy: "Manual",
  startedAt: "23 menit lalu",
  duration: "8.4 detik",
  predictionCount: 3,
  status: "success",
};
