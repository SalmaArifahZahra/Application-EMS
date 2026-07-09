"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { UserForm } from "@/features/user/components/user-form";
import { userService } from "@/features/user/services/user-service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function CreateUserPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(values: Omit<import("@/features/auth/types").ApiUser, "id" | "createdAt">) {
    try {
      setLoading(true);
      await userService.create({
        ...values,
        createdAt: new Date().toISOString(),
      });
      router.push("/dashboard/users");
    } catch (error) {
      console.error(error);
      alert("Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  if (user?.role !== "superadmin") return null;

  return (
    <>
      <Link href="/dashboard/users" className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Users
      </Link>
      
      <PageHeader
        title="Add User"
        description="Fill in the details to create a new user."
      />

      <div className="mt-6 rounded-xl border bg-white p-6">
        <UserForm loading={loading} onSubmit={handleSubmit} />
      </div>
    </>
  );
}
