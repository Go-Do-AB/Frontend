import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Controller, FieldErrors, UseFormRegister, Control } from "react-hook-form";
import { FormData } from "@/hooks/useEventForm";

// Icons
import {
  Baby,
  CalendarDays,
  Dribbble,
  Clapperboard,
  Landmark,
  Mountain,
  BookOpen,
  HeartPulse,
} from "lucide-react";

interface StepDetailsProps {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}

// Category options with Lucide icons

export function StepEventDetails({ register, control, errors }: StepDetailsProps) {
  const categoryOptions = [
    { label: "Fun for Kids", icon: Baby },
    { label: "Events", icon: CalendarDays },
    { label: "Sports", icon: Dribbble },
    { label: "Entertainment", icon: Clapperboard },
    { label: "Culture & Sights", icon: Landmark },
    { label: "Adventures", icon: Mountain },
    { label: "Learn & Explore", icon: BookOpen },
    { label: "Health & Wellbeing", icon: HeartPulse },
  ];
  return (
    <div className="space-y-4">
      <div>
        <Label className="py-2 block">
          Organiser <span className="text-red-500">*</span>
        </Label>
        <Input placeholder="Organiser name" {...register("organiser")} />
        {errors.organiser && <p className="text-red-500 text-sm">{errors.organiser.message}</p>}
      </div>

      <div>
        <Label className="py-2 block">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input placeholder="Event Title" {...register("title")} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>
      <div>
        <Label className="py-2 block">Select Categories</Label>
        <Controller
          control={control}
          name="categories"
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {categoryOptions.map(({ label, icon: Icon }) => {
                const isSelected = (field.value ?? []).includes(label);

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      const current = field.value ?? [];
                      const newValue = current.includes(label)
                        ? current.filter((val) => val !== label)
                        : [...current, label];
                      field.onChange(newValue);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-xl w-24 h-24 border transition-all",
                      isSelected
                        ? "bg-yellow-400 text-black border-yellow-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium text-center">{label}</span>
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>
      <div>
        <Label className="py-2 block">Description</Label>
        <Textarea placeholder="Event Description" {...register("description")} />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <Label className="py-2 block">Event URL</Label>
        <Input placeholder="https://event-link.com" {...register("eventUrl")} />
        {errors.eventUrl && <p className="text-red-500 text-sm">{errors.eventUrl.message}</p>}
      </div>

      <div>
        <Label className="py-2 block">Booking URL</Label>
        <Input placeholder="https://booking-link.com" {...register("bookingUrl")} />
        {errors.bookingUrl && <p className="text-red-500 text-sm">{errors.bookingUrl.message}</p>}
      </div>
    </div>
  );
}
