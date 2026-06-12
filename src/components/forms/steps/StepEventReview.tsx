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
      <h2 className="text-xl font-semibold text-center">Granska ditt evenemang</h2>

      <Card className="bg-gray-50">
        <CardContent className="space-y-4 pt-6">
          {values.title && (
            <div className="flex items-start gap-3">
              <Type className="w-5 h-5 mt-1 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground">Evenemangets titel</Label>
                <p className="text-lg font-medium">{values.title}</p>
              </div>
            </div>
          )}

          {values.organiser && (
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 mt-1 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground">Arrangör</Label>
                <p>{values.organiser}</p>
              </div>
            </div>
          )}

          {values.organisationNumber && (
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 mt-1 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground">Organisationsnummer</Label>
                <p>{values.organisationNumber}</p>
              </div>
            </div>
          )}

          {values.description && (
            <div className="flex items-start gap-3">
              <AlignLeft className="w-5 h-5 mt-1 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground">Beskrivning</Label>
                <p>{values.description}</p>
              </div>
            </div>
          )}

          {(values.streetName || values.postalCode || values.city) && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-1 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground">Plats</Label>
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
                <Label className="text-muted-foreground">Evenemangslänk</Label>
                <p>{values.eventUrl}</p>
              </div>
            </div>
          )}

          {values.bookingUrl && (
            <div className="flex items-start gap-3">
              <Link className="w-5 h-5 mt-1 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground">Bokningslänk</Label>
                <p>{values.bookingUrl}</p>
              </div>
            </div>
          )}

          {/* Single instance */}
          {values.hasSingleDates && (values.startDate || values.startTime) && (
            <div className="flex items-start gap-3">
              <CalendarArrowDown className="w-5 h-5 mt-1 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground">Starttid</Label>
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

          {values.hasSingleDates && (values.endDate || values.endTime) && (
            <div className="flex items-start gap-3">
              <CalendarArrowUp className="w-5 h-5 mt-1 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground">Sluttid</Label>
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

          {/* Multiple single dates */}
          {values.hasMultipleDates && values.singleDates && values.singleDates.length > 0 && (
            <div className="flex items-start gap-3">
              <CalendarIcon className="w-5 h-5 mt-1 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground">Datum</Label>
                <div className="space-y-1 mt-1">
                  {values.singleDates.map((sd, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="font-medium">
                        {format(sd.startDate, "dd.MM.yyyy")}
                        {sd.endDate && sd.endDate.toDateString() !== sd.startDate.toDateString()
                          ? ` → ${format(sd.endDate, "dd.MM.yyyy")}`
                          : ""}
                      </span>
                      {(sd.startTime || sd.endTime) && (
                        <span className="text-muted-foreground">
                          {sd.startTime} {sd.endTime ? `– ${sd.endTime}` : ""}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recurring */}
          {values.hasSchedule && values.weekdays && values.weekdays.length > 0 && (
            <div className="flex items-start gap-3">
              <CalendarIcon className="w-5 h-5 mt-1 text-muted-foreground" />
              <div>
                <Label className="text-muted-foreground">Veckodagar</Label>
                <p>
                  {values.weekdays
                    .map((d) => ({ mon:"Måndag",tue:"Tisdag",wed:"Onsdag",thu:"Torsdag",fri:"Fredag",sat:"Lördag",sun:"Söndag" }[d] ?? d))
                    .join(", ")}
                </p>
                {(values.scheduleStartTime || values.scheduleEndTime) && (
                  <p className="text-sm text-muted-foreground">
                    {values.scheduleStartTime}
                    {values.scheduleEndTime ? ` – ${values.scheduleEndTime}` : ""}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 mt-1 text-muted-foreground" />
            <div>
              <Label className="text-muted-foreground">Spotlight</Label>
              <p className="mt-0.5">
                {values.spotlight
                  ? `Aktiverad — ${fmt(values.spotlightStartDate)} → ${fmt(values.spotlightEndDate)}`
                  : "Inaktiverad"}
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
                      <span>{days} dagar × 99 kr</span>
                      <span className="font-medium">{money.format(subtotal)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Moms (inkluderad)</span>
                      <span className="font-medium">{money.format(vat)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-base">
                      <span className="font-semibold">Totalt (inkl. moms)</span>
                      <span className="font-semibold">{money.format(total)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    Priset är 99 kr per dag plus 125 kr moms. Momsen ingår i totalpriset.
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
