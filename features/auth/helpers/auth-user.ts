import { getUserRole } from "../role-mapper";

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
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
    image: user.image,
    role: getUserRole(user.id),
  };
}