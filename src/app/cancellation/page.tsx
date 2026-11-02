import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Cancellation Policy",
};

const TIERS = [
  {
    window: "24+ hours before",
    refund: "Full refund",
    detail:
      "Cancel from My Bookings and the session fee plus deposit are released back to your original payment method.",
    tone: "emerald",
  },
  {
    window: "6–24 hours before",
    refund: "50% refund",
    detail:
      "Half the session fee is refunded; the host keeps the remainder to cover blocked-off time. Deposit released in full.",
    tone: "amber",
  },
  {
    window: "Under 6 hours / no-show",
    refund: "No refund",
    detail:
      "Late cancellations and no-shows are charged in full so hosts are compensated for an unusable slot. Deposit still released.",
    tone: "rose",
  },
];

export default function CancellationPage() {
  return (
    <div className="section-pad py-12 sm:py-16">
      <SectionHeading
        eyebrow="Legal"
        title="Cancellation Policy"
        description="Plans change — here's exactly what happens to your money when a booking is cancelled."
      />

      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
        {TIERS.map((tier) => (
          <article
            key={tier.window}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
          >
            <span
              className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${
                tier.tone === "emerald"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : tier.tone === "amber"
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400"
              }`}
            >
              {tier.refund}
            </span>
            <h2 className="text-base font-bold text-foreground">
              {tier.window}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {tier.detail}
            </p>
          </article>
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-4xl rounded-xl border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground">
        <h2 className="mb-2 text-base font-bold text-foreground">
          Security deposits
        </h2>
        <p>
          Deposits are never captured at booking time — they are authorised and
          released automatically within three business days of a completed
          session, or immediately when a booking is cancelled. Hosts must file
          a damage claim with photos within 48 hours to hold any part of a
          deposit, and guests are notified before anything is charged.
        </p>
      </div>
    </div>
  );
}
