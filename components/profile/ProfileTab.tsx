import React from 'react';
import { TOKENS } from '@/lib/design-tokens';
import { ProfileData, formatStat, PLAN_CFG, SOCIAL_COLORS, SocialLink } from '@/lib/profile/mock-data';
import { I } from './Icons';
import { SectionCard } from './SectionCard';
import { Field, TextArea } from './FormElements';

interface ProfileTabProps {
  data: ProfileData;
  profile: ProfileData;
  editMode: boolean;
  setDraftField: (key: keyof ProfileData, val: any) => void;
  updateSocial: (idx: number, field: keyof SocialLink, val: string) => void;
  addSocial: () => void;
  removeSocial: (idx: number) => void;
}

export function ProfileTab({
  data,
  profile,
  editMode,
  setDraftField,
  updateSocial,
  addSocial,
  removeSocial,
}: ProfileTabProps) {
  const planCfg = PLAN_CFG[data.plan];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left col — 2/3 */}
      <div className="lg:col-span-2 space-y-6">
        {/* Info dasar */}
        <SectionCard title="Informasi Dasar" icon={<I.User className="w-3.5 h-3.5" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Nama Tampilan"
              value={data.displayName}
              onChange={(v) => setDraftField('displayName', v)}
              placeholder="Nama publik kamu"
              disabled={!editMode}
            />
            <Field
              label="Username"
              value={data.username}
              onChange={(v) => setDraftField('username', v)}
              placeholder="@username"
              disabled={!editMode}
              hint="Digunakan untuk mentions & URL profil"
            />
            <Field
              label="Email"
              value={data.email}
              type="email"
              onChange={(v) => setDraftField('email', v)}
              placeholder="email@domain.com"
              disabled={!editMode}
            />
            <Field
              label="Nomor Telepon"
              value={data.phone}
              type="tel"
              onChange={(v) => setDraftField('phone', v)}
              placeholder="+62 8xx xxxx xxxx"
              disabled={!editMode}
            />
            <Field
              label="Lokasi"
              value={data.location}
              onChange={(v) => setDraftField('location', v)}
              placeholder="Kota, Negara"
              disabled={!editMode}
            />
            <Field
              label="Website"
              value={data.website}
              onChange={(v) => setDraftField('website', v)}
              placeholder="yoursite.com"
              disabled={!editMode}
            />
          </div>
          <div className="mt-4">
            <TextArea
              label="Bio"
              value={data.bio}
              onChange={(v) => setDraftField('bio', v)}
              placeholder="Ceritakan tentang dirimu dan kontenmu..."
              rows={3}
              hint="Tampil di profil publik dan laporan analytics"
            />
          </div>
        </SectionCard>

        {/* Social links */}
        <SectionCard
          title="Social Media Links"
          icon={<I.Link className="w-3.5 h-3.5" />}
          action={
            editMode ? (
              <button
                onClick={addSocial}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black transition-all hover:opacity-80"
                style={{
                  background: TOKENS.accentSoft,
                  color: TOKENS.accent,
                  border: `1px solid rgba(26,107,255,0.2)`,
                }}
              >
                <I.Plus className="w-3 h-3" />
                Tambah
              </button>
            ) : undefined
          }
        >
          <div className="space-y-3">
            {data.socialLinks.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                {/* Platform icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black text-xs"
                  style={{ background: SOCIAL_COLORS[s.platform] ?? TOKENS.textMuted }}
                >
                  {s.platform === 'TikTok' ? <I.TikTok className="w-4 h-4" /> : s.platform.charAt(0)}
                </div>
                {editMode ? (
                  <>
                    <input
                      value={s.platform}
                      onChange={(e) => updateSocial(i, 'platform', e.target.value)}
                      placeholder="Platform"
                      className="w-28 px-3 py-2 rounded-lg text-sm outline-none"
                      style={{
                        background: TOKENS.barBg,
                        border: `1.5px solid ${TOKENS.inputBorder}`,
                        color: TOKENS.text,
                      }}
                    />
                    <input
                      value={s.handle}
                      onChange={(e) => updateSocial(i, 'handle', e.target.value)}
                      placeholder="@handle"
                      className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                      style={{
                        background: TOKENS.barBg,
                        border: `1.5px solid ${TOKENS.inputBorder}`,
                        color: TOKENS.text,
                      }}
                    />
                    <button
                      onClick={() => removeSocial(i)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:opacity-70"
                      style={{ background: TOKENS.negativeBg, color: TOKENS.negative }}
                    >
                      <I.Trash className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="font-black text-sm" style={{ color: TOKENS.text }}>
                        {s.platform}
                      </p>
                      <p className="text-xs" style={{ color: TOKENS.textMuted }}>
                        {s.handle}
                      </p>
                    </div>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-bold transition-all hover:opacity-70"
                      style={{ color: TOKENS.accent }}
                    >
                      <I.Globe className="w-3 h-3" />
                      Buka
                    </a>
                  </>
                )}
              </div>
            ))}
            {data.socialLinks.length === 0 && (
              <p className="text-sm text-center py-4" style={{ color: TOKENS.textMuted }}>
                Belum ada social media yang ditambahkan
              </p>
            )}
          </div>
        </SectionCard>
      </div>

      {/* Right col — 1/3 */}
      <div className="space-y-6">
        {/* Plan info */}
        <SectionCard title="Paket Berlangganan" icon={<I.Star className="w-3.5 h-3.5" />}>
          <div className="text-center py-2">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-3"
              style={{ background: planCfg.bg, border: `1px solid ${planCfg.color}28` }}
            >
              <I.Star className="w-4 h-4" style={{ color: planCfg.color } as React.CSSProperties} />
              <span className="font-black text-lg" style={{ color: planCfg.color }}>
                {data.plan}
              </span>
            </div>
            <p className="text-sm mb-4" style={{ color: TOKENS.textMuted }}>
              {data.plan === 'Pro'
                ? 'Akses penuh ke semua fitur analitik & AI Predict'
                : data.plan === 'Business'
                ? 'Semua fitur Pro + multi-channel & team access'
                : 'Fitur terbatas — upgrade untuk akses penuh'}
            </p>
            {data.plan !== 'Business' && (
              <button
                className="w-full py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90"
                style={{ background: TOKENS.accent }}
              >
                Upgrade ke {data.plan === 'Free' ? 'Pro' : 'Business'}
              </button>
            )}
          </div>
          <div className="mt-4 pt-4 space-y-2.5" style={{ borderTop: `1px solid ${TOKENS.divider}` }}>
            {[
              { label: 'Hashtag Tracking', ok: true },
              { label: 'AI Predict', ok: data.plan !== 'Free' },
              { label: 'Export CSV', ok: data.plan !== 'Free' },
              { label: 'Multi-Channel', ok: data.plan === 'Business' },
              { label: 'API Access', ok: data.plan === 'Business' },
            ].map((f, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: f.ok ? TOKENS.textSubtle : TOKENS.textMuted }}>
                  {f.label}
                </span>
                {f.ok ? (
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: TOKENS.positiveBg }}
                  >
                    <I.Check className="w-3 h-3" style={{ color: TOKENS.positive } as React.CSSProperties} />
                  </span>
                ) : (
                  <span
                    className="text-xs px-2 py-0.5 rounded-md font-bold"
                    style={{ background: 'rgba(0,0,0,0.06)', color: TOKENS.textMuted }}
                  >
                    Lock
                  </span>
                )}
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Quick stats */}
        <SectionCard title="Statistik Akun" icon={<I.Eye className="w-3.5 h-3.5" />}>
          <div className="space-y-3">
            {[
              {
                label: 'Total Video',
                val: formatStat(profile.stats.totalVideos),
                icon: <I.TikTok className="w-3.5 h-3.5" />,
                color: TOKENS.accent,
              },
              {
                label: 'Total Views',
                val: formatStat(profile.stats.totalViews),
                icon: <I.Eye className="w-3.5 h-3.5" />,
                color: TOKENS.textSubtle,
              },
              {
                label: 'Avg. Engagement',
                val: profile.stats.avgEngagement + '%',
                icon: <I.Heart className="w-3.5 h-3.5" />,
                color: TOKENS.negative,
              },
              {
                label: 'Followers',
                val: formatStat(profile.stats.followers),
                icon: <I.User className="w-3.5 h-3.5" />,
                color: TOKENS.positive,
              },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2"
                style={{ borderBottom: i < 3 ? `1px solid ${TOKENS.divider}` : 'none' }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <span className="text-sm font-semibold" style={{ color: TOKENS.textMuted }}>
                    {s.label}
                  </span>
                </div>
                <span className="font-black text-sm" style={{ color: TOKENS.text }}>
                  {s.val}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${TOKENS.divider}` }}>
            <p className="text-xs" style={{ color: TOKENS.textMuted }}>
              {profile.joinDate}
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
