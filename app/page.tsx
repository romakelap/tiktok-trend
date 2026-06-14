'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ─── Professional SVG Icon Components ─────────────────────────────
const Icon = {
  TikTok: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
    </svg>
  ),
  Analytics: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  TrendUp: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Target: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  Lightbulb: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  Report: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Rocket: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
  Link: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  Cpu: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H7a2 2 0 00-2 2v2M9 3h6M9 3v2m6-2h2a2 2 0 012 2v2m0 0h2m-2 0v6m0 0h2m-2 0v2a2 2 0 01-2 2h-2m0 0H9m6 0v2m-6-2H7a2 2 0 01-2-2v-2m0 0H3m2 0V9m0 0H3m2 0V7"/>
      <rect x="9" y="9" width="6" height="6" rx="1"/>
    </svg>
  ),
  ChartLine: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4v16" />
    </svg>
  ),
  Eye: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    </svg>
  ),
  Hash: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M9 3l-2 18M17 3l-2 18"/>
    </svg>
  ),
  Key: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
    </svg>
  ),
  Clock: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2"/>
    </svg>
  ),
  Database: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 1.657-4.03 3-9 3S3 13.657 3 12"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5v14c0 1.657 4.03 3 9 3s9-1.343 9-3V5"/>
    </svg>
  ),
  Brain: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 2A2.5 2.5 0 007 4.5v.5H6a3 3 0 000 6h.5v.5a3.5 3.5 0 007 0V11H14a3 3 0 000-6h-.5v-.5A2.5 2.5 0 0011 2h-1.5zM7 14.5a4 4 0 008 0"/>
    </svg>
  ),
  Sparkle: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l1.5 1.5M12 2v2m7-1l-1.5 1.5M3 12H2m20 0h-1M5 21l1.5-1.5M12 20v2m7 1l-1.5-1.5M12 12l2-5 2 5-5-2 5 2z"/>
    </svg>
  ),
  Play: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z"/>
    </svg>
  ),
  ArrowRight: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
    </svg>
  ),
  ChevronRight: ({ className = 'w-3 h-3' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
    </svg>
  ),
  ChevronDown: ({ className = 'w-4 h-4' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
    </svg>
  ),
  Check: ({ className = 'w-3 h-3' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
    </svg>
  ),
  Video: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
    </svg>
  ),
  Users: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  ),
  Bolt: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
    </svg>
  ),
  Shield: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
    </svg>
  ),
  Twitter: ({ className = 'w-4 h-4' }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  LinkedIn: ({ className = 'w-4 h-4' }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  Instagram: ({ className = 'w-4 h-4' }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
  User: ({ className = 'w-6 h-6' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
    </svg>
  ),
  Menu: ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
    </svg>
  ),
};

// ─── Data ─────────────────────────────────────────────────────────
const features = [
  {
    Icon: Icon.Analytics,
    title: 'Global Dashboard',
    desc: 'Perbandingan 5 kategori konten, KPI summary (total video, hashtag, engagement), dan visualisasi tren lintas kategori dalam satu tampilan.',
  },
  {
    Icon: Icon.TrendUp,
    title: 'Analytics & Forecast',
    desc: 'Historical engagement trends, LSTM 7-hari engagement forecast, dan analisis performa konten lengkap dengan ML predictions overlay.',
  },
  {
    Icon: Icon.Target,
    title: 'ML Predictions',
    desc: 'Prediksi viral probability (Random Forest), klasifikasi engagement tier (SVM), dan K-Means content clustering dengan 5 cluster.',
  },
  {
    Icon: Icon.Lightbulb,
    title: 'NLP Insights',
    desc: 'Ringkasan performa konten otomatis berbasis HuggingFace Seq2Seq, analisis sentimen, dan ekstraksi keyword dari caption video.',
  },
  {
    Icon: Icon.Hash,
    title: 'Hashtag Analytics',
    desc: 'Top hashtag trending per kategori, analisis tingkat kompetisi, network graph co-occurrence, dan benchmark lintas kategori.',
  },
  {
    Icon: Icon.Key,
    title: 'Keyword Analysis',
    desc: 'Ekstraksi keyword dari caption via NLP, analisis frekuensi vs engagement, distribusi tipe keyword, dan top 50 keyword tabel.',
  },
  {
    Icon: Icon.Clock,
    title: 'Posting Time Optimizer',
    desc: 'Heatmap waktu posting optimal (jam × hari), pola engagement per slot, dan rekomendasi 5 slot terbaik berbasis scoring formula.',
  },
  {
    Icon: Icon.Report,
    title: 'Export & Laporan',
    desc: 'Export dataset video sebagai Excel/CSV, download PDF report ringkasan analitik, dan riwayat unduhan terkelola.',
  },
];

const mlModels = [
  {
    name: 'Random Forest',
    task: 'Viral Prediction',
    desc: 'Memprediksi apakah video akan viral menggunakan 22 fitur numerik — follower count, durasi, hashtag, engagement rate, revenue tier, dll.',
    metric: 'Accuracy ≥ 75%',
    badge: 'Classification',
    popular: false,
  },
  {
    name: 'SVM',
    task: 'Engagement Tier',
    desc: 'Mengklasifikasikan level engagement video ke dalam 4 kelas: Low, Medium, High, dan Viral berdasarkan fitur konten.',
    metric: 'Precision ≥ 70%',
    badge: 'Classification',
    popular: false,
  },
  {
    name: 'K-Means',
    task: 'Content Clustering',
    desc: 'Mengelompokkan video ke dalam 5 cluster berdasarkan kesamaan semantik konten — membantu identifikasi pola konten terkuat.',
    metric: 'Silhouette 0.612',
    badge: 'Clustering',
    popular: true,
  },
  {
    name: 'LSTM',
    task: '7-Day Forecast',
    desc: 'Forecasting engagement 7 hari ke depan (views, likes, comments, shares) dari 14 hari histori menggunakan PyTorch LSTM.',
    metric: 'PyTorch · 2-Layer',
    badge: 'Forecasting',
    popular: false,
  },
  {
    name: 'HuggingFace NLP',
    task: 'Auto Summarization',
    desc: 'Meringkas performa konten dan menghasilkan insight dalam Bahasa Indonesia menggunakan model Seq2Seq Transformer.',
    metric: 'Seq2Seq · mBERT',
    badge: 'NLP',
    popular: false,
  },
];

const usecases = [
  {
    persona: 'Kreator Konten',
    role: 'Individual Creator',
    quote: 'Sebelumnya saya hanya mengandalkan intuisi untuk menentukan hashtag dan waktu posting. Sekarang semua berbasis data aktual dari 10.000+ video.',
    points: ['Prediksi viral probability sebelum upload', 'Rekomendasi hashtag berbasis ML scoring', 'Analisis waktu posting terbaik per kategori', 'Pantau performa vs kompetitor'],
  },
  {
    persona: 'Brand & Bisnis',
    role: 'E-commerce & TikTok Shop',
    quote: 'Dashboard ini membantu kami memahami tren kategori produk dan mengoptimalkan strategi konten TikTok Shop kami secara data-driven.',
    points: ['Analisis tren GMV per kategori konten', 'Monitor engagement kompetitor', 'Insight NLP dari konten top performer', 'Export laporan untuk tim marketing'],
  },
  {
    persona: 'Peneliti & Akademisi',
    role: 'Studi Kasus & TA',
    quote: 'Sistem ini menggabungkan CRISP-DM framework dengan pipeline ML end-to-end — dari collection, ingestion, hingga dashboard visualisasi.',
    points: ['Pipeline Airflow otomatis setiap 12 jam', '5 algoritma ML terintegrasi penuh', 'Arsitektur microservice yang terdokumentasi', 'Database MySQL dengan 20+ tabel terstruktur'],
  },
];

const faqs = [
  {
    q: 'Dari mana data TikTok dikumpulkan?',
    a: 'Data dikumpulkan otomatis dari Echotik API (echotik.live) — platform analytics TikTok pihak ketiga. Apache Airflow DAG berjalan setiap 12 jam mengambil data dari 3 endpoint: video library, hashtag leaderboard, dan video selling dengan pagination 14 halaman × 30 record per endpoint.',
  },
  {
    q: 'Model Machine Learning apa yang digunakan?',
    a: 'Sistem menggunakan 5 model ML: Random Forest untuk prediksi viralitas (binary classification), SVM untuk klasifikasi engagement tier (4 kelas), K-Means untuk content clustering (K=5), LSTM PyTorch untuk engagement forecasting 7 hari, dan HuggingFace Seq2Seq untuk NLP summarization dalam Bahasa Indonesia.',
  },
  {
    q: 'Berapa banyak kategori konten yang didukung?',
    a: 'Sistem mendukung 29 kategori konten TikTok yang diklasifikasikan otomatis menggunakan ML Category Classifier berbasis TF-IDF + pipeline sklearn. Dashboard fokus pada 5 kategori utama: Edukasi, Komedi, Kuliner, Lifestyle & Home, dan Teknologi untuk studi kasus @podomorogarden.',
  },
  {
    q: 'Apakah data diperbarui secara real-time?',
    a: 'Data diperbarui setiap 12 jam melalui pipeline Airflow otomatis (DAG 1 → DAG 2 → DAG 3). Untuk analitik instan, pengguna dapat men-trigger ML inference secara manual dari halaman ML Predictions kapan saja. Dashboard juga mendukung filter periode dan akun secara dinamis.',
  },
];

const stats = [
  { value: '1,042+', label: 'Videos Analyzed',    Icon: Icon.Video },
  { value: '5',      label: 'ML Models Deployed', Icon: Icon.Brain },
  { value: '29',     label: 'Content Categories', Icon: Icon.Target },
  { value: '12h',    label: 'Data Refresh Cycle', Icon: Icon.Bolt },
];

const steps = [
  {
    step: '01',
    title: 'Kumpulkan Data',
    desc: 'Apache Airflow DAG otomatis fetch data dari Echotik API — video library, hashtag leaderboard, dan selling data — setiap 12 jam. Disimpan ke JSON dan Excel.',
    Icon: Icon.Link,
  },
  {
    step: '02',
    title: 'Proses & Ingest',
    desc: 'Data divalidasi, dikategorikan oleh ML classifier, lalu di-UPSERT ke MySQL secara atomic. BI summary table di-refresh otomatis setelah setiap ingestion.',
    Icon: Icon.Database,
  },
  {
    step: '03',
    title: 'Analisis & Prediksi',
    desc: '5 model ML berjalan: Random Forest, SVM, K-Means, LSTM forecasting 7 hari, dan NLP summarization. Hasil disimpan ke tabel ml_predictions dan recommendations.',
    Icon: Icon.Brain,
  },
  {
    step: '04',
    title: 'Insight & Rekomendasi',
    desc: 'Dashboard Spring Boot + Next.js menampilkan prediksi viralitas, rekomendasi hashtag & waktu posting, forecast engagement, dan ringkasan NLP per akun.',
    Icon: Icon.ChartLine,
  },
];

const menuItems = ['Fitur', 'Cara Kerja', 'ML Pipeline', 'FAQ'];
const menuAnchors: Record<string, string> = {
  'Fitur': 'features',
  'Cara Kerja': 'how-it-works',
  'ML Pipeline': 'ml-pipeline',
  'FAQ': 'faq',
};

// ─── Component ────────────────────────────────────────────────────
export default function LandingPage() {
  const [mounted,   setMounted]   = useState(false);
  const [activeTab, setActiveTab] = useState(-1);
  const [mouse,     setMouse]     = useState({ x: 0, y: 0 });
  const [scrollY,   setScrollY]   = useState(0);

  useEffect(() => {
    setMounted(true);
    const onMouseMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    const onScroll    = () => setScrollY(window.scrollY);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll',    onScroll);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll',    onScroll);
    };
  }, []);

  const navScrolled = scrollY > 10;

  return (
    <div className="min-h-screen w-full" style={{ background: '#ffffff', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── NAVIGATION ─────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backdropFilter:       navScrolled ? 'blur(24px) saturate(180%)' : 'none',
          WebkitBackdropFilter: navScrolled ? 'blur(24px) saturate(180%)' : 'none',
          background:   navScrolled ? 'rgba(255,255,255,0.72)' : 'transparent',
          borderBottom: navScrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid transparent',
          boxShadow:    navScrolled ? '0 4px 32px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div className="flex items-center justify-between px-6 lg:px-16 py-4">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{ background: '#000', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}
            >
              <Icon.TikTok className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tight" style={{ color: '#000' }}>TikAnalytics</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {menuItems.map((item, i) => (
              <a
                key={i}
                href={`#${menuAnchors[item]}`}
                className="text-sm font-semibold relative group transition-colors duration-300"
                style={{ color: '#555' }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold hidden sm:block transition-opacity hover:opacity-60" style={{ color: '#333' }}>
              Sign In
            </Link>
            <Link
              href="/signup"
              className="relative px-6 py-2.5 rounded-xl text-white text-sm font-black overflow-hidden group transition-all hover:scale-105"
              style={{ background: '#000', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-all duration-300 rounded-xl" />
              <span className="relative z-10">Get Started</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden pt-20"
        style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f7f7f7 60%, #efefef 100%)' }}
      >
        {/* Grid bg */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.07) 1px,transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle,rgba(0,0,0,0.18) 1.2px,transparent 1.2px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%,transparent 30%,rgba(245,245,245,0.85) 100%)',
        }} />

        {/* Floating decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-[600px] h-[600px] rounded-full blur-3xl transition-all duration-1000"
            style={{ background: 'radial-gradient(circle,rgba(0,0,0,0.06) 0%,transparent 70%)', left: `${-80 + mouse.x * 0.012}px`, top: `${-100 + mouse.y * 0.012}px` }}
          />
          <div
            className="absolute w-[450px] h-[450px] rounded-full blur-3xl transition-all duration-1000"
            style={{ background: 'radial-gradient(circle,rgba(0,0,0,0.05) 0%,transparent 70%)', right: `${-60 + mouse.x * 0.008}px`, top: `${80 + mouse.y * 0.008}px` }}
          />
          <svg
            className="absolute top-24 right-24 opacity-10 transition-all duration-1000"
            style={{ transform: `translate(${mouse.x * 0.008}px,${mouse.y * 0.008}px)` }}
            width="180" height="180" viewBox="0 0 180 180" fill="none"
          >
            <circle cx="90" cy="90" r="80" stroke="black" strokeWidth="1" strokeDasharray="8 6"/>
            <circle cx="90" cy="90" r="55" stroke="black" strokeWidth="1" strokeDasharray="4 8"/>
            <circle cx="90" cy="90" r="30" stroke="black" strokeWidth="1.5"/>
          </svg>
          {[
            { x:'15%', y:'20%', size:16, delay:'0s',   opacity:0.15 },
            { x:'82%', y:'15%', size:12, delay:'0.8s', opacity:0.12 },
            { x:'70%', y:'75%', size:20, delay:'1.2s', opacity:0.10 },
            { x:'8%',  y:'65%', size:14, delay:'0.4s', opacity:0.13 },
            { x:'92%', y:'50%', size:18, delay:'2s',   opacity:0.08 },
          ].map((s, i) => (
            <div key={i} className="absolute" style={{ left: s.x, top: s.y, opacity: s.opacity, animation: `sparkFloat 4s ease-in-out infinite ${s.delay}` }}>
              <svg width={s.size} height={s.size} viewBox="0 0 20 20" fill="none">
                <path d="M10 0 L10 20 M0 10 L20 10" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M3 3 L17 17 M17 3 L3 17" stroke="black" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
              </svg>
            </div>
          ))}
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-6 lg:px-16 py-20 lg:py-28 gap-16">

          {/* Left copy */}
          <div className={`flex-1 max-w-xl transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 cursor-pointer group"
              style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
            >
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#333' }}>
                Machine Learning · Echotik API · Apache Airflow
              </span>
              <Icon.ChevronRight className="w-3 h-3" />
            </div>

            <h1
              className="text-6xl lg:text-7xl font-black mb-6 leading-[1.02] tracking-tight"
              style={{ color: '#000', fontFamily: "'DM Serif Display', serif" }}
            >
              Analisis Tren<br/>
              <span style={{ fontStyle: 'italic' }}>TikTok</span> Berbasis<br/>
              <span style={{ fontStyle: 'italic', color: '#444' }}>Machine Learning</span>
            </h1>
            <p className="text-lg mb-10 leading-relaxed" style={{ color: '#777' }}>
              Sistem BI yang mengumpulkan data video TikTok via Echotik API, memproses dengan pipeline Airflow, dan menghasilkan prediksi serta rekomendasi konten berbasis 5 algoritma ML.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <Link
                href="/signup"
                className="group relative px-8 py-4 rounded-xl text-white font-black text-base overflow-hidden transition-all hover:scale-[1.03]"
                style={{ background: '#000', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-all duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Mulai Sekarang
                  <Icon.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <a
                href="#how-it-works"
                className="group px-8 py-4 rounded-xl font-black text-base transition-all hover:scale-[1.03] flex items-center justify-center gap-2"
                style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0,0,0,0.12)', color: '#000', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
              >
                <Icon.Play className="w-5 h-5" />
                Lihat Cara Kerja
              </a>
            </div>

            {/* Tech stack badges */}
            <div className="flex items-center gap-3 flex-wrap">
              {['Spring Boot', 'Next.js', 'FastAPI', 'Apache Airflow', 'MySQL'].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.09)', color: '#444' }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Dashboard preview */}
          <div className={`flex-1 flex items-center justify-center relative transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            {/* Background glow that grounds the card group */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.04) 0%, transparent 70%)',
              }}
            />

            {/* Decorative dashed ring behind cards */}
            <svg
              className="absolute opacity-[0.07] pointer-events-none"
              style={{ width: 480, height: 480, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              viewBox="0 0 480 480" fill="none"
            >
              <circle cx="240" cy="240" r="220" stroke="black" strokeWidth="1" strokeDasharray="10 8"/>
              <circle cx="240" cy="240" r="180" stroke="black" strokeWidth="1" strokeDasharray="5 10"/>
            </svg>

            {/* Floating accent badges */}
            {/* Badge: #mukbang trending */}
            <div
              className="absolute z-20 pointer-events-none"
              style={{ top: '8%', left: '-2%', animation: 'float 7s ease-in-out infinite 0.3s' }}
            >
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-black shadow-lg"
                style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0,0,0,0.08)', color: '#111', whiteSpace: 'nowrap' }}
              >
                <span className="w-2 h-2 rounded-full bg-black" />
                #mukbang · Trending
              </div>
            </div>

            {/* Badge: NLP insight ready */}
            <div
              className="absolute z-20 pointer-events-none"
              style={{ top: '14%', right: '0%', animation: 'float 6s ease-in-out infinite 1.1s' }}
            >
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-black shadow-lg"
                style={{ background: '#000', color: '#fff', whiteSpace: 'nowrap' }}
              >
                <Icon.Sparkle className="w-3 h-3" />
                NLP Summary Ready
              </div>
            </div>

            {/* Badge: DAG success */}
            <div
              className="absolute z-20 pointer-events-none"
              style={{ bottom: '18%', left: '-4%', animation: 'float 8s ease-in-out infinite 0.8s' }}
            >
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-black shadow-lg"
                style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0,0,0,0.08)', color: '#111', whiteSpace: 'nowrap' }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: '#047857' }} />
                Airflow DAG · Success
              </div>
            </div>

            {/* Badge: 5 models active */}
            <div
              className="absolute z-20 pointer-events-none"
              style={{ bottom: '10%', right: '-2%', animation: 'float 5s ease-in-out infinite 1.6s' }}
            >
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-black shadow-lg"
                style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0,0,0,0.08)', color: '#111', whiteSpace: 'nowrap' }}
              >
                <Icon.Brain className="w-3 h-3" />
                5 Models Active
              </div>
            </div>

            {/* Cards container */}
            <div className="relative w-full max-w-md mx-auto">

              {/* Main KPI card */}
              <div
                className="relative p-6 rounded-3xl mb-4"
                style={{
                  background: 'rgba(255,255,255,0.82)',
                  backdropFilter: 'blur(32px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 8px 48px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
                  animation: 'float 6s ease-in-out infinite',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#999' }}>
                      Total Views · Kategori Kuliner
                    </p>
                    <p className="text-4xl font-black" style={{ color: '#000' }}>10.3B</p>
                  </div>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.09)' }}
                  >
                    <Icon.Analytics className="w-7 h-7 text-black" />
                  </div>
                </div>

                {/* Mini bar chart */}
                <div className="flex items-end gap-1.5 h-14 mb-3">
                  {[32, 48, 36, 62, 44, 78, 58, 84, 54, 92, 68, 88].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm transition-all duration-300"
                      style={{
                        height: `${h}%`,
                        background: i >= 9 ? 'rgba(0,0,0,0.88)' : i >= 6 ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.07)',
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#aaa' }}>
                    Trend 12 bulan
                  </span>
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)' }}
                  >
                    <Icon.TrendUp className="w-3 h-3 text-black" />
                    <span className="text-xs font-black text-black">+1.14% avg ER</span>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Viral Prediction */}
                <div
                  className="relative p-5 rounded-2xl transition-all duration-500 hover:scale-[1.03]"
                  style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(24px)', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)', animation: 'float 5s ease-in-out infinite 0.5s' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-black">
                    <Icon.Target className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-semibold mb-1 uppercase tracking-widest" style={{ color: '#999' }}>Viral Score</p>
                  <p className="text-3xl font-black mb-1" style={{ color: '#000' }}>82%</p>
                  <p className="text-[11px]" style={{ color: '#aaa' }}>
                    Random Forest · v1.0
                  </p>
                </div>

                {/* ML Cluster */}
                <div
                  className="relative p-5 rounded-2xl transition-all duration-500 hover:scale-[1.03]"
                  style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(24px)', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)', animation: 'float 5s ease-in-out infinite 1s' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-black">
                    <Icon.Brain className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-semibold mb-1 uppercase tracking-widest" style={{ color: '#999' }}>Content Cluster</p>
                  <p className="text-3xl font-black mb-1" style={{ color: '#000' }}>K=5</p>
                  <p className="text-[11px] font-bold" style={{ color: '#aaa' }}>K-Means · 0.612</p>
                </div>

                {/* 7-Day Forecast — inverted */}
                <div
                  className="col-span-2 relative p-5 rounded-2xl flex items-center gap-4 transition-all duration-500 hover:scale-[1.02]"
                  style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', animation: 'float 6s ease-in-out infinite 1.5s' }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    <Icon.ChartLine className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold mb-1 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>7-Day Forecast (LSTM)</p>
                    <p className="text-4xl font-black text-white">+18.4%</p>
                  </div>
                  <div className="text-right">
                    <div
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg mb-1"
                      style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                      <Icon.TrendUp className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-black">Naik</span>
                    </div>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>prediksi minggu ini</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="relative z-10 mx-6 lg:mx-16 mb-0 p-8 rounded-t-3xl"
          style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(32px)', border: '1px solid rgba(0,0,0,0.08)', borderBottom: 'none', boxShadow: '0 -4px 32px rgba(0,0,0,0.06)' }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group cursor-pointer">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 bg-black shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <stat.Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl lg:text-4xl font-black mb-1 transition-transform group-hover:scale-105" style={{ color: '#000' }}>{stat.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#999' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ────────────────────────────────────────────── */}
      <section id="features" className="py-28 px-6 lg:px-16" style={{ background: '#f7f7f7' }}>
        <div className="text-center mb-20">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6"
            style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)' }}
          >
            <span className="font-black text-xs uppercase tracking-widest" style={{ color: '#333' }}>Fitur Sistem</span>
          </div>
          <h2
            className="text-5xl lg:text-7xl font-black mb-6 leading-tight"
            style={{ color: '#000', fontFamily: "'DM Serif Display', serif" }}
          >
            8 Modul Analitik<br/><span style={{ fontStyle: 'italic' }}>Terintegrasi Penuh</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#777' }}>
            Dari pengumpulan data hingga rekomendasi actionable — semua dalam satu platform yang terhubung langsung ke database live.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative p-7 rounded-3xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)' }}
            >
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.10)' }} />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-black transition-all duration-300 group-hover:scale-110">
                  <f.Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-black mb-2" style={{ color: '#000' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#777' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 px-6 lg:px-16 relative overflow-hidden" style={{ background: '#fff' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle,rgba(0,0,0,0.04) 1px,transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div className="relative z-10 text-center mb-20">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6"
            style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)' }}
          >
            <span className="font-black text-xs uppercase tracking-widest" style={{ color: '#333' }}>Cara Kerja</span>
          </div>
          <h2
            className="text-5xl lg:text-7xl font-black mb-6 leading-tight"
            style={{ color: '#000', fontFamily: "'DM Serif Display', serif" }}
          >
            Pipeline<br/><span style={{ fontStyle: 'italic' }}>End-to-End</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#777' }}>
            Dari raw data Echotik API hingga dashboard insight — seluruh proses berjalan otomatis melalui 4 tahap pipeline.
          </p>
        </div>
        <div className="relative z-10 grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((item, i) => (
            <div key={i} className="relative text-center group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-12 left-[calc(50%+48px)] w-[calc(100%-96px)] h-px"
                  style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.15), rgba(0,0,0,0.05))' }}
                />
              )}
              <div className="relative w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-black shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <item.Icon className="w-10 h-10 text-white" />
                <div
                  className="absolute -top-3 -right-3 w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg"
                  style={{ border: '1px solid rgba(0,0,0,0.1)' }}
                >
                  <span className="text-black text-sm font-black">{item.step}</span>
                </div>
              </div>
              <h3 className="text-xl font-black mb-4" style={{ color: '#000' }}>{item.title}</h3>
              <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: '#777' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Architecture callout */}
        <div
          className="relative z-10 mt-20 max-w-4xl mx-auto p-8 rounded-3xl"
          style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Arsitektur Microservice</p>
              <h3 className="text-2xl font-black text-white mb-2">4 Komponen Independen</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Airflow Pipeline · FastAPI ML Service · Spring Boot Backend · Next.js Frontend — semuanya terhubung via MySQL & HTTP API.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-end flex-shrink-0">
              {['Airflow :8085', 'FastAPI :8001', 'Spring Boot :8080', 'Next.js :3000', 'MySQL :3306'].map((svc) => (
                <span
                  key={svc}
                  className="px-3 py-1.5 rounded-lg text-xs font-black"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  {svc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ML PIPELINE ──────────────────────────────────────────── */}
      <section id="ml-pipeline" className="py-28 px-6 lg:px-16" style={{ background: '#f7f7f7' }}>
        <div className="text-center mb-20">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6"
            style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)' }}
          >
            <span className="font-black text-xs uppercase tracking-widest" style={{ color: '#333' }}>ML Pipeline</span>
          </div>
          <h2
            className="text-5xl lg:text-7xl font-black mb-6 leading-tight"
            style={{ color: '#000', fontFamily: "'DM Serif Display', serif" }}
          >
            5 Algoritma<br/><span style={{ fontStyle: 'italic' }}>Machine Learning</span>
          </h2>
          <p className="text-lg" style={{ color: '#777' }}>
            Setiap model memiliki peran spesifik dalam pipeline analitik — dari klasifikasi hingga forecasting.
          </p>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {mlModels.map((model, i) => (
            <div
              key={i}
              className={`group relative p-7 rounded-3xl transition-all duration-500 hover:scale-[1.04] ${model.popular ? 'md:-translate-y-4' : ''}`}
              style={{
                background:     model.popular ? '#000' : 'rgba(255,255,255,0.8)',
                backdropFilter: model.popular ? 'none' : 'blur(20px)',
                border:         model.popular ? '2px solid #000' : '1px solid rgba(0,0,0,0.08)',
                boxShadow:      model.popular ? '0 24px 64px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)',
              }}
            >
              {model.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black text-black uppercase tracking-widest bg-white shadow-lg">
                  Core Model
                </div>
              )}
              <div
                className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-black mb-4"
                style={{
                  background: model.popular ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.07)',
                  color:       model.popular ? 'rgba(255,255,255,0.7)' : '#666',
                }}
              >
                {model.badge}
              </div>
              <h3 className="text-base font-black mb-1" style={{ color: model.popular ? '#fff' : '#000' }}>{model.name}</h3>
              <p className="text-xs font-bold mb-4" style={{ color: model.popular ? 'rgba(255,255,255,0.5)' : '#999' }}>{model.task}</p>
              <p className="text-xs leading-relaxed mb-5" style={{ color: model.popular ? 'rgba(255,255,255,0.65)' : '#666' }}>
                {model.desc}
              </p>
              <div
                className="pt-4 mt-auto"
                style={{ borderTop: `1px solid ${model.popular ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)'}` }}
              >
                <p
                  className="text-[11px] font-black uppercase tracking-wider"
                  style={{ color: model.popular ? 'rgba(255,255,255,0.4)' : '#aaa' }}
                >
                  Target
                </p>
                <p className="text-sm font-black mt-0.5" style={{ color: model.popular ? '#fff' : '#000' }}>
                  {model.metric}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── USE CASES ────────────────────────────────────────────── */}
      <section className="py-28 px-6 lg:px-16" style={{ background: '#fff' }}>
        <div className="text-center mb-20">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6"
            style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)' }}
          >
            <span className="font-black text-xs uppercase tracking-widest" style={{ color: '#333' }}>Use Cases</span>
          </div>
          <h2
            className="text-5xl lg:text-7xl font-black mb-6 leading-tight"
            style={{ color: '#000', fontFamily: "'DM Serif Display', serif" }}
          >
            Siapa yang<br/><span style={{ fontStyle: 'italic' }}>Diuntungkan?</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {usecases.map((uc, i) => (
            <div
              key={i}
              className="group p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02]"
              style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)' }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-black">
                <Icon.User className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#999' }}>{uc.role}</p>
              <h3 className="text-xl font-black mb-4" style={{ color: '#000' }}>{uc.persona}</h3>
              <p className="text-sm italic mb-6 leading-relaxed" style={{ color: '#666' }}>&ldquo;{uc.quote}&rdquo;</p>
              <ul className="space-y-2.5">
                {uc.points.map((point, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(0,0,0,0.07)' }}
                    >
                      <Icon.Check className="w-3 h-3 text-black" />
                    </div>
                    <span className="text-sm" style={{ color: '#555' }}>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section id="faq" className="py-28 px-6 lg:px-16" style={{ background: '#f7f7f7' }}>
        <div className="text-center mb-20">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6"
            style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.1)' }}
          >
            <span className="font-black text-xs uppercase tracking-widest" style={{ color: '#333' }}>FAQ</span>
          </div>
          <h2
            className="text-5xl lg:text-7xl font-black mb-6 leading-tight"
            style={{ color: '#000', fontFamily: "'DM Serif Display', serif" }}
          >
            Pertanyaan<br/><span style={{ fontStyle: 'italic' }}>yang Sering Ditanya</span>
          </h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="p-7 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01]"
              style={{
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(20px)',
                border: activeTab === i ? '1.5px solid rgba(0,0,0,0.3)' : '1px solid rgba(0,0,0,0.07)',
                boxShadow: activeTab === i ? '0 8px 32px rgba(0,0,0,0.1)' : '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
              }}
              onClick={() => setActiveTab(activeTab === i ? -1 : i)}
            >
              <div className="flex justify-between items-center gap-4">
                <h3 className="text-lg font-black" style={{ color: '#000' }}>{faq.q}</h3>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${activeTab === i ? 'bg-black rotate-180' : 'bg-white'}`}
                  style={{ border: '1px solid rgba(0,0,0,0.12)' }}
                >
                  <Icon.ChevronDown className={`w-4 h-4 ${activeTab === i ? 'text-white' : 'text-black'}`} />
                </div>
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${activeTab === i ? 'max-h-60 mt-5' : 'max-h-0'}`}>
                <p className="leading-relaxed" style={{ color: '#666' }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-28 px-6 lg:px-16 relative overflow-hidden" style={{ background: '#000' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.1) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2
            className="text-5xl lg:text-7xl font-black mb-8 leading-tight text-white"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Mulai Analisis<br/><span style={{ fontStyle: 'italic' }}>Tren TikTok Anda</span>
          </h2>
          <p className="text-xl mb-14 max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Daftar dan akses dashboard analitik berbasis ML — dari prediksi viral, hashtag recommendation, hingga NLP insight otomatis.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/signup"
              className="group relative px-10 py-5 rounded-xl font-black text-lg overflow-hidden transition-all hover:scale-105 bg-white text-black"
              style={{ boxShadow: '0 8px 32px rgba(255,255,255,0.18)' }}
            >
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-all duration-300 rounded-xl" />
              <span className="relative z-10">Mulai Sekarang — Gratis</span>
            </Link>
            <Link
              href="/login"
              className="group px-10 py-5 rounded-xl font-black text-lg transition-all hover:scale-105 text-white"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}
            >
              Sudah Punya Akun
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="py-20 px-6 lg:px-16" style={{ background: '#fff', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6 cursor-pointer group">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-black transition-all duration-300 group-hover:scale-110">
                  <Icon.TikTok className="w-6 h-6 text-white" />
                </div>
                <span className="font-black text-2xl tracking-tight" style={{ color: '#000' }}>TikAnalytics</span>
              </div>
              <p className="mb-4 leading-relaxed max-w-sm text-sm" style={{ color: '#777' }}>
                Sistem Web Analisis Tren Video TikTok Berbasis Machine Learning dengan Integrasi Echotik API.
              </p>
              <p className="text-xs font-bold mb-6" style={{ color: '#aaa' }}>
                Tugas Akhir · ITB STIKOM Bali · 2025<br/>
                Nico Revaldo Putra Erdi Ardiansa · 220010001
              </p>
              <div className="flex gap-3">
                {[
                  { SIcon: Icon.Twitter,   label: 'Twitter' },
                  { SIcon: Icon.LinkedIn,  label: 'LinkedIn' },
                  { SIcon: Icon.Instagram, label: 'Instagram' },
                  { SIcon: Icon.TikTok,    label: 'TikTok' },
                ].map(({ SIcon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-black hover:text-white"
                    style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)', color: '#555' }}
                  >
                    <SIcon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            {[
              {
                title: 'Modul Analitik',
                items: ['Global Dashboard', 'Analytics & Forecast', 'ML Predictions', 'NLP Insights', 'Hashtag Analytics', 'Keyword Analysis', 'Posting Time', 'Export & Laporan'],
              },
              {
                title: 'Teknologi',
                items: ['Apache Airflow', 'FastAPI (ML Service)', 'Spring Boot', 'Next.js 15', 'MySQL / JPA'],
              },
              {
                title: 'ML Models',
                items: ['Random Forest', 'SVM Classifier', 'K-Means Clustering', 'LSTM Forecasting', 'HuggingFace NLP'],
              },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-black mb-6 text-sm uppercase tracking-widest" style={{ color: '#000' }}>{col.title}</h4>
                <ul className="space-y-3">
                  {col.items.map((item, j) => (
                    <li key={j}>
                      <span className="text-sm" style={{ color: '#777' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6"
            style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
          >
            <p className="text-sm" style={{ color: '#aaa' }}>© 2025 TikAnalytics · ITB STIKOM Bali. All rights reserved.</p>
            <div className="flex gap-8">
              {['Tentang Sistem', 'Metodologi CRISP-DM', 'Dokumentasi API'].map((item, i) => (
                <a key={i} href="#" className="text-sm transition-opacity hover:opacity-50" style={{ color: '#aaa' }}>{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes sparkFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          33%       { transform: translateY(-8px) rotate(15deg) scale(1.15); }
          66%       { transform: translateY(4px) rotate(-10deg) scale(0.9); }
        }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
