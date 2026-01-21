"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

import { Navbar } from "@/components/global/Navbar";
import { Button } from "@/components/ui/button";
import { EventFormStepper } from "@/components/forms/EventFormStepper";
import { useEvent, useUpdateEvent } from "@/hooks/useEvents";
import type { CreateEventFormData } from "@/lib/validation/create-event-schema";
import { UpdateEventDto } from "@/types/events";
import {
  createEventSchema,
  createPayload,
  eventDtoToFormData,
} from "@/lib/validation/create-event-schema";

const steps = [
  { label: "Details", icon: <Info className="w-4 h-4 mr-1" /> },
  { label: "Location", icon: <MapPin className="w-4 h-4 mr-1" /> },
  { label: "Date & Time", icon: <Clock className="w-4 h-4 mr-1" /> },
  { label: "Spotlight", icon: <Sparkles className="w-4 h-4 mr-1" /> },
  { label: "Confirm", icon: <CheckCircleIcon className="w-4 h-4 mr-1" /> },
];

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [step, setStep] = useState(0);
  const [isFormReady, setIsFormReady] = useState(false);

  const { data: eventData, isLoading: isLoadingEvent, error: eventError } = useEvent(eventId);
  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent();

  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
  });

  // Populate form when event data is loaded
  useEffect(() => {
    if (eventData?.isSuccess && eventData.data) {
      const formData = eventDtoToFormData(eventData.data);
      form.reset(formData);
      setIsFormReady(true);
    }
  }, [eventData, form]);

  const totalSteps = steps.length;
  const lastIndex = totalSteps - 1;

  const nextStep = () => setStep((s) => Math.min(s + 1, lastIndex));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = (data: CreateEventFormData) => {
    try {
      const payload: UpdateEventDto = createPayload(data);

      updateEvent(
        { id: eventId, data: payload },
        {
          onSuccess: () => {
            toast(
              <div className="flex items-start gap-3 text-black">
                <CheckCircle className="text-green-500 mt-1" />
                <div>
                  <p className="font-semibold">Event updated!</p>
                  <p className="text-sm">Your changes have been saved.</p>
                </div>
              </div>
            );
            router.push("/my-events");
          },
          onError: () => {
            toast(
              <div className="flex items-start gap-3 text-black">
                <XCircle className="text-red-500 mt-1" />
                <div>
                  <p className="font-semibold">Update failed</p>
                  <p className="text-sm">Please check your input and try again.</p>
                </div>
              </div>
            );
          },
        }
      );
    } catch (err) {
      console.error(err);
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

  // Loading state
  if (isLoadingEvent || !isFormReady) {
    return (
      <main className="min-h-screen bg-yellow-400 text-black flex flex-col">
        <Navbar />
        <section className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p>Loading event...</p>
          </div>
        </section>
      </main>
    );
  }

  // Error state
  if (eventError || !eventData?.isSuccess) {
    return (
      <main className="min-h-screen bg-yellow-400 text-black flex flex-col">
        <Navbar />
        <section className="flex-1 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Event not found</h2>
            <p className="text-gray-600 mb-4">
              The event you&apos;re trying to edit doesn&apos;t exist.
            </p>
            <button
              onClick={() => router.push("/my-events")}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Back to My Events
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-yellow-400 text-black flex flex-col">
      <Navbar />
      <section className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-xl mb-4">
          <Link href="/my-events">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-black/10">
              <ArrowLeft className="w-4 h-4" />
              Back to My Events
            </Button>
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-6">Edit Event</h1>

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

        <FormProvider {...form}>
          <EventFormStepper
            step={step}
            nextStep={nextStep}
            prevStep={prevStep}
            onSubmit={onSubmit}
          />
        </FormProvider>

        {isUpdating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Saving changes...</span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
