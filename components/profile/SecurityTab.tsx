import React from 'react';
import { TOKENS } from '@/lib/design-tokens';
import { I } from './Icons';
import { SectionCard } from './SectionCard';
import { Field, Toggle } from './FormElements';

interface SecurityTabProps {
  editMode: boolean;
}

export function SecurityTab({ editMode }: SecurityTabProps) {
  return (
    <div className="max-w-2xl space-y-4">
      {/* Password */}
      <SectionCard title="Ubah Password" icon={<I.Lock className="w-3.5 h-3.5" />}>
        <div className="space-y-4">
          <Field
            label="Password Saat Ini"
            value=""
            onChange={() => {}}
            type="password"
            placeholder="••••••••"
            disabled={!editMode}
          />
          <Field
            label="Password Baru"
            value=""
            onChange={() => {}}
            type="password"
            placeholder="Min. 8 karakter"
            disabled={!editMode}
            hint="Gunakan kombinasi huruf, angka, dan simbol"
          />
          <Field
            label="Konfirmasi Password Baru"
            value=""
            onChange={() => {}}
            type="password"
            placeholder="••••••••"
            disabled={!editMode}
          />
          {editMode && (
            <button
              className="px-4 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90"
              style={{ background: TOKENS.accent }}
            >
              Perbarui Password
            </button>
          )}
        </div>
      </SectionCard>

      {/* 2FA */}
      <SectionCard title="Two-Factor Authentication" icon={<I.Shield className="w-3.5 h-3.5" />}>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="font-black text-sm" style={{ color: TOKENS.text }}>
              Autentikasi 2 Langkah
            </p>
            <p className="text-xs mt-0.5" style={{ color: TOKENS.textMuted }}>
              Tambah lapisan keamanan ekstra ke akun kamu
            </p>
          </div>
          <Toggle enabled={false} onChange={() => {}} />
        </div>
        <div
          className="mt-4 p-4 rounded-xl"
          style={{
            background: TOKENS.warningBg,
            border: `1.5px solid rgba(146,64,14,0.15)`,
          }}
        >
          <p className="text-xs font-semibold" style={{ color: TOKENS.warning }}>
            ⚠ 2FA belum aktif. Aktifkan untuk melindungi akun dari akses tidak sah.
          </p>
        </div>
      </SectionCard>

      {/* Sessions */}
      <SectionCard title="Sesi Aktif" icon={<I.Eye className="w-3.5 h-3.5" />}>
        <div className="space-y-3">
          {[
            { device: 'Chrome · macOS', loc: 'Jakarta, ID', time: 'Aktif sekarang', current: true },
            { device: 'Safari · iPhone 15', loc: 'Jakarta, ID', time: '2 jam lalu', current: false },
            { device: 'Firefox · Windows', loc: 'Bandung, ID', time: '3 hari lalu', current: false },
          ].map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3"
              style={{ borderBottom: i < 2 ? `1px solid ${TOKENS.divider}` : 'none' }}
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-black text-sm" style={{ color: TOKENS.text }}>
                    {s.device}
                  </p>
                  {s.current && (
                    <span
                      className="px-1.5 py-0.5 rounded text-xs font-black"
                      style={{ background: TOKENS.positiveBg, color: TOKENS.positive }}
                    >
                      Ini kamu
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{ color: TOKENS.textMuted }}>
                  {s.loc} · {s.time}
                </p>
              </div>
              {!s.current && (
                <button
                  className="text-xs font-black px-3 py-1.5 rounded-lg transition-all hover:opacity-70"
                  style={{ background: TOKENS.negativeBg, color: TOKENS.negative }}
                >
                  Keluarkan
                </button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Danger zone */}
      <div
        className="relative rounded-2xl overflow-hidden p-6"
        style={{ background: '#FFF8F8', border: `1.5px solid rgba(185,28,28,0.2)` }}
      >
        <h3 className="font-black text-sm mb-1" style={{ color: TOKENS.negative }}>
          Zona Berbahaya
        </h3>
        <p className="text-xs mb-4" style={{ color: TOKENS.textMuted }}>
          Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            className="px-4 py-2 rounded-xl text-sm font-black transition-all hover:opacity-70"
            style={{
              background: TOKENS.negativeBg,
              color: TOKENS.negative,
              border: `1px solid rgba(185,28,28,0.2)`,
            }}
          >
            Hapus Semua Data Analitik
          </button>
          <button
            className="px-4 py-2 rounded-xl text-sm font-black transition-all hover:opacity-90 text-white"
            style={{ background: TOKENS.negative }}
          >
            Hapus Akun
          </button>
        </div>
      </div>
    </div>
  );
}
