export type KeywordType = 'hook' | 'brand' | 'action' | 'emotion';
export type Trend = 'hot' | 'up' | 'stable' | 'down';

export interface KeywordItem {
  rank: number;
  keyword: string;
  type: KeywordType;
  frequency: number;
  avgViews: number;
  engagement: number;
  videoCount: number;
  trend: Trend;
}

export const formatNum = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + 'K';
  return String(n);
};

export const getTrendLabel = (trend: string) => {
  switch (trend) {
    case 'hot': return '🔥';
    case 'up':  return '↑';
    case 'stable': return '→';
    case 'down': return '↓';
    default: return '';
  }
};

export const getTypeLabel = (type: string) => {
  switch (type) {
    case 'hook': return 'H';
    case 'brand': return 'B';
    case 'action': return 'A';
    case 'emotion': return 'E';
    default: return type ? type[0].toUpperCase() : '';
  }
};

export const getTrendConfig = (trend: Trend) => {
  const configs = {
    hot:    { bg: 'rgba(18,18,18,0.07)',  text: '#111111', border: 'rgba(18,18,18,0.15)',  label: 'HOT' },
    up:     { bg: 'rgba(26,122,74,0.08)',   text: '#1A7A4A',  border: 'rgba(26,122,74,0.15)',   label: 'NAIK' },
    stable: { bg: 'rgba(0,0,0,0.05)',       text: 'rgba(0,0,0,0.42)', border: 'rgba(0,0,0,0.09)', label: 'STABIL' },
    down:   { bg: 'rgba(185,28,28,0.07)',  text: '#B91C1C',  border: 'rgba(185,28,28,0.15)',  label: 'TURUN' },
  };
  return configs[trend];
};

