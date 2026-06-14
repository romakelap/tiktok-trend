import React from 'react';
import { TOKENS } from '@/lib/design-tokens';
import { KeywordItem, formatNum } from '@/lib/keyword/mock-data';

interface EngagementScatterProps {
  keywords: KeywordItem[];
}

export function EngagementScatter({ keywords }: EngagementScatterProps) {
  const top20 = keywords.slice(0, 20);
  const W = 400, H = 200, PAD = 36;
  const maxViews = Math.max(...top20.map(k => k.avgViews), 1);
  const maxEng = Math.max(...top20.map(k => k.engagement), 1);
  const minEng = Math.min(...top20.map(k => k.engagement));

  const xScale = (v: number) => PAD + ((v / maxViews) * (W - PAD * 2));
  const yScale = (e: number) => H - PAD - (((e - minEng) / (maxEng - minEng || 1)) * (H - PAD * 2));

  // Grid lines
  const xTicks = [0.25, 0.5, 0.75, 1].map(f => maxViews * f);
  const yTicks = [0, 0.33, 0.66, 1].map(f => minEng + f * (maxEng - minEng));

  return (
    <div style={{ background: TOKENS.card, border: `1px solid ${TOKENS.cardBorder}`, borderRadius: 16, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: TOKENS.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>Scatter Plot</p>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: TOKENS.text, margin: 0 }}>Engagement Rate vs Avg Views</h3>
        <p style={{ fontSize: 12, color: TOKENS.textMuted, marginTop: 4 }}>Top 20 keywords. Hover for details.</p>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', overflow: 'visible' }}>
        {/* Grid */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={PAD} y1={yScale(t)} x2={W - PAD} y2={yScale(t)}
              stroke="rgba(0,0,0,0.07)" strokeWidth={1} strokeDasharray="3 3" />
            <text x={PAD - 4} y={yScale(t) + 4} textAnchor="end"
              fill={TOKENS.textMuted} fontSize={9}>{t.toFixed(1)}%</text>
          </g>
        ))}
        {xTicks.map((t, i) => (
          <g key={i}>
            <line x1={xScale(t)} y1={PAD} x2={xScale(t)} y2={H - PAD}
              stroke="rgba(0,0,0,0.07)" strokeWidth={1} strokeDasharray="3 3" />
            <text x={xScale(t)} y={H - PAD + 14} textAnchor="middle"
              fill={TOKENS.textMuted} fontSize={9}>{formatNum(t)}</text>
          </g>
        ))}

        {/* Axes */}
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="rgba(0,0,0,0.15)" strokeWidth={1} />
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(0,0,0,0.15)" strokeWidth={1} />

        {/* Points */}
        {top20.map((kw, i) => {
          const cx = xScale(kw.avgViews);
          const cy = yScale(kw.engagement);
          const r = 4 + (kw.frequency / 20);
          const isTop = i < 3;
          return (
            <g key={kw.rank}>
              <circle cx={cx} cy={cy} r={r}
                fill={isTop ? TOKENS.charcoal : 'rgba(0,0,0,0.25)'}
                stroke="white" strokeWidth={1.5}
                opacity={0.85}
              />
              {isTop && (
                <text x={cx + r + 4} y={cy + 4} fontSize={9} fontWeight={700} fill={TOKENS.text}>
                  {kw.keyword.slice(0, 10)}
                </text>
              )}
            </g>
          );
        })}

        {/* Axis labels */}
        <text x={W / 2} y={H - 2} textAnchor="middle" fontSize={10} fill={TOKENS.textMuted} fontWeight={600}>Avg Views →</text>
        <text x={10} y={H / 2} textAnchor="middle" fontSize={10} fill={TOKENS.textMuted} fontWeight={600}
          transform={`rotate(-90, 10, ${H / 2})`}>Engagement % →</text>
      </svg>
    </div>
  );
}
