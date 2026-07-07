"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Position } from "../types";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { useState } from "react";
import { positionService } from "../service/position-service";

interface PositionTableProps {
  positions: Position[];
  onRefresh(): void;
}

export function PositionTable({ positions, onRefresh }: PositionTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await positionService.delete(deleteId);
      onRefresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete position");
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
              <th className="px-4 py-3 text-left text-sm font-semibold">Level</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Department Code</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => (
              <tr key={pos.id} className="border-t">
                <td className="px-4 py-3 text-sm">{pos.code}</td>
                <td className="px-4 py-3 text-sm">{pos.name}</td>
                <td className="px-4 py-3 text-sm">{pos.level}</td>
                <td className="px-4 py-3 text-sm">{pos.departmentCode}</td>
                <td className="px-4 py-3 text-sm">{pos.description}</td>
                <td className="px-4 py-3 text-sm">
                  <Badge variant={pos.isActive ? "default" : "secondary"}>
                    {pos.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <Link href={`/dashboard/positions/edit/${pos.id}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeleteId(pos.id);
                        setDeleteName(pos.name);
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
        title="Delete Position"
        description={`Are you sure you want to delete position "${deleteName}"?`}
        onConfirm={handleDelete}
      />
    </>
  );
}
