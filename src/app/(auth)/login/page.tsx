"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "@/lib/axios";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { username: "", password: "" },
  });

  const LANDING_PATH = "/landing";

  type FormValues = { username: string; password: string };

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await api.post("/organisers/auth/login", {
        username: values.username,
        password: values.password,
      });

      const payload = res.data;

      // Backend wrapping in OperationResult<T>
      if (payload?.isSuccess === false) {
        throw new Error(payload?.message ?? "Login failed");
      }

      const token: string | undefined = payload?.data?.token;
      if (token) {
        localStorage.setItem("accessToken", token);
      }

      toast.success("Logged in");
      router.replace(LANDING_PATH);
    } catch (e: unknown) {
      const axiosErr = e as { response?: { data?: { message?: string; errors?: string[] } } };
      const msg =
        axiosErr?.response?.data?.message ||
        axiosErr?.response?.data?.errors?.join(", ") ||
        (e instanceof Error ? e.message : "Login failed");
      toast.error(msg);
      console.error("Login error:", msg);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-yellow-400 text-black">
      <section className="flex flex-1 flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-4 sm:px-8 lg:px-16 py-10 lg:py-20">
        {/* Branding — stacks above card on mobile, sits left on desktop */}
        <div className="text-center lg:text-left shrink-0">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-2 lg:mb-4">Go.Do.</h2>
          <p className="text-lg sm:text-xl lg:text-2xl">More to do. Close to you.</p>
        </div>

        {/* Login card */}
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-black/10 bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-xl sm:text-2xl font-semibold text-black">
                Log in as an organizer
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-black">
                    Username
                  </Label>
                  <Input
                    id="username"
                    {...register("username", { required: "Username is required" })}
                    className="bg-white"
                  />
                  {errors.username && (
                    <p className="text-sm text-red-600">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-black">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", { required: "Password is required" })}
                    className="bg-white"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-black/90 transition-all"
                >
                  Log in
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button variant="outline" className="w-full border-black/20" asChild>
                <Link href="/register">Register as an organizer</Link>
              </Button>

              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm underline underline-offset-4 text-black"
                >
                  Forgot my password
                </Link>
              </div>

              <div className="w-full pt-2 border-t border-black/10">
                <Link
                  href="/preview"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-yellow-400 text-black text-sm font-semibold hover:bg-yellow-300 transition-colors"
                >
                  See the app in action
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  );
}
