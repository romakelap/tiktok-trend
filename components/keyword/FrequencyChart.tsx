import React from 'react';
import { TOKENS } from '@/lib/design-tokens';
import { KeywordItem, formatNum } from '@/lib/keyword/mock-data';

interface FrequencyChartProps {
  keywords: KeywordItem[];
}

export function FrequencyChart({ keywords }: FrequencyChartProps) {
  const top10 = keywords.slice(0, 10);
  const maxFreq = Math.max(...top10.map(k => k.frequency), 1);

  return (
    <div style={{ background: TOKENS.card, border: `1px solid ${TOKENS.cardBorder}`, borderRadius: 16, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: TOKENS.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>Frequency Chart</p>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: TOKENS.text, margin: 0 }}>Top 10 Keywords by Usage %</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {top10.map((kw, i) => {
          const pct = (kw.frequency / maxFreq) * 100;
          return (
            <div key={kw.rank}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: TOKENS.textMuted, width: 20 }}>#{kw.rank}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: TOKENS.text }}>"{kw.keyword}"</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: TOKENS.textMuted }}>{formatNum(kw.avgViews)} avg</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: TOKENS.text }}>{kw.frequency}%</span>
                </div>
              </div>
              <div style={{ height: 8, background: TOKENS.barBg, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: i === 0
                    ? TOKENS.charcoal
                    : i < 3
                      ? 'rgba(0,0,0,0.55)'
                      : 'rgba(0,0,0,0.28)',
                  borderRadius: 4,
                  transition: 'width 0.8s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
