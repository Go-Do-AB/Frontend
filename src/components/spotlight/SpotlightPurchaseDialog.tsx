"use client";

import * as React from "react";
import { toast } from "sonner";
import { Sparkles, Loader2, Check, CreditCard, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  useSpotlightPackages,
  useSpotlightCheckout,
  useSpotlightConfirm,
} from "@/hooks/useSpotlight";
import type { SpotlightPackage, SpotlightProvider } from "@/types/spotlight";

type Step = "package" | "method" | "processing" | "success" | "error";

// The real providers we'll wire later. Payments are simulated for now (mock gateway).
const PROVIDERS: { id: SpotlightProvider; label: string }[] = [
  { id: "stripe", label: "Stripe" },
  { id: "klarna", label: "Klarna" },
  { id: "swish", label: "Swish" },
];

const sek = (amount: number, currency: string) =>
  new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: currency || "SEK",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("sv-SE");
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventTitle: string;
};

export function SpotlightPurchaseDialog({ open, onOpenChange, eventId, eventTitle }: Props) {
  const [step, setStep] = React.useState<Step>("package");
  const [selectedPackage, setSelectedPackage] = React.useState<SpotlightPackage | null>(null);
  const [provider, setProvider] = React.useState<SpotlightProvider>("stripe");
  const [endDate, setEndDate] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const { data: packagesResult, isLoading: isLoadingPackages } = useSpotlightPackages();
  const checkout = useSpotlightCheckout();
  const confirm = useSpotlightConfirm();

  const packages = packagesResult?.data ?? [];

  // Reset internal state whenever the dialog is (re)opened.
  React.useEffect(() => {
    if (open) {
      setStep("package");
      setSelectedPackage(null);
      setProvider("stripe");
      setEndDate(null);
      setErrorMessage("");
    }
  }, [open]);

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    setStep("processing");
    setErrorMessage("");

    try {
      // 1) Start checkout (owner-only).
      const checkoutResult = await checkout.mutateAsync({
        eventId,
        packageCode: selectedPackage.code,
        provider,
      });

      if (!checkoutResult.isSuccess) {
        setErrorMessage(
          checkoutResult.isForbidden
            ? "Du kan bara lyfta fram evenemang som du själv äger."
            : checkoutResult.errors?.[0] || "Det gick inte att starta betalningen."
        );
        setStep("error");
        return;
      }

      // 2) Immediately confirm — the mock gateway auto-approves (stands in for the
      //    provider webhook/redirect-return). On success the spotlight goes live.
      const confirmResult = await confirm.mutateAsync({
        paymentId: checkoutResult.data.paymentId,
      });

      if (!confirmResult.isSuccess) {
        setErrorMessage(confirmResult.errors?.[0] || "Det gick inte att bekräfta betalningen.");
        setStep("error");
        return;
      }

      setEndDate(confirmResult.data.spotlightEndDate);
      setStep("success");
      toast.success("Ditt evenemang är nu i spotlight");
    } catch (err: unknown) {
      // Axios throws on 4xx (e.g. 403 for non-owners).
      const status =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;
      setErrorMessage(
        status === 403
          ? "Du kan bara lyfta fram evenemang som du själv äger."
          : "Något gick fel. Försök igen senare."
      );
      setStep("error");
    }
  };

  const isProcessing = step === "processing";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#F3C10E]" />
            Lyft fram evenemang
          </DialogTitle>
          <DialogDescription>{eventTitle}</DialogDescription>
        </DialogHeader>

        {/* STEP 1 — choose a package */}
        {step === "package" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Välj hur länge ditt evenemang ska visas i spotlight.
            </p>

            {isLoadingPackages && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}

            {!isLoadingPackages && packages.length === 0 && (
              <p className="text-sm text-destructive">
                Det gick inte att hämta paket. Försök igen.
              </p>
            )}

            <div className="space-y-2">
              {packages.map((pkg) => {
                const active = selectedPackage?.code === pkg.code;
                return (
                  <button
                    key={pkg.code}
                    type="button"
                    onClick={() => setSelectedPackage(pkg)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors",
                      active
                        ? "border-[#F3C10E] bg-[#F3C10E]/10 ring-1 ring-[#F3C10E]"
                        : "hover:border-[#F3C10E]/60"
                    )}
                  >
                    <div>
                      <p className="font-medium">{pkg.name}</p>
                      <p className="text-sm text-muted-foreground">{pkg.durationDays} dagar</p>
                    </div>
                    <span className="text-base font-semibold">
                      {sek(pkg.amount, pkg.currency)}
                    </span>
                  </button>
                );
              })}
            </div>

            <Button
              className="w-full"
              disabled={!selectedPackage}
              onClick={() => setStep("method")}
            >
              Fortsätt
            </Button>
          </div>
        )}

        {/* STEP 2 — choose a payment method */}
        {step === "method" && selectedPackage && (
          <div className="space-y-4">
            <div className="rounded-xl border bg-muted/30 p-3 text-sm">
              <div className="flex justify-between">
                <span>{selectedPackage.name}</span>
                <span className="font-medium">
                  {sek(selectedPackage.amount, selectedPackage.currency)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {selectedPackage.durationDays} dagar i spotlight
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Välj betalsätt</p>
              <div className="grid grid-cols-3 gap-2">
                {PROVIDERS.map((p) => {
                  const active = provider === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProvider(p.id)}
                      className={cn(
                        "flex h-16 flex-col items-center justify-center gap-1 rounded-xl border text-sm font-medium transition-colors",
                        active
                          ? "border-[#F3C10E] bg-[#F3C10E]/10 ring-1 ring-[#F3C10E]"
                          : "hover:border-[#F3C10E]/60"
                      )}
                    >
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Honest note: payments are simulated for now. */}
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <span className="font-semibold">Demo / testläge.</span> Betalningar simuleras just
                nu — inga riktiga pengar dras. Riktig betalning kopplas på senare.
              </span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep("package")}>
                Tillbaka
              </Button>
              <Button className="flex-1" onClick={handlePurchase}>
                Betala {sek(selectedPackage.amount, selectedPackage.currency)}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 — processing */}
        {isProcessing && (
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 className="h-8 w-8 animate-spin text-[#F3C10E]" />
            <p className="text-sm text-muted-foreground">Behandlar betalningen…</p>
          </div>
        )}

        {/* STEP 4 — success */}
        {step === "success" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <p className="font-medium">Betalningen lyckades</p>
            <p className="text-sm text-muted-foreground">
              Ditt evenemang är nu i spotlight till och med{" "}
              <span className="font-medium text-foreground">{formatDate(endDate)}</span>.
            </p>
            <Button className="mt-2 w-full" onClick={() => onOpenChange(false)}>
              Klar
            </Button>
          </div>
        )}

        {/* STEP 5 — error */}
        {step === "error" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <p className="font-medium">Något gick fel</p>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
            <div className="mt-2 flex w-full gap-2">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Stäng
              </Button>
              <Button className="flex-1" onClick={() => setStep("package")}>
                Försök igen
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
