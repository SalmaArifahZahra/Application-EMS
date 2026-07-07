const MASTER_API =
  "https://6a4bcee9f5eab0bb6b6380ef.mockapi.io/api";

const EMPLOYEE_API =
  "https://6a4bd677f5eab0bb6b638fae.mockapi.io/api";

export const API = {
  users: `${MASTER_API}/users`,

  departments: `${MASTER_API}/departments`,

  positions: `${EMPLOYEE_API}/positions`,

  employees: `${EMPLOYEE_API}/employees`,
};

async function request<T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, {
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error("Request failed.");
  }

  return response.json();
}

export const apiClient = {
  get: <T>(url: string) => request<T>(url),

  post: <T>(url: string, body: unknown) =>
    request<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(url: string, body: unknown) =>
    request<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(url: string) =>
    request<T>(url, {
      method: "DELETE",
    }),
};