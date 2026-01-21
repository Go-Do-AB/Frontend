"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { MapPin, Calendar, Clock, Ticket, LogOut, Plus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CreateEventFormData } from "@/lib/validation/create-event-schema";
import { categoryOptions } from "@/lib/content/contentText";

interface EventTicketCardProps {
  eventData: CreateEventFormData;
  onCreateAnother: () => void;
}

export function EventTicketCard({ eventData, onCreateAnother }: EventTicketCardProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  const handleBackToStart = () => {
    router.push("/landing");
  };

  // Get category name from code
  const categoryName = eventData.categories?.[0]
    ? categoryOptions.find((c) => c.code === eventData.categories[0])?.label
    : null;

  // Format dates
  const formattedStartDate = eventData.startDate
    ? format(new Date(eventData.startDate), "d MMM yyyy")
    : null;
  const formattedEndDate = eventData.endDate
    ? format(new Date(eventData.endDate), "d MMM yyyy")
    : null;

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Success header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="bg-green-500 rounded-full p-3">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Tack för ditt bidrag!</h2>
        <p className="text-gray-700">Eventet har skickats in och kommer snart att synas på Go.Do.</p>
      </div>

      {/* Ticket Card */}
      <Card className="overflow-hidden border-2 border-black bg-white shadow-lg">
        {/* Ticket header with dashed border effect */}
        <div className="bg-black text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5" />
            <span className="font-semibold">Event Ticket</span>
          </div>
          <span className="text-xs opacity-70">Go.Do.</span>
        </div>

        {/* Placeholder image */}
        <div className="relative h-40 bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-2">🎉</div>
            <span className="text-sm font-medium text-black/70">Event Image Coming Soon</span>
          </div>
          {categoryName && (
            <span className="absolute top-3 right-3 bg-black text-white text-xs px-2 py-1 rounded-full">
              {categoryName}
            </span>
          )}
        </div>

        {/* Dashed divider - ticket tear effect */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center px-4">
            <div className="w-full border-t-2 border-dashed border-gray-300" />
          </div>
          <div className="relative flex justify-between">
            <div className="w-4 h-4 -ml-2 bg-yellow-400 rounded-full" />
            <div className="w-4 h-4 -mr-2 bg-yellow-400 rounded-full" />
          </div>
        </div>

        <CardContent className="pt-4 space-y-4">
          {/* Event title */}
          <h3 className="text-xl font-bold text-black truncate">{eventData.title || "Untitled Event"}</h3>

          {/* Event details */}
          <div className="space-y-2 text-sm">
            {/* Date */}
            {formattedStartDate && (
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>
                  {formattedStartDate}
                  {formattedEndDate && formattedEndDate !== formattedStartDate && ` - ${formattedEndDate}`}
                </span>
              </div>
            )}

            {eventData.isAlwaysOpen && (
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>Always Open</span>
              </div>
            )}

            {/* Location */}
            {(eventData.streetName || eventData.city) && (
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="truncate">
                  {[eventData.streetName, eventData.city].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
          </div>

          {/* Organiser */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">Organised by</p>
            <p className="font-medium text-black">{eventData.organiser || "Unknown"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="space-y-3">
        <Button
          onClick={onCreateAnother}
          className="w-full bg-black text-white hover:bg-black/90 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Another Event
        </Button>

        <div className="flex gap-3">
          <Button
            onClick={handleBackToStart}
            variant="outline"
            className="flex-1 border-black/20 hover:bg-gray-100"
          >
            Back to Start
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
