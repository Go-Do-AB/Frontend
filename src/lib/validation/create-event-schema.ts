import { CreateEventDto } from "@/types/events";
import { z } from "zod";
import { ORGNR_REGEX, isValidSwedishOrgNr } from "@/lib/utils";

export const createEventSchema = z.object({
  organiser: z.string().min(1, "Arrangör krävs"),
  organisationNumber: z
    .string()
    .min(1, "Organisationsnummer krävs")
    .regex(ORGNR_REGEX, "Använd formatet XXXXXX-XXXX")
    .refine(isValidSwedishOrgNr, "Ogiltigt organisationsnummer (kontrollsumma)"),
  title: z.string().min(1, "Titel krävs"),
  description: z.string().min(1, "Beskrivning krävs"),
  categories: z.array(z.number()).min(1, "Välj minst en kategori"),
  subcategories: z.record(z.number(), z.array(z.number())).optional(),
  filters: z.array(z.number()).min(1, "Välj minst ett filter").optional(),

  eventUrl: z.url("Måste vara en giltig URL").optional().or(z.literal("")),

  bookingUrl: z.url("Måste vara en giltig URL").optional().or(z.literal("")),

  streetName: z.string().min(1, "Gatunamn krävs"),
  houseNumber: z.number().int("Måste vara ett heltal").positive("Måste vara större än 0").optional(),

  city: z.string().min(1, "Stad krävs"),
  postalCode: z.string().min(1, "Postnummer krävs"),
  gpsCoordinates: z.string().max(50, "Max 50 tecken").optional().or(z.literal("")),

  hasSingleDates: z.boolean().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),

  hasMultipleDates: z.boolean().optional(),
  singleDates: z
    .array(
      z.object({
        startDate: z.date(),
        endDate: z.date().optional(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .optional(),

  hasSchedule: z.boolean().optional(),
  weekdays: z.array(z.string()).optional(),

  scheduleStartTime: z.string().optional(),
  scheduleEndTime: z.string().optional(),

  isAlwaysOpen: z.boolean().optional(),

  spotlight: z.boolean().optional(),
  spotlightStartDate: z.date().optional(),
  spotlightEndDate: z.date().optional(),
  spotlightImageUrl: z.string().url().optional().or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.hasSingleDates) {
    if (!data.startTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Starttid krävs", path: ["startTime"] });
    }
    if (!data.endTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Sluttid krävs", path: ["endTime"] });
    }
  }
  if (data.hasMultipleDates && (!data.singleDates || data.singleDates.length === 0)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Lägg till minst ett datum", path: ["singleDates"] });
  }
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
  houseNumber: undefined,

  city: "",
  postalCode: "",
  gpsCoordinates: "",

  hasSingleDates: true,
  startDate: undefined as unknown as Date,
  endDate: undefined as unknown as Date,
  startTime: "",
  endTime: "",

  hasMultipleDates: false,
  singleDates: [],

  hasSchedule: false,
  weekdays: [],
  scheduleStartTime: "",
  scheduleEndTime: "",

  isAlwaysOpen: false,

  spotlight: false,
  spotlightStartDate: undefined as unknown as Date,
  spotlightEndDate: undefined as unknown as Date,
  spotlightImageUrl: "",
};

// Helper to combine date and time into ISO string
const combineDateAndTime = (
  date: Date | undefined,
  time: string | undefined
): string | undefined => {
  if (!date) return undefined;
  const d = new Date(date);
  if (time) {
    const [hours, minutes] = time.split(":").map(Number);
    d.setHours(hours, minutes, 0, 0);
  }
  return d.toISOString();
};

const weekdayAbbrevToIndex: Record<string, number> = {
  sun: 0, sunday: 0,
  mon: 1, monday: 1,
  tue: 2, tuesday: 2,
  wed: 3, wednesday: 3,
  thu: 4, thursday: 4,
  fri: 5, friday: 5,
  sat: 6, saturday: 6,
};

export const createPayload = (data: CreateEventFormData): CreateEventDto => {
  const weekdayIndices = (data.weekdays || [])
    .map((w) => weekdayAbbrevToIndex[w.toLowerCase()])
    .filter((i): i is number => i !== undefined && i >= 0);

  const singleDatePayload = (data.singleDates || []).map((sd) => ({
    startDate: combineDateAndTime(sd.startDate, sd.startTime) ?? "",
    endDate: combineDateAndTime(sd.endDate ?? sd.startDate, sd.endTime) ?? "",
  }));

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
    houseNumber: data.houseNumber,

    city: data.city,
    postalCode: data.postalCode,
    gpsCoordinates: data.gpsCoordinates || undefined,

    hasSingleDates: data.hasSingleDates,
    startDate: data.hasSingleDates ? combineDateAndTime(data.startDate, data.startTime) : undefined,
    endDate: data.hasSingleDates ? combineDateAndTime(data.endDate, data.endTime) : undefined,

    hasMultipleDates: data.hasMultipleDates,
    singleDates: data.hasMultipleDates ? singleDatePayload : undefined,

    hasSchedule: data.hasSchedule,
    weekdays: weekdayIndices.length > 0 ? weekdayIndices : undefined,

    scheduleStartTime: data.scheduleStartTime || undefined,
    scheduleEndTime: data.scheduleEndTime || undefined,

    isAlwaysOpen: data.isAlwaysOpen,
    spotlight: data.spotlight,
    spotlightStartDate: data.spotlightStartDate
      ? new Date(data.spotlightStartDate).toISOString()
      : undefined,
    spotlightEndDate: data.spotlightEndDate
      ? new Date(data.spotlightEndDate).toISOString()
      : undefined,
    spotlightImageUrl: data.spotlightImageUrl || undefined,
  };
};

export type CreateEventFormData = z.infer<typeof createEventSchema>;

// Weekday index to abbreviated name (for converting from BE to FE)
const weekdayIndexToAbbrev: Record<number, string> = {
  0: "sun", 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat",
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
    houseNumber: event.houseNumber ?? undefined,

    city: event.city || "",
    postalCode: event.postalCode || "",
    gpsCoordinates: event.gpsCoordinates || "",

    hasSingleDates: event.hasSingleDates || false,
    startDate: event.startDate ? new Date(event.startDate) : (undefined as unknown as Date),
    endDate: event.endDate ? new Date(event.endDate) : (undefined as unknown as Date),
    startTime: extractTime(event.startDate),
    endTime: extractTime(event.endDate),

    hasMultipleDates: event.hasMultipleDates || false,
    singleDates: (event.singleDates || []).map((sd) => ({
      startDate: new Date(sd.startDate),
      endDate: sd.endDate ? new Date(sd.endDate) : undefined,
      startTime: extractTime(sd.startDate),
      endTime: extractTime(sd.endDate),
    })),

    hasSchedule: event.hasSchedule || false,
    weekdays: (event.weekdays || [])
      .map((i) => weekdayIndexToAbbrev[i])
      .filter(Boolean),
    scheduleStartTime: parseTimeSpan(event.scheduleStartTime),
    scheduleEndTime: parseTimeSpan(event.scheduleEndTime),

    isAlwaysOpen: event.isAlwaysOpen || false,

    spotlight: event.spotlight || false,
    spotlightStartDate: event.spotlightStartDate
      ? new Date(event.spotlightStartDate)
      : (undefined as unknown as Date),
    spotlightEndDate: event.spotlightEndDate
      ? new Date(event.spotlightEndDate)
      : (undefined as unknown as Date),
    spotlightImageUrl: event.spotlightImageUrl || "",
  };
};
