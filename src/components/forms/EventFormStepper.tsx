import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { FormData } from "@/hooks/useEventForm";
import { StepEventDateTime } from "./steps/StepEventDateTime";
import { StepEventDetails } from "./steps/StepEventDetails";
import { StepReviewEvent } from "./steps/StepEventReview";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EventFormStepperProps {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  onSubmit: () => void;
}

function isStepValid(step: number, values: FormData): boolean {
  switch (step) {
    case 0:
      return !!(values.title && values.organiser);
    case 1:
      return !!(values.startDate && values.endDate && values.startTime && values.endTime);
    default:
      return true; // Final step is just review
  }
}

export function EventFormStepper({ step, nextStep, prevStep, onSubmit }: EventFormStepperProps) {
  const {
    register,
    control,
    formState: { errors },
    getValues,
    watch,
    handleSubmit,
  } = useFormContext<FormData>();

  const values = watch();
  const isValidStep = isStepValid(step, values);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-xl bg-white p-6 rounded-lg shadow space-y-4"
    >
      {step === 0 && (
        <>
          <StepEventDetails register={register} errors={errors} />
          <p className="text-xs text-muted-foreground italic">
            * Not all fields above are required
          </p>
        </>
      )}
      {step === 1 && <StepEventDateTime control={control} errors={errors} />}
      {step === 2 && <StepReviewEvent values={getValues()} />}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={prevStep} disabled={step === 0}>
          Back
        </Button>
        {step < 2 ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button type="button" onClick={nextStep} disabled={!isValidStep}>
                    Next
                  </Button>
                </span>
              </TooltipTrigger>
              {!isValidStep && (
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
