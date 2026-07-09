"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { PositionForm } from "@/features/position/components/position-form";
import { positionService } from "@/features/position/service/position-service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Position } from "@/features/position/types";
import { toast } from "sonner";

export function EditPositionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadPosition() {
      try {
        const data = await positionService.getById(id);
        setPosition(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load position");
        router.push("/dashboard/positions");
      } finally {
        setLoading(false);
      }
    }
    loadPosition();
  }, [id, router]);

  async function handleSubmit(values: Omit<import("@/features/position/types").Position, "id" | "createdAt">) {
    try {
      setSubmitting(true);
      await positionService.update(id, {
        ...values,
        updatedAt: new Date().toISOString(),
      });
      toast.success("Position updated successfully", {
        description: `Position ${values.name} has been updated.`,
      });
      router.push("/dashboard/positions");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update position", {
        description: "An error occurred while updating the position.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Link href="/dashboard/positions" className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Positions
      </Link>
      
      <PageHeader
        title="Edit Position"
        description="Update position details."
      />

      <div className="mt-6 rounded-xl border bg-white p-6">
        {position && (
          <PositionForm
            initialValues={position}
            loading={submitting}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </>
  );
}
