import { CreateEventDto } from "@/types/events";
import { z } from "zod";
import { ORGNR_REGEX, isValidSwedishOrgNr } from "@/lib/utils";

export const createEventSchema = z.object({
  organiser: z.string().min(1, "Organiser is required"),
  organisationNumber: z
    .string()
    .min(1, "Organisation number is required")
    .regex(ORGNR_REGEX, "Use format XXXXXX-XXXX")
    .refine(isValidSwedishOrgNr, "Invalid organisation number (checksum)"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  categories: z.array(z.number()).min(1, "Please select at least one category"),
  subcategories: z.record(z.number(), z.array(z.number())).optional(),
  filters: z.array(z.number()).min(1, "Please select at least one category").optional(),

  eventUrl: z.url("Must be a valid URL").optional().or(z.literal("")),

  bookingUrl: z.url("Must be a valid URL").optional().or(z.literal("")),

  streetName: z.string().min(1, "Street name is required"),
  streetName2: z.string().optional(),
  houseNumber: z.number().int("Must be a number").positive("Must be greater than 0").optional(),

  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  gpsCoordinates: z.string().max(50, "Max 50 characters").optional().or(z.literal("")),

  hasSingleDates: z.boolean().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),

  hasSchedule: z.boolean().optional(),
  weekday: z
    .enum(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])
    .optional(),

  scheduleStartTime: z.string().optional(), // You may refine these to match HH:mm
  scheduleEndTime: z.string().optional(),

  recurrence: z.string().optional(),
  isAlwaysOpen: z.boolean().optional(),

  spotlight: z.boolean().optional(),
  spotlightStartDate: z.date().optional(),
  spotlightEndDate: z.date().optional(),
});

export const defaultFormValues: CreateEventFormData = {
  organiser: "",
  organisationNumber: "",
  title: "",
  description: "",
  categories: [],
  subcategories: {},
  filters: [] as number[],

  eventUrl: "",
  bookingUrl: "",

  streetName: "",
  streetName2: "",
  houseNumber: 0,

  city: "",
  postalCode: "",
  gpsCoordinates: "",

  hasSingleDates: false,
  startDate: undefined as unknown as Date,
  endDate: undefined as unknown as Date,
  startTime: "",
  endTime: "",

  hasSchedule: false,
  weekday: undefined,
  scheduleStartTime: "",
  scheduleEndTime: "",

  recurrence: "",
  isAlwaysOpen: false,

  spotlight: false,
  spotlightStartDate: undefined as unknown as Date,
  spotlightEndDate: undefined as unknown as Date,
};

// Helper to combine date and time into ISO string
const combineDateAndTime = (date: Date | undefined, time: string | undefined): string | undefined => {
  if (!date) return undefined;
  const d = new Date(date);
  if (time) {
    const [hours, minutes] = time.split(":").map(Number);
    d.setHours(hours, minutes, 0, 0);
  }
  return d.toISOString();
};

// Map abbreviated weekday to full name for .NET DayOfWeek enum
const weekdayMap: Record<string, string> = {
  sun: "Sunday",
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  // Also support full names directly
  Sunday: "Sunday",
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
};

export const createPayload = (data: CreateEventFormData): CreateEventDto => {
  // Map weekday abbreviation to index
  const weekdayIndex = data.weekday
    ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(
        weekdayMap[data.weekday] || data.weekday
      )
    : undefined;

  return {
    organiser: data.organiser,
    organisationNumber: data.organisationNumber,
    title: data.title,
    description: data.description || undefined,

    categoryCodes: (data.categories || []).map((c) => Number(c)),
    subcategoryCodesByCategory: Object.fromEntries(
      Object.entries(data.subcategories || {}).map(([cat, subs]) => [
        Number(cat),
        subs.map((s) => Number(s)),
      ])
    ),

    tagCodes: data.filters?.length ? data.filters.map(Number) : undefined,

    eventUrl: data.eventUrl || undefined,
    bookingUrl: data.bookingUrl || undefined,

    streetName: data.streetName,
    streetName2: data.streetName2 || undefined,
    houseNumber: data.houseNumber,

    city: data.city,
    postalCode: data.postalCode,
    gpsCoordinates: data.gpsCoordinates || undefined,

    hasSingleDates: data.hasSingleDates,
    // Combine date with time for single date events
    startDate: combineDateAndTime(data.startDate, data.startTime),
    endDate: combineDateAndTime(data.endDate, data.endTime),

    hasSchedule: data.hasSchedule,
    // Map weekday abbreviation to .NET DayOfWeek enum index
    weekday: weekdayIndex !== undefined && weekdayIndex >= 0 ? weekdayIndex : undefined,

    // Schedule times as HH:mm strings (BE expects TimeSpan format)
    scheduleStartTime: data.scheduleStartTime || undefined,
    scheduleEndTime: data.scheduleEndTime || undefined,

    recurrence: data.recurrence || undefined,

    isAlwaysOpen: data.isAlwaysOpen,
    spotlight: data.spotlight,
    spotlightStartDate: data.spotlightStartDate
      ? new Date(data.spotlightStartDate).toISOString()
      : undefined,
    spotlightEndDate: data.spotlightEndDate
      ? new Date(data.spotlightEndDate).toISOString()
      : undefined,
  };
};

