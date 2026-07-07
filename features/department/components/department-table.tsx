"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Department } from "../types";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { useState } from "react";
import { departmentService } from "../services/department-service";

interface DepartmentTableProps {
  departments: Department[];
  onRefresh(): void;
}

export function DepartmentTable({ departments, onRefresh }: DepartmentTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await departmentService.delete(deleteId);
      onRefresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete department");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Code</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Manager Code</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} className="border-t">
                <td className="px-4 py-3 text-sm">{dept.code}</td>
                <td className="px-4 py-3 text-sm">{dept.name}</td>
                <td className="px-4 py-3 text-sm">{dept.managerEmployeeCode}</td>
                <td className="px-4 py-3 text-sm">{dept.description}</td>
                <td className="px-4 py-3 text-sm">
                  <Badge variant={dept.isActive ? "default" : "secondary"}>
                    {dept.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <Link href={`/dashboard/departments/edit/${dept.id}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeleteId(dept.id);
                        setDeleteName(dept.name);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Department"
        description={`Are you sure you want to delete department "${deleteName}"?`}
        onConfirm={handleDelete}
      />
    </>
  );
}
