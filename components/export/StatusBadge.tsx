import React from 'react';
import { CheckCircle2, AlertCircle, Clock, RefreshCw } from 'lucide-react';

interface StatusBadgeProps {
  status: 'ready' | 'stale' | 'not_generated' | 'generating';
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const map: Record<string, { label: string; color: string; bg: string; border: string; Ico: any }> = {
    ready:         { label: 'Siap',       color: '#047857', bg: 'rgba(4,120,87,0.08)',   border: 'rgba(4,120,87,0.2)',   Ico: CheckCircle2 },
    stale:         { label: 'Kedaluwarsa',color: '#b45309', bg: 'rgba(180,83,9,0.08)',   border: 'rgba(180,83,9,0.2)',   Ico: AlertCircle  },
    not_generated: { label: 'Belum Dibuat',color:'#737373', bg: 'rgba(115,115,115,0.08)',border: 'rgba(115,115,115,0.2)',Ico: Clock        },
    generating:    { label: 'Generating…',color: '#0369a1', bg: 'rgba(3,105,161,0.08)',  border: 'rgba(3,105,161,0.2)',  Ico: RefreshCw    },
  };
  const s = map[status] || map.not_generated;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      <s.Ico className={`w-3 h-3 ${status === 'generating' ? 'animate-spin' : ''}`} strokeWidth={2.5} />
      {s.label}
    </span>
  );
};
