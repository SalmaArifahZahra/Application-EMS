/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { EmptyState } from "@/components/data-display/empty-state";
import { TableSkeleton } from "@/components/feedback/table-skeleton";
import { SearchInput } from "@/components/form/search-input";
import { PageToolbar } from "@/components/crud/page-toolbar";
import { PageHeader } from "@/components/layout/page-header";

import { EmployeeTable } from "@/features/employee/components/employee-table";
import { employeeService } from "@/features/employee/services/employee-service";

import type { Employee } from "@/features/employee/types";

export default function EmployeePage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadEmployees() {
    try {
      setLoading(true);

      const employees = await employeeService.getAll();

      setEmployees(employees);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) => {
    const keyword = search.toLowerCase();

    return (
      employee.employeeCode.toLowerCase().includes(keyword) ||
      employee.firstName.toLowerCase().includes(keyword) ||
      employee.lastName.toLowerCase().includes(keyword) ||
      employee.email.toLowerCase().includes(keyword)
    );
  });

  return (
    <>
      <PageHeader
        title="Employees"
        description="Manage employee data."
        action={
          <Button onClick={() => router.push("/dashboard/employees/create")}>
            Add Employee
          </Button>
        }
      />

      <PageToolbar
        search={
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search employee..."
          />
        }
      />

      {loading ? (
        <TableSkeleton />
      ) : filteredEmployees.length === 0 ? (
        <EmptyState
          title="No Employee Found"
          description="Employee data will appear here."
        />
      ) : (
        <EmployeeTable
          employees={filteredEmployees}
          onRefresh={loadEmployees}
        />
      )}
    </>
  );
}
