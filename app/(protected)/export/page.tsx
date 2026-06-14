'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { TOKENS } from '@/lib/design-tokens';
import { GridBg } from '@/components/layout/GridBg';
import {
  ExportType, ExportHistoryItem, EXPORT_TYPES
} from '@/lib/export/mock-data';
import { SummaryStrip } from '@/components/export/SummaryStrip';
import { ExportCard } from '@/components/export/ExportCard';
import { ExportHistoryTable } from '@/components/export/ExportHistoryTable';
import { BulkActionBar } from '@/components/export/BulkActionBar';
import { Toast } from '@/components/export/Toast';
import { apiFetch, downloadFile } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/endpoints';

function formatBytes(bytes: number, decimals = 1) {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function ExportPage() {
  const [loadingId, setLoadingId]     = useState<string | null>(null);
  const [history, setHistory]         = useState<ExportHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [toasts, setToasts]           = useState<{ id: number; title: string; message: string; success: boolean }[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const toastId = useRef(0);

  const addToast = (title: string, message: string, success = true) => {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, title, message, success }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await apiFetch<any[]>(API_ENDPOINTS.export.history, { method: 'GET' });
      if (res && res.success && Array.isArray(res.data)) {
        const mapped: ExportHistoryItem[] = res.data.map(item => {
          const sizeStr = item.fileSizeBytes ? formatBytes(item.fileSizeBytes) : '0 KB';
          const typeStr = item.exportFormat === 'xlsx' ? 'Excel' : 'CSV';
          let label = 'Content Performance';
          if (item.exportType === 'video_list') label = 'Content Performance';
          else if (item.exportType === 'accounts') label = 'Account Analytics';
          else if (item.exportType) label = item.exportType;
          return {
            id: String(item.exportId),
            name: item.fileName,
            type: typeStr as 'Excel' | 'CSV',
            exportType: label,
            size: sizeStr,
            ts: item.completedAt || item.requestedAt || new Date().toISOString(),
            user: 'User',
            status: item.status === 'completed' ? 'done' : 'failed'
          };
        });
        setHistory(mapped);
      }
    } catch (err) {
      console.error("Failed to load export history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDownload = async (exportId: string, fmt: 'excel' | 'csv') => {
    const key = `${exportId}-${fmt}`;
    setLoadingId(key);

    const exp = EXPORT_TYPES.find(e => e.id === exportId);
    if (!exp) return;
    const fmtLabel = fmt === 'excel' ? 'Excel' : 'CSV';
    const ext = fmt === 'excel' ? 'xlsx' : 'csv';
    const filename = `${exportId}_export_${new Date().toISOString().split('T')[0]}.${ext}`;

    try {
      const endpoint = fmt === 'excel' ? API_ENDPOINTS.export.excel : API_ENDPOINTS.export.csv;
      await downloadFile(endpoint, filename);
      addToast(`Download Berhasil`, `${exp.label} · ${fmtLabel} telah diunduh`, true);
      await fetchHistory();
    } catch (error: any) {
      addToast(`Download Gagal`, error.message || 'Gagal mengunduh file', false);
    } finally {
      setLoadingId(null);
    }
  };

  const handleHistoryDownload = async (name: string, type: 'Excel' | 'CSV') => {
    const fmt = type === 'Excel' ? 'excel' : 'csv';
    const filename = name;
    try {
      const endpoint = fmt === 'excel' ? API_ENDPOINTS.export.excel : API_ENDPOINTS.export.csv;
      await downloadFile(endpoint, filename);
      addToast(`Download Berhasil`, `${filename} telah diunduh`, true);
      await fetchHistory();
    } catch (error: any) {
      addToast(`Download Gagal`, error.message || 'Gagal mengunduh file', false);
    }
  };

  const handleBulkDownload = async (fmt: 'excel' | 'csv') => {
    const fmtLabel = fmt === 'excel' ? 'Excel' : 'CSV';
    const ext = fmt === 'excel' ? 'xlsx' : 'csv';

    try {
      const endpoint = fmt === 'excel' ? API_ENDPOINTS.export.excel : API_ENDPOINTS.export.csv;
      const filename = `bulk_video_export_${new Date().toISOString().split('T')[0]}.${ext}`;
      await downloadFile(endpoint, filename);
      addToast(`Bulk Export Berhasil`, `Semua data ${fmtLabel} telah diunduh`, true);
      await fetchHistory();
    } catch (error: any) {
      addToast(`Bulk Export Gagal`, error.message || 'Gagal melakukan bulk export', false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(API_ENDPOINTS.export.delete(id), { method: 'DELETE' });
      addToast('File Dihapus', 'File berhasil dihapus dari riwayat', true);
      await fetchHistory();
    } catch (error: any) {
      addToast('Gagal Menghapus', error.message || 'Gagal menghapus file dari riwayat', false);
    }
  };

  const statuses = ['all', 'ready', 'stale', 'not_generated'];
  const statusLabel: Record<string, string> = { all: 'Semua', ready: 'Siap', stale: 'Kedaluwarsa', not_generated: 'Belum Dibuat' };

  const filteredExports = filterStatus === 'all'
    ? EXPORT_TYPES
    : EXPORT_TYPES.filter(e => e.status === filterStatus);

  const handleToastDismiss = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <PageShell title="Export">
      <div className="p-6 space-y-6">
        {/* Header Title Info within content area */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2">
          <div>
            <h1 className="text-xl font-black flex items-center gap-2 tracking-tight" style={{ color: TOKENS.text }}>
              Export
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-white" style={{ background: '#111' }}>
                Data Manager
              </span>
            </h1>
            <p className="text-xs" style={{ color: TOKENS.textMuted }}>
              Download dataset analytics dalam format Excel atau CSV.
            </p>
          </div>
        </div>

        {/* Summary Strip Grid */}
        <div id="export-summary">
          <SummaryStrip exports={EXPORT_TYPES} />
        </div>

        {/* Export Options Grid */}
        <div
          id="export-datasets"
          className="relative rounded-2xl p-6 overflow-hidden"
          style={{
            background: TOKENS.cardSoft,
            border: `1px solid ${TOKENS.cardBorder}`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
          }}
        >
          <GridBg theme="light" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-black text-base tracking-tight" style={{ color: TOKENS.text }}>Dataset Option</h2>
                <p className="text-xs" style={{ color: TOKENS.textMuted }}>Pilih kategori dataset yang ingin diunduh</p>
              </div>

              {/* Status filter tabs */}
              <div className="flex items-center gap-1 p-0.5 rounded-xl" style={{ background: 'rgba(0,0,0,0.04)', border: `1px solid ${TOKENS.inputBorder}` }}>
                {statuses.map(s => {
                  const active = filterStatus === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className="px-3 py-1.5 rounded-lg text-xs font-black transition-all"
                      style={{
                        background: active ? '#fff' : 'transparent',
                        color: active ? TOKENS.text : TOKENS.textMuted,
                        boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                      }}
                    >
                      {statusLabel[s]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List of cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredExports.map(exp => (
                <ExportCard
                  key={exp.id}
                  exp={exp}
                  onDownload={handleDownload}
                  loadingId={loadingId}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bulk Action Bar */}
        <div id="export-bulk">
          <BulkActionBar onBulkDownload={handleBulkDownload} />
        </div>

        {/* History Table */}
        <div id="export-history">
          <ExportHistoryTable history={history} onDelete={handleDelete} onDownload={handleHistoryDownload} />
        </div>
      </div>

      {/* Toasts */}
      <Toast toasts={toasts} onDismiss={handleToastDismiss} />
    </PageShell>
  );
}