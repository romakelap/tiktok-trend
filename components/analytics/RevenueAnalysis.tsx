"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Video,
  Layers,
  Award,
  Users,
} from "lucide-react";

import { GridBg } from "@/components/layout/GridBg";
import { TOKENS } from "@/lib/design-tokens";
import { fmtRp } from "@/lib/dashboard/formatters";
import { formatNum } from "@/lib/analytics/formatters";

interface CategoryRevenue {
  categoryName: string;
  totalVideos: number;
  totalSales: number;
  totalGmvUsd: number;
  avgGmvPerVideo: number;
}

interface TopEarningVideo {
  echotikVideoId: string;
  titleBrief: string;
  influencer: string;
  latestViews: number;
  latestSales: number;
  latestGmvUsd: number;
  revenueTier: string;
}

interface TopSellingProduct {
  echotikProductId: string;
  productName: string;
  category: string;
  totalSales: number;
  totalGmvUsd: number;
  revenueTier: string;
  videosPromoting: number;
}

interface AccountRevenue {
  uniqueId: string;
  displayName: string;
  followerCountRaw: string;
  followerTier: string;
  totalVideos: number;
  totalViews: number;
  totalSales: number;
  totalGmvUsd: number;
  trackingType: string;
}

interface RevenueAnalysisProps {
  data: {
    categoryBreakdown: CategoryRevenue[];
    topVideos: TopEarningVideo[];
    topProducts: TopSellingProduct[];
    accountSummaries: AccountRevenue[];
  } | null;
  loading: boolean;
}

const BAR_COLORS = [
  "#f43f5e", // Rose-500
  "#0ea5e9", // Sky-500
  "#10b981", // Emerald-500
  "#8b5cf6", // Purple-500
  "#f59e0b", // Amber-500
  "#ec4899", // Pink-500
];

