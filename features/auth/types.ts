export type UserRole =
  | "superadmin"
  | "hrd"
  | "employee";

export interface ApiUser {
  id: string;

  email: string;

  password: string;

  firstName: string;

  lastName: string;

  role: UserRole;

  image: string;

  isActive: boolean;

  createdAt: string;
}

export interface AuthUser {
  id: string;

  username: string;

  email: string;

  firstName: string;

  lastName: string;

  fullName: string;

  image: string;

  role: UserRole;
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