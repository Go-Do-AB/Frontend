"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Info,
  MapPin,
  Clock,
  CheckCircleIcon,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

import { Navbar } from "@/components/global/Navbar";
import { Button } from "@/components/ui/button";
import { EventFormStepper } from "@/components/forms/EventFormStepper";
import { EventTicketCard } from "@/components/events/EventTicketCard";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import type { CreateEventFormData } from "@/lib/validation/create-event-schema";
import { CreateEventDto } from "@/types/events";
import {
  createEventSchema,
  createPayload,
  defaultFormValues,
} from "@/lib/validation/create-event-schema";

const steps = [
  { label: "Detaljer", icon: <Info className="w-4 h-4 mr-1" /> },
  { label: "Plats", icon: <MapPin className="w-4 h-4 mr-1" /> },
  { label: "Datum & Tid", icon: <Clock className="w-4 h-4 mr-1" /> },
  { label: "Spotlight", icon: <Sparkles className="w-4 h-4 mr-1" /> },
  { label: "Bekräfta", icon: <CheckCircleIcon className="w-4 h-4 mr-1" /> },
];

export default function CreateEventPage() {
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<CreateEventFormData | null>(null);

  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
  });

  const { mutate } = useCreateEvent();

  const handleCreateAnother = () => {
    form.reset(defaultFormValues);
    setStep(0);
    setMaxStep(0);
    setFormSubmitted(false);
    setSubmittedData(null);
  };

  const totalSteps = steps.length;
  const lastIndex = totalSteps - 1;

  const nextStep = () => {
    const next = Math.min(step + 1, lastIndex);
    setStep(next);
    setMaxStep((m) => Math.max(m, next));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = (data: CreateEventFormData) => {
    try {
      const payload: CreateEventDto = createPayload(data);

      mutate(payload, {
        onSuccess: () => {
          setSubmittedData(data);
          setFormSubmitted(true);
          toast(
            <div className="flex items-start gap-3 text-black">
              <CheckCircle className="text-green-500 mt-1" />
              <div>
                <p className="font-semibold">Evenemanget skapades!</p>
                <p className="text-sm">Ditt evenemang är nu publicerat på Go.Do.</p>
              </div>
            </div>
          );
        },
        onError: () => {
          toast(
            <div className="flex items-start gap-3 text-black">
              <XCircle className="text-red-500 mt-1" />
              <div>
                <p className="font-semibold">Kunde inte skicka in</p>
                <p className="text-sm">Kontrollera dina uppgifter och försök igen.</p>
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
            <p className="font-semibold">Oväntat fel</p>
            <p className="text-sm">Något gick fel, försök igen senare.</p>
          </div>
        </div>
      );
    }
  };

  return (
    <main className="min-h-screen bg-brand text-black flex flex-col">
      <Navbar />
      <section className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-xl mb-4">
          <Link href="/landing">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-black/10">
              <ArrowLeft className="w-4 h-4" />
              Tillbaka till startsidan
            </Button>
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-6">Skapa ett evenemang</h1>

        <div className="w-full max-w-xl mb-6">
          <div className="flex justify-between text-sm font-medium mb-2">
            {steps.map((stepObj, i) => (
              <button
                key={i}
                type="button"
                onClick={() => i !== step && i <= maxStep && setStep(i)}
                className={`flex items-center gap-1 ${
                  i <= maxStep ? "text-black" : "text-gray-500"
                } ${i !== step && i <= maxStep ? "cursor-pointer hover:underline" : "cursor-default"}`}
              >
                {stepObj.icon}
                {stepObj.label}
              </button>
            ))}
          </div>
          <div className="h-2 bg-gray-300 rounded-full">
            <div
              className="h-2 bg-black rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {formSubmitted && submittedData ? (
          <EventTicketCard eventData={submittedData} onCreateAnother={handleCreateAnother} />
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
