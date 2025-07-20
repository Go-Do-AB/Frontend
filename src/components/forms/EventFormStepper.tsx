import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { FormData } from "@/hooks/useEventForm";
import { StepEventDateTime } from "./steps/StepEventDateTime";
import { StepEventDetails } from "./steps/StepEventDetails";
import { StepReviewEvent } from "./steps/StepEventReview";

interface EventFormStepperProps {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  onSubmit: () => void;
}

export function EventFormStepper({ step, nextStep, prevStep, onSubmit }: EventFormStepperProps) {
  const {
    register,
    control,
    formState: { errors },
    getValues,
    handleSubmit,
  } = useFormContext<FormData>();

  return (
    <form className="w-full max-w-xl bg-white p-6 rounded-lg shadow space-y-4">
      {step === 0 && <StepEventDetails register={register} errors={errors} />}
      {step === 1 && <StepEventDateTime control={control} errors={errors} />}
      {step === 2 && <StepReviewEvent values={getValues()} />}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={prevStep} disabled={step === 0}>
          Back
        </Button>
        {step < 2 ? (
          <Button type="button" onClick={nextStep}>
            Next
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="bg-black text-white hover:bg-gray-800"
          >
            Submit
          </Button>
        )}
      </div>
    </form>
  );
}
