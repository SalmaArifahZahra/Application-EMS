"use client";

import { useState } from "react";

const AVAILABLE_PERMISSIONS = [
  { module: "Dashboard", items: [{ label: "View Dashboard", value: "dashboard.view" }] },
  { module: "Employee", items: [
    { label: "View All", value: "employee.view" },
    { label: "View Self", value: "employee.view.self" },
    { label: "Create", value: "employee.create" },
    { label: "Update", value: "employee.update" },
    { label: "Delete", value: "employee.delete" },
  ]},
  { module: "Department", items: [
    { label: "View", value: "department.view" },
    { label: "Create", value: "department.create" },
    { label: "Update", value: "department.update" },
    { label: "Delete", value: "department.delete" },
  ]},
  { module: "Position", items: [
    { label: "View", value: "position.view" },
    { label: "Create", value: "position.create" },
    { label: "Update", value: "position.update" },
    { label: "Delete", value: "position.delete" },
  ]},
  { module: "Report", items: [
    { label: "View", value: "report.view" }
  ]},
];

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";

import { ApiUser, UserRole } from "@/features/auth/types";

type UserFormValues = Omit<ApiUser, "id" | "createdAt" | "updatedAt">;

interface UserFormProps {
  initialValues?: UserFormValues;
  loading?: boolean;
  onSubmit(values: UserFormValues): Promise<void>;
  onChangePassword?(): void;
}

export function UserForm({
  initialValues,
  loading = false,
  onSubmit,
  onChangePassword,
}: UserFormProps) {
  const [values, setValues] = useState<UserFormValues>({
    username: initialValues?.username ?? "",
    email: initialValues?.email ?? "",
    password: initialValues?.password ?? "",
    role: initialValues?.role ?? "employee",
    permissions: initialValues?.permissions ?? [],
    image: initialValues?.image ?? "",
    isActive: initialValues?.isActive ?? true,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormValues, string>>
  >({});

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues?.image || null,
  );

  function handleChange(
    key: keyof UserFormValues,
    value: string | boolean,
  ) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  }

  function handlePermissionToggle(permission: string) {
    setValues((prev) => {
      const perms = prev.permissions || [];
      if (perms.includes(permission)) {
        return { ...prev, permissions: perms.filter((p) => p !== permission) };
      } else {
        return { ...prev, permissions: [...perms, permission] };
      }
    });
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;

      setImagePreview(base64);

      handleChange("image", base64);
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const newErrors: typeof errors = {};

    if (!values.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!values.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!values.password.trim()) {
      newErrors.password = "Password is required";
    }

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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Password</Label>

            <button
              type="button"
              onClick={onChangePassword}
              className="text-sm font-medium text-[#0B1849] transition hover:underline"
            >
              Change Password
            </button>
          </div>

          <PasswordInput
            value={values.password}
            onChange={(e) =>
              handleChange("password", e.target.value)
            }
          />

          {errors.password && (
            <p className="text-sm text-red-500">
              {errors.password}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Role</Label>

          <select
            value={values.role}
            onChange={(e) =>
              handleChange(
                "role",
                e.target.value as UserRole,
              )
            }
            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus-visible:border-[#0B1849] focus-visible:ring-1 focus-visible:ring-[#0B1849]"
          >
            <option value="superadmin">
              Super Admin
            </option>

            <option value="hrd">
              HRD
            </option>

            <option value="manager">
              Manager
            </option>

            <option value="employee">
              Employee
            </option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>

          <select
            value={
              values.isActive ? "true" : "false"
            }
            onChange={(e) =>
              handleChange(
                "isActive",
                e.target.value === "true",
              )
            }
            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus-visible:border-[#0B1849] focus-visible:ring-1 focus-visible:ring-[#0B1849]"
          >
            <option value="true">
              Active
            </option>

            <option value="false">
              Inactive
            </option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Photo Profile</Label>

          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-24 w-24 rounded-full border object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold text-slate-800">Permissions</h3>
        <p className="text-sm text-slate-500">
          Centang hak akses yang ingin diberikan pada user ini.
        </p>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {AVAILABLE_PERMISSIONS.map((group) => (
            <div key={group.module} className="space-y-3 rounded-lg border p-4 bg-slate-50/50">
              <h4 className="font-medium text-slate-800">{group.module}</h4>
              <div className="space-y-2">
                {group.items.map((perm) => {
                  const isChecked = (values.permissions || []).includes(perm.value);
                  return (
                    <label key={perm.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handlePermissionToggle(perm.value)}
                        className="h-4 w-4 rounded border-gray-300 text-[#0B1849] focus:ring-[#0B1849]"
                      />
                      <span className="text-sm text-slate-600">{perm.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
        >
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

function FormInput({
  label,
  value,
  onChange,
  type = "text",
  error,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <Input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
