"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

import { Navbar } from "@/components/global/Navbar";
import { EventFormStepper } from "@/components/forms/EventFormStepper";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import type { CreateEventFormData } from "@/lib/validation/create-event-schema";
import { CreateEventDto } from "@/types/events";
import {
  createEventSchema,
  createPayload,
  defaultFormValues,
} from "@/lib/validation/create-event-schema";
import { Info, MapPin, Clock, CheckCircleIcon, Sparkles } from "lucide-react"; // or your preferred icon set

const steps = [
  { label: "Details", icon: <Info className="w-4 h-4 mr-1" /> },
  { label: "Location", icon: <MapPin className="w-4 h-4 mr-1" /> },
  { label: "Date & Time", icon: <Clock className="w-4 h-4 mr-1" /> },
  { label: "Spotlight", icon: <Sparkles className="w-4 h-4 mr-1" /> },
  { label: "Confirm", icon: <CheckCircleIcon className="w-4 h-4 mr-1" /> },
];

export default function CreateEventPage() {
  const [step, setStep] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
  });

  const { mutate } = useCreateEvent();

  const totalSteps = steps.length;
  const lastIndex = totalSteps - 1;

  const nextStep = () => setStep((s) => Math.min(s + 1, lastIndex));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = (data: CreateEventFormData) => {
    console.log("running");
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
      console.log(err);
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
            {steps.map((stepObj, i) => (
              <span
                key={i}
                className={`flex items-center gap-1 ${i <= step ? "text-black" : "text-gray-500"}`}
              >
                {stepObj.icon}
                {stepObj.label}
              </span>
            ))}
          </div>
          <div className="h-2 bg-gray-300 rounded-full">
            <div
              className="h-2 bg-black rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
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
              onSubmit={onSubmit}
            />
          </FormProvider>
        )}
      </section>
    </main>
  );
}
