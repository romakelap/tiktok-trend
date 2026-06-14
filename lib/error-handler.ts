import { ApiError } from "./types";

export function createApiError(
  status: number,
  message: string,
  data?: unknown
): ApiError {
  return new ApiError(status, message, data);
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  if (error && typeof error === "object" && "message" in error) {
    return String(
      (error as { message?: string }).message || "Unexpected error occurred"
    );
  }

  return "Unexpected error occurred";
}

export function mapStatusToMessage(status: number, fallback?: string): string {
  if (fallback) return fallback;

  switch (status) {
    case 400:
      return "Invalid request. Please check your input.";
    case 401:
      return "Your session has expired. Please log in again.";
    case 403:
      return "You do not have permission to access this resource.";
    case 404:
      return "The requested data was not found.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
}