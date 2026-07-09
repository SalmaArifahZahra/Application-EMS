"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Building2 } from "lucide-react";
import { toast } from "sonner";

import { apiClient, API } from "@/lib/api-client";
import type { Department } from "@/features/department/types";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2 border-b border-slate-50 last:border-0">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="col-span-2 text-sm text-slate-700">{value || "-"}</div>
    </div>
  );
}

export function DepartmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDepartment() {
      if (!id) return;
      try {
        const data = await apiClient.get<Department>(`${API.departments}/${id}`);
        setDepartment(data);
      } catch (err) {
        toast.error("Failed to load department details.");
        router.push("/dashboard/departments");
      } finally {
        setLoading(false);
      }
    }
    fetchDepartment();
  }, [id, router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!department) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <Link 
        href="/dashboard/departments" 
        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Departments
      </Link>
      
      <PageHeader
        title="Department Details"
        description="View complete department information."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Building2 className="h-5 w-5 text-slate-500" />
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem label="Department Code" value={<span className="font-semibold text-slate-800">{department.code}</span>} />
            <DetailItem label="Department Name" value={department.name} />
            <DetailItem label="Manager Code" value={department.managerEmployeeCode} />
            <DetailItem 
              label="Status" 
              value={
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  department.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
                }`}>
                  {department.isActive ? "Active" : "Inactive"}
                </span>
              } 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Building2 className="h-5 w-5 text-slate-500" />
            <CardTitle>Other Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem label="Description" value={department.description} />
            <DetailItem label="Created At" value={formatDate(department.createdAt)} />
            <DetailItem label="Updated At" value={formatDate(department.updatedAt)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
