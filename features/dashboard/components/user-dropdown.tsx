"use client";

import Image from "next/image";
import { LogOut, User, TriangleAlert, X } from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function UserDropdown() {
  const router = useRouter();

  const { user, logout } = useAuth();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (!user) {
    return null;
  }

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center gap-3 transition hover:opacity-80 cursor-pointer">
          <div className="hidden flex-col items-end md:flex">
            <span className="text-sm font-semibold text-slate-800 leading-none mb-1">
              {user.fullName || user.username}
            </span>
            <span className="text-xs text-slate-500 capitalize leading-none">
              {user.role}
            </span>
          </div>
          <Image
            src={user.image || "/images/avatar.jpeg"}
            alt={user.fullName || user.username || "User Avatar"}
            width={40}
            height={40}
            className="rounded-full object-cover aspect-square"
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48"
      >

        <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={(e) => {
            e.preventDefault();
            setIsLogoutOpen(true);
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    
    <AlertDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
      <AlertDialogContent className="max-w-[340px] rounded-2xl p-6 border-0 shadow-lg" size="sm">
        <AlertDialogCancel className="absolute right-3 top-3 h-8 w-8 rounded-full border-0 bg-transparent hover:bg-slate-100 p-0 hover:text-slate-900 shadow-none text-slate-500">
          <X className="h-4 w-4" />
        </AlertDialogCancel>
        
        <div className="flex flex-col items-center text-center">
          <TriangleAlert fill="#f43f5e" color="white" className="mb-4 h-14 w-14" />
          
          <h2 className="mb-2 text-xl font-bold text-slate-900 leading-tight">
            Do you really want to<br />exit the app?
          </h2>
          
          <p className="mb-6 text-sm text-slate-500">
            All of the unsaved progress<br />would be lost!
          </p>
          
          <div className="flex w-full gap-3">
            <Button 
              className="flex-1 rounded-xl bg-[#f43f5e] hover:bg-[#e11d48] text-white font-semibold py-5"
              onClick={() => {
                setIsLogoutOpen(false);
                handleLogout();
              }}
            >
              Yes
            </Button>
            <AlertDialogCancel 
              className="flex-1 rounded-xl bg-[#ffe4e6] hover:bg-[#fecdd3] text-[#f43f5e] border-0 hover:text-[#f43f5e] shadow-none font-semibold py-5"
            >
              No
            </AlertDialogCancel>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}