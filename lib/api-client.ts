const MASTER_API = "https://6a4bcee9f5eab0bb6b6380ef.mockapi.io/api";
const EMPLOYEE_API = "https://6a4bd677f5eab0bb6b638fae.mockapi.io/api";

export const API = {
  users: `${MASTER_API}/users`,
  departments: `${MASTER_API}/departments`,
  positions: `${EMPLOYEE_API}/positions`,
  employees: `${EMPLOYEE_API}/employees`,
};



export type CreatePayload<T> = Omit<T, "id" | "createdAt" | "updatedAt">;

export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    let res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    if (res.status === 404) {
      const match = url.match(/(.*)\/([^\/]+)$/);
      if (match) {
        const baseUrl = match[1];
        const id = match[2];
        const baseRes = await fetch(baseUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (baseRes.ok) {
          const allData = await baseRes.json();
          if (Array.isArray(allData)) {
            const item = allData.find((item: any) => String(item.id) === String(id));
            if (item) return item as unknown as T;
          }
        }
      }
    }

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`GET ${url} failed: ${res.status} ${err}`);
    }
    return res.json();
  },

  post: async <T>(url: string, body: CreatePayload<T>): Promise<T> => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`POST ${url} failed: ${res.status} ${err}`);
    }
    return res.json();
  },

  put: async <T>(url: string, body: Partial<T>): Promise<T> => {
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`PUT ${url} failed: ${res.status} ${err}`);
    }
    return res.json();
  },

  delete: async <T>(url: string): Promise<T> => {
    const res = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`DELETE ${url} failed: ${res.status} ${err}`);
    }
    return res.json();
  },
};