import React from 'react';
import { Video, Eye, Sparkles, Flame, TrendingUp, TrendingDown } from 'lucide-react';
import { TOKENS } from '@/lib/design-tokens';
import { GridBg } from '@/components/layout/GridBg';
import { formatNum } from '@/lib/video-library/mock-data';

interface KpiCardProps {
  icon: React.ComponentType<any>;
  label: string;
  value: string | number;
  sub?: string;
  delta?: string;
  deltaPositive?: boolean;
}

const KpiCard = ({ icon: Ico, label, value, sub, delta, deltaPositive = true }: KpiCardProps) => (
  <div className="relative p-5 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
    style={{
      background: TOKENS.cardSoft,
      backdropFilter: 'blur(16px)',
      border: `1px solid ${TOKENS.cardBorder}`,
      boxShadow: '0 2px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
    }}>
    <GridBg theme="light" />
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: '#111', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}>
          <Ico className="w-4.5 h-4.5 text-white" strokeWidth={2} />
        </div>
        {delta && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-black"
            style={{
              background: deltaPositive ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.07)',
              color:      deltaPositive ? '#059669' : '#dc2626',
              border:     `1px solid ${deltaPositive ? 'rgba(5,150,105,0.18)' : 'rgba(220,38,38,0.18)'}`,
            }}>
            {deltaPositive ? <TrendingUp className="w-3 h-3" strokeWidth={2.5} /> : <TrendingDown className="w-3 h-3" strokeWidth={2.5} />}
            {delta}
          </div>
        )}
      </div>
      <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: TOKENS.textMuted }}>{label}</p>
      <p className="text-3xl font-black mb-1 leading-none tracking-tight" style={{ color: TOKENS.text }}>{value}</p>
      <p className="text-xs" style={{ color: TOKENS.textMuted }}>{sub}</p>
    </div>
  </div>
);

interface VideoKpisProps {
  totalCount: number;
  totalViews: number;
  avgEngagement: string;
  trendingCount: number;
}

export function VideoKpis({ totalCount, totalViews, avgEngagement, trendingCount }: VideoKpisProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard icon={Video}     label="Total Video"        value={totalCount}              sub="Dari semua akun yang dilacak" delta="+5" deltaPositive />
      <KpiCard icon={Eye}       label="Total Views"        value={formatNum(totalViews)}   sub="Akumulasi bulan ini"           delta="+18%" deltaPositive />
      <KpiCard icon={Sparkles}  label="Avg. Engagement"    value={`${avgEngagement}%`}       sub="Rata-rata semua video"         delta="+0.6%" deltaPositive />
      <KpiCard icon={Flame}     label="Sedang Trending"    value={trendingCount}           sub="Video viral dalam 7 hari"      delta="+2" deltaPositive />
    </div>
  );
}
