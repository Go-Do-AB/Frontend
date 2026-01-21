"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle, XCircle, Zap, LogOut, Plus, ArrowLeft } from "lucide-react";

import { Navbar } from "@/components/global/Navbar";
import { QuickCreateForm } from "@/components/forms/QuickCreateForm";
import { useQuickCreateEvent } from "@/hooks/useQuickCreateEvent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  quickCreateSchema,
  defaultQuickCreateValues,
  createQuickPayload,
  QuickCreateFormData,
} from "@/lib/validation/quick-create-schema";

export default function QuickCreatePage() {
  const router = useRouter();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<QuickCreateFormData | null>(null);

  const form = useForm<QuickCreateFormData>({
    resolver: zodResolver(quickCreateSchema),
    defaultValues: defaultQuickCreateValues,
    mode: "onChange",
  });

  const { mutate, isPending } = useQuickCreateEvent();

  const handleCreateAnother = () => {
    form.reset(defaultQuickCreateValues);
    setFormSubmitted(false);
    setSubmittedData(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  const handleBackToStart = () => {
    router.push("/landing");
  };

  const onSubmit = (data: QuickCreateFormData) => {
    const payload = createQuickPayload(data);

    mutate(payload, {
      onSuccess: () => {
        setSubmittedData(data);
        setFormSubmitted(true);
        toast(
          <div className="flex items-start gap-3 text-black">
            <CheckCircle className="text-green-500 mt-1" />
            <div>
              <p className="font-semibold">Place created!</p>
              <p className="text-sm">Added as always-open attraction on Go.Do.</p>
            </div>
          </div>
        );
      },
      onError: (error: any) => {
        const message = error?.response?.data?.errors?.[0] || "Please check your input and try again.";
        toast(
          <div className="flex items-start gap-3 text-black">
            <XCircle className="text-red-500 mt-1" />
            <div>
              <p className="font-semibold">Creation failed</p>
              <p className="text-sm">{message}</p>
            </div>
          </div>
        );
      },
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-orange-300 text-black flex flex-col">
      <Navbar />
      <section className="flex-1 flex flex-col items-center px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-black text-white p-2 rounded-lg">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Quick Create</h1>
            <p className="text-sm text-gray-700">Add places & attractions on the go</p>
          </div>
        </div>

        {/* Admin badge */}
        <div className="mb-6 bg-black text-white text-xs px-3 py-1 rounded-full">
          Admin Only
        </div>

        <div className="w-full max-w-2xl">
          {formSubmitted && submittedData ? (
            /* Success State */
            <div className="space-y-6">
              {/* Success Card */}
              <Card className="bg-white border-2 border-green-500 shadow-lg overflow-hidden">
                <div className="bg-green-500 text-white px-6 py-4 flex items-center gap-3">
                  <CheckCircle className="w-8 h-8" />
                  <div>
                    <h2 className="text-xl font-bold">Successfully Added!</h2>
                    <p className="text-sm opacity-90">Place is now live on Go.Do.</p>
                  </div>
                </div>

                <CardContent className="pt-6 space-y-4">
                  {/* Place details */}
                  <div className="space-y-3">
                    {submittedData.name && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                        <p className="text-lg font-semibold">{submittedData.name}</p>
                      </div>
                    )}

                    {(submittedData.place || submittedData.address) && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                        <p className="font-medium">
                          {[submittedData.address, submittedData.place].filter(Boolean).join(", ")}
                        </p>
                      </div>
                    )}

                    {submittedData.organiserName && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Owner</p>
                        <p className="font-medium">{submittedData.organiserName}</p>
                      </div>
                    )}

                    {submittedData.description && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Description</p>
                        <p className="text-sm text-gray-700 line-clamp-3">{submittedData.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Always Open
                    </span>
                    {submittedData.subcategoryCodes && submittedData.subcategoryCodes.length > 0 && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {submittedData.subcategoryCodes.length} categories
                      </span>
                    )}
                    {submittedData.filterCodes && submittedData.filterCodes.length > 0 && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {submittedData.filterCodes.length} filters
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleCreateAnother}
                  className="w-full bg-black text-white hover:bg-black/90 flex items-center justify-center gap-2 h-12"
                >
                  <Plus className="w-5 h-5" />
                  Add Another Place
                </Button>

                <div className="flex gap-3">
                  <Button
                    onClick={handleBackToStart}
                    variant="outline"
                    className="flex-1 border-black/20 hover:bg-white/50 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Start
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Form State */
            <QuickCreateForm form={form} onSubmit={onSubmit} isLoading={isPending} />
          )}
        </div>
      </section>
    </main>
  );
}
