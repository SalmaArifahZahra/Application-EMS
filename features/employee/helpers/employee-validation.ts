import type { Employee } from "../types";

type EmployeeFormValues = Omit<
  Employee,
  "id" | "createdAt"
>;

export type EmployeeFormErrors =
  Partial<
    Record<
      keyof EmployeeFormValues,
      string
    >
  >;

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_REGEX = /^[0-9]+$/;

export function validateEmployee(
  values: EmployeeFormValues,
): EmployeeFormErrors {
  const errors: EmployeeFormErrors = {};

  if (!values.employeeCode.trim()) {
    errors.employeeCode =
      "Employee code is required.";
  }

  if (!values.firstName.trim()) {
    errors.firstName =
      "First name is required.";
  }

  if (!values.lastName.trim()) {
    errors.lastName =
      "Last name is required.";
  }

  if (!values.email.trim()) {
    errors.email =
      "Email is required.";
  } else if (
    !EMAIL_REGEX.test(values.email)
  ) {
    errors.email =
      "Email format is invalid.";
  }

  if (!values.phone.trim()) {
    errors.phone =
      "Phone number is required.";
  } else if (
    !PHONE_REGEX.test(values.phone)
  ) {
    errors.phone =
      "Phone number must contain only numbers.";
  } else if (
    values.phone.length < 10
  ) {
    errors.phone =
      "Phone number must be at least 10 digits.";
  }

  if (!values.birthDate) {
    errors.birthDate =
      "Birth date is required.";
  }

  if (!values.gender) {
    errors.gender =
      "Gender is required.";
  }

  if (!values.departmentCode) {
    errors.departmentCode =
      "Department is required.";
  }

  if (!values.position) {
    errors.position =
      "Position is required.";
  }

  if (!values.status) {
    errors.status =
      "Status is required.";
  }

  return errors;
}