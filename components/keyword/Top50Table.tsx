import React, { useState } from 'react';
import { TOKENS } from '@/lib/design-tokens';
import { KeywordItem, formatNum, getTypeLabel, getTrendLabel } from '@/lib/keyword/mock-data';

interface Top50TableProps {
  keywords: KeywordItem[];
  searchQuery: string;
}

export function Top50Table({ keywords, searchQuery }: Top50TableProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const filtered = keywords.filter(k =>
    k.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ background: TOKENS.card, border: `1px solid ${TOKENS.cardBorder}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${TOKENS.divider}` }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: TOKENS.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>Full Index</p>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: TOKENS.text, margin: 0 }}>Top 50 Keywords</h3>
        <p style={{ fontSize: 12, color: TOKENS.textMuted, marginTop: 4 }}>{filtered.length} keywords ditemukan</p>
      </div>

      {/* Table Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr 60px 60px 80px 70px 60px',
        padding: '10px 24px',
        background: 'rgba(0,0,0,0.025)',
        borderBottom: `1px solid ${TOKENS.divider}`,
        gap: 8,
      }}>
        {['#', 'Keyword', 'Type', 'Freq%', 'Avg Views', 'Eng%', 'Trend'].map(h => (
          <span key={h} style={{ fontSize: 10, fontWeight: 700, color: TOKENS.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
        ))}
      </div>

      <div style={{ maxHeight: 520, overflowY: 'auto' }}>
        {filtered.map((kw, i) => {
          const isHovered = hoveredIndex === i;
          return (
            <div
              key={kw.rank}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 60px 60px 80px 70px 60px',
                padding: '11px 24px',
                borderBottom: i < filtered.length - 1 ? `1px solid ${TOKENS.divider}` : 'none',
                background: isHovered
                  ? 'rgba(0,0,0,0.035)'
                  : i % 2 === 0
                    ? 'transparent'
                    : 'rgba(0,0,0,0.012)',
                alignItems: 'center',
                gap: 8,
                transition: 'background 0.15s',
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: kw.rank <= 3 ? TOKENS.text : TOKENS.textMuted }}>
                {kw.rank <= 3 ? ['①', '②', '③'][kw.rank - 1] : kw.rank}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: TOKENS.text }}>{kw.keyword}</span>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: TOKENS.textSubtle,
                background: 'rgba(0,0,0,0.08)',
                padding: '2px 7px', borderRadius: 4,
                display: 'inline-block', width: 'fit-content',
              }}>
                {getTypeLabel(kw.type)}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: TOKENS.text }}>{kw.frequency}%</span>
              <span style={{ fontSize: 12, color: TOKENS.textSubtle }}>{formatNum(kw.avgViews)}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: TOKENS.text }}>{kw.engagement.toFixed(1)}%</span>
              <span style={{ fontSize: 13 }}>{getTrendLabel(kw.trend)}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ padding: '14px 24px', borderTop: `1px solid ${TOKENS.divider}`, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[['H', 'Hook'], ['B', 'Brand'], ['A', 'Action'], ['E', 'Emotion']].map(([k, v]) => (
          <span key={k} style={{ fontSize: 11, color: TOKENS.textMuted }}>
            <span style={{ fontWeight: 700, color: TOKENS.textSubtle }}>{k}</span> = {v}
          </span>
        ))}
        <span style={{ fontSize: 11, color: TOKENS.textMuted, marginLeft: 'auto' }}>🔥 Hot · ↑ Naik · → Stabil · ↓ Turun</span>
      </div>
    </div>
  );
}
