import type { UserRole } from "./types";

const ROLE_MAP: Record<number, UserRole> = {
  1: "superadmin",
  2: "hrd",
};

export function getUserRole(
  userId: number,
): UserRole {
  return ROLE_MAP[userId] ?? "employee";
}