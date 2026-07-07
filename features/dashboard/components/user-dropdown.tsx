"use client";

import Image from "next/image";
import { LogOut, Settings, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/features/auth/hooks/use-auth";

import { useRouter } from "next/navigation";

export function UserDropdown() {
  const router = useRouter();

  const { user, logout } = useAuth();

  function handleLogout() {
    logout();

    router.replace("/login");
  }

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button className="flex items-center gap-3 rounded-full transition hover:opacity-80">
          <Image
            src={user.image}
            alt={user.fullName}
            width={40}
            height={40}
            className="rounded-full"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64"
      >
        <div className="px-3 py-3">
          <p className="font-semibold">
            {user.fullName}
          </p>

          <p className="text-sm text-slate-500">
            {user.email}
          </p>

          <p className="mt-1 text-xs uppercase text-slate-400">
            {user.role}
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />

          Profile
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />

          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />

          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}