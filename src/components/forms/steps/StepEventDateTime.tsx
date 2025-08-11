"use client";

import { Controller, Control, FieldErrors, useFormContext } from "react-hook-form";
import { FormData } from "@/hooks/useEventForm";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "../TimePicker";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Props {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}

export function StepEventDateTime({ control, errors }: Props) {
  const { setValue, watch } = useFormContext<FormData>();
  const timingType = watch(["hasSingleDates", "hasSchedule", "isAlwaysOpen"]);

  // Determine selected type
  const selected = timingType[0] ? "single" : timingType[1] ? "recurring" : "always";

  const handleTimingChange = (value: string) => {
    setValue("hasSingleDates", value === "single");
    setValue("hasSchedule", value === "recurring");
    setValue("isAlwaysOpen", value === "always");
  };

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const startTime = watch("startTime");

  useEffect(() => {
    // Default to single if nothing is set
    if (!timingType.includes(true)) {
      setValue("hasSingleDates", true);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-4  block">Select Timing Type</Label>
        <RadioGroup value={selected} onValueChange={handleTimingChange} className="flex gap-6">
          <div className="flex items-center space-x-2 py-2">
            <RadioGroupItem value="single" id="single" />
            <Label htmlFor="single" className="text-base">
              Single date/time
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="recurring" id="recurring" />
            <Label htmlFor="recurring" className="text-base">
              Scheduled (recurring)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="always" id="always" />
            <Label htmlFor="always" className="text-base">
              Always Open
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Single Date/Time */}
      {selected === "single" && (
        <>
          <div>
            <Label className="block mb-2">Start</Label>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    className="rounded-md border shadow bg-white"
                    disabled={(date) => (watch("endDate") ? date > watch("endDate")! : false)}
                  />
                )}
              />
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Start with"
                    label="Start Time"
                  />
                )}
              />
            </div>
            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
          </div>

          <div>
            <Label className="block mb-2">End</Label>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    className="rounded-md border shadow bg-white"
                    disabled={(date) => (watch("startDate") ? date < watch("startDate")! : false)}
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
                    placeholder="End with"
                    label="End Time"
                    disabledOptions={(opt) => {
                      if (
                        startDate &&
                        endDate &&
                        startDate.toDateString() === endDate.toDateString() &&
                        startTime
                      ) {
                        return opt < startTime;
                      }
                      return false; // default to not disabled
                    }}
                  />
                )}
              />
            </div>
            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
          </div>
        </>
      )}

      {/* Recurring Schedule */}
      {selected === "recurring" && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
            {/* Recurrence Start Date */}
            <div className="flex-1">
              <Label className="mb-1">Recurrence Start Date</Label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    className="rounded-md border shadow bg-white"
                    disabled={(date) => (watch("endDate") ? date < watch("endDate")! : false)}
                  />
                )}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">{errors.startDate.message}</p>
              )}
            </div>

            {/* Recurrence End Date */}
            <div className="flex-1">
              <Label className="mb-1">Recurrence End Date (optional)</Label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    className="rounded-md border shadow bg-white"
                    disabled={(date) => (watch("startDate") ? date < watch("startDate")! : false)}
                  />
                )}
              />
              {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
            </div>
          </div>

          <div>
            <Controller
              name="weekday"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Recurring Weekday</Label>
                  <ToggleGroup
                    type="single"
                    className="grid grid-cols-7 gap-2"
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <ToggleGroupItem
                      value="mon"
                      className="data-[state=on]:bg-yellow-500 data-[state=on]:text-white"
                    >
                      Mon
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="tue"
                      className="data-[state=on]:bg-yellow-500 data-[state=on]:text-white"
                    >
                      Tue
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="wed"
                      className="data-[state=on]:bg-yellow-500 data-[state=on]:text-white"
                    >
                      Wed
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="thu"
                      className="data-[state=on]:bg-yellow-500 data-[state=on]:text-white"
                    >
                      Thu
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="fri"
                      className="data-[state=on]:bg-yellow-500 data-[state=on]:text-white"
                    >
                      Fri
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="sat"
                      className="data-[state=on]:bg-yellow-500 data-[state=on]:text-white"
                    >
                      Sat
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="sun"
                      className="data-[state=on]:bg-yellow-500 data-[state=on]:text-white"
                    >
                      Sun
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              )}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-4">
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
                  disabledOptions={(opt) => {
                    if (
                      startDate &&
                      endDate &&
                      startDate.toDateString() === endDate.toDateString() &&
                      startTime
                    ) {
                      return opt < startTime;
                    }
                    return false; // default to not disabled
                  }}
                />
              )}
            />
          </div>

          <div>
            <Controller
              name="recurrence"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Recurrence</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select recurrence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Does not repeat</SelectItem>
                      <SelectItem value="weekdays">Every weekday (Mon - Fri)</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>
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
