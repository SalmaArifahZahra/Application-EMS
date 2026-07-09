import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  ShieldCheck,
  FileBarChart2,
  UserCircle,
} from "lucide-react";

import type { UserRole } from "@/features/auth/types";

export interface DashboardMenu {
  title: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
    size?: number;
  }>;

  roles: UserRole[];
}

export const DASHBOARD_MENU: DashboardMenu[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "superadmin",
      "hrd",
      "employee",
    ],
  },

  {
    title: "Employees",
    href: "/dashboard/employees",
    icon: Users,
    roles: [
      "superadmin",
      "hrd",
    ],
  },

  {
    title: "Departments",
    href: "/dashboard/departments",
    icon: Building2,
    roles: [
      "superadmin",
      "hrd",
    ],
  },

  {
    title: "Positions",
    href: "/dashboard/positions",
    icon: Briefcase,
    roles: [
      "superadmin",
      "hrd",
    ],
  },

  {
    title: "Users",
    href: "/dashboard/users",
    icon: ShieldCheck,
    roles: [
      "superadmin",
    ],
  },

  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileBarChart2,
    roles: [
      "superadmin",
      "hrd",
    ],
  },

  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: UserCircle,
    roles: [
      "employee",
    ],
  },
];