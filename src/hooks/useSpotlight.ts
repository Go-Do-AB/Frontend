import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { OperationResult } from "@/types/events";
import {
  SpotlightPackage,
  SpotlightCheckoutRequest,
  SpotlightCheckoutResponse,
  SpotlightConfirmRequest,
  SpotlightPayment,
} from "@/types/spotlight";

// GET /api/spotlight/packages — public catalogue (no auth required)
export function useSpotlightPackages() {
  return useQuery({
    queryKey: ["spotlight-packages"],
    queryFn: async () => {
      const response =
        await api.get<OperationResult<SpotlightPackage[]>>("/spotlight/packages");
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // catalogue rarely changes
  });
}

// GET /api/spotlight/payments — caller's purchase history
export function useSpotlightPayments(enabled = true) {
  return useQuery({
    queryKey: ["spotlight-payments"],
    queryFn: async () => {
      const response =
        await api.get<OperationResult<SpotlightPayment[]>>("/spotlight/payments");
      return response.data;
    },
    enabled,
  });
}

// POST /api/spotlight/checkout — start a payment (owner only)
export function useSpotlightCheckout() {
  return useMutation({
    mutationFn: async (body: SpotlightCheckoutRequest) => {
      const response = await api.post<OperationResult<SpotlightCheckoutResponse>>(
        "/spotlight/checkout",
        body
      );
      return response.data;
    },
  });
}

// POST /api/spotlight/confirm — mock stand-in for the provider webhook/redirect.
// On success the event's spotlight goes live.
export function useSpotlightConfirm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: SpotlightConfirmRequest) => {
      const response = await api.post<OperationResult<SpotlightPayment>>(
        "/spotlight/confirm",
        body
      );
      return response.data;
    },
    onSuccess: () => {
      // Event spotlight state changed — refresh events + payment history.
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["spotlight-payments"] });
    },
  });
}
