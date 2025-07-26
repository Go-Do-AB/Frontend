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
} from "lucide-react";
import { format } from "date-fns";

interface StepReviewEventProps {
  values: FormData;
}

export function StepReviewEvent({ values }: StepReviewEventProps) {
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
        </CardContent>
      </Card>
    </div>
  );
}
