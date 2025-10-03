import { Button } from "@/components/ui/button";
import { useFormContext, type UseFormWatch } from "react-hook-form";
import { FormData } from "@/hooks/useEventForm";
import type { CreateEventFormData } from "@/lib/validation/create-event-schema";
import { StepEventDateTime } from "./steps/StepEventDateTime";
import { StepEventDetails } from "./steps/StepEventDetails";
import { StepReviewEvent } from "./steps/StepEventReview";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StepEventLocation } from "./steps/StepEventLocation";

interface EventFormStepperProps {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  onSubmit: (values: CreateEventFormData) => void;
}

// function isStepValid(step: number, values: FormData): boolean {
//   switch (step) {
//     case 0:
//       return !!(values.title && values.organiser && values.categories && values.organisationNumber);
//     case 1:
//       return !!(values.streetName && values.city && values.postalCode);
//     case 2:
//       return !!(values.startDate && values.endDate);
//     default:
//       return true; // Final step is just review
//   }
// }

// per-step fields to validate
const stepFields: Record<number, (keyof CreateEventFormData)[]> = {
  0: ["title", "organiser", "categories", "organisationNumber"],
  1: ["streetName", "city", "postalCode"],
  2: ["startDate", "endDate", "scheduleStartTime", "scheduleEndTime"], // ✅ updated
};

export function EventFormStepper({ step, nextStep, prevStep, onSubmit }: EventFormStepperProps) {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    watch,
    trigger,
  } = useFormContext<CreateEventFormData>();

  // disabled "Next" UX
  const isStepFilled = useIsStepFilled(step, watch);

  const handleNext = async () => {
    const fields = stepFields[step] ?? [];
    const ok = await trigger(fields, { shouldFocus: true }); // focuses first invalid field
    if (ok) nextStep();
  };

  const values = watch();

  const handleSubmitRaw = (e: React.FormEvent) => {
    e.preventDefault(); // stop page reload
    const values = getValues(); // grab all form values
    onSubmit(values); // just send it straight
  };
  // const isValidStep = isStepValid(step, values);

  return (
    <form
      onSubmit={handleSubmitRaw}
      className="w-full max-w-4xl bg-white p-6 rounded-lg shadow space-y-4"
    >
      {step === 0 && <StepEventDetails control={control} register={register} errors={errors} />}
      {step === 1 && <StepEventLocation register={register} errors={errors} />}
      {step === 2 && <StepEventDateTime control={control} errors={errors} />}
      {step === 3 && <StepReviewEvent values={getValues()} />}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={prevStep} disabled={step === 0}>
          Back
        </Button>
        {step < 3 ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button type="button" onClick={handleNext} disabled={!isStepFilled}>
                    Next
                  </Button>
                </span>
              </TooltipTrigger>
              {!isStepFilled && (
                <TooltipContent>
                  Please fill out all required fields before continuing.
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button type="submit" className="bg-black text-white hover:bg-gray-800">
            Submit
          </Button>
        )}
      </div>
    </form>
  );
}

// ---------- helper for disabled-Next UX ----------
function truthy(v: unknown): boolean {
  if (Array.isArray(v)) return v.length > 0;
  if (v instanceof Date) return !isNaN(v.getTime());
  if (typeof v === "string") return v.trim() !== "";
  if (typeof v === "number") return !isNaN(v);
  if (typeof v === "boolean") return v;
  return v !== undefined && v !== null;
}

function useIsStepFilled(step: number, watch: UseFormWatch<CreateEventFormData>) {
  switch (step) {
    case 0: {
      const [title, organiser, categories, organisationNumber] = watch([
        "title",
        "organiser",
        "categories",
        "organisationNumber",
      ]);
      return [title, organiser, organisationNumber].every(truthy) && truthy(categories);
    }
    case 1: {
      const [streetName, city, postalCode] = watch(["streetName", "city", "postalCode"]);
      return [streetName, city, postalCode].every(truthy);
    }
    case 2: {
      const [startDate, endDate] = watch(["startDate", "endDate"]);
      return [startDate, endDate].every(truthy);
    }
    default:
      return true;
  }
}
