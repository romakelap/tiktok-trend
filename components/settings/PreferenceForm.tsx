"use client";

import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Bell,
  Check,
  ChevronDown,
  CheckCircle2,
  Clock,
  Info,
  LayoutGrid,
  Languages as LangIcon,
  Monitor,
  Moon,
  Palette,
  RefreshCw,
  Save,
  Sliders,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

import { TOKENS } from "@/lib/design-tokens";
import { useLanguage, type Language } from "@/context/LanguageContext";
import {
  DEFAULT_PREFERENCES,
  backendThemeToClient,
  clientThemeToBackend,
  loadSettings,
  savePreferences,
} from "@/lib/settings/api";
import {
  DASHBOARD_VIEW_OPTIONS,
  DATE_FORMAT_OPTIONS,
  ITEMS_PER_PAGE_OPTIONS,
  LANGUAGES,
  THEMES,
  TIMEZONE_OPTIONS,
} from "@/lib/settings/options";
import type { PreferenceFormState, ThemeMode } from "@/lib/settings/types";
import { Label } from "./FormElements";
import { SettingsSection } from "./SettingsSection";

interface PreferenceFormProps {
  onSave?: (msg: string) => void;
  reloadKey?: number;
}

// ─── Small inputs ─────────────────────────────────────────────────────

function ThemeSelector({
  value,
  onChange,
}: {
  value: ThemeMode;
  onChange: (v: ThemeMode) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {THEMES.map((th) => {
        const sel = value === th.id;
        const Icon = th.id === "light" ? Sun : th.id === "dark" ? Moon : Monitor;
        return (
          <button
            key={th.id}
            type="button"
            onClick={() => onChange(th.id)}
            className="relative p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 text-left cursor-pointer"
            style={{
              background: sel ? "rgba(0,0,0,0.055)" : "rgba(0,0,0,0.025)",
              border: sel
                ? "1px solid rgba(0,0,0,0.18)"
                : `1px solid ${TOKENS.inputBorder}`,
              boxShadow: sel
                ? "0 0 0 2px #111, inset 0 1px 0 rgba(255,255,255,0.9)"
                : "none",
            }}
          >
            {sel && (
              <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center bg-rose-500">
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </div>
            )}
            <div className="flex gap-1 mb-3">
              {th.preview.map((c, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-md flex-shrink-0"
                  style={{ background: c, border: "1px solid rgba(0,0,0,0.08)" }}
                />
              ))}
            </div>
            <Icon
              className="w-4 h-4 mb-2"
              style={{ color: sel ? TOKENS.text : TOKENS.textMuted }}
              strokeWidth={2.2}
            />
            <p
              className="font-black text-xs"
              style={{ color: sel ? TOKENS.text : TOKENS.textSubtle }}
            >
              {th.label}
            </p>
          </button>
        );
      })}
    </div>
  );
}

function LanguageSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = LANGUAGES.find((l) => l.code === value) ?? LANGUAGES[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full h-11 px-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer"
        style={{
          background: TOKENS.card,
          border: `1px solid ${open ? TOKENS.inputFocus : TOKENS.inputBorder}`,
          boxShadow: open ? "0 0 0 3px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <span className="text-lg leading-none">{selected.flag}</span>
        <span
          className="flex-1 text-left text-sm font-semibold"
          style={{ color: TOKENS.text }}
        >
          {selected.label}
        </span>
        <ChevronDown
          className="w-4 h-4 transition-transform"
          style={{
            color: TOKENS.textMuted,
            transform: open ? "rotate(180deg)" : "none",
          }}
          strokeWidth={2.5}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 z-30 rounded-xl overflow-hidden"
          style={{
            background: "#fff",
            border: `1px solid ${TOKENS.cardBorder}`,
            boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          }}
        >
          {LANGUAGES.map((lang, i) => {
            const sel = value === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  onChange(lang.code);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 transition-all hover:bg-black/[0.03] cursor-pointer"
                style={{
                  borderBottom:
                    i < LANGUAGES.length - 1
                      ? `1px solid ${TOKENS.divider}`
                      : "none",
                }}
              >
                <span className="text-base leading-none">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <p
                    className="text-sm font-bold"
                    style={{ color: TOKENS.text }}
                  >
                    {lang.label}
                  </p>
                  <p
                    className="text-[10px] font-semibold"
                    style={{ color: TOKENS.textMuted }}
                  >
                    {lang.region}
                  </p>
                </div>
                {sel && <Check className="w-4 h-4 text-rose-500" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-3 rounded-xl text-sm font-semibold outline-none appearance-none cursor-pointer"
        style={{
          background: TOKENS.card,
          border: `1px solid ${TOKENS.inputBorder}`,
          color: TOKENS.text,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
        style={{ color: TOKENS.textMuted }}
        strokeWidth={2.5}
      />
    </div>
  );
}

function Toggle({
  value,
  onChange,
  label,
  description,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 py-3.5"
      style={{ borderBottom: `1px solid ${TOKENS.divider}` }}
    >
      <div className="flex-1">
        <p className="text-sm font-black" style={{ color: TOKENS.text }}>
          {label}
        </p>
        {description && (
          <p
            className="text-[11px] mt-0.5"
            style={{ color: TOKENS.textMuted }}
          >
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="flex-shrink-0 w-11 h-6 rounded-full relative transition-all duration-200 cursor-pointer"
        style={{ background: value ? "#f43f5e" : "rgba(0,0,0,0.12)" }}
      >
        <div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200"
          style={{
            left: value ? "calc(100% - 22px)" : "2px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }}
        />
      </button>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────

/**
 * Preferences tab. Loads `/api/users/me` once, edits only the keys the
 * backend's `UpdatePreferenceRequest` accepts, and applies theme/language
 * to the client contexts after a successful save.
 */
export function PreferenceForm({ onSave, reloadKey = 0 }: PreferenceFormProps) {
  const { setLanguage } = useLanguage();
  const { setTheme } = useTheme();

  const [form, setForm] = useState<PreferenceFormState>(DEFAULT_PREFERENCES);
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
      .then(({ preferences }) => {
        if (!active) return;
        setForm(preferences);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const msg = err instanceof Error ? err.message : "Gagal memuat preferensi";
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
    <K extends keyof PreferenceFormState>(k: K) =>
    (v: PreferenceFormState[K]) =>
      setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const saved = await savePreferences(form);

      // Push the freshly-saved theme/language into the client contexts.
      setTheme(backendThemeToClient(form.theme));
      if (saved.language === "id" || saved.language === "en") {
        setLanguage(saved.language as Language);
      }

      setSaved(true);
      onSave?.("Preferensi berhasil disimpan");
      window.setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan preferensi";
      setSaveError(msg);
      onSave?.(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SettingsSection icon={Sliders} title="Preferensi" subtitle="Memuat dari backend…">
        <div
          className="flex items-center justify-center py-12 gap-2 text-sm font-bold"
          style={{ color: TOKENS.textMuted }}
        >
          <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={2.4} />
          Memuat preferensi…
        </div>
      </SettingsSection>
    );
  }

  if (loadError) {
    return (
      <SettingsSection icon={Sliders} title="Preferensi" subtitle="Gagal memuat data">
        <div
          className="p-4 rounded-xl flex items-start gap-2"
          style={{
            background: "rgba(185,28,28,0.06)",
            border: "1px solid rgba(185,28,28,0.18)",
          }}
        >
          <AlertCircle
            className="w-4 h-4 mt-0.5 flex-shrink-0"
            style={{ color: "#b91c1c" }}
            strokeWidth={2.4}
          />
          <div className="text-xs" style={{ color: "#b91c1c" }}>
            <p className="font-black mb-0.5">Gagal memuat preferensi</p>
            <p className="text-[11px] opacity-80">{loadError}</p>
          </div>
        </div>
      </SettingsSection>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SettingsSection
          icon={Palette}
          title="Tema"
          subtitle="Pilih tampilan antarmuka"
        >
          <ThemeSelector value={form.theme} onChange={set("theme")} />
          <p
            className="text-[10px] font-bold mt-3 flex items-center gap-1.5"
            style={{ color: TOKENS.textMuted }}
          >
            <Info className="w-3 h-3 text-rose-500" strokeWidth={2.5} />
            Disimpan sebagai{" "}
            <code style={{ background: "rgba(0,0,0,0.04)", padding: "1px 4px", borderRadius: 4 }}>
              user.theme_pref
            </code>{" "}
            di backend.
          </p>
        </SettingsSection>

        <SettingsSection
          icon={LangIcon}
          title="Bahasa & Zona Waktu"
          subtitle="Lokalisasi tampilan data"
        >
          <div className="space-y-4">
            <div>
              <Label>Bahasa</Label>
              <LanguageSelector value={form.language} onChange={set("language")} />
            </div>
            <div>
              <Label>Zona Waktu</Label>
              <SelectInput
                value={form.timezone}
                onChange={set("timezone")}
                options={TIMEZONE_OPTIONS}
              />
            </div>
            <div>
              <Label>Format Tanggal</Label>
              <SelectInput
                value={form.dateFormat}
                onChange={set("dateFormat")}
                options={DATE_FORMAT_OPTIONS}
              />
            </div>
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
              style={{
                background: "rgba(244,63,94,0.06)",
                border: "1px solid rgba(244,63,94,0.14)",
              }}
            >
              <Clock
                className="w-3.5 h-3.5 flex-shrink-0 text-rose-500"
                strokeWidth={2.5}
              />
              <span className="text-[11px] font-bold text-rose-600">
                Semua timestamp ditampilkan dalam zona waktu di atas.
              </span>
            </div>
          </div>
        </SettingsSection>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SettingsSection
          icon={Bell}
          title="Notifikasi"
          subtitle="Atur kapan kamu ingin dihubungi"
        >
          <div>
            <Toggle
              value={form.emailNotifications}
              onChange={(v) => set("emailNotifications")(v)}
              label="Email Notifikasi"
              description="Kirim notifikasi umum ke email terdaftar."
            />
            <Toggle
              value={form.weeklySummaryEmail}
              onChange={(v) => set("weeklySummaryEmail")(v)}
              label="Ringkasan Mingguan"
              description="Rekap performa setiap Senin pagi."
            />
            <Toggle
              value={form.trendAlertEnabled}
              onChange={(v) => set("trendAlertEnabled")(v)}
              label="Alert Tren"
              description="Notifikasi saat ada konten/hashtag dengan viral probability tinggi."
            />
          </div>
        </SettingsSection>

        <SettingsSection
          icon={LayoutGrid}
          title="Tampilan Default"
          subtitle="Atur perilaku dashboard"
        >
          <div className="space-y-4">
            <div>
              <Label>Halaman Default</Label>
              <SelectInput
                value={form.defaultDashboardView}
                onChange={set("defaultDashboardView")}
                options={DASHBOARD_VIEW_OPTIONS}
              />
              <p
                className="text-[10px] font-bold mt-1.5"
                style={{ color: TOKENS.textMuted }}
              >
                Tampilan yang dibuka setelah login.
              </p>
            </div>
            <div>
              <Label>Items per Halaman</Label>
              <SelectInput
                value={String(form.itemsPerPage)}
                onChange={(v) => set("itemsPerPage")(Number.parseInt(v, 10) || 20)}
                options={ITEMS_PER_PAGE_OPTIONS}
              />
            </div>
          </div>
        </SettingsSection>
      </div>

      {saveError && (
        <div
          className="p-3 rounded-xl flex items-start gap-2"
          style={{
            background: "rgba(185,28,28,0.06)",
            border: "1px solid rgba(185,28,28,0.18)",
          }}
        >
          <AlertCircle
            className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
            style={{ color: "#b91c1c" }}
            strokeWidth={2.4}
          />
          <span className="text-[11px] font-bold" style={{ color: "#b91c1c" }}>
            {saveError}
          </span>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
          style={{
            background: saved ? "#047857" : "#111",
            color: "#fff",
            boxShadow: saved
              ? "0 4px 14px rgba(4,120,87,0.35)"
              : "0 4px 14px rgba(0,0,0,0.2)",
          }}
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={2.5} />
          ) : saved ? (
            <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
          ) : (
            <Save className="w-4 h-4" strokeWidth={2.5} />
          )}
          {saving ? "Menyimpan…" : saved ? "Tersimpan!" : "Simpan Preferensi"}
        </button>
      </div>
    </div>
  );
}
