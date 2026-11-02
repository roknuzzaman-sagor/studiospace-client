"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "cn";

const QUESTIONS = [
  {
    q: "How do I know a studio is what the listing says?",
    a: "Every host verifies their ID and studio ownership before a listing goes live, and each space is rated by creators who actually booked it. Photos, amenities and access details are visible on the listing page before you pay anything.",
  },
  {
    q: "What exactly does the hourly rate include?",
    a: "The listed rate covers the space itself and any gear called out in the amenities list. Optional add-ons like an engineer or extra grip are quoted separately by the host. A refundable security deposit is authorised at booking and released after the session.",
  },
  {
    q: "Can I cancel or change my booking?",
    a: "Yes — cancel from My Bookings. More than 24 hours out gets a full refund, 6–24 hours gets 50%, and later than that the slot is charged because the host blocked the time for you. Deposits are always released.",
  },
  {
    q: "What happens if two people book the same slot?",
    a: "We check every new reservation against confirmed bookings for that studio and time range before saving it. If the slot overlaps, the request is rejected with a clear message so you can pick another time — no double bookings.",
  },
  {
    q: "I run a studio — what does it cost to list?",
    a: "Listing is free. StudioSpace takes a small service fee from completed bookings, and you keep the rest of your hourly rate. Payouts land after each session once the deposit window closes.",
  },
  {
    q: "Is my payment and session data secure?",
    a: "Sessions are stored in HTTPOnly cookies that scripts can't read, so your login can't be stolen from the page. Mutating requests are rejected without valid credentials, and listing ownership is checked server-side on every edit.",
  },
];

export function FAQ() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section
      className="section-pad py-16 sm:py-24"
      aria-label="Frequently asked questions"
    >
      <SectionHeading
        eyebrow="FAQ"
        title="Questions creators ask us"
        description="Everything you wanted to know about booking, hosting and cancellations."
      />

      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        {QUESTIONS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={item.q}
              className={cn(
                "overflow-hidden rounded-xl border bg-card transition-colors",
                isOpen ? "border-primary/45" : "border-border",
              )}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm font-bold sm:text-base">{item.q}</span>
                <ChevronDownIcon
                  className={cn(
                    "size-4 shrink-0 text-primary transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              <div
                className="grid transition-all duration-300 ease-out"
                style={{
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
