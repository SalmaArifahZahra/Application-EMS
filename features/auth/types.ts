export type UserRole =
  | "superadmin"
  | "hrd"
  | "employee";

export interface ApiUser {
  id: string;
  employeeCode: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string; 
}

export interface AuthUser {
  id: string;
  employeeCode: string;
  username: string;
  email: string;
  image: string;
  role: UserRole;
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