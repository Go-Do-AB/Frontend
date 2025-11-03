"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";

type OrganizerRegisterForm = {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  businessName: string;
  organisationNumber: string;
  acceptTerms: boolean;
};

type OperationResult<T> = {
  isSuccess: boolean;
  message?: string;
  data?: T;
  errors?: string[];
};

type OrganiserAuthResponseDto = {
  token: string;
  refreshToken: string;
  organiser: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    businessName: string;
    organisationNumber: string;
    roles: string[];
  };
};

const API_BASE_URL = "https://localhost:7030";
const LANDING_PATH = "/landing";

export default function OrganizerRegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<OrganizerRegisterForm>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      businessName: "",
      organisationNumber: "",
      acceptTerms: false,
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: OrganizerRegisterForm) => {
    try {
      const payload = {
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password,
        fullName: values.fullName.trim(),
        phoneNumber: values.phoneNumber.trim(),
        businessName: values.businessName.trim(),
        organisationNumber: values.organisationNumber.trim(),
        acceptTerms: values.acceptTerms === true,
        termsVersion: "v1.0",
      };

      const res = await fetch(`${API_BASE_URL}/api/organisers/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const text = await res.text();
      const parsed: OperationResult<OrganiserAuthResponseDto> | undefined = text
        ? (JSON.parse(text) as OperationResult<OrganiserAuthResponseDto>)
        : undefined;

      if (!res.ok) {
        const msg = parsed?.message || parsed?.errors?.join(", ") || "Registration failed";
        throw new Error(msg);
      }

      // saving access-token
      const token =
        parsed?.data?.token ?? (parsed as unknown as OrganiserAuthResponseDto | undefined)?.token;
      if (token) localStorage.setItem("accessToken", token);

      toast.success("Organizer account created successfully!");
      router.replace(LANDING_PATH);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Registration failed";
      setError("root", { message });
      toast.error(message);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-yellow-400 text-black">
      <section className="flex flex-1 items-center justify-center px-6 md:px-10 py-14 md:py-20 relative">
        <div className="hidden md:block absolute left-20 top-1/2 -translate-y-1/2">
          <h2 className="text-6xl font-extrabold mb-4">Go.Do.</h2>
          <p className="text-2xl">More to do. Close to you.</p>
        </div>

        <div className="flex justify-center items-center w-full">
          <div className="w-full max-w-md">
            <Card className="shadow-lg border-black/10 bg-white">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold text-black">
                  Register as an organizer
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      autoComplete="username"
                      {...register("username", {
                        required: "Username is required",
                        minLength: { value: 3, message: "Min 3 characters" },
                        maxLength: { value: 64, message: "Max 64 characters" },
                      })}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Min 6 characters" },
                      })}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                      id="fullName"
                      autoComplete="name"
                      {...register("fullName", {
                        required: "Full name is required",
                        minLength: { value: 2, message: "Min 2 characters" },
                      })}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="businessName">Business name</Label>
                    <Input
                      id="businessName"
                      {...register("businessName", { required: "Business name is required" })}
                    />
                    {errors.businessName && (
                      <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      autoComplete="tel"
                      {...register("phoneNumber", { required: "Phone number is required" })}
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="organisationNumber">Organisation number</Label>
                    <Input
                      id="organisationNumber"
                      {...register("organisationNumber", {
                        required: "Organisation number is required",
                      })}
                    />
                    {errors.organisationNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.organisationNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <input
                      id="acceptTerms"
                      type="checkbox"
                      className="h-4 w-4"
                      {...register("acceptTerms", {
                        validate: (v) => v === true || "You must accept the terms",
                      })}
                    />
                    <Label htmlFor="acceptTerms" className="text-sm text-gray-700">
                      I agree to the Terms and Conditions
                    </Label>
                  </div>
                  {errors.acceptTerms && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.acceptTerms.message as string}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-black text-white hover:bg-gray-800 mt-4 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Registering..." : "Register"}
                  </Button>

                  {errors.root?.message && (
                    <p className="text-red-600 text-sm mt-2 text-center">{errors.root.message}</p>
                  )}
                </form>
              </CardContent>

              <CardFooter className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account{" "}
                  <span
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={() => router.push("/login")}
                  >
                    Log in
                  </span>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
