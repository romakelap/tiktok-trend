import type {
  AccountOption,
  ContentRow,
  HistoricalDay,
  Recommendation,
  ScheduleMatrix,
  TopSlot,
} from "./types";

/**
 * Mock historical timeseries — last 14 days of aggregated metrics across all
 * tracked accounts. Generated once at module load so the chart values remain
 * stable per session.
 */
export const HISTORICAL: HistoricalDay[] = (() => {
  const base = new Date("2026-05-21");
  const data: HistoricalDay[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    const dateStr = `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}`;
    const trendFactor =
      1 + (13 - i) * 0.025 + (Math.random() * 0.1 - 0.05);
    const videos = Math.round(6 + Math.random() * 6);
    const views = Math.round(
      (280_000 + Math.random() * 220_000) * trendFactor
    );
    data.push({
      date: dateStr,
      videos,
      views,
      likes: Math.round(views * (0.085 + Math.random() * 0.04)),
      comments: Math.round(views * (0.009 + Math.random() * 0.005)),
      shares: Math.round(views * (0.018 + Math.random() * 0.008)),
      engagement: +(8.5 + Math.random() * 4 + (13 - i) * 0.08).toFixed(1),
      viralProb: +(0.48 + Math.random() * 0.18 + (13 - i) * 0.008).toFixed(2),
    });
  }
  return data;
})();

/**
 * Content performance — 12 videos joined with ML predictions (viral prob,
 * tier, cluster). Sourced from the same fixture used across the dashboard,
 * ML predictions, and video library pages.
 */
