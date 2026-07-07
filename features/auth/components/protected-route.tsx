"use client";

import { useEffect } from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { ROLE_PERMISSIONS } from "../permission";
import { useAuth } from "../hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const pathname = usePathname();

  const router = useRouter();

  const {
    user,
    hydrated,
  } = useAuth();

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!user) {
      router.replace("/login");

      return;
    }

    const permissions =
      ROLE_PERMISSIONS[user.role];

    const allowed =
      permissions.some((route) =>
        pathname.startsWith(route),
      );

    if (!allowed) {
      router.replace("/dashboard");
    }
  }, [
    hydrated,
    pathname,
    router,
    user,
  ]);

  if (!hydrated) {
    return null;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}