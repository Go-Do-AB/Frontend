import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { OperationResult } from "@/types/events";
import {
  SpotlightCheckoutRequest,
  SpotlightCheckoutResponse,
  SpotlightPricing,
} from "@/types/spotlight";

// GET /api/spotlight/pricing — per-day price + VAT breakdown (anonymous).
// Pricing changes rarely, so cache it aggressively. Components fall back to
// the SPOTLIGHT_* constants in lib/spotlight while this is loading.
export function useSpotlightPricing() {
  return useQuery({
    queryKey: ["spotlight-pricing"],
    queryFn: async () => {
      const response = await api.get<OperationResult<SpotlightPricing>>("/spotlight/pricing");
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60, // 1h
  });
}

// POST /api/events/{eventId}/spotlight/checkout — start a Stripe Checkout
// session for the event (owner only). On success redirect the browser to
// data.checkoutUrl. Payment confirmation is webhook-driven server-side;
// Stripe sends the browser back to /spotlight/success or /spotlight/cancel.
export function useSpotlightCheckout() {
  return useMutation({
    mutationFn: async ({
      eventId,
      body,
    }: {
      eventId: string;
      body: SpotlightCheckoutRequest;
    }) => {
      const response = await api.post<OperationResult<SpotlightCheckoutResponse>>(
        `/events/${eventId}/spotlight/checkout`,
        body
      );
      return response.data;
    },
    retry: false, // never retry — each call creates a new Stripe session
  });
}
