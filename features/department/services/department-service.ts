import { API, apiClient } from "@/lib/api-client";

import type { Department } from "../types";

export const departmentService = {
  async getAll(): Promise<Department[]> {
    return apiClient.get<Department[]>(
      API.departments,
    );
  },

  async getById(
    id: string,
  ): Promise<Department> {
    return apiClient.get<Department>(
      `${API.departments}/${id}`,
    );
  },

  async create(
    data: Omit<Department, "id">,
  ): Promise<Department> {
    return apiClient.post<Department>(
      API.departments,
      data,
    );
  },

  async update(
    id: string,
    data: Partial<Department>,
  ): Promise<Department> {
    return apiClient.put<Department>(
      `${API.departments}/${id}`,
      data,
    );
  },

  async delete(
    id: string,
  ): Promise<void> {
    await apiClient.delete(
      `${API.departments}/${id}`,
    );
  },
};