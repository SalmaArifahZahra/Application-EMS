"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";

import { EmployeeForm } from "@/features/employee/components/employee-form";

import { employeeService } from "@/features/employee/services/employee-service";

import type { Employee } from "@/features/employee/types";

type EmployeePayload = Omit<
  Employee,
  "id" | "createdAt"
>;

export default function EditEmployeePage() {
  const params = useParams();

  const router = useRouter();

  const [employee, setEmployee] =
    useState<Employee>();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const result =
          await employeeService.getById(
            params.id as string,
          );

        setEmployee(result);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [params.id]);

  async function handleUpdate(
    values: EmployeePayload,
  ) {
    if (!employee) return;

    await employeeService.update(
      employee.id,
      values,
    );

    router.push(
      "/dashboard/employees",
    );
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!employee) {
    return <p>Employee not found.</p>;
  }

  return (
    <>
      <PageHeader
        title="Edit Employee"
        description="Update employee information."
      />

      <EmployeeForm
        initialValues={{
          employeeCode:
            employee.employeeCode,

          firstName:
            employee.firstName,

          lastName:
            employee.lastName,

          email: employee.email,

          phone: employee.phone,

          gender:
            employee.gender,

          birthDate:
            employee.birthDate,

          departmentCode:
            employee.departmentCode,

          position:
            employee.position,

          userEmail:
            employee.userEmail,

          image: employee.image,

          status:
            employee.status,
        }}
        onSubmit={handleUpdate}
      />
    </>
  );
}