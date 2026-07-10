import type { UserRole } from "./types";

export const AUTH_MESSAGES = {
  REQUIRED_FIELD: "Email dan password wajib diisi.",
  INVALID_CREDENTIAL: "Email atau password salah.",
  SERVER_ERROR: "Terjadi kesalahan pada server.",
  LOGIN_SUCCESS: "Login berhasil.",
} as const;

export const AUTH_STORAGE_KEY = "ems-auth";

export const DASHBOARD_ROUTES: Record<UserRole, string> = {
  superadmin: "/dashboard",
  hrd: "/dashboard",
  employee: "/dashboard",
  manager: "/dashboard",
};