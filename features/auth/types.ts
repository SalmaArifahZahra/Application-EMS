export type UserRole =
  | "superadmin"
  | "hrd"
  | "employee";


export interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  image: string;
}


export interface AuthUser {
  id: number;
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