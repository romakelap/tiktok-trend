import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Flame, TrendingUp, TrendingDown, Minus, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { KeywordItem, formatNum, getTypeLabel } from '@/lib/keyword/mock-data';

interface Top50TableProps {
  keywords: KeywordItem[];
  searchQuery: string;
}

type SortField = 'rank' | 'keyword' | 'type' | 'frequency' | 'avgViews' | 'engagement' | 'trend';
type SortOrder = 'asc' | 'desc';

export function Top50Table({ keywords, searchQuery }: Top50TableProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const query = (localSearch || searchQuery).toLowerCase().trim();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'rank' ? 'asc' : 'desc');
    }
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    if (!query) return keywords;
    return keywords.filter(k =>
      k.keyword.toLowerCase().includes(query) ||
      k.type.toLowerCase().includes(query)
    );
  }, [keywords, query]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        return sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return sortOrder === 'asc'
          ? valA - valB
          : valB - valA;
      }
    });
  }, [filtered, sortField, sortOrder]);

  // Pagination calculation
  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginated = useMemo(() => {
    return sorted.slice(startIndex, endIndex);
  }, [sorted, startIndex, endIndex]);

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p);
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-stone-300 dark:text-neutral-600 ml-1" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-stone-900 dark:text-white ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-stone-900 dark:text-white ml-1" />
    );
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'hook':
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200/60 dark:border-sky-800/60';
      case 'brand':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/60';
      case 'action':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60';
      case 'emotion':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/60';
      default:
        return 'bg-stone-50 text-stone-700 dark:bg-neutral-800 dark:text-neutral-300 border-stone-200/60';
    }
  };

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'hot':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60">
            <Flame className="w-2.5 h-2.5 fill-current" /> HOT
          </span>
        );
      case 'up':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60">
            <TrendingUp className="w-2.5 h-2.5" /> NAIK
          </span>
        );
      case 'down':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60">
            <TrendingDown className="w-2.5 h-2.5" /> TURUN
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-stone-100 text-stone-600 dark:bg-neutral-800 dark:text-neutral-400 border border-stone-200/60">
            <Minus className="w-2.5 h-2.5" /> STABIL
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden">
      <div className="p-6">
        {/* Header with Search and Page info */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-black text-base text-stone-900 dark:text-white">
              Direktori Top 50 Keywords
            </h2>
            <p className="text-xs text-stone-500 dark:text-neutral-400">
              Menampilkan <span className="font-mono font-bold text-stone-700 dark:text-neutral-300">{totalItems}</span> kata kunci hasil filter kategori
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Table Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari dalam tabel..."
                value={localSearch}
                onChange={e => {
                  setLocalSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-48 sm:w-56 px-3.5 py-1.5 pl-8 rounded-xl text-xs outline-none bg-stone-50 dark:bg-neutral-800 border border-stone-200/80 dark:border-neutral-700 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-neutral-500 focus:border-sky-500 transition-colors"
              />
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                <Search className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Page Size Selector */}
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-xl text-xs outline-none border border-stone-200/80 dark:border-neutral-700 bg-stone-50 dark:bg-neutral-800 text-stone-700 dark:text-neutral-300 cursor-pointer font-bold"
            >
              <option value={10}>10 Baris</option>
              <option value={25}>25 Baris</option>
              <option value={50}>50 Baris</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto w-full border border-stone-200/80 dark:border-neutral-800 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 dark:bg-neutral-850/80 border-b border-stone-200/80 dark:border-neutral-800 text-stone-600 dark:text-neutral-400">
                <th onClick={() => handleSort('rank')} className="p-3.5 font-bold cursor-pointer hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors select-none w-16">
                  <div className="flex items-center">
                    #
                    {renderSortIcon('rank')}
                  </div>
                </th>
                <th onClick={() => handleSort('keyword')} className="p-3.5 font-bold cursor-pointer hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors select-none">
                  <div className="flex items-center">
                    Kata Kunci / Hook
                    {renderSortIcon('keyword')}
                  </div>
                </th>
                <th onClick={() => handleSort('type')} className="p-3.5 font-bold cursor-pointer hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors select-none text-center">
                  <div className="flex items-center justify-center">
                    Tipe
                    {renderSortIcon('type')}
                  </div>
                </th>
                <th onClick={() => handleSort('frequency')} className="p-3.5 font-bold cursor-pointer hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors select-none text-right">
                  <div className="flex items-center justify-end">
                    Penggunaan (Freq %)
                    {renderSortIcon('frequency')}
                  </div>
                </th>
                <th onClick={() => handleSort('avgViews')} className="p-3.5 font-bold cursor-pointer hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors select-none text-right">
                  <div className="flex items-center justify-end">
                    Rata-rata Tayangan
                    {renderSortIcon('avgViews')}
                  </div>
                </th>
                <th onClick={() => handleSort('engagement')} className="p-3.5 font-bold cursor-pointer hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors select-none text-right">
                  <div className="flex items-center justify-end">
                    Eng. Rate
                    {renderSortIcon('engagement')}
                  </div>
                </th>
                <th className="p-3.5 font-bold text-center">
                  Status Tren
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-neutral-800/80">
              {paginated.map((kw) => {
                const isNo1 = kw.rank === 1;

                return (
                  <tr
                    key={kw.rank}
                    className="hover:bg-stone-50/60 dark:hover:bg-neutral-850/40 transition-colors"
                  >
                    {/* Rank */}
                    <td className="p-3.5 font-mono font-bold">
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] ${
                          isNo1
                            ? 'bg-sky-600 text-white shadow-2xs'
                            : 'bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-400'
                        }`}
                      >
                        {kw.rank}
                      </span>
                    </td>

                    {/* Keyword Name */}
                    <td className="p-3.5 font-bold text-stone-900 dark:text-white">
                      &quot;{kw.keyword}&quot;
                    </td>

                    {/* Type Badge */}
                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize ${getTypeStyle(kw.type)}`}>
                        {kw.type}
                      </span>
                    </td>

                    {/* Frequency */}
                    <td className="p-3.5 text-right font-mono font-bold text-sky-600 dark:text-sky-400">
                      {kw.frequency}%
                    </td>

                    {/* Avg Views */}
                    <td className="p-3.5 text-right font-mono text-stone-600 dark:text-neutral-300">
                      {formatNum(kw.avgViews)}
                    </td>

                    {/* Engagement */}
                    <td className="p-3.5 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                      {kw.engagement.toFixed(1)}%
                    </td>

                    {/* Trend Badge */}
                    <td className="p-3.5 text-center">
                      {getTrendBadge(kw.trend)}
                    </td>
                  </tr>
                );
              })}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-400 dark:text-neutral-500">
                    Tidak ada data kata kunci yang cocok dengan kriteria pencarian
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-stone-100 dark:border-neutral-800">
          <span className="text-xs text-stone-400 dark:text-neutral-500">
            Menampilkan <span className="font-mono font-bold text-stone-700 dark:text-neutral-300">{totalItems > 0 ? startIndex + 1 : 0}</span> - <span className="font-mono font-bold text-stone-700 dark:text-neutral-300">{endIndex}</span> dari <span className="font-mono font-bold text-stone-700 dark:text-neutral-300">{totalItems}</span> kata kunci
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 text-stone-600 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 font-mono text-xs">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  p = currentPage - 2 + i;
                  if (p > totalPages) p = totalPages - (4 - i);
                }
                const isActive = p === currentPage;

                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-7 h-7 rounded-lg font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-2xs'
                        : 'text-stone-600 dark:text-neutral-400 hover:bg-stone-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 text-stone-600 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
