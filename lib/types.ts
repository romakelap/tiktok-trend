export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}


export type PeriodType =
  | "daily"
  | "weekly"
  | "monthly"
  | "last_30_days"
  | "all";

export type SelectOption = {
  label: string;
  value: string;
};

export type AuthUser = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  status: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInMs: number;
  userId: number;
  email: string;
  username: string;
  fullName: string;
  role: string;
};

export type CurrentUser = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UserPreferences = {
  id?: number;
  userId?: number;
  theme?: string;
  language?: string;
  timezone?: string;
  emailNotification?: boolean;
  dashboardDefaultRange?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateUserPreferencesRequest = {
  theme?: string;
  language?: string;
  timezone?: string;
  emailNotification?: boolean;
  dashboardDefaultRange?: string;
};
