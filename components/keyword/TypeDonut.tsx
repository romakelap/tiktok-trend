import React from 'react';
import { TOKENS } from '@/lib/design-tokens';
import { KeywordItem } from '@/lib/keyword/mock-data';

interface TypeDonutProps {
  keywords: KeywordItem[];
}

export function TypeDonut({ keywords }: TypeDonutProps) {
  const types = ['hook', 'brand', 'action', 'emotion'];
  const counts = types.map(t => keywords.filter(k => k.type === t).length);
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  const fills = ['#111111', '#444444', '#888888', '#bbbbbb'];
  const labels = ['Hook', 'Brand', 'Action', 'Emotion'];

  const R = 60, r = 36, cx = 80, cy = 80;
  let angle = -Math.PI / 2;

  const slices = counts.map((c, i) => {
    const sweep = (c / total) * Math.PI * 2;
    const x1 = cx + R * Math.cos(angle);
    const y1 = cy + R * Math.sin(angle);
    const x2 = cx + R * Math.cos(angle + sweep);
    const y2 = cy + R * Math.sin(angle + sweep);
    const xi1 = cx + r * Math.cos(angle);
    const yi1 = cy + r * Math.sin(angle);
    const xi2 = cx + r * Math.cos(angle + sweep);
    const yi2 = cy + r * Math.sin(angle + sweep);
    const large = sweep > Math.PI ? 1 : 0;
    const path = `M${xi1} ${yi1} L${x1} ${y1} A${R} ${R} 0 ${large} 1 ${x2} ${y2} L${xi2} ${yi2} A${r} ${r} 0 ${large} 0 ${xi1} ${yi1}Z`;
    angle += sweep;
    return { path, fill: fills[i], label: labels[i], count: c, pct: Math.round((c / total) * 100) };
  });

  return (
    <div style={{ background: TOKENS.card, border: `1px solid ${TOKENS.cardBorder}`, borderRadius: 16, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: TOKENS.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>Distribution</p>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: TOKENS.text, margin: 0 }}>Keyword Type Mix</h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <svg viewBox="0 0 160 160" style={{ width: 120, flexShrink: 0 }}>
          {slices.map((s, i) => (
            <path key={i} d={s.path} fill={s.fill} />
          ))}
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize={18} fontWeight={900} fill={TOKENS.text}>{total}</text>
          <text x={cx} y={cy + 13} textAnchor="middle" fontSize={9} fill={TOKENS.textMuted}>keywords</text>
        </svg>

        <div style={{ flex: 1 }}>
          {slices.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: s.fill, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: TOKENS.textSubtle }}>{s.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: TOKENS.text }}>{s.count}</span>
                <span style={{ fontSize: 11, color: TOKENS.textMuted }}>{s.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
