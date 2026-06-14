import type { SelectOption } from "@/lib/types";

import type { ThemeMode } from "./types";

/**
 * UI catalogues used by the Preferences tab. Backend stores these as plain
 * strings, so any new entry here just needs the same key the API will echo
 * back — no schema migration required.
 */

export const THEMES: { id: ThemeMode; label: string; preview: string[] }[] = [
  { id: "light", label: "Light", preview: ["#ffffff", "#f9f9f9", "#111111"] },
  { id: "dark", label: "Dark", preview: ["#1c1c1c", "#111111", "#ffffff"] },
  { id: "auto", label: "System", preview: ["#f9f9f9", "#1c1c1c", "#6b7280"] },
];

export const LANGUAGES: { code: string; label: string; flag: string; region: string }[] = [
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩", region: "Indonesia" },
  { code: "en", label: "English", flag: "🇺🇸", region: "United States" },
];

export const TIMEZONE_OPTIONS: SelectOption[] = [
  { value: "Asia/Makassar", label: "WITA — Asia/Makassar (UTC+8)" },
  { value: "Asia/Jakarta", label: "WIB  — Asia/Jakarta (UTC+7)" },
  { value: "Asia/Jayapura", label: "WIT  — Asia/Jayapura (UTC+9)" },
  { value: "UTC", label: "UTC  — Coordinated Universal" },
];

export const DASHBOARD_VIEW_OPTIONS: SelectOption[] = [
  { value: "overview", label: "Overview" },
  { value: "analytics", label: "Analytics" },
  { value: "ml", label: "ML Predictions" },
];

export const ITEMS_PER_PAGE_OPTIONS: SelectOption[] = [
  { value: "10", label: "10 per halaman" },
  { value: "20", label: "20 per halaman" },
  { value: "50", label: "50 per halaman" },
  { value: "100", label: "100 per halaman" },
];

export const DATE_FORMAT_OPTIONS: SelectOption[] = [
  { value: "dd/mm/yyyy", label: "dd/mm/yyyy (21/05/2026)" },
  { value: "yyyy-mm-dd", label: "yyyy-mm-dd (2026-05-21)" },
  { value: "mm/dd/yyyy", label: "mm/dd/yyyy (05/21/2026)" },
];
