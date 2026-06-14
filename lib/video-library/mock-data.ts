import {
  Crown, Target, Sparkles, Flame, BookOpen, Compass, Star, Package, Scale, Lightbulb, Wrench, Smile, Music,
} from 'lucide-react';

export interface VideoType {
  id: number;
  title: string;
  account: string;
  accountDisplayName: string;
  accountType: 'own' | 'competitor' | 'inspiration';
  category: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  duration: string;
  hashtags: string[];
  publishedAt: string;
  publishedDate: string;
  status: 'trending' | 'top' | 'normal';
  history: Array<{ day: string; views: number; engagement: number }>;
  coverUrl?: string;
  videoUrl?: string;
}

export const TYPE_META = {
  own:         { label: 'Akun Saya',  short: 'Own',  solid: '#111111', tint: 'rgba(17,17,17,0.06)',  border: 'rgba(17,17,17,0.18)',  icon: Crown },
  competitor:  { label: 'Kompetitor', short: 'Comp', solid: '#b91c1c', tint: 'rgba(185,28,28,0.07)', border: 'rgba(185,28,28,0.2)',  icon: Target },
  inspiration: { label: 'Inspirasi',  short: 'Insp', solid: '#1e40af', tint: 'rgba(30,64,175,0.07)', border: 'rgba(30,64,175,0.2)',  icon: Sparkles },
};

export const STATUS_META = {
  trending: { label: 'Trending', solid: '#e11d48', icon: Flame, tint: 'rgba(225,29,72,0.08)' },
  top:      { label: 'Top',      solid: '#111111', icon: Crown, tint: 'rgba(17,17,17,0.06)'  },
  normal:   null,
};

export const CATEGORY_META = {
  tutorial: { label: 'Tutorial',  icon: BookOpen,  grad: ['#0ea5e9', '#0369a1'] },
  tour:     { label: 'Tour',      icon: Compass,   grad: ['#10b981', '#047857'] },
  review:   { label: 'Review',    icon: Star,      grad: ['#f59e0b', '#b45309'] },
  unboxing: { label: 'Unboxing',  icon: Package,   grad: ['#8b5cf6', '#5b21b6'] },
  compare:  { label: 'Compare',   icon: Scale,     grad: ['#0891b2', '#155e75'] },
  tips:     { label: 'Tips',      icon: Lightbulb, grad: ['#d97706', '#92400e'] },
  diy:      { label: 'DIY',       icon: Wrench,    grad: ['#475569', '#1e293b'] },
  vlog:     { label: 'Vlog',      icon: Smile,     grad: ['#ec4899', '#9d174d'] },
  music:    { label: 'Music',     icon: Music,     grad: ['#7c3aed', '#4c1d95'] },
};

export const formatNum = (n: number): string => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(n >= 10_000 ? 1 : 2).replace(/\.0+$/, '') + 'K';
  return n.toLocaleString('id-ID');
};

export const initialsFrom = (s: string): string =>
  s.replace(/[._-]/g, ' ').split(' ').filter(Boolean).slice(0, 2).map((w: string) => w[0].toUpperCase()).join('');

const synth = (peak: number, shape: 'rising' | 'spiked' | 'flat'): Array<{ day: string; views: number; engagement: number }> => {
  const out: Array<{ day: string; views: number; engagement: number }> = [];
  for (let d = 0; d <= 14; d++) {
    let v;
    if (shape === 'rising') {
      v = peak * (0.05 + (d / 14) ** 1.3 * 0.95);
    } else if (shape === 'spiked') {
      v = peak * (d < 3 ? 0.05 + d * 0.32 : 1 - (d - 3) * 0.04);
    } else {
      v = peak * (0.1 + Math.min(d / 6, 1) * 0.85);
    }
    const noise = peak * (Math.random() * 0.05 - 0.025);
    out.push({
      day: `D${d}`,
      views: Math.max(0, Math.round(v + noise)),
      engagement: +(2 + (d < 5 ? 8 - d * 1.2 : 2 + Math.random() * 1.5)).toFixed(1),
    });
  }
  return out;
};

