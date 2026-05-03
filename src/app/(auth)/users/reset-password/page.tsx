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

type FormValues = { password: string; confirmPassword: string };

function UserResetPasswordInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onBlur",
  });

  const passwordValue = watch("password");

  const onSubmit = async (values: FormValues) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword: values.password,
      });

      const payload = res.data;
      if (payload?.isSuccess === false) {
        throw new Error(payload?.message ?? "Reset failed");
      }

      toast.success("Password updated. You can now sign in to the GoDo app.");
      setDone(true);
    } catch (e: unknown) {
      const axiosErr = e as { response?: { data?: { message?: string; errors?: string[] } } };
      const msg =
        axiosErr?.response?.data?.message ||
        axiosErr?.response?.data?.errors?.join(", ") ||
        (e instanceof Error ? e.message : "Reset failed");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-yellow-400 text-black">
      <section className="flex flex-1 flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-4 sm:px-8 lg:px-16 py-10 lg:py-20">
        <div className="text-center lg:text-left shrink-0">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-2 lg:mb-4">Go.Do.</h2>
          <p className="text-lg sm:text-xl lg:text-2xl">More to do. Close to you.</p>
        </div>

        <div className="w-full max-w-md">
          <Card className="shadow-lg border-black/10 bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-xl sm:text-2xl font-semibold text-black">
                Choose a new password
              </CardTitle>
              <p className="text-sm text-black/70 mt-2">For your GoDo app account.</p>
            </CardHeader>

            <CardContent>
              {!token ? (
                <div className="space-y-4 text-center">
                  <p className="text-red-700">The reset link is missing or invalid.</p>
                  <p className="text-sm text-black/70">
                    Open the GoDo app and request a new reset link from the &quot;Forgot
                    password&quot; screen.
                  </p>
                </div>
              ) : done ? (
                <div className="space-y-4 text-center">
                  <p className="text-black">Your password has been updated.</p>
                  <p className="text-sm text-black/70">
                    Open the GoDo app and sign in with your new password.
                  </p>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-black">
                      New password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 8, message: "At least 8 characters" },
                      })}
                      className="bg-white"
                    />
                    {errors.password && (
                      <p className="text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-black">
                      Confirm new password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (v) => v === passwordValue || "Passwords do not match",
                      })}
                      className="bg-white"
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white hover:bg-black/90 transition-all disabled:opacity-60"
                  >
                    {loading ? "Updating…" : "Update password"}
                  </Button>
                </form>
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

export default function UserResetPasswordPage() {
  return (
    <React.Suspense fallback={null}>
      <UserResetPasswordInner />
    </React.Suspense>
  );
}
