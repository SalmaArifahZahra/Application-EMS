import type {
  ApiUser,
  AuthUser,
} from "../types";

export function mapAuthUser(
  user: ApiUser,
): AuthUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    image: user.image,
    role: user.role,
    permissions: user.permissions || [],
  };
}