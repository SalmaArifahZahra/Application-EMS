"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmployeeRowActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function EmployeeRowActions({
  onEdit,
  onDelete,
}: EmployeeRowActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onEdit}
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="destructive"
        size="icon"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}