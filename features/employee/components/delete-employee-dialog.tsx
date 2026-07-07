"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { employeeService } from "../services/employee-service";

interface DeleteEmployeeButtonProps {
  id: string;

  fullName: string;

  onSuccess(): void;
}

export function DeleteEmployeeButton({
  id,
  fullName,
  onSuccess,
}: DeleteEmployeeButtonProps) {
  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete employee "${fullName}" ?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await employeeService.delete(id);

      onSuccess();
    } catch (error) {
      console.error(error);

      alert("Failed to delete employee.");
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </Button>
  );
}