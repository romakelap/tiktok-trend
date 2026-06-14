import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";
import type { LoginRequest, LoginResponse } from "./types";
import { saveAuthSession } from "./auth";

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  userId: number;
  fullName?: string;
  email: string;
  role?: string;
};

export async function registerUser(payload: RegisterRequest) {
  return apiFetch<RegisterResponse>(API_ENDPOINTS.auth.register, {
    method: "POST",
    auth: false,
    body: {
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
    },
  });
}

export async function loginUser(payload: LoginRequest) {
  const response = await apiFetch<LoginResponse>(API_ENDPOINTS.auth.login, {
    method: "POST",
    body: payload,
    auth: false,
    redirectOnUnauthorized: false,
  });

  saveAuthSession({
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
    user: {
      id: response.data.userId,
      fullName: response.data.fullName,
      email: response.data.email,
      role: response.data.role,
      status: "active",
    },
  });

  return response;
}

export async function loginWithTikTok(code: string) {
  const response = await apiFetch<LoginResponse>("/api/auth/tiktok/callback", {
    method: "POST",
    body: { code },
    auth: false,
    redirectOnUnauthorized: false,
  });

  if (response.success && response.data) {
    saveAuthSession({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      user: {
        id: response.data.userId,
        fullName: response.data.fullName,
        email: response.data.email,
        role: response.data.role,
        status: "active",
      },
    });
  }

  return response;
}

export async function logoutUser() {
  return apiFetch<null>(API_ENDPOINTS.auth.logout, {
    method: "POST",
    auth: true,
    redirectOnUnauthorized: false,
  });
}