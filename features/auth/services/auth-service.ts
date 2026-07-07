import { apiClient, API } from "@/lib/api-client";

import { AUTH_MESSAGES } from "../constants";

import { mapAuthUser } from "../helpers/auth-user";

import type {
  ApiUser,
  LoginPayload,
  LoginResponse,
} from "../types";

export const authService = {
  async login({
    email,
    password,
  }: LoginPayload): Promise<LoginResponse> {
    try {
      const users =
        await apiClient.get<ApiUser[]>(API.users);

      const user = users.find(
        (item) =>
          item.email === email &&
          item.password === password &&
          item.isActive,
      );

      if (!user) {
        return {
          success: false,
          message:
            AUTH_MESSAGES.INVALID_CREDENTIAL,
          user: null,
        };
      }

      return {
        success: true,
        message:
          AUTH_MESSAGES.LOGIN_SUCCESS,
        user: mapAuthUser(user),
      };
    } catch {
      return {
        success: false,
        message:
          AUTH_MESSAGES.SERVER_ERROR,
        user: null,
      };
    }
  },
};