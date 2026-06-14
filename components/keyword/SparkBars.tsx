import React from 'react';
import { TOKENS } from '@/lib/design-tokens';

interface SparkBarsProps {
  data: number[];
  height?: number;
}

export function SparkBars({ data, height = 40 }: SparkBarsProps) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${(v / max) * 100}%`,
            background: i === data.length - 1 ? TOKENS.charcoal : 'rgba(0,0,0,0.15)',
            borderRadius: 2,
            minHeight: 2,
          }}
        />
      ))}
    </div>
  );
}
