"use client";

import { useAuthStore } from "../store/auth-store";

export function useAuth() {
  const user = useAuthStore((state) => state.user);

  const hydrated = useAuthStore(
    (state) => state.hydrated,
  );

  const login = useAuthStore(
    (state) => state.login,
  );

  const logout = useAuthStore(
    (state) => state.logout,
  );

  const setUser = useAuthStore(
    (state) => state.setUser,
  );

  const hasPermission = (permission: string) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  return {
    user,

    hydrated,

    login,

    logout,

    setUser,

    hasPermission,
  };
}