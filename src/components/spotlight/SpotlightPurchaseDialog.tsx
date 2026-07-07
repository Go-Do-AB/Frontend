"use client";

import * as React from "react";
import { format } from "date-fns";
import { Sparkles, Loader2, AlertCircle, Calendar as CalendarIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useSpotlightCheckout } from "@/hooks/useSpotlight";
import {
  SPOTLIGHT_PRICE_PER_DAY_SEK,
  SPOTLIGHT_MIN_DAYS,
  SPOTLIGHT_MAX_DAYS,
  formatSek,
  isSpotlightActive,
  isSpotlightScheduled,
} from "@/lib/spotlight";
import type { EventDto } from "@/types/events";

type Step = "configure" | "redirecting" | "error";

// Quick-select durations shown as preset chips (custom input covers the rest).
const PRESET_DAYS = [7, 14, 30];

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("sv-SE");
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: EventDto;
};

export function SpotlightPurchaseDialog({ open, onOpenChange, event }: Props) {
  const [step, setStep] = React.useState<Step>("configure");
  const [days, setDays] = React.useState<number>(7);
  const [daysInput, setDaysInput] = React.useState<string>("7");
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const checkout = useSpotlightCheckout();

  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Reset internal state whenever the dialog is (re)opened.
  React.useEffect(() => {
    if (open) {
      setStep("configure");
      setDays(7);
      setDaysInput("7");
      setStartDate(undefined);
      setErrorMessage("");
      checkout.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const spotlightActive = isSpotlightActive(event);
  const spotlightScheduled = isSpotlightScheduled(event);

  const daysValid =
    Number.isInteger(days) && days >= SPOTLIGHT_MIN_DAYS && days <= SPOTLIGHT_MAX_DAYS;
  const total = daysValid ? days * SPOTLIGHT_PRICE_PER_DAY_SEK : 0;

  const handleDaysInput = (raw: string) => {
    setDaysInput(raw);
    const parsed = Number.parseInt(raw, 10);
    setDays(Number.isNaN(parsed) ? 0 : parsed);
  };

  const selectPreset = (d: number) => {
    setDays(d);
    setDaysInput(String(d));
  };

  const handlePurchase = async () => {
    if (!daysValid || checkout.isPending) return;
    setErrorMessage("");

    try {
      const result = await checkout.mutateAsync({
        eventId: event.id,
        body: {
          days,
          // Omitted = starts today (backend default). Send as ISO date only.
          ...(startDate ? { startDate: format(startDate, "yyyy-MM-dd") } : {}),
        },
      });

      if (!result.isSuccess || !result.data?.checkoutUrl) {
        setErrorMessage(
          result.isForbidden
            ? "Du kan bara lyfta fram evenemang som du själv äger."
            : result.errors?.join(", ") || "Det gick inte att starta betalningen."
        );
        setStep("error");
        return;
      }

      // Hand the browser over to Stripe's hosted checkout page.
      setStep("redirecting");
      window.location.href = result.data.checkoutUrl;
    } catch (err: unknown) {
      // Axios throws on 4xx. Surface the backend's errors[] when present.
      const resp =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { status?: number; data?: { errors?: string[] } } }).response
          : undefined;
      const backendErrors = resp?.data?.errors?.filter(Boolean) ?? [];

      if (resp?.status === 403) {
        setErrorMessage("Du kan bara lyfta fram evenemang som du själv äger.");
      } else if (resp?.status === 404) {
        setErrorMessage("Evenemanget hittades inte eller är inte längre aktivt.");
      } else if (backendErrors.length > 0) {
        setErrorMessage(backendErrors.join(", "));
      } else {
        setErrorMessage("Något gick fel. Försök igen senare.");
      }
      setStep("error");
    }
  };

  const isBusy = checkout.isPending || step === "redirecting";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#F3C10E]" />
            Lyft fram evenemang
          </DialogTitle>
          <DialogDescription>{event.title}</DialogDescription>
        </DialogHeader>

        {/* Already purchased — show the current window. */}
        {step === "configure" && (spotlightActive || spotlightScheduled) && (
          <div className="flex items-start gap-2 rounded-xl border border-[#F3C10E] bg-[#F3C10E]/10 p-3 text-sm">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-yellow-700" />
            <span>
              {spotlightActive ? (
                <>
                  Evenemanget är i spotlight till och med{" "}
                  <span className="font-semibold">{formatDate(event.spotlightEndDate)}</span>.
                </>
              ) : (
                <>
                  Spotlight är bokad{" "}
                  <span className="font-semibold">{formatDate(event.spotlightStartDate)}</span> –{" "}
                  <span className="font-semibold">{formatDate(event.spotlightEndDate)}</span>.
                </>
              )}
            </span>
          </div>
        )}

        {/* STEP 1 — configure duration + start date */}
        {step === "configure" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Välj hur länge ditt evenemang ska visas i spotlight.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {PRESET_DAYS.map((d) => {
                const active = days === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => selectPreset(d)}
                    className={cn(
                      "flex h-16 flex-col items-center justify-center gap-0.5 rounded-xl border text-sm font-medium transition-colors",
                      active
                        ? "border-[#F3C10E] bg-[#F3C10E]/10 ring-1 ring-[#F3C10E]"
                        : "hover:border-[#F3C10E]/60"
                    )}
                  >
                    <span className="text-base font-semibold">{d} dagar</span>
                    <span className="text-xs text-muted-foreground">
                      {formatSek(d * SPOTLIGHT_PRICE_PER_DAY_SEK)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="spotlight-days" className="mb-1 block">
                  Antal dagar
                </Label>
                <Input
                  id="spotlight-days"
                  type="number"
                  min={SPOTLIGHT_MIN_DAYS}
                  max={SPOTLIGHT_MAX_DAYS}
                  step={1}
                  value={daysInput}
                  onChange={(e) => handleDaysInput(e.target.value)}
                />
                {!daysValid && daysInput !== "" && (
                  <p className="mt-1 text-xs text-destructive">
                    Ange mellan {SPOTLIGHT_MIN_DAYS} och {SPOTLIGHT_MAX_DAYS} dagar.
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-1 block">Startdatum (valfritt)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd.MM.yyyy") : "Startar idag"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(d) => setStartDate(d ?? undefined)}
                      disabled={{ before: today }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {startDate && (
                  <button
                    type="button"
                    onClick={() => setStartDate(undefined)}
                    className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                    Rensa — starta idag
                  </button>
                )}
              </div>
            </div>

            {/* Price summary */}
            <div className="rounded-xl border bg-muted/30 p-3 text-sm">
              <div className="flex justify-between">
                <span>
                  {daysValid ? days : "–"} dagar × {formatSek(SPOTLIGHT_PRICE_PER_DAY_SEK)}
                </span>
                <span className="font-semibold">{daysValid ? formatSek(total) : "–"}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Priset är {formatSek(SPOTLIGHT_PRICE_PER_DAY_SEK)} per dag. Du skickas till Stripe
                för säker betalning.
              </p>
            </div>

            <Button className="w-full" disabled={!daysValid || isBusy} onClick={handlePurchase}>
              {isBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isBusy ? "Startar betalning…" : `Betala ${daysValid ? formatSek(total) : ""}`}
            </Button>
          </div>
        )}

        {/* STEP 2 — redirecting to Stripe */}
        {step === "redirecting" && (
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 className="h-8 w-8 animate-spin text-[#F3C10E]" />
            <p className="text-sm text-muted-foreground">Skickar dig till betalningen…</p>
          </div>
        )}

        {/* STEP 3 — error */}
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
              <Button className="flex-1" onClick={() => setStep("configure")}>
                Försök igen
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
