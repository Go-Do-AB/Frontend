// Shared spotlight pricing + helpers.
// Keep ALL spotlight price knowledge in this file — components must import from here.

import type { EventDto } from "@/types/events";

// PLACEHOLDER PRICE: 99 SEK/day is pending product-owner confirmation.
// The authoritative price lives in the backend Stripe checkout — this constant
// is display-only and must be kept in sync with it.
export const SPOTLIGHT_PRICE_PER_DAY_SEK = 99;

// Allowed purchase duration (mirrors backend validation: days 1–90).
export const SPOTLIGHT_MIN_DAYS = 1;
export const SPOTLIGHT_MAX_DAYS = 90;

// Formats whole-SEK amounts, e.g. "693 kr".
export const formatSek = (amount: number) =>
  new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(amount);

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
