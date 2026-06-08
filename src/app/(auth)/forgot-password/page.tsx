"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "@/lib/axios";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormValues = { email: string };

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await api.post("/organisers/auth/forgot-password", { email: values.email });
      toast.success("If the email exists, a reset link is on its way.");
      setSubmitted(true);
    } catch (e: unknown) {
      const axiosErr = e as { response?: { data?: { message?: string; errors?: string[] } } };
      const msg =
        axiosErr?.response?.data?.message ||
        axiosErr?.response?.data?.errors?.join(", ") ||
        (e instanceof Error ? e.message : "Something went wrong");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F3C10E] text-black">
      <section className="flex flex-1 flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-4 sm:px-8 lg:px-16 py-10 lg:py-20">
        <div className="text-center lg:text-left shrink-0">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-2 lg:mb-4">Go.Do.</h2>
          <p className="text-lg sm:text-xl lg:text-2xl">More to do. Close to you.</p>
        </div>

        <div className="w-full max-w-md">
          <Card className="shadow-lg border-black/10 bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-xl sm:text-2xl font-semibold text-black">
                Reset your password
              </CardTitle>
              <p className="text-sm text-black/70 mt-2">
                Enter the email for your organiser account and we&apos;ll send a reset link.
              </p>
            </CardHeader>

            <CardContent>
              {submitted ? (
                <div className="space-y-4 text-center">
                  <p className="text-black">
                    If an account exists for that email, a reset link has been sent. The link is
                    valid for 15 minutes.
                  </p>
                  <p className="text-sm text-black/70">
                    Check your spam folder if it hasn&apos;t arrived.
                  </p>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                          message: "Enter a valid email",
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
                    disabled={loading}
                    className="w-full bg-black text-white hover:bg-black/90 transition-all disabled:opacity-60"
                  >
                    {loading ? "Sending…" : "Send reset link"}
                  </Button>
                </form>
              )}
            </CardContent>

            <CardFooter className="flex justify-center">
              <Link
                href="/login"
                className="text-sm underline underline-offset-4 text-black"
              >
                Back to login
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  );
}
