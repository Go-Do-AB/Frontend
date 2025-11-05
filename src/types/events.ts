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

  hasSingleDates?: boolean;
  startDate?: string; // ISO 8601
  endDate?: string;

  hasSchedule?: boolean;
  weekday?: number;
  scheduleStartTime?: string; // "HH:mm"
  scheduleEndTime?: string;
  recurrence?: string;

  isAlwaysOpen?: boolean;
  spotlight?: boolean;
  spotlightStartDate?: string | null;
  spotlightEndDate?: string | null;

  // ---- Matching backend ----
  categoryCodes: number[];
  subcategoryCodesByCategory: Record<number, number[]>;
  tagCodes?: number[];
};
