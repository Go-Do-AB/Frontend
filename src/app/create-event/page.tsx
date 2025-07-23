"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

import { Navbar } from "@/components/global/Navbar";
import { EventFormStepper } from "@/components/forms/EventFormStepper";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import { FormData } from "@/hooks/useEventForm";
import { CreateEventDto } from "@/types/events";
import {
  createEventSchema,
  createPayload,
  defaultFormValues,
} from "@/lib/validation/create-event-schema";

export default function CreateEventPage() {
  const [step, setStep] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: defaultFormValues,
  });

  const { mutate } = useCreateEvent();

  const nextStep = () => setStep((s) => Math.min(s + 1, 2));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = (data: FormData) => {
    try {
      const payload: CreateEventDto = createPayload(data);

      mutate(payload, {
        onSuccess: () => {
          setFormSubmitted(true);
          toast(
            <div className="flex items-start gap-3 text-black">
              <CheckCircle className="text-green-500 mt-1" />
              <div>
                <p className="font-semibold">Event created!</p>
                <p className="text-sm">Your event is now live on Go.Do.</p>
              </div>
            </div>
          );
        },
        onError: () => {
          toast(
            <div className="flex items-start gap-3 text-black">
              <XCircle className="text-red-500 mt-1" />
              <div>
                <p className="font-semibold">Submission failed</p>
                <p className="text-sm">Please check your input and try again.</p>
              </div>
            </div>
          );
        },
      });
    } catch (err) {
      toast(
        <div className="flex items-start gap-3 text-black">
          <XCircle className="text-red-500 mt-1" />
          <div>
            <p className="font-semibold">Unexpected error</p>
            <p className="text-sm">Something went wrong, please try again later.</p>
          </div>
        </div>
      );
    }
  };

  return (
    <main className="min-h-screen bg-yellow-400 text-black flex flex-col">
      <Navbar />
      <section className="flex-1 flex flex-col items-center px-6 py-10">
        <h1 className="text-4xl font-bold mb-6">Create an Event</h1>

        <div className="w-full max-w-xl mb-6">
          <div className="flex justify-between text-sm font-medium mb-2">
            {["Details", "Timing", "Confirm"].map((label, i) => (
              <span key={i} className={i <= step ? "text-black" : "text-gray-500"}>
                {label}
              </span>
            ))}
          </div>
          <div className="h-2 bg-gray-300 rounded-full">
            <div
              className="h-2 bg-black rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {formSubmitted ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Tack för ditt bidrag!</h2>
            <p>Eventet har skickats in och kommer snart att synas på Go.Do.</p>
          </div>
        ) : (
          <FormProvider {...form}>
            <EventFormStepper
              step={step}
              nextStep={nextStep}
              prevStep={prevStep}
              onSubmit={form.handleSubmit(onSubmit)}
            />
          </FormProvider>
        )}
      </section>
    </main>
  );
}
