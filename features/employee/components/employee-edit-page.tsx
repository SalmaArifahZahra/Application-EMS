"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";

import { EmployeeForm } from "@/features/employee/components/employee-form";

import { employeeService } from "@/features/employee/services/employee-service";

import type { Employee } from "@/features/employee/types";

type EmployeeFormValues = Omit<Employee, "id" | "createdAt" | "updatedAt" | "userId" | "joinDate">;

export function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();

  const [employee, setEmployee] = useState<Employee>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const result = await employeeService.getById(params.id as string);
        setEmployee(result);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [params.id]);

  async function handleUpdate(values: EmployeeFormValues) {
    if (!employee) return;

    try {
      await employeeService.update(employee.id, {
        ...values,
        userId: employee.userId, // preserve user id
      });
      
      toast.success("Employee updated successfully", {
        description: `Employee ${values.firstName} ${values.lastName} has been updated.`,
      });

      router.push("/dashboard/employees");
    } catch (error) {
      toast.error("Failed to update employee", {
        description: "An error occurred while updating the employee. Please try again.",
      });
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!employee) {
    return <p>Employee not found.</p>;
  }

  return (
    <>
      <Link href="/dashboard/employees" className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Employees
      </Link>
      
      <PageHeader
        title="Edit Employee"
        description="Update employee information."
      />

      <EmployeeForm
        initialValues={{
          nik: employee.nik,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone,
          gender: employee.gender,
          birthPlace: employee.birthPlace,
          birthDate: employee.birthDate,
          address: employee.address,
          departmentCode: employee.departmentCode,
          positionCode: employee.positionCode,
          basicSalary: employee.basicSalary,
          image: employee.image,
          status: employee.status,
          joinDate: employee.joinDate,
        }}
        onSubmit={handleUpdate}
      />
    </>
  );
}