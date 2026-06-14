import React from 'react';

// ─── Professional SVG Icons or Lucide replacement ──────────────────
// We'll define or export references if needed, but components can import from lucide-react directly.

export const categoryColors: Record<string, string> = {
  Gaming:    '#2545d6',
  Edukasi:   '#0ea5e9',
  Komedi:    '#f2b366',
  Fashion:   '#ec4899',
  Kuliner:   '#ef4444',
  Musik:     '#8b5cf6',
  Lifestyle: '#14b8a6',
  Teknologi: '#22c55e',
};

// hex to rgb helper
export const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

export const CATEGORIES = Object.keys(categoryColors);

export const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
export const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

// Peak hour patterns per category
export const categoryPeakPatterns: Record<string, { peaks: number[]; weekendBoost: boolean }> = {
  Gaming:    { peaks: [20, 21, 22, 15, 16],    weekendBoost: true },
  Edukasi:   { peaks: [8, 9, 10, 13, 19],       weekendBoost: false },
  Komedi:    { peaks: [21, 22, 20, 12, 13],      weekendBoost: true },
  Fashion:   { peaks: [11, 12, 14, 17, 18],      weekendBoost: true },
  Kuliner:   { peaks: [12, 13, 18, 19, 11],      weekendBoost: false },
  Musik:     { peaks: [20, 21, 15, 16, 9],       weekendBoost: true },
  Lifestyle: { peaks: [7, 8, 12, 17, 18],        weekendBoost: false },
  Teknologi: { peaks: [9, 10, 15, 20, 21],       weekendBoost: false },
};

export const generateHeatmapForCategory = (category: string) => {
  const { peaks, weekendBoost } = categoryPeakPatterns[category] || { peaks: [20, 21], weekendBoost: false };
  const data: Record<string, Record<string, number>> = {};
  const isWeekend = (day: string) => day === 'Sabtu' || day === 'Minggu';

  days.forEach(day => {
    data[day] = {};
    hours.forEach(hour => {
      const hourNum = parseInt(hour);
      let base = Math.random() * 300000 + 100000;
      const isPeak = peaks.includes(hourNum);
      const nearPeak = peaks.some(p => Math.abs(p - hourNum) === 1);
      if (isPeak) base += 2200000 + Math.random() * 1200000;
      else if (nearPeak) base += 900000 + Math.random() * 600000;
      if (weekendBoost && isWeekend(day)) base *= 1.3;
      if (!weekendBoost && !isWeekend(day)) base *= 1.1;
      data[day][hour] = Math.round(base);
    });
  });
  return data;
};

// Pre-generate heatmap data for each category + "all"
export const allCategoryHeatmap = (() => {
  const data: Record<string, Record<string, number>> = {};
  days.forEach(day => {
    data[day] = {};
    hours.forEach(hour => {
      const hourNum = parseInt(hour);
      let base = Math.random() * 500000;
      if ((hourNum >= 12 && hourNum <= 14) || (hourNum >= 19 && hourNum <= 22)) base += 2000000 + Math.random() * 1500000;
      else if (hourNum >= 9 && hourNum <= 11) base += 1000000 + Math.random() * 800000;
      else if (hourNum >= 6 && hourNum <= 8) base += 800000 + Math.random() * 600000;
      data[day][hour] = Math.round(base);
    });
  });
  return data;
})();

export const categoryHeatmaps: Record<string, Record<string, Record<string, number>>> = {
  All: allCategoryHeatmap,
  ...Object.fromEntries(CATEGORIES.map(cat => [cat, generateHeatmapForCategory(cat)])),
};

// ─── TOP VIDEOS BY TIME SLOT ──────────────────────────────────────
export interface VideoType {
  id: number;
  title: string;
  category: string;
  postedAt: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
  engagementRate: number;
  isViral: boolean;
}

