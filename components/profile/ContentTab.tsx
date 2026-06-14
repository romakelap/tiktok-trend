import React from 'react';
import { TOKENS } from '@/lib/design-tokens';
import { ProfileData } from '@/lib/profile/mock-data';
import { I } from './Icons';
import { SectionCard } from './SectionCard';

interface ContentTabProps {
  data: ProfileData;
  editMode: boolean;
  toggleCategory: (name: string) => void;
}

export function ContentTab({ data, editMode, toggleCategory }: ContentTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category preferences */}
      <SectionCard
        title="Kategori Konten"
        icon={<I.Star className="w-3.5 h-3.5" />}
        action={
          <span className="text-xs font-semibold" style={{ color: TOKENS.textMuted }}>
            {data.contentCategories.filter((c) => c.active).length} dipilih
          </span>
        }
      >
        <p className="text-sm mb-4" style={{ color: TOKENS.textMuted }}>
          Pilih kategori yang relevan agar analytics & prediksi AI lebih akurat.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {data.contentCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => (editMode ? toggleCategory(cat.name) : undefined)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 text-left"
              style={{
                background: cat.active ? `${cat.color}0e` : '#F9F8F7',
                border: `1.5px solid ${cat.active ? cat.color + '40' : 'rgba(0,0,0,0.07)'}`,
                cursor: editMode ? 'pointer' : 'default',
                opacity: !editMode && !cat.active ? 0.5 : 1,
              }}
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ background: cat.active ? cat.color : TOKENS.barBg }}
              >
                <span className="text-white font-black" style={{ fontSize: 10 }}>
                  {cat.name.charAt(0)}
                </span>
              </div>
              <span
                className="font-black text-sm"
                style={{ color: cat.active ? cat.color : TOKENS.textMuted }}
              >
                {cat.name}
              </span>
              {cat.active && (
                <div
                  className="ml-auto w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: cat.color }}
                >
                  <I.Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
        {!editMode && (
          <p className="mt-3 text-xs" style={{ color: TOKENS.textMuted }}>
            Klik <strong>Edit Profil</strong> untuk mengubah kategori.
          </p>
        )}
      </SectionCard>

      {/* Content preferences */}
      <SectionCard title="Preferensi Analitik" icon={<I.TrendUp className="w-3.5 h-3.5" />}>
        <div className="space-y-4">
          {[
            { label: 'Satuan Angka', options: ['Singkat (1.2M)', 'Penuh (1,200,000)'], selected: 0 },
            { label: 'Zona Waktu', options: ['WIB (UTC+7)', 'WITA (UTC+8)', 'WIT (UTC+9)'], selected: 0 },
            { label: 'Periode Default', options: ['7 hari', '30 hari', '90 hari'], selected: 1 },
            { label: 'Bahasa Laporan', options: ['Bahasa Indonesia', 'English'], selected: 0 },
          ].map((pref, i) => (
            <div key={i}>
              <label
                className="block text-xs font-black uppercase tracking-widest mb-2"
                style={{ color: TOKENS.textMuted }}
              >
                {pref.label}
              </label>
              <div className="flex gap-2 flex-wrap">
                {pref.options.map((opt, oi) => (
                  <button
                    key={oi}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150"
                    style={{
                      background: oi === pref.selected ? TOKENS.charcoal : 'rgba(0,0,0,0.05)',
                      color: oi === pref.selected ? '#fff' : TOKENS.textMuted,
                      border: `1px solid ${oi === pref.selected ? TOKENS.charcoal : 'rgba(0,0,0,0.08)'}`,
                      cursor: editMode ? 'pointer' : 'default',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Channel connections */}
      <div className="lg:col-span-2">
        <SectionCard
          title="Channel TikTok Terhubung"
          icon={<I.TikTok className="w-3.5 h-3.5" />}
          action={
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black"
              style={{
                background: TOKENS.accentSoft,
                color: TOKENS.accent,
                border: '1px solid rgba(26,107,255,0.2)',
              }}
            >
              <I.Plus className="w-3 h-3" />
              Hubungkan Channel
            </button>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { handle: '@rizkypratama_id', followers: '84.2K', niche: 'Teknologi', color: '#364FC7', primary: true },
              { handle: '@rizkykuliner', followers: '12.8K', niche: 'Kuliner', color: '#C92A2A', primary: false },
            ].map((ch, i) => (
              <div
                key={i}
                className="rounded-xl p-4 flex items-center gap-3"
                style={{ background: `${ch.color}08`, border: `1px solid ${ch.color}28` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                  style={{ background: ch.color }}
                >
                  <I.TikTok className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm truncate" style={{ color: TOKENS.text }}>
                    {ch.handle}
                  </p>
                  <p className="text-xs" style={{ color: TOKENS.textMuted }}>
                    {ch.followers} · {ch.niche}
                  </p>
                </div>
                {ch.primary && (
                  <span
                    className="px-1.5 py-0.5 rounded text-white font-black flex-shrink-0"
                    style={{ background: ch.color, fontSize: 8 }}
                  >
                    UTAMA
                  </span>
                )}
              </div>
            ))}
            {/* Add channel placeholder */}
            <button
              className="rounded-xl p-4 flex items-center justify-center gap-2 border-2 border-dashed transition-all hover:opacity-70"
              style={{ borderColor: TOKENS.inputBorder, color: TOKENS.textMuted }}
            >
              <I.Plus className="w-4 h-4" />
              <span className="text-sm font-semibold">Tambah channel</span>
            </button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
