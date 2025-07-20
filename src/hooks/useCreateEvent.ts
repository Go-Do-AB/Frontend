import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { CreateEventDto } from "@/types/events";

export function useCreateEvent() {
  return useMutation({
    mutationFn: async (data: CreateEventDto) => {
      const response = await api.post("/events", data); // Adjust if your route is different
      return response.data;
    },
  });
}
