import type { AuthUser } from "./types";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";


export function setAuthTokens(accessToken: string, refreshToken?: string | null) {
  if (typeof window === "undefined") return;

  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function saveAuthTokens(params: {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}) {
  if (typeof window === "undefined") return;

  localStorage.setItem(ACCESS_TOKEN_KEY, params.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, params.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(params.user));
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

export function clearAuthTokens() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}

export function saveAuthSession(params: {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}) {
  if (typeof window === "undefined") return;

  localStorage.setItem("accessToken", params.accessToken);

  if (params.refreshToken) {
    localStorage.setItem("refreshToken", params.refreshToken);
  }

  localStorage.setItem("user", JSON.stringify(params.user));
}


export function saveAuthUser(user: AuthUser) {
  if (typeof window === "undefined") return;

  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(USER_KEY);
}