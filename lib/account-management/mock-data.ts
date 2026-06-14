import { Crown, Target, Sparkles } from 'lucide-react';
import { Account } from './api';

export type { Account };


export const TYPE_META = {
  own: {
    label: 'Akun Saya',
    short: 'Own',
    solid: '#111111',
    tint:  'rgba(17,17,17,0.06)',
    border:'rgba(17,17,17,0.18)',
    icon:  Crown,
  },
  competitor: {
    label: 'Kompetitor',
    short: 'Comp',
    solid: '#059669',
    tint:  'rgba(5,150,105,0.08)',
    border:'rgba(5,150,105,0.22)',
    icon:  Target,
  },
  inspiration: {
    label: 'Inspirasi',
    short: 'Insp',
    solid: '#1e40af',
    tint:  'rgba(30,64,175,0.07)',
    border:'rgba(30,64,175,0.2)',
    icon:  Sparkles,
  },
};

export const accounts: Account[] = [
  {
    id: 1,
    username: 'podomorogarden',
    displayName: 'Podo Moro Asem Garden',
    type: 'own',
    location: 'Gianyar, Bali',
    bio: 'Tanaman hias · rumput jepang · rumput mutiara · Open sejak 2010',
    followers: 4280,
    videos: 47,
    avgEngagement: 6.8,
    avgViews: 18400,
    growthPct: 12.3,
    trend: [3600, 3680, 3720, 3795, 3810, 3870, 3940, 4010, 4080, 4150, 4210, 4280],
    addedAt: '12 Sep 2025',
  },
  {
    id: 2,
    username: 'tanamanhias.id',
    displayName: 'Tanaman Hias Indonesia',
    type: 'competitor',
    location: 'Jakarta Selatan',
    bio: 'Distributor tanaman hias terbesar di Jabodetabek · COD ready',
    followers: 12400,
    videos: 89,
    avgEngagement: 5.2,
    avgViews: 24800,
    growthPct: 8.4,
    trend: [10800, 10980, 11100, 11240, 11380, 11510, 11680, 11820, 11960, 12080, 12240, 12400],
    addedAt: '03 Okt 2025',
  },
  {
    id: 3,
    username: 'kebun.bali',
    displayName: 'Kebun Bali Asri',
    type: 'competitor',
    location: 'Denpasar, Bali',
    bio: 'Kebun tanaman hias tropis · Workshop & landscaping',
    followers: 8920,
    videos: 64,
    avgEngagement: 7.1,
    avgViews: 21200,
    growthPct: 15.7,
    trend: [6800, 6950, 7100, 7280, 7440, 7610, 7790, 8010, 8240, 8480, 8700, 8920],
    addedAt: '17 Okt 2025',
  },
  {
    id: 4,
    username: 'tropicalplants_id',
    displayName: 'Tropical Plants ID',
    type: 'competitor',
    location: 'Bandung',
    bio: 'Indoor & outdoor tropical plants · Shipping nasional',
    followers: 6740,
    videos: 52,
    avgEngagement: 4.8,
    avgViews: 14600,
    growthPct: -2.1,
    trend: [7100, 7080, 7050, 6990, 6920, 6880, 6840, 6810, 6790, 6770, 6755, 6740],
    addedAt: '24 Okt 2025',
  },
  {
    id: 5,
    username: 'rumput_hias',
    displayName: 'Rumput Hias Nusantara',
    type: 'competitor',
    location: 'Yogyakarta',
    bio: 'Spesialis rumput jepang, gajah mini, dan rumput peking',
    followers: 5180,
    videos: 38,
    avgEngagement: 5.9,
    avgViews: 12300,
    growthPct: 6.2,
    trend: [4640, 4710, 4780, 4830, 4880, 4920, 4970, 5020, 5070, 5110, 5150, 5180],
    addedAt: '08 Nov 2025',
  },
  {
    id: 6,
    username: 'gardenup.official',
    displayName: 'Garden Up',
    type: 'inspiration',
    location: 'Mumbai, India',
    bio: 'Helping you garden better · Tips, tutorials, products',
    followers: 2840000,
    videos: 412,
    avgEngagement: 8.9,
    avgViews: 1840000,
    growthPct: 22.4,
    trend: [2180000, 2240000, 2310000, 2390000, 2460000, 2530000, 2600000, 2680000, 2740000, 2790000, 2820000, 2840000],
    addedAt: '01 Sep 2025',
  },
  {
    id: 7,
    username: 'plantkween',
    displayName: 'The Plant Kween',
    type: 'inspiration',
    location: 'Brooklyn, USA',
    bio: 'Plant educator · 200+ plant collection · They/Them',
    followers: 681000,
    videos: 286,
    avgEngagement: 11.2,
    avgViews: 412000,
    growthPct: 9.6,
    trend: [598000, 612000, 624000, 634000, 645000, 654000, 662000, 668000, 672000, 676000, 679000, 681000],
    addedAt: '15 Sep 2025',
  },
  {
    id: 8,
    username: 'indoorplant.lover',
    displayName: 'Indoor Plant Lover',
    type: 'inspiration',
    location: 'Singapore',
    bio: 'Cozy indoor plant content · Apartment jungle vibes',
    followers: 184000,
    videos: 198,
    avgEngagement: 7.4,
    avgViews: 92000,
    growthPct: 14.8,
    trend: [142000, 148000, 154000, 159000, 163000, 167000, 171000, 175000, 178000, 181000, 183000, 184000],
    addedAt: '28 Sep 2025',
  },
  {
    id: 9,
    username: 'green.gianyar',
    displayName: 'Green Gianyar',
    type: 'competitor',
    location: 'Gianyar, Bali',
    bio: 'Toko bunga & tanaman hias di Gianyar · Open 8-17 WITA',
    followers: 3420,
    videos: 29,
    avgEngagement: 5.4,
    avgViews: 8900,
    growthPct: 4.1,
    trend: [3220, 3240, 3265, 3280, 3300, 3320, 3340, 3360, 3380, 3395, 3410, 3420],
    addedAt: '11 Nov 2025',
  },
];

export const FOLLOWER_HISTORY = (() => {
  const weeks = ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'];
  return weeks.map((w, i) => {
    const row: Record<string, string | number> = { week: w };
    accounts.forEach(a => { row[a.username] = a.trend[i]; });
    return row;
  });
})();

export const formatNum = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(n >= 10_000 ? 1 : 2).replace(/\.0+$/, '') + 'K';
  return n.toLocaleString('id-ID');
};

export const initialsFrom = (s: string) => s
  .replace(/[._-]/g, ' ')
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map(w => w[0].toUpperCase())
  .join('');