export const topVideosByTime: Record<string, VideoType[]> = {
  'Pagi (6-11)': [
    { id: 1, title: 'Belajar Python dari NOL sampai Bisa Kerja — Part 1', category: 'Edukasi', postedAt: 'Minggu 08:30', views: 1650000, likes: 198000, comments: 27300, duration: '22:14', engagementRate: 13.6, isViral: true },
    { id: 2, title: 'Morning Routine 5 AM Productive — 30 Hari Challenge', category: 'Lifestyle', postedAt: 'Senin 07:15', views: 920000, likes: 81000, comments: 11200, duration: '11:20', engagementRate: 10.0, isViral: false },
    { id: 3, title: 'English Speaking Lancar dalam 21 Hari — Challenge', category: 'Edukasi', postedAt: 'Rabu 09:45', views: 970000, likes: 122000, comments: 16700, duration: '12:30', engagementRate: 14.3, isViral: false },
    { id: 4, title: 'Cara Declutter Kamar Kos Biar Zen & Aesthetic', category: 'Lifestyle', postedAt: 'Sabtu 08:20', views: 780000, likes: 67000, comments: 9400, duration: '14:55', engagementRate: 9.7, isViral: false },
    { id: 5, title: 'Skincare Routine Pria Budget 100 Ribuan — Review', category: 'Lifestyle', postedAt: 'Jumat 07:50', views: 750000, likes: 54000, comments: 7800, duration: '9:40', engagementRate: 8.2, isViral: false },
    { id: 6, title: 'Cara Invest Saham untuk Pemula 2025', category: 'Edukasi', postedAt: 'Minggu 10:30', views: 960000, likes: 86000, comments: 16700, duration: '19:55', engagementRate: 10.6, isViral: false },
    { id: 7, title: 'Review Jujur Genshin Impact Update 5.4', category: 'Gaming', postedAt: 'Kamis 06:45', views: 1870000, likes: 258000, comments: 38500, duration: '18:07', engagementRate: 15.9, isViral: true },
    { id: 8, title: 'Beatbox Level Dewa — Tutorial Step by Step', category: 'Musik', postedAt: 'Selasa 09:00', views: 1110000, likes: 131000, comments: 18700, duration: '13:22', engagementRate: 13.4, isViral: false },
    { id: 9, title: 'Tips & Trik Windows 11 yang Jarang Diketahui', category: 'Teknologi', postedAt: 'Kamis 08:15', views: 950000, likes: 89000, comments: 13600, duration: '12:10', engagementRate: 10.7, isViral: false },
    { id: 10, title: 'Digital Detox 7 Hari — Berhasil atau Gagal?', category: 'Lifestyle', postedAt: 'Rabu 07:30', views: 540000, likes: 38000, comments: 3600, duration: '16:15', engagementRate: 7.9, isViral: false },
  ],
  'Siang (12-16)': [
    { id: 11, title: 'Mie Ayam Pak Kumis Jakarta — Antri 2 Jam Demi Ini!', category: 'Kuliner', postedAt: 'Sabtu 13:00', views: 2300000, likes: 312000, comments: 43200, duration: '9:44', engagementRate: 15.4, isViral: true },
    { id: 12, title: 'OOTD Budget 200 Ribu — Tetap Kece!', category: 'Fashion', postedAt: 'Jumat 14:30', views: 980000, likes: 91000, comments: 12400, duration: '8:10', engagementRate: 10.4, isViral: false },
    { id: 13, title: 'Build PC Gaming 5 Juta — Bisa Main AAA?', category: 'Teknologi', postedAt: 'Rabu 15:45', views: 980000, likes: 112000, comments: 21400, duration: '25:40', engagementRate: 13.6, isViral: false },
    { id: 14, title: 'Chord Gitar Pemula — 10 Lagu Hits Indonesia 2025', category: 'Musik', postedAt: 'Jumat 12:30', views: 1350000, likes: 168000, comments: 23400, duration: '20:40', engagementRate: 14.1, isViral: false },
    { id: 15, title: 'Ekspektasi vs Realita Makan di Resto Bintang 5', category: 'Komedi', postedAt: 'Sabtu 14:00', views: 1950000, likes: 298000, comments: 45300, duration: '4:55', engagementRate: 17.5, isViral: true },
    { id: 16, title: 'Cara Dapat Beasiswa LPDP 2025 — Tips Lengkap', category: 'Edukasi', postedAt: 'Kamis 13:00', views: 1420000, likes: 173000, comments: 22800, duration: '16:40', engagementRate: 13.8, isViral: false },
    { id: 17, title: 'Masak Rendang 8 Jam — Resep Asli Minang Nenek', category: 'Kuliner', postedAt: 'Minggu 12:45', views: 1980000, likes: 264000, comments: 38100, duration: '25:30', engagementRate: 15.2, isViral: true },
    { id: 18, title: 'Review Xiaomi 15 Ultra — HP 10 Juta Ini Layak?', category: 'Teknologi', postedAt: 'Kamis 15:00', views: 1540000, likes: 168000, comments: 31200, duration: '18:50', engagementRate: 12.8, isViral: true },
    { id: 19, title: 'Bahasa Gaul Gen Z yang Bikin Orang Tua Bingung', category: 'Komedi', postedAt: 'Rabu 13:30', views: 1430000, likes: 187000, comments: 29400, duration: '6:30', engagementRate: 15.1, isViral: false },
    { id: 20, title: 'Piano Otodidak 6 Bulan — Ini Hasilnya!', category: 'Musik', postedAt: 'Senin 14:15', views: 1300000, likes: 117000, comments: 16000, duration: '8:30', engagementRate: 10.2, isViral: false },
  ],
  'Sore (17-19)': [
    { id: 21, title: 'Build META Season 33 Mobile Legends — Langsung Mythic', category: 'Gaming', postedAt: 'Kamis 18:30', views: 1540000, likes: 209000, comments: 32100, duration: '11:45', engagementRate: 15.7, isViral: false },
    { id: 22, title: 'Cara Bikin Boba Sendiri di Rumah — Hemat 80%!', category: 'Kuliner', postedAt: 'Rabu 17:45', views: 1080000, likes: 138000, comments: 22500, duration: '12:10', engagementRate: 14.8, isViral: false },
    { id: 23, title: 'Review Thrift Shop Bandung — Worth It atau Nggak?', category: 'Fashion', postedAt: 'Sabtu 18:00', views: 810000, likes: 74000, comments: 10300, duration: '14:22', engagementRate: 10.4, isViral: false },
    { id: 24, title: 'Street Food Surabaya — 10 Tempat Wajib Coba', category: 'Kuliner', postedAt: 'Jumat 18:30', views: 1610000, likes: 201000, comments: 29800, duration: '17:20', engagementRate: 14.3, isViral: false },
    { id: 25, title: 'Trend Fashion Korea 2025 — Wajib Coba!', category: 'Fashion', postedAt: 'Minggu 17:15', views: 760000, likes: 68000, comments: 8700, duration: '11:45', engagementRate: 10.0, isViral: false },
    { id: 26, title: 'Speedrun Elden Ring 6 Menit — Rekor Indonesia Baru!', category: 'Gaming', postedAt: 'Sabtu 19:00', views: 2940000, likes: 398000, comments: 53200, duration: '7:01', engagementRate: 17.3, isViral: true },
    { id: 27, title: 'Cover "Cinta Luar Biasa" Andmesh — Versi Jazz', category: 'Musik', postedAt: 'Kamis 18:45', views: 1720000, likes: 214000, comments: 28900, duration: '4:55', engagementRate: 14.1, isViral: true },
    { id: 28, title: 'ChatGPT vs Gemini vs Claude — Siapa Terbaik 2025?', category: 'Teknologi', postedAt: 'Rabu 19:30', views: 1290000, likes: 141000, comments: 27800, duration: '21:15', engagementRate: 13.0, isViral: true },
    { id: 29, title: 'Matematika SMA Kelas 12 — Integral Dalam 30 Menit', category: 'Edukasi', postedAt: 'Selasa 18:00', views: 1100000, likes: 141000, comments: 18500, duration: '31:05', engagementRate: 14.5, isViral: false },
    { id: 30, title: 'Driver Ojol vs Cuaca Ekstrem — Drama Tiada Henti', category: 'Komedi', postedAt: 'Jumat 19:15', views: 1420000, likes: 94000, comments: 10100, duration: '7:18', engagementRate: 7.3, isViral: false },
  ],
  'Malam (20-23)': [
    { id: 31, title: 'Ketika Nyokap Tau Password WiFi Udah Ganti', category: 'Komedi', postedAt: 'Minggu 21:00', views: 3200000, likes: 520000, comments: 72000, duration: '3:45', engagementRate: 18.5, isViral: true },
    { id: 32, title: 'Prank Bos Pakai Suara AI — Hampir Kena Pecat', category: 'Komedi', postedAt: 'Jumat 20:30', views: 2870000, likes: 441000, comments: 61200, duration: '5:12', engagementRate: 17.6, isViral: true },
    { id: 33, title: 'Aku Coba PUBG Mobile 2025 — Grafis Gila!', category: 'Gaming', postedAt: 'Kamis 21:15', views: 2100000, likes: 310000, comments: 44000, duration: '14:32', engagementRate: 16.8, isViral: true },
    { id: 34, title: 'Cara Grinding Item Rare Honkai Star Rail Tanpa Bayar', category: 'Gaming', postedAt: 'Sabtu 20:45', views: 1320000, likes: 181000, comments: 28700, duration: '9:20', engagementRate: 15.8, isViral: false },
    { id: 35, title: 'Main Free Fire Pakai HP Kentang — Masih Bisa Booyah?', category: 'Gaming', postedAt: 'Minggu 20:00', views: 1590000, likes: 162000, comments: 39800, duration: '8:55', engagementRate: 12.8, isViral: true },
    { id: 36, title: 'Mukbang Nasi Padang Porsi XL — Sanggup Habis?', category: 'Kuliner', postedAt: 'Jumat 21:30', views: 680000, likes: 65000, comments: 11400, duration: '8:05', engagementRate: 11.2, isViral: false },
    { id: 37, title: '5 Outfit Kerja Anti Ribet untuk Cewek Kantoran', category: 'Fashion', postedAt: 'Rabu 20:15', views: 650000, likes: 57000, comments: 6600, duration: '9:33', engagementRate: 9.8, isViral: false },
    { id: 38, title: 'Viral! Dance Challenge "Goyang Tular" Tembus 40 Negara', category: 'Musik', postedAt: 'Kamis 21:00', views: 5200000, likes: 840000, comments: 112000, duration: '2:58', engagementRate: 18.3, isViral: true },
    { id: 39, title: 'Bocah 7 Tahun Main Piano Chopin — Banjir Air Mata Juri', category: 'Musik', postedAt: 'Sabtu 20:30', views: 4780000, likes: 760000, comments: 98400, duration: '5:33', engagementRate: 18.0, isViral: true },
    { id: 40, title: 'Reaksi Bule Pertama Kali Makan Durian — Auto Kabur!', category: 'Komedi', postedAt: 'Minggu 22:00', views: 6100000, likes: 920000, comments: 138000, duration: '4:47', engagementRate: 17.4, isViral: true },
  ],
};

