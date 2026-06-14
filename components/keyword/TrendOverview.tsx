import React from 'react';
import { TOKENS } from '@/lib/design-tokens';
import { KeywordItem } from '@/lib/keyword/mock-data';

interface TrendOverviewProps {
  keywords: KeywordItem[];
}

export function TrendOverview({ keywords }: TrendOverviewProps) {
  const trendGroups = {
    hot:    keywords.filter(k => k.trend === 'hot').length,
    up:     keywords.filter(k => k.trend === 'up').length,
    stable: keywords.filter(k => k.trend === 'stable').length,
    down:   keywords.filter(k => k.trend === 'down').length,
  };
  const total = Object.values(trendGroups).reduce((a, b) => a + b, 0) || 1;
  const items = [
    { key: 'hot',    label: 'Hot 🔥',  count: trendGroups.hot },
    { key: 'up',     label: 'Naik ↑',  count: trendGroups.up },
    { key: 'stable', label: 'Stabil →', count: trendGroups.stable },
    { key: 'down',   label: 'Turun ↓', count: trendGroups.down },
  ];
  const shades = ['#111111', '#444444', '#888888', '#bbbbbb'];

  return (
    <div style={{ background: TOKENS.card, border: `1px solid ${TOKENS.cardBorder}`, borderRadius: 16, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: TOKENS.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>Trend Status</p>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: TOKENS.text, margin: 0 }}>Keyword Momentum</h3>
      </div>

      {/* Stacked bar */}
      <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 20 }}>
        {items.map((item, i) => (
          <div key={item.key}
            style={{ width: `${(item.count / total) * 100}%`, background: shades[i], transition: 'width 0.6s ease' }} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {items.map((item, i) => (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: shades[i], flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: TOKENS.textMuted }}>{item.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: TOKENS.text, lineHeight: 1 }}>{item.count}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
