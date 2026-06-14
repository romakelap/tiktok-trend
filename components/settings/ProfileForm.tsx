"use client";

import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  AtSign,
  CheckCircle2,
  Image as ImageIcon,
  Mail,
  RefreshCw,
  Save,
  Smartphone,
  User,
} from "lucide-react";

import { TOKENS } from "@/lib/design-tokens";
import {
  DEFAULT_PROFILE,
  loadSettings,
  saveProfile,
} from "@/lib/settings/api";
import type { ProfileFormState } from "@/lib/settings/types";
import { Label, TextArea, TextInput } from "./FormElements";
import { SettingsSection } from "./SettingsSection";

interface ProfileFormProps {
  onSave?: (msg: string) => void;
  /** Bumped by the page when it knows new data should be re-fetched. */
  reloadKey?: number;
  /** Notified when an avatar URL is saved so the toolbar can update. */
  onProfileChanged?: () => void;
}

const BIO_LIMIT = 200;

function initialsFor(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "•"
  );
}

/**
 * Profile tab. Loads `/api/users/me` on mount, edits the fields the backend
 * actually persists (full name, username, phone, bio, avatar URL), and
 * sends them back via PUT. Email is shown read-only because there is no
 * backend endpoint to change it.
 */
export function ProfileForm({
  onSave,
  reloadKey = 0,
  onProfileChanged,
}: ProfileFormProps) {
  const [form, setForm] = useState<ProfileFormState>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(null);
    loadSettings()
      .then(({ profile }) => {
        if (!active) return;
        setForm(profile);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const msg = err instanceof Error ? err.message : "Gagal memuat profil";
        setLoadError(msg);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const set =
    <K extends keyof ProfileFormState>(k: K) =>
    (v: ProfileFormState[K]) =>
      setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await saveProfile(form);
      setSaved(true);
      onSave?.("Profil berhasil diperbarui");
      onProfileChanged?.();
      window.setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan profil";
      setSaveError(msg);
      onSave?.(msg);
    } finally {
      setSaving(false);
    }
  };

  const initials = initialsFor(form.fullName || form.username || "•");

  return (
    <SettingsSection
      icon={User}
      title="Profil"
      subtitle="Informasi akun yang tersimpan di backend"
      action={
        <button
          onClick={handleSave}
          disabled={saving || loading || Boolean(loadError)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: saved ? "#047857" : "#111",
            color: "#fff",
            boxShadow: saved
              ? "0 4px 14px rgba(4,120,87,0.35)"
              : "0 4px 14px rgba(0,0,0,0.2)",
          }}
        >
          {saving ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" strokeWidth={2.5} />
          ) : saved ? (
            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
          ) : (
            <Save className="w-3.5 h-3.5" strokeWidth={2.5} />
          )}
          {saving ? "Menyimpan…" : saved ? "Tersimpan!" : "Simpan Profil"}
        </button>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-12 gap-2 text-sm font-bold" style={{ color: TOKENS.textMuted }}>
          <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={2.4} />
          Memuat profil…
        </div>
      ) : loadError ? (
        <div
          className="p-4 rounded-xl flex items-start gap-2"
          style={{
            background: "rgba(185,28,28,0.06)",
            border: "1px solid rgba(185,28,28,0.18)",
          }}
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#b91c1c" }} strokeWidth={2.4} />
          <div className="text-xs" style={{ color: "#b91c1c" }}>
            <p className="font-black mb-0.5">Gagal memuat profil</p>
            <p className="text-[11px] opacity-80">{loadError}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Avatar preview + URL input */}
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl text-white overflow-hidden flex-shrink-0"
              style={{
                background: "#111",
                boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
              }}
            >
              {form.avatarUrl ? (
                <img
                  src={form.avatarUrl}
                  alt={form.fullName || "avatar"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1">
              <p className="font-black text-sm mb-0.5" style={{ color: TOKENS.text }}>
                Foto Profil
              </p>
              <p className="text-xs mb-2" style={{ color: TOKENS.textMuted }}>
                Tempelkan URL gambar publik (backend belum menyediakan upload file).
              </p>
              <TextInput
                value={form.avatarUrl}
                onChange={set("avatarUrl")}
                placeholder="https://…"
                icon={ImageIcon}
              />
            </div>
          </div>

          <div className="pt-2" style={{ borderTop: `1px solid ${TOKENS.divider}` }} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label required>Nama Lengkap</Label>
              <TextInput
                value={form.fullName}
                onChange={set("fullName")}
                placeholder="Nama lengkap"
                icon={User}
              />
            </div>
            <div>
              <Label required>Username</Label>
              <TextInput
                value={form.username}
                onChange={set("username")}
                placeholder="username"
                icon={AtSign}
              />
            </div>
            <div>
              <Label>Email</Label>
              <TextInput
                value={form.email}
                onChange={() => {}}
                placeholder="email@domain.com"
                icon={Mail}
                type="email"
                disabled
              />
              <p className="text-[10px] font-bold mt-1.5" style={{ color: TOKENS.textMuted }}>
                Email tidak dapat diubah dari halaman ini.
              </p>
            </div>
            <div>
              <Label>Nomor Telepon</Label>
              <TextInput
                value={form.phoneNumber}
                onChange={set("phoneNumber")}
                placeholder="+62 xxx xxxx xxxx"
                icon={Smartphone}
              />
            </div>
          </div>

          <div>
            <Label>Bio</Label>
            <TextArea
              value={form.bio}
              onChange={(v) => set("bio")(v.slice(0, BIO_LIMIT))}
              placeholder="Ceritakan tentang channel kamu…"
              rows={3}
            />
            <p className="text-[10px] font-bold mt-1.5" style={{ color: TOKENS.textMuted }}>
              {form.bio.length} / {BIO_LIMIT} karakter
            </p>
          </div>

          {saveError && (
            <div
              className="p-3 rounded-xl flex items-start gap-2"
              style={{
                background: "rgba(185,28,28,0.06)",
                border: "1px solid rgba(185,28,28,0.18)",
              }}
            >
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#b91c1c" }} strokeWidth={2.4} />
              <span className="text-[11px] font-bold" style={{ color: "#b91c1c" }}>
                {saveError}
              </span>
            </div>
          )}
        </div>
      )}
    </SettingsSection>
  );
}
