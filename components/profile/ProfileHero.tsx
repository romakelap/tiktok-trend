import React, { useRef } from 'react';
import { TOKENS } from '@/lib/design-tokens';
import { ProfileData, formatStat, PLAN_CFG } from '@/lib/profile/mock-data';
import { I } from './Icons';
import { GridBg } from '@/components/layout/GridBg';

interface ProfileHeroProps {
  data: ProfileData;
  editMode: boolean;
  onAvatarChange?: () => void;
}

export function ProfileHero({ data, editMode, onAvatarChange }: ProfileHeroProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const planCfg = PLAN_CFG[data.plan];

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: TOKENS.charcoal,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }}
    >
      <GridBg theme="dark" />
      {/* Accent blob */}
      <div
        className="absolute top-0 right-0 w-96 h-64 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${data.avatarColor}18 0%, transparent 65%)`,
        }}
      />

      <div className="relative z-10 p-6">
        <div className="flex flex-wrap items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center font-black text-3xl text-white"
              style={{
                background: data.avatarColor,
                boxShadow: `0 4px 20px ${data.avatarColor}55`,
              }}
            >
              {data.avatar}
            </div>
            {editMode && (
              <button
                onClick={() => {
                  fileRef.current?.click();
                  onAvatarChange?.();
                }}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center text-white transition-all hover:opacity-80"
                style={{
                  background: TOKENS.accent,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                <I.Camera className="w-3.5 h-3.5" />
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" />
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="font-black text-2xl text-white">{data.displayName}</h2>
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-black"
                style={{ background: planCfg.bg, color: planCfg.color }}
              >
                {planCfg.label}
              </span>
            </div>
            <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {data.username}
            </p>
            <p className="text-sm leading-relaxed mb-3 max-w-xl" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {data.bio}
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                <I.MapPin className="w-3.5 h-3.5" />
                {data.location}
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                <I.Mail className="w-3.5 h-3.5" />
                {data.email}
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                <I.Globe className="w-3.5 h-3.5" />
                {data.website}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-5 flex-shrink-0">
            {[
              { label: 'Video', val: formatStat(data.stats.totalVideos) },
              { label: 'Total Views', val: formatStat(data.stats.totalViews) },
              { label: 'Engagement', val: data.stats.avgEngagement + '%' },
              { label: 'Followers', val: formatStat(data.stats.followers) },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-black text-xl text-white">{s.val}</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
