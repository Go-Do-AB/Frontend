// src/components/forms/steps/StepSpotlight.tsx
import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";


import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import type { FormData } from "@/hooks/useEventForm";

const PRICE_PER_DAY = 99; //price
const VAT_FLAT = 125;     // moms in SEK 

export function StepSpotlight() {
  const { control, watch, setValue, clearErrors } = useFormContext<FormData>();
  const spotlight = watch("spotlight");
  const startDate = watch("spotlightStartDate");
  const endDate = watch("spotlightEndDate");

  // Ensure spotlight defaults to TRUE if undefined for any reason
  React.useEffect(() => {
    if (typeof spotlight === "undefined") {
      setValue("spotlight", true, { shouldDirty: false, shouldValidate: false });
    }
  }, [spotlight, setValue]);

  // When spotlight is turned OFF, clear dates + errors
  React.useEffect(() => {
    if (spotlight === false) {
      setValue("spotlightStartDate", undefined, { shouldValidate: true, shouldDirty: true });
      setValue("spotlightEndDate", undefined, { shouldValidate: true, shouldDirty: true });
      clearErrors(["spotlightStartDate", "spotlightEndDate"]);
    }
  }, [spotlight, setValue, clearErrors]);

  const nextDay = React.useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // tomorrow
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  
  // Counts price inkl. start + end (same date = 1 day)
  const days = React.useMemo(() => {
    if (!startDate || !endDate) return 0;
    return Math.max(1, differenceInCalendarDays(endDate, startDate) + 1);
  }, [startDate, endDate]);

  // part of price and total inkl. “moms”
  const subtotal = days * PRICE_PER_DAY;
  const vat = days > 0 ? VAT_FLAT : 0;
  const total = days > 0 ? subtotal + vat : 0;

  // Format fur SEK without öre
  const fmt = React.useMemo(
    () => new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }),
    []
  );

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex items-center justify-between border rounded-2xl p-4">
        <div>
          <Label className="font-medium">Spotlight</Label>
          <p className="text-sm text-muted-foreground">
            Promote this event in spotlight. Toggle off to skip spotlight settings.
          </p>
        </div>
        <input
          type="checkbox"
          className="w-5 h-5 accent-yellow-500 cursor-pointer"
          checked={!!spotlight}
          onChange={(e) =>
            setValue("spotlight", e.target.checked, { shouldDirty: true, shouldValidate: true })
          }
        />
      </div>

      {/* Date pickers */}
      {spotlight && (
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Start Date */}
          <Controller
            control={control}
            name="spotlightStartDate"
            render={({ field, fieldState }) => (
              <div>
                <Label className="block mb-1">Spotlight start date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "dd.MM.yyyy") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={(d) => field.onChange(d ?? null)}
                      disabled={{ before: nextDay }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.error && (fieldState.isTouched || fieldState.isDirty) && (
                  <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />

          {/* End Date */}
          <Controller
            control={control}
            name="spotlightEndDate"
            render={({ field, fieldState }) => (
              <div>
                <Label className="block mb-1">Spotlight end date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={!spotlight}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "dd.MM.yyyy") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={(d) => field.onChange(d ?? null)}
                      disabled={{ before: startDate && startDate > nextDay ? startDate : nextDay }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.error && (fieldState.isTouched || fieldState.isDirty) && (
                  <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </div>
      )}

{/* Inline summary + cost */}
{spotlight && startDate && endDate && (
  <>
    <p className="text-sm text-muted-foreground">
      Spotlight period:{" "}
      <span className="font-medium">{format(startDate, "dd.MM.yyyy")}</span>{" "}
      {"\u2192"}{" "}
      <span className="font-medium">{format(endDate, "dd.MM.yyyy")}</span>
    </p>

    <div className="rounded-2xl border p-4 bg-muted/30">
      <div className="text-sm">
        <div className="flex justify-between">
          <span>{days} days × 99 kr</span>
          <span className="font-medium">{fmt.format(subtotal)}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>VAT (included)</span>
          <span className="font-medium">{fmt.format(vat)}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between text-base">
          <span className="font-semibold">Total (incl. VAT)</span>
          <span className="font-semibold">{fmt.format(total)}</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        The price is 99 SEK per day plus 125 SEK VAT. VAT is included in the total
      </p>
    </div>
  </>
)}
</div>
);
}

