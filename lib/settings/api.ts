import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";

import type {
  PreferenceFormState,
  ProfileFormState,
  ThemeMode,
  UpdatePreferenceBody,
  UpdateProfileBody,
  UserPreferenceDto,
  UserProfileDto,
} from "./types";

const DEFAULT_PREFERENCES: PreferenceFormState = {
  language: "id",
  theme: "auto",
  timezone: "Asia/Jakarta",
  defaultDashboardView: "overview",
  itemsPerPage: 20,
  dateFormat: "dd/mm/yyyy",
  emailNotifications: true,
  trendAlertEnabled: true,
  weeklySummaryEmail: true,
};

const DEFAULT_PROFILE: ProfileFormState = {
  fullName: "",
  username: "",
  email: "",
  phoneNumber: "",
  bio: "",
  avatarUrl: "",
};

/** Coerce arbitrary string into a known ThemeMode. */
export function normalizeTheme(value: unknown): ThemeMode {
  if (value === "light" || value === "dark" || value === "auto") return value;
  return "auto";
}

/**
 * `next-themes` uses "system" for the OS-driven mode, but the backend
 * stores it as "auto". These helpers translate between the two.
 */
export function backendThemeToClient(theme: ThemeMode): "light" | "dark" | "system" {
  return theme === "auto" ? "system" : theme;
}

export function clientThemeToBackend(theme: string): ThemeMode {
  return theme === "system" ? "auto" : normalizeTheme(theme);
}

/** Pull profile + preferences from `/api/users/me` and split into UI shapes. */
export async function loadSettings(): Promise<{
  profile: ProfileFormState;
  preferences: PreferenceFormState;
  raw: UserProfileDto | null;
}> {
  const res = await apiFetch<UserProfileDto>(API_ENDPOINTS.users.me);
  if (!res.success || !res.data) {
    throw new Error(res.message || "Gagal memuat data pengaturan");
  }
  return {
    profile: profileDtoToForm(res.data),
    preferences: preferenceDtoToForm(res.data.preferences),
    raw: res.data,
  };
}

/** PUT /api/users/me with the editable profile fields only. */
export async function saveProfile(
  state: ProfileFormState
): Promise<UserProfileDto> {
  const body: UpdateProfileBody = {
    username: state.username || undefined,
    fullName: state.fullName || undefined,
    phoneNumber: state.phoneNumber || undefined,
    bio: state.bio || undefined,
    avatarUrl: state.avatarUrl || undefined,
  };
  const res = await apiFetch<UserProfileDto>(API_ENDPOINTS.users.me, {
    method: "PUT",
    body,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message || "Gagal menyimpan profil");
  }
  return res.data;
}

/** PUT /api/users/preferences with the editable preference fields. */
export async function savePreferences(
  state: PreferenceFormState
): Promise<UserPreferenceDto> {
  const body: UpdatePreferenceBody = {
    language: state.language,
    theme: state.theme,
    timezone: state.timezone,
    defaultDashboardView: state.defaultDashboardView,
    itemsPerPage: state.itemsPerPage,
    dateFormat: state.dateFormat,
    emailNotifications: state.emailNotifications,
    trendAlertEnabled: state.trendAlertEnabled,
    weeklySummaryEmail: state.weeklySummaryEmail,
  };
  const res = await apiFetch<UserPreferenceDto>(API_ENDPOINTS.users.preferences, {
    method: "PUT",
    body,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message || "Gagal menyimpan preferensi");
  }
  return res.data;
}

/** POST /api/auth/forgot-password — used by the Security tab. */
export async function requestPasswordReset(email: string): Promise<{ message: string; resetToken: string }> {
  const res = await apiFetch<{ message: string; resetToken: string }>(API_ENDPOINTS.auth.forgotPassword, {
    method: "POST",
    body: { email },
    auth: false,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message || "Gagal memproses reset password");
  }
  return res.data;
}

/** POST /api/auth/reset-password — used to apply a new password. */
export async function submitPasswordReset(resetToken: string, newPassword: string): Promise<void> {
  const res = await apiFetch<unknown>(API_ENDPOINTS.auth.resetPassword, {
    method: "POST",
    body: { resetToken, newPassword },
    auth: false,
  });
  if (!res.success) {
    throw new Error(res.message || "Gagal mereset password");
  }
}

// ─── DTO ↔ Form mappers ────────────────────────────────────────────────

function profileDtoToForm(dto: UserProfileDto): ProfileFormState {
  return {
    fullName: dto.fullName ?? "",
    username: dto.username ?? "",
    email: dto.email ?? "",
    phoneNumber: dto.phoneNumber ?? "",
    bio: dto.bio ?? "",
    avatarUrl: dto.avatarUrl ?? "",
  };
}

function preferenceDtoToForm(
  dto: UserPreferenceDto | null
): PreferenceFormState {
  if (!dto) return { ...DEFAULT_PREFERENCES };
  return {
    language: dto.language ?? DEFAULT_PREFERENCES.language,
    theme: normalizeTheme(dto.theme),
    timezone: dto.timezone ?? DEFAULT_PREFERENCES.timezone,
    defaultDashboardView:
      dto.defaultDashboardView ?? DEFAULT_PREFERENCES.defaultDashboardView,
    itemsPerPage: dto.itemsPerPage ?? DEFAULT_PREFERENCES.itemsPerPage,
    dateFormat: dto.dateFormat ?? DEFAULT_PREFERENCES.dateFormat,
    emailNotifications:
      dto.emailNotifications ?? DEFAULT_PREFERENCES.emailNotifications,
    trendAlertEnabled:
      dto.trendAlertEnabled ?? DEFAULT_PREFERENCES.trendAlertEnabled,
    weeklySummaryEmail:
      dto.weeklySummaryEmail ?? DEFAULT_PREFERENCES.weeklySummaryEmail,
  };
}

export { DEFAULT_PREFERENCES, DEFAULT_PROFILE };
