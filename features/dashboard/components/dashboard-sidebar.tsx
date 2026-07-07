"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { DASHBOARD_MENU } from "../constants";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const menus = DASHBOARD_MENU.filter((menu) =>
    menu.roles.includes(user?.role ?? "employee"),
  );

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="border-b p-6">
        <h2 className="text-xl font-bold text-blue-950">EMS</h2>

        <p className="text-sm text-slate-500">Employee Management System</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menus.map((menu) => {
            const Icon = menu.icon;

            const isActive = pathname === menu.href;

            return (
              <li key={menu.href}>
                <Link
                  href={menu.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                    isActive
                      ? "bg-blue-950 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={18} />

                  {menu.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
