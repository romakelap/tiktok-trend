import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Hash, Flame, TrendingUp, TrendingDown, Layers } from "lucide-react";
import { TOKENS } from "@/lib/design-tokens";
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
  
  // Clean page bounds if size changes
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

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: '#FFFFFF',
        border: `1px solid rgba(0,0,0,0.08)`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)'
      }}
    >
      <div className="p-6">
        {/* Header with Search and Page info */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-black text-lg" style={{ color: TOKENS.text }}>
              Detail Hashtag List
            </h2>
            <p className="text-xs" style={{ color: TOKENS.textMuted }}>
              Tabel perbandingan data lengkap hashtag berdasarkan pencarian & filter kategori
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
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
                className="w-56 px-4 py-2 pl-9 rounded-xl text-xs outline-none"
                style={{
                  background: TOKENS.input,
                  border: `1px solid ${TOKENS.inputBorder}`,
                  color: TOKENS.text,
                }}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: TOKENS.textMuted }}>
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
              className="px-3 py-2 rounded-xl text-xs outline-none border cursor-pointer font-bold"
              style={{
                background: '#FFFFFF',
                borderColor: TOKENS.inputBorder,
                color: TOKENS.text,
              }}
            >
              <option value={10}>10 Baris</option>
              <option value={25}>25 Baris</option>
              <option value={50}>50 Baris</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto w-full border rounded-xl" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr style={{ background: '#F9F8F7', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                {/* Header columns */}
                <th onClick={() => handleSort('tag')} className="p-3.5 font-black cursor-pointer hover:bg-gray-100 transition-colors select-none">
                  <div className="flex items-center gap-1.5">
                    Hashtag
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                
                {activeCategory === 'All' && (
                  <th onClick={() => handleSort('category')} className="p-3.5 font-black cursor-pointer hover:bg-gray-100 transition-colors select-none">
                    <div className="flex items-center gap-1.5">
                      Kategori
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                )}
                
                <th onClick={() => handleSort('uses')} className="p-3.5 font-black text-right cursor-pointer hover:bg-gray-100 transition-colors select-none">
                  <div className="flex items-center gap-1.5 justify-end">
                    Penggunaan (Uses)
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>

                <th onClick={() => handleSort('views')} className="p-3.5 font-black text-right cursor-pointer hover:bg-gray-100 transition-colors select-none">
                  <div className="flex items-center gap-1.5 justify-end">
                    Rata-rata Views
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>

                <th onClick={() => handleSort('engagement')} className="p-3.5 font-black text-right cursor-pointer hover:bg-gray-100 transition-colors select-none">
                  <div className="flex items-center gap-1.5 justify-end">
                    Engagement Rate
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>

                <th onClick={() => handleSort('growth')} className="p-3.5 font-black text-center cursor-pointer hover:bg-gray-100 transition-colors select-none">
                  <div className="flex items-center gap-1.5 justify-center">
                    Pertumbuhan
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>

                <th className="p-3.5 font-black text-center select-none">
                  Trend Status
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTags.map((tag, i) => {
                const globalIndex = startIndex + i;
                const tc = getTrendConfig(tag.trend);
                const col = tag.category ? (CAT_COLORS[tag.category] ?? '#111') : '#111';
                const CatIcon = tag.category ? (CAT_ICONS[tag.category] ?? Hash) : Hash;
                const rowBg = globalIndex % 2 === 0 ? '#FFFFFF' : '#F9F8F7';

                return (
                  <tr 
                    key={tag.tag + (tag.category || '')} 
                    className="border-b transition-colors hover:bg-gray-50/50"
                    style={{ background: rowBg, borderColor: 'rgba(0,0,0,0.04)' }}
                  >
                    {/* Tag Name */}
                    <td className="p-3 font-black flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: `${col}1a`, color: col }}>
                        <Hash className="w-3 h-3" />
                      </div>
                      <span style={{ color: TOKENS.text }}>{tag.tag}</span>
                    </td>

                    {/* Category (Conditional) */}
                    {activeCategory === 'All' && (
                      <td className="p-3 font-bold">
                        <span 
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] text-white"
                          style={{ background: col }}
                        >
                          <CatIcon className="w-2.5 h-2.5" />
                          {tag.category}
                        </span>
                      </td>
                    )}

                    {/* Usage count */}
                    <td className="p-3 text-right font-bold" style={{ color: TOKENS.text }}>
                      {tag.uses.toLocaleString('id-ID')} uses
                    </td>

                    {/* Average views */}
                    <td className="p-3 text-right font-medium" style={{ color: TOKENS.textMuted }}>
                      {fmt(tag.avgViews)} views
                    </td>

                    {/* Engagement */}
                    <td className="p-3 text-right font-bold" style={{ color: TOKENS.text }}>
                      {tag.engagement}%
                    </td>

                    {/* Growth */}
                    <td className={`p-3 text-center font-black ${tag.weekGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tag.weekGrowth >= 0 ? '+' : ''}{tag.weekGrowth}%
                    </td>

                    {/* Trend */}
                    <td className="p-3 text-center">
                      <span
                        className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-[9px] font-black"
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
                  <td colSpan={activeCategory === 'All' ? 7 : 6} className="p-12 text-center text-xs font-bold" style={{ color: TOKENS.textMuted }}>
                    Tidak ada hashtag ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalItems > 0 && (
          <div className="flex items-center justify-between mt-5 text-xs flex-wrap gap-3">
            <span className="font-bold text-gray-500" style={{ color: TOKENS.textMuted }}>
              Menampilkan {startIndex + 1} - {endIndex} dari {totalItems} hashtag
            </span>

            <div className="flex items-center gap-1.5">
              {/* Prev */}
              <button
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-xl flex items-center justify-center border hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: TOKENS.inputBorder }}
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, idx) => {
                const pageNum = idx + 1;
                // Simple logic to show current, first, last, and immediate surrounding pages
                const shouldShow = pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - safePage) <= 1;

                if (!shouldShow) {
                  // Print ellipsis once
                  if (pageNum === 2 || pageNum === totalPages - 1) {
                    return <span key={pageNum} className="px-1 text-gray-400 select-none">...</span>;
                  }
                  return null;
                }

                const isActive = pageNum === safePage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-black transition-all duration-150"
                    style={{
                      background: isActive ? '#111111' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : TOKENS.text,
                      border: `1px solid ${isActive ? '#111111' : TOKENS.inputBorder}`,
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next */}
              <button
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-xl flex items-center justify-center border hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: TOKENS.inputBorder }}
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
