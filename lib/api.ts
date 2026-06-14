import { clearAuthTokens, getAccessToken, getRefreshToken, setAuthTokens } from "./auth";
import { createApiError, mapStatusToMessage } from "./error-handler";
import type { ApiResponse } from "./types";
import { API_ENDPOINTS } from "./endpoints";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
  redirectOnUnauthorized?: boolean;
  _isRetry?: boolean;
};

function buildUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    body,
    headers = {},
    auth = true,
    redirectOnUnauthorized = true,
  } = options;

  const token = getAccessToken();

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Only attach token when endpoint requires auth.
  // Register and login must use auth: false.
  if (auth && token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const url = buildUrl(path);

  console.log("API Request:", {
    url,
    method,
    auth,
    body,
    headers: requestHeaders,
  });

  let response: Response;

  try {
    response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch (error) {
    console.error("Network / CORS / fetch error:", error);
    throw createApiError(0, "Unable to connect to server");
  }

  let payload: ApiResponse<T> | null = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  console.log("API Response:", {
    status: response.status,
    ok: response.ok,
    payload,
  });

  if (!response.ok) {
    if (response.status === 401 && auth && !options._isRetry) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          console.log("Token expired. Attempting to refresh token...");
          const refreshRes = await fetch(buildUrl(API_ENDPOINTS.auth.refreshToken), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshPayload = await refreshRes.json();
            if (refreshPayload && refreshPayload.success && refreshPayload.data) {
              const newAccessToken = refreshPayload.data.accessToken;
              const newRefreshToken = refreshPayload.data.refreshToken;
              console.log("Token refreshed successfully.");
              
              setAuthTokens(newAccessToken, newRefreshToken);
              
              return apiFetch<T>(path, {
                ...options,
                _isRetry: true,
              });
            }
          }
        } catch (refreshErr) {
          console.error("Token refresh failed:", refreshErr);
        }
      }
    }

    const message = mapStatusToMessage(response.status, payload?.message);

    if (
      response.status === 401 &&
      redirectOnUnauthorized &&
      typeof window !== "undefined"
    ) {
      clearAuthTokens();
      window.location.href = "/login";
    }

    throw createApiError(response.status, message, payload);
  }

  if (!payload) {
    throw createApiError(response.status, "Empty response from server");
  }

  if (payload.success === false) {
    throw createApiError(response.status, payload.message, payload);
  }

  return payload;
}

export async function downloadFile(path: string, filename: string) {
  const token = getAccessToken();

  const response = await fetch(buildUrl(path), {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw createApiError(response.status, mapStatusToMessage(response.status));
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
}