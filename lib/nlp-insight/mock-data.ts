import {
  Activity, Clock, Hash, Target, Users, Video, BookOpen, Compass, Star, Package, Scale, Lightbulb, Wrench, Smile, ThumbsUp, Meh, ThumbsDown
} from 'lucide-react';

export interface NlpMetrics {
  videosAnalyzed: number;
  viewsAnalyzed: number;
  avgEngagement: number;
  sentimentPositive: number;
  sentimentNeutral: number;
  sentimentNegative: number;
}

export interface SummaryData {
  periodLabel: string;
  rangeLabel: string;
  generatedAt: string;
  model: string;
  confidence: number;
  metrics: NlpMetrics;
  body: string[];
  highlights: string[];
}

export interface InsightItem {
  id: number;
  category: 'engagement' | 'timing' | 'hashtag' | 'competitor' | 'audience' | 'format';
  priority: 'high' | 'medium' | 'low';
  title: string;
  body: string;
  metric: string;
  metricLabel: string;
}

export interface KeywordItem {
  word: string;
  freq: number;
}

export interface HashtagItem {
  tag: string;
  uses: number;
  change: number;
}

export interface VideoItem {
  rank: number;
  title: string;
  account: string;
  accountType: 'own' | 'competitor' | 'inspiration';
  category: 'tutorial' | 'tour' | 'review' | 'unboxing' | 'compare' | 'tips' | 'diy' | 'vlog';
  views: number;
  engagement: number;
  duration: string;
}

export interface AccountOption {
  username: string;
  displayName: string;
  type: 'own' | 'competitor' | 'inspiration';
}

export const SENTIMENT_META = {
  positive: { label: 'Positif',  solid: '#047857', tint: 'rgba(4,120,87,0.08)',    border: 'rgba(4,120,87,0.2)',    Ico: ThumbsUp   },
  neutral:  { label: 'Netral',   solid: '#737373', tint: 'rgba(115,115,115,0.08)', border: 'rgba(115,115,115,0.2)', Ico: Meh        },
  negative: { label: 'Negatif',  solid: '#b91c1c', tint: 'rgba(185,28,28,0.08)',   border: 'rgba(185,28,28,0.2)',   Ico: ThumbsDown },
} as const;

export const INSIGHT_META = {
  engagement: { Ico: Activity,  solid: '#047857' },
  timing:     { Ico: Clock,     solid: '#0369a1' },
  hashtag:    { Ico: Hash,      solid: '#b45309' },
  competitor: { Ico: Target,    solid: '#b91c1c' },
  audience:   { Ico: Users,     solid: '#5b21b6' },
  format:     { Ico: Video,     solid: '#0c4a6e' },
} as const;

export const CAT_META = {
  tutorial: { Ico: BookOpen,  grad: ['#0ea5e9', '#0369a1'] },
  tour:     { Ico: Compass,   grad: ['#10b981', '#047857'] },
  review:   { Ico: Star,      grad: ['#f59e0b', '#b45309'] },
  unboxing: { Ico: Package,   grad: ['#8b5cf6', '#5b21b6'] },
  compare:  { Ico: Scale,     grad: ['#0891b2', '#155e75'] },
  tips:     { Ico: Lightbulb, grad: ['#d97706', '#92400e'] },
  diy:      { Ico: Wrench,    grad: ['#475569', '#1e293b'] },
  vlog:     { Ico: Smile,     grad: ['#ec4899', '#9d174d'] },
} as const;

export const ACCOUNT_TINTS = {
  own:         '#111111',
  competitor:  '#b91c1c',
  inspiration: '#1e40af',
} as const;

