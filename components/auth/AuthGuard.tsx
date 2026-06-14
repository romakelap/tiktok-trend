"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const { setTheme } = useTheme();
  const { setLanguage } = useLanguage();

  const [prefsLoaded, setPrefsLoaded] = useState(false);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      setPrefsLoaded(false);
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    async function loadUserPreferences() {
      try {
        const res = await apiFetch<any>(API_ENDPOINTS.users.me);
        if (res?.success && res.data?.preferences) {
          const prefs = res.data.preferences;
          if (prefs.theme) {
            setTheme(prefs.theme);
          }
          if (prefs.language) {
            setLanguage(prefs.language);
          }
        }
      } catch (err) {
        console.error("Failed to load user preferences on auth guard:", err);
      } finally {
        setChecking(false);
        setPrefsLoaded(true);
      }
    }

    if (!prefsLoaded) {
      loadUserPreferences();
    } else {
      setChecking(false);
    }
  }, [router, pathname, setTheme, setLanguage, prefsLoaded]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f7] dark:bg-neutral-950">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 px-5 py-4 shadow-sm animate-pulse">
          <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}