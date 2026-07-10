import type { UserRole } from "./types";

export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  "/dashboard/employees": ["employee.view", "employee.view.self"],
  "/dashboard/departments": ["department.view"],
  "/dashboard/positions": ["position.view"],
  "/dashboard/users": ["user.view"],
  "/dashboard/reports": ["report.view"],
};
