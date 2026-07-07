"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiUser, UserRole } from "@/features/auth/types";

type UserFormValues = Omit<ApiUser, "id" | "createdAt" | "updatedAt">;

interface UserFormProps {
  initialValues?: UserFormValues;
  loading?: boolean;
  onSubmit(values: UserFormValues): Promise<void>;
}

export function UserForm({ initialValues, loading = false, onSubmit }: UserFormProps) {
  const [values, setValues] = useState<UserFormValues>({
    employeeCode: initialValues?.employeeCode ?? "",
    username: initialValues?.username ?? "",
    email: initialValues?.email ?? "",
    password: initialValues?.password ?? "",
    role: initialValues?.role ?? "employee",
    image: initialValues?.image ?? "",
    isActive: initialValues?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserFormValues, string>>>({});

  function handleChange(key: keyof UserFormValues, value: string | boolean) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const newErrors: typeof errors = {};
    if (!values.employeeCode.trim()) newErrors.employeeCode = "Employee code is required";
    if (!values.username.trim()) newErrors.username = "Username is required";
    if (!values.email.trim()) newErrors.email = "Email is required";
    if (!values.password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <FormInput
          label="Employee Code"
          value={values.employeeCode}
          onChange={(v) => handleChange("employeeCode", v)}
          error={errors.employeeCode}
        />
        <FormInput
          label="Username"
          value={values.username}
          onChange={(v) => handleChange("username", v)}
          error={errors.username}
        />
        <FormInput
          label="Email (Username)"
          type="email"
          value={values.email}
          onChange={(v) => handleChange("email", v)}
          error={errors.email}
        />
        <FormInput
          label="Password"
          type="password"
          value={values.password}
          onChange={(v) => handleChange("password", v)}
          error={errors.password}
        />
        
        <div className="space-y-2">
          <Label>Role</Label>
          <select
            value={values.role}
            onChange={(e) => handleChange("role", e.target.value as UserRole)}
            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus-visible:border-[#0B1849] focus-visible:ring-1 focus-visible:ring-[#0B1849]"
          >
            <option value="superadmin">Super Admin</option>
            <option value="hrd">HRD</option>
            <option value="employee">Employee</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label>Status</Label>
          <select
            value={values.isActive ? "true" : "false"}
            onChange={(e) => handleChange("isActive", e.target.value === "true")}
            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus-visible:border-[#0B1849] focus-visible:ring-1 focus-visible:ring-[#0B1849]"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <FormInput
          label="Image URL"
          value={values.image}
          onChange={(v) => handleChange("image", v)}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save User"}
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
  error?: string;
}

function FormInput({ label, value, onChange, type = "text", error }: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
