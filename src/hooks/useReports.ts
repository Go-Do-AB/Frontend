import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { OperationResult, ReportedEventSummaryDto } from "@/types/events";

export function useAdminReports() {
  return useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      const response =
        await api.get<OperationResult<ReportedEventSummaryDto[]>>("/admin/reports");
      return response.data;
    },
  });
}

export function useDismissReports() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const response = await api.post<OperationResult<boolean>>(
        `/admin/reports/${eventId}/dismiss`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
    },
  });
}