export const summaryData = {
  weekly: {
    periodLabel: '15 – 21 Mei 2026',
    rangeLabel: 'Minggu ke-20',
    generatedAt: '21 Mei 2026, 06:00 WITA',
    model: 'NLP-summarizer-v1.3.0',
    confidence: 0.91,
    metrics: {
      videosAnalyzed: 124,
      viewsAnalyzed: 8420000,
      avgEngagement: 11.2,
      sentimentPositive: 0.78,
      sentimentNeutral:  0.17,
      sentimentNegative: 0.05,
    },
    body: [
      'Selama periode 15–21 Mei 2026, sistem menganalisis 124 video dari 9 akun TikTok di niche tanaman hias Indonesia, dengan total 8.4 juta views dan engagement rata-rata 11.2%. Konten edukasi dan tutorial perawatan mendominasi performa minggu ini.',
      'Tren paling menonjol adalah meningkatnya minat audiens terhadap vertical garden dan tanaman hias indoor, terlihat dari pertumbuhan 89% penggunaan hashtag #verticalgarden dan #tanamanhias2025 secara week-over-week. Video format perbandingan (comparison) juga menunjukkan performa luar biasa — 3.1x lebih tinggi dibanding video tour pada akun yang sama.',
      'Kompetitor terdekat @kebun.bali menunjukkan momentum positif dengan growth follower 15.7% dan engagement konsisten di atas 11%. Sementara akun @podomorogarden tumbuh stabil 12.3% dengan kekuatan utama pada konten comparison ("Rumput Jepang vs Rumput Gajah Mini") yang viral dengan 84K views — pencapaian tertinggi dalam 3 bulan terakhir.',
      'Sentimen audiens secara keseluruhan sangat positif (78%), dengan komentar dominan menanyakan tips perawatan, ketersediaan stok, dan permintaan tutorial lanjutan. Rekomendasi utama: tingkatkan frekuensi konten tutorial pendek (2–4 menit) di slot 19:00–21:00 WITA dan eksplorasi format comparison serta vertical garden untuk minggu depan.',
    ],
    highlights: [
      'Konten tutorial drive 2.4x engagement lebih tinggi',
      'Hashtag #verticalgarden naik 89% week-over-week',
      'Video viral #1: "Rumput Jepang vs Gajah Mini" (84K views)',
    ],
  },
};

export const insights: InsightItem[] = [
  {
    id: 1, category: 'engagement', priority: 'high',
    title: 'Konten Tutorial Drive 2.4x Engagement',
    body: 'Video tutorial perawatan menunjukkan engagement rate rata-rata 11.5%, dibanding 4.8% untuk format lain. Audiens menginginkan panduan praktis yang langsung bisa diterapkan.',
    metric: '+2.4x',
    metricLabel: 'vs format lain',
  },
  {
    id: 2, category: 'timing', priority: 'high',
    title: 'Slot 19–21 WITA Optimal',
    body: 'Posting di rentang 19:00–21:00 WITA menghasilkan 38% lebih banyak views dalam 24 jam pertama. Audiens niche tanaman aktif di jam santai malam.',
    metric: '+38%',
    metricLabel: 'views 24 jam',
  },
  {
    id: 3, category: 'hashtag', priority: 'medium',
    title: '#verticalgarden Naik 89%',
    body: 'Penggunaan hashtag #verticalgarden meningkat drastis. Adopsi awal dapat memberi keunggulan algoritmik sebelum tren mencapai puncak.',
    metric: '+89%',
    metricLabel: 'week-over-week',
  },
  {
    id: 4, category: 'competitor', priority: 'medium',
    title: '@kebun.bali Gain Momentum',
    body: 'Kompetitor terdekat di Bali tumbuh 15.7% follower dengan strategi workshop & DIY. Pertimbangkan format serupa atau konten kolaboratif.',
    metric: '+15.7%',
    metricLabel: 'follower growth',
  },
  {
    id: 5, category: 'audience', priority: 'low',
    title: 'Audiens Aktif Bertanya',
    body: 'Komentar dominan adalah pertanyaan tentang perawatan dan ketersediaan stok. Pertimbangkan format Q&A atau video stock update mingguan.',
    metric: '64%',
    metricLabel: 'komentar pertanyaan',
  },
  {
    id: 6, category: 'format', priority: 'high',
    title: 'Format Comparison Menang',
    body: 'Video perbandingan ("X vs Y") menghasilkan engagement 3.1x lebih tinggi dibanding video tour. Buat seri comparison tematik mingguan.',
    metric: '3.1x',
    metricLabel: 'vs tour',
  },
];

