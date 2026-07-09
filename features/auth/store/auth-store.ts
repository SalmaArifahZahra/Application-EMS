"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthUser } from "../types";

interface AuthState {
  user: AuthUser | null;
  hydrated: boolean;
  login(user: AuthUser): void;
  logout(): void;
  setUser(user: AuthUser | null): void;
  setHydrated(state: boolean): void;
}

export const useAuthStore =
  create<AuthState>()(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        hydrated: false,

        login(user) {
          set({
            user,
          });
        },

        logout() {
          set({
            user: null,
            hydrated: true,
          });
        },

        setUser(user) {
          set({
            user,
          });
        },

        setHydrated(state) {
          set({
            hydrated: state,
          });
        },
      }),
      {
        name: "ems-auth",

        onRehydrateStorage: () => {
          return (state) => {
            state?.setHydrated(true);
          };
        },
      },
    ),
  );