import React from 'react';
import { Users, Activity, Sparkles, Target, TrendingUp, TrendingDown } from 'lucide-react';
import { GridBg } from '@/components/layout/GridBg';
import { TOKENS } from '@/lib/design-tokens';
import { formatNum } from '@/lib/account-management/mock-data';

interface KpisType {
  total: number;
  ownCount: number;
  compCount: number;
  inspCount: number;
  myFollowers: number;
  avgCompFollowers: number;
  avgEngagement: string;
}

interface AccountKpisProps {
  kpis: KpisType;
}

const KpiCard = ({
  icon: Ico,
  label,
  value,
  sub,
  delta,
  deltaPositive = true,
}: {
  icon: any;
  label: string;
  value: string | number;
  sub?: string;
  delta?: string;
  deltaPositive?: boolean;
}) => (
  <div
    className="relative p-5 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
    style={{
      background: TOKENS.cardSoft,
      backdropFilter: 'blur(16px)',
      border: `1px solid ${TOKENS.cardBorder}`,
      boxShadow: '0 2px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
    }}
  >
    <GridBg theme="light" />
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: '#111', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}
        >
          <Ico className="w-4.5 h-4.5 text-white" strokeWidth={2} />
        </div>
        {delta && (
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-black"
            style={{
              background: deltaPositive ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.07)',
              color:      deltaPositive ? '#059669' : '#dc2626',
              border:     `1px solid ${deltaPositive ? 'rgba(5,150,105,0.18)' : 'rgba(220,38,38,0.18)'}`,
            }}
          >
            {deltaPositive ? (
              <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
            ) : (
              <TrendingDown className="w-3 h-3" strokeWidth={2.5} />
            )}
            {delta}
          </div>
        )}
      </div>
      <p
        className="text-[10.5px] font-bold uppercase tracking-[0.14em] mb-1.5"
        style={{ color: TOKENS.textMuted }}
      >
        {label}
      </p>
      <p className="text-3xl font-black mb-1 leading-none tracking-tight" style={{ color: TOKENS.text }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: TOKENS.textMuted }}>
        {sub}
      </p>
    </div>
  </div>
);

export const AccountKpis = ({ kpis }: AccountKpisProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        icon={Users}
        label="Akun Dilacak"
        value={kpis.total}
        sub={`${kpis.ownCount} milik · ${kpis.compCount} kompetitor · ${kpis.inspCount} inspirasi`}
        delta="+3"
        deltaPositive
      />
      <KpiCard
        icon={Activity}
        label="Followers Anda"
        value={formatNum(kpis.myFollowers)}
        sub={`vs ${formatNum(kpis.avgCompFollowers)} rata-rata kompetitor`}
        delta="+12.3%"
        deltaPositive
      />
      <KpiCard
        icon={Sparkles}
        label="Engagement Rata-rata"
        value={`${kpis.avgEngagement}%`}
        sub="Across semua akun yang dilacak"
        delta="+0.4%"
        deltaPositive
      />
      <KpiCard
        icon={Target}
        label="Posisi vs Kompetitor"
        value="#4"
        sub={`Dari ${kpis.compCount + 1} akun di niche serupa`}
        delta="↑ 1"
        deltaPositive
      />
    </div>
  );
};
