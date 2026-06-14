"use client";

import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Mail,
  RefreshCw,
  Shield,
} from "lucide-react";

import { TOKENS } from "@/lib/design-tokens";
import { loadSettings, requestPasswordReset, submitPasswordReset } from "@/lib/settings/api";
import { SettingsSection } from "./SettingsSection";
import { Label, TextInput } from "./FormElements";


interface SecuritySectionProps {
  reloadKey?: number;
}

/**
 * Security tab. The backend does not expose a logged-in "change password"
 * endpoint — only `POST /api/auth/forgot-password` which sends a reset
 * link via email. So this tab shows the current email, surfaces the role
 * (read-only), and lets the user trigger a reset link for themselves.
 */
export function SecuritySection({ reloadKey = 0 }: SecuritySectionProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // States for password reset simulation
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(null);
    loadSettings()
      .then(({ raw }) => {
        if (!active || !raw) return;
        setEmail(raw.email);
        setRole(raw.role);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const msg = err instanceof Error ? err.message : "Gagal memuat informasi keamanan";
        setLoadError(msg);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const handleSendReset = async () => {
    if (!email) return;
    setSending(true);
    setSendError(null);
    setResetToken(null);
    setNewPassword("");
    setResetSuccess(false);
    setResetError(null);
    try {
      const response = await requestPasswordReset(email);
      setSent(true);
      if (response && response.resetToken) {
        setResetToken(response.resetToken);
      } else {
        window.setTimeout(() => setSent(false), 4000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengirim tautan reset password";
      setSendError(msg);
    } finally {
      setSending(false);
    }
  };

  const handleApplyReset = async () => {
    if (!resetToken) return;
    if (newPassword.length < 6) {
      setResetError("Password baru minimal harus terdiri dari 6 karakter");
      return;
    }
    setResetting(true);
    setResetError(null);
    setResetSuccess(false);
    try {
      await submitPasswordReset(resetToken, newPassword);
      setResetSuccess(true);
      setNewPassword("");
      // Hide the simulation form and success notification after 5 seconds
      window.setTimeout(() => {
        setResetToken(null);
        setResetSuccess(false);
        setSent(false);
      }, 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui password";
      setResetError(msg);
    } finally {
      setResetting(false);
    }
  };


  return (
    <SettingsSection
      icon={Shield}
      title="Keamanan"
      subtitle="Identitas akun dan reset password"
    >
      {loading ? (
        <div
          className="flex items-center justify-center py-10 gap-2 text-sm font-bold"
          style={{ color: TOKENS.textMuted }}
        >
          <RefreshCw className="w-4 h-4 animate-spin" strokeWidth={2.4} />
          Memuat data…
        </div>
      ) : loadError ? (
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
            <p className="font-black mb-0.5">Gagal memuat informasi keamanan</p>
            <p className="text-[11px] opacity-80">{loadError}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity card */}
          <div className="space-y-3">
            <p
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: TOKENS.textMuted }}
            >
              Identitas Akun
            </p>
            <div
              className="flex items-center justify-between gap-3 px-3 py-3 rounded-xl"
              style={{
                background: "rgba(0,0,0,0.025)",
                border: `1px solid ${TOKENS.divider}`,
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Mail
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: TOKENS.textMuted }}
                  strokeWidth={2.2}
                />
                <div className="min-w-0">
                  <p
                    className="text-xs font-black truncate"
                    style={{ color: TOKENS.text }}
                  >
                    {email || "—"}
                  </p>
                  <p
                    className="text-[10px] font-bold"
                    style={{ color: TOKENS.textMuted }}
                  >
                    Email terdaftar
                  </p>
                </div>
              </div>
            </div>
            {role && (
              <div
                className="flex items-center justify-between gap-3 px-3 py-3 rounded-xl"
                style={{
                  background: "rgba(0,0,0,0.025)",
                  border: `1px solid ${TOKENS.divider}`,
                }}
              >
                <div>
                  <p
                    className="text-xs font-black"
                    style={{ color: TOKENS.text }}
                  >
                    {role}
                  </p>
                  <p
                    className="text-[10px] font-bold"
                    style={{ color: TOKENS.textMuted }}
                  >
                    Peran (role) akun
                  </p>
                </div>
                <span
                  className="text-[10px] font-black px-2 py-1 rounded-md"
                  style={{
                    background: "rgba(4,120,87,0.08)",
                    color: "#047857",
                    border: "1px solid rgba(4,120,87,0.2)",
                  }}
                >
                  Aktif
                </span>
              </div>
            )}
          </div>

          {/* Password reset */}
          <div className="space-y-3">
            <p
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: TOKENS.textMuted }}
            >
              Ganti Password
            </p>
            <p className="text-xs leading-relaxed" style={{ color: TOKENS.textSubtle }}>
              Backend hanya mendukung reset password melalui tautan email.
              Klik tombol di bawah dan ikuti instruksi di email kamu untuk
              memilih password baru.
            </p>
            {sendError && (
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
                  {sendError}
                </span>
              </div>
            )}
            {sent && (
              <div
                className="p-3 rounded-xl flex items-start gap-2"
                style={{
                  background: "rgba(4,120,87,0.06)",
                  border: "1px solid rgba(4,120,87,0.18)",
                }}
              >
                <CheckCircle2
                  className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                  style={{ color: "#047857" }}
                  strokeWidth={2.4}
                />
                <span
                  className="text-[11px] font-bold"
                  style={{ color: "#047857" }}
                >
                  Tautan reset password sudah dikirim ke {email}.
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={handleSendReset}
              disabled={sending || !email}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "#111",
                color: "#fff",
                boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
              }}
            >
              {sending ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" strokeWidth={2.5} />
              ) : (
                <KeyRound className="w-3.5 h-3.5" strokeWidth={2.5} />
              )}
              {sending ? "Mengirim…" : "Kirim Tautan Reset Password"}
            </button>

            {resetToken && (
              <div
                className="mt-4 p-4 rounded-xl space-y-3 transition-all duration-300"
                style={{
                  background: "rgba(255, 255, 255, 0.4)",
                  border: `1px solid ${TOKENS.divider}`,
                }}
              >
                <div className="flex items-start gap-2">
                  <Shield
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: "#059669" }}
                    strokeWidth={2.4}
                  />
                  <div className="text-xs">
                    <p className="font-black" style={{ color: "#065f46" }}>Simulasi Mode Lokal</p>
                    <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: "#047857" }}>
                      Karena berjalan secara lokal tanpa server SMTP, backend mengembalikan token secara langsung. Silakan masukkan password baru di bawah untuk menyelesaikannya.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label required>Password Baru</Label>
                  <TextInput
                    type="password"
                    value={newPassword}
                    onChange={setNewPassword}
                    placeholder="Minimal 6 karakter"
                    disabled={resetting || resetSuccess}
                  />
                </div>

                {resetError && (
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
                      {resetError}
                    </span>
                  </div>
                )}

                {resetSuccess && (
                  <div
                    className="p-3 rounded-xl flex items-start gap-2"
                    style={{
                      background: "rgba(4,120,87,0.06)",
                      border: "1px solid rgba(4,120,87,0.18)",
                    }}
                  >
                    <CheckCircle2
                      className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                      style={{ color: "#047857" }}
                      strokeWidth={2.4}
                    />
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: "#047857" }}
                    >
                      Password berhasil diperbarui! Anda akan diminta masuk kembali.
                    </span>
                  </div>
                )}

                {!resetSuccess && (
                  <button
                    type="button"
                    onClick={handleApplyReset}
                    disabled={resetting || newPassword.length < 6}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: TOKENS.accent,
                      color: "#fff",
                      boxShadow: "0 4px 14px rgba(244,63,94,0.2)",
                    }}
                  >
                    {resetting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" strokeWidth={2.5} />
                    ) : (
                      <KeyRound className="w-3.5 h-3.5" strokeWidth={2.5} />
                    )}
                    {resetting ? "Memperbarui Password..." : "Simpan Password Baru"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </SettingsSection>
  );
}
