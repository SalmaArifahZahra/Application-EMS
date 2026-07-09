"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";

import { EmployeeForm } from "@/features/employee/components/employee-form";
import { employeeService } from "@/features/employee/services/employee-service";

import type { Employee } from "@/features/employee/types";

type EmployeeFormValues = Omit<Employee, "id" | "createdAt" | "updatedAt" | "userId" | "joinDate">;

export function CreateEmployeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCreate(values: EmployeeFormValues) {
    try {
      setLoading(true);

      await employeeService.create({
        ...values,
        userId: String(Math.floor(Math.random() * 1000) + 10), // mock random userId
        joinDate: new Date().toISOString().split("T")[0],
      });

      router.push(
        "/dashboard/employees",
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Link href="/dashboard/employees" className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Employees
      </Link>
      
      <PageHeader
        title="Create Employee"
        description="Add new employee."
      />

      <EmployeeForm
        loading={loading}
        onSubmit={handleCreate}
      />
    </>
  );
}