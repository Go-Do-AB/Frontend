import { Input } from "@/components/ui/input";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormData } from "@/hooks/useEventForm";
import { Label } from "@/components/ui/label";

interface StepEventLocationProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export function StepEventLocation({ register, errors }: StepEventLocationProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="py-2">
          Street Name <span className="text-red-500">*</span>
        </Label>
        <Input placeholder="Street name" {...register("streetName")} />
        {errors.streetName && <p className="text-red-500 text-sm">{errors.streetName.message}</p>}
      </div>

      <div>
        <Label className="py-2">Street Name 2</Label>
        <Input placeholder="Apartment, suite, etc." {...register("streetName2")} />
        {errors.streetName2 && <p className="text-red-500 text-sm">{errors.streetName2.message}</p>}
      </div>

      <div>
        <Label className="py-2">House Number</Label>
        <Input
          type="number"
          placeholder="123"
          {...register("houseNumber", { valueAsNumber: true })}
        />
        {errors.houseNumber && <p className="text-red-500 text-sm">{errors.houseNumber.message}</p>}
      </div>

      <div>
        <Label className="py-2">
          City <span className="text-red-500">*</span>
        </Label>
        <Input placeholder="City name" {...register("city")} />
        {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
      </div>

      <div>
        <Label className="py-2">
          Postal Code <span className="text-red-500">*</span>
        </Label>
        <Input placeholder="12345" {...register("postalCode")} />
        {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode.message}</p>}
      </div>

      <div>
        <Label className="py-2">GPS Coordinates</Label>
        <Input placeholder="e.g., 56.0465, 12.6945" {...register("gpsCoordinates")} />
        {errors.gpsCoordinates && (
          <p className="text-red-500 text-sm">{errors.gpsCoordinates.message}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Optional - helps users find your event on a map
        </p>
      </div>
      <p className="text-xs text-muted-foreground italic">* Not all fields above are required</p>
    </div>
  );
}
