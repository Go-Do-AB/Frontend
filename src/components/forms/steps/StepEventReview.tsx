import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { FormData } from "@/hooks/useEventForm";
import {
  Type,
  AlignLeft,
  MapPin,
  CalendarArrowDown,
  CalendarIcon,
  Clock,
  CalendarArrowUp,
  Link,
  User,
  Sparkles,
} from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";

interface StepReviewEventProps {
  values: FormData;
}

export function StepReviewEvent({ values }: StepReviewEventProps) {
  const fmt = (d?: Date | null) => (d ? format(d, "dd.MM.yyyy") : "—");

  const isSpotlight = !!values.spotlight;
  const s = values.spotlightStartDate ?? null;
  const e = values.spotlightEndDate ?? null;

    // Dygn inkl. start & end (same date = 1 day)
  const days =
    isSpotlight && s && e ? Math.max(1, differenceInCalendarDays(e, s) + 1) : 0;

  const PRICE_PER_DAY = 99;
  const VAT_FLAT = 125;

  const subtotal = days * PRICE_PER_DAY;
  const vat = days > 0 ? VAT_FLAT : 0;
  const total = days > 0 ? subtotal + vat : 0;

  // SEK-format 
  const money = new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  });

  return (
    <div className="w-full max-w-xl space-y-4">
      <h2 className="text-xl font-semibold text-center">Review your event info</h2>

      <Card className="bg-gray-50">
        <CardContent className="space-y-4 pt-6">
          {values.title && (
            <div className="flex items-start gap-3">
              <Type className="w-5 h-5 mt-1 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground">Event Title</Label>
                <p className="text-lg font-medium">{values.title}</p>
              </div>
            </div>
          )}

          {values.organiser && (
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 mt-1 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground">Organiser</Label>
                <p>{values.organiser}</p>
              </div>
            </div>
          )}

          {values.organisationNumber && (
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 mt-1 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground">Organisation number</Label>
                <p>{values.organisationNumber}</p>
              </div>
            </div>
          )}

          {values.description && (
            <div className="flex items-start gap-3">
              <AlignLeft className="w-5 h-5 mt-1 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p>{values.description}</p>
              </div>
            </div>
          )}

          {(values.streetName || values.postalCode || values.city) && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-1 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground">Location</Label>
                <p>
                  {[values.streetName, values.postalCode, values.city].filter(Boolean).join(", ")}
                </p>
              </div>
            </div>
          )}

          {values.eventUrl && (
            <div className="flex items-start gap-3">
              <Link className="w-5 h-5 mt-1 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground">Event URL</Label>
                <p>{values.eventUrl}</p>
              </div>
            </div>
          )}

          {values.bookingUrl && (
            <div className="flex items-start gap-3">
              <Link className="w-5 h-5 mt-1 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground">Booking URL</Label>
                <p>{values.bookingUrl}</p>
              </div>
            </div>
          )}

          {(values.startDate || values.startTime) && (
            <div className="flex items-start gap-3">
              <CalendarArrowDown className="w-5 h-5 mt-1 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground">Start</Label>
                <div className="flex items-center gap-4">
                  {values.startDate && (
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      <span>{format(values.startDate, "dd.MM.yyyy")}</span>
                    </div>
                  )}
                  {values.startTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{values.startTime}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {(values.endDate || values.endTime) && (
            <div className="flex items-start gap-3">
              <CalendarArrowUp className="w-5 h-5 mt-1 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground">End</Label>
                <div className="flex items-center gap-4">
                  {values.endDate && (
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      <span>{format(values.endDate, "dd.MM.yyyy")}</span>
                    </div>
                  )}
                  {values.endTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{values.endTime}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 mt-1 text-muted-foreground" />
            <div>
              <Label className="text-muted-foreground">Spotlight</Label>
              <p className="mt-0.5">
                {values.spotlight
                  ? `Enabled — ${fmt(values.spotlightStartDate)} → ${fmt(values.spotlightEndDate)}`
                  : "Disabled"}
              </p>
       {/*  this cost box is under Spotlight-text */}
              {isSpotlight && s && e && days > 0 && (
                <div className="mt-3 rounded-2xl border p-4 bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-2">
                    Period:{" "}
                    <span className="font-medium">{format(s, "dd.MM.yyyy")}</span>{" "}
                    {"\u2192"}{" "}
                    <span className="font-medium">{format(e, "dd.MM.yyyy")}</span>
                  </p>

                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>{days} days × 99 kr</span>
                      <span className="font-medium">{money.format(subtotal)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>VAT (included)</span>
                      <span className="font-medium">{money.format(vat)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-base">
                      <span className="font-semibold">Total (incl. VAT)</span>
                      <span className="font-semibold">{money.format(total)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    The price is 99 kr per day plus 125 kr VAT. VAT is included in the total
                  </p>
                </div>
              )}
              
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
