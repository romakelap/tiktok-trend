import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, ExternalLink, Target, Users, Video, Activity } from 'lucide-react';
import { GridBg } from '@/components/layout/GridBg';
import { TOKENS } from '@/lib/design-tokens';
import { Account, TYPE_META, formatNum } from '@/lib/account-management/mock-data';
import { AccountAvatar } from './AccountAvatar';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface BenchmarkingPanelProps {
  accountList: Account[];
  onExport?: () => void;
}

export const BenchmarkingPanel = ({ accountList, onExport }: BenchmarkingPanelProps) => {
  const [chartMetric, setChartMetric] = useState<'followers' | 'videos' | 'avgEngagement'>('followers');

  // Competitor benchmark rows (own first, then competitors/inspiration)
  const benchmarkRows = useMemo(() => {
    const ownAccounts = accountList.filter(a => a.type === 'own');
    const otherAccounts = accountList.filter(a => a.type !== 'own');
    return [...ownAccounts, ...otherAccounts];
  }, [accountList]);

  // Sort competitors/others by follower count but keep "own" account pinned at the top
  const sortedBenchmarks = useMemo(() => {
    const own = benchmarkRows.filter(a => a.type === 'own');
    const others = benchmarkRows.filter(a => a.type !== 'own').sort((a, b) => b.followers - a.followers);
    return [...own, ...others];
  }, [benchmarkRows]);

  const maxFollowers = useMemo(() => {
    return Math.max(...benchmarkRows.map(x => x.followers), 1);
  }, [benchmarkRows]);

  // Map compared accounts to chart data format
  const chartData = useMemo(() => {
    return sortedBenchmarks.map(a => ({
      name: `@${a.username}`,
      displayName: a.displayName,
      value: chartMetric === 'followers' ? a.followers : chartMetric === 'videos' ? a.videos : a.avgEngagement,
      type: a.type,
      color: TYPE_META[a.type].solid,
    }));
  }, [sortedBenchmarks, chartMetric]);

  if (sortedBenchmarks.length === 0) {
    return (
      <div
        className="relative rounded-2xl overflow-hidden p-8 text-center border"
        style={{
          background: TOKENS.cardSoft,
          borderColor: TOKENS.cardBorder,
        }}
      >
        <GridBg theme="light" />
        <div className="relative z-10 py-6">
          <Target className="w-8 h-8 mx-auto mb-3 text-gray-400" />
          <h3 className="font-black text-sm mb-1" style={{ color: TOKENS.text }}>Belum Ada Perbandingan</h3>
          <p className="text-xs max-w-sm mx-auto" style={{ color: TOKENS.textMuted }}>
            Klik tombol "Bandingkan Akun" di atas untuk memilih akun utama dan pembanding guna menampilkan metrik benchmark di sini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300"
      style={{
        background: TOKENS.cardSoft,
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
      }}
    >
      <GridBg theme="light" />

      <div className="relative z-10">
        {/* Panel Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: TOKENS.divider }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-900">
              <Target className="w-5 h-5 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight" style={{ color: TOKENS.text }}>
                Hasil Perbandingan Akun
              </h2>
              <p className="text-xs" style={{ color: TOKENS.textMuted }}>
                Perbandingan metrik utama antara akun Anda dan kompetitor pilihan Anda
              </p>
            </div>
          </div>
          <Button
            onClick={onExport}
            size="sm"
            variant="outline"
            className="h-9 rounded-xl text-xs font-bold"
            style={{ background: '#fff', border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.text }}
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} />
            Export PDF
          </Button>
        </div>

        {/* Dynamic Comparison Chart Visualization */}
        <div className="px-6 py-5 border-b bg-gray-50/30" style={{ borderColor: TOKENS.divider }}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500">
              Visualisasi Diagram Perbandingan
            </h3>
            
            {/* Metric Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-gray-100/80 border border-gray-200">
              {[
                { key: 'followers', label: 'Followers', Icon: Users },
                { key: 'videos', label: 'Total Video', Icon: Video },
                { key: 'avgEngagement', label: 'Engagement Rate', Icon: Activity },
              ].map(m => {
                const active = chartMetric === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => setChartMetric(m.key as any)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer"
                    style={{
                      background: active ? '#fff' : 'transparent',
                      color: active ? TOKENS.text : TOKENS.textMuted,
                      boxShadow: active ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                    }}
                  >
                    <m.Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ height: 200 }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(v) => chartMetric === 'avgEngagement' ? `${v}%` : formatNum(v)}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontFamily: 'inherit',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                  formatter={(v: any) => [
                    chartMetric === 'avgEngagement' ? `${v}%` : v.toLocaleString('id-ID'),
                    chartMetric === 'followers' ? 'Followers' : chartMetric === 'videos' ? 'Total Video' : 'Engagement Rate'
                  ]}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b" style={{ borderColor: TOKENS.divider }}>
                {['#', 'Akun', 'Followers', 'Total Video', 'Engagement Rate', 'Avg Views', 'Growth (12w)'].map((h, i) => (
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
              {sortedBenchmarks.map((a, idx) => {
                const isMe = a.type === 'own';
                const meta = TYPE_META[a.type];
                const isPos = a.growthPct >= 0;
                const pct = (a.followers / maxFollowers) * 100;
                return (
                  <tr
                    key={a.id}
                    className="transition-colors border-b"
                    style={{
                      background: isMe ? 'rgba(17,17,17,0.025)' : 'transparent',
                      borderColor: TOKENS.divider,
                    }}
                  >
                    <td className="px-6 py-4">
                      <span className="font-black text-sm" style={{ color: TOKENS.text }}>#{idx + 1}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <AccountAvatar account={a} size={32} />
                        <div>
                          <div className="flex items-center gap-2">
                            <a
                              href={`https://www.tiktok.com/@${a.username}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-black text-sm hover:underline hover:text-emerald-600 transition-colors"
                              style={{ color: TOKENS.text }}
                            >
                              @{a.username}
                            </a>
                            {isMe && (
                              <span
                                className="px-1.5 py-0.5 rounded text-[8px] font-black text-white bg-gray-900"
                              >
                                ANDA
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-semibold" style={{ color: TOKENS.textMuted }}>{a.displayName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-[180px]">
                      <p className="font-black text-sm mb-1.5" style={{ color: TOKENS.text }}>{formatNum(a.followers)}</p>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: TOKENS.barBg, width: 140 }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: meta.solid }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-sm" style={{ color: TOKENS.textSubtle }}>{a.videos.toLocaleString('id-ID')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="font-black text-sm px-2 py-1 rounded-md"
                        style={{
                          color:      a.avgEngagement >= 7 ? '#059669' : a.avgEngagement >= 5 ? TOKENS.text : '#dc2626',
                          background: a.avgEngagement >= 7 ? 'rgba(5,150,105,0.08)' : a.avgEngagement >= 5 ? 'rgba(0,0,0,0.04)' : 'rgba(220,38,38,0.07)',
                        }}
                      >
                        {a.avgEngagement}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-sm" style={{ color: TOKENS.textSubtle }}>{formatNum(a.avgViews)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1 text-xs font-black px-2 py-1 rounded-md"
                        style={{
                          color:      isPos ? '#059669' : '#dc2626',
                          background: isPos ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.07)',
                          border:     `1px solid ${isPos ? 'rgba(5,150,105,0.18)' : 'rgba(220,38,38,0.18)'}`,
                        }}
                      >
                        {isPos ? (
                          <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
                        ) : (
                          <TrendingDown className="w-3 h-3" strokeWidth={2.5} />
                        )}
                        {isPos ? '+' : ''}{a.growthPct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
