"use client";

import { Controller, Control, FieldErrors, useFormContext } from "react-hook-form";
import { FormData } from "@/hooks/useEventForm";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "../TimePicker";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { format } from "date-fns";
import { X, Info } from "lucide-react";

interface Props {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}

const WEEKDAYS = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
];

const WEEKDAY_LABELS: Record<string, string> = {
  mon: "Måndag", tue: "Tisdag", wed: "Onsdag", thu: "Torsdag",
  fri: "Fredag", sat: "Lördag", sun: "Söndag",
};

function RecurringSummary({
  startDate,
  endDate,
  weekdays,
  scheduleStartTime,
  scheduleEndTime,
}: {
  startDate?: Date;
  endDate?: Date;
  weekdays: string[];
  scheduleStartTime: string;
  scheduleEndTime: string;
}) {
  const hasAnything = startDate || weekdays.length > 0 || scheduleStartTime;
  if (!hasAnything) return null;

  const dayNames = weekdays.map((d) => WEEKDAY_LABELS[d] ?? d).join(", ");
  const dateRange =
    startDate && endDate
      ? `${format(startDate, "dd.MM.yyyy")} → ${format(endDate, "dd.MM.yyyy")}`
      : startDate
        ? `from ${format(startDate, "dd.MM.yyyy")}`
        : null;
  const timeRange =
    scheduleStartTime && scheduleEndTime
      ? `${scheduleStartTime} – ${scheduleEndTime}`
      : scheduleStartTime
        ? `from ${scheduleStartTime}`
        : null;

  return (
    <div className="rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm space-y-1">
      <p className="font-medium text-yellow-800">Sammanfattning</p>
      {dayNames && (
        <p className="text-yellow-900">
          <span className="text-muted-foreground">Varje </span>{dayNames}
        </p>
      )}
      {timeRange && (
        <p className="text-yellow-900">
          <span className="text-muted-foreground">Tid </span>{timeRange}
        </p>
      )}
      {dateRange && (
        <p className="text-yellow-900">
          <span className="text-muted-foreground">Period </span>{dateRange}
        </p>
      )}
    </div>
  );
}

