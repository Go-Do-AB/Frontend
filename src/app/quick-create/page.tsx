"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Zap,
  LogOut,
  Plus,
  ArrowLeft,
  ShieldX,
  Loader2,
} from "lucide-react";

import { Navbar } from "@/components/global/Navbar";
import { QuickCreateForm } from "@/components/forms/QuickCreateForm";
import { useQuickCreateEvent } from "@/hooks/useQuickCreateEvent";
import { Button } from "@/components/ui/button";
import { getStoredJwtPayload, getRolesFromPayload } from "@/lib/jwt";
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
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const payload = getStoredJwtPayload();
    setIsAdmin(payload ? getRolesFromPayload(payload).includes("Admin") : false);
  }, []);

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
              <p className="font-semibold">Platsen skapades!</p>
              <p className="text-sm">Tillagd som alltid öppen attraktion på Go.Do.</p>
            </div>
          </div>
        );
      },
      onError: (error: unknown) => {
        const axiosError = error as { response?: { data?: { errors?: string[] } } };
        const message =
          axiosError?.response?.data?.errors?.[0] || "Kontrollera dina uppgifter och försök igen.";
        toast(
          <div className="flex items-start gap-3 text-black">
            <XCircle className="text-red-500 mt-1" />
            <div>
              <p className="font-semibold">Det gick inte att skapa platsen</p>
              <p className="text-sm">{message}</p>
            </div>
          </div>
        );
      },
    });
  };

  // Loading state
  if (isAdmin === null) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-orange-300 text-black flex flex-col">
        <Navbar />
        <section className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p>Kontrollerar behörigheter...</p>
          </div>
        </section>
      </main>
    );
  }

  // Access denied for non-admins
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-orange-300 text-black flex flex-col">
        <Navbar />
        <section className="flex-1 flex items-center justify-center">
          <Card className="max-w-md bg-white shadow-lg">
            <CardContent className="pt-6 text-center space-y-4">
              <ShieldX className="w-16 h-16 text-red-500 mx-auto" />
              <h2 className="text-2xl font-bold">Åtkomst nekad</h2>
              <p className="text-gray-600">
                Den här sidan är endast tillgänglig för administratörer.
              </p>
              <Button
                onClick={() => router.push("/landing")}
                className="w-full bg-black text-white hover:bg-black/90"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Tillbaka till startsidan
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

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
            <h1 className="text-3xl font-bold">Snabbskapa</h1>
            <p className="text-sm text-gray-700">Lägg till platser och attraktioner snabbt</p>
          </div>
        </div>

        {/* Admin badge */}
        <div className="mb-6 bg-black text-white text-xs px-3 py-1 rounded-full">Endast admin</div>

        <div className="w-full max-w-2xl">
          {formSubmitted && submittedData ? (
            /* Success State */
            <div className="space-y-6">
              {/* Success Card */}
              <Card className="bg-white border-2 border-green-500 shadow-lg overflow-hidden">
                <div className="bg-green-500 text-white px-6 py-4 flex items-center gap-3">
                  <CheckCircle className="w-8 h-8" />
                  <div>
                    <h2 className="text-xl font-bold">Tillagd!</h2>
                    <p className="text-sm opacity-90">Platsen är nu live på Go.Do.</p>
                  </div>
                </div>

                <CardContent className="pt-6 space-y-4">
                  {/* Place details */}
                  <div className="space-y-3">
                    {submittedData.name && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Namn</p>
                        <p className="text-lg font-semibold">{submittedData.name}</p>
                      </div>
                    )}

                    {(submittedData.place || submittedData.address) && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Plats</p>
                        <p className="font-medium">
                          {[submittedData.address, submittedData.place].filter(Boolean).join(", ")}
                        </p>
                      </div>
                    )}

                    {submittedData.organiserName && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Ägare</p>
                        <p className="font-medium">{submittedData.organiserName}</p>
                      </div>
                    )}

                    {submittedData.description && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Beskrivning</p>
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {submittedData.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Alltid öppet
                    </span>
                    {submittedData.subcategoryCodes &&
                      submittedData.subcategoryCodes.length > 0 && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {submittedData.subcategoryCodes.length} kategorier
                        </span>
                      )}
                    {submittedData.filterCodes && submittedData.filterCodes.length > 0 && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {submittedData.filterCodes.length} filter
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
                  Lägg till en till plats
                </Button>

                <div className="flex gap-3">
                  <Button
                    onClick={handleBackToStart}
                    variant="outline"
                    className="flex-1 border-black/20 hover:bg-white/50 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Tillbaka till start
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logga ut
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
