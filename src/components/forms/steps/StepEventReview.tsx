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
import { format } from "date-fns";

interface StepReviewEventProps {
  values: FormData;
}

export function StepReviewEvent({ values }: StepReviewEventProps) {
  return (
    <div className="w-full max-w-xl space-y-4">
      <h2 className="text-xl font-semibold text-center">Granska ditt evenemang</h2>

      <div className="flex items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3">
        <Sparkles className="w-5 h-5 mt-0.5 shrink-0 text-yellow-600" />
        <p className="text-sm text-yellow-900">
          <span className="font-medium">Vill du synas extra?</span> När evenemanget är
          skapat kan du köpa en spotlightplacering under{" "}
          <span className="font-medium">Mina evenemang</span> — klicka på{" "}
          <Sparkles className="inline w-3.5 h-3.5 -mt-0.5 text-yellow-600" />{" "}
          <span className="font-medium">Spotlight</span> på evenemangskortet.
        </p>
      </div>

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
              {values.spotlightImageUrl && (
                <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border bg-muted mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={values.spotlightImageUrl}
                    alt="Spotlight banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Spotlightplacering köper du under &quot;Mina evenemang&quot; efter att
                evenemanget har skapats.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