export function StepEventDateTime({ control, errors }: Props) {
  const { setValue, watch } = useFormContext<FormData>();
  const [hasSingleDates, hasMultipleDates, hasSchedule, isAlwaysOpen] = watch([
    "hasSingleDates",
    "hasMultipleDates",
    "hasSchedule",
    "isAlwaysOpen",
  ]);

  const selected = hasSingleDates
    ? "single"
    : hasMultipleDates
      ? "multiple"
      : hasSchedule
        ? "recurring"
        : isAlwaysOpen
          ? "always"
          : "single";

  const handleTimingChange = (value: string) => {
    setValue("hasSingleDates", value === "single");
    setValue("hasMultipleDates", value === "multiple");
    setValue("hasSchedule", value === "recurring");
    setValue("isAlwaysOpen", value === "always");
  };

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const startTime = watch("startTime");
  const scheduleStartTime = watch("scheduleStartTime");
  const singleDates = watch("singleDates") || [];

  const [tempRange, setTempRange] = useState<DateRange | undefined>();
  const [tempStartTime, setTempStartTime] = useState("");
  const [tempEndTime, setTempEndTime] = useState("");

  const [showMultipleHelp, setShowMultipleHelp] = useState(false);
  const [showRecurringHelp, setShowRecurringHelp] = useState(false);

  const handleAddDate = () => {
    if (!tempRange?.from) return;
    setValue("singleDates", [
      ...singleDates,
      {
        startDate: tempRange.from,
        endDate: tempRange.to,
        startTime: tempStartTime,
        endTime: tempEndTime,
      },
    ]);
    setTempRange(undefined);
    setTempStartTime("");
    setTempEndTime("");
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-4 block">Select Timing Type</Label>
        <RadioGroup value={selected} onValueChange={handleTimingChange} className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2 py-2">
            <RadioGroupItem value="single" id="single" />
            <Label htmlFor="single" className="text-base">Single instance</Label>
          </div>
          <div className="flex items-center space-x-2 py-2">
            <RadioGroupItem value="multiple" id="multiple" />
            <Label htmlFor="multiple" className="text-base">Multiple dates</Label>
          </div>
          <div className="flex items-center space-x-2 py-2">
            <RadioGroupItem value="recurring" id="recurring" />
            <Label htmlFor="recurring" className="text-base">Recurring (weekly)</Label>
          </div>
          <div className="flex items-center space-x-2 py-2">
            <RadioGroupItem value="always" id="always" />
            <Label htmlFor="always" className="text-base">Always Open</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Single instance: one date + start/end time */}
      {selected === "single" && (
        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
          <div>
            <Label className="block mb-2">Select date</Label>
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => {
                setValue("startDate", date as Date);
                setValue("endDate", date as Date);
              }}
              className="rounded-md border shadow bg-white"
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
            )}
          </div>
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <TimePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Start"
                label="Start Time"
              />
            )}
          />
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <TimePicker
                value={field.value}
                onChange={field.onChange}
                placeholder="End"
                label="End Time"
                disabledOptions={(opt) => (startTime ? opt <= startTime : false)}
              />
            )}
          />
        </div>
      )}

      {/* Multiple dates */}
      {selected === "multiple" && (
        <>
          <div className="flex items-center gap-1.5">
            <Label>Hur fungerar det?</Label>
            <button
              type="button"
              onClick={() => setShowMultipleHelp((v) => !v)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Visa hjälptext för flera datum"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          {showMultipleHelp && (
            <div className="text-xs text-muted-foreground space-y-1 bg-gray-50 rounded-lg p-3 border">
              <p>Det går att lägga till flera datum för ett inlägg. Gör så här:</p>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>Välj ett datum eller ett datumintervall i kalendern.</li>
                <li>Ange start- och sluttid till höger om kalendern.</li>
                <li>Klicka på <strong>Lägg till datum</strong> för att lägga till datumet i listan.</li>
                <li>Upprepa för fler datum.</li>
                <li>För att ta bort ett datum klickar du på krysset bredvid datumet i listan.</li>
              </ol>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
            <div>
              <Label className="block mb-2">Select date range</Label>
              <Calendar
                mode="range"
                selected={tempRange}
                onSelect={setTempRange}
                className="rounded-md border shadow bg-white"
              />
            </div>
            <TimePicker
              value={tempStartTime}
              onChange={setTempStartTime}
              placeholder="Start"
              label="Start Time"
            />
            <TimePicker
              value={tempEndTime}
              onChange={setTempEndTime}
              placeholder="End"
              label="End Time"
              disabledOptions={(opt) => {
                if (
                  tempRange?.from &&
                  tempRange?.to &&
                  tempRange.from.toDateString() === tempRange.to.toDateString() &&
                  tempStartTime
                ) {
                  return opt <= tempStartTime;
                }
                return false;
              }}
            />
          </div>

          <Button
            type="button"
            onClick={handleAddDate}
            disabled={!tempRange?.from}
            className="bg-yellow-500 hover:bg-yellow-400 text-black"
          >
            Lägg till datum
          </Button>

          {singleDates.length > 0 && (
            <div className="space-y-2">
              <Label>Valda datum ({singleDates.length})</Label>
              {singleDates.map((sd, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 p-3 border rounded-lg bg-gray-50 text-sm"
                >
                  <span className="font-medium">
                    {format(sd.startDate, "dd.MM.yyyy")}
                    {sd.endDate && sd.endDate.toDateString() !== sd.startDate.toDateString()
                      ? ` → ${format(sd.endDate, "dd.MM.yyyy")}`
                      : ""}
                  </span>
                  <span className="text-muted-foreground">
                    {sd.startTime || "—"} – {sd.endTime || "—"}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() =>
                      setValue(
                        "singleDates",
                        singleDates.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Recurring weekly */}
      {selected === "recurring" && (
        <>
          <div className="flex items-center gap-1.5">
            <Label>Hur fungerar det?</Label>
            <button
              type="button"
              onClick={() => setShowRecurringHelp((v) => !v)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Visa hjälptext för återkommande evenemang"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          {showRecurringHelp && (
            <div className="text-xs text-muted-foreground space-y-1 bg-gray-50 rounded-lg p-3 border">
              <p>Återkommande evenemang visas varje vald veckodag under den valda perioden. Gör så här:</p>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>Välj start- och slutdatum för perioden i kalendern.</li>
                <li>Ange start- och sluttid för varje tillfälle.</li>
                <li>Välj vilka veckodagar evenemanget äger rum.</li>
              </ol>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
            <div>
              <Label className="block mb-2">Select date range</Label>
              <Calendar
                mode="range"
                selected={{ from: startDate, to: endDate }}
                onSelect={(range) => {
                  setValue("startDate", range?.from as Date);
                  setValue("endDate", range?.to as Date);
                }}
                className="rounded-md border shadow bg-white"
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
              )}
            </div>
            <Controller
              name="scheduleStartTime"
              control={control}
              render={({ field }) => (
                <TimePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Start"
                  label="Start Time"
                />
              )}
            />
            <Controller
              name="scheduleEndTime"
              control={control}
              render={({ field }) => (
                <TimePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="End"
                  label="End Time"
                  disabledOptions={(opt) => (scheduleStartTime ? opt <= scheduleStartTime : false)}
                />
              )}
            />
          </div>

          <Controller
            name="weekdays"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Veckodagar</Label>
                <ToggleGroup
                  type="multiple"
                  className="grid grid-cols-7 gap-2"
                  onValueChange={field.onChange}
                  value={field.value || []}
                >
                  {WEEKDAYS.map(({ value, label }) => (
                    <ToggleGroupItem
                      key={value}
                      value={value}
                      className="data-[state=on]:bg-yellow-500 data-[state=on]:text-white"
                    >
                      {label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            )}
          />

          <RecurringSummary
            startDate={startDate}
            endDate={endDate}
            weekdays={watch("weekdays") || []}
            scheduleStartTime={scheduleStartTime || ""}
            scheduleEndTime={watch("scheduleEndTime") || ""}
          />
        </>
      )}

      {/* Always Open */}
      {selected === "always" && (
        <p className="text-muted-foreground italic">This event will be listed as always open.</p>
      )}

      <p className="text-xs text-muted-foreground italic">* Not all fields above are required</p>
    </div>
  );
}
