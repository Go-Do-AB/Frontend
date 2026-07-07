// Types for the Spotlight placement purchase flow (Stripe Checkout).
// Mirrors the Backend POST /api/events/{eventId}/spotlight/checkout contract
// (responses wrapped in OperationResult<T>).

// POST /api/events/{eventId}/spotlight/checkout — request body
export type SpotlightCheckoutRequest = {
  days: number; // 1–90
  startDate?: string; // ISO date; omitted = starts today; must not be in the past
};

// POST /api/events/{eventId}/spotlight/checkout — response data
export type SpotlightCheckoutResponse = {
  checkoutUrl: string; // Stripe-hosted checkout page — redirect the browser here
  sessionId: string; // Stripe Checkout session id (cs_...)
};