export const topKeywords: KeywordItem[] = [
  { word: 'tanaman hias',       freq: 87 }, { word: 'rumput jepang',    freq: 54 },
  { word: 'tutorial perawatan', freq: 48 }, { word: 'vertical garden',  freq: 42 },
  { word: 'bali',               freq: 38 }, { word: 'tropical',         freq: 34 },
  { word: 'stek',               freq: 29 }, { word: 'monstera',         freq: 28 },
  { word: 'tanaman indoor',     freq: 26 }, { word: 'bougenville',      freq: 23 },
  { word: 'ASMR repotting',     freq: 21 }, { word: 'garden tour',      freq: 19 },
  { word: 'plant care',         freq: 18 }, { word: 'tanaman 2025',     freq: 17 },
  { word: 'DIY garden',         freq: 15 }, { word: 'workshop',         freq: 14 },
  { word: 'tropis',             freq: 13 }, { word: 'unboxing',         freq: 12 },
  { word: 'review jujur',       freq: 11 }, { word: 'tips singkat',     freq: 10 },
  { word: 'tahan panas',        freq:  9 }, { word: 'kebun rumah',      freq:  8 },
];

export const topHashtags: HashtagItem[] = [
  { tag: '#fyp',                uses: 892, change: 12 },
  { tag: '#tanamanhias',        uses: 412, change: 18 },
  { tag: '#plantsoftiktok',     uses: 287, change:  5 },
  { tag: '#verticalgarden',     uses: 198, change: 89 },
  { tag: '#tanamanhias2025',    uses: 176, change: 67 },
  { tag: '#bali',               uses: 158, change:  9 },
  { tag: '#tutorialberkebun',   uses: 134, change: 22 },
  { tag: '#stek',               uses:  98, change: -3 },
  { tag: '#monstera',           uses:  87, change: 14 },
  { tag: '#asmr',               uses:  76, change: 41 },
  { tag: '#plantcare',          uses:  68, change:  7 },
  { tag: '#rumputjepang',       uses:  54, change: 28 },
];

export const topVideos: VideoItem[] = [
  { rank: 1, title: '5 Plants That Absolutely Thrive in Tropical Climate', account: 'gardenup.official', accountType: 'inspiration', category: 'tips',     views: 1840000, engagement: 12.2, duration: '4:55' },
  { rank: 2, title: '5 Tanaman Hias 2025 yang Bakal Booming — Wajib Punya!', account: 'tanamanhias.id',  accountType: 'competitor',  category: 'tips',     views:  412000, engagement: 11.9, duration: '5:33' },
  { rank: 3, title: 'My Plant Care Routine — 200+ Plant Collection Tour',  account: 'plantkween',       accountType: 'inspiration', category: 'tour',     views:  412000, engagement: 14.6, duration: '12:08' },
  { rank: 4, title: 'Review Monstera Albo Variegata Termahal di Indonesia',account: 'tanamanhias.id',   accountType: 'competitor',  category: 'review',   views:  268000, engagement: 10.2, duration: '7:18' },
  { rank: 5, title: 'ASMR Repotting Calathea — Soothing Plant Therapy',    account: 'plantkween',       accountType: 'inspiration', category: 'vlog',     views:  184000, engagement: 16.8, duration: '8:32' },
  { rank: 6, title: 'Workshop Vertical Garden di Rumah — Hemat Lahan',     account: 'kebun.bali',       accountType: 'competitor',  category: 'tutorial', views:  158000, engagement: 11.8, duration: '9:42' },
  { rank: 7, title: 'Rumput Jepang vs Rumput Gajah Mini — Mana Lebih Tahan?',account:'podomorogarden',  accountType: 'own',         category: 'compare',  views:   84200, engagement: 12.3, duration: '2:47' },
];

export const accountOptions: AccountOption[] = [
  { username: 'podomorogarden',    displayName: 'Podo Moro Asem Garden',     type: 'own' },
  { username: 'tanamanhias.id',    displayName: 'Tanaman Hias Indonesia',    type: 'competitor' },
  { username: 'kebun.bali',        displayName: 'Kebun Bali Asri',           type: 'competitor' },
  { username: 'tropicalplants_id', displayName: 'Tropical Plants ID',        type: 'competitor' },
  { username: 'gardenup.official', displayName: 'Garden Up',                 type: 'inspiration' },
  { username: 'plantkween',        displayName: 'The Plant Kween',           type: 'inspiration' },
];