export const videos: VideoType[] = [
  {
    id: 1,
    title: 'Rumput Jepang vs Rumput Gajah Mini — Mana Lebih Tahan Panas?',
    account: 'podomorogarden',
    accountDisplayName: 'Podo Moro Asem Garden',
    accountType: 'own',
    category: 'compare',
    views: 84200, likes: 8420, comments: 642, shares: 1240,
    engagement: 12.3, duration: '2:47',
    hashtags: ['#rumputjepang', '#tanamanhias', '#bali', '#fyp', '#plantsoftiktok'],
    publishedAt: '3 hari lalu', publishedDate: '2026-05-18',
    status: 'trending',
    history: synth(84200, 'rising'),
  },
  {
    id: 2,
    title: 'Cara Stek Bunga Bougenville Biar Cepat Tumbuh dalam 2 Minggu',
    account: 'podomorogarden',
    accountDisplayName: 'Podo Moro Asem Garden',
    accountType: 'own',
    category: 'tutorial',
    views: 42600, likes: 3920, comments: 380, shares: 612,
    engagement: 11.5, duration: '4:12',
    hashtags: ['#stek', '#bougenville', '#tutorialberkebun', '#tanamanhias'],
    publishedAt: '5 hari lalu', publishedDate: '2026-05-16',
    status: 'top',
    history: synth(42600, 'spiked'),
  },
  {
    id: 3,
    title: 'Tour Kebun Podo Moro — Koleksi Tanaman Hias Lengkap di Gianyar',
    account: 'podomorogarden',
    accountDisplayName: 'Podo Moro Asem Garden',
    accountType: 'own',
    category: 'tour',
    views: 28400, likes: 2180, comments: 294, shares: 340,
    engagement: 9.9, duration: '6:38',
    hashtags: ['#kebunbali', '#tour', '#podomorogarden', '#gianyar'],
    publishedAt: '8 hari lalu', publishedDate: '2026-05-13',
    status: 'normal',
    history: synth(28400, 'flat'),
  },
  {
    id: 4,
    title: 'Tips Perawatan Rumput Mutiara Tetap Hijau di Musim Kemarau',
    account: 'podomorogarden',
    accountDisplayName: 'Podo Moro Asem Garden',
    accountType: 'own',
    category: 'tips',
    views: 18200, likes: 1640, comments: 142, shares: 218,
    engagement: 11.0, duration: '3:24',
    hashtags: ['#rumputmutiara', '#tips', '#perawatan', '#musimkemarau'],
    publishedAt: '12 hari lalu', publishedDate: '2026-05-09',
    status: 'normal',
    history: synth(18200, 'flat'),
  },
  {
    id: 5,
    title: 'Unboxing 50 Pot Tanaman Hias Kiriman dari Bandung 📦',
    account: 'podomorogarden',
    accountDisplayName: 'Podo Moro Asem Garden',
    accountType: 'own',
    category: 'unboxing',
    views: 36800, likes: 2890, comments: 412, shares: 480,
    engagement: 10.3, duration: '8:14',
    hashtags: ['#unboxing', '#tanamanhias', '#paketmurah', '#asmr'],
    publishedAt: '15 hari lalu', publishedDate: '2026-05-06',
    status: 'normal',
    history: synth(36800, 'spiked'),
  },
  {
    id: 6,
    title: '5 Tanaman Hias 2025 yang Bakal Booming — Wajib Punya!',
    account: 'tanamanhias.id',
    accountDisplayName: 'Tanaman Hias Indonesia',
    accountType: 'competitor',
    category: 'tips',
    views: 412000, likes: 38200, comments: 4120, shares: 6840,
    engagement: 11.9, duration: '5:33',
    hashtags: ['#tanamanhias2025', '#trending', '#viral', '#tanaman', '#fyp'],
    publishedAt: '2 hari lalu', publishedDate: '2026-05-19',
    status: 'trending',
    history: synth(412000, 'rising'),
  },
  {
    id: 7,
    title: 'Review Monstera Albo Variegata Termahal di Indonesia — Worth It?',
    account: 'tanamanhias.id',
    accountDisplayName: 'Tanaman Hias Indonesia',
    accountType: 'competitor',
    category: 'review',
    views: 268000, likes: 21400, comments: 2840, shares: 3120,
    engagement: 10.2, duration: '7:18',
    hashtags: ['#monstera', '#variegata', '#review', '#tanamanmahal'],
    publishedAt: '6 hari lalu', publishedDate: '2026-05-15',
    status: 'top',
    history: synth(268000, 'spiked'),
  },
  {
    id: 8,
    title: 'Workshop Vertical Garden di Rumah — Hemat Lahan Sempit',
    account: 'kebun.bali',
    accountDisplayName: 'Kebun Bali Asri',
    accountType: 'competitor',
    category: 'tutorial',
    views: 158000, likes: 14600, comments: 1820, shares: 2240,
    engagement: 11.8, duration: '9:42',
    hashtags: ['#verticalgarden', '#workshop', '#bali', '#rumahmungil'],
    publishedAt: '4 hari lalu', publishedDate: '2026-05-17',
    status: 'top',
    history: synth(158000, 'rising'),
  },
  {
    id: 9,
    title: 'Membuat Taman Tropis Ala Bali di Halaman Belakang',
    account: 'kebun.bali',
    accountDisplayName: 'Kebun Bali Asri',
    accountType: 'competitor',
    category: 'diy',
    views: 94800, likes: 7920, comments: 1140, shares: 1320,
    engagement: 11.0, duration: '11:24',
    hashtags: ['#tamantropis', '#bali', '#landscaping', '#diy'],
    publishedAt: '10 hari lalu', publishedDate: '2026-05-11',
    status: 'normal',
    history: synth(94800, 'flat'),
  },
  {
    id: 10,
    title: '5 Plants That Absolutely Thrive in Tropical Climate',
    account: 'gardenup.official',
    accountDisplayName: 'Garden Up',
    accountType: 'inspiration',
    category: 'tips',
    views: 1840000, likes: 184000, comments: 12400, shares: 28400,
    engagement: 12.2, duration: '4:55',
    hashtags: ['#tropicalplants', '#gardening', '#plantcare', '#viral'],
    publishedAt: '1 hari lalu', publishedDate: '2026-05-20',
    status: 'trending',
    history: synth(1840000, 'rising'),
  },
  {
    id: 11,
    title: 'My Plant Care Routine — 200+ Plant Collection Tour',
    account: 'plantkween',
    accountDisplayName: 'The Plant Kween',
    accountType: 'inspiration',
    category: 'tour',
    views: 412000, likes: 48200, comments: 5840, shares: 6240,
    engagement: 14.6, duration: '12:08',
    hashtags: ['#plantcare', '#routine', '#plantcollection', '#tour'],
    publishedAt: '7 hari lalu', publishedDate: '2026-05-14',
    status: 'top',
    history: synth(412000, 'spiked'),
  },
  {
    id: 12,
    title: 'ASMR Repotting Calathea — Soothing Plant Therapy',
    account: 'plantkween',
    accountDisplayName: 'The Plant Kween',
    accountType: 'inspiration',
    category: 'vlog',
    views: 184000, likes: 24800, comments: 3120, shares: 2840,
    engagement: 16.8, duration: '8:32',
    hashtags: ['#asmr', '#repotting', '#calathea', '#relaxing'],
    publishedAt: '11 hari lalu', publishedDate: '2026-05-10',
    status: 'normal',
    history: synth(184000, 'flat'),
  },
];
