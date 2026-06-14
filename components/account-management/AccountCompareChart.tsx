'use client';

import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, Radar as RadarIcon } from 'lucide-react';

import { GridBg } from '@/components/layout/GridBg';
import { TOKENS } from '@/lib/design-tokens';
import { Account, TYPE_META, formatNum } from '@/lib/account-management/mock-data';

interface AccountCompareChartProps {
  /** Accounts shown side-by-side. First "own" account is highlighted as YOU. */
  accountList: Account[];
}

type Metric = {
  key: 'followers' | 'videos' | 'avgEngagement' | 'avgViews' | 'growthPct';
  label: string;
  /** Recharts dataKey for the chart series. */
  format: (v: number) => string;
};

const METRICS: Metric[] = [
  { key: 'followers',     label: 'Followers',  format: formatNum },
  { key: 'videos',        label: 'Total Video', format: (v) => v.toLocaleString('id-ID') },
  { key: 'avgEngagement', label: 'Engagement %', format: (v) => `${v}%` },
  { key: 'avgViews',      label: 'Avg Views',  format: formatNum },
  { key: 'growthPct',     label: 'Growth %',   format: (v) => `${v >= 0 ? '+' : ''}${v}%` },
];

/** Distinct palette per account row so legend stays readable. */
const PALETTE = ['#111111', '#059669', '#1e40af', '#b45309', '#0ea5e9', '#7c3aed', '#dc2626'];

/**
 * Visualises the selected accounts side-by-side with two complementary
 * views. The grouped bar chart compares one metric across all accounts at
 * a time (so the axis scale stays meaningful); the radar chart normalises
 * every metric to a 0–100 scale so the overall "shape" of each account is
 * easy to read at a glance.
 */
export function AccountCompareChart({ accountList }: AccountCompareChartProps) {
  const [activeMetric, setActiveMetric] = useState<Metric['key']>('followers');

  // Don't render if there's nothing to compare (caller still controls visibility)
  if (accountList.length === 0) return null;

  const activeMeta = METRICS.find((m) => m.key === activeMetric) ?? METRICS[0];

  // Grouped bar data: one row per account, one numeric column for active metric.
  const barData = useMemo(() => {
    return accountList.map((a, i) => ({
      account: `@${a.username}`,
      displayName: a.displayName,
      value: a[activeMetric],
      // Carry the colour so each bar can be themed by account index.
      fill: TYPE_META[a.type]?.solid ?? PALETTE[i % PALETTE.length],
      type: a.type,
    }));
  }, [accountList, activeMetric]);

  // Radar data: one row per metric, one column per account, all normalised
  // to 0–100 against the max value across the selected accounts.
  const radarData = useMemo(() => {
    return METRICS.map((m) => {
      const max = Math.max(
        ...accountList.map((a) => (m.key === 'growthPct' ? a.growthPct + 100 : a[m.key])),
        1
      );
      const row: Record<string, string | number> = { metric: m.label };
      accountList.forEach((a) => {
        const raw = m.key === 'growthPct' ? a.growthPct + 100 : a[m.key];
        row[`@${a.username}`] = Math.round((raw / max) * 100);
      });
      return row;
    });
  }, [accountList]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: TOKENS.cardSoft,
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
      }}
    >
      <GridBg theme="light" />
      <div className="relative z-10">
        {/* Header */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 border-b"
          style={{ borderColor: TOKENS.divider }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-900">
              <BarChart3 className="w-5 h-5 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight" style={{ color: TOKENS.text }}>
                Visualisasi Perbandingan Akun
              </h2>
              <p className="text-xs" style={{ color: TOKENS.textMuted }}>
                Bandingkan {accountList.length} akun · {METRICS.length} metrik kunci
              </p>
            </div>
          </div>

          {/* Metric pill switcher (drives the bar chart) */}
          <div
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ background: 'rgba(0,0,0,0.04)', border: `1px solid ${TOKENS.inputBorder}` }}
          >
            {METRICS.map((m) => {
              const sel = activeMetric === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setActiveMetric(m.key)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-black transition-all"
                  style={{
                    background: sel ? '#fff' : 'transparent',
                    color: sel ? TOKENS.text : TOKENS.textMuted,
                    boxShadow: sel ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 p-6">
          {/* Grouped bar chart — single metric across accounts */}
          <div className="xl:col-span-3">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-sm font-black" style={{ color: TOKENS.text }}>
                {activeMeta.label} per Akun
              </h3>
              <p className="text-[10px] font-bold" style={{ color: TOKENS.textMuted }}>
                Sumbu Y disesuaikan otomatis
              </p>
            </div>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis
                    dataKey="account"
                    stroke="rgba(0,0,0,0.45)"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    tick={{ fontSize: 10, fontWeight: 700, fill: 'rgba(0,0,0,0.6)' }}
                  />
                  <YAxis
                    stroke="rgba(0,0,0,0.45)"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) =>
                      activeMetric === 'avgEngagement' || activeMetric === 'growthPct'
                        ? `${v}%`
                        : formatNum(v)
                    }
                    tick={{ fontSize: 10, fontWeight: 700, fill: 'rgba(0,0,0,0.55)' }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: 10,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#111',
                    }}
                    formatter={(v: number) => [activeMeta.format(v), activeMeta.label]}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar chart — normalised multi-metric profile */}
          <div className="xl:col-span-2">
            <div className="flex items-baseline justify-between mb-3">
              <h3
                className="text-sm font-black flex items-center gap-1.5"
                style={{ color: TOKENS.text }}
              >
                <RadarIcon className="w-3.5 h-3.5" strokeWidth={2.4} />
                Profil Metrik
              </h3>
              <p className="text-[10px] font-bold" style={{ color: TOKENS.textMuted }}>
                Skala 0–100 (relatif)
              </p>
            </div>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="78%">
                  <PolarGrid stroke="rgba(0,0,0,0.08)" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fontSize: 10, fontWeight: 700, fill: 'rgba(0,0,0,0.6)' }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fontSize: 9, fontWeight: 700, fill: 'rgba(0,0,0,0.35)' }}
                    tickFormatter={(v: number) => `${v}`}
                  />
                  {accountList.map((a, i) => {
                    const color = TYPE_META[a.type]?.solid ?? PALETTE[i % PALETTE.length];
                    return (
                      <Radar
                        key={a.id}
                        name={`@${a.username}`}
                        dataKey={`@${a.username}`}
                        stroke={color}
                        fill={color}
                        fillOpacity={0.18}
                        strokeWidth={2}
                      />
                    );
                  })}
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: 10,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#111',
                    }}
                    formatter={(v: number, name: string) => [`${v} / 100`, name]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 10, fontWeight: 700, paddingTop: 8 }}
                    iconSize={8}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Inline legend / raw numbers strip so users can sanity-check the chart */}
        <div
          className="px-6 py-4 border-t flex flex-wrap items-center gap-3"
          style={{ borderColor: TOKENS.divider, background: 'rgba(0,0,0,0.015)' }}
        >
          {accountList.map((a, i) => {
            const color = TYPE_META[a.type]?.solid ?? PALETTE[i % PALETTE.length];
            return (
              <div
                key={a.id}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg"
                style={{ background: '#fff', border: `1px solid ${TOKENS.divider}` }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span className="text-[11px] font-black" style={{ color: TOKENS.text }}>
                  @{a.username}
                </span>
                <span className="text-[10px] font-bold" style={{ color: TOKENS.textMuted }}>
                  {formatNum(a.followers)} followers · {a.avgEngagement}% eng.
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
