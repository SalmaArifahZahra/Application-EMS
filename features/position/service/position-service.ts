import { API, apiClient } from "@/lib/api-client";

import type { Position } from "../types";

export const positionService = {
  async getAll(): Promise<Position[]> {
    return apiClient.get<Position[]>(
      API.positions,
    );
  },

  async getById(
    id: string,
  ): Promise<Position> {
    return apiClient.get<Position>(
      `${API.positions}/${id}`,
    );
  },

  async create(
    data: Omit<Position, "id">,
  ): Promise<Position> {
    return apiClient.post<Position>(
      API.positions,
      data,
    );
  },

  async update(
    id: string,
    data: Partial<Position>,
  ): Promise<Position> {
    return apiClient.put<Position>(
      `${API.positions}/${id}`,
      data,
    );
  },

  async delete(
    id: string,
  ): Promise<void> {
    await apiClient.delete(
      `${API.positions}/${id}`,
    );
  },
};