// ─── Optimization Recommendations Metadata ────────────────────────
export interface RecType {
  iconName: string; // lucide icon name (Zap, TrendUp, Tag, Filter, etc.)
  title: string;
  desc: string;
  category: string;
  performance: string;
  color: string;
}

export const recsByCategory: Record<string, RecType[]> = {
  All: [
    { iconName: 'Zap', title: 'Peak Hours', desc: '20:00 - 23:00 (Malam) adalah waktu posting paling optimal dengan rata-rata 3.2M views', category: 'Komedi', performance: 'Sangat Tinggi', color: '#e11d48' },
    { iconName: 'TrendUp', title: 'Best Day', desc: 'Jumat & Sabtu menunjukkan engagement tertinggi di semua kategori', category: 'Overall', performance: 'Tinggi', color: '#059669' },
    { iconName: 'Tag', title: 'Category Pattern', desc: 'Gaming & Komedi cocok di malam hari, Edukasi di pagi, Kuliner di siang', category: 'Multi', performance: 'Konsisten', color: '#0ea5e9' },
    { iconName: 'Filter', title: 'Avoid', desc: 'Hindari posting antara 00:00-06:00, views turun drastis hingga 60%', category: 'All', performance: 'Critical', color: '#f59e0b' },
  ],
  Gaming: [
    { iconName: 'Zap', title: 'Peak Hours', desc: 'Malam 20:00-22:00 dan Sore 15:00-16:00 adalah waktu terbaik untuk Gaming', category: 'Gaming', performance: 'Sangat Tinggi', color: categoryColors['Gaming'] },
    { iconName: 'TrendUp', title: 'Best Day', desc: 'Sabtu & Minggu paling ramai karena target audiens lebih banyak waktu bermain', category: 'Gaming', performance: 'Tinggi', color: '#059669' },
    { iconName: 'Tag', title: 'Content Tip', desc: 'Video review, gameplay, dan tips/trik mendapat engagement tertinggi di kategori ini', category: 'Gaming', performance: 'Konsisten', color: '#8b5cf6' },
    { iconName: 'Filter', title: 'Avoid', desc: 'Hindari posting pagi hari 06:00-10:00 karena gamer aktif lebih sedikit', category: 'Gaming', performance: 'Critical', color: '#f59e0b' },
  ],
  Edukasi: [
    { iconName: 'Zap', title: 'Peak Hours', desc: 'Pagi 08:00-10:00 dan Sore 13:00 adalah waktu belajar terbaik audiens', category: 'Edukasi', performance: 'Sangat Tinggi', color: categoryColors['Edukasi'] },
    { iconName: 'TrendUp', title: 'Best Day', desc: 'Senin-Kamis performa lebih baik karena mood belajar lebih tinggi di hari kerja', category: 'Edukasi', performance: 'Tinggi', color: '#059669' },
    { iconName: 'Tag', title: 'Content Tip', desc: 'Tutorial langkah-demi-langkah dan konten "dari nol" mendapat lebih banyak views', category: 'Edukasi', performance: 'Konsisten', color: '#8b5cf6' },
    { iconName: 'Filter', title: 'Avoid', desc: 'Hindari posting Sabtu malam — audiens Edukasi cenderung offline di waktu ini', category: 'Edukasi', performance: 'Critical', color: '#f59e0b' },
  ],
  Komedi: [
    { iconName: 'Zap', title: 'Peak Hours', desc: 'Malam 21:00-22:00 adalah prime time Komedi — orang santai dan butuh hiburan', category: 'Komedi', performance: 'Sangat Tinggi', color: categoryColors['Komedi'] },
    { iconName: 'TrendUp', title: 'Best Day', desc: 'Jumat & Sabtu malam performa tertinggi untuk konten komedi dan viral', category: 'Komedi', performance: 'Tinggi', color: '#059669' },
    { iconName: 'Tag', title: 'Content Tip', desc: 'Video pendek 3-5 menit dengan punchline kuat lebih mudah viral', category: 'Komedi', performance: 'Konsisten', color: '#8b5cf6' },
    { iconName: 'Filter', title: 'Avoid', desc: 'Hindari pagi hari 06:00-09:00 — mood humor audiens belum optimal', category: 'Komedi', performance: 'Critical', color: '#f59e0b' },
  ],
  Fashion: [
    { iconName: 'Zap', title: 'Peak Hours', desc: 'Siang 11:00-14:00 dan Sore 17:00-18:00 paling ramai untuk konten Fashion', category: 'Fashion', performance: 'Sangat Tinggi', color: categoryColors['Fashion'] },
    { iconName: 'TrendUp', title: 'Best Day', desc: 'Jumat-Minggu performa terbaik karena orang merencanakan outfit akhir pekan', category: 'Fashion', performance: 'Tinggi', color: '#059669' },
    { iconName: 'Tag', title: 'Content Tip', desc: 'OOTD, haul, dan review produk mendapat engagement lebih tinggi dari tutorial', category: 'Fashion', performance: 'Konsisten', color: '#8b5cf6' },
    { iconName: 'Filter', title: 'Avoid', desc: 'Hindari posting malam setelah 22:00 — audiens Fashion biasanya sudah offline', category: 'Fashion', performance: 'Critical', color: '#f59e0b' },
  ],
  Kuliner: [
    { iconName: 'Zap', title: 'Peak Hours', desc: 'Siang 12:00-13:00 dan Sore 18:00-19:00 (jam makan) adalah waktu emas Kuliner', category: 'Kuliner', performance: 'Sangat Tinggi', color: categoryColors['Kuliner'] },
    { iconName: 'TrendUp', title: 'Best Day', desc: 'Sabtu & Minggu performa terbaik karena orang lebih sering jajan dan explore', category: 'Kuliner', performance: 'Tinggi', color: '#059669' },
    { iconName: 'Tag', title: 'Content Tip', desc: 'Food vlog, mukbang, dan review tempat makan mendapat views lebih tinggi', category: 'Kuliner', performance: 'Konsisten', color: '#8b5cf6' },
    { iconName: 'Filter', title: 'Avoid', desc: 'Hindari posting 22:00-06:00 — konten makanan kurang menarik saat orang mengantuk', category: 'Kuliner', performance: 'Critical', color: '#f59e0b' },
  ],
  Musik: [
    { iconName: 'Zap', title: 'Peak Hours', desc: 'Malam 20:00-21:00 dan Sore 15:00-16:00 adalah waktu terbaik konten Musik', category: 'Musik', performance: 'Sangat Tinggi', color: categoryColors['Musik'] },
    { iconName: 'TrendUp', title: 'Best Day', desc: 'Sabtu performa tertinggi — orang lebih rileks dan menikmati musik di akhir pekan', category: 'Musik', performance: 'Tinggi', color: '#059669' },
    { iconName: 'Tag', title: 'Content Tip', desc: 'Cover lagu hits dan tutorial alat musik mendapat engagement sangat tinggi', category: 'Musik', performance: 'Konsisten', color: '#8b5cf6' },
    { iconName: 'Filter', title: 'Avoid', desc: 'Hindari posting di jam kerja pagi 07:00-09:00 untuk memaksimalkan jangkauan', category: 'Musik', performance: 'Critical', color: '#f59e0b' },
  ],
  Lifestyle: [
    { iconName: 'Zap', title: 'Peak Hours', desc: 'Pagi 07:00-08:00 dan Sore 17:00-18:00 cocok untuk konten Lifestyle & rutinitas', category: 'Lifestyle', performance: 'Sangat Tinggi', color: categoryColors['Lifestyle'] },
    { iconName: 'TrendUp', title: 'Best Day', desc: 'Senin pagi performa baik karena orang mencari motivasi awal pekan', category: 'Lifestyle', performance: 'Tinggi', color: '#059669' },
    { iconName: 'Tag', title: 'Content Tip', desc: 'Rutinitas pagi, tips produktivitas, dan challenge mendapat respons sangat baik', category: 'Lifestyle', performance: 'Konsisten', color: '#8b5cf6' },
    { iconName: 'Filter', title: 'Avoid', desc: 'Hindari posting tengah malam — audiens Lifestyle tidur lebih awal', category: 'Lifestyle', performance: 'Critical', color: '#f59e0b' },
  ],
  Teknologi: [
    { iconName: 'Zap', title: 'Peak Hours', desc: 'Pagi 09:00-10:00 dan Malam 20:00-21:00 cocok untuk konten Tech & review', category: 'Teknologi', performance: 'Sangat Tinggi', color: categoryColors['Teknologi'] },
    { iconName: 'TrendUp', title: 'Best Day', desc: 'Rabu-Kamis performa baik karena orang mencari referensi tech di pertengahan minggu', category: 'Teknologi', performance: 'Tinggi', color: '#059669' },
    { iconName: 'Tag', title: 'Content Tip', desc: 'Review gadget, tutorial, dan perbandingan produk mendapat views & komentar tinggi', category: 'Teknologi', performance: 'Konsisten', color: '#8b5cf6' },
    { iconName: 'Filter', title: 'Avoid', desc: 'Hindari posting Sabtu siang — audiens Tech lebih aktif di platform lain di akhir pekan', category: 'Teknologi', performance: 'Critical', color: '#f59e0b' },
  ],
};

export const hourSlots = [
  { label: '06:00-08:00', start: 6, end: 8, category: 'Pagi' },
  { label: '08:00-11:00', start: 8, end: 11, category: 'Pagi' },
  { label: '11:00-13:00', start: 11, end: 13, category: 'Siang' },
  { label: '13:00-16:00', start: 13, end: 16, category: 'Siang' },
  { label: '16:00-18:00', start: 16, end: 18, category: 'Sore' },
  { label: '18:00-20:00', start: 18, end: 20, category: 'Sore' },
  { label: '20:00-23:00', start: 20, end: 23, category: 'Malam' },
  { label: '23:00-06:00', start: 23, end: 6, category: 'Malam' },
];

export const formatNum = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return n.toFixed(0);
};
