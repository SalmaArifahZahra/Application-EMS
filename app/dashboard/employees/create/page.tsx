"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";

import { EmployeeForm } from "@/features/employee/components/employee-form";
import { employeeService } from "@/features/employee/services/employee-service";

import type { Employee } from "@/features/employee/types";

type EmployeePayload = Omit<
  Employee,
  "id" | "createdAt"
>;

export default function CreateEmployeePage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleCreate(
    values: EmployeePayload,
  ) {
    try {
      setLoading(true);

      await employeeService.create({
        ...values,

        createdAt:
          new Date().toISOString(),
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