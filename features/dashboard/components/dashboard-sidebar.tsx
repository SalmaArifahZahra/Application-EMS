"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { DASHBOARD_MENU } from "../constants";
import { useSidebar } from "../contexts/sidebar-context";
import { X } from "lucide-react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isOpen, close } = useSidebar();

  const overviewMenus = DASHBOARD_MENU.filter(
    (menu) =>
      menu.roles.includes(user?.role ?? "employee") &&
      ["/dashboard", "/dashboard/employees", "/dashboard/departments", "/dashboard/positions", "/dashboard/reports"].includes(menu.href)
  );

  const pengaturanMenus = DASHBOARD_MENU.filter(
    (menu) =>
      menu.roles.includes(user?.role ?? "employee") &&
      ["/dashboard/users", "/dashboard/profile"].includes(menu.href)
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col bg-[#0B1849] text-white transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-2">
            <h2 className="text-l font-bold uppercase tracking-wider">Employeement Management System</h2>
          </div>
          <button onClick={close} className="md:hidden text-white/70 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <div className="mb-6 px-4">
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-white/50">
              Overview
            </h3>
            <ul className="space-y-1">
              {overviewMenus.map((menu) => {
                const Icon = menu.icon;
                const isActive = pathname === menu.href;

                return (
                  <li key={menu.href}>
                    <Link
                      href={menu.href}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${isActive
                        ? "bg-white/10 text-white font-medium border-l-4 border-[#E4B028]"
                        : "text-white/70 hover:bg-white/5 hover:text-white border-l-4 border-transparent"
                        }`}
                    >
                      <Icon size={18} />
                      {menu.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="px-4">
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-white/50">
              Settings
            </h3>
            <ul className="space-y-1">
              {pengaturanMenus.map((menu) => {
                const Icon = menu.icon;
                const isActive = pathname === menu.href;

                return (
                  <li key={menu.href}>
                    <Link
                      href={menu.href}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${isActive
                        ? "bg-white/10 text-white font-medium border-l-4 border-[#E4B028]"
                        : "text-white/70 hover:bg-white/5 hover:text-white border-l-4 border-transparent"
                        }`}
                    >
                      <Icon size={18} />
                      {menu.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
}
