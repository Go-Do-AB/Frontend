"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Plus,
  MapPin,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { Navbar } from "@/components/global/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useEvents, usePatchEvent, useDeleteEvent } from "@/hooks/useEvents";
import type { EventDto, PatchEventDto } from "@/types/events";

export default function MyEventsPage() {
  const router = useRouter();
  const [pageNumber, setPageNumber] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);

  // Get user ID from JWT token (NameIdentifier claim)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // Look for user ID claim (NameIdentifier in .NET JWT)
      const id =
        payload.sub ||
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
        payload.nameid;
      setUserId(id || null);
    } catch {
      // If token parsing fails, redirect to login
      router.push("/login");
    }
  }, [router]);

  const { data, isLoading, error, refetch } = useEvents(
    userId
      ? { createdById: userId, isActive: true, pageNumber, pageSize: 10 }
      : undefined
  );

  const { mutate: patchEvent, isPending: isPatching } = usePatchEvent();
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();

  // Edit state
  const [editingEvent, setEditingEvent] = useState<EventDto | null>(null);
  const [editForm, setEditForm] = useState<PatchEventDto>({});

  // Delete state
  const [deletingEvent, setDeletingEvent] = useState<EventDto | null>(null);

  const events = data?.data?.items || [];
  const totalCount = data?.data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / 10);

  const handleEditClick = (event: EventDto) => {
    setEditingEvent(event);
    setEditForm({
      title: event.title,
      description: event.description || "",
      streetName: event.streetName,
      streetName2: event.streetName2 || "",
      city: event.city,
      postalCode: event.postalCode,
      gpsCoordinates: event.gpsCoordinates || "",
      eventUrl: event.eventUrl || "",
      bookingUrl: event.bookingUrl || "",
    });
  };

  const handleEditSave = () => {
    if (!editingEvent) return;

    patchEvent(
      { id: editingEvent.id, data: editForm },
      {
        onSuccess: () => {
          toast.success("Event updated successfully");
          setEditingEvent(null);
          refetch();
        },
        onError: () => {
          toast.error("Failed to update event");
        },
      }
    );
  };

  const handleDeleteClick = (event: EventDto) => {
    setDeletingEvent(event);
  };

  const handleDeleteConfirm = () => {
    if (!deletingEvent) return;

    deleteEvent(deletingEvent.id, {
      onSuccess: () => {
        toast.success("Event deleted successfully");
        setDeletingEvent(null);
        refetch();
      },
      onError: () => {
        toast.error("Failed to delete event");
      },
    });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("sv-SE");
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "";
    // Handle both ISO string and HH:mm format
    if (timeStr.includes("T")) {
      return new Date(timeStr).toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return timeStr;
  };

  if (!userId) {
    return (
      <main className="min-h-screen bg-yellow-400 text-black flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-yellow-400 text-black flex flex-col">
      <Navbar />

      <section className="flex-1 px-6 py-10 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Events</h1>
          <Button onClick={() => router.push("/create-event")} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Event
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}

        {error && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="py-6 text-center text-red-700">
              Failed to load events. Please try again.
            </CardContent>
          </Card>
        )}

        {!isLoading && events.length === 0 && (
          <Card className="bg-white">
            <CardContent className="py-12 text-center">
              <p className="text-lg text-gray-600 mb-4">No events yet</p>
              <Button onClick={() => router.push("/create-event")}>
                Create your first event
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && events.length > 0 && (
          <>
            <div className="space-y-4">
              {events.map((event) => (
                <Card key={event.id} className="bg-white">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          {event.organiser}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(event)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteClick(event)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
                        <div>
                          <p>{event.streetName}</p>
                          <p>
                            {event.postalCode} {event.city}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 mt-0.5 text-gray-500" />
                        <div>
                          {event.isAlwaysOpen ? (
                            <p>Always open</p>
                          ) : event.hasSingleDates ? (
                            <>
                              <p>Start: {formatDate(event.startDate)}</p>
                              <p>End: {formatDate(event.endDate)}</p>
                            </>
                          ) : (
                            <p>Recurring event</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 mt-0.5 text-gray-500" />
                        <div>
                          {event.scheduleStartTime || event.startDate ? (
                            <p>
                              {formatTime(event.scheduleStartTime) ||
                                formatTime(event.startDate)}{" "}
                              -{" "}
                              {formatTime(event.scheduleEndTime) ||
                                formatTime(event.endDate)}
                            </p>
                          ) : (
                            <p>-</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {event.categories.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {event.categories.map((cat) => (
                          <span
                            key={cat.code}
                            className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                  disabled={pageNumber === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm">
                  Page {pageNumber} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
                  disabled={pageNumber === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Edit Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the event details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Title</Label>
              <Input
                value={editForm.title || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editForm.description || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Street Name</Label>
                <Input
                  value={editForm.streetName || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, streetName: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Street Name 2</Label>
                <Input
                  value={editForm.streetName2 || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, streetName2: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>City</Label>
                <Input
                  value={editForm.city || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, city: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Postal Code</Label>
                <Input
                  value={editForm.postalCode || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, postalCode: e.target.value }))
                  }
                />
              </div>
            </div>
            <div>
              <Label>GPS Coordinates</Label>
              <Input
                placeholder="e.g., 56.0465, 12.6945"
                value={editForm.gpsCoordinates || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, gpsCoordinates: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Event URL</Label>
              <Input
                value={editForm.eventUrl || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, eventUrl: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Booking URL</Label>
              <Input
                value={editForm.bookingUrl || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, bookingUrl: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingEvent(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave} disabled={isPatching}>
              {isPatching && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingEvent} onOpenChange={() => setDeletingEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingEvent?.title}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingEvent(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
