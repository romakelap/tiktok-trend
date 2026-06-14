import React from 'react';
import { TOKENS } from '@/lib/design-tokens';
import { KeywordItem } from '@/lib/keyword/mock-data';

interface EngagementHeatmapProps {
  keywords: KeywordItem[];
}

export function EngagementHeatmap({ keywords }: EngagementHeatmapProps) {
  const top20 = keywords.slice(0, 20);
  const maxEng = Math.max(...top20.map(k => k.engagement), 1);

  return (
    <div style={{ background: TOKENS.card, border: `1px solid ${TOKENS.cardBorder}`, borderRadius: 16, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: TOKENS.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>Heatmap</p>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: TOKENS.text, margin: 0 }}>Engagement Intensity</h3>
        <p style={{ fontSize: 12, color: TOKENS.textMuted, marginTop: 4 }}>Top 20 keywords</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
        {top20.map((kw) => {
          const intensity = kw.engagement / maxEng;
          const alpha = 0.1 + intensity * 0.9;
          return (
            <div key={kw.rank} title={`${kw.keyword}: ${kw.engagement}%`}
              style={{
                aspectRatio: '1',
                borderRadius: 6,
                background: `rgba(26,107,255,${alpha})`, // Accent color for heat intensity
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'default',
              }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: intensity > 0.5 ? 'white' : TOKENS.text, lineHeight: 1 }}>
                #{kw.rank}
              </span>
              <span style={{ fontSize: 8, color: intensity > 0.5 ? 'rgba(255,255,255,0.7)' : TOKENS.textMuted, lineHeight: 1.2, marginTop: 1 }}>
                {kw.engagement.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
        <span style={{ fontSize: 10, color: TOKENS.textMuted }}>Low</span>
        <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'linear-gradient(to right, rgba(26,107,255,0.1), rgba(26,107,255,1))' }} />
        <span style={{ fontSize: 10, color: TOKENS.textMuted }}>High</span>
      </div>
    </div>
  );
}
