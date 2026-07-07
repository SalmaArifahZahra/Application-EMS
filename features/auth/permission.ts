import type { UserRole } from "./types";

export const ROLE_PERMISSIONS: Record<
  UserRole,
  string[]
> = {
  superadmin: [
    "/dashboard",
    "/dashboard/employees",
    "/dashboard/departments",
    "/dashboard/positions",
    "/dashboard/users",
    "/dashboard/reports",
  ],

  hrd: [
    "/dashboard",
    "/dashboard/employees",
    "/dashboard/departments",
    "/dashboard/positions",
    "/dashboard/reports",
  ],

  employee: [
    "/dashboard",
    "/dashboard/profile",
    "/dashboard/change-password",
  ],
};