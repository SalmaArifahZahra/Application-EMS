"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiUser } from "@/features/auth/types";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { useState } from "react";
import { userService } from "../services/user-service";
import { Badge } from "@/components/ui/badge";

interface UserTableProps {
  users: ApiUser[];
  onRefresh(): void;
}

export function UserTable({ users, onRefresh }: UserTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await userService.delete(deleteId);
      onRefresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete user");
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
              <th className="px-4 py-3 text-left text-sm font-semibold">Employee Code</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Username</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3 text-sm">{u.employeeCode}</td>
                <td className="px-4 py-3 text-sm">{u.username}</td>
                <td className="px-4 py-3 text-sm">{u.email}</td>
                <td className="px-4 py-3 text-sm uppercase text-xs">{u.role}</td>
                <td className="px-4 py-3 text-sm">
                  <Badge variant={u.isActive ? "default" : "destructive"}>
                    {u.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <Link href={`/dashboard/users/edit/${u.id}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeleteId(u.id);
                        setDeleteName(u.username);
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
        title="Delete User"
        description={`Are you sure you want to delete user "${deleteName}"?`}
        onConfirm={handleDelete}
      />
    </>
  );
}
