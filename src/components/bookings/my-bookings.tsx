"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
  MapPinIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, StatusBadge } from "@/components/shared/status-badge";
import { SectionHeading } from "@/components/shared/section-heading";
import { cancelBooking, fetchMyBookings } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";
import { InvoiceModal } from "./invoice-modal";
import type { Booking } from "@/lib/types";

export function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [pendingCancel, setPendingCancel] = React.useState<Booking | null>(
    null,
  );
  const [invoiceBooking, setInvoiceBooking] = React.useState<Booking | null>(
    null,
  );
  const [cancelling, setCancelling] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchMyBookings();
        if (!cancelled) setBookings(list);
      } catch (err) {
        if (!cancelled) {
          toast.error(getErrorMessage(err, "Could not load your bookings"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function confirmCancel() {
    if (!pendingCancel) return;
    setCancelling(true);
    try {
      const updated = await cancelBooking(pendingCancel._id);
      setBookings((list) =>
        list.map((b) =>
          b._id === pendingCancel._id ? { ...b, status: updated.status } : b,
        ),
      );
      toast.success("Booking cancelled — any deposit will be refunded.");
      setPendingCancel(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not cancel that booking"));
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="section-pad py-10 sm:py-14">
      <SectionHeading
        align="left"
        className="mb-8"
        eyebrow="Creator Dashboard"
        title="My Bookings"
        description="Every reservation you've made, with live status and one-tap cancellation for pending slots."
      />

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row"
            >
              <Skeleton className="aspect-[4/3] w-full rounded-lg sm:size-32" />
              <div className="flex flex-1 flex-col gap-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="When you reserve a studio, the details — date, hours, rate and status — will show up right here."
          actionLabel="Explore Studios"
          actionHref="/studios"
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <li
              key={booking._id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center"
            >
              {/* Thumbnail */}
              <Link
                href={`/studios/${booking.studioId}`}
                className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:size-32"
              >
                <Image
                  src={booking.studioImage}
                  alt={booking.studioTitle}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </Link>

              {/* Details */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/studios/${booking.studioId}`}
                    className="text-base leading-snug font-bold transition-colors hover:text-primary sm:text-lg"
                  >
                    {booking.studioTitle}
                  </Link>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="size-4 text-signal" />
                    {new Date(`${booking.date}T00:00:00`).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ClockIcon className="size-4 text-signal" />
                    {booking.startTime} – {booking.endTime} ({booking.hours}h)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPinIcon className="size-4 text-signal" />
                    <span className="truncate">{booking.studioLocation}</span>
                  </span>
                </div>

                <p className="mt-2.5 text-lg font-extrabold">
                  <span className="text-primary">
                    ${booking.totalAmount}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {" "}
                    total
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
                {booking.status === "Pending" ? (
                  <Button
                    variant="destructive"
                    onClick={() => setPendingCancel(booking)}
                    className="h-9 gap-1.5 rounded-full px-5 text-sm font-semibold"
                  >
                    <XIcon className="size-3.5" />
                    Cancel Booking
                  </Button>
                ) : (
                  <span className="px-1 text-xs text-muted-foreground">
                    {booking.status === "Cancelled"
                      ? "No longer active"
                      : "Contact the host to modify"}
                  </span>
                )}
                <Button
                  variant="outline"
                  onClick={() => setInvoiceBooking(booking)}
                  className="h-9 gap-1.5 rounded-full px-5 text-sm font-semibold"
                >
                  <FileTextIcon className="size-3.5" />
                  Invoice
                </Button>
                <Button
                  render={<Link href={`/studios/${booking.studioId}`} />}
                  nativeButton={false}
                  variant="outline"
                  className="h-9 rounded-full px-5 text-sm font-semibold"
                >
                  View Studio
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Confirmation modal */}
      <AlertDialog
        open={!!pendingCancel}
        onOpenChange={(open) => !open && setPendingCancel(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Your reservation at “{pendingCancel?.studioTitle}” on{" "}
              {pendingCancel?.date} will be released. Refunds follow the
              24-hour cancellation policy.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>
              Keep booking
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void confirmCancel();
              }}
              disabled={cancelling}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {cancelling ? "Cancelling…" : "Yes, cancel it"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <InvoiceModal
        booking={invoiceBooking}
        open={!!invoiceBooking}
        onOpenChange={(o) => !o && setInvoiceBooking(null)}
      />
    </div>
  );
}
