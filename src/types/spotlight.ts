// Types for the Spotlight placement purchase flow.
// Mirrors the Backend /api/spotlight contract (all responses wrapped in OperationResult<T>).

// Payment providers shown in the UI. "mock" is the auto-approving gateway used
// while real Stripe/Klarna/Swish integrations are pending.
export type SpotlightProvider = "stripe" | "klarna" | "swish" | "mock";

// GET /api/spotlight/packages
export type SpotlightPackage = {
  code: string; // e.g. "spotlight_7"
  name: string;
  durationDays: number;
  amount: number;
  currency: string; // e.g. "SEK"
};

// POST /api/spotlight/checkout — request body
export type SpotlightCheckoutRequest = {
  eventId: string; // guid
  packageCode: string;
  provider: SpotlightProvider;
};

// POST /api/spotlight/checkout — response data
export type SpotlightCheckoutResponse = {
  paymentId: string;
  provider: string;
  status: string;
  amount: number;
  currency: string;
  checkoutUrl: string | null;
  providerReference: string | null;
};

// POST /api/spotlight/confirm — request body
export type SpotlightConfirmRequest = {
  paymentId: string;
};

// SpotlightPayment — returned by /confirm and /payments
export type SpotlightPayment = {
  id: string;
  eventId: string;
  packageCode: string;
  durationDays: number;
  amount: number;
  currency: string;
  provider: string;
  status: string;
  spotlightStartDate: string;
  spotlightEndDate: string;
  createdAt: string;
  completedAt: string | null;
};
