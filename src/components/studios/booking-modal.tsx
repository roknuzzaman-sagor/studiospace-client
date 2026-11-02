"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { createBooking } from "@/lib/api";
import type { Studio } from "@/lib/types";

const TIMES = Array.from({ length: 17 }, (_, i) => {
  const h = 6 + i;
  return `${String(h).padStart(2, "0")}:00`;
});

interface BookingModalProps {
  studio: Studio;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingModal({ studio, open, onOpenChange }: BookingModalProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [date, setDate] = React.useState("");
  const [startTime, setStartTime] = React.useState("09:00");
  const [endTime, setEndTime] = React.useState("12:00");
  const [submitting, setSubmitting] = React.useState(false);

  const hours =
    Number(endTime.split(":")[0]) - Number(startTime.split(":")[0]);
  const validRange = hours > 0;
  const total = validRange ? studio.hourlyRate * hours : 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      toast.error("Sign in to book this studio.");
      onOpenChange(false);
      router.push(`/login?next=/studios/${studio._id}`);
      return;
    }
    if (!date) {
      toast.error("Please choose a booking date.");
      return;
    }
    if (!validRange) {
      toast.error("End time must be after the start time.");
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({
        studioId: studio._id,
        studioTitle: studio.title,
        studioImage: studio.imageUrl,
        studioLocation: studio.location,
        userEmail: user.email,
        date,
        startTime,
        endTime,
        hours,
        totalAmount: total,
      });
      toast.success(
        `Booking requested for ${date} — we'll confirm it shortly.`,
      );
      onOpenChange(false);
      router.push("/my-bookings");
    } catch (err) {
      // Challenge 2: server rejects overlapping confirmed bookings with a clear message
      toast.error(
        err instanceof Error
          ? err.message
          : "That slot was just taken — pick another time.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0">
        {/* Header band */}
        <div className="relative bg-[oklch(0.16_0.015_255)] px-6 py-5">
          <span className="vf-outer pointer-events-none absolute inset-3 !text-white/35">
            <span className="vf-inner !text-white/35" />
          </span>
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-xl font-extrabold text-white">
              Book Workspace Now
            </DialogTitle>
            <DialogDescription className="text-white/70">
              {studio.title}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
          {/* Price summary */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 px-4 py-3">
            <div>
              <p className="text-xs text-muted-foreground">Hourly rate</p>
              <p className="text-lg font-extrabold">
                <span className="text-primary">${studio.hourlyRate}</span>
                <span className="text-sm font-medium text-muted-foreground">
                  {" "}
                  / hr
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                Refundable deposit
              </p>
              <p className="text-lg font-extrabold">
                ${studio.securityDeposit}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="booking-date">Date</Label>
            <div className="relative">
              <CalendarIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="booking-date"
                type="date"
                required
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="h-10 rounded-lg pr-3 pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="start-time">Start time</Label>
              <Select
              value={startTime}
              onValueChange={(v) => v && setStartTime(v)}
            >
                <SelectTrigger id="start-time" className="h-10 w-full rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="end-time">End time</Label>
              <Select value={endTime} onValueChange={(v) => v && setEndTime(v)}>
                <SelectTrigger id="end-time" className="h-10 w-full rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Live total */}
          <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <SparklesIcon className="size-4 text-primary" />
              {validRange ? (
                <span>
                  {hours} {hours === 1 ? "hour" : "hours"} × ${studio.hourlyRate}
                </span>
              ) : (
                <span className="text-destructive">
                  End time must be after start time
                </span>
              )}
            </div>
            <p className="text-xl font-extrabold">
              {validRange ? `$${total}` : "—"}
            </p>
          </div>

          {!user ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              You&apos;ll be asked to sign in before the reservation is saved.
            </p>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 flex-1 rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !validRange}
              className="beam h-11 flex-1 gap-2 rounded-full font-bold"
            >
              {submitting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Reserving…
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
