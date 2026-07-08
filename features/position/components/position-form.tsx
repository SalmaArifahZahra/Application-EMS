"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Position } from "../types";
import { Department } from "@/features/department/types";
import { departmentService } from "@/features/department/services/department-service";

type PositionFormValues = Omit<Position, "id" | "createdAt" | "updatedAt">;

interface PositionFormProps {
  initialValues?: PositionFormValues;
  loading?: boolean;
  onSubmit(values: PositionFormValues): Promise<void>;
}

export function PositionForm({ initialValues, loading = false, onSubmit }: PositionFormProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingMasterData, setLoadingMasterData] = useState(true);
  const [values, setValues] = useState<PositionFormValues>({
    code: initialValues?.code ?? "",
    name: initialValues?.name ?? "",
    level: initialValues?.level ?? 1,
    description: initialValues?.description ?? "",
    departmentCode: initialValues?.departmentCode ?? "",
    isActive: initialValues?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PositionFormValues, string>>>({});

  useEffect(() => {
    async function loadMasterData() {
      const departmentData = await departmentService.getAll();
      setDepartments(departmentData);
      setLoadingMasterData(false);
    }
    loadMasterData();
  }, []);

  function handleChange(key: keyof PositionFormValues, value: string | boolean | number) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const newErrors: typeof errors = {};
    if (!values.code.trim()) newErrors.code = "Code is required";
    if (!values.name.trim()) newErrors.name = "Name is required";
    if (!values.departmentCode.trim()) newErrors.departmentCode = "Department is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit(values);
  }

  if (loadingMasterData) {
    return <div className="py-8 text-center text-sm text-slate-500">Loading form data...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <FormInput
          label="Code"
          value={values.code}
          onChange={(v) => handleChange("code", v)}
          error={errors.code}
        />
        <FormInput
          label="Name"
          value={values.name}
          onChange={(v) => handleChange("name", v)}
          error={errors.name}
        />
        <div className="space-y-2">
          <Label>Level</Label>
          <Input
            type="number"
            value={values.level}
            onChange={(e) => handleChange("level", Number(e.target.value))}
          />
        </div>
        <FormInput
          label="Description"
          value={values.description}
          onChange={(v) => handleChange("description", v)}
          error={errors.description}
        />
        
        <div className="space-y-2">
          <Label>Department</Label>
          <select
            value={values.departmentCode}
            onChange={(e) => handleChange("departmentCode", e.target.value)}
            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus-visible:border-[#0B1849] focus-visible:ring-1 focus-visible:ring-[#0B1849]"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.code}>
                {dept.name}
              </option>
            ))}
          </select>
          {errors.departmentCode && <p className="text-sm text-red-500">{errors.departmentCode}</p>}
        </div>
        
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
          {loading ? "Saving..." : "Save Position"}
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
