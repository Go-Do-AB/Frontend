"use client";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Navbar } from "@/components/global/Navbar";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

import { FormData, createEventSchema } from "@/hooks/useEventForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventFormStepper } from "@/components/forms/EventFormStepper";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import { combineDateTime, toLocalISOString } from "@/lib/utils";

export default function CreateEventPage() {
  const [step, setStep] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startDate: undefined,
      endDate: undefined,
      startTime: "",
      endTime: "",
    },
  });

  const { mutate } = useCreateEvent();

  const nextStep = () => setStep((s) => Math.min(s + 1, 2));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = (data: FormData) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        location: data.location,
        startDate: toLocalISOString(combineDateTime(data.startDate, data.startTime)),
        endDate: toLocalISOString(combineDateTime(data.endDate, data.endTime)),
      };

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

// "use client";

// import { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { format, setHours, setMinutes } from "date-fns";
// import { toast } from "sonner";
// import { Type, AlignLeft, MapPin, CalendarArrowDown, CalendarArrowUp, Clock } from "lucide-react";

// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { CheckCircle, XCircle } from "lucide-react";
// import { CalendarIcon } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Navbar } from "@/components/global/Navbar";
// import { TimePicker } from "@/components/forms/TimePicker";
// import { CreateEventDto } from "@/types/events";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { useCreateEvent } from "@/hooks/useCreateEvent";

// const createEventSchema = z.object({
//   title: z.string().min(1, "Title is required"),
//   description: z.string().min(1, "Description is required"),
//   location: z.string().min(1, "Location is required"),
//   startDate: z.date().refine((d) => d instanceof Date, {
//     message: "Start date is required",
//   }),
//   endDate: z.date().refine((d) => d instanceof Date, {
//     message: "End date is required",
//   }),
//   startTime: z.string().min(1, "Start time is required"),
//   endTime: z.string().min(1, "End time is required"),
// });

// type FormData = z.infer<typeof createEventSchema>;

// const steps = ["Details", "Timing", "Confirm"];

// // const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
// //   const h = Math.floor(i / 2)
// //     .toString()
// //     .padStart(2, "0");
// //   const m = i % 2 === 0 ? "00" : "30";
// //   return `${h}:${m}`;
// // });

// export default function CreateEventPage() {
//   const [formSubmitted, setFormSubmitted] = useState(false);
//   const [step, setStep] = useState(0);

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//     getValues,
//   } = useForm<FormData>({
//     resolver: zodResolver(createEventSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       location: "",
//       startDate: undefined,
//       startTime: "",
//       endDate: undefined,
//       endTime: "",
//     },
//   });

//   const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
//   const prevStep = () => setStep((s) => Math.max(s - 1, 0));

//   function toLocalISOString(date: Date) {
//     const pad = (n: number) => n.toString().padStart(2, "0");

//     return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
//       date.getDate()
//     )}T${pad(date.getHours())}:${pad(date.getMinutes())}:00.000`;
//   }

//   const { mutate } = useCreateEvent();

//   const onSubmit = (data: FormData) => {
//     if (!data.startDate || !data.startTime || !data.endDate || !data.endTime) {
//       toast.error("Please fill in both date and time.");
//       return;
//     }

//     try {
//       const start = combineDateTime(data.startDate, data.startTime);
//       const end = combineDateTime(data.endDate, data.endTime);

//       const payload: CreateEventDto = {
//         title: data.title,
//         description: data.description,
//         location: data.location,
//         startDate: toLocalISOString(start),
//         endDate: toLocalISOString(end),
//       };

