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

  hasSingleDates: false,
  startDate: undefined as unknown as Date,
  endDate: undefined as unknown as Date,

  hasSchedule: false,
  weekday: undefined,
  scheduleStartTime: "",
  scheduleEndTime: "",

  recurrence: "",
  isAlwaysOpen: false,

  spotlight: false,
  spotlightStartDate: undefined as unknown as Date,
  spotlightEndDate: undefined as unknown as Date,
  startTime: "",
  endTime: "",
};

export const createPayload = (data: CreateEventFormData): CreateEventDto => {
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

    // ✅ must be GUIDs
    tagCodes: data.filters?.length ? data.filters.map(Number) : undefined,

    eventUrl: data.eventUrl || undefined,
    bookingUrl: data.bookingUrl || undefined,

    streetName: data.streetName,
    streetName2: data.streetName2 || undefined,
    houseNumber: data.houseNumber,

    city: data.city,
    postalCode: data.postalCode,

    hasSingleDates: data.hasSingleDates,
    startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
    endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,

    hasSchedule: data.hasSchedule,
    // ✅ DayOfWeek enum is numeric in .NET
    weekday: data.weekday
      ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(
          data.weekday
        )
      : undefined,

    // ✅ ensure proper TimeSpan JSON
    scheduleStartTime: data.scheduleStartTime ? `${data.scheduleStartTime}` : undefined,
    scheduleEndTime: data.scheduleEndTime ? `${data.scheduleEndTime}` : undefined,

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
