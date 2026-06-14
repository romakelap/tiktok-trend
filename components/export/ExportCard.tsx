import React from 'react';
import { Clock, Info, Table2, FileSpreadsheet, FileText, RefreshCw } from 'lucide-react';
import { GridBg } from '@/components/layout/GridBg';
import { TOKENS } from '@/lib/design-tokens';
import { ExportType, formatRelativeTime } from '@/lib/export/mock-data';
import { StatusBadge } from './StatusBadge';

interface ExportCardProps {
  exp: ExportType;
  onDownload: (exportId: string, fmt: 'excel' | 'csv') => void;
  loadingId: string | null;
}

const Mono = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <span className="font-mono" style={{ fontSize: 11, letterSpacing: '-0.02em', ...style }}>{children}</span>
);

const DownloadButton = ({
  format,
  color,
  loading,
  onClick,
  disabled
}: {
  format: string;
  color?: string;
  loading?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const isExcel = format === 'Excel';
  const fmtColor = isExcel ? '#047857' : '#0369a1';
  const usedColor = color || fmtColor;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[12px] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background: usedColor,
        color: '#fff',
        boxShadow: `0 4px 14px ${usedColor}44`,
        border: 'none',
      }}
    >
      {loading ? (
        <RefreshCw className="w-3.5 h-3.5 animate-spin" strokeWidth={2.5} />
      ) : isExcel ? (
        <FileSpreadsheet className="w-3.5 h-3.5" strokeWidth={2.5} />
      ) : (
        <FileText className="w-3.5 h-3.5" strokeWidth={2.5} />
      )}
      {loading ? 'Generating…' : `Download ${format}`}
    </button>
  );
};

export const ExportCard = ({ exp, onDownload, loadingId }: ExportCardProps) => {
  const { id, label, description, icon: Ico, rows, size, sheets, lastGenerated, status, color, tint } = exp;
  const relTime = formatRelativeTime(lastGenerated);
  const isLoading = (k: string) => loadingId === `${id}-${k}`;

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: 'rgba(255,255,255,0.9)',
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow: '0 2px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
      }}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: color }} />
      <GridBg theme="light" />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: tint, border: `1px solid ${color}22` }}
            >
              <Ico className="w-5 h-5" style={{ color }} strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-tight" style={{ color: TOKENS.text }}>{label}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Mono style={{ color: TOKENS.textMuted }}>{rows.toLocaleString()} rows</Mono>
                <span className="w-0.5 h-0.5 rounded-full" style={{ background: TOKENS.textMuted }} />
                <Mono style={{ color: TOKENS.textMuted }}>{size}</Mono>
              </div>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Description */}
        <p className="text-[12px] leading-relaxed mb-4" style={{ color: TOKENS.textSubtle }}>{description}</p>

        {/* Sheets */}
        <div className="flex items-center gap-1.5 flex-wrap mb-5">
          <span className="text-[9px] font-black uppercase tracking-widest mr-1" style={{ color: TOKENS.textMuted }}>Sheets:</span>
          {sheets.map((s: string, i: number) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-bold"
              style={{ background: 'rgba(0,0,0,0.04)', color: TOKENS.textSubtle, border: `1px solid ${TOKENS.divider}`, fontSize: 10 }}
            >
              <Table2 className="w-2.5 h-2.5" strokeWidth={2.5} />
              {s}
            </span>
          ))}
        </div>

        {/* Last generated */}
        {relTime ? (
          <div
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg mb-5"
            style={{ background: 'rgba(0,0,0,0.03)', border: `1px solid ${TOKENS.divider}` }}
          >
            <Clock className="w-3 h-3 flex-shrink-0" style={{ color: TOKENS.textMuted }} strokeWidth={2.5} />
            <span className="text-[11px] font-bold" style={{ color: TOKENS.textMuted }}>
              Terakhir dibuat <span style={{ color: TOKENS.text }}>{relTime}</span>
            </span>
          </div>
        ) : (
          <div
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg mb-5"
            style={{ background: 'rgba(0,0,0,0.025)', border: `1px solid ${TOKENS.divider}` }}
          >
            <Info className="w-3 h-3 flex-shrink-0" style={{ color: TOKENS.textMuted }} strokeWidth={2.5} />
            <span className="text-[11px] font-bold" style={{ color: TOKENS.textMuted }}>Belum pernah digenerate</span>
          </div>
        )}

        {/* Download buttons */}
        <div className="flex items-center gap-2">
          <DownloadButton
            format="Excel"
            color="#047857"
            loading={isLoading('excel')}
            onClick={() => onDownload(id, 'excel')}
          />
          <DownloadButton
            format="CSV"
            color="#0369a1"
            loading={isLoading('csv')}
            onClick={() => onDownload(id, 'csv')}
          />
        </div>
      </div>
    </div>
  );
};
