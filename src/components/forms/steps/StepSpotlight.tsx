// src/components/forms/steps/StepSpotlight.tsx
import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import type { FormData } from "@/hooks/useEventForm";

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
                      disabled={{ before: (startDate && startDate > nextDay ? startDate : nextDay) }}
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

      {/* Inline summary */}
      {spotlight && startDate && endDate && (
        <p className="text-sm text-muted-foreground">
          Spotlight period:{" "}
          <span className="font-medium">{format(startDate, "dd.MM.yyyy")}</span> →{" "}
          <span className="font-medium">{format(endDate, "dd.MM.yyyy")}</span>
        </p>
      )}
    </div>
  );
}
