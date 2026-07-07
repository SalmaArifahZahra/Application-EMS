const MASTER_API = "https://6a4bcee9f5eab0bb6b6380ef.mockapi.io/api";
const EMPLOYEE_API = "https://6a4bd677f5eab0bb6b638fae.mockapi.io/api";

export const API = {
  users: `${MASTER_API}/users`,
  departments: `${MASTER_API}/departments`,
  positions: `${EMPLOYEE_API}/positions`,
  employees: `${EMPLOYEE_API}/employees`,
};

import { SEED_DATA } from "./mock-data";

function getEntityName(url: string): string {
  if (url.includes("/users")) return "users";
  if (url.includes("/departments")) return "departments";
  if (url.includes("/positions")) return "positions";
  if (url.includes("/employees")) return "employees";
  return "unknown";
}

async function delay() {
  return new Promise((resolve) => setTimeout(resolve, 500));
}

function getLocalData<T>(entity: string): T[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(`ems_v2_${entity}`);
  if (stored) {
    return JSON.parse(stored) as T[];
  }
  // Seed initial data
  const seed = SEED_DATA[entity] || [];
  localStorage.setItem(`ems_v2_${entity}`, JSON.stringify(seed));
  return seed as unknown as T[];
}

function saveLocalData<T>(entity: string, data: T[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(`ems_v2_${entity}`, JSON.stringify(data));
  }
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export type CreatePayload<T> = Omit<T, "id" | "createdAt" | "updatedAt">;

export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    await delay();
    const entity = getEntityName(url);
    const data = getLocalData<T & { id: string }>(entity);
    
    // Check if getting by ID
    const match = url.match(/\/([^\/]+)$/);
    if (match && match[1] && !["users", "departments", "positions", "employees"].includes(match[1])) {
      const id = match[1];
      const item = data.find((d) => d.id === id);
      if (!item) throw new Error("Not found");
      return item as unknown as T;
    }
    
    return data as unknown as T;
  },

  post: async <T>(url: string, body: CreatePayload<T>): Promise<T> => {
    await delay();
    const entity = getEntityName(url);
    const data = getLocalData<T>(entity);
    const now = new Date().toISOString();
    const newItem = {
      ...body,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    } as unknown as T;
    data.push(newItem);
    saveLocalData(entity, data);
    return newItem;
  },

  put: async <T>(url: string, body: Partial<T>): Promise<T> => {
    await delay();
    const entity = getEntityName(url);
    const data = getLocalData<T & { id: string }>(entity);
    
    const match = url.match(/\/([^\/]+)$/);
    if (!match || !match[1]) throw new Error("ID not provided");
    const id = match[1];
    
    const index = data.findIndex((d) => d.id === id);
    if (index === -1) throw new Error("Not found");
    
    const updatedItem = { ...data[index], ...body, updatedAt: new Date().toISOString() } as unknown as T & { id: string };
    data[index] = updatedItem;
    saveLocalData(entity, data);
    return updatedItem as unknown as T;
  },

  delete: async <T>(url: string): Promise<T> => {
    await delay();
    const entity = getEntityName(url);
    const data = getLocalData<T & { id: string }>(entity);
    
    const match = url.match(/\/([^\/]+)$/);
    if (!match || !match[1]) throw new Error("ID not provided");
    const id = match[1];
    
    const index = data.findIndex((d) => d.id === id);
    if (index === -1) throw new Error("Not found");
    
    const deletedItem = data[index];
    data.splice(index, 1);
    saveLocalData(entity, data);
    return deletedItem as unknown as T;
  },
};