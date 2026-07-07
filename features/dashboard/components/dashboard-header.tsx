"use client";

import { UserDropdown } from "./user-dropdown";
import { Menu } from "lucide-react";
import { useSidebar } from "../contexts/sidebar-context";

export function DashboardHeader() {
  const { toggle } = useSidebar();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="md:hidden text-slate-500 hover:text-slate-800 focus:outline-none"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">
          Dashboard
        </h1>
      </div>

      <UserDropdown />
    </header>
  );
}