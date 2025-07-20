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
          <div className="flex items-start gap-3">
            <Type className="w-5 h-5 mt-1 text-muted-foreground" />
            <div>
              <Label className="text-muted-foreground">Event Title</Label>
              <p className="text-lg font-medium">{values.title}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <AlignLeft className="w-5 h-5 mt-1 text-muted-foreground" />
            <div>
              <Label className="text-muted-foreground">Description</Label>
              <p>{values.description}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-1 text-muted-foreground" />
            <div>
              <Label className="text-muted-foreground">Location</Label>
              <p>{values.location}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarArrowDown className="w-5 h-5 mt-1 text-muted-foreground" />
            <div>
              <Label className="text-muted-foreground">Start</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <span>{format(values.startDate, "dd.MM.yyyy")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{values.startTime}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarArrowUp className="w-5 h-5 mt-1 text-muted-foreground" />
            <div>
              <Label className="text-muted-foreground">End</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <span>{format(values.endDate, "dd.MM.yyyy")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{values.endTime}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