//       mutate(payload, {
//         onSuccess: () => {
//           setFormSubmitted(true);
//           toast(
//             <div className="flex items-start gap-3 text-black">
//               <CheckCircle className="text-green-500 mt-1" />
//               <div>
//                 <p className="font-semibold">Event created!</p>
//                 <p className="text-sm">Your event is now live on Go.Do.</p>
//               </div>
//             </div>
//           );
//         },
//         onError: () => {
//           toast(
//             <div className="flex items-start gap-3 text-black">
//               <XCircle className="text-red-500 mt-1" />
//               <div>
//                 <p className="font-semibold">Submission failed</p>
//                 <p className="text-sm">Please check your input and try again.</p>
//               </div>
//             </div>
//           );
//         },
//       });
//     } catch (err) {
//       console.log(err);
//       toast(
//         <div className="flex items-start gap-3 text-black">
//           <XCircle className="text-red-500 mt-1" />
//           <div>
//             <p className="font-semibold">Unexpected error</p>
//             <p className="text-sm">An unexpected error occurred.</p>
//           </div>
//         </div>
//       );
//     }
//   };

//   const combineDateTime = (date: Date, time: string) => {
//     const [h, m] = time.split(":").map(Number);
//     return setMinutes(setHours(date, h), m);
//   };

//   return (
//     <main className="min-h-screen bg-yellow-400 text-black flex flex-col">
//       <Navbar />
//       <section className="flex-1 flex flex-col items-center px-6 py-10">
//         <h1 className="text-4xl font-bold mb-6">Create an Event</h1>

//         {/* Stepper */}
//         <div className="w-full max-w-xl mb-6">
//           <div className="flex justify-between text-sm font-medium mb-2">
//             {steps.map((label, i) => (
//               <span key={i} className={cn(i <= step ? "text-black" : "text-gray-500")}>
//                 {label}
//               </span>
//             ))}
//           </div>
//           <div className="h-2 bg-gray-300 rounded-full">
//             <div
//               className="h-2 bg-black rounded-full transition-all duration-300"
//               style={{ width: `${((step + 1) / steps.length) * 100}%` }}
//             />
//           </div>
//         </div>

//         {formSubmitted ? (
//           <div className="text-center space-y-4">
//             <h2 className="text-2xl font-bold">Tack för ditt bidrag!</h2>
//             <p>Eventet har skickats in och kommer snart att synas på Go.Do.</p>
//           </div>
//         ) : (
//           <form className="w-full max-w-xl bg-white p-6 rounded-lg shadow space-y-4">
//             {step === 0 && (
//               <>
//                 <div>
//                   <Input placeholder="Event Title" {...register("title")} />
//                   {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
//                 </div>
//                 <div>
//                   <Textarea placeholder="Event Description" {...register("description")} />
//                   {errors.description && (
//                     <p className="text-red-500 text-sm">{errors.description.message}</p>
//                   )}
//                 </div>
//                 <div>
//                   <Input placeholder="Location" {...register("location")} />
//                   {errors.location && (
//                     <p className="text-red-500 text-sm">{errors.location.message}</p>
//                   )}
//                 </div>
//               </>
//             )}

//             {step === 1 && (
//               <div className="space-y-6">
//                 {/* Start */}
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Start</label>
//                   <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
//                     <div className="w-full sm:w-auto">
//                       <Controller
//                         name="startDate"
//                         control={control}
//                         render={({ field }) => (
//                           <Calendar
//                             mode="single"
//                             selected={field.value}
//                             onSelect={field.onChange}
//                             className="rounded-md border shadow bg-white"
//                           />
//                         )}
//                       />
//                       {errors.startDate && (
//                         <p className="text-red-500 text-sm">{errors.startDate.message}</p>
//                       )}
//                     </div>
//                     <div className="flex-1 flex items-center h-full">
//                       <Controller
//                         name="startTime"
//                         control={control}
//                         render={({ field }) => (
//                           <TimePicker
//                             value={field.value}
//                             onChange={field.onChange}
//                             placeholder="Start with"
//                             label="Start Time"
//                           />
//                         )}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* End */}
//                 <div>
//                   <label className="block text-sm font-medium mb-2">End</label>
//                   <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
//                     <div className="w-full sm:w-auto">
//                       <Controller
//                         name="endDate"
//                         control={control}
//                         render={({ field }) => (
//                           <Calendar
//                             mode="single"
//                             selected={field.value}
//                             onSelect={field.onChange}
//                             className="rounded-md border shadow bg-white"
//                           />
//                         )}
//                       />
//                       {errors.endDate && (
//                         <p className="text-red-500 text-sm">{errors.endDate.message}</p>
//                       )}
//                     </div>
//                     <div className="flex-1 flex items-center h-full">
//                       <Controller
//                         name="endTime"
//                         control={control}
//                         render={({ field }) => (
//                           <TimePicker
//                             value={field.value}
//                             onChange={field.onChange}
//                             placeholder="End with"
//                             label="End Time"
//                           />
//                         )}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {step === 2 && (
//               <div className="w-full max-w-xl space-y-4">
//                 <h2 className="text-xl font-semibold text-center">Review your event info</h2>

