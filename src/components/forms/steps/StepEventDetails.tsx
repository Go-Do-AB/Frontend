import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormData } from "@/hooks/useEventForm";

interface StepDetailsProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export function StepEventDetails({ register, errors }: StepDetailsProps) {
  return (
    <>
      <div>
        <Input placeholder="Event Title" {...register("title")} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>
      <div>
        <Textarea placeholder="Event Description" {...register("description")} />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>
      <div>
        <Input placeholder="Location" {...register("location")} />
        {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
      </div>
    </>
  );
}
