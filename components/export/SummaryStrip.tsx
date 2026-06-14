import React from 'react';
import { Database, Table2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { GridBg } from '@/components/layout/GridBg';
import { TOKENS } from '@/lib/design-tokens';
import { ExportType } from '@/lib/export/mock-data';

interface SummaryStripProps {
  exports: ExportType[];
}

export const SummaryStrip = ({ exports }: SummaryStripProps) => {
  const totalReady = exports.filter(e => e.status === 'ready').length;
  const totalStale = exports.filter(e => e.status === 'stale').length;
  const totalNot   = exports.filter(e => e.status === 'not_generated').length;
  const totalRows  = exports.reduce((s, e) => s + e.rows, 0);

  const items = [
    { label: 'Total Dataset Types', value: exports.length,              Ico: Database   },
    { label: 'Total Data Rows',     value: totalRows.toLocaleString(),  Ico: Table2     },
    { label: 'Siap Diunduh',        value: `${totalReady} / ${exports.length}`, Ico: CheckCircle2 },
    { label: 'Kedaluwarsa',         value: totalStale,                  Ico: AlertCircle },
    { label: 'Belum Digenerate',    value: totalNot,                    Ico: Clock      },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map((c, i) => (
        <div
          key={i}
          className="relative p-4 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: 'rgba(255,255,255,0.9)',
            border: `1px solid ${TOKENS.cardBorder}`,
            boxShadow: '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
          }}
        >
          <GridBg theme="light" />
          <div className="relative z-10">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ background: '#111', boxShadow: '0 3px 10px rgba(0,0,0,0.18)' }}
            >
              <c.Ico className="w-3.5 h-3.5 text-white" strokeWidth={2.4} />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: TOKENS.textMuted }}>{c.label}</p>
            <p className="text-2xl font-black tracking-tight leading-none" style={{ color: TOKENS.text }}>{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
