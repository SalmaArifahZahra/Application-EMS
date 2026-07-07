import { API, apiClient } from "@/lib/api-client";

import type { Employee } from "../types";

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    return apiClient.get<Employee[]>(API.employees);
  },

  async getById(id: string): Promise<Employee> {
    return apiClient.get<Employee>(
      `${API.employees}/${id}`,
    );
  },

    async create(
        data: Omit<Employee, "id" | "createdAt" | "updatedAt">
    ): Promise<Employee> {
        return apiClient.post<Employee>(
          API.employees,
          data as any
        );
    },

  async update(
    id: string,
    data: Partial<Employee>,
  ): Promise<Employee> {
    return apiClient.put<Employee>(
      `${API.employees}/${id}`,
      data,
    );
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<void>(
      `${API.employees}/${id}`,
    );
  },
};