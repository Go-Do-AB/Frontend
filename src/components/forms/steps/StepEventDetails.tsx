import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormData } from "@/hooks/useEventForm";
import { Label } from "@/components/ui/label";

interface StepDetailsProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export function StepEventDetails({ register, errors }: StepDetailsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="py-2">
          Organiser <span className="text-red-500">*</span>
        </Label>
        <Input placeholder="Organiser name" {...register("organiser")} />
        {errors.organiser && <p className="text-red-500 text-sm">{errors.organiser.message}</p>}
      </div>

      <div>
        <Label className="py-2">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input placeholder="Event Title" {...register("title")} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <Label className="py-2">Description</Label>
        <Textarea placeholder="Event Description" {...register("description")} />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <Label className="py-2">Event URL</Label>
        <Input placeholder="https://event-link.com" {...register("eventUrl")} />
        {errors.eventUrl && <p className="text-red-500 text-sm">{errors.eventUrl.message}</p>}
      </div>

      <div>
        <Label className="py-2">Booking URL</Label>
        <Input placeholder="https://booking-link.com" {...register("bookingUrl")} />
        {errors.bookingUrl && <p className="text-red-500 text-sm">{errors.bookingUrl.message}</p>}
      </div>
    </div>
  );
}
