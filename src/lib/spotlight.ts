// Shared spotlight pricing + helpers.
// Keep ALL spotlight price knowledge in this file — components must import from here.

import type { EventDto } from "@/types/events";

// FALLBACK PRICE: 99 SEK/day (ex-VAT). The authoritative price + VAT now come
// from the backend (GET /api/spotlight/pricing via useSpotlightPricing); these
// constants are only used while that request is loading or if it fails.
export const SPOTLIGHT_PRICE_PER_DAY_SEK = 99;
export const SPOTLIGHT_VAT_RATE_PERCENT = 25;

// Allowed purchase duration (mirrors backend validation: days 1–90).
export const SPOTLIGHT_MIN_DAYS = 1;
export const SPOTLIGHT_MAX_DAYS = 90;

// Formats SEK amounts. Defaults to whole SEK ("693 kr"); pass { decimals: 2 }
// for VAT/gross figures that aren't round ("123,75 kr").
export const formatSek = (amount: number, opts?: { decimals?: number }) => {
  const decimals = opts?.decimals ?? 0;
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

type SpotlightFields = Pick<EventDto, "spotlight" | "spotlightStartDate" | "spotlightEndDate">;

// An event is "in the spotlight" when it's flagged, the window has started
// (or has no start date) and the window hasn't ended.
export function isSpotlightActive(event: SpotlightFields): boolean {
  if (!event.spotlight || !event.spotlightEndDate) return false;
  const now = new Date();
  if (new Date(event.spotlightEndDate) < now) return false;
  if (event.spotlightStartDate && new Date(event.spotlightStartDate) > now) return false;
  return true;
}

// Purchased but the window hasn't started yet.
export function isSpotlightScheduled(event: SpotlightFields): boolean {
  if (!event.spotlight || !event.spotlightStartDate || !event.spotlightEndDate) return false;
  const now = new Date();
  return new Date(event.spotlightStartDate) > now && new Date(event.spotlightEndDate) >= now;
}
