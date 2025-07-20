import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"), // ISO string expected
  endDate: z.string().min(1, "End date is required"),
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;
