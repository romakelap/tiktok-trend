import React from 'react';
import { Video, Eye, Sparkles, Flame } from 'lucide-react';
import { formatNum } from '@/lib/video-library/mock-data';

interface KpiCardProps {
  icon: React.ComponentType<any>;
  label: string;
  value: string | number;
  sub?: string;
  iconBg?: string;
  iconColor?: string;
}

const KpiCard = ({ icon: Ico, label, value, sub, iconBg = 'bg-stone-100 dark:bg-neutral-800', iconColor = 'text-stone-700 dark:text-neutral-200' }: KpiCardProps) => (
  <div className="relative p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-stone-200/80 dark:border-neutral-800 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-neutral-400">
        {label}
      </span>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
        <Ico className="w-4.5 h-4.5" strokeWidth={2} />
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-2xl font-black font-mono tracking-tight text-stone-900 dark:text-white">
        {value}
      </p>
      {sub && (
        <p className="text-xs text-stone-500 dark:text-neutral-400">
          {sub}
        </p>
      )}
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
      <KpiCard
        icon={Video}
        label="Total Video"
        value={totalCount.toLocaleString('id-ID')}
        sub="Semua konten terindeks"
        iconBg="bg-sky-50 dark:bg-sky-950/40"
        iconColor="text-sky-600 dark:text-sky-400"
      />
      <KpiCard
        icon={Eye}
        label="Total Views"
        value={formatNum(totalViews)}
        sub="Akumulasi tayangan"
        iconBg="bg-emerald-50 dark:bg-emerald-950/40"
        iconColor="text-emerald-600 dark:text-emerald-400"
      />
      <KpiCard
        icon={Sparkles}
        label="Avg. Engagement"
        value={`${avgEngagement}%`}
        sub="Rata-rata interaksi audiens"
        iconBg="bg-amber-50 dark:bg-amber-950/40"
        iconColor="text-amber-600 dark:text-amber-400"
      />
      <KpiCard
        icon={Flame}
        label="Sedang Trending"
        value={trendingCount}
        sub="Performa viral 7 hari"
        iconBg="bg-rose-50 dark:bg-rose-950/40"
        iconColor="text-rose-600 dark:text-rose-400"
      />
    </div>
  );
}
