import { TrendingUp, Users, Cpu, Calendar, Zap, BarChart3 } from 'lucide-react';

export interface ExportType {
  id: string;
  label: string;
  description: string;
  icon: any;
  rows: number;
  size: string;
  sheets: string[];
  lastGenerated: string | null;
  status: 'ready' | 'stale' | 'not_generated' | 'generating';
  color: string;
  tint: string;
}

export interface ExportHistoryItem {
  id: string;
  name: string;
  type: 'Excel' | 'CSV';
  exportType: string;
  size: string;
  ts: string;
  user: string;
  status: 'done' | 'failed';
}

export const EXPORT_TYPES: ExportType[] = [
  {
    id: 'performance',
    label: 'Content Performance',
    description: 'Semua data performa video — views, likes, comments, shares, engagement rate, viral probability, tier, dan cluster ML.',
    icon: TrendingUp,
    rows: 248,
    size: '1.2 MB',
    sheets: ['Overview', 'Per Video', 'Cluster Analysis'],
    lastGenerated: '2026-05-21T08:14:00Z',
    status: 'ready',
    color: '#047857',
    tint: 'rgba(4,120,87,0.07)',
  },
  {
    id: 'accounts',
    label: 'Account Analytics',
    description: 'Ringkasan metrik per akun — own, competitor, dan inspiration. Termasuk follower growth, reach, dan benchmark.',
    icon: Users,
    rows: 42,
    size: '384 KB',
    sheets: ['Accounts', 'Benchmark', 'Growth'],
    lastGenerated: '2026-05-20T22:05:00Z',
    status: 'ready',
    color: '#0369a1',
    tint: 'rgba(3,105,161,0.07)',
  },
  {
    id: 'ml_predictions',
    label: 'ML Predictions',
    description: 'Output model ML — viral probability score, engagement tier, cluster assignment, dan feature importance per video.',
    icon: Cpu,
    rows: 248,
    size: '956 KB',
    sheets: ['Predictions', 'Feature Importance', 'Cluster Centers'],
    lastGenerated: '2026-05-21T07:48:00Z',
    status: 'ready',
    color: '#7c3aed',
    tint: 'rgba(124,58,237,0.07)',
  },
  {
    id: 'schedule',
    label: 'Optimal Schedule',
    description: 'Rekomendasi jadwal posting — engagement heatmap per slot waktu (7 hari × 6 segmen) dan top 5 slot terbaik.',
    icon: Calendar,
    rows: 42,
    size: '128 KB',
    sheets: ['Heatmap', 'Top Slots'],
    lastGenerated: null,
    status: 'not_generated',
    color: '#b45309',
    tint: 'rgba(180,83,9,0.07)',
  },
  {
    id: 'recommendations',
    label: 'Content Recommendations',
    description: 'Semua rekomendasi konten — judul, tipe, priority, rationale, hashtag, keyword, dan estimasi reach.',
    icon: Zap,
    rows: 6,
    size: '64 KB',
    sheets: ['Recommendations', 'Keywords', 'Hashtags'],
    lastGenerated: '2026-05-19T14:33:00Z',
    status: 'stale',
    color: '#b91c1c',
    tint: 'rgba(185,28,28,0.07)',
  },
  {
    id: 'historical',
    label: 'Historical Trends',
    description: 'Tren harian 14 hari — views, likes, comments, shares, engagement, dan viral probability agregat harian.',
    icon: BarChart3,
    rows: 14,
    size: '48 KB',
    sheets: ['Daily Trends'],
    lastGenerated: '2026-05-21T08:14:00Z',
    status: 'ready',
    color: '#111111',
    tint: 'rgba(17,17,17,0.06)',
  },
];

export const EXPORT_HISTORY: ExportHistoryItem[] = [
  { id: 'exp-001', name: 'performance_export_2026-05-21.xlsx', type: 'Excel', exportType: 'Content Performance', size: '1.2 MB', ts: '2026-05-21T08:14:22Z', user: 'Podo Moro', status: 'done' },
  { id: 'exp-002', name: 'ml_predictions_2026-05-21.csv',     type: 'CSV',   exportType: 'ML Predictions',      size: '956 KB', ts: '2026-05-21T07:48:05Z', user: 'Podo Moro', status: 'done' },
  { id: 'exp-003', name: 'accounts_2026-05-20.xlsx',          type: 'Excel', exportType: 'Account Analytics',   size: '384 KB', ts: '2026-05-20T22:05:11Z', user: 'Podo Moro', status: 'done' },
  { id: 'exp-004', name: 'historical_2026-05-20.csv',         type: 'CSV',   exportType: 'Historical Trends',   size: '48 KB',  ts: '2026-05-20T18:31:44Z', user: 'Podo Moro', status: 'done' },
  { id: 'exp-005', name: 'recommendations_2026-05-19.xlsx',   type: 'Excel', exportType: 'Recommendations',     size: '64 KB',  ts: '2026-05-19T14:33:01Z', user: 'Podo Moro', status: 'done' },
  { id: 'exp-006', name: 'performance_export_2026-05-18.xlsx',type: 'Excel', exportType: 'Content Performance', size: '1.1 MB', ts: '2026-05-18T09:02:17Z', user: 'Podo Moro', status: 'done' },
];

export const formatRelativeTime = (isoStr: string | null) => {
  if (!isoStr) return null;
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60)   return `${mins}m yang lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)    return `${hrs}j yang lalu`;
  const days = Math.floor(hrs / 24);
  return `${days}h yang lalu`;
};

export const formatDateTime = (isoStr: string) => {
  const d = new Date(isoStr);
  return d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};