export type CreateEventFormData = z.infer<typeof createEventSchema>;

// Weekday index to name mapping (for converting from BE to FE)
const weekdayIndexToName: Record<number, CreateEventFormData["weekday"]> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

// Convert EventDto from API to CreateEventFormData for editing
export const eventDtoToFormData = (event: {
  organiser: string;
  organisationNumber: string;
  title: string;
  description?: string;
  categories: { code: number; name: string }[];
  subcategories: { code: number; name: string; categoryCode: number }[];
  tags: { code: number; name: string }[];
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
  hasSchedule?: boolean;
  weekday?: number;
  scheduleStartTime?: string;
  scheduleEndTime?: string;
  recurrence?: string;
  isAlwaysOpen?: boolean;
  spotlight?: boolean;
  spotlightStartDate?: string;
  spotlightEndDate?: string;
}): CreateEventFormData => {
  // Extract time from ISO date string
  const extractTime = (isoString?: string): string => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Parse TimeSpan string (HH:mm:ss or HH:mm) to HH:mm
  const parseTimeSpan = (timeSpan?: string): string => {
    if (!timeSpan) return "";
    // Handle both "HH:mm:ss" and "HH:mm" formats
    const parts = timeSpan.split(":");
    if (parts.length >= 2) {
      return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
    }
    return "";
  };

  // Build subcategories map: { categoryCode: [subcategoryCodes] }
  const subcategoriesMap: Record<number, number[]> = {};
  for (const sub of event.subcategories || []) {
    if (!subcategoriesMap[sub.categoryCode]) {
      subcategoriesMap[sub.categoryCode] = [];
    }
    subcategoriesMap[sub.categoryCode].push(sub.code);
  }

  return {
    organiser: event.organiser || "",
    organisationNumber: event.organisationNumber || "",
    title: event.title || "",
    description: event.description || "",
    categories: (event.categories || []).map((c) => c.code),
    subcategories: subcategoriesMap,
    filters: (event.tags || []).map((t) => t.code),

    eventUrl: event.eventUrl || "",
    bookingUrl: event.bookingUrl || "",

    streetName: event.streetName || "",
    streetName2: event.streetName2 || "",
    houseNumber: event.houseNumber || 0,

    city: event.city || "",
    postalCode: event.postalCode || "",
    gpsCoordinates: event.gpsCoordinates || "",

    hasSingleDates: event.hasSingleDates || false,
    startDate: event.startDate ? new Date(event.startDate) : (undefined as unknown as Date),
    endDate: event.endDate ? new Date(event.endDate) : (undefined as unknown as Date),
    startTime: extractTime(event.startDate),
    endTime: extractTime(event.endDate),

    hasSchedule: event.hasSchedule || false,
    weekday: event.weekday !== undefined ? weekdayIndexToName[event.weekday] : undefined,
    scheduleStartTime: parseTimeSpan(event.scheduleStartTime),
    scheduleEndTime: parseTimeSpan(event.scheduleEndTime),

    recurrence: event.recurrence || "",
    isAlwaysOpen: event.isAlwaysOpen || false,

    spotlight: event.spotlight || false,
    spotlightStartDate: event.spotlightStartDate
      ? new Date(event.spotlightStartDate)
      : (undefined as unknown as Date),
    spotlightEndDate: event.spotlightEndDate
      ? new Date(event.spotlightEndDate)
      : (undefined as unknown as Date),
  };
};
