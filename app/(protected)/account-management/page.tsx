'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search, Plus, Filter, ChevronDown, LayoutGrid, Rows3,
  Users, ArrowUpRight, RefreshCw, AlertCircle, Target
} from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { TOKENS } from '@/lib/design-tokens';
import { GridBg } from '@/components/layout/GridBg';
import { TYPE_META, formatNum } from '@/lib/account-management/mock-data';
import { Account, getTrackedAccounts } from '@/lib/account-management/api';
import { AccountKpis } from '@/components/account-management/AccountKpis';
import { AccountCard } from '@/components/account-management/AccountCard';
import { AccountAvatar } from '@/components/account-management/AccountAvatar';
import { Sparkline } from '@/components/account-management/Sparkline';
import { BenchmarkingPanel } from '@/components/account-management/BenchmarkingPanel';
import { AccountCompareChart } from '@/components/account-management/AccountCompareChart';
import { CompareModal } from '@/components/account-management/CompareModal';
import { exportComparisonToPDF } from '@/lib/account-management/export-compare-pdf';

export default function AccountManagementPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountList, setAccountList] = useState<Account[]>([]);
  const [comparisonAccounts, setComparisonAccounts] = useState<Account[] | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Tab count metadata states (so badges show actual database counts)
  const [kpis, setKpis] = useState({
    total: 0,
    ownCount: 0,
    compCount: 0,
    inspCount: 0,
    myFollowers: 0,
    avgCompFollowers: 0,
    avgEngagement: '0.0',
  });

  // Debounced search query to prevent hammering the backend on every keypress
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(0); // Reset page to 0 when search changes
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [activeFilter]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getTrackedAccounts(currentPage, 15, debouncedSearch, activeFilter)
      .then(res => {
        if (!active) return;
        setAccountList(res.content);
        setTotalPages(res.totalPages || 1);
        setTotalElements(res.totalElements || 0);

        if (res.summary) {
          setKpis({
            total: res.summary.totalAll || 0,
            ownCount: res.summary.totalOwn || 0,
            compCount: res.summary.totalCompetitor || 0,
            inspCount: res.summary.totalInspiration || 0,
            myFollowers: res.summary.myFollowers || 0,
            avgCompFollowers: res.summary.avgCompetitorFollowers || 0,
            avgEngagement: res.summary.avgEngagement ? res.summary.avgEngagement.toFixed(1) : '0.0',
          });
        }
      })
      .catch((err: unknown) => {
        if (!active) return;
        const msg = err instanceof Error ? err.message : "Gagal memuat data akun pelacakan";
        setError(msg);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [currentPage, debouncedSearch, activeFilter, refreshKey]);

  // Assign filtered directly to accountList since filter/search happens on backend
  const filtered = accountList;

  const markAsCompetitor = (account: Account) => {
    setAccountList(prev => prev.map(a =>
      a.id === account.id
        ? { ...a, type: a.type === 'competitor' ? 'inspiration' : 'competitor' }
        : a
    ));
  };



  const handleCompare = (main: Account, competitors: Account[]) => {
    const combined = [
      { ...main, type: 'own' as const },
      ...competitors.map(c => ({ ...c, type: 'competitor' as const }))
    ];
    setComparisonAccounts(combined);

    setTimeout(() => {
      const el = document.getElementById('account-benchmarking');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleExportPDF = () => {
    const listToExport = comparisonAccounts || accountList;
    if (listToExport.length > 0) {
      exportComparisonToPDF(listToExport);
    }
  };


  return (
    <PageShell title="Account Management">
      <div className="p-6 space-y-6">
        {/* Header bar within content */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2">
          <div>
            <h1 className="text-xl font-black flex items-center gap-2 tracking-tight" style={{ color: TOKENS.text }}>
              Account Management
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-white" style={{ background: '#111' }}>
                {kpis.total} akun
              </span>
            </h1>
            <p className="text-xs" style={{ color: TOKENS.textMuted }}>
              Kelola dan bandingkan performa akun TikTok yang Anda lacak.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: TOKENS.textMuted }} strokeWidth={2.4} />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari akun..."
                className="w-60 pl-9 h-10 rounded-xl text-sm"
                style={{ background: TOKENS.input, border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.text }}
              />
            </div>
            <Button
              onClick={() => setCompareModalOpen(true)}
              className="h-10 rounded-xl px-4 font-black text-sm"
              style={{ background: TOKENS.accent, color: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
            >
              <Target className="w-4 h-4 mr-1.5" strokeWidth={2.5} />
              Bandingkan Akun
            </Button>
          </div>
        </div>

        {loading ? (
          <div
            className="flex flex-col items-center justify-center py-24 gap-3 rounded-2xl border"
            style={{
              background: TOKENS.cardSoft,
              borderColor: TOKENS.cardBorder,
              minHeight: '300px',
            }}
          >
            <RefreshCw className="w-8 h-8 animate-spin" style={{ color: TOKENS.accent }} strokeWidth={2.4} />
            <p className="text-sm font-black" style={{ color: TOKENS.text }}>Memuat data akun…</p>
            <p className="text-xs" style={{ color: TOKENS.textMuted }}>Sedang menyinkronkan dengan backend.</p>
          </div>
        ) : error ? (
          <div
            className="flex flex-col items-center justify-center py-20 px-6 gap-3 rounded-2xl border text-center"
            style={{
              background: TOKENS.negativeBg,
              borderColor: 'rgba(185,28,28,0.18)',
              minHeight: '300px',
            }}
          >
            <AlertCircle className="w-10 h-10" style={{ color: TOKENS.negative }} strokeWidth={2} />
            <p className="text-sm font-black" style={{ color: TOKENS.text }}>Gagal Memuat Akun Pelacakan</p>
            <p className="text-xs max-w-md leading-relaxed" style={{ color: TOKENS.textSubtle }}>{error}</p>
            <Button
              onClick={() => setRefreshKey(prev => prev + 1)}
              className="mt-2 h-9 rounded-xl px-4 font-black text-xs"
              style={{ background: '#111', color: '#fff' }}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} />
              Coba Lagi
            </Button>
          </div>
        ) : (
          <>
            {/* ── 1. KPI Row ───────────────────────────────────────── */}
            <div id="account-kpis">
              <AccountKpis kpis={kpis} />
            </div>

            {/* ── 2. Filter Bar + Account Grid ────────────────────── */}
            <div
              id="account-list-container"
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: TOKENS.cardSoft,
                border: `1px solid ${TOKENS.cardBorder}`,
                boxShadow: '0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
              }}
            >
              <GridBg theme="light" />

              <div className="relative z-10">
                {/* Filter bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4" style={{ borderBottom: `1px solid ${TOKENS.divider}` }}>
                  <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ background: 'rgba(0,0,0,0.04)', border: `1px solid ${TOKENS.inputBorder}` }}>
                    {[
                      { key: 'all',          label: 'Semua',       count: kpis.total       },
                      { key: 'own',          label: 'Akun Saya',   count: kpis.ownCount    },
                      { key: 'competitor',   label: 'Kompetitor',  count: kpis.compCount   },
                      { key: 'inspiration',  label: 'Inspirasi',   count: kpis.inspCount   },
                    ].map(f => {
                      const active = activeFilter === f.key;
                      return (
                        <button
                          key={f.key}
                          onClick={() => setActiveFilter(f.key)}
                          className="px-3 py-1.5 rounded-lg text-xs font-black transition-all duration-200 flex items-center gap-1.5"
                          style={{
                            background: active ? '#fff' : 'transparent',
                            color: active ? TOKENS.text : TOKENS.textMuted,
                            boxShadow: active ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
                            border: active ? `1px solid ${TOKENS.inputBorder}` : '1px solid transparent',
                          }}
                        >
                          {f.label}
                          <span
                            className="px-1.5 py-0 rounded text-[10px] font-black"
                            style={{
                              background: active ? '#111' : 'rgba(0,0,0,0.08)',
                              color: active ? '#fff' : TOKENS.textMuted,
                            }}
                          >
                            {f.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 rounded-xl text-xs font-bold"
                      style={{ background: '#fff', border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.text }}
                    >
                      <Filter className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} />
                      Filter
                      <ChevronDown className="w-3 h-3 ml-1" strokeWidth={2.5} />
                    </Button>
                    <div className="flex p-0.5 rounded-xl" style={{ background: 'rgba(0,0,0,0.04)', border: `1px solid ${TOKENS.inputBorder}` }}>
                      <button
                        onClick={() => setViewMode('grid')}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                        style={{
                          background: viewMode === 'grid' ? '#fff' : 'transparent',
                          color: viewMode === 'grid' ? TOKENS.text : TOKENS.textMuted,
                          boxShadow: viewMode === 'grid' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                        }}
                      >
                        <LayoutGrid className="w-3.5 h-3.5" strokeWidth={2.4} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                        style={{
                          background: viewMode === 'list' ? '#fff' : 'transparent',
                          color: viewMode === 'list' ? TOKENS.text : TOKENS.textMuted,
                          boxShadow: viewMode === 'list' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                        }}
                      >
                        <Rows3 className="w-3.5 h-3.5" strokeWidth={2.4} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Account display */}
                <div className="p-6">
                  {filtered.length === 0 ? (
                    <div className="text-center py-16">
                      <div
                        className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                        style={{ background: 'rgba(0,0,0,0.04)', border: `1px solid ${TOKENS.divider}` }}
                      >
                        <Users className="w-6 h-6" style={{ color: TOKENS.textMuted }} strokeWidth={1.8} />
                      </div>
                      <p className="font-black text-sm mb-1" style={{ color: TOKENS.text }}>Tidak ada akun ditemukan</p>
                      <p className="text-xs" style={{ color: TOKENS.textMuted }}>Coba ubah filter atau tambahkan akun baru</p>
                    </div>
                  ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                      {filtered.map(a => (
                        <AccountCard key={a.id} account={a} onMark={markAsCompetitor} />
                      ))}
                    </div>
                  ) : (
                    <div className="overflow-x-auto -mx-6">
                      <table className="w-full min-w-[800px]">
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${TOKENS.divider}` }}>
                            {['Akun', 'Followers', 'Video', 'Engagement', 'Trend', ''].map((h, i) => (
                              <th
                                key={i}
                                className="text-left text-[10px] font-black uppercase tracking-widest px-6 py-3"
                                style={{ color: TOKENS.textMuted }}
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map((a, idx) => {
                            const meta = TYPE_META[a.type];
                            const isPos = a.growthPct >= 0;
                            return (
                              <tr
                                key={a.id}
                                className="transition-colors hover:bg-black/[0.02]"
                                style={{ borderBottom: idx < filtered.length - 1 ? `1px solid ${TOKENS.divider}` : 'none' }}
                              >
                                <td className="px-6 py-3">
                                  <div className="flex items-center gap-3">
                                    <AccountAvatar account={a} size={36} />
                                    <div>
                                      <a
                                        href={`https://www.tiktok.com/@${a.username}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-black text-sm hover:underline transition-colors"
                                        style={{ color: TOKENS.text }}
                                      >
                                        @{a.username}
                                      </a>
                                      <p className="text-[11px]" style={{ color: TOKENS.textMuted }}>{a.displayName}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-3">
                                  <p className="font-black text-sm" style={{ color: TOKENS.text }}>{formatNum(a.followers)}</p>
                                </td>
                                <td className="px-6 py-3">
                                  <p className="font-bold text-sm" style={{ color: TOKENS.textSubtle }}>{a.videos}</p>
                                </td>
                                <td className="px-6 py-3">
                                  <span
                                    className="font-black text-sm"
                                    style={{ color: a.avgEngagement >= 6 ? TOKENS.positive : TOKENS.text }}
                                  >
                                    {a.avgEngagement}%
                                  </span>
                                </td>
                                <td className="px-6 py-3">
                                  <div className="flex items-center gap-2">
                                    <Sparkline data={a.trend} color={meta.solid} width={64} height={22} />
                                    <span className="text-xs font-black" style={{ color: isPos ? TOKENS.positive : TOKENS.negative }}>
                                      {isPos ? '+' : ''}{a.growthPct}%
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-3 text-right">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 rounded-lg text-xs font-bold"
                                    style={{ background: '#fff', border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.text }}
                                  >
                                    Detail
                                    <ArrowUpRight className="w-3 h-3 ml-1" strokeWidth={2.5} />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Pagination Footer */}
                {filtered.length > 0 && (
                  <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: `1px solid ${TOKENS.divider}` }}>
                    <p className="text-xs" style={{ color: TOKENS.textMuted }}>
                      Menampilkan <span className="font-bold">{currentPage * 15 + 1}</span> - <span className="font-bold">{Math.min((currentPage + 1) * 15, totalElements)}</span> dari <span className="font-bold">{totalElements}</span> akun
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-xs font-bold"
                        style={{ background: '#fff', border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.text }}
                      >
                        Sebelumnya
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => {
                          const isCurrent = currentPage === i;
                          const shouldShow = i === 0 || i === totalPages - 1 || Math.abs(currentPage - i) <= 1;

                          if (!shouldShow) {
                            if (i === 1 || i === totalPages - 2) {
                              return <span key={i} className="text-xs px-1 font-bold text-gray-400">...</span>;
                            }
                            return null;
                          }

                          return (
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i)}
                              className="w-7 h-7 rounded-lg text-xs font-black transition-all"
                              style={{
                                background: isCurrent ? '#111' : 'transparent',
                                color: isCurrent ? '#fff' : TOKENS.textMuted,
                                border: isCurrent ? '1px solid #111' : '1px solid transparent',
                              }}
                            >
                              {i + 1}
                            </button>
                          );
                        })}
                      </div>
                      <Button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                        disabled={currentPage >= totalPages - 1}
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-xs font-bold"
                        style={{ background: '#fff', border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.text }}
                      >
                        Selanjutnya
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div id="account-benchmarking" className="space-y-6">
              <AccountCompareChart accountList={comparisonAccounts || accountList} />
              <BenchmarkingPanel accountList={comparisonAccounts || accountList} onExport={handleExportPDF} />
            </div>
          </>
        )}
      </div>


      <CompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        onCompare={handleCompare}
      />
    </PageShell>
  );
}