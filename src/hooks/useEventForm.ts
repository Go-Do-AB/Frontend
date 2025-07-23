import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEventSchema,
  createPayload,
  defaultFormValues,
} from "@/lib/validation/create-event-schema";

export type FormData = z.infer<typeof createEventSchema>;

export function useEventForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: defaultFormValues,
  });

  return {
    ...form,
    createPayload,
  };
}
