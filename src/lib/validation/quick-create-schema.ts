import { QuickCreateEventDto } from "@/types/events";
import { z } from "zod";

export const quickCreateSchema = z.object({
  organisationNumber: z.string().max(20, "Max 20 characters").optional().or(z.literal("")),
  name: z.string().max(200, "Max 200 characters").optional().or(z.literal("")),
  organiserName: z.string().max(100, "Max 100 characters").optional().or(z.literal("")),
  place: z.string().max(100, "Max 100 characters").optional().or(z.literal("")),
  address: z.string().max(200, "Max 200 characters").optional().or(z.literal("")),
  gpsCoordinates: z.string().max(50, "Max 50 characters").optional().or(z.literal("")),
  description: z.string().max(4000, "Max 4000 characters").optional().or(z.literal("")),
  subcategoryCodes: z.array(z.number()).optional(),
  filterCodes: z.array(z.number()).optional(),
  readMoreUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type QuickCreateFormData = z.infer<typeof quickCreateSchema>;

export const defaultQuickCreateValues: QuickCreateFormData = {
  organisationNumber: "",
  name: "",
  organiserName: "",
  place: "",
  address: "",
  gpsCoordinates: "",
  description: "",
  subcategoryCodes: [],
  filterCodes: [],
  readMoreUrl: "",
};

export const createQuickPayload = (data: QuickCreateFormData): QuickCreateEventDto => {
  return {
    organisationNumber: data.organisationNumber || undefined,
    name: data.name || undefined,
    organiserName: data.organiserName || undefined,
    place: data.place || undefined,
    address: data.address || undefined,
    gpsCoordinates: data.gpsCoordinates || undefined,
    description: data.description || undefined,
    subcategoryCodes: data.subcategoryCodes?.length ? data.subcategoryCodes : undefined,
    filterCodes: data.filterCodes?.length ? data.filterCodes : undefined,
    readMoreUrl: data.readMoreUrl || undefined,
  };
};
