export type UserRole =
  | "superadmin"
  | "hrd"
  | "employee"
  | "manager";

export interface ApiUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  permissions: string[];
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  image: string;
  role: UserRole;
  permissions: string[];
  fullName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: AuthUser | null;
}