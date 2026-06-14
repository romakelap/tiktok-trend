import React from 'react';
import { TOKENS } from '@/lib/design-tokens';
import { GridBg } from '@/components/layout/GridBg';

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function SectionCard({ title, icon, children, action }: SectionCardProps) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: TOKENS.card,
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow: '0 2px 16px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)',
      }}
    >
      <GridBg theme="light" />
      <div className="relative z-10">
        {/* Section header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${TOKENS.divider}` }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: TOKENS.accentSoft,
                border: '1px solid rgba(26,107,255,0.15)',
              }}
            >
              <div style={{ color: TOKENS.accent }}>{icon}</div>
            </div>
            <h3 className="font-black text-sm" style={{ color: TOKENS.text }}>
              {title}
            </h3>
          </div>
          {action && <div>{action}</div>}
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
