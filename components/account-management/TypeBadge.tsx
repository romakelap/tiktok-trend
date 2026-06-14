import React from 'react';
import { TYPE_META } from '@/lib/account-management/mock-data';

interface TypeBadgeProps {
  type: 'own' | 'competitor' | 'inspiration';
  withIcon?: boolean;
  size?: 'sm' | 'xs';
}

export const TypeBadge = ({ type, withIcon = true, size = 'sm' }: TypeBadgeProps) => {
  const meta = TYPE_META[type];
  const Ico = meta.icon;
  const dims = size === 'xs'
    ? { px: 'px-1.5', py: 'py-0.5', text: 'text-[10px]', icon: 'w-2.5 h-2.5' }
    : { px: 'px-2',   py: 'py-0.5', text: 'text-[11px]', icon: 'w-3 h-3' };
  return (
    <span
      className={`inline-flex items-center gap-1 ${dims.px} ${dims.py} rounded-md font-black ${dims.text} uppercase tracking-wider`}
      style={{ background: meta.tint, color: meta.solid, border: `1px solid ${meta.border}` }}>
      {withIcon && <Ico className={dims.icon} strokeWidth={2.5} />}
      {meta.short}
    </span>
  );
};
