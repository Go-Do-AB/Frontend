"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "@/lib/axios";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormValues = { password: string; confirmPassword: string };

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = React.useState(false);

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
      const res = await api.post("/organisers/auth/reset-password", {
        token,
        newPassword: values.password,
      });

      const payload = res.data;
      if (payload?.isSuccess === false) {
        throw new Error(payload?.message ?? "Reset failed");
      }

      toast.success("Lösenordet har uppdaterats. Du kan nu logga in.");
      router.replace("/login");
    } catch (e: unknown) {
      const axiosErr = e as { response?: { data?: { message?: string; errors?: string[] } } };
      const msg =
        axiosErr?.response?.data?.message ||
        axiosErr?.response?.data?.errors?.join(", ") ||
        (e instanceof Error ? e.message : "Återställningen misslyckades");
      toast.error(msg);
    } finally {
      setLoading(false);
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
                Välj ett nytt lösenord
              </CardTitle>
            </CardHeader>

            <CardContent>
              {!token ? (
                <div className="space-y-4 text-center">
                  <p className="text-red-700">
                    Återställningslänken saknas eller är ogiltig.
                  </p>
                  <p className="text-sm text-black/70">
                    Begär en ny återställningslänk från sidan för glömt lösenord.
                  </p>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-black">
                      Nytt lösenord
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      {...register("password", {
                        required: "Lösenord krävs",
                        minLength: { value: 8, message: "Minst 8 tecken" },
                      })}
                      className="bg-white"
                    />
                    {errors.password && (
                      <p className="text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-black">
                      Bekräfta nytt lösenord
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      {...register("confirmPassword", {
                        required: "Bekräfta ditt lösenord",
                        validate: (v) => v === passwordValue || "Lösenorden matchar inte",
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
                    {loading ? "Uppdaterar…" : "Uppdatera lösenord"}
                  </Button>
                </form>
              )}
            </CardContent>

            <CardFooter className="flex justify-center">
              <Link
                href="/login"
                className="text-sm underline underline-offset-4 text-black"
              >
                Tillbaka till inloggning
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={null}>
      <ResetPasswordInner />
    </React.Suspense>
  );
}
