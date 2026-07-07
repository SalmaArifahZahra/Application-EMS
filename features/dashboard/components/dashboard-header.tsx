"use client";

import { UserDropdown } from "./user-dropdown";

export function DashboardHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">
          Dashboard
        </h1>
      </div>

      <UserDropdown />
    </header>
  );
}