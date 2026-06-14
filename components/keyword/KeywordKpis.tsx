import React from 'react';
import { TOKENS } from '@/lib/design-tokens';
import { SparkBars } from './SparkBars';
import { formatNum } from '@/lib/keyword/mock-data';

interface KeywordKpisProps {
  topKeyword: string;
  sparkFreq: number[];
  avgEng: number;
  totalVideos: number;
  peakViews: number;
}

function StatCard({ label, value, sub, spark }: { label: string; value: string; sub: string; spark?: number[] }) {
  return (
    <div style={{ background: TOKENS.card, border: `1px solid ${TOKENS.cardBorder}`, borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: TOKENS.textMuted, textTransform: 'uppercase', marginBottom: 10 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 900, color: TOKENS.text, margin: 0, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 12, color: TOKENS.textMuted, marginTop: 6 }}>{sub}</p>
      {spark && <div style={{ marginTop: 12 }}><SparkBars data={spark} /></div>}
    </div>
  );
}

export function KeywordKpis({ topKeyword, sparkFreq, avgEng, totalVideos, peakViews }: KeywordKpisProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      <StatCard label="Top Keyword" value="#1" sub={`"${topKeyword || '—'}"`} spark={sparkFreq} />
      <StatCard label="Avg Engagement" value={`${avgEng.toFixed(1)}%`} sub="rata-rata semua keyword" />
      <StatCard label="Total Videos" value={String(totalVideos)} sub="video terindeks" />
      <StatCard label="Peak Views" value={formatNum(peakViews)} sub="avg views #1 keyword" />
    </div>
  );
}
