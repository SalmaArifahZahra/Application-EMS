"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Department } from "../types";
import { toast } from "sonner";

type DepartmentFormValues = Omit<Department, "id" | "createdAt" | "updatedAt">;

interface DepartmentFormProps {
  initialValues?: DepartmentFormValues;
  loading?: boolean;
  onSubmit(values: DepartmentFormValues): Promise<void>;
}

export function DepartmentForm({ initialValues, loading = false, onSubmit }: DepartmentFormProps) {
  const [values, setValues] = useState<DepartmentFormValues>({
    code: initialValues?.code ?? "",
    name: initialValues?.name ?? "",
    managerEmployeeCode: initialValues?.managerEmployeeCode ?? "",
    description: initialValues?.description ?? "",
    isActive: initialValues?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof DepartmentFormValues, string>>>({});

  function handleChange(key: keyof DepartmentFormValues, value: string | boolean) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const newErrors: typeof errors = {};
    if (!values.code.trim()) newErrors.code = "Code is required";
    else if (!/^[A-Za-z0-9-]+$/.test(values.code)) newErrors.code = "Only letters, numbers, and hyphens allowed";
    
    if (!values.name.trim()) newErrors.name = "Name is required";
    else if (!/^[a-zA-Z0-9\s]+$/.test(values.name)) newErrors.name = "Name must contain only letters and numbers";

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
          label="Code"
          value={values.code}
          onChange={(v) => {
            const filtered = v.replace(/[^A-Za-z0-9-]/g, '');
            if (v !== filtered) toast.warning("Code must contain only letters, numbers, and hyphens");
            handleChange("code", filtered);
          }}
          error={errors.code}
        />
        <FormInput
          label="Name"
          value={values.name}
          onChange={(v) => {
            const filtered = v.replace(/[^a-zA-Z0-9\s]/g, '');
            if (v !== filtered) toast.warning("Name must contain only letters and numbers");
            handleChange("name", filtered);
          }}
          error={errors.name}
        />
        <FormInput
          label="Manager Employee Code"
          value={values.managerEmployeeCode}
          onChange={(v) => handleChange("managerEmployeeCode", v)}
        />
        <FormInput
          label="Description"
          value={values.description}
          onChange={(v) => handleChange("description", v)}
        />
        <div className="space-y-2 flex flex-col justify-center">
          <Label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input 
              type="checkbox" 
              checked={values.isActive} 
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="h-4 w-4"
            />
            Is Active
          </Label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Department"}
        </Button>
      </div>
    </form>
  );
}

interface FormInputProps {
  label: string;
  value: string;
  onChange(value: string): void;
  error?: string;
}

function FormInput({ label, value, onChange, error }: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
