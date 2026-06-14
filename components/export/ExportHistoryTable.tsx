import React, { useState } from 'react';
import { Search, FolderOpen, FileSpreadsheet, FileText, ArrowDownToLine, Trash2, ShieldCheck } from 'lucide-react';
import { GridBg } from '@/components/layout/GridBg';
import { ExportHistoryItem, formatDateTime } from '@/lib/export/mock-data';

interface ExportHistoryTableProps {
  history: ExportHistoryItem[];
  onDelete: (id: string) => void;
  onDownload: (name: string, type: 'Excel' | 'CSV') => void;
}

const Mono = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <span className="font-mono" style={{ fontSize: 11, letterSpacing: '-0.02em', ...style }}>{children}</span>
);

export const ExportHistoryTable = ({ history, onDelete, onDownload }: ExportHistoryTableProps) => {
  const [search, setSearch] = useState('');

  const filtered = history.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.exportType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: '#1c1c1c',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
      }}
    >
      <GridBg theme="dark" />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(255,255,255,0.06) 0%,transparent 70%)',
          top: -100,
          right: -60,
        }}
      />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <FolderOpen className="w-5 h-5 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="font-black text-base text-white tracking-tight">Export History</h2>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {history.length} file · riwayat unduhan terbaru
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.35)' }} strokeWidth={2.5} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari file…"
              className="h-9 pl-8 pr-3 rounded-lg text-xs font-bold outline-none"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                width: 200,
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['File', 'Format', 'Ukuran', 'Waktu', 'Aksi'].map((h, i) => (
                    <th
                      key={i}
                      className="text-left px-4 py-3"
                      style={{
                        fontSize: 9,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        color: 'rgba(255,255,255,0.35)',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-xs font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      Tidak ada file ditemukan
                    </td>
                  </tr>
                ) : (
                  filtered.map((h, i) => (
                    <tr
                      key={h.id}
                      className="group transition-colors hover:bg-white/[0.04]"
                      style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                    >
                      {/* File */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: h.type === 'Excel' ? 'rgba(4,120,87,0.18)' : 'rgba(3,105,161,0.18)',
                            }}
                          >
                            {h.type === 'Excel' ? (
                              <FileSpreadsheet className="w-3.5 h-3.5" style={{ color: '#6ee7b7' }} strokeWidth={2.5} />
                            ) : (
                              <FileText className="w-3.5 h-3.5" style={{ color: '#7dd3fc' }} strokeWidth={2.5} />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-black text-white leading-none mb-0.5">{h.name}</p>
                            <p className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.35)' }}>{h.exportType}</p>
                          </div>
                        </div>
                      </td>

                      {/* Format */}
                      <td className="px-4 py-3.5">
                        <span
                          className="inline-flex items-center px-2 py-1 rounded-md font-black text-[10px] uppercase tracking-wider"
                          style={{
                            background: h.type === 'Excel' ? 'rgba(4,120,87,0.15)' : 'rgba(3,105,161,0.15)',
                            color:      h.type === 'Excel' ? '#6ee7b7'             : '#7dd3fc',
                            border:     h.type === 'Excel' ? '1px solid rgba(4,120,87,0.25)' : '1px solid rgba(3,105,161,0.25)',
                          }}
                        >
                          {h.type}
                        </span>
                      </td>

                      {/* Size */}
                      <td className="px-4 py-3.5">
                        <Mono style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>{h.size}</Mono>
                      </td>

                      {/* Time */}
                      <td className="px-4 py-3.5">
                        <span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          {formatDateTime(h.ts)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onDownload(h.name, h.type)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                            style={{ color: 'rgba(255,255,255,0.5)' }}
                          >
                            <ArrowDownToLine className="w-3.5 h-3.5" strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => onDelete(h.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/20 opacity-0 group-hover:opacity-100"
                            style={{ color: 'rgba(255,255,255,0.4)' }}
                          >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.3)' }} strokeWidth={2.5} />
            <span className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>
              File disimpan selama 30 hari · Semua data terenkripsi
            </span>
          </div>
          <span className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {filtered.length} dari {history.length} file
          </span>
        </div>
      </div>
    </div>
  );
};
