"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <section className="space-y-2">
      <h1 className="text-3xl font-bold">
        Welcome, {user?.firstName}
      </h1>

      <p className="text-slate-600">
        Selamat datang di Employee Management
        System.
      </p>
    </section>
  );
}