export function RevenueAnalysis({ data, loading }: RevenueAnalysisProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
      </div>
    );
  }

  if (!data || !data.categoryBreakdown || data.categoryBreakdown.length === 0) {
    return (
      <div
        className="p-8 text-center rounded-2xl border"
        style={{
          background: TOKENS.cardSoft,
          borderColor: TOKENS.cardBorder,
        }}
      >
        <p className="text-sm font-bold" style={{ color: TOKENS.textMuted }}>
          Tidak ada data e-commerce yang tersedia untuk pilihan periode/akun ini.
        </p>
      </div>
    );
  }

  const categoryData = data.categoryBreakdown;
  const topVideos = data.topVideos || [];
  const topProducts = data.topProducts || [];
  const accountSummaries = data.accountSummaries || [];

  // Calculate aggregates
  const totalSales = categoryData.reduce((sum, c) => sum + Number(c.totalSales), 0);
  const totalGmvUsd = categoryData.reduce((sum, c) => sum + Number(c.totalGmvUsd), 0);
  const totalVideos = categoryData.reduce((sum, c) => sum + Number(c.totalVideos), 0);
  const avgGmvPerVideoUsd = totalVideos > 0 ? totalGmvUsd / totalVideos : 0;

  const totalGmvIdr = totalGmvUsd * 16000;
  const avgGmvPerVideoIdr = avgGmvPerVideoUsd * 16000;

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="p-3 bg-black/90 text-white rounded-xl border border-white/10 shadow-xl text-xs space-y-1">
          <p className="font-black text-[11px] uppercase tracking-wider">{d.categoryName}</p>
          <p className="text-emerald-400 font-bold">
            GMV: {fmtRp(d.totalGmvUsd * 16000)}
          </p>
          <p className="text-gray-300">
            Sales: <span className="font-bold">{formatNum(d.totalSales)} pcs</span>
          </p>
          <p className="text-gray-300">
            Videos: <span className="font-bold">{formatNum(d.totalVideos)} videos</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Helper to render revenue tier badge
  const renderRevenueTierBadge = (tier: string) => {
    const norm = (tier || "low").toLowerCase().replace("_sales", "");
    let label = "Low";
    let style = {
      background: "rgba(107, 114, 128, 0.08)",
      color: "rgba(107, 114, 128, 0.9)",
      borderColor: "rgba(107, 114, 128, 0.15)",
    };

    if (norm === "no") {
      label = "No Sales";
      style = {
        background: "rgba(239, 68, 68, 0.08)",
        color: "rgb(220, 38, 38)",
        borderColor: "rgba(239, 68, 68, 0.15)",
      };
    } else if (norm === "mid" || norm === "medium") {
      label = "Medium";
      style = {
        background: "rgba(59, 130, 246, 0.08)",
        color: "rgb(37, 99, 235)",
        borderColor: "rgba(59, 130, 246, 0.15)",
      };
    } else if (norm === "high") {
      label = "High";
      style = {
        background: "rgba(245, 158, 11, 0.08)",
        color: "rgb(217, 119, 6)",
        borderColor: "rgba(245, 158, 11, 0.15)",
      };
    } else if (norm === "viral" || norm === "top") {
      label = "Viral";
      style = {
        background: "rgba(244, 63, 94, 0.08)",
        color: "rgb(225, 29, 72)",
        borderColor: "rgba(244, 63, 94, 0.15)",
      };
    }

    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded font-black text-[9px] uppercase border"
        style={style}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* 1. E-Commerce KPI summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Sales */}
        <div
          className="relative p-5 rounded-2xl overflow-hidden"
          style={{
            background: TOKENS.cardSoft,
            border: `1px solid ${TOKENS.cardBorder}`,
            boxShadow: "0 4px 20px rgba(0,0,0,0.01), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          <GridBg theme="light" />
          <div className="relative z-10">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: "rgba(244,63,94,0.08)",
                border: "1.5px solid rgba(244,63,94,0.2)",
              }}
            >
              <ShoppingBag className="w-5 h-5 text-rose-500" strokeWidth={2.2} />
            </div>
            <p className="text-[9.5px] font-black uppercase tracking-[0.14em] mb-1.5" style={{ color: TOKENS.textMuted }}>
              Total Sales Volume
            </p>
            <p className="text-2xl font-black mb-1 leading-none tracking-tight" style={{ color: TOKENS.text }}>
              {formatNum(totalSales)} pcs
            </p>
            <p className="text-[10.5px] font-medium leading-normal" style={{ color: TOKENS.textMuted }}>
              Total produk terjual lewat tautan keranjang
            </p>
          </div>
        </div>

        {/* Card 2: Total GMV */}
        <div
          className="relative p-5 rounded-2xl overflow-hidden"
          style={{
            background: TOKENS.cardSoft,
            border: `1px solid ${TOKENS.cardBorder}`,
            boxShadow: "0 4px 20px rgba(0,0,0,0.01), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          <GridBg theme="light" />
          <div className="relative z-10">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: "rgba(16,185,129,0.08)",
                border: "1.5px solid rgba(16,185,129,0.2)",
              }}
            >
              <DollarSign className="w-5 h-5 text-emerald-500" strokeWidth={2.2} />
            </div>
            <p className="text-[9.5px] font-black uppercase tracking-[0.14em] mb-1.5" style={{ color: TOKENS.textMuted }}>
              Total E-Commerce GMV
            </p>
            <p className="text-2xl font-black mb-1 leading-none tracking-tight text-emerald-600">
              {fmtRp(totalGmvIdr)}
            </p>
            <p className="text-[10.5px] font-medium leading-normal" style={{ color: TOKENS.textMuted }}>
              Omset kotor terkonversi (USD ke IDR @16.000)
            </p>
          </div>
        </div>

        {/* Card 3: Avg GMV per Video */}
        <div
          className="relative p-5 rounded-2xl overflow-hidden"
          style={{
            background: TOKENS.cardSoft,
            border: `1px solid ${TOKENS.cardBorder}`,
            boxShadow: "0 4px 20px rgba(0,0,0,0.01), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          <GridBg theme="light" />
          <div className="relative z-10">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: "rgba(139,92,246,0.08)",
                border: "1.5px solid rgba(139,92,246,0.2)",
              }}
            >
              <TrendingUp className="w-5 h-5 text-purple-500" strokeWidth={2.2} />
            </div>
            <p className="text-[9.5px] font-black uppercase tracking-[0.14em] mb-1.5" style={{ color: TOKENS.textMuted }}>
              Avg GMV per Video
            </p>
            <p className="text-2xl font-black mb-1 leading-none tracking-tight" style={{ color: TOKENS.text }}>
              {fmtRp(avgGmvPerVideoIdr)}
            </p>
            <p className="text-[10.5px] font-medium leading-normal" style={{ color: TOKENS.textMuted }}>
              Rata-rata pendapatan kotor per video promosi
            </p>
          </div>
        </div>
      </div>

      {/* 2. Category Revenue breakdown & product ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Category Chart */}
        <div
          className="p-6 rounded-2xl border space-y-4"
          style={{
            background: TOKENS.cardSoft,
            borderColor: TOKENS.cardBorder,
          }}
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-500" />
            <h3 className="font-black text-sm tracking-tight" style={{ color: TOKENS.text }}>
              Revenue Comparison by Category
            </h3>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis
                  dataKey="categoryName"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 9, fontWeight: 900, fill: TOKENS.textMuted }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => fmtRp(val * 16000)}
                  tick={{ fontSize: 9, fontWeight: 900, fill: TOKENS.textMuted }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
                <Bar dataKey="totalGmvUsd" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Category mini list table */}
          <div className="overflow-hidden rounded-xl border text-[11px]" style={{ borderColor: TOKENS.divider }}>
            <table className="w-full">
              <thead>
                <tr className="bg-black/[0.02]" style={{ borderBottom: `1px solid ${TOKENS.divider}` }}>
                  <th className="px-3 py-2 font-black uppercase text-left" style={{ color: TOKENS.textMuted }}>Kategori</th>
                  <th className="px-3 py-2 font-black uppercase text-right" style={{ color: TOKENS.textMuted }}>Videos</th>
                  <th className="px-3 py-2 font-black uppercase text-right" style={{ color: TOKENS.textMuted }}>Sales</th>
                  <th className="px-3 py-2 font-black uppercase text-right" style={{ color: TOKENS.textMuted }}>GMV (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((c, idx) => (
                  <tr key={c.categoryName} style={{ borderBottom: idx < categoryData.length - 1 ? `1px solid ${TOKENS.divider}` : "none" }}>
                    <td className="px-3 py-2 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: BAR_COLORS[idx % BAR_COLORS.length] }} />
                      {c.categoryName}
                    </td>
                    <td className="px-3 py-2 text-right font-medium">{formatNum(c.totalVideos)}</td>
                    <td className="px-3 py-2 text-right font-medium">{formatNum(c.totalSales)}</td>
                    <td className="px-3 py-2 text-right font-black text-emerald-600">{fmtRp(c.totalGmvUsd * 16000)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Top Selling Products */}
        <div
          className="p-6 rounded-2xl border space-y-4"
          style={{
            background: TOKENS.cardSoft,
            borderColor: TOKENS.cardBorder,
          }}
        >
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-500" />
            <h3 className="font-black text-sm tracking-tight" style={{ color: TOKENS.text }}>
              Top Selling Products
            </h3>
          </div>
          <div className="overflow-x-auto rounded-xl border text-[11px]" style={{ borderColor: TOKENS.divider }}>
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="bg-black/[0.02]" style={{ borderBottom: `1px solid ${TOKENS.divider}` }}>
                  <th className="px-3 py-2.5 font-black uppercase" style={{ color: TOKENS.textMuted }}>Nama Produk</th>
                  <th className="px-3 py-2.5 font-black uppercase" style={{ color: TOKENS.textMuted }}>Kategori</th>
                  <th className="px-3 py-2.5 font-black uppercase text-right" style={{ color: TOKENS.textMuted }}>Terjual</th>
                  <th className="px-3 py-2.5 font-black uppercase text-right" style={{ color: TOKENS.textMuted }}>GMV (Rp)</th>
                  <th className="px-3 py-2.5 font-black uppercase text-center" style={{ color: TOKENS.textMuted }}>Tier</th>
                  <th className="px-3 py-2.5 font-black uppercase text-right" style={{ color: TOKENS.textMuted }}>Video Promosi</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-400">Tidak ada data produk</td>
                  </tr>
                ) : (
                  topProducts.map((p, idx) => (
                    <tr
                      key={p.echotikProductId}
                      style={{ borderBottom: idx < topProducts.length - 1 ? `1px solid ${TOKENS.divider}` : "none" }}
                      className="hover:bg-black/[0.01] transition-colors"
                    >
                      <td className="px-3 py-2.5 font-bold max-w-[150px] truncate" title={p.productName}>
                        {p.productName}
                      </td>
                      <td className="px-3 py-2.5 font-medium text-gray-500">{p.category || "Uncategorized"}</td>
                      <td className="px-3 py-2.5 text-right font-semibold">{formatNum(p.totalSales)} pcs</td>
                      <td className="px-3 py-2.5 text-right font-black text-emerald-600">{fmtRp(p.totalGmvUsd * 16000)}</td>
                      <td className="px-3 py-2.5 text-center">{renderRevenueTierBadge(p.revenueTier)}</td>
                      <td className="px-3 py-2.5 text-right font-semibold text-rose-500">{formatNum(p.videosPromoting)} videos</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. Top Earning Videos */}
      <div
        className="p-6 rounded-2xl border space-y-4"
        style={{
          background: TOKENS.cardSoft,
          borderColor: TOKENS.cardBorder,
        }}
      >
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-indigo-500" />
          <h3 className="font-black text-sm tracking-tight" style={{ color: TOKENS.text }}>
            Top Earning E-Commerce Videos
          </h3>
        </div>
        <div className="overflow-x-auto rounded-xl border text-[11px]" style={{ borderColor: TOKENS.divider }}>
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-black/[0.02]" style={{ borderBottom: `1px solid ${TOKENS.divider}` }}>
                <th className="px-4 py-3 font-black uppercase" style={{ color: TOKENS.textMuted }}>Judul Video</th>
                <th className="px-4 py-3 font-black uppercase" style={{ color: TOKENS.textMuted }}>Influencer</th>
                <th className="px-4 py-3 font-black uppercase text-right" style={{ color: TOKENS.textMuted }}>Views</th>
                <th className="px-4 py-3 font-black uppercase text-right" style={{ color: TOKENS.textMuted }}>Sales Volume</th>
                <th className="px-4 py-3 font-black uppercase text-right" style={{ color: TOKENS.textMuted }}>GMV (Rp)</th>
                <th className="px-4 py-3 font-black uppercase text-center" style={{ color: TOKENS.textMuted }}>Tier</th>
              </tr>
            </thead>
            <tbody>
              {topVideos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">Tidak ada data video komersil</td>
                </tr>
              ) : (
                topVideos.map((v, idx) => (
                  <tr
                    key={v.echotikVideoId}
                    style={{ borderBottom: idx < topVideos.length - 1 ? `1px solid ${TOKENS.divider}` : "none" }}
                    className="hover:bg-black/[0.01] transition-colors"
                  >
                    <td className="px-4 py-3 font-bold max-w-[280px] truncate" title={v.titleBrief}>
                      {v.titleBrief || "Untitled Video"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-purple-600">@{v.influencer}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-600">{formatNum(v.latestViews)}</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatNum(v.latestSales)} pcs</td>
                    <td className="px-4 py-3 text-right font-black text-emerald-600">{fmtRp(v.latestGmvUsd * 16000)}</td>
                    <td className="px-4 py-3 text-center">{renderRevenueTierBadge(v.revenueTier)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Competitor Account comparisons */}
      <div
        className="p-6 rounded-2xl border space-y-4"
        style={{
          background: TOKENS.cardSoft,
          borderColor: TOKENS.cardBorder,
        }}
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          <h3 className="font-black text-sm tracking-tight" style={{ color: TOKENS.text }}>
            Account E-Commerce Performance comparison
          </h3>
        </div>
        <div className="overflow-x-auto rounded-xl border text-[11px]" style={{ borderColor: TOKENS.divider }}>
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-black/[0.02]" style={{ borderBottom: `1px solid ${TOKENS.divider}` }}>
                <th className="px-4 py-3 font-black uppercase" style={{ color: TOKENS.textMuted }}>Display Name / Username</th>
                <th className="px-4 py-3 font-black uppercase text-center" style={{ color: TOKENS.textMuted }}>Followers Tier</th>
                <th className="px-4 py-3 font-black uppercase text-right" style={{ color: TOKENS.textMuted }}>Total Videos</th>
                <th className="px-4 py-3 font-black uppercase text-right" style={{ color: TOKENS.textMuted }}>Total Views</th>
                <th className="px-4 py-3 font-black uppercase text-right" style={{ color: TOKENS.textMuted }}>Total Sales</th>
                <th className="px-4 py-3 font-black uppercase text-right" style={{ color: TOKENS.textMuted }}>E-Commerce GMV (Rp)</th>
                <th className="px-4 py-3 font-black uppercase text-center" style={{ color: TOKENS.textMuted }}>Tipe Akun</th>
              </tr>
            </thead>
            <tbody>
              {accountSummaries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">Tidak ada data performa akun</td>
                </tr>
              ) : (
                accountSummaries.map((acc, idx) => (
                  <tr
                    key={acc.uniqueId}
                    style={{ borderBottom: idx < accountSummaries.length - 1 ? `1px solid ${TOKENS.divider}` : "none" }}
                    className="hover:bg-black/[0.01] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-900">{acc.displayName}</p>
                      <p className="text-[10px] text-gray-500 font-mono">@{acc.uniqueId}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200">
                        {acc.followerTier} ({formatNum(Number(acc.followerCountRaw || 0))})
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">{formatNum(acc.totalVideos)}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">{formatNum(acc.totalViews)}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">{formatNum(acc.totalSales)} pcs</td>
                    <td className="px-4 py-3 text-right font-black text-emerald-600">{fmtRp(acc.totalGmvUsd * 16000)}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded font-black text-[9px] uppercase border ${
                          acc.trackingType === "own"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : "bg-purple-50 text-purple-600 border-purple-100"
                        }`}
                      >
                        {acc.trackingType === "own" ? "Own Account" : "Competitor"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
