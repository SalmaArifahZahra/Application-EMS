"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { DepartmentForm } from "@/features/department/components/department-form";
import { departmentService } from "@/features/department/services/department-service";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateDepartmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(values: Omit<import("@/features/department/types").Department, "id" | "createdAt">) {
    try {
      setLoading(true);
      await departmentService.create({
        ...values,
        createdAt: new Date().toISOString(),
      });
      router.push("/dashboard/departments");
    } catch (error) {
      console.error(error);
      alert("Failed to create department");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Link href="/dashboard/departments" className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Departments
      </Link>
      
      <PageHeader
        title="Add Department"
        description="Fill in the details to create a new department."
      />

      <div className="mt-6 rounded-xl border bg-white p-6">
        <DepartmentForm loading={loading} onSubmit={handleSubmit} />
      </div>
    </>
  );
}
