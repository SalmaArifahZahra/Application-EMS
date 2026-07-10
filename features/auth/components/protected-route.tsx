"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "../hooks/use-auth";
import { ROUTE_PERMISSIONS } from "../permission";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, hydrated, hasPermission } = useAuth();

  useEffect(() => {
    if (!hydrated) return;

    if (!user) {
      router.replace("/login");
    }
  }, [hydrated, user, router]);

  if (!hydrated) {
    return null;
  }

  if (!user) {
    return null;
  }

  let allowed = true;

  for (const [route, requiredPerms] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname === route || pathname.startsWith(`${route}/`)) {
      if (route === "/dashboard/users") {
        allowed = user.role === "superadmin";
      } else {
        allowed = requiredPerms.some((perm) => hasPermission(perm));
      }
      break;
    }
  }

  if (!allowed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <h1 className="mb-4 text-6xl font-bold text-red-600">403</h1>

        <h2 className="mb-2 text-2xl font-semibold text-slate-800">
          Forbidden
        </h2>

        <p className="mb-6 text-slate-600">
          Anda tidak memiliki hak akses untuk membuka halaman ini.
        </p>

        <button
          onClick={() => router.replace("/dashboard")}
          className="rounded-full bg-blue-950 px-6 py-2 text-white transition hover:bg-blue-900"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
