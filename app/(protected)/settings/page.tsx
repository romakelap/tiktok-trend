"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  LogOut,
  Shield,
  Sliders,
  UserCircle,
} from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { TOKENS } from "@/lib/design-tokens";
import { ROUTES } from "@/lib/routes";
import { clearAuthTokens } from "@/lib/auth";
import { logoutUser } from "@/lib/auth-api";
import { PreferenceForm } from "@/components/settings/PreferenceForm";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { Toast, type ToastType } from "@/components/settings/Toast";

type TabKey = "profile" | "preferences" | "security";

const TABS: { id: TabKey; label: string; Ico: typeof UserCircle }[] = [
  { id: "profile", label: "Profil", Ico: UserCircle },
  { id: "preferences", label: "Preferensi", Ico: Sliders },
  { id: "security", label: "Keamanan", Ico: Shield },
];

/**
 * Settings page composition. All three tabs talk to the existing Spring
 * Boot endpoints (`GET /api/users/me`, `PUT /api/users/me`,
 * `PUT /api/users/preferences`, `POST /api/auth/forgot-password`,
 * `POST /api/auth/logout`). The previous Danger Zone tab was removed
 * because the backend has no matching endpoints for those actions.
 */
export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const toastId = useRef(0);

  const addToast = (message: string) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500
    );
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logoutUser();
    } catch (err) {
      // Even if the backend call fails (e.g. token already expired) we
      // still want to clear local state and bounce the user out.
      console.warn("Logout request failed:", err);
    } finally {
      clearAuthTokens();
      router.replace(ROUTES.login);
    }
  };

  return (
    <PageShell title="Pengaturan">
      <div className="p-6 space-y-6">
        {/* Toolbar */}
        <div
          className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b"
          style={{ borderColor: TOKENS.divider }}
        >
          <div>
            <h1
              className="text-xl font-black flex items-center gap-2 tracking-tight"
              style={{ color: TOKENS.text }}
            >
              Pengaturan
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-black text-white"
                style={{ background: "#111" }}
              >
                Akun &amp; Preferensi
              </span>
            </h1>
            <p className="text-xs" style={{ color: TOKENS.textMuted }}>
              Kelola profil, preferensi tampilan, dan keamanan akun.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="h-10 px-3 rounded-xl text-xs font-black flex items-center gap-2 transition-all hover:opacity-80 disabled:opacity-60"
              style={{
                background: TOKENS.negativeBg,
                color: TOKENS.negative,
                border: `1px solid rgba(185,28,28,0.18)`,
              }}
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={2.5} />
              {loggingOut ? "Keluar…" : "Keluar"}
            </button>
          </div>
        </div>

        {/* Tab nav */}
        <div
          className="flex gap-1 p-1 rounded-2xl w-fit"
          style={{
            background: TOKENS.card,
            border: `1px solid ${TOKENS.cardBorder}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {TABS.map((tab) => {
            const sel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-200"
                style={{
                  background: sel ? TOKENS.charcoal : "transparent",
                  color: sel ? "#fff" : TOKENS.textMuted,
                  border: sel
                    ? "1px solid rgba(0,0,0,0.1)"
                    : "1px solid transparent",
                  boxShadow: sel ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                }}
              >
                <tab.Ico className="w-3.5 h-3.5" strokeWidth={2.4} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="max-w-5xl space-y-4">
          {activeTab === "profile" && (
            <ProfileForm
              reloadKey={reloadKey}
              onSave={addToast}
              onProfileChanged={() => setReloadKey((k) => k + 1)}
            />
          )}
          {activeTab === "preferences" && (
            <PreferenceForm reloadKey={reloadKey} onSave={addToast} />
          )}
          {activeTab === "security" && (
            <SecuritySection reloadKey={reloadKey} />
          )}

          {/* Backend-coverage note for the curious developer */}
          <p
            className="text-[10px] flex items-start gap-1.5 pt-2"
            style={{ color: TOKENS.textMuted }}
          >
            <AlertCircle
              className="w-3 h-3 flex-shrink-0 mt-px"
              strokeWidth={2.4}
            />
            Halaman ini hanya menampilkan field yang didukung oleh endpoint{" "}
            <code style={{ background: "rgba(0,0,0,0.04)", padding: "1px 4px", borderRadius: 4 }}>
              /api/users/me
            </code>{" "}
            dan{" "}
            <code style={{ background: "rgba(0,0,0,0.04)", padding: "1px 4px", borderRadius: 4 }}>
              /api/users/preferences
            </code>
            .
          </p>
        </div>
      </div>

      <Toast
        toasts={toasts}
        onDismiss={(id) =>
          setToasts((prev) => prev.filter((t) => t.id !== id))
        }
      />
    </PageShell>
  );
}