//                 <Card className="bg-gray-50">
//                   <CardContent className="space-y-4 pt-6">
//                     <div className="flex items-start gap-3">
//                       <Type className="w-5 h-5 mt-1 text-muted-foreground" />
//                       <div>
//                         <Label className="text-muted-foreground">Title</Label>
//                         <p className="text-lg font-medium">{getValues("title")}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-3">
//                       <AlignLeft className="w-5 h-5 mt-1 text-muted-foreground" />
//                       <div>
//                         <Label className="text-muted-foreground">Description</Label>
//                         <p>{getValues("description")}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-3">
//                       <MapPin className="w-5 h-5 mt-1 text-muted-foreground" />
//                       <div>
//                         <Label className="text-muted-foreground">Location</Label>
//                         <p>{getValues("location")}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-3">
//                       <CalendarArrowDown className="w-5 h-5 mt-1 text-muted-foreground" />
//                       <div>
//                         <Label className="text-muted-foreground">Start</Label>
//                         <div className="flex items-center gap-4">
//                           <div className="flex items-center gap-1">
//                             <CalendarIcon className="w-4 h-4 text-muted-foreground" />
//                             <span>{format(getValues("startDate"), "dd.MM.yyyy")}</span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <Clock className="w-4 h-4 text-muted-foreground" />
//                             <span>{getValues("startTime")}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-3">
//                       <CalendarArrowUp className="w-5 h-5 mt-1 text-muted-foreground" />
//                       <div>
//                         <Label className="text-muted-foreground">End</Label>
//                         <div className="flex items-center gap-4">
//                           <div className="flex items-center gap-1">
//                             <CalendarIcon className="w-4 h-4 text-muted-foreground" />
//                             <span>{format(getValues("endDate"), "dd.MM.yyyy")}</span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <Clock className="w-4 h-4 text-muted-foreground" />
//                             <span>{getValues("endTime")}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             )}

//             {/* Navigation */}
//             <div className="flex justify-between pt-4">
//               <Button type="button" variant="outline" onClick={prevStep} disabled={step === 0}>
//                 Back
//               </Button>
//               {step < steps.length - 1 ? (
//                 <Button type="button" onClick={nextStep}>
//                   Next
//                 </Button>
//               ) : (
//                 <Button
//                   onClick={handleSubmit(onSubmit)}
//                   type="button"
//                   className="bg-black text-white hover:bg-gray-800"
//                 >
//                   Submit
//                 </Button>
//               )}
//             </div>
//           </form>
//         )}
//       </section>
//     </main>
//   );
// }

// // // Reusable date picker using Shadcn calendar
// // function DatePicker({
// //   value,
// //   onChange,
// //   placeholder,
// // }: {
// //   value: Date | undefined;
// //   onChange: (date: Date | undefined) => void;
// //   placeholder: string;
// // }) {
// //   return (
// //     <Popover>
// //       <PopoverTrigger asChild>
// //         <Button
// //           variant="outline"
// //           className={cn(
// //             "w-full justify-start text-left font-normal",
// //             !value && "text-muted-foreground"
// //           )}
// //         >
// //           <CalendarIcon className="mr-2 h-4 w-4" />
// //           {value ? format(value, "PPP") : <span>{placeholder}</span>}
// //         </Button>
// //       </PopoverTrigger>
// //       <PopoverContent className="w-auto p-0 bg-white">
// //         <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
// //       </PopoverContent>
// //     </Popover>
// //   );
// // }
