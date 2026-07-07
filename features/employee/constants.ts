export const EMPLOYEE_ENDPOINT = "/users";

export const DEFAULT_EMPLOYEE_LIMIT = 10;

export const EMPLOYEE_MESSAGES = {
  FETCH_ERROR: "Gagal mengambil data karyawan.",
} as const;

export const EMPLOYEE_FORM_DEFAULT_VALUES = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
  position: "",
  gender: "male",
} as const;