import {
  BookOpen,
  Home,
  Monitor,
  Smile,
  Utensils,
} from "lucide-react";
import type {
  Category,
  CategoryId,
  CombinationInsight,
  PeriodKey,
  TierMeta,
  TopVideo,
  TrendPoint,
  VideoTier,
} from "./types";

/**
 * Static mock data used until the dashboard is wired to the live BI API.
 * Each export is the single source of truth for that table; pages and
 * components import these instead of redeclaring inline copies.
 */

export const BACKEND_CATEGORY_MAP: Record<string, {
  id: CategoryId;
  label: string;
  Ico: typeof BookOpen;
  color: string;
  tint: string;
}> = {
  "Edukasi": {
    id: "edukasi",
    label: "Edukasi",
    Ico: BookOpen,
    color: "#0369a1",
    tint: "rgba(3,105,161,0.07)",
  },
  "Komedi": {
    id: "komedi",
    label: "Komedi",
    Ico: Smile,
    color: "#b45309",
    tint: "rgba(180,83,9,0.07)",
  },
  "Kuliner": {
    id: "kuliner",
    label: "Kuliner",
    Ico: Utensils,
    color: "#b91c1c",
    tint: "rgba(185,28,28,0.07)",
  },
  "Lifestyle & Home": {
    id: "lifestyle",
    label: "Lifestyle & Home",
    Ico: Home,
    color: "#047857",
    tint: "rgba(4,120,87,0.07)",
  },
  "Teknologi": {
    id: "teknologi",
    label: "Teknologi",
    Ico: Monitor,
    color: "#5b21b6",
    tint: "rgba(91,33,182,0.07)",
  },
};

export const FRONTEND_TO_BACKEND_CAT: Record<CategoryId, string> = {
  edukasi: "Edukasi",
  komedi: "Komedi",
  kuliner: "Kuliner",
  lifestyle: "Lifestyle & Home",
  teknologi: "Teknologi",
};

export const CATEGORIES: Category[] = [
  {
    id: "edukasi",
    label: "Edukasi",
    Ico: BookOpen,
    color: "#0369a1",
    tint: "rgba(3,105,161,0.07)",
    videos: 42,
    views: 2_840_000,
    likes: 218_000,
    comments: 28_400,
    engagement: 11.8,
    viralProb: 0.72,
    revenue: 14_200_000,
    topHashtags: ["#belajar", "#tutorial", "#ilmupengetahuan", "#edukasi"],
    topKeywords: ["cara", "tutorial", "tips", "langkah", "belajar"],
    bestTime: "Senin–Jumat 19:00–21:00",
    insight:
      'Format step-by-step mendominasi. Konten "cara X dalam Y langkah" konsisten viral. Audience sangat engaged dengan konten praktis.',
  },
  {
    id: "komedi",
    label: "Komedi",
    Ico: Smile,
    color: "#b45309",
    tint: "rgba(180,83,9,0.07)",
    videos: 38,
    views: 4_120_000,
    likes: 412_000,
    comments: 58_400,
    engagement: 14.2,
    viralProb: 0.81,
    revenue: 18_400_000,
    topHashtags: ["#lucu", "#fyp", "#komedi", "#hiburan"],
    topKeywords: ["lucu", "ngakak", "receh", "viral", "situasi"],
    bestTime: "Jumat–Sabtu 20:00–23:00",
    insight:
      "Engagement tertinggi lintas kategori. Konten situasi sehari-hari lebih relatable. Humor berbasis budaya lokal perform 2x lebih baik.",
  },
  {
    id: "kuliner",
    label: "Kuliner",
    Ico: Utensils,
    color: "#b91c1c",
    tint: "rgba(185,28,28,0.07)",
    videos: 56,
    views: 3_680_000,
    likes: 298_000,
    comments: 42_000,
    engagement: 12.4,
    viralProb: 0.68,
    revenue: 22_800_000,
    topHashtags: ["#kuliner", "#makanan", "#foodtiktok", "#resep"],
    topKeywords: ["resep", "masak", "enak", "mudah", "rumahan"],
    bestTime: "Setiap hari 11:00–13:00 & 17:00–19:00",
    insight:
      "Thumbnail makanan meningkatkan CTR 2.4x. ASMR masak sangat diminati. Revenue tertinggi karena potensi sponsorship brand F&B.",
  },
  {
    id: "lifestyle",
    label: "Lifestyle & Home",
    Ico: Home,
    color: "#047857",
    tint: "rgba(4,120,87,0.07)",
    videos: 31,
    views: 1_920_000,
    likes: 168_000,
    comments: 19_200,
    engagement: 10.8,
    viralProb: 0.58,
    revenue: 9_600_000,
    topHashtags: ["#lifestyle", "#rumah", "#dekorasi", "#diy"],
    topKeywords: ["before-after", "DIY", "hemat", "simpel", "aesthetic"],
    bestTime: "Sabtu–Minggu 09:00–12:00",
    insight:
      "Konten before-after 3x lebih banyak di-share. Weekend pagi adalah slot terbaik. Audience perempuan 25-35 tahun sangat dominan.",
  },
  {
    id: "teknologi",
    label: "Teknologi",
    Ico: Monitor,
    color: "#5b21b6",
    tint: "rgba(91,33,182,0.07)",
    videos: 24,
    views: 1_240_000,
    likes: 88_000,
    comments: 14_800,
    engagement: 9.4,
    viralProb: 0.51,
    revenue: 6_200_000,
    topHashtags: ["#teknologi", "#review", "#gadget", "#tech"],
    topKeywords: ["review", "spesifikasi", "perbandingan", "harga", "terbaik"],
    bestTime: "Selasa–Kamis 20:00–22:00",
    insight:
      "Review produk spesifik lebih perform daripada konten umum. Niche tapi loyal. Konten perbandingan dua produk sangat populer.",
  },
];

