"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { UserForm } from "@/features/user/components/user-form";
import { userService } from "@/features/user/services/user-service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ApiUser } from "@/features/auth/types";
import { useAuth } from "@/features/auth/hooks/use-auth";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = use(params);
  const [userToEdit, setUserToEdit] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role !== "superadmin") return;
    async function loadUser() {
      try {
        const data = await userService.getById(id);
        setUserToEdit(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load user");
        router.push("/dashboard/users");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [id, router, user]);

  async function handleSubmit(values: Omit<import("@/features/auth/types").ApiUser, "id" | "createdAt">) {
    try {
      setSubmitting(true);
      await userService.update(id, values);
      router.push("/dashboard/users");
    } catch (error) {
      console.error(error);
      alert("Failed to update user");
    } finally {
      setSubmitting(false);
    }
  }

  if (user?.role !== "superadmin") return null;

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Link href="/dashboard/users" className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Users
      </Link>
      
      <PageHeader
        title="Edit User"
        description="Update user details."
      />

      <div className="mt-6 rounded-xl border bg-white p-6">
        {userToEdit && (
          <UserForm
            initialValues={userToEdit}
            loading={submitting}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </>
  );
}
