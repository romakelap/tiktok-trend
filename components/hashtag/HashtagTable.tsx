import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Hash, Flame, TrendingUp, TrendingDown, Layers, ArrowUp, ArrowDown } from "lucide-react";
import { Tag, fmt, getTrendConfig, CAT_COLORS } from "@/lib/hashtag/mock-data";
import { CAT_ICONS } from "./CategorySelector";

interface HashtagTableProps {
  tags: Tag[];
  activeCategory: string;
}

type SortField = 'tag' | 'category' | 'uses' | 'views' | 'engagement' | 'growth';
type SortOrder = 'asc' | 'desc';

export function HashtagTable({ tags, activeCategory }: HashtagTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('uses');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const filteredTags = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return tags;
    return tags.filter(t => 
      t.tag.toLowerCase().includes(q) || 
      (t.category && t.category.toLowerCase().includes(q))
    );
  }, [tags, searchQuery]);

  const sortedTags = useMemo(() => {
    return [...filteredTags].sort((a, b) => {
      let valA: any = a[sortField === 'views' ? 'avgViews' : sortField === 'growth' ? 'weekGrowth' : sortField];
      let valB: any = b[sortField === 'views' ? 'avgViews' : sortField === 'growth' ? 'weekGrowth' : sortField];

      // Handle category fallback if undefined
      if (sortField === 'category') {
        valA = a.category || '';
        valB = b.category || '';
      }

      if (valA === undefined || valA === null) valA = 0;
      if (valB === undefined || valB === null) valB = 0;

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
  }, [filteredTags, sortField, sortOrder]);

  // Pagination calculation
  const totalItems = sortedTags.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedTags = useMemo(() => {
    return sortedTags.slice(startIndex, endIndex);
  }, [sortedTags, startIndex, endIndex]);

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

  return (
    <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden">
      <div className="p-6">
        {/* Header with Search and Page info */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-black text-base text-stone-900 dark:text-white">
              Detail Hashtag Directory
            </h2>
            <p className="text-xs text-stone-500 dark:text-neutral-400">
              Menampilkan <span className="font-mono font-bold text-stone-700 dark:text-neutral-300">{fmt(totalItems)}</span> hashtag hasil filter
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Table Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari dalam tabel..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-48 sm:w-56 px-3.5 py-1.5 pl-8 rounded-xl text-xs outline-none bg-stone-50 dark:bg-neutral-800 border border-stone-200/80 dark:border-neutral-700 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-neutral-500 focus:border-stone-400 transition-colors"
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
                <th onClick={() => handleSort('tag')} className="p-3.5 font-bold cursor-pointer hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors select-none">
                  <div className="flex items-center">
                    Hashtag
                    {renderSortIcon('tag')}
                  </div>
                </th>
                {activeCategory === 'All' && (
                  <th onClick={() => handleSort('category')} className="p-3.5 font-bold cursor-pointer hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors select-none">
                    <div className="flex items-center">
                      Kategori
                      {renderSortIcon('category')}
                    </div>
                  </th>
                )}
                <th onClick={() => handleSort('uses')} className="p-3.5 font-bold cursor-pointer hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors select-none text-right">
                  <div className="flex items-center justify-end">
                    Penggunaan (Uses)
                    {renderSortIcon('uses')}
                  </div>
                </th>
                <th onClick={() => handleSort('views')} className="p-3.5 font-bold cursor-pointer hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors select-none text-right">
                  <div className="flex items-center justify-end">
                    Rata-rata Tayangan
                    {renderSortIcon('views')}
                  </div>
                </th>
                <th onClick={() => handleSort('engagement')} className="p-3.5 font-bold cursor-pointer hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors select-none text-right">
                  <div className="flex items-center justify-end">
                    Eng. Rate
                    {renderSortIcon('engagement')}
                  </div>
                </th>
                <th onClick={() => handleSort('growth')} className="p-3.5 font-bold cursor-pointer hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors select-none text-right">
                  <div className="flex items-center justify-end">
                    Pertumbuhan 7h
                    {renderSortIcon('growth')}
                  </div>
                </th>
                <th className="p-3.5 font-bold text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-neutral-800/80">
              {paginatedTags.map((tag, idx) => {
                const tc = getTrendConfig(tag.trend);
                const gPos = (tag.weekGrowth || 0) >= 0;

                return (
                  <tr
                    key={tag.tag + idx}
                    className="hover:bg-stone-50/60 dark:hover:bg-neutral-850/40 transition-colors"
                  >
                    {/* Hashtag Name */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 dark:text-white">
                          {tag.tag}
                        </span>
                      </div>
                    </td>

                    {/* Category (if All) */}
                    {activeCategory === 'All' && (
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 dark:bg-neutral-800 text-stone-700 dark:text-neutral-300 border border-stone-200/60 dark:border-neutral-700">
                          {tag.category || 'General'}
                        </span>
                      </td>
                    )}

                    {/* Uses */}
                    <td className="p-3.5 text-right font-mono font-bold text-stone-900 dark:text-white">
                      {fmt(tag.uses)}
                    </td>

                    {/* Avg Views */}
                    <td className="p-3.5 text-right font-mono text-stone-600 dark:text-neutral-300">
                      {fmt(tag.avgViews)}
                    </td>

                    {/* Engagement */}
                    <td className="p-3.5 text-right font-mono text-stone-600 dark:text-neutral-300">
                      {tag.engagement}%
                    </td>

                    {/* Growth */}
                    <td className="p-3.5 text-right">
                      <span className={`font-mono font-bold ${gPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {gPos ? '+' : ''}{tag.weekGrowth}%
                      </span>
                    </td>

                    {/* Trend Status */}
                    <td className="p-3.5 text-center">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold"
                        style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}
                      >
                        {tag.trend === 'hot' ? <Flame className="w-2.5 h-2.5 fill-current" />
                          : tag.trend === 'up' ? <TrendingUp className="w-2.5 h-2.5" />
                          : tag.trend === 'down' ? <TrendingDown className="w-2.5 h-2.5" />
                          : null}
                        {tc.label}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {paginatedTags.length === 0 && (
                <tr>
                  <td colSpan={activeCategory === 'All' ? 7 : 6} className="p-8 text-center text-stone-400 dark:text-neutral-500">
                    Tidak ada data hashtag yang sesuai dengan kriteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-stone-100 dark:border-neutral-800">
          <span className="text-xs text-stone-400 dark:text-neutral-500">
            Menampilkan <span className="font-mono font-bold text-stone-700 dark:text-neutral-300">{startIndex + 1}</span> - <span className="font-mono font-bold text-stone-700 dark:text-neutral-300">{endIndex}</span> dari <span className="font-mono font-bold text-stone-700 dark:text-neutral-300">{totalItems}</span> baris
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
                // Windowing around current page
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
