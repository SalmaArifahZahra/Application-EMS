"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { employeeService } from "@/features/employee/services/employee-service";
import { ArrowLeft, User, Briefcase, Phone, Calendar } from "lucide-react";
import Link from "next/link";
import type { Employee } from "@/features/employee/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEmployee() {
      try {
        const data = await employeeService.getById(id);
        setEmployee(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load employee details");
        router.push("/dashboard/employees");
      } finally {
        setLoading(false);
      }
    }
    loadEmployee();
  }, [id, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!employee) {
    return <p>Employee not found</p>;
  }

  return (
    <>
      <Link href="/dashboard/employees" className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Employees
      </Link>
      
      <PageHeader
        title="Employee Details"
        description="Detailed information about the employee."
      />

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <User className="h-5 w-5 text-slate-500" />
            <CardTitle>Biodata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-6">
              {employee.image ? (
                <img src={employee.image} alt={employee.firstName} className="h-32 w-32 rounded-full object-cover border-4 border-slate-100" />
              ) : (
                <div className="h-32 w-32 rounded-full bg-slate-200 flex items-center justify-center">
                  <User className="h-12 w-12 text-slate-400" />
                </div>
              )}
            </div>
            <DetailItem label="Full Name" value={`${employee.firstName} ${employee.lastName}`} />
            <DetailItem label="NIK" value={employee.nik} />
            <DetailItem label="Gender" value={employee.gender} />
            <DetailItem label="Birth Date" value={employee.birthDate} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Briefcase className="h-5 w-5 text-slate-500" />
            <CardTitle>Job Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem label="Department" value={employee.departmentCode} />
            <DetailItem label="Position" value={employee.positionCode} />
            <DetailItem label="Status" value={employee.status} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Phone className="h-5 w-5 text-slate-500" />
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem label="Email" value={employee.email} />
            <DetailItem label="Phone Number" value={employee.phone} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Calendar className="h-5 w-5 text-slate-500" />
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem label="Created At" value={new Date(employee.createdAt).toLocaleDateString()} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-900">{value || "-"}</p>
    </div>
  );
}
