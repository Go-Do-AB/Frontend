import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import {
  EventDto,
  EventFilterDto,
  UpdateEventDto,
  PatchEventDto,
  PagedResult,
  OperationResult,
} from "@/types/events";

// Fetch events with optional filters
export function useEvents(filter?: EventFilterDto) {
  return useQuery({
    queryKey: ["events", filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter?.isActive !== undefined) params.append("isActive", String(filter.isActive));
      if (filter?.fromDate) params.append("fromDate", filter.fromDate);
      if (filter?.toDate) params.append("toDate", filter.toDate);
      if (filter?.city) params.append("city", filter.city);
      if (filter?.organisationNumber)
        params.append("organisationNumber", filter.organisationNumber);
      if (filter?.createdById) params.append("createdById", filter.createdById);
      if (filter?.categoryCodes?.length)
        params.append("categoryCodes", filter.categoryCodes.join(","));
      if (filter?.subcategoryCodes?.length)
        params.append("subcategoryCodes", filter.subcategoryCodes.join(","));
      if (filter?.tagCodes?.length) params.append("tagCodes", filter.tagCodes.join(","));
      if (filter?.pageNumber) params.append("pageNumber", String(filter.pageNumber));
      if (filter?.pageSize) params.append("pageSize", String(filter.pageSize));

      const response = await api.get<OperationResult<PagedResult<EventDto>>>(
        `/events?${params.toString()}`
      );
      return response.data;
    },
  });
}

// Fetch a single event by ID
export function useEvent(id: string | null) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const response = await api.get<OperationResult<EventDto>>(`/events/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Update an event (full update)
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEventDto }) => {
      const response = await api.put<OperationResult<EventDto>>(`/events/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

// Patch an event (partial update)
export function usePatchEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PatchEventDto }) => {
      const response = await api.patch<OperationResult<EventDto>>(`/events/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

// Delete an event (soft delete - sets IsActive = false)
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<OperationResult<boolean>>(`/events/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    retry: false, // Disable retry to prevent double-delete attempts
  });
}
