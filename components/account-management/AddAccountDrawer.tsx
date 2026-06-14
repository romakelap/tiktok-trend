import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, AtSign, CheckCircle2 } from 'lucide-react';
import { GridBg } from '@/components/layout/GridBg';
import { TOKENS } from '@/lib/design-tokens';
import { TYPE_META } from '@/lib/account-management/mock-data';

interface AddAccountDrawerProps {
  open: boolean;
  onClose: () => void;
  onAdd?: (newAccount: { username: string; type: 'own' | 'competitor' | 'inspiration'; notes: string }) => void;
}

export const AddAccountDrawer = ({ open, onClose, onAdd }: AddAccountDrawerProps) => {
  const [form, setForm] = useState({ username: '', type: 'competitor' as 'own' | 'competitor' | 'inspiration', notes: '' });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim()) return;
    if (onAdd) {
      onAdd({
        username: form.username.trim(),
        type: form.type,
        notes: form.notes.trim()
      });
    }
    setForm({ username: '', type: 'competitor', notes: '' });
    onClose();
  };

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 transition-opacity"
        style={{ background: 'rgba(17,17,17,0.45)', backdropFilter: 'blur(4px)' }}
      />
      {/* panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-hidden flex flex-col"
        style={{ background: TOKENS.bgSoft, borderLeft: `1px solid ${TOKENS.divider}`, boxShadow: '-12px 0 60px rgba(0,0,0,0.18)' }}
      >
        <GridBg theme="light" />

        <div
          className="relative z-10 p-6 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${TOKENS.divider}` }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#111' }}>
              <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-black text-base" style={{ color: TOKENS.text }}>Tambah Akun</h3>
              <p className="text-xs" style={{ color: TOKENS.textMuted }}>Lacak performa akun TikTok baru</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-black/5"
            style={{ color: TOKENS.textMuted, border: `1px solid ${TOKENS.inputBorder}` }}
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 flex-1 overflow-auto p-6 space-y-6">
          {/* Username */}
          <div>
            <label className="text-[11px] font-black uppercase tracking-wider mb-2 block" style={{ color: TOKENS.textMuted }}>
              Username TikTok
            </label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: TOKENS.textMuted }} strokeWidth={2.5} />
              <Input
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="nama_akun"
                className="pl-9 h-11 rounded-xl font-semibold"
                style={{ background: '#fff', border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.text }}
              />
            </div>
            <p className="text-[11px] mt-1.5" style={{ color: TOKENS.textMuted }}>
              Tanpa simbol "@", contoh: <span className="font-bold">podomorogarden</span>
            </p>
          </div>

          {/* Type selector */}
          <div>
            <label className="text-[11px] font-black uppercase tracking-wider mb-2 block" style={{ color: TOKENS.textMuted }}>
              Tipe Pelacakan
            </label>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(TYPE_META).map(([key, meta]) => {
                const Ico = meta.icon;
                const sel = form.type === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm({ ...form, type: key as any })}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                    style={{
                      background: sel ? meta.tint : '#fff',
                      border: `1px solid ${sel ? meta.border : TOKENS.inputBorder}`,
                      boxShadow: sel ? `0 0 0 3px ${meta.solid}11` : 'none',
                    }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: meta.solid }}>
                      <Ico className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-sm" style={{ color: sel ? meta.solid : TOKENS.text }}>{meta.label}</p>
                      <p className="text-[11px]" style={{ color: TOKENS.textMuted }}>
                        {key === 'own' && 'Akun yang Anda kelola sendiri'}
                        {key === 'competitor' && 'Pesaing langsung di niche serupa'}
                        {key === 'inspiration' && 'Referensi konten & strategi'}
                      </p>
                    </div>
                    {sel && <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: meta.solid }} strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[11px] font-black uppercase tracking-wider mb-2 block" style={{ color: TOKENS.textMuted }}>
              Catatan (opsional)
            </label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3}
              placeholder="Misalnya: spesialisasi konten, alasan dipantau..."
              className="w-full px-3 py-2.5 rounded-xl text-sm font-medium outline-none resize-none"
              style={{ background: '#fff', border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.text }}
            />
          </div>

          {/* Spacer */}
          <div className="h-10" />
        </form>

        <div
          className="relative z-10 p-6 flex items-center gap-2 mt-auto"
          style={{ borderTop: `1px solid ${TOKENS.divider}`, background: TOKENS.cardSoft }}
        >
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl font-black"
            style={{ background: '#fff', border: `1px solid ${TOKENS.inputBorder}`, color: TOKENS.text }}
          >
            Batal
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!form.username.trim()}
            className="flex-1 h-11 rounded-xl font-black"
            style={{ background: '#111', color: '#fff' }}
          >
            <Plus className="w-4 h-4 mr-1.5" strokeWidth={2.5} />
            Tambah Akun
          </Button>
        </div>
      </div>
    </>
  );
};
