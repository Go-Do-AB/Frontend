"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { getStoredJwtPayload, getEmailFromPayload } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import { MailWarning } from "lucide-react";

function getVerificationState(): { show: boolean; email: string | null } {
  const payload = getStoredJwtPayload();
  if (!payload) return { show: false, email: null };

  const isVerified = payload.emailVerified !== "false";
  if (isVerified) return { show: false, email: null };

  return { show: true, email: getEmailFromPayload(payload) };
}

export function UnverifiedEmailBanner() {
  const [state, setState] = useState<{ show: boolean; email: string | null }>({
    show: false,
    email: null,
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setState(getVerificationState());
  }, []);

  if (!state.show) return null;

  const handleResend = async () => {
    if (!state.email || sent) return;
    setLoading(true);
    try {
      const res = await api.post("/auth/resend-verification", { email: state.email });
      const payload = res.data;
      if (payload?.isSuccess === false) {
        throw new Error(payload?.errors?.join(", ") || "Could not send verification email");
      }
      toast.success("Verification email sent. Check your inbox.");
      setSent(true);
    } catch {
      toast.error("Could not send verification email. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="alert"
      className="w-full bg-yellow-100 border-b border-yellow-300 text-yellow-900 text-sm px-4 py-2.5 flex items-center justify-center gap-2 font-medium"
    >
      <MailWarning className="w-4 h-4 shrink-0" />
      <span>Your email address is not verified.</span>
      {sent ? (
        <span className="text-yellow-800">Check your inbox for the verification link.</span>
      ) : (
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-yellow-900 underline font-semibold text-sm hover:text-yellow-700"
          onClick={handleResend}
          disabled={loading}
        >
          {loading ? "Sending…" : "Resend verification email"}
        </Button>
      )}
    </div>
  );
}
