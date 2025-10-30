"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type OrganizerRegisterForm = {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  businessName: string;
  organisationNumber: string;
};

export default function OrganizerRegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizerRegisterForm>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullName: "",
      phoneNumber: "",
      businessName: "",
      organisationNumber: "",
    },
  });

  const onSubmit = async (values: OrganizerRegisterForm) => {
    try {
      const res = await fetch("https://localhost:7030/api/auth/register-organizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });

      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload?.message ?? "Registration failed");
      }

      toast.success("Organizer account created successfully!");
      router.push("/login");
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message ?? "Registration failed");
      } else {
        toast.error("Registration failed");
      }
    }
  };

  return (
  <main className="min-h-screen flex flex-col bg-yellow-400 text-black">
    <section className="flex flex-1 items-center justify-center px-10 py-20 relative">
      {/* left: Go.Do.-text */}
      <div className="absolute left-20 top-1/2 -translate-y-1/2">
        <h2 className="text-6xl font-extrabold mb-4">Go.Do.</h2>
        <p className="text-2xl">More to do. Close to you.</p>
      </div>

      {/* Register box — centered */}
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
                    <Input id="username" {...register("username", { required: "Username is required" })} />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" {...register("password", { required: "Password is required" })} />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                  </div> 

                <div>
                  <Label htmlFor="fullname">Full name</Label>
                  <Input id="fullname" {...register("fullName", { required: "Full name is required" })} />
                  {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                </div>

                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    {...register("businessName", { required: "Business name is required" })}
                  />
                  {errors.businessName && (
                    <p className="text-red-500 text-sm">{errors.businessName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    {...register("phoneNumber", { required: "Phone number is required" })}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="organisationNumber">Organisation Number</Label>
                  <Input
                    id="organisationNumber"
                    {...register("organisationNumber", {
                      required: "Organisation number is required",
                    })}
                  />
                  {errors.organisationNumber && (
                    <p className="text-red-500 text-sm">{errors.organisationNumber.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center gap-2 mt-4">
                  <input id="terms" type="checkbox" required className="h-4 w-4" />
                  <Label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the Terms and Conditions
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-800 mt-4"
                >
                  Register
                </Button>
              </form>
            </CardContent>

            <CardFooter className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
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
)};
