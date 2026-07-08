"use client";

import { useEffect, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";

import { useAuth } from "@/features/auth/hooks/use-auth";
import type { ApiUser } from "@/features/auth/types";

import { UserForm } from "@/features/user/components/user-form";
import { ChangePasswordDialog } from "@/features/user/components/change-password-dialog";
import { userService } from "@/features/user/services/user-service";

export default function ProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [openChangePassword, setOpenChangePassword] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      try {
        const data = await userService.getById(user.id);
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  async function refreshProfile() {
    if (!user) return;

    try {
      const data = await userService.getById(user.id);
      setProfile(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit(values: Omit<ApiUser, "id" | "createdAt">) {
    if (!profile) return;

    try {
      setSubmitting(true);

      await userService.update(profile.id, values);

      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <PageHeader
        title="My Profile"
        description="View and update your profile."
      />

      <div className="mt-6 rounded-xl border bg-white p-6">
        {profile && (
          <UserForm
            key={profile.password} 
            initialValues={profile}
            loading={submitting}
            onSubmit={handleSubmit}
            onChangePassword={() => setOpenChangePassword(true)}
          />
        )}
      </div>

      <ChangePasswordDialog
        open={openChangePassword}
        onOpenChange={setOpenChangePassword}
        onSuccess={refreshProfile} 
      />
    </>
  );
}
