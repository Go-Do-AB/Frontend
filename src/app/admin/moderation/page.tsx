"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Shield,
  ShieldX,
  ArrowLeft,
  Loader2,
  Flag,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

import { Navbar } from "@/components/global/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminReports, useDismissReports } from "@/hooks/useReports";
import { useDeleteEvent } from "@/hooks/useEvents";
import {
  ReportedEventSummaryDto,
  ReportReason,
  ReportReasonLabel,
  ReportStatus,
} from "@/types/events";

function getAiScoreBadge(score: number | undefined) {
  if (score === undefined || score === null) {
    return <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">–</span>;
  }
  if (score < 0.3) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
        {score.toFixed(2)}
      </span>
    );
  }
  if (score < 0.7) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">
        {score.toFixed(2)}
      </span>
    );
  }
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
      {score.toFixed(2)}
    </span>
  );
}

function getStatusPill(status: ReportStatus) {
  if (status === ReportStatus.Pending) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">
        Pending
      </span>
    );
  }
  if (status === ReportStatus.Resolved) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
        Resolved
      </span>
    );
  }
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
      Dismissed
    </span>
  );
}

function ReasonChips({ reasons }: { reasons: ReportReason[] }) {
  const MAX_SHOWN = 3;
  const shown = reasons.slice(0, MAX_SHOWN);
  const overflow = reasons.length - MAX_SHOWN;
  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((r) => (
        <span
          key={r}
          className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 whitespace-nowrap"
        >
          {ReportReasonLabel[r]}
        </span>
      ))}
      {overflow > 0 && (
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
          +{overflow}
        </span>
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <tr key={i} className="border-b border-gray-100 animate-pulse">
          <td className="px-4 py-3">
            <div className="h-4 bg-gray-200 rounded w-40" />
            <div className="h-3 bg-gray-100 rounded w-24 mt-1" />
          </td>
          <td className="px-4 py-3">
            <div className="h-6 w-8 bg-gray-200 rounded-full" />
          </td>
          <td className="px-4 py-3">
            <div className="flex gap-1">
              <div className="h-5 w-20 bg-gray-200 rounded-full" />
              <div className="h-5 w-16 bg-gray-200 rounded-full" />
            </div>
          </td>
          <td className="px-4 py-3">
            <div className="h-5 w-12 bg-gray-200 rounded-full" />
          </td>
          <td className="px-4 py-3">
            <div className="h-5 w-16 bg-gray-200 rounded-full" />
          </td>
          <td className="px-4 py-3">
            <div className="flex gap-2">
              <div className="h-8 w-20 bg-gray-200 rounded" />
              <div className="h-8 w-20 bg-gray-200 rounded" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export default function ModerationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isAdmin] = useState<boolean | null>(() => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("accessToken");
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const roles =
        payload.role ||
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        [];
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes("Admin");
    } catch {
      return false;
    }
  });

  const [removeTarget, setRemoveTarget] = useState<{ id: string; title: string } | null>(null);

  const { data, isLoading, isError } = useAdminReports();
  const { mutate: deleteEvent, isPending: isRemoving } = useDeleteEvent();
  const { mutate: dismissReports, isPending: isDismissing } = useDismissReports();

  const reports: ReportedEventSummaryDto[] = data?.data ?? [];
  const sorted = [...reports].sort((a, b) => b.reportCount - a.reportCount);

  function handleRemoveConfirm() {
    if (!removeTarget) return;
    deleteEvent(removeTarget.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
        toast(
          <div className="flex items-start gap-3 text-black">
            <CheckCircle className="text-green-500 mt-1 shrink-0" />
            <div>
              <p className="font-semibold">Event removed</p>
              <p className="text-sm">&ldquo;{removeTarget.title}&rdquo; has been soft-deleted.</p>
            </div>
          </div>
        );
        setRemoveTarget(null);
      },
      onError: () => {
        toast(
          <div className="flex items-start gap-3 text-black">
            <XCircle className="text-red-500 mt-1 shrink-0" />
            <div>
              <p className="font-semibold">Remove failed</p>
              <p className="text-sm">Could not remove the event. Try again.</p>
            </div>
          </div>
        );
      },
    });
  }

  function handleDismiss(eventId: string, eventTitle: string) {
    dismissReports(eventId, {
      onSuccess: () => {
        toast(
          <div className="flex items-start gap-3 text-black">
            <CheckCircle className="text-green-500 mt-1 shrink-0" />
            <div>
              <p className="font-semibold">Reports dismissed</p>
              <p className="text-sm">Reports for &ldquo;{eventTitle}&rdquo; have been dismissed.</p>
            </div>
          </div>
        );
      },
      onError: () => {
        toast(
          <div className="flex items-start gap-3 text-black">
            <XCircle className="text-red-500 mt-1 shrink-0" />
            <div>
              <p className="font-semibold">Dismiss failed</p>
              <p className="text-sm">Could not dismiss reports. Try again.</p>
            </div>
          </div>
        );
      },
    });
  }

  // Permission loading
  if (isAdmin === null) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-orange-300 text-black flex flex-col">
        <Navbar />
        <section className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p>Checking permissions...</p>
          </div>
        </section>
      </main>
    );
  }

  // Access denied
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-orange-300 text-black flex flex-col">
        <Navbar />
        <section className="flex-1 flex items-center justify-center">
          <Card className="max-w-md bg-white shadow-lg">
            <CardContent className="pt-6 text-center space-y-4">
              <ShieldX className="w-16 h-16 text-red-500 mx-auto" />
              <h2 className="text-2xl font-bold">Access Denied</h2>
              <p className="text-gray-600">This page is only accessible to administrators.</p>
              <Button
                onClick={() => router.push("/landing")}
                className="w-full bg-black text-white hover:bg-black/90"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-300 to-orange-300 text-black flex flex-col">
      <Navbar />

      <section className="flex-1 flex flex-col items-center px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-black text-white p-2 rounded-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Moderation</h1>
            <p className="text-sm text-gray-700">Review and action reported events</p>
          </div>
        </div>

        <div className="mb-6 bg-black text-white text-xs px-3 py-1 rounded-full">Admin Only</div>

        {/* Stats bar */}
        {!isLoading && !isError && sorted.length > 0 && (
          <div className="w-full max-w-6xl mb-4 flex gap-3">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium">
              <span className="text-gray-500">Total reported:</span>{" "}
              <span className="font-bold">{sorted.length}</span>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium">
              <span className="text-gray-500">Pending:</span>{" "}
              <span className="font-bold text-orange-600">
                {sorted.filter((r) => r.status === ReportStatus.Pending).length}
              </span>
            </div>
          </div>
        )}

        {/* Table card */}
        <div className="w-full max-w-6xl">
          <Card className="bg-white shadow-lg overflow-hidden">
            <CardContent className="p-0">
              {isError ? (
                <div className="flex flex-col items-center gap-3 py-16 text-gray-500">
                  <AlertTriangle className="w-10 h-10 text-red-400" />
                  <p className="font-medium">Failed to load reports</p>
                  <p className="text-sm">Check your connection or try again.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Event</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Reports</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Reasons</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">AI Score</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <TableSkeleton />
                      ) : sorted.length === 0 ? (
                        <tr>
                          <td colSpan={6}>
                            <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
                              <Flag className="w-10 h-10" />
                              <p className="font-medium text-gray-500">No reported events</p>
                              <p className="text-sm">The platform is clean — nothing to review.</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        sorted.map((report) => (
                          <tr
                            key={report.eventId}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            {/* Event */}
                            <td className="px-4 py-3 max-w-[220px]">
                              <p className="font-medium truncate" title={report.eventTitle}>
                                {report.eventTitle}
                              </p>
                              <p className="text-xs text-gray-400 font-mono truncate">
                                {report.eventId.slice(0, 8)}…
                              </p>
                            </td>

                            {/* Report count */}
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold text-sm">
                                {report.reportCount}
                              </span>
                            </td>

                            {/* Reasons */}
                            <td className="px-4 py-3 max-w-[260px]">
                              <ReasonChips reasons={report.reasons} />
                            </td>

                            {/* AI score */}
                            <td className="px-4 py-3">{getAiScoreBadge(report.aiModerationScore)}</td>

                            {/* Status */}
                            <td className="px-4 py-3">{getStatusPill(report.status)}</td>

                            {/* Actions */}
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                                  onClick={() =>
                                    setRemoveTarget({
                                      id: report.eventId,
                                      title: report.eventTitle,
                                    })
                                  }
                                  disabled={
                                    report.status === ReportStatus.Resolved ||
                                    isRemoving ||
                                    isDismissing
                                  }
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                                  Remove
                                </Button>

                                {report.status === ReportStatus.Pending && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                                    onClick={() =>
                                      handleDismiss(report.eventId, report.eventTitle)
                                    }
                                    disabled={isRemoving || isDismissing}
                                  >
                                    <XCircle className="w-3.5 h-3.5 mr-1" />
                                    Dismiss
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Remove confirm dialog */}
      <Dialog open={!!removeTarget} onOpenChange={(open) => !open && setRemoveTarget(null)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-red-100 p-2 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <DialogTitle>Remove Event</DialogTitle>
            </div>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-medium text-gray-900">&ldquo;{removeTarget?.title}&rdquo;</span>? This will
              soft-delete the event and notify the organiser. This action can be reversed by an
              admin.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRemoveTarget(null)}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleRemoveConfirm}
              disabled={isRemoving}
            >
              {isRemoving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Removing…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Event
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
