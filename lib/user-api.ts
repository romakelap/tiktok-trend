import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";

export type CurrentUser = {
  userId: number;
  name?: string;
  fullName?: string;
  username?: string;
  email: string;
  role?: string;
  language?: string;
  theme?: string;
};

export type UpdateProfileRequest = {
  name?: string;
  fullName?: string;
  username?: string;
};

export type UpdatePreferencesRequest = {
  language: "ID" | "EN";
  theme: "light" | "dark" | "system";
};

export async function getCurrentUser() {
  return apiFetch<CurrentUser>(API_ENDPOINTS.users.me, {
    method: "GET",
    auth: true,
  });
}

export async function updateCurrentUser(payload: UpdateProfileRequest) {
  return apiFetch<CurrentUser>(API_ENDPOINTS.users.me, {
    method: "PUT",
    auth: true,
    body: payload,
  });
}

export async function updateUserPreferences(payload: UpdatePreferencesRequest) {
  return apiFetch<CurrentUser>(API_ENDPOINTS.users.preferences, {
    method: "PUT",
    auth: true,
    body: payload,
  });
}