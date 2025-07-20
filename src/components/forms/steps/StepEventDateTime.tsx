import { Controller, Control, FieldErrors } from "react-hook-form";
import { FormData } from "@/hooks/useEventForm";
import { TimePicker } from "../TimePicker";
import { Calendar } from "@/components/ui/calendar";

interface StepEventDateTimeProps {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}

export function StepEventDateTime({ control, errors }: StepEventDateTimeProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Start</label>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
          <div className="w-full sm:w-auto">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  className="rounded-md border shadow bg-white"
                />
              )}
            />
            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
          </div>
          <div className="flex-1 flex items-center h-full">
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
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">End</label>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
          <div className="w-full sm:w-auto">
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  className="rounded-md border shadow bg-white"
                />
              )}
            />
            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
          </div>
          <div className="flex-1 flex items-center h-full">
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <TimePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="End with"
                  label="End Time"
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
