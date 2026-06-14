"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Language = "id" | "en";

export const translations = {
  id: {
    // Navigation
    dashboard: "Dasbor",
    analytics: "Analitik Akun",
    account_competitor_analysis: "Analisis Akun & Kompetitor",
    hashtag: "Rekomendasi Tagar",
    keyword: "Analisis Kata Kunci",
    timeposting: "Waktu Posting",
    settings: "Pengaturan",
    profile: "Profil Pengguna",
    logout: "Keluar",
    export: "Ekspor Laporan",
    ml_predict: "Prediksi ML",
    nlp_insight: "Ringkasan NLP",
    video_library: "Galeri Video",
    
    // Dashboard metrics
    total_views: "Total Tayangan",
    total_videos: "Total Video",
    engagement_rate: "Rasio Keterlibatan",
    viral_score: "Skor Viral",
    estimated_revenue: "Estimasi Pendapatan",
    best_category: "Kategori Terbaik",
    
    // Headers
    performance_overview: "Ikhtisar Performa",
    category_insight: "Insight Kategori",
    top_videos: "Video Teratas",
    nlp_insights: "Analisis NLP & Ringkasan Otomatis",
    
    // Settings
    language: "Bahasa",
    theme: "Tema",
    dark: "Gelap",
    light: "Terang",
    system: "Sistem",
    default_category: "Kategori Default",
    default_page: "Halaman Utama Default",
    save_settings: "Simpan Pengaturan",
    settings_saved: "Pengaturan berhasil disimpan!",
    settings_error: "Gagal menyimpan pengaturan",
    
    // Onboarding Dashboard
    welcome_title: "Selamat Datang di TikTrend BI!",
    welcome_desc: "Mari tur singkat untuk melihat bagaimana dashboard ini membantu memantau performa akun TikTok Anda.",
    next: "Selanjutnya",
    back: "Kembali",
    skip: "Lewati",
    finish: "Selesai",
    step_sidebar: "Gunakan menu sidebar ini untuk menjelajahi berbagai modul analitik, rekomendasi hashtag, dan prediksi ML.",
    step_metrics: "Ini adalah metrik utama akun Anda seperti total tayangan, rasio keterlibatan, dan skor viral.",
    step_category: "Bandingkan performa video, tayangan, dan estimasi pendapatan Anda di 5 kategori utama secara berdampingan.",
    step_chart: "Di sini Anda bisa memantau tren performa konten Anda secara grafis dan membandingkannya dari waktu ke waktu.",
    step_combination: "Gabungkan dua kategori berbeda untuk memprediksi kecocokan konten dan mendapatkan insight analisis silang.",

    // Onboarding Analytics
    tour_analytics_welcome_title: "Selamat Datang di Analitik!",
    tour_analytics_welcome_desc: "Mari jelajahi halaman Analitik untuk melihat data performa historis dan rekomendasi jadwal posting.",
    tour_analytics_kpi: "KPI Summary",
    tour_analytics_kpi_desc: "Tinjau ringkasan metrik performa utama akun Anda secara kumulatif.",
    tour_analytics_historical: "Historical Trends",
    tour_analytics_historical_desc: "Pantau pergerakan harian metrik akun Anda dan bandingkan beberapa metrik sekaligus secara grafis.",
    tour_analytics_performance: "Tabel Performa Konten",
    tour_analytics_performance_desc: "Daftar detail performa setiap video TikTok Anda yang dipadukan dengan prediksi viral dan klaster dari ML.",
    tour_analytics_schedule: "Jadwal Posting Optimal",
    tour_analytics_schedule_desc: "Lihat rekomendasi 5 slot waktu posting terbaik berdasarkan tingkat keterlibatan historis akun Anda.",
    tour_analytics_recs: "Rekomendasi Konten",
    tour_analytics_recs_desc: "Rekomendasi topik dan format konten berikutnya untuk meningkatkan rasio keterlibatan akun Anda.",

    // Onboarding ML Predictions
    tour_ml_welcome_title: "Selamat Datang di Prediksi ML!",
    tour_ml_welcome_desc: "Mari tinjau hasil prediksi kecenderungan viral, klasterisasi K-Means, dan registri model ML.",
    tour_ml_summary: "Ringkasan Prediksi",
    tour_ml_summary_desc: "Metrik ringkasan dari semua prediksi model ML, termasuk tingkat rata-rata akurasi dan keyakinan.",
    tour_ml_status: "Status Inferensi",
    tour_ml_status_desc: "Status dan riwayat pemicuan proses inferensi model ML (manual maupun otomatis via Airflow).",
    tour_ml_clusters: "Klaster Konten (K-Means)",
    tour_ml_clusters_desc: "Hasil pengelompokan video berdasarkan kesamaan semantik teks caption menggunakan model K-Means.",
    tour_ml_predictions: "Tabel Prediksi",
    tour_ml_predictions_desc: "Daftar hasil analisis prediksi probabilitas viral, tier keterlibatan, dan detail klaster video.",
    tour_ml_registry: "Model Registry",
    tour_ml_registry_desc: "Metadata dari semua versi model ML yang terdaftar di dalam sistem beserta metrik akurasinya.",

    // Onboarding NLP Insights
    tour_nlp_welcome_title: "Selamat Datang di Ringkasan NLP!",
    tour_nlp_welcome_desc: "Mari tinjau hasil ringkasan teks otomatis Bert2Bert dan analisis kata kunci dari teks video.",
    tour_nlp_toolbar: "Toolbar NLP",
    tour_nlp_toolbar_desc: "Gunakan tombol ini untuk memicu pembuatan ringkasan teks otomatis baru secara real-time.",
    tour_nlp_metrics: "Metrik Sentimen & NLP",
    tour_nlp_metrics_desc: "Statistik dasar mengenai volume kata, rasio sentimen komentar, dan tingkat keterbacaan teks.",
    tour_nlp_summary: "Ringkasan Mingguan AI",
    tour_nlp_summary_desc: "Laporan narasi performa akun Anda yang dirangkum secara otomatis oleh model NLP Bert2Bert.",
    tour_nlp_insights: "Actionable Key Insights",
    tour_nlp_insights_desc: "Rekomendasi taktis hasil analisis NLP untuk mengoptimalkan gaya penulisan caption video Anda.",
    tour_nlp_cloud: "Kata Kunci & Tagar Cloud",
    tour_nlp_cloud_desc: "Visualisasi kata kunci dominan dan daftar tagar terpopuler yang sering digunakan pada video berkinerja tinggi.",
    tour_nlp_sentiment: "Sentimen & Distribusi Video",
    tour_nlp_sentiment_desc: "Distribusi sentimen penonton (positif, netral, negatif) beserta daftar video berkinerja terbaik.",

    // Onboarding Hashtag
    tour_hashtag_welcome_title: "Selamat Datang di Analisis Tagar!",
    tour_hashtag_welcome_desc: "Jelajahi performa tagar, tren pertumbuhan, dan video terkait untuk mendominasi FYP.",
    tour_hashtag_kpi: "Metrik Global Tagar",
    tour_hashtag_kpi_desc: "Tinjau total tagar yang terdeteksi, rata-rata rasio tayangan, dan skor viralitas tagar.",
    tour_hashtag_categories: "Pemilih Kategori",
    tour_hashtag_categories_desc: "Pilih kategori konten untuk memfilter tagar yang paling relevan dengan jenis video Anda.",
    tour_hashtag_top: "Top 10 Tagar",
    tour_hashtag_top_desc: "Daftar 10 tagar terbaik dengan performa tertinggi beserta visualisasi pergerakan trennya.",
    tour_hashtag_cross: "Analisis Silang Kategori",
    tour_hashtag_cross_desc: "Bandingkan statistik tagar yang sama saat digunakan pada kategori video yang berbeda.",
    tour_hashtag_hot: "Semua Hot Tags",
    tour_hashtag_hot_desc: "Kumpulan tagar-tagar populer saat ini secara global yang bisa langsung Anda gunakan.",

    // Onboarding Keyword
    tour_keyword_welcome_title: "Selamat Datang di Analisis Kata Kunci!",
    tour_keyword_welcome_desc: "Temukan kata kunci terbaik dan struktur caption hook yang menghasilkan konversi interaksi tertinggi.",
    tour_keyword_categories: "Pemilih Kategori Kata Kunci",
    tour_keyword_categories_desc: "Sarin analisis kata kunci berdasarkan kategori industri atau konten tertentu.",
    tour_keyword_kpi: "Ringkasan Performa Kata Kunci",
    tour_keyword_kpi_desc: "Tinjau kata kunci utama yang dominan, rata-rata rasio interaksi, serta total video terkait.",
    tour_keyword_charts_row1: "Korelasi Frekuensi & Interaksi",
    tour_keyword_charts_row1_desc: "Analisis seberapa sering suatu kata kunci digunakan vs tingkat tayangan yang dihasilkannya.",
    tour_keyword_charts_row2: "Karakteristik & Distribusi Kata Kunci",
    tour_keyword_charts_row2_desc: "Grafik distribusi jenis kata kunci (hook, deskriptif, CTA) dan performa interaksinya.",
    tour_keyword_table: "Tabel Detail Kata Kunci",
    tour_keyword_table_desc: "Daftar lengkap 50 kata kunci terbaik yang diurutkan berdasarkan performa penayangan.",

    // Onboarding Timeposting
    tour_timeposting_welcome_title: "Selamat Datang di Waktu Posting!",
    tour_timeposting_welcome_desc: "Temukan hari dan jam paling optimal untuk mengunggah video Anda guna memaksimalkan engagement.",
    tour_timeposting_filter: "Filter Kategori Waktu",
    tour_timeposting_filter_desc: "Saring data rekomendasi waktu berdasarkan kategori konten Anda.",
    tour_timeposting_heatmap: "Heatmap Interaksi Waktu",
    tour_timeposting_heatmap_desc: "Peta panas interaktif yang menunjukkan kepadatan tingkat interaksi penonton per jam dan hari.",
    tour_timeposting_optimization: "Slot Waktu Terbaik",
    tour_timeposting_optimization_desc: "Rekomendasi 5 slot waktu posting terbaik hasil perhitungan algoritma sistem BI.",
    tour_timeposting_table: "Detail Performa Jam",
    tour_timeposting_table_desc: "Tabel rincian performa views dan engagement rate per jam kerja maupun akhir pekan.",
    tour_timeposting_videos: "Video Terkait Slot Waktu",
    tour_timeposting_videos_desc: "Daftar video yang diunggah pada waktu terdekat dari slot waktu optimal tersebut.",

    // Onboarding Account Management
    tour_account_welcome_title: "Selamat Datang di Manajemen Akun!",
    tour_account_welcome_desc: "Kelola akun TikTok Anda sendiri dan pantau akun kompetitor/inspirasi dalam satu dasbor terpadu.",
    tour_account_kpis: "Ringkasan Akun",
    tour_account_kpis_desc: "Statistik kumulatif akun yang dilacak, rasio keterlibatan rata-rata, dan total pengikut.",
    tour_account_list: "Daftar Akun Terpantau",
    tour_account_list_desc: "Kartu profil akun yang dipantau lengkap dengan grafik tren pertumbuhan pengikut harian.",
    tour_account_benchmarking: "Analisis Komparasi (Benchmarking)",
    tour_account_benchmarking_desc: "Grafik perbandingan pertumbuhan pengikut secara langsung antara akun Anda dengan kompetitor.",

    // Onboarding Video Library
    tour_video_welcome_title: "Selamat Datang di Galeri Video!",
    tour_video_welcome_desc: "Telusuri, cari, dan lakukan komparasi performa semua konten video TikTok Anda.",
    tour_video_kpis: "Metrik Galeri Video",
    tour_video_kpis_desc: "Akumulasi total tayangan video, rata-rata engagement rate, dan jumlah video trending.",
    tour_video_list: "Daftar Koleksi Video",
    tour_video_list_desc: "Daftar video lengkap dengan status (Trending/Top/Reguler) dan tombol komparasi multisel.",
    tour_video_compare: "Fitur Komparasi Video",
    tour_video_compare_desc: "Pilih hingga 4 video untuk membandingkan performa pertumbuhan views harian secara berdampingan.",

    // Onboarding Export
    tour_export_welcome_title: "Selamat Datang di Ekspor Laporan!",
    tour_export_welcome_desc: "Unduh file dataset analytics Anda dalam format Excel (.xlsx) atau CSV secara mudah.",
    tour_export_summary: "Status Ringkasan Laporan",
    tour_export_summary_desc: "Tinjau jumlah file laporan yang siap diunduh, kedaluwarsa, atau belum dibuat.",
    tour_export_datasets: "Opsi Dataset Kategori",
    tour_export_datasets_desc: "Pilih modul laporan data spesifik (contoh: NLP, Trend, ML) lalu unduh jenis format yang diiginkan.",
    tour_export_bulk: "Unduh Sekaligus (Bulk Download)",
    tour_export_bulk_desc: "Unduh semua laporan secara bersamaan dalam format file arsip (.zip) sekali klik.",
    tour_export_history: "Riwayat Unduhan Laporan",
    tour_export_history_desc: "Daftar log riwayat file laporan yang pernah diunduh beserta nama pengguna dan tanggal ekspor.",
  },
  en: {
    // Navigation
    dashboard: "Dashboard",
    analytics: "Account Analytics",
    account_competitor_analysis: "Account & Competitor Analysis",
    hashtag: "Hashtag Recommendation",
    keyword: "Keyword Analysis",
    timeposting: "Best Time to Post",
    settings: "Settings",
    profile: "User Profile",
    logout: "Log Out",
    export: "Export Reports",
    ml_predict: "ML Prediction",
    nlp_insight: "NLP Summary",
    video_library: "Video Library",
    
    // Dashboard metrics
    total_views: "Total Views",
    total_videos: "Total Videos",
    engagement_rate: "Engagement Rate",
    viral_score: "Viral Score",
    estimated_revenue: "Estimated Revenue",
    best_category: "Best Category",
    
    // Headers
    performance_overview: "Performance Overview",
    category_insight: "Category Insight",
    top_videos: "Top Videos",
    nlp_insights: "NLP Insights & Auto Summary",
    
    // Settings
    language: "Language",
    theme: "Theme",
    dark: "Dark",
    light: "Light",
    system: "System",
    default_category: "Default Category",
    default_page: "Default Landing Page",
    save_settings: "Save Settings",
    settings_saved: "Settings saved successfully!",
    settings_error: "Failed to save settings",
    
    // Onboarding Dashboard
    welcome_title: "Welcome to TikTrend BI!",
    welcome_desc: "Let's take a quick tour to see how this dashboard helps monitor your TikTok performance.",
    next: "Next",
    back: "Back",
    skip: "Skip",
    finish: "Finish",
    step_sidebar: "Use this sidebar menu to navigate through different analytics modules, hashtag suggestions, and ML predictions.",
    step_metrics: "These are your core account metrics, including total views, engagement rate, and viral scores.",
    step_category: "Compare video count, views, and estimated revenue across 5 core categories side by side.",
    step_chart: "Here you can monitor your content performance trends graphically and compare them over time.",
    step_combination: "Combine two different content categories to forecast compatibility and generate cross-analysis insights.",

    // Onboarding Analytics
    tour_analytics_welcome_title: "Welcome to Analytics!",
    tour_analytics_welcome_desc: "Let's explore the Analytics page to view historical performance data and posting schedule recommendations.",
    tour_analytics_kpi: "KPI Summary",
    tour_analytics_kpi_desc: "Review the summary of your account's core performance metrics cumulatively.",
    tour_analytics_historical: "Historical Trends",
    tour_analytics_historical_desc: "Monitor the daily movement of your account metrics and compare multiple metrics graphically.",
    tour_analytics_performance: "Content Performance Table",
    tour_analytics_performance_desc: "Detailed list of each of your TikTok videos' performance merged with ML viral and cluster predictions.",
    tour_analytics_schedule: "Optimal Schedule",
    tour_analytics_schedule_desc: "View the top 5 recommended posting time slots based on your account's historical engagement levels.",
    tour_analytics_recs: "Content Recommendations",
    tour_analytics_recs_desc: "Topic and format recommendations for your next content to boost your account's engagement rate.",

    // Onboarding ML Predictions
    tour_ml_welcome_title: "Welcome to ML Predictions!",
    tour_ml_welcome_desc: "Let's review the predictions for viral probability, K-Means clustering, and the ML model registry.",
    tour_ml_summary: "Prediction Summary",
    tour_ml_summary_desc: "Summary metrics of all ML model predictions, including average accuracy and confidence levels.",
    tour_ml_status: "Inference Status",
    tour_ml_status_desc: "Status and history of ML model inference execution (manual or automatic via Airflow).",
    tour_ml_clusters: "Content Clusters (K-Means)",
    tour_ml_clusters_desc: "Video grouping results based on caption text semantic similarity using the K-Means model.",
    tour_ml_predictions: "Predictions Table",
    tour_ml_predictions_desc: "Detailed predictions table displaying viral probability, engagement tier, and cluster data.",
    tour_ml_registry: "Model Registry",
    tour_ml_registry_desc: "Metadata of all ML model versions registered in the system along with their accuracy metrics.",

    // Onboarding NLP Insights
    tour_nlp_welcome_title: "Welcome to NLP Insights!",
    tour_nlp_welcome_desc: "Let's review the automated Bert2Bert text summaries and keyword analysis from video text.",
    tour_nlp_toolbar: "NLP Control Toolbar",
    tour_nlp_toolbar_desc: "Use this button to trigger new automated text summary generation in real-time.",
    tour_nlp_metrics: "Sentiment & NLP Metrics",
    tour_nlp_metrics_desc: "Core stats regarding word volume, comment sentiment ratio, and readability levels.",
    tour_nlp_summary: "AI Generated Weekly Summary",
    tour_nlp_summary_desc: "Narrative performance report of your account automatically summarized by the Bert2Bert NLP model.",
    tour_nlp_insights: "Actionable Key Insights",
    tour_nlp_insights_desc: "Tactical recommendations derived from NLP analysis to optimize your video caption writing style.",
    tour_nlp_cloud: "Keyword & Hashtag Cloud",
    tour_nlp_cloud_desc: "Dominant keyword cloud visualization and list of popular hashtags used in high-performing videos.",
    tour_nlp_sentiment: "Sentiment & Video Breakdown",
    tour_nlp_sentiment_desc: "Audience sentiment distribution (positive, neutral, negative) and the top-performing videos.",

    // Onboarding Hashtag
    tour_hashtag_welcome_title: "Welcome to Hashtag Analytics!",
    tour_hashtag_welcome_desc: "Explore hashtag performance, growth trends, and related videos to dominate the FYP.",
    tour_hashtag_kpi: "Hashtag Global KPIs",
    tour_hashtag_kpi_desc: "Review total detected hashtags, average views ratio, and hashtag virality scores.",
    tour_hashtag_categories: "Category Selector",
    tour_hashtag_categories_desc: "Select a content category to filter the most relevant hashtags for your video type.",
    tour_hashtag_top: "Top 10 Hashtags",
    tour_hashtag_top_desc: "List of the top 10 highest-performing hashtags along with trend visualizations.",
    tour_hashtag_cross: "Cross Category Comparison",
    tour_hashtag_cross_desc: "Compare stats of the same hashtag when used across different video categories.",
    tour_hashtag_hot: "All Hot Tags",
    tour_hashtag_hot_desc: "A collection of currently popular hashtags globally that you can use immediately.",

    // Onboarding Keyword
    tour_keyword_welcome_title: "Welcome to Keyword Analytics!",
    tour_keyword_welcome_desc: "Discover the best keywords and caption hook structures that generate the highest engagement conversion.",
    tour_keyword_categories: "Keyword Category Selector",
    tour_keyword_categories_desc: "Filter keyword analysis by specific industry or content categories.",
    tour_keyword_kpi: "Keyword Performance Summary",
    tour_keyword_kpi_desc: "Review key dominant keywords, average engagement rates, and total related videos.",
    tour_keyword_charts_row1: "Frequency & Engagement Correlation",
    tour_keyword_charts_row1_desc: "Analyze how often a keyword is used versus the view count it generates.",
    tour_keyword_charts_row2: "Keyword Characteristics & Distribution",
    tour_keyword_charts_row2_desc: "Charts showing the distribution of keyword types (hook, descriptive, CTA) and engagement performance.",
    tour_keyword_table: "Keyword Detail Table",
    tour_keyword_table_desc: "Complete list of the top 50 keywords sorted by view performance.",

    // Onboarding Timeposting
    tour_timeposting_welcome_title: "Welcome to Posting Time Analytics!",
    tour_timeposting_welcome_desc: "Find the most optimal days and hours to upload your videos to maximize audience engagement.",
    tour_timeposting_filter: "Time Category Filter",
    tour_timeposting_filter_desc: "Filter posting time recommendation data based on your content category.",
    tour_timeposting_heatmap: "Time Engagement Heatmap",
    tour_timeposting_heatmap_desc: "Interactive heatmap indicating audience engagement density per hour and day.",
    tour_timeposting_optimization: "Best Time Slots",
    tour_timeposting_optimization_desc: "Top 5 recommended posting time slots calculated automatically by the BI system algorithms.",
    tour_timeposting_table: "Hourly Performance Details",
    tour_timeposting_table_desc: "Table detailing views and engagement rates per hour on weekdays or weekends.",
    tour_timeposting_videos: "Time Slot Related Videos",
    tour_timeposting_videos_desc: "List of videos uploaded closest to the optimal posting time slot.",

    // Onboarding Account Management
    tour_account_welcome_title: "Welcome to Account Management!",
    tour_account_welcome_desc: "Manage your own TikTok accounts and track competitor/inspiration accounts in a unified dashboard.",
    tour_account_kpis: "Accounts Summary",
    tour_account_kpis_desc: "Cumulative statistics of tracked accounts, average engagement rate, and total followers.",
    tour_account_list: "Monitored Accounts List",
    tour_account_list_desc: "Monitored account profile cards complete with daily follower growth trend graphs.",
    tour_account_benchmarking: "Competitor Benchmarking",
    tour_account_benchmarking_desc: "Direct follower growth comparison graph between your account and competitors.",

    // Onboarding Video Library
    tour_video_welcome_title: "Welcome to Video Library!",
    tour_video_welcome_desc: "Browse, search, and compare performance across all your TikTok video content.",
    tour_video_kpis: "Video Library Metrics",
    tour_video_kpis_desc: "Accumulated total video views, average engagement rate, and count of trending videos.",
    tour_video_list: "Video Collection List",
    tour_video_list_desc: "Video list featuring status badges (Trending/Top/Regular) and multi-select compare buttons.",
    tour_video_compare: "Video Comparison Feature",
    tour_video_compare_desc: "Select up to 4 videos to compare daily view growth performance side by side.",

    // Onboarding Export
    tour_export_welcome_title: "Welcome to Export Manager!",
    tour_export_welcome_desc: "Easily download your analytics dataset in Excel (.xlsx) or CSV formats.",
    tour_export_summary: "Report Summary Status",
    tour_export_summary_desc: "Review the count of report files that are ready, expired, or not yet generated.",
    tour_export_datasets: "Category Dataset Options",
    tour_export_datasets_desc: "Select a specific report module (e.g. NLP, Trend, ML) and download your preferred format.",
    tour_export_bulk: "Bulk Download Options",
    tour_export_bulk_desc: "Download all report datasets simultaneously in a single zipped archive file.",
    tour_export_history: "Report Download History",
    tour_export_history_desc: "Log table showing previously downloaded reports, requesting user, and export timestamp.",
  }
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");

  useEffect(() => {
    const savedLang = localStorage.getItem("preferred-language") as Language;
    if (savedLang === "id" || savedLang === "en") {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    const sanitizedLang = (lang === "id" || lang === "en") ? lang : "en";
    setLanguageState(sanitizedLang);
    localStorage.setItem("preferred-language", sanitizedLang);
    // Dispatch event to update other parts if necessary
    window.dispatchEvent(new Event("language-change"));
  }, []);

  const t = (key: keyof typeof translations.en): string => {
    const activeLang = (language === "id" || language === "en") ? language : "en";
    return translations[activeLang][key] || translations.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