export const keywordDataByCategory: Record<string, KeywordItem[]> = {
  Gaming: [
    { rank: 1,  keyword: 'tips & trik',    type: 'hook',    frequency: 87, avgViews: 1840000, engagement: 15.2, videoCount: 34, trend: 'hot' },
    { rank: 2,  keyword: 'cara cepat',     type: 'action',  frequency: 74, avgViews: 1620000, engagement: 14.8, videoCount: 29, trend: 'up' },
    { rank: 3,  keyword: 'langsung mythic',type: 'emotion', frequency: 68, avgViews: 1540000, engagement: 14.2, videoCount: 26, trend: 'hot' },
    { rank: 4,  keyword: 'review jujur',   type: 'brand',   frequency: 61, avgViews: 1420000, engagement: 13.6, videoCount: 23, trend: 'up' },
    { rank: 5,  keyword: 'meta terbaru',   type: 'hook',    frequency: 54, avgViews: 1280000, engagement: 13.1, videoCount: 21, trend: 'stable' },
    { rank: 6,  keyword: 'gratis',         type: 'action',  frequency: 49, avgViews: 1120000, engagement: 12.4, videoCount: 18, trend: 'up' },
    { rank: 7,  keyword: 'speedrun',       type: 'emotion', frequency: 42, avgViews: 980000,  engagement: 11.8, videoCount: 16, trend: 'hot' },
    { rank: 8,  keyword: 'farming guide',  type: 'action',  frequency: 38, avgViews: 890000,  engagement: 11.2, videoCount: 14, trend: 'stable' },
    { rank: 9,  keyword: 'build optimal',  type: 'brand',   frequency: 35, avgViews: 780000,  engagement: 10.6, videoCount: 13, trend: 'down' },
    { rank: 10, keyword: 'rekor dunia',    type: 'emotion', frequency: 31, avgViews: 720000,  engagement: 10.1, videoCount: 12, trend: 'up' },
    { rank: 11, keyword: 'pro player',     type: 'brand',   frequency: 28, avgViews: 680000,  engagement: 9.8,  videoCount: 11, trend: 'stable' },
    { rank: 12, keyword: 'cheat code',     type: 'hook',    frequency: 26, avgViews: 640000,  engagement: 9.4,  videoCount: 10, trend: 'down' },
    { rank: 13, keyword: 'level up',       type: 'action',  frequency: 24, avgViews: 610000,  engagement: 9.1,  videoCount: 9,  trend: 'stable' },
    { rank: 14, keyword: 'rank push',      type: 'action',  frequency: 22, avgViews: 580000,  engagement: 8.8,  videoCount: 9,  trend: 'up' },
    { rank: 15, keyword: 'update patch',   type: 'brand',   frequency: 21, avgViews: 550000,  engagement: 8.5,  videoCount: 8,  trend: 'stable' },
    { rank: 16, keyword: 'combo skill',    type: 'hook',    frequency: 20, avgViews: 520000,  engagement: 8.2,  videoCount: 8,  trend: 'hot' },
    { rank: 17, keyword: 'best hero',      type: 'brand',   frequency: 19, avgViews: 500000,  engagement: 7.9,  videoCount: 7,  trend: 'stable' },
    { rank: 18, keyword: 'event gratis',   type: 'action',  frequency: 18, avgViews: 478000,  engagement: 7.6,  videoCount: 7,  trend: 'up' },
    { rank: 19, keyword: 'damage maksimal',type: 'hook',    frequency: 17, avgViews: 460000,  engagement: 7.4,  videoCount: 7,  trend: 'stable' },
    { rank: 20, keyword: 'tournament',     type: 'brand',   frequency: 16, avgViews: 442000,  engagement: 7.1,  videoCount: 6,  trend: 'down' },
    { rank: 21, keyword: 'hack legal',     type: 'action',  frequency: 15, avgViews: 425000,  engagement: 6.9,  videoCount: 6,  trend: 'stable' },
    { rank: 22, keyword: 'skin gratis',    type: 'emotion', frequency: 15, avgViews: 410000,  engagement: 6.7,  videoCount: 6,  trend: 'hot' },
    { rank: 23, keyword: 'gaming setup',   type: 'brand',   frequency: 14, avgViews: 396000,  engagement: 6.5,  videoCount: 5,  trend: 'stable' },
    { rank: 24, keyword: 'prank ranked',   type: 'hook',    frequency: 13, avgViews: 382000,  engagement: 6.3,  videoCount: 5,  trend: 'stable' },
    { rank: 25, keyword: 'auto win',       type: 'emotion', frequency: 13, avgViews: 370000,  engagement: 6.1,  videoCount: 5,  trend: 'up' },
    { rank: 26, keyword: 'secret map',     type: 'hook',    frequency: 12, avgViews: 358000,  engagement: 5.9,  videoCount: 5,  trend: 'stable' },
    { rank: 27, keyword: 'early game',     type: 'action',  frequency: 12, avgViews: 347000,  engagement: 5.8,  videoCount: 4,  trend: 'stable' },
    { rank: 28, keyword: 'noob vs pro',    type: 'hook',    frequency: 11, avgViews: 336000,  engagement: 5.6,  videoCount: 4,  trend: 'down' },
    { rank: 29, keyword: 'diamond hunter', type: 'emotion', frequency: 11, avgViews: 326000,  engagement: 5.5,  videoCount: 4,  trend: 'stable' },
    { rank: 30, keyword: 'global rank',    type: 'brand',   frequency: 10, avgViews: 316000,  engagement: 5.3,  videoCount: 4,  trend: 'down' },
    { rank: 31, keyword: 'team up',        type: 'action',  frequency: 10, avgViews: 307000,  engagement: 5.2,  videoCount: 4,  trend: 'stable' },
    { rank: 32, keyword: 'clutch moment',  type: 'emotion', frequency: 10, avgViews: 298000,  engagement: 5.1,  videoCount: 3,  trend: 'hot' },
    { rank: 33, keyword: 'new hero',       type: 'brand',   frequency: 9,  avgViews: 290000,  engagement: 4.9,  videoCount: 3,  trend: 'stable' },
    { rank: 34, keyword: 'war zone',       type: 'action',  frequency: 9,  avgViews: 282000,  engagement: 4.8,  videoCount: 3,  trend: 'stable' },
    { rank: 35, keyword: 'highlight play', type: 'emotion', frequency: 9,  avgViews: 275000,  engagement: 4.7,  videoCount: 3,  trend: 'stable' },
    { rank: 36, keyword: 'jungle route',   type: 'hook',    frequency: 8,  avgViews: 268000,  engagement: 4.6,  videoCount: 3,  trend: 'down' },
    { rank: 37, keyword: 'rank grind',     type: 'action',  frequency: 8,  avgViews: 261000,  engagement: 4.5,  videoCount: 3,  trend: 'stable' },
    { rank: 38, keyword: 'ping issue',     type: 'brand',   frequency: 8,  avgViews: 255000,  engagement: 4.4,  videoCount: 3,  trend: 'stable' },
    { rank: 39, keyword: 'kill steal',     type: 'emotion', frequency: 7,  avgViews: 249000,  engagement: 4.3,  videoCount: 3,  trend: 'down' },
    { rank: 40, keyword: 'buff nerf',      type: 'brand',   frequency: 7,  avgViews: 243000,  engagement: 4.2,  videoCount: 2,  trend: 'stable' },
    { rank: 41, keyword: 'push legend',    type: 'action',  frequency: 7,  avgViews: 237000,  engagement: 4.1,  videoCount: 2,  trend: 'up' },
    { rank: 42, keyword: 'solo rank',      type: 'hook',    frequency: 7,  avgViews: 232000,  engagement: 4.0,  videoCount: 2,  trend: 'stable' },
    { rank: 43, keyword: 'crazy comeback', type: 'emotion', frequency: 6,  avgViews: 227000,  engagement: 3.9,  videoCount: 2,  trend: 'hot' },
    { rank: 44, keyword: 'passive farm',   type: 'action',  frequency: 6,  avgViews: 222000,  engagement: 3.8,  videoCount: 2,  trend: 'stable' },
    { rank: 45, keyword: 'item build',     type: 'brand',   frequency: 6,  avgViews: 217000,  engagement: 3.7,  videoCount: 2,  trend: 'stable' },
    { rank: 46, keyword: 'backdoor strat', type: 'hook',    frequency: 6,  avgViews: 213000,  engagement: 3.7,  videoCount: 2,  trend: 'down' },
    { rank: 47, keyword: 'reset game',     type: 'action',  frequency: 5,  avgViews: 209000,  engagement: 3.6,  videoCount: 2,  trend: 'stable' },
    { rank: 48, keyword: 'base race',      type: 'emotion', frequency: 5,  avgViews: 205000,  engagement: 3.5,  videoCount: 2,  trend: 'stable' },
    { rank: 49, keyword: 'free diamond',   type: 'action',  frequency: 5,  avgViews: 201000,  engagement: 3.5,  videoCount: 2,  trend: 'up' },
    { rank: 50, keyword: 'guild war',      type: 'brand',   frequency: 5,  avgViews: 197000,  engagement: 3.4,  videoCount: 2,  trend: 'stable' },
  ],
  Edukasi: [
    { rank: 1,  keyword: 'dari nol',            type: 'hook',    frequency: 91, avgViews: 1520000, engagement: 14.2, videoCount: 38, trend: 'hot' },
    { rank: 2,  keyword: 'mudah dipahami',       type: 'emotion', frequency: 78, avgViews: 1380000, engagement: 13.8, videoCount: 32, trend: 'up' },
    { rank: 3,  keyword: 'gratis',               type: 'action',  frequency: 72, avgViews: 1250000, engagement: 13.1, videoCount: 29, trend: 'hot' },
    { rank: 4,  keyword: 'tips lengkap',         type: 'hook',    frequency: 64, avgViews: 1120000, engagement: 12.6, videoCount: 26, trend: 'up' },
    { rank: 5,  keyword: 'langkah demi langkah', type: 'action',  frequency: 57, avgViews: 1000000, engagement: 12.0, videoCount: 23, trend: 'stable' },
    { rank: 6,  keyword: 'terbukti',             type: 'brand',   frequency: 48, avgViews: 890000,  engagement: 11.4, videoCount: 19, trend: 'up' },
    { rank: 7,  keyword: 'beasiswa',             type: 'emotion', frequency: 44, avgViews: 810000,  engagement: 10.9, videoCount: 18, trend: 'hot' },
    { rank: 8,  keyword: 'sertifikat',           type: 'brand',   frequency: 39, avgViews: 740000,  engagement: 10.3, videoCount: 15, trend: 'stable' },
    { rank: 9,  keyword: 'karir',                type: 'emotion', frequency: 36, avgViews: 680000,  engagement: 9.8,  videoCount: 14, trend: 'down' },
    { rank: 10, keyword: 'profesional',          type: 'brand',   frequency: 32, avgViews: 620000,  engagement: 9.2,  videoCount: 13, trend: 'stable' },
    { rank: 11, keyword: 'online course',        type: 'brand',   frequency: 29, avgViews: 580000,  engagement: 8.8,  videoCount: 11, trend: 'up' },
    { rank: 12, keyword: 'belajar cepat',        type: 'action',  frequency: 27, avgViews: 548000,  engagement: 8.4,  videoCount: 10, trend: 'stable' },
    { rank: 13, keyword: 'ujian nasional',       type: 'hook',    frequency: 25, avgViews: 518000,  engagement: 8.1,  videoCount: 10, trend: 'hot' },
    { rank: 14, keyword: 'materi lengkap',       type: 'brand',   frequency: 23, avgViews: 492000,  engagement: 7.8,  videoCount: 9,  trend: 'stable' },
    { rank: 15, keyword: 'coding pemula',        type: 'hook',    frequency: 22, avgViews: 468000,  engagement: 7.5,  videoCount: 9,  trend: 'up' },
    { rank: 16, keyword: 'ranking teratas',      type: 'emotion', frequency: 21, avgViews: 446000,  engagement: 7.2,  videoCount: 8,  trend: 'stable' },
    { rank: 17, keyword: 'latihan soal',         type: 'action',  frequency: 20, avgViews: 426000,  engagement: 6.9,  videoCount: 8,  trend: 'stable' },
    { rank: 18, keyword: 'rumus mudah',          type: 'hook',    frequency: 19, avgViews: 408000,  engagement: 6.7,  videoCount: 7,  trend: 'up' },
    { rank: 19, keyword: 'skill baru',           type: 'emotion', frequency: 18, avgViews: 391000,  engagement: 6.5,  videoCount: 7,  trend: 'stable' },
    { rank: 20, keyword: 'gaes muda',            type: 'brand',   frequency: 17, avgViews: 376000,  engagement: 6.3,  videoCount: 7,  trend: 'down' },
    { rank: 21, keyword: 'webinar gratis',       type: 'action',  frequency: 16, avgViews: 362000,  engagement: 6.1,  videoCount: 6,  trend: 'stable' },
    { rank: 22, keyword: 'daftar lengkap',       type: 'brand',   frequency: 16, avgViews: 349000,  engagement: 5.9,  videoCount: 6,  trend: 'stable' },
    { rank: 23, keyword: 'tips masuk PTN',       type: 'hook',    frequency: 15, avgViews: 337000,  engagement: 5.7,  videoCount: 6,  trend: 'hot' },
    { rank: 24, keyword: 'bimbel online',        type: 'brand',   frequency: 14, avgViews: 326000,  engagement: 5.6,  videoCount: 5,  trend: 'stable' },
    { rank: 25, keyword: 'pelajaran seru',       type: 'emotion', frequency: 14, avgViews: 316000,  engagement: 5.4,  videoCount: 5,  trend: 'up' },
    { rank: 26, keyword: 'SNBT 2025',            type: 'action',  frequency: 13, avgViews: 307000,  engagement: 5.3,  videoCount: 5,  trend: 'hot' },
    { rank: 27, keyword: 'tips produktif',       type: 'hook',    frequency: 13, avgViews: 298000,  engagement: 5.2,  videoCount: 5,  trend: 'stable' },
    { rank: 28, keyword: 'hafalan cepat',        type: 'action',  frequency: 12, avgViews: 290000,  engagement: 5.0,  videoCount: 4,  trend: 'stable' },
    { rank: 29, keyword: 'mindmap',              type: 'brand',   frequency: 12, avgViews: 282000,  engagement: 4.9,  videoCount: 4,  trend: 'up' },
    { rank: 30, keyword: 'review buku',          type: 'hook',    frequency: 11, avgViews: 275000,  engagement: 4.8,  videoCount: 4,  trend: 'stable' },
    { rank: 31, keyword: 'teknik pomodoro',      type: 'action',  frequency: 11, avgViews: 268000,  engagement: 4.7,  videoCount: 4,  trend: 'stable' },
    { rank: 32, keyword: 'study with me',        type: 'brand',   frequency: 11, avgViews: 262000,  engagement: 4.6,  videoCount: 4,  trend: 'up' },
    { rank: 33, keyword: 'bahasa inggris',       type: 'action',  frequency: 10, avgViews: 256000,  engagement: 4.5,  videoCount: 3,  trend: 'stable' },
    { rank: 34, keyword: 'cara belajar',         type: 'hook',    frequency: 10, avgViews: 250000,  engagement: 4.4,  videoCount: 3,  trend: 'stable' },
    { rank: 35, keyword: 'motivasi belajar',     type: 'emotion', frequency: 10, avgViews: 244000,  engagement: 4.3,  videoCount: 3,  trend: 'hot' },
    { rank: 36, keyword: 'fisika mudah',         type: 'brand',   frequency: 9,  avgViews: 239000,  engagement: 4.2,  videoCount: 3,  trend: 'stable' },
    { rank: 37, keyword: 'kimia organik',        type: 'action',  frequency: 9,  avgViews: 234000,  engagement: 4.1,  videoCount: 3,  trend: 'down' },
    { rank: 38, keyword: 'akuntansi dasar',      type: 'brand',   frequency: 9,  avgViews: 229000,  engagement: 4.0,  videoCount: 3,  trend: 'stable' },
    { rank: 39, keyword: 'sejarah lengkap',      type: 'hook',    frequency: 8,  avgViews: 224000,  engagement: 3.9,  videoCount: 3,  trend: 'stable' },
    { rank: 40, keyword: 'jurnal ilmiah',        type: 'brand',   frequency: 8,  avgViews: 220000,  engagement: 3.9,  videoCount: 2,  trend: 'stable' },
    { rank: 41, keyword: 'skripsi cepat',        type: 'action',  frequency: 8,  avgViews: 215000,  engagement: 3.8,  videoCount: 2,  trend: 'up' },
    { rank: 42, keyword: 'seminar online',       type: 'brand',   frequency: 7,  avgViews: 211000,  engagement: 3.7,  videoCount: 2,  trend: 'stable' },
    { rank: 43, keyword: 'peta konsep',          type: 'action',  frequency: 7,  avgViews: 207000,  engagement: 3.6,  videoCount: 2,  trend: 'stable' },
    { rank: 44, keyword: 'buku teks gratis',     type: 'hook',    frequency: 7,  avgViews: 203000,  engagement: 3.6,  videoCount: 2,  trend: 'stable' },
    { rank: 45, keyword: 'self-taught',          type: 'emotion', frequency: 7,  avgViews: 199000,  engagement: 3.5,  videoCount: 2,  trend: 'up' },
    { rank: 46, keyword: 'kecerdasan buatan',    type: 'brand',   frequency: 6,  avgViews: 196000,  engagement: 3.5,  videoCount: 2,  trend: 'hot' },
    { rank: 47, keyword: 'data science',         type: 'action',  frequency: 6,  avgViews: 192000,  engagement: 3.4,  videoCount: 2,  trend: 'stable' },
    { rank: 48, keyword: 'excel dasar',          type: 'hook',    frequency: 6,  avgViews: 189000,  engagement: 3.4,  videoCount: 2,  trend: 'stable' },
    { rank: 49, keyword: 'public speaking',      type: 'brand',   frequency: 6,  avgViews: 186000,  engagement: 3.3,  videoCount: 2,  trend: 'stable' },
    { rank: 50, keyword: 'IELTS tips',           type: 'action',  frequency: 5,  avgViews: 183000,  engagement: 3.3,  videoCount: 2,  trend: 'up' },
  ],
  Komedi: [
    { rank: 1,  keyword: 'pov:',         type: 'hook',    frequency: 94, avgViews: 2140000, engagement: 17.8, videoCount: 41, trend: 'hot' },
    { rank: 2,  keyword: 'ekspektasi vs',type: 'hook',    frequency: 88, avgViews: 2020000, engagement: 17.2, videoCount: 38, trend: 'hot' },
    { rank: 3,  keyword: 'ketika',       type: 'emotion', frequency: 81, avgViews: 1890000, engagement: 16.6, videoCount: 35, trend: 'up' },
    { rank: 4,  keyword: 'hampir',       type: 'emotion', frequency: 73, avgViews: 1720000, engagement: 15.9, videoCount: 31, trend: 'hot' },
    { rank: 5,  keyword: 'drama',        type: 'brand',   frequency: 66, avgViews: 1580000, engagement: 15.2, videoCount: 28, trend: 'stable' },
    { rank: 6,  keyword: 'auto kabur',   type: 'action',  frequency: 59, avgViews: 1420000, engagement: 14.5, videoCount: 25, trend: 'up' },
    { rank: 7,  keyword: 'reaksi',       type: 'emotion', frequency: 51, avgViews: 1280000, engagement: 13.8, videoCount: 22, trend: 'hot' },
    { rank: 8,  keyword: 'bule',         type: 'hook',    frequency: 45, avgViews: 1140000, engagement: 13.1, videoCount: 19, trend: 'stable' },
    { rank: 9,  keyword: 'prank',        type: 'action',  frequency: 42, avgViews: 1020000, engagement: 12.4, videoCount: 18, trend: 'down' },
    { rank: 10, keyword: 'ngakak',       type: 'emotion', frequency: 38, avgViews: 920000,  engagement: 11.7, videoCount: 16, trend: 'stable' },
    ...Array.from({ length: 40 }, (_, i) => {
      const idx = i + 11;
      return {
        rank: idx,
        keyword: ['gokil', 'absurd', 'lawak', 'nggak nyangka', 'auto ngakak', 'caption bocil', 'skill issue', 'random', 'bucin', 'lebay', 'receh', 'wkwk', 'oot', 'kesel', 'cringe', 'gapapa', 'salah fokus', 'nyata', 'situasi awkward', 'shock', 'salting', 'krik krik', 'zonk', 'jebakan', 'plot twist', 'ending tak terduga', 'oops', 'fail moment', 'reaction video', 'skit'][i % 30] || `keyword-${idx}`,
        type: (['hook', 'brand', 'action', 'emotion'] as const)[i % 4],
        frequency: Math.max(3, 36 - i),
        avgViews: Math.max(100000, 870000 - i * 18000),
        engagement: Math.max(3, 11.2 - i * 0.2),
        videoCount: Math.max(1, 14 - Math.floor(i / 3)),
        trend: (['stable', 'up', 'down', 'hot', 'stable', 'stable', 'down'] as const)[i % 7],
      };
    }),
  ],
  Kuliner: [
    { rank: 1,  keyword: 'antri',        type: 'emotion', frequency: 89, avgViews: 2280000, engagement: 16.4, videoCount: 39, trend: 'hot' },
    { rank: 2,  keyword: 'wajib coba',   type: 'action',  frequency: 82, avgViews: 2120000, engagement: 15.9, videoCount: 36, trend: 'hot' },
    { rank: 3,  keyword: 'resep asli',   type: 'brand',   frequency: 76, avgViews: 1980000, engagement: 15.3, videoCount: 33, trend: 'up' },
    { rank: 4,  keyword: 'worth it',     type: 'hook',    frequency: 69, avgViews: 1820000, engagement: 14.7, videoCount: 30, trend: 'hot' },
    { rank: 5,  keyword: 'review jujur', type: 'brand',   frequency: 62, avgViews: 1680000, engagement: 14.1, videoCount: 27, trend: 'stable' },
    { rank: 6,  keyword: 'hidden gem',   type: 'hook',    frequency: 54, avgViews: 1520000, engagement: 13.5, videoCount: 23, trend: 'up' },
    { rank: 7,  keyword: 'enak parah',   type: 'emotion', frequency: 47, avgViews: 1360000, engagement: 12.9, videoCount: 20, trend: 'hot' },
    { rank: 8,  keyword: 'gratis',       type: 'action',  frequency: 42, avgViews: 1210000, engagement: 12.3, videoCount: 18, trend: 'stable' },
    { rank: 9,  keyword: 'porsi besar',  type: 'hook',    frequency: 38, avgViews: 1080000, engagement: 11.7, videoCount: 16, trend: 'down' },
    { rank: 10, keyword: 'tradisional',  type: 'brand',   frequency: 34, avgViews: 960000,  engagement: 11.1, videoCount: 14, trend: 'stable' },
    ...Array.from({ length: 40 }, (_, i) => {
      const idx = i + 11;
      return {
        rank: idx,
        keyword: ['murah meriah', 'open resto', 'street food', 'chef lokal', 'viral abis', 'crispy', 'level pedas', 'bakso legend', 'es kopi susu', 'mie ayam', 'masak bareng', 'dessert hits', 'makanan sehat', 'bumbu rahasia', 'santap siang', 'midnight snack', 'nasi goreng', 'soto khas', 'seafood murah', 'jajanan SD'][i % 20] || `keyword-${idx}`,
        type: (['hook', 'brand', 'action', 'emotion'] as const)[i % 4],
        frequency: Math.max(3, 32 - i),
        avgViews: Math.max(100000, 910000 - i * 19000),
        engagement: Math.max(3, 10.6 - i * 0.19),
        videoCount: Math.max(1, 13 - Math.floor(i / 3)),
        trend: (['stable', 'up', 'down', 'hot', 'stable'] as const)[i % 5],
      };
    }),
  ],
  Teknologi: [
    { rank: 1,  keyword: 'review jujur',    type: 'brand',   frequency: 91, avgViews: 1480000, engagement: 14.6, videoCount: 39, trend: 'hot' },
    { rank: 2,  keyword: 'worth it?',       type: 'hook',    frequency: 84, avgViews: 1360000, engagement: 14.0, videoCount: 36, trend: 'hot' },
    { rank: 3,  keyword: 'vs',              type: 'hook',    frequency: 77, avgViews: 1260000, engagement: 13.4, videoCount: 33, trend: 'up' },
    { rank: 4,  keyword: 'terbaik 2025',    type: 'action',  frequency: 71, avgViews: 1160000, engagement: 12.8, videoCount: 30, trend: 'hot' },
    { rank: 5,  keyword: 'tips & trik',     type: 'brand',   frequency: 64, avgViews: 1060000, engagement: 12.2, videoCount: 27, trend: 'stable' },
    { rank: 6,  keyword: 'jarang diketahui',type: 'emotion', frequency: 56, avgViews: 970000,  engagement: 11.6, videoCount: 24, trend: 'up' },
    { rank: 7,  keyword: 'spesifikasi',     type: 'brand',   frequency: 48, avgViews: 880000,  engagement: 11.0, videoCount: 20, trend: 'stable' },
    { rank: 8,  keyword: 'performa',        type: 'action',  frequency: 42, avgViews: 800000,  engagement: 10.4, videoCount: 18, trend: 'down' },
    { rank: 9,  keyword: 'gaming',          type: 'emotion', frequency: 36, avgViews: 730000,  engagement: 9.8,  videoCount: 15, trend: 'stable' },
    { rank: 10, keyword: 'budget',          type: 'hook',    frequency: 31, avgViews: 670000,  engagement: 9.2,  videoCount: 13, trend: 'stable' },
    ...Array.from({ length: 40 }, (_, i) => {
      const idx = i + 11;
      return {
        rank: idx,
        keyword: ['HP 2025', 'benchmark', 'cara setting', 'laptop murah', 'RAM upgrade', 'SSD terbaik', 'tips wifi', 'aplikasi wajib', 'dark mode', 'keyboard mekanikal', 'mouse gaming', 'charger cepat', 'baterai awet', 'kamera ponsel', 'layar AMOLED', 'earphone wireless', 'speaker bluetooth', 'router terbaik', 'VPN gratis', 'antivirus'][i % 20] || `keyword-${idx}`,
        type: (['hook', 'brand', 'action', 'emotion'] as const)[i % 4],
        frequency: Math.max(3, 29 - i),
        avgViews: Math.max(100000, 635000 - i * 13000),
        engagement: Math.max(3, 8.8 - i * 0.15),
        videoCount: Math.max(1, 12 - Math.floor(i / 3)),
        trend: (['stable', 'up', 'down', 'hot', 'stable', 'stable'] as const)[i % 6],
      };
    }),
  ],
};
