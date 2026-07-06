import { AUTH_MESSAGES } from "@/features/auth/constants";
import { mapAuthUser } from "../helpers/auth-user";

import type {
  ApiUser,
  LoginPayload,
  LoginResponse,
} from "../types";

const BASE_URL = "https://dummyjson.com";

interface UsersResponse {
  users: ApiUser[];
}

interface DummyLoginResponse extends ApiUser {
  accessToken: string;
  refreshToken: string;
}

async function findUserByEmail(
  email: string,
): Promise<ApiUser | null> {
  const response = await fetch(
    `${BASE_URL}/users?limit=100&select=id,firstName,lastName,email,username,image`,
  );

  if (!response.ok) {
    throw new Error(AUTH_MESSAGES.SERVER_ERROR);
  }

  const result: UsersResponse =
    await response.json();

  return (
    result.users.find(
      (user) =>
        user.email.toLowerCase() ===
        email.toLowerCase(),
    ) ?? null
  );
}

async function authenticate(
  username: string,
  password: string,
): Promise<DummyLoginResponse> {
  const response = await fetch(
    `${BASE_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        username,

        password,

        expiresInMins: 60,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      AUTH_MESSAGES.INVALID_CREDENTIAL,
    );
  }

  return response.json();
}

export const authService = {
  async login({
    email,
    password,
  }: LoginPayload): Promise<LoginResponse> {
    try {
      const user =
        await findUserByEmail(email);

      if (!user) {
        return {
          success: false,

          message:
            AUTH_MESSAGES.INVALID_CREDENTIAL,

          user: null,
        };
      }

      const authenticatedUser =
        await authenticate(
          user.username,
          password,
        );

      return {
        success: true,

        message:
          AUTH_MESSAGES.LOGIN_SUCCESS,

        user: mapAuthUser(
          authenticatedUser,
        ),
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
          user: null,
        };
      }

      return {
        success: false,
        message:
          AUTH_MESSAGES.SERVER_ERROR,
          user: null,
      };
    }
  },
};