"use client";

import React, { useEffect, useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { Employee } from "../types";
import { Position } from "@/features/position/types";
import { Department } from "@/features/department/types";
import { departmentService } from "@/features/department/services/department-service";
import { positionService } from "@/features/position/service/position-service";
import { useForm as useRHForm } from "react-hook-form";

const employeeFormSchema = z.object({
  employeeCode: z.string().min(1, "Employee Code is required"),
  nik: z.string().min(1, "NIK is required"),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone Number is required"),
  gender: z.string().min(1, "Gender is required"),
  birthPlace: z.string().min(1, "Birth Place is required"),
  birthDate: z.string().min(1, "Birth Date is required"),
  address: z.string().min(1, "Address is required"),
  departmentCode: z.string().min(1, "Department is required"),
  positionCode: z.string().min(1, "Position is required"),
  basicSalary: z.coerce.number().min(0, "Salary must be >= 0"),
  image: z.string().optional().transform(v => v || ""),
  status: z.string().min(1, "Status is required"),
});

type EmployeeFormValues = Omit<Employee, "id" | "createdAt" | "updatedAt" | "userId" | "joinDate">;

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
  const [imagePreview, setImagePreview] = useState<string | null>(initialValues?.image || null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useRHForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema) as any,
    defaultValues: {
      employeeCode: initialValues?.employeeCode ?? "",
      nik: initialValues?.nik ?? "",
      firstName: initialValues?.firstName ?? "",
      lastName: initialValues?.lastName ?? "",
      email: initialValues?.email ?? "",
      phone: initialValues?.phone ?? "",
      gender: initialValues?.gender ?? "Male",
      birthPlace: initialValues?.birthPlace ?? "",
      birthDate: initialValues?.birthDate ?? "",
      address: initialValues?.address ?? "",
      departmentCode: initialValues?.departmentCode ?? "",
      positionCode: initialValues?.positionCode ?? "",
      basicSalary: initialValues?.basicSalary ?? 0,
      image: initialValues?.image ?? "",
      status: initialValues?.status ?? "Active",
    },
  });

  const departmentCode = watch("departmentCode");
  const filteredPositions = positions.filter(
    (pos) => pos.departmentCode === departmentCode,
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

  const submitForm = async (data: z.infer<typeof employeeFormSchema>) => {
    await onSubmit(data as EmployeeFormValues);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setValue("image", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm as any)} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <FormInput label="Employee Code" {...register("employeeCode")} error={errors.employeeCode?.message} />
        <FormInput label="NIK" {...register("nik" as any)} error={(errors as any).nik?.message} />
        <FormInput label="First Name" {...register("firstName")} error={errors.firstName?.message} />
        <FormInput label="Last Name" {...register("lastName")} error={errors.lastName?.message} />
        <FormInput label="Email" type="email" {...register("email")} error={errors.email?.message} />
        <FormInput label="Phone Number" {...register("phone")} error={errors.phone?.message} />
        <FormInput label="Address" {...register("address")} error={errors.address?.message} />
        <FormInput label="Basic Salary" type="number" {...register("basicSalary")} error={errors.basicSalary?.message} />
        <FormInput label="Birth Place" {...register("birthPlace")} error={errors.birthPlace?.message} />
        <FormInput label="Birth Date" type="date" {...register("birthDate")} error={errors.birthDate?.message} />

        <div className="space-y-2">
          <Label>Gender</Label>
          <select {...register("gender")} className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus-visible:border-[#0B1849] focus-visible:ring-1 focus-visible:ring-[#0B1849]">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Department</Label>
          <select
            {...register("departmentCode")}
            onChange={(e) => {
              register("departmentCode").onChange(e);
              setValue("positionCode", "");
            }}
            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus-visible:border-[#0B1849] focus-visible:ring-1 focus-visible:ring-[#0B1849]"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.code}>{dept.name}</option>
            ))}
          </select>
          {errors.departmentCode && <p className="text-sm text-red-500">{errors.departmentCode.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Position</Label>
          <select {...register("positionCode")} className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus-visible:border-[#0B1849] focus-visible:ring-1 focus-visible:ring-[#0B1849]">
            <option value="">Select Position</option>
            {filteredPositions.map((pos) => (
              <option key={pos.id} value={pos.code}>{pos.name}</option>
            ))}
          </select>
          {errors.positionCode && <p className="text-sm text-red-500">{errors.positionCode.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <select {...register("status")} className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus-visible:border-[#0B1849] focus-visible:ring-1 focus-visible:ring-[#0B1849]">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Photo Profile</Label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" className="h-24 w-24 rounded-full object-cover border" />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Employee"}
        </Button>
      </div>
    </form>
  );
}

const FormInput = React.forwardRef<HTMLInputElement, { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>>(
  ({ label, error, ...props }, ref) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input ref={ref} {...props} />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
);
FormInput.displayName = "FormInput";
