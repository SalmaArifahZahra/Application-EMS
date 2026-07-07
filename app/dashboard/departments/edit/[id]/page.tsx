"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { DepartmentForm } from "@/features/department/components/department-form";
import { departmentService } from "@/features/department/services/department-service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Department } from "@/features/department/types";

export default function EditDepartmentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadDepartment() {
      try {
        const data = await departmentService.getById(id);
        setDepartment(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load department");
        router.push("/dashboard/departments");
      } finally {
        setLoading(false);
      }
    }
    loadDepartment();
  }, [id, router]);

  async function handleSubmit(values: Omit<import("@/features/department/types").Department, "id" | "createdAt">) {
    try {
      setSubmitting(true);
      await departmentService.update(id, values);
      router.push("/dashboard/departments");
    } catch (error) {
      console.error(error);
      alert("Failed to update department");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Link href="/dashboard/departments" className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Departments
      </Link>
      
      <PageHeader
        title="Edit Department"
        description="Update department details."
      />

      <div className="mt-6 rounded-xl border bg-white p-6">
        {department && (
          <DepartmentForm
            initialValues={department}
            loading={submitting}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </>
  );
}
