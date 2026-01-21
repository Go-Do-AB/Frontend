import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { QuickCreateEventDto } from "@/types/events";

export function useQuickCreateEvent() {
  return useMutation({
    mutationFn: async (data: QuickCreateEventDto) => {
      const response = await api.post("/events/quick", data);
      return response.data;
    },
  });
}