export const COMBINATION_INSIGHTS: Record<string, CombinationInsight> = {
  "edukasi-komedi": {
    engagementRange: "13–16%",
    viralPotential: "0.85",
    revenuePotential: "Rp 28jt",
    timeOverlap: "Senin–Jumat 19:00–21:00",
    hashtags: ["#edutainment", "#belajarsambilketawa", "#fyp", "#lucu"],
    keywords: ["cara lucu", "belajar santai", "tips receh", "fakta unik"],
    contentDirection:
      'Edutainment: Fakta unik + humor. Format "5 Fakta Aneh yang Ternyata Benar" atau tips edukatif dengan twist komedi.',
    insight:
      "Kombinasi ini menghasilkan konten edutainment yang mudah viral. Humor menurunkan hambatan belajar, membuat audience bertahan lebih lama. Engagement rate diprediksi 15–20% lebih tinggi dari rata-rata keduanya.",
  },
  "edukasi-kuliner": {
    engagementRange: "12–14%",
    viralPotential: "0.74",
    revenuePotential: "Rp 31jt",
    timeOverlap: "Senin–Jumat 11:00–13:00",
    hashtags: ["#resepsehat", "#masakmudah", "#tutorial", "#kuliner"],
    keywords: [
      "resep tutorial",
      "cara masak",
      "tips dapur",
      "nutrisi",
      "langkah mudah",
    ],
    contentDirection:
      'Tutorial Kuliner: "Cara masak X yang benar" dengan penjelasan ilmiah singkat tentang teknik memasak.',
    insight:
      "Konten edukasi kuliner sangat powerful — menggabungkan nilai informasi tinggi dengan visual makanan yang menarik. Potensi sponsorship dari brand F&B dan alat masak sangat besar.",
  },
  "edukasi-lifestyle": {
    engagementRange: "11–13%",
    viralPotential: "0.68",
    revenuePotential: "Rp 18jt",
    timeOverlap: "Sabtu 10:00–12:00",
    hashtags: ["#diy", "#tips", "#rumah", "#belajar"],
    keywords: ["tips hemat", "DIY tutorial", "cara dekorasi", "langkah simpel"],
    contentDirection:
      'DIY Tutorial Home: Konten "Cara buat X untuk rumah" yang step-by-step. Before-after dengan penjelasan teknis.',
    insight:
      "Kombinasi ini cocok untuk tutorial dekorasi rumah berbasis edukasi. Konten praktis dengan hasil visual nyata — ideal untuk platform visual seperti TikTok.",
  },
  "edukasi-teknologi": {
    engagementRange: "10–12%",
    viralPotential: "0.62",
    revenuePotential: "Rp 15jt",
    timeOverlap: "Selasa–Kamis 20:00–22:00",
    hashtags: ["#techreview", "#tips", "#tutorial", "#teknologi"],
    keywords: [
      "cara pakai",
      "tips teknologi",
      "tutorial gadget",
      "fitur tersembunyi",
    ],
    contentDirection:
      'Tech Tutorial: "Cara menggunakan X untuk pemula" atau "Fitur tersembunyi yang wajib kamu tahu". Format step-by-step dengan visual screen recording.',
    insight:
      "Format tutorial teknologi sangat dicari namun supply masih rendah. Menjadi creator tech educator memberikan positioning yang kuat dan audience yang sangat loyal.",
  },
  "komedi-kuliner": {
    engagementRange: "14–17%",
    viralPotential: "0.88",
    revenuePotential: "Rp 35jt",
    timeOverlap: "Jumat 17:00–20:00",
    hashtags: ["#masakreceh", "#fyp", "#kulinerlucu", "#komedi"],
    keywords: [
      "masak gagal",
      "review jujur",
      "ekspektasi vs realita",
      "challenge",
    ],
    contentDirection:
      'Food Comedy: "Ekspektasi vs Realita masak X" atau challenge memasak dengan fail yang direncanakan. Format review jujur dengan humor.',
    insight:
      "Salah satu kombinasi paling viral di TikTok. Konten masak yang lucu selalu masuk FYP. Engagement tertinggi dari semua kombinasi — revenue dari sponsorship F&B bisa sangat besar.",
  },
  "komedi-lifestyle": {
    engagementRange: "12–15%",
    viralPotential: "0.79",
    revenuePotential: "Rp 22jt",
    timeOverlap: "Sabtu–Minggu 20:00–22:00",
    hashtags: ["#kehidupansehari", "#fyp", "#lucu", "#rumah"],
    keywords: [
      "ekspektasi realita",
      "kehidupan nyata",
      "situasi rumah",
      "relatable",
    ],
    contentDirection:
      'Lifestyle Comedy: Situasi relatable kehidupan rumah tangga. "Expektasi vs Realita" dekorasi rumah atau "Kehidupan nyata vs Pinterest".',
    insight:
      "Konten lifestyle komedi sangat relatable untuk segmen usia 20–35 tahun. Potensi viral tinggi karena audience cenderung tag teman yang mengalami hal serupa.",
  },
  "komedi-teknologi": {
    engagementRange: "11–14%",
    viralPotential: "0.73",
    revenuePotential: "Rp 19jt",
    timeOverlap: "Jumat–Sabtu 20:00–22:00",
    hashtags: ["#techfail", "#fyp", "#komedi", "#gadget"],
    keywords: [
      "tech fail",
      "review jujur",
      "ekspektasi gadget",
      "lucu",
      "receh",
    ],
    contentDirection:
      'Tech Comedy: Review teknologi dengan twist humor. "Ekspektasi vs Realita gadget mahal" atau "Hal aneh yang orang lakukan dengan teknologi".',
    insight:
      "Niche yang belum terlalu ramai tapi sedang naik tren. Tech comedy menjangkau dua audience sekaligus dan memiliki potential viral yang tinggi.",
  },
  "kuliner-lifestyle": {
    engagementRange: "11–13%",
    viralPotential: "0.66",
    revenuePotential: "Rp 26jt",
    timeOverlap: "Sabtu–Minggu 10:00–13:00",
    hashtags: ["#gaya hidup", "#makananrumahan", "#aesthetic", "#resep"],
    keywords: ["aesthetic", "meal prep", "rumahan", "healthy", "simpel"],
    contentDirection:
      'Aesthetic Food Lifestyle: Konten "day in my life" dengan fokus pada persiapan makanan bergaya. Meal prep aesthetic dengan tips memasak praktis.',
    insight:
      "Kombinasi ini sangat cocok untuk target audience perempuan muda. Konten aesthetic food performs sangat baik secara visual dan mendorong engagement tinggi.",
  },
  "kuliner-teknologi": {
    engagementRange: "10–12%",
    viralPotential: "0.60",
    revenuePotential: "Rp 22jt",
    timeOverlap: "Selasa–Kamis 17:00–19:00",
    hashtags: ["#smartkitchen", "#gadgetmasak", "#tekcook", "#review"],
    keywords: [
      "gadget dapur",
      "review alat masak",
      "teknologi masak",
      "air fryer",
    ],
    contentDirection:
      'Smart Kitchen: Review gadget dapur dan alat masak teknologi terkini. "Air fryer vs oven biasa" atau unboxing dan review peralatan masak smart.',
    insight:
      "Niche yang sangat spesifik namun memiliki potential besar seiring tren smart home. Sponsorship dari brand kitchen appliance sangat relevan dan nilainya tinggi.",
  },
  "lifestyle-teknologi": {
    engagementRange: "10–12%",
    viralPotential: "0.57",
    revenuePotential: "Rp 14jt",
    timeOverlap: "Sabtu 10:00–12:00",
    hashtags: ["#smarthome", "#gadget", "#lifestyle", "#teknologi"],
    keywords: [
      "smart home",
      "gadget rumah",
      "setup",
      "produktivitas",
      "aesthetic",
    ],
    contentDirection:
      'Smart Lifestyle: Konten setup rumah dengan teknologi. "Home office setup tour" atau "Smart home gadget yang worth it". Visual room tour dengan penjelasan teknis.',
    insight:
      "Segmen growing dengan audience yang memiliki daya beli tinggi. Potensi affiliate marketing dari gadget rumah sangat menjanjikan. Konten setup dan tour sangat populer.",
  },
};

