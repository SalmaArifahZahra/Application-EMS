import { API, apiClient } from "@/lib/api-client";
import type { ApiUser } from "@/features/auth/types";

export const userService = {
  async getAll(): Promise<ApiUser[]> {
    return apiClient.get<ApiUser[]>(API.users);
  },

  async getById(id: string): Promise<ApiUser> {
    return apiClient.get<ApiUser>(`${API.users}/${id}`);
  },

  async create(data: Omit<ApiUser, "id">): Promise<ApiUser> {
    return apiClient.post<ApiUser>(API.users, data);
  },

  async update(
    id: string,
    data: Partial<ApiUser>,
  ): Promise<ApiUser> {
    return apiClient.put<ApiUser>(
      `${API.users}/${id}`,
      data,
    );
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${API.users}/${id}`);
  },

  async changePassword(
    id: string,
    password: string,
  ): Promise<ApiUser> {
    return apiClient.put<ApiUser>(
      `${API.users}/${id}`,
      {
        password,
      },
    );
  },
};
