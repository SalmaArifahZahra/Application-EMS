"use client";

import Image from "next/image";
import Link from "next/link";

import { Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { Employee } from "../types";

import { DeleteEmployeeButton } from "./delete-employee-dialog";

interface EmployeeTableProps {
  employees: Employee[];

  onRefresh(): void;
}

export function EmployeeTable({ employees, onRefresh }: EmployeeTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <HeaderCell>Photo</HeaderCell>

            <HeaderCell>Code</HeaderCell>

            <HeaderCell>Name</HeaderCell>

            <HeaderCell>Email</HeaderCell>

            <HeaderCell>Department</HeaderCell>

            <HeaderCell>Position</HeaderCell>

            <HeaderCell>Status</HeaderCell>

            <HeaderCell>Action</HeaderCell>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-t">
              <BodyCell>
                <Image
                  src={employee.image}
                  alt={employee.firstName}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </BodyCell>

              <BodyCell>{employee.employeeCode}</BodyCell>

              <BodyCell>
                {employee.firstName} {employee.lastName}
              </BodyCell>

              <BodyCell>{employee.email}</BodyCell>

              <BodyCell>{employee.departmentCode}</BodyCell>

              <BodyCell>{employee.position}</BodyCell>

              <BodyCell>
                <Badge>{employee.status}</Badge>
              </BodyCell>

              <BodyCell>
                <div className="flex gap-2">
                  <Link href={`/dashboard/employees/edit/${employee.id}`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>

                  <DeleteEmployeeButton
                    id={employee.id}
                    fullName={`${employee.firstName} ${employee.lastName}`}
                    onSuccess={onRefresh}
                  />
                </div>
              </BodyCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface CellProps {
  children: React.ReactNode;
}

function HeaderCell({ children }: CellProps) {
  return (
    <th className="px-4 py-3 text-left text-sm font-semibold">{children}</th>
  );
}

function BodyCell({ children }: CellProps) {
  return <td className="px-4 py-3 text-sm">{children}</td>;
}
