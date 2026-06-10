"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "@/lib/axios";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Status = "verifying" | "success" | "missing-token" | "failed";
type ResendValues = { email: string };

function extractErrorMessage(e: unknown, fallback: string): string {
  const axiosErr = e as { response?: { data?: { message?: string; errors?: string[] } } };
  return (
    axiosErr?.response?.data?.message ||
    axiosErr?.response?.data?.errors?.join(", ") ||
    (e instanceof Error ? e.message : fallback)
  );
}

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = React.useState<Status>(token ? "verifying" : "missing-token");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [resendLoading, setResendLoading] = React.useState(false);
  const [resendDone, setResendDone] = React.useState(false);
  const attemptedRef = React.useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendValues>({
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  React.useEffect(() => {
    if (!token || attemptedRef.current) return;
    attemptedRef.current = true;

    (async () => {
      try {
        const res = await api.post("/auth/verify-email", { token });
        const payload = res.data;
        if (payload?.isSuccess === false) {
          throw new Error(payload?.errors?.join(", ") || "Verification failed");
        }
        setStatus("success");
      } catch (e: unknown) {
        setErrorMessage(extractErrorMessage(e, "Verification link is invalid or has expired."));
        setStatus("failed");
      }
    })();
  }, [token]);

  const onResend = async (values: ResendValues) => {
    setResendLoading(true);
    try {
      const res = await api.post("/auth/resend-verification", { email: values.email });
      const payload = res.data;
      if (payload?.isSuccess === false) {
        throw new Error(payload?.errors?.join(", ") || "Could not send verification email");
      }
      toast.success("If the email matches an account, a new verification link has been sent.");
      setResendDone(true);
    } catch (e: unknown) {
      toast.error(extractErrorMessage(e, "Could not send verification email"));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-brand text-black">
      <section className="flex flex-1 flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-4 sm:px-8 lg:px-16 py-10 lg:py-20">
        <div className="text-center lg:text-left shrink-0">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-2 lg:mb-4">Go.Do.</h2>
          <p className="text-lg sm:text-xl lg:text-2xl">More to do. Close to you.</p>
        </div>

        <div className="w-full max-w-md">
          <Card className="shadow-lg border-black/10 bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-xl sm:text-2xl font-semibold text-black">
                {status === "success" ? "Email verified" : "Verify your email"}
              </CardTitle>
              <p className="text-sm text-black/70 mt-2">For your GoDo app account.</p>
            </CardHeader>

            <CardContent>
              {status === "verifying" && (
                <div className="space-y-4 text-center">
                  <p className="text-black">Verifying your email address…</p>
                </div>
              )}

              {status === "success" && (
                <div className="space-y-4 text-center">
                  <p className="text-black">Your email address has been verified.</p>
                  <p className="text-sm text-black/70">
                    Open the GoDo app and sign in to start exploring events near you.
                  </p>
                </div>
              )}

              {status === "missing-token" && (
                <div className="space-y-4 text-center">
                  <p className="text-red-700">The verification link is missing or invalid.</p>
                  <p className="text-sm text-black/70">
                    Open the GoDo app and request a new verification email from the sign-in screen.
                  </p>
                </div>
              )}

              {status === "failed" && (
                <div className="space-y-5">
                  <div className="text-center space-y-2">
                    <p className="text-red-700">{errorMessage || "Verification failed."}</p>
                    <p className="text-sm text-black/70">
                      The link may have expired. Enter your email below to receive a new one.
                    </p>
                  </div>

                  {resendDone ? (
                    <p className="text-sm text-black/80 text-center">
                      Check your inbox for the new verification email.
                    </p>
                  ) : (
                    <form className="space-y-4" onSubmit={handleSubmit(onResend)} noValidate>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-black">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Enter a valid email address",
                            },
                          })}
                          className="bg-white"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={resendLoading}
                        className="w-full bg-black text-white hover:bg-black/90 transition-all disabled:opacity-60"
                      >
                        {resendLoading ? "Sending…" : "Resend verification email"}
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-center">
              <span className="text-sm text-black/70">Open the GoDo app to continue.</span>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <React.Suspense fallback={null}>
      <VerifyEmailInner />
    </React.Suspense>
  );
}
