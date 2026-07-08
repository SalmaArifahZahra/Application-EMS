"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";

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
      
      toast("Employee deleted successfully", {
        description: `Employee "${fullName}" has been removed.`,
        icon: <Trash2 size={16} className="text-red-500" />,
      });

      onSuccess();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete employee", {
        description: "An error occurred while deleting the employee.",
      });
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