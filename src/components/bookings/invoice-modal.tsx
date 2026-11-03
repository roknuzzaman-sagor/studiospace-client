"use client";

import * as React from "react";
import { toast } from "sonner";
import { DownloadIcon, PrinterIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { ApertureMark } from "@/components/shared/logo";
import type { Booking } from "@/lib/types";

interface InvoiceModalProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Booking invoice with a print stylesheet — use the browser's "Save as PDF"
 * from the print dialog to download a PDF copy (no alert() used anywhere).
 */
export function InvoiceModal({ booking, open, onOpenChange }: InvoiceModalProps) {
  const [printFailed, setPrintFailed] = React.useState(false);

  function handlePrint() {
    try {
      window.print();
    } catch {
      setPrintFailed(true);
      toast.error(
        "Your browser blocked printing — use Ctrl+P / Cmd+P and choose “Save as PDF”.",
      );
    }
  }

  if (!booking) return null;

  // Split the booking total into session + 10% service fee so the invoice
  // grand total always matches what the booking card shows
  const serviceFee = Math.round(booking.totalAmount * 0.1);
  const sessionFee = booking.totalAmount - serviceFee;
  const grandTotal = booking.totalAmount;
  const issued = new Date(booking.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0">
        <div className="max-h-[75vh] overflow-y-auto print:max-h-none">
          {/* Invoice document — everything below is what gets printed */}
          <div className="invoice-print bg-white p-6 text-[oklch(0.25_0.02_255)] sm:p-8">
            {/* Letterhead */}
            <div className="flex items-start justify-between gap-4 border-b-2 border-[oklch(0.25_0.02_255)] pb-5">
              <div className="flex items-center gap-2.5">
                <ApertureMark className="size-9 text-[oklch(0.55_0.15_62)]" />
                <div>
                  <p className="font-heading text-lg leading-none font-extrabold tracking-tight">
                    Studio<span className="text-[oklch(0.55_0.15_62)]">Space</span>
                  </p>
                  <p className="mt-1 text-[11px] tracking-wider text-[oklch(0.45_0.02_255)] uppercase">
                    Booking Invoice
                  </p>
                </div>
              </div>
              <div className="text-right text-xs text-[oklch(0.45_0.02_255)]">
                <p className="font-bold text-[oklch(0.25_0.02_255)]">
                  INV-{booking._id.slice(-8).toUpperCase()}
                </p>
                <p>Issued {issued}</p>
                <div className="mt-1.5 flex justify-end">
                  <StatusBadge status={booking.status} />
                </div>
              </div>
            </div>

            {/* Billed to */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-[oklch(0.45_0.02_255)] uppercase">
                  Billed to
                </p>
                <p className="mt-1 text-sm font-semibold">{booking.userEmail}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-[10px] font-bold tracking-widest text-[oklch(0.45_0.02_255)] uppercase">
                  Hosted at
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {booking.studioTitle}
                </p>
                <p className="text-xs text-[oklch(0.45_0.02_255)]">
                  {booking.studioLocation}
                </p>
              </div>
            </div>

            {/* Line items */}
            <table className="mt-5 w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[oklch(0.85_0.01_255)] text-left text-[10px] tracking-widest text-[oklch(0.45_0.02_255)] uppercase">
                  <th className="py-2 font-bold">Description</th>
                  <th className="py-2 text-right font-bold">Date</th>
                  <th className="py-2 text-right font-bold">Hours</th>
                  <th className="py-2 text-right font-bold">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[oklch(0.92_0.005_255)]">
                  <td className="py-3">
                    <p className="font-semibold">{booking.studioTitle}</p>
                    <p className="text-xs text-[oklch(0.45_0.02_255)]">
                      {booking.startTime} – {booking.endTime}
                    </p>
                  </td>
                  <td className="py-3 text-right tabular-nums">
                    {booking.date}
                  </td>
                  <td className="py-3 text-right tabular-nums">
                    {booking.hours}
                  </td>
                  <td className="py-3 text-right font-semibold tabular-nums">
                    ${booking.totalAmount}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-4 flex justify-end">
              <dl className="w-full max-w-64 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[oklch(0.45_0.02_255)]">Session fee</dt>
                  <dd className="tabular-nums">${sessionFee}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[oklch(0.45_0.02_255)]">Service fee</dt>
                  <dd className="tabular-nums">${serviceFee}</dd>
                </div>
                <div className="flex justify-between border-t-2 border-[oklch(0.25_0.02_255)] pt-2 text-base font-extrabold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">${grandTotal}</dd>
                </div>
              </dl>
            </div>

            {/* Footer note */}
            <div className="mt-6 border-t border-dashed border-[oklch(0.85_0.01_255)] pt-4 text-[11px] leading-relaxed text-[oklch(0.45_0.02_255)]">
              <p>
                Security deposit is authorised separately and released within
                three business days of a completed session. Cancel free up to
                24 hours before the start time — see the Cancellation Policy on
                studiospace.dev.
              </p>
              <p className="mt-1.5">
                StudioSpace Inc. · hello@studiospace.dev · Thank you for booking
                with us.
              </p>
            </div>
          </div>
        </div>

        {/* Actions — hidden when printing */}
        <div className="no-print flex flex-col gap-2 border-t border-border bg-background p-4 sm:flex-row sm:justify-end">
          <DialogHeader className="sr-only">
            <DialogTitle>Booking invoice</DialogTitle>
            <DialogDescription>
              Print or save this invoice as a PDF.
            </DialogDescription>
          </DialogHeader>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-full"
          >
            Close
          </Button>
          <Button
            onClick={handlePrint}
            className="beam h-10 gap-2 rounded-full font-semibold"
          >
            <PrinterIcon className="size-4" />
            {printFailed ? "Retry print" : "Print / Save as PDF"}
            <DownloadIcon className="size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
