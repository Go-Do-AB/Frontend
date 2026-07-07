// Quick-create DTO for Admin endpoint - all fields optional
export type QuickCreateEventDto = {
  organisationNumber?: string;
  name?: string; // Maps to Title
  organiserName?: string; // Maps to Organiser
  place?: string; // Maps to City
  address?: string; // Maps to StreetName
  gpsCoordinates?: string;
  description?: string;
  subcategoryCodes?: number[];
  filterCodes?: number[]; // Tag codes (1001-1006)
  readMoreUrl?: string; // Maps to EventUrl
};

export type CreateEventDto = {
  organiser: string;
  organisationNumber: string;
  title: string;
  description?: string;
  eventUrl?: string;
  bookingUrl?: string;

  streetName: string;
  streetName2?: string;
  houseNumber?: number;
  city: string;
  postalCode: string;
  gpsCoordinates?: string;

  hasSingleDates?: boolean;
  startDate?: string; // ISO 8601
  endDate?: string;

  hasMultipleDates?: boolean;
  singleDates?: Array<{ startDate: string; endDate: string }>;

  hasSchedule?: boolean;
  weekdays?: number[];
  scheduleStartTime?: string; // "HH:mm"
  scheduleEndTime?: string;

  isAlwaysOpen?: boolean;
  // NOTE: spotlight / spotlightStartDate / spotlightEndDate are intentionally
  // NOT part of the create/update contract. Spotlight placement is purchased
  // via Stripe from My Events, and the backend ignores those fields for
  // non-admin callers.
  spotlightImageUrl?: string;

  // ---- Matching backend ----
  categoryCodes: number[];
  subcategoryCodesByCategory: Record<number, number[]>;
  tagCodes?: number[];
};

// Response DTO from GET /api/events
export type CategoryDto = {
  code: number;
  name: string;
  nameSv: string;
};

export type SubcategoryDto = {
  code: number;
  name: string;
  nameSv: string;
  categoryCode: number;
};

export type EventTagDto = {
  code: number;
  name: string;
};

export type EventDto = {
  id: string;
  organiser: string;
  organisationNumber: string;
  title: string;
  description?: string;
  eventUrl?: string;
  bookingUrl?: string;
  streetName: string;
  streetName2?: string;
  houseNumber?: number;
  city: string;
  postalCode: string;
  gpsCoordinates?: string;
  hasSingleDates?: boolean;
  startDate?: string;
  endDate?: string;
  hasMultipleDates?: boolean;
  singleDates?: Array<{ startDate: string; endDate: string }>;
  hasSchedule?: boolean;
  weekdays?: number[];
  scheduleStartTime?: string;
  scheduleEndTime?: string;
  isAlwaysOpen?: boolean;
  spotlight?: boolean;
  spotlightStartDate?: string;
  spotlightEndDate?: string;
  spotlightImageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdById?: string;
  sourceProvider?: string;
  categories: CategoryDto[];
  subcategories: SubcategoryDto[];
  tags: EventTagDto[];
};

// Update DTO - same as Create
export type UpdateEventDto = CreateEventDto;

// Patch DTO - all fields optional for partial updates
export type PatchEventDto = Partial<CreateEventDto>;

// Filter DTO for GET /api/events
export type EventFilterDto = {
  isActive?: boolean;
  fromDate?: string;
  toDate?: string;
  city?: string;
  organisationNumber?: string;
  createdById?: string;
  categoryCodes?: number[];
  subcategoryCodes?: number[];
  tagCodes?: number[];
  pageNumber?: number;
  pageSize?: number;
};

// Filter DTO for GET /api/events/aggregated
export type AggregatedFilterDto = {
  categoryCodes?: number[];
  subcategoryCodes?: number[];
  tagCodes?: number[];
  city?: string;
  fromDate?: string;
  toDate?: string;
  providerIds?: string[];
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
};

// Paged result wrapper
export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

// API operation result wrapper
export type OperationResult<T> = {
  isSuccess: boolean;
  data: T;
  errors: string[];
  isForbidden?: boolean;
  isNotFound?: boolean;
};

// ---- Moderation / Event Reports ----

// Numeric values match the BE Domain.Enums.ReportReason
export enum ReportReason {
  RacistContent = 1,
  HomophobicTransphobic = 2,
  Discriminatory = 3,
  ViolentOrThreatening = 4,
  SexuallyInappropriate = 5,
  MisleadingInformation = 6,
  SpamOrFraud = 7,
  Other = 8,
}

export const ReportReasonLabel: Record<ReportReason, string> = {
  [ReportReason.RacistContent]: "Rasistiskt innehåll",
  [ReportReason.HomophobicTransphobic]: "Homofobiskt / transfobiskt",
  [ReportReason.Discriminatory]: "Diskriminerande",
  [ReportReason.ViolentOrThreatening]: "Våldsamt eller hotfullt",
  [ReportReason.SexuallyInappropriate]: "Sexuellt olämpligt",
  [ReportReason.MisleadingInformation]: "Vilseledande information",
  [ReportReason.SpamOrFraud]: "Spam eller bedrägeri",
  [ReportReason.Other]: "Annat",
};

// Numeric values match the BE Domain.Enums.EventModerationStatus
export enum EventModerationStatus {
  None = 0,
  Clean = 1,
  NeedsReview = 2,
  Blocked = 3,
}

export type ReportDetailDto = {
  id: string;
  reportedById: string;
  reasons: ReportReason[];
  description?: string;
  createdAt: string;
};

export type ReportedEventSummaryDto = {
  eventId: string;
  eventTitle: string;
  isActive: boolean;
  reportCount: number;
  moderationStatus: EventModerationStatus;
  aiModerationScore?: number;
  pendingReports: ReportDetailDto[];
};
