/**
 * Types mirroring the Spring Boot `UserProfileResponse` / `UserPreferenceResponse`
 * and the request bodies the Settings page sends back. Kept here so the
 * UI components can stay typed without each one re-declaring the shapes.
 */

export type ThemeMode = "light" | "dark" | "auto";

export type LanguageCode = string;

export interface UserPreferenceDto {
  preferenceId: number;
  language: LanguageCode;
  theme: ThemeMode;
  onboardingCompleted: boolean | null;
  onboardingStep: number | null;
  onboardingSkipped: boolean | null;
  defaultDashboardView: string | null;
  itemsPerPage: number | null;
  timezone: string | null;
  dateFormat: string | null;
  emailNotifications: boolean | null;
  trendAlertEnabled: boolean | null;
  weeklySummaryEmail: boolean | null;
}

export interface UserProfileDto {
  userId: number;
  email: string;
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  phoneNumber: string | null;
  bio: string | null;
  language: LanguageCode | null;
  theme: ThemeMode | null;
  role: string | null;
  preferences: UserPreferenceDto | null;
}

/** Body for PUT /api/users/me — all fields optional. */
export interface UpdateProfileBody {
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  bio?: string;
  language?: string;
  theme?: ThemeMode;
}

/** Body for PUT /api/users/preferences — all fields optional. */
export interface UpdatePreferenceBody {
  language?: string;
  theme?: ThemeMode;
  defaultDashboardView?: string;
  itemsPerPage?: number;
  timezone?: string;
  dateFormat?: string;
  emailNotifications?: boolean;
  trendAlertEnabled?: boolean;
  weeklySummaryEmail?: boolean;
}

/** Local UI state for the profile tab. Only fields the backend persists. */
export interface ProfileFormState {
  fullName: string;
  username: string;
  email: string; // read-only
  phoneNumber: string;
  bio: string;
  avatarUrl: string;
}

/** Local UI state for the preferences tab. */
export interface PreferenceFormState {
  language: string;
  theme: ThemeMode;
  timezone: string;
  defaultDashboardView: string;
  itemsPerPage: number;
  dateFormat: string;
  emailNotifications: boolean;
  trendAlertEnabled: boolean;
  weeklySummaryEmail: boolean;
}
