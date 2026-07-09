"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { userService } from "../services/user-service";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange(open: boolean): void;
  onSuccess?(): Promise<void> | void; 
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  onSuccess, 
}: ChangePasswordDialogProps) {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSave() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (!user) {
      alert("User not found.");
      return;
    }

    try {
      const profile = await userService.getById(user.id);

      if (profile.password !== currentPassword) {
        alert("Current password is incorrect.");
        return;
      }

      if (currentPassword === newPassword) {
        alert("New password must be different from the current password.");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("New password and confirmation password do not match.");
        return;
      }

      await userService.changePassword(user.id, newPassword);

      await onSuccess?.();

      alert("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      onOpenChange(false);
    } catch (error) {
      console.error(error);
      alert("Failed to change password.");
    }
  }

  function handleClose(open: boolean) {
    if (!open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

    onOpenChange(open);
  }

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Change Password</AlertDialogTitle>
          <AlertDialogDescription>
            Enter your current password and create a new password.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <PasswordInput
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>New Password</Label>
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
