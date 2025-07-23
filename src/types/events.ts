export type CreateEventDto = {
  organiser: string;
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
  startDate?: string; // ISO format string
  endDate?: string;

  hasSchedule?: boolean;
  weekday?: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  scheduleStartTime?: string; // HH:mm format string
  scheduleEndTime?: string;
  recurrence?: string;

  isAlwaysOpen?: boolean;
  spotlight?: boolean;
  spotlightDate?: string;
};
