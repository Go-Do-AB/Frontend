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
      <section className="flex flex-1 items-center justify-center px-10 py-20 relative">
        {/* left: Go.Do-text */}
        <div className="absolute left-20 top-1/2 -translate-y-1/2">
          <h2 className="text-6xl font-extrabold mb-4">Go.Do.</h2>
          <p className="text-2xl">More to do. Close to you.</p>
        </div>

        {/* Login box – centerd */}
        <div className="flex justify-center items-center w-full">
          <div className="w-full max-w-md">
            <Card className="shadow-lg border-black/10 bg-white">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold text-black">
                  Log in as an organizer
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
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
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
