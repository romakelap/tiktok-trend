import React from 'react';
import {
  TrendingUp, TrendingDown, Target, CheckCircle2, MoreHorizontal
} from 'lucide-react';
import { GridBg } from '@/components/layout/GridBg';
import { TOKENS } from '@/lib/design-tokens';
import { Account, TYPE_META, formatNum } from '@/lib/account-management/mock-data';
import { AccountAvatar } from './AccountAvatar';
import { Sparkline } from './Sparkline';

interface AccountCardProps {
  account: Account;
  onMark: (account: Account) => void;
}

export const AccountCard = ({ account, onMark }: AccountCardProps) => {
  const meta = TYPE_META[account.type];
  const isPositive = account.growthPct >= 0;

  return (
    <div
      className="group relative rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: TOKENS.card,
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 2px 8px rgba(0,0,0,0.03)',
      }}
    >
      <GridBg theme="light" />

      {/*
        The "Tipe" stripe indicator that previously sat on top of every card
        was removed per design feedback — type is still represented by the
        compare/competitor action button and the icon in the avatar fallback.
      */}

      {/* Top right compact actions */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-20">
        {account.type !== 'own' && (
          <button
            onClick={() => onMark(account)}
            className="w-6.5 h-6.5 rounded-lg flex items-center justify-center transition-all border cursor-pointer hover:bg-gray-50 active:scale-95"
            title={account.type === 'competitor' ? 'Sudah ditandai kompetitor' : 'Tandai sebagai kompetitor'}
            style={{
              background: account.type === 'competitor' ? TYPE_META.competitor.tint : '#fff',
              color: account.type === 'competitor' ? TYPE_META.competitor.solid : TOKENS.textMuted,
              borderColor: account.type === 'competitor' ? TYPE_META.competitor.border : TOKENS.inputBorder,
            }}
          >
            {account.type === 'competitor' ? (
              <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
            ) : (
              <Target className="w-3.5 h-3.5" strokeWidth={2.5} />
            )}
          </button>
        )}
        <button
          className="w-6.5 h-6.5 rounded-lg flex items-center justify-center transition-all border cursor-pointer hover:bg-gray-50 active:scale-95"
          style={{
            background: '#fff',
            borderColor: TOKENS.inputBorder,
            color: TOKENS.textMuted,
          }}
        >
          <MoreHorizontal className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
      </div>

      <div className="relative z-10 p-3.5 flex flex-col h-full justify-between">
        {/* Header: Profile & Name */}
        <div className="flex items-start justify-between mb-3 pr-14">
          <div className="flex items-center gap-2 min-w-0">
            <AccountAvatar account={account} size={32} />
            <div className="min-w-0">
              <a
                href={`https://www.tiktok.com/@${account.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-black text-xs hover:underline hover:text-emerald-600 transition-colors truncate block"
                style={{ color: TOKENS.text }}
              >
                @{account.username}
              </a>
              <p className="text-[10px] font-semibold truncate" style={{ color: TOKENS.textSubtle }}>
                {account.displayName}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[9.5px] font-black uppercase tracking-wider" style={{ color: TOKENS.textMuted }}>Followers</span>
            <span className="font-black text-sm" style={{ color: TOKENS.text }}>{formatNum(account.followers)}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium">
            <span style={{ color: TOKENS.textSubtle }}>{account.videos} video</span>
            <span className="font-bold" style={{ color: account.avgEngagement >= 6 ? '#059669' : TOKENS.text }}>
              {account.avgEngagement}% engage
            </span>
          </div>
        </div>

        {/* Sparkline + Growth Rate */}
        <div className="flex items-center justify-between pt-2.5" style={{ borderTop: `1px solid ${TOKENS.divider}` }}>
          <Sparkline data={account.trend} color={meta.solid} width={74} height={20} />
          <span
            className="text-[10.5px] font-black flex items-center gap-0.5"
            style={{ color: isPositive ? '#059669' : '#dc2626' }}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
            ) : (
              <TrendingDown className="w-3 h-3" strokeWidth={2.5} />
            )}
            {isPositive ? '+' : ''}{account.growthPct}%
          </span>
        </div>
      </div>
    </div>
  );
};
