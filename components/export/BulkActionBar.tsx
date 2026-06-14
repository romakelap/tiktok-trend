import React, { useState } from 'react';
import { Layers, FileSpreadsheet, FileText, RefreshCw } from 'lucide-react';
import { GridBg } from '@/components/layout/GridBg';

interface BulkActionBarProps {
  onBulkDownload?: (fmt: 'excel' | 'csv') => Promise<void>;
}

export const BulkActionBar = ({ onBulkDownload }: BulkActionBarProps) => {
  const [bulkLoading, setBulkLoading] = useState<'excel' | 'csv' | null>(null);

  const handle = async (fmt: 'excel' | 'csv') => {
    setBulkLoading(fmt);
    if (onBulkDownload) {
      await onBulkDownload(fmt);
    } else {
      await new Promise(r => setTimeout(r, 2200));
    }
    setBulkLoading(null);
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden p-5"
      style={{
        background: '#111',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      }}
    >
      <GridBg theme="dark" />
      <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <Layers className="w-5 h-5 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <p className="font-black text-sm text-white tracking-tight">Bulk Export</p>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Download semua dataset sekaligus dalam satu file archive
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handle('excel')}
            disabled={!!bulkLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#047857', color: '#fff', boxShadow: '0 4px 14px rgba(4,120,87,0.4)' }}
          >
            {bulkLoading === 'excel' ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" strokeWidth={2.5} />
            ) : (
              <FileSpreadsheet className="w-3.5 h-3.5" strokeWidth={2.5} />
            )}
            {bulkLoading === 'excel' ? 'Packing…' : 'All as Excel'}
          </button>
          <button
            onClick={() => handle('csv')}
            disabled={!!bulkLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#0369a1', color: '#fff', boxShadow: '0 4px 14px rgba(3,105,161,0.4)' }}
          >
            {bulkLoading === 'csv' ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" strokeWidth={2.5} />
            ) : (
              <FileText className="w-3.5 h-3.5" strokeWidth={2.5} />
            )}
            {bulkLoading === 'csv' ? 'Packing…' : 'All as CSV'}
          </button>
        </div>
      </div>
    </div>
  );
};