export const CONTENT_PERFORMANCE: ContentRow[] = [
  { id: 1,  title: "Rumput Jepang vs Rumput Gajah Mini — Mana Lebih Tahan Panas?",  account: "podomorogarden",    accountType: "own",         views:   84_200, likes:  8_420, comments:    642, shares: 1_240, engagement: 12.3, viralProb: 0.87, tier: "High", clusterId: 4, coverUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&q=80" },
  { id: 2,  title: "Cara Stek Bunga Bougenville Biar Cepat Tumbuh dalam 2 Minggu", account: "podomorogarden",    accountType: "own",         views:   42_600, likes:  3_920, comments:    380, shares:   612, engagement: 11.5, viralProb: 0.74, tier: "High", clusterId: 0, coverUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=300&q=80" },
  { id: 3,  title: "Tour Kebun Podo Moro — Koleksi Tanaman Hias Lengkap",          account: "podomorogarden",    accountType: "own",         views:   28_400, likes:  2_180, comments:    294, shares:   340, engagement:  9.9, viralProb: 0.31, tier: "Mid",  clusterId: 2, coverUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80" },
  { id: 4,  title: "Tips Perawatan Rumput Mutiara Tetap Hijau di Musim Kemarau",   account: "podomorogarden",    accountType: "own",         views:   18_200, likes:  1_640, comments:    142, shares:   218, engagement: 11.0, viralProb: 0.42, tier: "Mid",  clusterId: 0, coverUrl: "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=300&q=80" },
  { id: 5,  title: "Unboxing 50 Pot Tanaman Hias Kiriman dari Bandung",            account: "podomorogarden",    accountType: "own",         views:   36_800, likes:  2_890, comments:    412, shares:   480, engagement: 10.3, viralProb: 0.58, tier: "High", clusterId: 3, coverUrl: "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=300&q=80" },
  { id: 6,  title: "5 Tanaman Hias 2025 yang Bakal Booming — Wajib Punya!",        account: "tanamanhias.id",    accountType: "competitor",  views:  412_000, likes: 38_200, comments:  4_120, shares: 6_840, engagement: 11.9, viralProb: 0.94, tier: "Top",  clusterId: 1, coverUrl: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300&q=80" },
  { id: 7,  title: "Review Monstera Albo Variegata Termahal di Indonesia",         account: "tanamanhias.id",    accountType: "competitor",  views:  268_000, likes: 21_400, comments:  2_840, shares: 3_120, engagement: 10.2, viralProb: 0.81, tier: "High", clusterId: 3, coverUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=300&q=80" },
  { id: 8,  title: "Workshop Vertical Garden di Rumah — Hemat Lahan Sempit",       account: "kebun.bali",        accountType: "competitor",  views:  158_000, likes: 14_600, comments:  1_820, shares: 2_240, engagement: 11.8, viralProb: 0.78, tier: "High", clusterId: 0, coverUrl: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=300&q=80" },
  { id: 9,  title: "Membuat Taman Tropis Ala Bali di Halaman Belakang",            account: "kebun.bali",        accountType: "competitor",  views:   94_800, likes:  7_920, comments:  1_140, shares: 1_320, engagement: 11.0, viralProb: 0.46, tier: "Mid",  clusterId: 4, coverUrl: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=300&q=80" },
  { id: 10, title: "5 Plants That Absolutely Thrive in Tropical Climate",          account: "gardenup.official", accountType: "inspiration", views: 1_840_000, likes:184_000, comments: 12_400, shares:28_400, engagement: 12.2, viralProb: 0.97, tier: "Top",  clusterId: 1, coverUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&q=80" },
  { id: 11, title: "My Plant Care Routine — 200+ Plant Collection Tour",           account: "plantkween",        accountType: "inspiration", views:  412_000, likes: 48_200, comments:  5_840, shares: 6_240, engagement: 14.6, viralProb: 0.83, tier: "Top",  clusterId: 2, coverUrl: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=300&q=80" },
  { id: 12, title: "ASMR Repotting Calathea — Soothing Plant Therapy",             account: "plantkween",        accountType: "inspiration", views:  184_000, likes: 24_800, comments:  3_120, shares: 2_840, engagement: 16.8, viralProb: 0.62, tier: "High", clusterId: 4, coverUrl: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=300&q=80" },
];

/**
 * 7 days × 6 time-slots of expected engagement rate (%). Row order matches
 * the `DAYS` constant in `meta.ts`; column order matches `TIME_SLOTS`.
 */
export const SCHEDULE_HEATMAP: ScheduleMatrix = [
  // Mon
  [4.2, 6.8, 9.1, 7.4, 11.6, 8.9],
  // Tue
  [5.1, 7.2, 8.8, 7.0, 10.2, 8.4],
  // Wed
  [4.8, 7.0, 11.8, 8.2, 10.8, 8.6],
  // Thu
  [5.4, 7.8, 9.4, 7.6, 11.2, 9.0],
  // Fri
  [4.6, 6.4, 8.6, 8.4, 12.7, 10.8],
  // Sat
  [5.8, 11.2, 10.4, 8.8, 10.6, 9.4],
  // Sun
  [6.2, 9.8, 12.5, 9.6, 11.0, 8.2],
];

export const TOP_SLOTS: TopSlot[] = [
  {
    day: "Jum", time: "18-21", dayLabel: "Jumat", timeLabel: "18:00-21:00 WITA",
    expectedEng: 12.7, expectedViews: 92_000, confidence: 0.94,
    reasoning:
      "Slot prime time mingguan — audiens niche tanaman aktif setelah jam kerja. Friday evening secara konsisten memberi viral probability tertinggi lintas kategori.",
  },
  {
    day: "Min", time: "12-15", dayLabel: "Minggu", timeLabel: "12:00-15:00 WITA",
    expectedEng: 12.5, expectedViews: 78_000, confidence: 0.91,
    reasoning:
      "Weekend afternoon — audiens punya waktu luang untuk konsumsi konten tutorial dan tour panjang. Engagement peak untuk konten edukasi.",
  },
  {
    day: "Rab", time: "12-15", dayLabel: "Rabu", timeLabel: "12:00-15:00 WITA",
    expectedEng: 11.8, expectedViews: 64_000, confidence: 0.88,
    reasoning:
      "Slot makan siang weekday — performa tinggi untuk video tutorial pendek (2-4 menit) yang bisa ditonton sekali makan.",
  },
  {
    day: "Sen", time: "18-21", dayLabel: "Senin", timeLabel: "18:00-21:00 WITA",
    expectedEng: 11.6, expectedViews: 58_000, confidence: 0.86,
    reasoning:
      "Awal minggu prime time — engagement bagus terutama untuk konten motivasi & weekly tips.",
  },
  {
    day: "Sab", time: "09-12", dayLabel: "Sabtu", timeLabel: "09:00-12:00 WITA",
    expectedEng: 11.2, expectedViews: 54_000, confidence: 0.84,
    reasoning:
      "Pagi weekend — slot ideal untuk konten DIY dan unboxing, audiens dalam mode santai eksplorasi.",
  },
];

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 1,
    priority: "high",
    type: "Tutorial Series",
    title: "Seri Vertical Garden untuk Pemula",
    description:
      "Buat seri 3 video tutorial vertical garden — dari persiapan rangka, pemilihan tanaman, hingga maintenance bulanan. Format step-by-step yang mudah diikuti.",
    rationale:
      "Hashtag #verticalgarden naik 89% week-over-week, demand sangat tinggi tapi konten kompetitor masih terbatas. Window of opportunity ~2-3 minggu sebelum tren saturasi.",
    keywords: ["vertical garden", "tutorial pemula", "DIY", "lahan sempit", "instalasi"],
    hashtags: ["#verticalgarden", "#tutorialberkebun", "#diygarden", "#lahansempit", "#tanamanhias"],
    duration: "3–5 menit per video",
    expectedReach: "+45-60% follower growth",
    confidence: 0.91,
  },
  {
    id: 2,
    priority: "high",
    type: "Video Series",
    title: "Comparison Series Mingguan",
    description:
      'Lanjutkan format comparison ("X vs Y") dengan tema mingguan. Rumput jepang vs gajah mini sudah viral, eksplorasi: bougenville varian, monstera vs philodendron, pupuk organic vs sintetis.',
    rationale:
      'Format comparison menghasilkan engagement 3.1x lebih tinggi dibanding tour pada akun yang sama. Video "Rumput Jepang vs Gajah Mini" mencapai 84K views — pencapaian tertinggi 3 bulan terakhir.',
    keywords: ["comparison", "plant vs plant", "mana lebih baik", "review jujur"],
    hashtags: ["#plantvs", "#comparisontanaman", "#fyp", "#reviewtanaman"],
    duration: "2–4 menit",
    expectedReach: "~80K views per video",
    confidence: 0.88,
  },
  {
    id: 3,
    priority: "medium",
    type: "ASMR/Lifestyle",
    title: "Eksplorasi Format ASMR Repotting",
    description:
      "Coba 1-2 video ASMR repotting/perawatan tanaman dengan kualitas audio yang baik (mic eksternal). Tanpa narasi, fokus pada suara tanah, air, dan gerakan tangan.",
    rationale:
      "@plantkween dengan format ASMR mencatat 184K views dan engagement 16.8% — tertinggi dalam dataset. Format ini underutilized di niche tanaman Indonesia.",
    keywords: ["asmr", "repotting", "relaxing", "plant therapy"],
    hashtags: ["#asmr", "#repottingasmr", "#plantcare", "#relaxing"],
    duration: "5–8 menit",
    expectedReach: "~30-50K views (eksperimental)",
    confidence: 0.74,
  },
  {
    id: 4,
    priority: "medium",
    type: "Live/Engagement",
    title: "Q&A Live Session Bulanan",
    description:
      "Sesi live Q&A perawatan tanaman 1x per bulan, durasi 45-60 menit. Audiens kirim pertanyaan sebelumnya via comment, dijawab live + Q&A real-time.",
    rationale:
      "64% komentar dominan adalah pertanyaan tentang perawatan dan availability stock. Live format meningkatkan loyalty dan algorithm boost.",
    keywords: ["q&a", "live", "tanya jawab", "tips plant"],
    hashtags: ["#qnalive", "#tanyaplant", "#liveplant", "#tipsplant"],
    duration: "45–60 menit live",
    expectedReach: "~500-800 concurrent viewers",
    confidence: 0.72,
  },
  {
    id: 5,
    priority: "low",
    type: "Update/Reguler",
    title: "Stock Update Mingguan (Senin)",
    description:
      "Video pendek update stok tanaman tersedia tiap Senin pagi. Format quick scroll dengan pricing card overlay, durasi maksimal 90 detik.",
    rationale:
      "Audience sering bertanya availability stock di comment. Konten reguler ini membangun habit dan drive direct sales conversion.",
    keywords: ["stock update", "available", "ready stok", "price list"],
    hashtags: ["#stocktanaman", "#readystok", "#tanamanmurah"],
    duration: "60–90 detik",
    expectedReach: "~10-20K views konsisten",
    confidence: 0.68,
  },
  {
    id: 6,
    priority: "low",
    type: "Vlog/BTS",
    title: "Behind-the-Scenes Kebun",
    description:
      "Konten vlog/BTS aktivitas harian di kebun — bibit baru, panen, kunjungan customer, momen lucu dengan tanaman. Build personal connection dengan audience.",
    rationale:
      "Diferensiasi dari kompetitor yang fokus produk. Personal branding meningkatkan retention dan loyalty audience jangka panjang.",
    keywords: ["behind the scenes", "vlog kebun", "daily farming", "personal"],
    hashtags: ["#btskebun", "#dailyfarming", "#vlogkebun"],
    duration: "4–7 menit",
    expectedReach: "~15-25K views",
    confidence: 0.61,
  },
];

export const ACCOUNT_OPTIONS: AccountOption[] = [
  { username: "podomorogarden",    type: "own" },
  { username: "tanamanhias.id",    type: "competitor" },
  { username: "kebun.bali",        type: "competitor" },
  { username: "tropicalplants_id", type: "competitor" },
  { username: "gardenup.official", type: "inspiration" },
  { username: "plantkween",        type: "inspiration" },
];
