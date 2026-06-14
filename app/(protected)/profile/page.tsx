'use client';

import React, { useState } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { TOKENS } from '@/lib/design-tokens';
import {
  ProfileData,
  INITIAL_PROFILE,
  SocialLink,
} from '@/lib/profile/mock-data';
import { I } from '@/components/profile/Icons';
import { ProfileHero } from '@/components/profile/ProfileHero';
import { ProfileTab } from '@/components/profile/ProfileTab';
import { ContentTab } from '@/components/profile/ContentTab';
import { NotificationTab } from '@/components/profile/NotificationTab';
import { SecurityTab } from '@/components/profile/SecurityTab';

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState<ProfileData>(INITIAL_PROFILE);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'content' | 'notifications' | 'security'>('profile');

  // Draft helpers
  const setDraftField = (key: keyof ProfileData, val: any) =>
    setDraft((d) => ({ ...d, [key]: val }));

  const handleEdit = () => {
    setDraft(profile);
    setEditMode(true);
    setSaved(false);
  };

  const handleSave = () => {
    setProfile(draft);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setEditMode(false);
    setDraft(profile);
  };

  const updateSocial = (idx: number, field: keyof SocialLink, val: string) => {
    const links = [...draft.socialLinks];
    links[idx] = { ...links[idx], [field]: val };
    setDraftField('socialLinks', links);
  };

  const addSocial = () => {
    setDraftField('socialLinks', [...draft.socialLinks, { platform: '', url: '', handle: '' }]);
  };

  const removeSocial = (idx: number) => {
    setDraftField('socialLinks', draft.socialLinks.filter((_, i) => i !== idx));
  };

  const toggleCategory = (name: string) => {
    setDraftField(
      'contentCategories',
      draft.contentCategories.map((c) =>
        c.name === name ? { ...c, active: !c.active } : c
      )
    );
  };

  const toggleNotif = (key: string) => {
    const targetSource = editMode ? draft : profile;
    const updated = targetSource.notifications.map((n) =>
      n.key === key ? { ...n, enabled: !n.enabled } : n
    );
    if (editMode) {
      setDraftField('notifications', updated);
    } else {
      setProfile((p) => ({ ...p, notifications: updated }));
    }
  };

  const data = editMode ? draft : profile;

  const TABS = [
    { key: 'profile', label: 'Profil', icon: <I.User className="w-3.5 h-3.5" /> },
    { key: 'content', label: 'Konten', icon: <I.Star className="w-3.5 h-3.5" /> },
    { key: 'notifications', label: 'Notifikasi', icon: <I.Bell className="w-3.5 h-3.5" /> },
    { key: 'security', label: 'Keamanan', icon: <I.Shield className="w-3.5 h-3.5" /> },
  ] as const;

  return (
    <PageShell title="Profil & Pengaturan">
      <div className="p-6 space-y-6">
        {/* Header Toolbar inside the workspace shell */}
        <div
          className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b"
          style={{ borderColor: TOKENS.divider }}
        >
          <div>
            <h1 className="text-xl font-black flex items-center gap-2 tracking-tight" style={{ color: TOKENS.text }}>
              Profil & Pengaturan
            </h1>
            <p className="text-xs" style={{ color: TOKENS.textMuted }}>
              Kelola akun, preferensi konten, dan keamanan
            </p>
          </div>

          <div className="flex items-center gap-2">
            {saved && (
              <div
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold animate-pulse"
                style={{
                  background: TOKENS.positiveBg,
                  color: TOKENS.positive,
                  border: `1px solid rgba(26,122,74,0.2)`,
                }}
              >
                <I.Check className="w-4 h-4" />
                Tersimpan
              </div>
            )}
            {editMode ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black transition-all hover:opacity-70"
                  style={{
                    background: 'rgba(0,0,0,0.06)',
                    color: TOKENS.textSubtle,
                    border: `1px solid ${TOKENS.cardBorder}`,
                  }}
                >
                  <I.X className="w-4 h-4" />
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black text-white transition-all hover:opacity-90"
                  style={{
                    background: TOKENS.accent,
                    boxShadow: `0 2px 8px ${TOKENS.accent}44`,
                  }}
                >
                  <I.Check className="w-4 h-4" />
                  Simpan Perubahan
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black text-white transition-all hover:opacity-90"
                style={{ background: TOKENS.charcoal }}
              >
                <I.Edit className="w-4 h-4" />
                Edit Profil
              </button>
            )}
          </div>
        </div>

        {/* ── PROFILE HERO CARD ── */}
        <ProfileHero data={data} editMode={editMode} />

        {/* ── TAB NAV ── */}
        <div
          className="flex gap-1 p-1 rounded-2xl w-fit"
          style={{
            background: TOKENS.card,
            border: `1px solid ${TOKENS.cardBorder}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {TABS.map((tab) => {
            const isA = activeSection === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveSection(tab.key)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all duration-200"
                style={{
                  background: isA ? TOKENS.charcoal : 'transparent',
                  color: isA ? '#fff' : TOKENS.textMuted,
                  boxShadow: isA ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        {activeSection === 'profile' && (
          <ProfileTab
            data={data}
            profile={profile}
            editMode={editMode}
            setDraftField={setDraftField}
            updateSocial={updateSocial}
            addSocial={addSocial}
            removeSocial={removeSocial}
          />
        )}

        {activeSection === 'content' && (
          <ContentTab
            data={data}
            editMode={editMode}
            toggleCategory={toggleCategory}
          />
        )}

        {activeSection === 'notifications' && (
          <NotificationTab
            data={data}
            toggleNotif={toggleNotif}
          />
        )}

        {activeSection === 'security' && (
          <SecurityTab
            editMode={editMode}
          />
        )}
      </div>
    </PageShell>
  );
}