export const TOP_VIDEOS: Record<CategoryId, TopVideo[]> = {
  edukasi: [
    { id: 1, title: "5 Cara Belajar Efektif yang Terbukti Secara Sains", views: 412_000, engagement: 12.8, viralProb: 0.91, tier: "Top", cluster: "Tutorial", published: "2026-05-18" },
    { id: 2, title: "Tutorial Menulis Esai Ilmiah — Dari Nol Sampai Jadi", views: 284_000, engagement: 11.4, viralProb: 0.83, tier: "Top", cluster: "Tutorial", published: "2026-05-15" },
    { id: 3, title: "Matematika Dasar yang Sering Salah Dipahami", views: 198_000, engagement: 13.2, viralProb: 0.77, tier: "High", cluster: "Tips", published: "2026-05-12" },
    { id: 4, title: "Cara Baca Buku 2x Lebih Cepat dengan Teknik Ini", views: 156_000, engagement: 10.9, viralProb: 0.72, tier: "High", cluster: "Tips", published: "2026-05-10" },
    { id: 5, title: "Perbedaan Ilmu Pengetahuan dan Pseudosains", views: 124_000, engagement: 9.8, viralProb: 0.65, tier: "Mid", cluster: "Edukasi", published: "2026-05-08" },
  ],
  komedi: [
    { id: 1, title: "Ekspektasi vs Realita Kerja dari Rumah", views: 1_840_000, engagement: 15.6, viralProb: 0.97, tier: "Top", cluster: "Viral", published: "2026-05-19" },
    { id: 2, title: "Kalau Dosen Ngajar Pakai Cara Ini...", views: 920_000, engagement: 14.2, viralProb: 0.93, tier: "Top", cluster: "Situasi", published: "2026-05-17" },
    { id: 3, title: "Tipe-Tipe Teman yang Ada di Setiap Grup", views: 684_000, engagement: 13.8, viralProb: 0.88, tier: "Top", cluster: "Relatable", published: "2026-05-14" },
    { id: 4, title: "Ketika Orang Tua Baru Kenal Teknologi", views: 412_000, engagement: 16.1, viralProb: 0.84, tier: "High", cluster: "Situasi", published: "2026-05-11" },
    { id: 5, title: "Isi Kulkas Sebelum vs Sesudah Gajian", views: 298_000, engagement: 12.4, viralProb: 0.79, tier: "High", cluster: "Relatable", published: "2026-05-09" },
    { id: 6, title: "Drama Pesen Makanan Online yang Selalu Terjadi", views: 215_000, engagement: 11.8, viralProb: 0.74, tier: "High", cluster: "Situasi", published: "2026-05-07" },
  ],
  kuliner: [
    { id: 1, title: "Resep Nasi Goreng Spesial 5 Menit Ala Restoran", views: 924_000, engagement: 13.4, viralProb: 0.92, tier: "Top", cluster: "Resep", published: "2026-05-20" },
    { id: 2, title: "ASMR Masak Soto Ayam Tradisional", views: 684_000, engagement: 16.8, viralProb: 0.87, tier: "Top", cluster: "ASMR", published: "2026-05-16" },
    { id: 3, title: "Review Jujur Makanan Viral TikTok 2026", views: 512_000, engagement: 14.2, viralProb: 0.84, tier: "Top", cluster: "Review", published: "2026-05-13" },
    { id: 4, title: "Cara Bikin Kue Tanpa Oven yang Enak Banget", views: 368_000, engagement: 12.1, viralProb: 0.78, tier: "High", cluster: "Tutorial", published: "2026-05-10" },
    { id: 5, title: "10 Makanan Indonesia yang Wajib Dicoba Sebelum Mati", views: 284_000, engagement: 11.8, viralProb: 0.72, tier: "High", cluster: "List", published: "2026-05-07" },
    { id: 6, title: "Street Food Jakarta Paling Enak di Bawah 20ribu", views: 198_000, engagement: 10.4, viralProb: 0.67, tier: "Mid", cluster: "Review", published: "2026-05-05" },
  ],
  lifestyle: [
    { id: 1, title: "Transformasi Kamar 2x2m Jadi Aesthetic — Before/After", views: 584_000, engagement: 12.8, viralProb: 0.88, tier: "Top", cluster: "Before-After", published: "2026-05-17" },
    { id: 2, title: "Morning Routine Produktif yang Bisa Kamu Coba", views: 412_000, engagement: 11.4, viralProb: 0.81, tier: "Top", cluster: "Routine", published: "2026-05-14" },
    { id: 3, title: "Dekorasi Rumah Budget 500ribu — Hasilnya Keren!", views: 312_000, engagement: 13.2, viralProb: 0.76, tier: "High", cluster: "Budget DIY", published: "2026-05-11" },
    { id: 4, title: "Plant Tour Koleksi 50+ Tanaman Hias di Rumah", views: 228_000, engagement: 10.8, viralProb: 0.71, tier: "High", cluster: "Showcase", published: "2026-05-08" },
    { id: 5, title: "Tips Rumah Selalu Bersih Meski Sibuk Kerja", views: 184_000, engagement: 9.6, viralProb: 0.64, tier: "Mid", cluster: "Tips", published: "2026-05-06" },
  ],
  teknologi: [
    { id: 1, title: "Review Samsung Galaxy S25 Ultra — Worth It?", views: 412_000, engagement: 11.2, viralProb: 0.84, tier: "Top", cluster: "Review", published: "2026-05-18" },
    { id: 2, title: "Laptop Budget 5jt Terbaik 2026 — Perbandingan Lengkap", views: 284_000, engagement: 10.8, viralProb: 0.79, tier: "Top", cluster: "Komparasi", published: "2026-05-15" },
    { id: 3, title: "Fitur Tersembunyi iPhone yang Jarang Diketahui", views: 198_000, engagement: 12.4, viralProb: 0.74, tier: "High", cluster: "Tips", published: "2026-05-12" },
    { id: 4, title: "Setup PC Gaming 10jt — Rakit Sendiri vs Pre-built", views: 156_000, engagement: 9.8, viralProb: 0.69, tier: "High", cluster: "Komparasi", published: "2026-05-09" },
    { id: 5, title: "AI Tools Gratis yang Bikin Produktivitas 10x Lipat", views: 124_000, engagement: 11.6, viralProb: 0.63, tier: "Mid", cluster: "Tips", published: "2026-05-07" },
    { id: 6, title: "Unboxing & Review TWS Murah yang Suaranya Bagus", views: 98_000, engagement: 8.4, viralProb: 0.57, tier: "Mid", cluster: "Review", published: "2026-05-04" },
  ],
};

export const TIER_META: Record<VideoTier, TierMeta> = {
  Top: { solid: "#b45309", tint: "rgba(180,83,9,0.08)", dots: 4 },
  High: { solid: "#047857", tint: "rgba(4,120,87,0.08)", dots: 3 },
  Mid: { solid: "#0369a1", tint: "rgba(3,105,161,0.08)", dots: 2 },
  Low: { solid: "#737373", tint: "rgba(115,115,115,0.08)", dots: 1 },
};

export const PERIOD_LABELS: Record<PeriodKey, string> = {
  "7": "Mingguan",
  "30": "Bulanan",
};

/** 30-day mock trend timeseries. Generated once at module load. */
export const TREND_DATA: TrendPoint[] = (() => {
  const base = new Date("2026-05-21");
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() - (29 - i));
    const label = `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}`;
    const trend = 1 + i * 0.016 + Math.sin(i * 0.4) * 0.05;
    return {
      date: label,
      views: Math.round((280_000 + Math.random() * 140_000) * trend),
      engagement: +(9.4 + Math.random() * 4.8 + i * 0.035).toFixed(1),
      viralProb: +(0.46 + Math.random() * 0.26 + i * 0.004).toFixed(2),
    };
  });
})();
