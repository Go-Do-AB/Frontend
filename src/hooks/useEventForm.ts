import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateEventDto } from "@/types/events";
import { toLocalISOString, combineDateTime } from "@/lib/utils";

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.date().refine((d) => d instanceof Date, {
    message: "Start date is required",
  }),
  endDate: z.date().refine((d) => d instanceof Date, {
    message: "End date is required",
  }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

export type FormData = z.infer<typeof createEventSchema>;

const defaultFormValues: FormData = {
  title: "",
  description: "",
  location: "",
  startDate: undefined as unknown as Date, // cast for initial empty state
  endDate: undefined as unknown as Date,
  startTime: "",
  endTime: "",
};

// ✅ Consider moving step-specific components like StepDetails into their own files now that this form hook is clean and ready.
export function useEventForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: defaultFormValues,
  });

  const createPayload = (data: FormData): CreateEventDto => {
    return {
      title: data.title,
      description: data.description,
      location: data.location,
      startDate: toLocalISOString(combineDateTime(data.startDate, data.startTime)),
      endDate: toLocalISOString(combineDateTime(data.endDate, data.endTime)),
    };
  };

  return {
    ...form,
    createPayload,
  };
}
