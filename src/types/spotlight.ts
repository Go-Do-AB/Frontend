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

// GET /api/spotlight/pricing — per-day price with VAT breakdown.
// dailyPriceGross is what Stripe actually charges (net + Swedish MOMS).
export type SpotlightPricing = {
  currency: string; // e.g. "sek"
  dailyPriceNet: number; // 99.00 — excl. VAT
  vatRatePercent: number; // 25
  dailyVatAmount: number; // 24.75
  dailyPriceGross: number; // 123.75 — incl. VAT
};
