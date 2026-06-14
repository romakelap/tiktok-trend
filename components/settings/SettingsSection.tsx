import React from 'react';
import { TOKENS } from '@/lib/design-tokens';
import { GridBg } from '@/components/layout/GridBg';
import { LucideIcon } from 'lucide-react';

interface SettingsSectionProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function SettingsSection({ icon: Ico, title, subtitle, children, action }: SettingsSectionProps) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.9)',
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow: '0 2px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
      }}
    >
      <GridBg theme="light" />
      <div className="relative z-10">
        {/* Section header */}
        <div
          className="flex items-center justify-between gap-3 px-6 py-5"
          style={{ borderBottom: `1px solid ${TOKENS.divider}` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#111', boxShadow: '0 3px 10px rgba(0,0,0,0.15)' }}
            >
              <Ico className="w-4 h-4 text-white" strokeWidth={2.4} />
            </div>
            <div>
              <h2 className="font-black text-sm tracking-tight" style={{ color: TOKENS.text }}>
                {title}
              </h2>
              <p className="text-[11px]" style={{ color: TOKENS.textMuted }}>
                {subtitle}
              </p>
            </div>
          </div>
          {action}
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
