import { Input } from "@/components/ui/input";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormData } from "@/hooks/useEventForm";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Info } from "lucide-react";

interface StepEventLocationProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export function StepEventLocation({ register, errors }: StepEventLocationProps) {
  const [showGpsInfo, setShowGpsInfo] = useState(false);

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
        <div className="flex items-center gap-1.5 py-2">
          <Label>GPS Coordinates</Label>
          <button
            type="button"
            onClick={() => setShowGpsInfo((v) => !v)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Show GPS help"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
        <Input placeholder="e.g., 56.0465, 12.6945" {...register("gpsCoordinates")} />
        {errors.gpsCoordinates && (
          <p className="text-red-500 text-sm">{errors.gpsCoordinates.message}</p>
        )}
        {showGpsInfo && (
          <div className="mt-2 text-xs text-muted-foreground space-y-1 bg-gray-50 rounded-lg p-3 border">
            <p>GPS-koordinater gör det lätt för Go.Do. användare att hitta till er! Med rätt GPS-koordinater får användare rätt vägbeskrivning till er. Dessutom syns ert inlägg på kartan när Go.Do. användare söker baserat på sin position (Nära mig).</p>
            <p className="font-medium">Gör så här:</p>
            <ol className="list-decimal list-inside space-y-0.5">
              <li>Gå till Google Maps.</li>
              <li>I sök-fältet, skriv in platsen eller adressen för ert inlägg.</li>
              <li>Högerklicka på den röda markör som visas på kartan.</li>
              <li>GPS-koordinaterna dyker upp i listan som nu visas. Kopiera koordinaterna och klistra in dem här.</li>
            </ol>
            <p>Färdigt!</p>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground italic">* Not all fields above are required</p>
    </div>
  );
}
