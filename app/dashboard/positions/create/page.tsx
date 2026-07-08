"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { PositionForm } from "@/features/position/components/position-form";
import { positionService } from "@/features/position/service/position-service";
import type { Position } from "@/features/position/types";

type PositionFormValues = Omit<Position, "id" | "createdAt">;

export default function CreatePositionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCreate(values: PositionFormValues) {
    try {
      setLoading(true);

      await positionService.create({
        ...values,
        createdAt: new Date().toISOString(),
      });

      toast.success("Position created successfully", {
        description: `Position ${values.name} has been added.`,
      });

      router.push("/dashboard/positions");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create position", {
        description: "An error occurred while creating the position.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Link href="/dashboard/positions" className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Positions
      </Link>
      
      <PageHeader
        title="Create Position"
        description="Add new position."
      />

      <PositionForm
        loading={loading}
        onSubmit={handleCreate}
      />
    </>
  );
}
