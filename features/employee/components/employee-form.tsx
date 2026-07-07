"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { Employee } from "../types";
import { Position } from "@/features/position/types";
import { Department } from "@/features/department/types";
import { departmentService } from "@/features/department/services/department-service";
import { positionService } from "@/features/position/service/position-service";
import {
  validateEmployee,
  type EmployeeFormErrors,
} from "../helpers/employee-validation";

type EmployeeFormValues = Omit<Employee, "id" | "createdAt">;

interface EmployeeFormProps {
  initialValues?: EmployeeFormValues;
  loading?: boolean;
  onSubmit(values: EmployeeFormValues): Promise<void>;
}

export function EmployeeForm({
  initialValues,
  loading = false,
  onSubmit,
}: EmployeeFormProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  const [values, setValues] = useState<EmployeeFormValues>({
    employeeCode: initialValues?.employeeCode ?? "",
    firstName: initialValues?.firstName ?? "",
    lastName: initialValues?.lastName ?? "",
    email: initialValues?.email ?? "",
    phone: initialValues?.phone ?? "",
    gender: initialValues?.gender ?? "Male",
    birthDate: initialValues?.birthDate ?? "",
    departmentCode: initialValues?.departmentCode ?? "",
    position: initialValues?.position ?? "",
    userEmail: initialValues?.userEmail ?? "",
    image: initialValues?.image ?? "",
    status: initialValues?.status ?? "Active",
  });

  const [errors, setErrors] = useState<EmployeeFormErrors>({});

  // filteredPositions dipindahkan setelah state 'values' didefinisikan agar tidak ReferenceError
  const filteredPositions = positions.filter(
    (position) => position.departmentCode === values.departmentCode,
  );

  useEffect(() => {
    async function loadMasterData() {
      const departmentData = await departmentService.getAll();
      const positionData = await positionService.getAll();

      setDepartments(departmentData);
      setPositions(positionData);
    }

    loadMasterData();
  }, []);

  function handleChange(key: keyof EmployeeFormValues, value: string) {
    setValues((previous) => {
      if (key === "departmentCode") {
        return {
          ...previous,
          departmentCode: value,
          position: "",
        };
      }

      return {
        ...previous,
        [key]: value,
      };
    });

    setErrors((previous) => ({
      ...previous,
      [key]: "",
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateEmployee(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    await onSubmit({
      ...values,
      userEmail: values.email,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <FormInput
          label="Employee Code"
          value={values.employeeCode}
          onChange={(value) => handleChange("employeeCode", value)}
        />

        <FormInput
          label="First Name"
          value={values.firstName}
          onChange={(value) => handleChange("firstName", value)}
        />

        <FormInput
          label="Last Name"
          value={values.lastName}
          onChange={(value) => handleChange("lastName", value)}
        />

        <FormInput
          label="Email"
          type="email"
          value={values.email}
          onChange={(value) => handleChange("email", value)}
          error={errors.email}
        />

        <FormInput
          label="Phone Number"
          value={values.phone}
          onChange={(value) => handleChange("phone", value)}
        />

        <FormInput
          label="Birth Date"
          type="date"
          value={values.birthDate}
          onChange={(value) => handleChange("birthDate", value)}
        />

        <FormSelect
          label="Gender"
          value={values.gender}
          onChange={(value) => handleChange("gender", value)}
          options={[
            { label: "Male", value: "Male" },
            { label: "Female", value: "Female" },
          ]}
        />

        <FormSelect
          label="Department"
          value={values.departmentCode}
          onChange={(value) => handleChange("departmentCode", value)}
          options={departments.map((dept) => ({
            label: dept.name, // Silakan sesuaikan properti nama jika berbeda (misal: dept.label)
            value: dept.code, // Silakan sesuaikan properti kode jika berbeda (misal: dept.id)
          }))}
          placeholder="Select Department"
          error={errors.departmentCode}
        />

        <FormSelect
          label="Position"
          value={values.position}
          onChange={(value) => handleChange("position", value)}
          options={filteredPositions.map((position) => ({
            label: position.name,
            value: position.name,
          }))}
          placeholder="Select Position"
          error={errors.position} // Diubah dari errors.departmentCode menjadi errors.position
        />

        <FormInput
          label="Image URL"
          value={values.image}
          onChange={(value) => handleChange("image", value)}
        />

        <FormSelect
          label="Status"
          value={values.status}
          onChange={(value) => handleChange("status", value)}
          options={[
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
          ]}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Employee"}
        </Button>
      </div>
    </form>
  );
}

interface FormInputProps {
  label: string;
  value: string;
  onChange(value: string): void;
  type?: string;
  placeholder?: string;
  error?: string;
}

function FormInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange(value: string): void;
  placeholder?: string;
  error?: string;
}

function FormSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "Select Option",
  error,
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
