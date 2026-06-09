"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ChevronRight, User } from "lucide-react";
import { Navbar } from "@/components/global/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/axios";
import { getTokenPayload } from "@/lib/auth";

type OrganiserProfile = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  businessName: string;
  organisationNumber: string;
};

type OperationResult<T> = {
  isSuccess: boolean;
  data?: T;
  errors?: string[];
};

type EditField = {
  key: keyof Pick<OrganiserProfile, "fullName" | "phoneNumber" | "businessName" | "organisationNumber">;
  label: string;
  inputType?: string;
};

const EDIT_FIELDS: EditField[] = [
  { key: "fullName", label: "Full Name" },
  { key: "phoneNumber", label: "Phone Number", inputType: "tel" },
  { key: "businessName", label: "Business Name" },
  { key: "organisationNumber", label: "Organisation Number" },
];

function ProfileRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between py-3.5 px-1 border-b border-[#D1CEC6] last:border-b-0 hover:bg-gray-50 transition-colors"
    >
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-sm font-medium text-[#1C1C1E]">{label}</span>
        {value && <span className="text-xs text-[#8E8E93]">{value}</span>}
      </div>
      <ChevronRight className="w-4 h-4 text-[#8E8E93] shrink-0" />
    </button>
  );
}

function SectionCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[18px] px-6 py-2 shadow-sm">
      {title && (
        <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider pt-4 pb-2">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<OrganiserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit single field dialog
  const [editField, setEditField] = useState<EditField | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Change password dialog
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Delete account dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const payload = getTokenPayload();
    if (!payload) {
      router.replace("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get<OperationResult<OrganiserProfile>>("/organisers/profile");
        if (res.data.isSuccess && res.data.data) {
          setProfile(res.data.data);
        }
      } catch {
        toast.error("Failed to load profile. Please log in again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const openEditDialog = (field: EditField) => {
    setEditField(field);
    setEditValue(profile?.[field.key] ?? "");
  };

  const handleSaveField = async () => {
    if (!editField) return;
    setIsSaving(true);
    try {
      const res = await api.put<OperationResult<OrganiserProfile>>("/organisers/profile", {
        ...profile,
        [editField.key]: editValue,
      });
      if (res.data.isSuccess && res.data.data) {
        setProfile((prev) => (prev ? { ...prev, ...res.data.data } : prev));
        toast.success(`${editField.label} updated`);
        setEditField(null);
      } else {
        toast.error(res.data.errors?.join(", ") || "Failed to update");
      }
    } catch (e: unknown) {
      const err = e as { response?: { data?: OperationResult<unknown> } };
      toast.error(err?.response?.data?.errors?.join(", ") || "Failed to update");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setIsChangingPassword(true);
    try {
      const res = await api.post<OperationResult<unknown>>("/auth/account/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmNewPassword: passwordForm.confirmNewPassword,
      });
      if (res.data.isSuccess) {
        toast.success("Password changed successfully");
        setChangePasswordOpen(false);
        setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      } else {
        toast.error(res.data.errors?.join(", ") || "Failed to change password");
      }
    } catch (e: unknown) {
      const err = e as { response?: { data?: OperationResult<unknown> } };
      toast.error(err?.response?.data?.errors?.join(", ") || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.replace("/login");
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await api.delete<OperationResult<unknown>>("/auth/account", {
        data: { password: deletePassword },
      });
      if (res.data.isSuccess) {
        localStorage.removeItem("accessToken");
        toast.success("Account deleted");
        router.replace("/login");
      } else {
        toast.error(res.data.errors?.join(", ") || "Failed to delete account");
      }
    } catch (e: unknown) {
      const err = e as { response?: { data?: OperationResult<unknown> } };
      toast.error(err?.response?.data?.errors?.join(", ") || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F3C10E] text-[#1C1C1E] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#8E8E93]" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3C10E] text-[#1C1C1E] flex flex-col">
      <Navbar />

      <section className="flex-1 px-4 py-8 max-w-lg mx-auto w-full space-y-4">

        {/* Profile Header */}
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm">
            <User className="w-9 h-9 text-[#2A2000]" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#1C1C1E]">
              {profile?.fullName || profile?.username || "—"}
            </p>
            <p className="text-sm text-[#8E8E93] mt-0.5">{profile?.email || "—"}</p>
          </div>
        </div>

        {/* Account Details */}
        <SectionCard title="My Account">
          {EDIT_FIELDS.map((field) => (
            <ProfileRow
              key={field.key}
              label={field.label}
              value={profile?.[field.key]}
              onClick={() => openEditDialog(field)}
            />
          ))}
        </SectionCard>

        {/* Security */}
        <SectionCard title="Security">
          <ProfileRow
            label="Change Password"
            onClick={() => setChangePasswordOpen(true)}
          />
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="w-full flex items-center justify-between py-3.5 px-1 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-red-600">Delete Account</span>
            <ChevronRight className="w-4 h-4 text-red-400 shrink-0" />
          </button>
        </SectionCard>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2 pb-8">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3 rounded-[26px] border-2 border-red-600 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            Log Out
          </button>
        </div>
      </section>

      {/* Edit Single Field Dialog */}
      <Dialog
        open={!!editField}
        onOpenChange={(open) => { if (!open) setEditField(null); }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editField?.label}</DialogTitle>
            <DialogDescription>Update your {editField?.label?.toLowerCase()}.</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="editFieldInput">{editField?.label}</Label>
            <Input
              id="editFieldInput"
              type={editField?.inputType ?? "text"}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="rounded-[26px] mt-1"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-[26px] hover:bg-gray-100 hover:text-[#1C1C1E]" onClick={() => setEditField(null)}>
              Cancel
            </Button>
            <Button
              className="rounded-[26px] bg-[#F3C10E] text-[#2A2000] hover:bg-[#EDB80D]"
              onClick={handleSaveField}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog
        open={changePasswordOpen}
        onOpenChange={(open) => {
          setChangePasswordOpen(open);
          if (!open) setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                className="rounded-[26px] mt-1"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                className="rounded-[26px] mt-1"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                className="rounded-[26px] mt-1"
                value={passwordForm.confirmNewPassword}
                onChange={(e) => setPasswordForm((f) => ({ ...f, confirmNewPassword: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-[26px] hover:bg-gray-100 hover:text-[#1C1C1E]" onClick={() => setChangePasswordOpen(false)}>
              Cancel
            </Button>
            <Button
              className="rounded-[26px] bg-[#F3C10E] text-[#2A2000] hover:bg-[#EDB80D]"
              onClick={handleChangePassword}
              disabled={
                isChangingPassword ||
                !passwordForm.currentPassword ||
                !passwordForm.newPassword ||
                !passwordForm.confirmNewPassword
              }
            >
              {isChangingPassword && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setDeletePassword("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and all associated data. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="deletePassword">Enter your password to confirm</Label>
            <Input
              id="deletePassword"
              type="password"
              className="rounded-[26px] mt-1"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-[26px] hover:bg-gray-100 hover:text-[#1C1C1E]" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-[26px]"
              onClick={handleDeleteAccount}
              disabled={isDeleting || !deletePassword}
            >
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
