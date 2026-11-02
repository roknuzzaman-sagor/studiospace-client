import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="section-pad py-12 sm:py-16">
      <SectionHeading
        eyebrow="Legal"
        title="Terms of Service"
        description="The ground rules for booking studios, hosting spaces and keeping StudioSpace safe for everyone."
      />

      <article className="prose-sm mx-auto flex max-w-3xl flex-col gap-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">
            1. Using StudioSpace
          </h2>
          <p>
            You must be at least 18 years old to book a studio or list one on
            StudioSpace. Accounts are personal — keep your credentials to
            yourself and tell us right away if you suspect someone else has
            access. You are responsible for everything that happens under your
            account, including bookings you make and listings you publish.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">
            2. Bookings and payments
          </h2>
          <p>
            Reservations are confirmed when a host accepts them or when the
            listing is marked instant-book. Hourly rates are set by hosts and
            shown in full before you confirm — including the refundable
            security deposit, which is released after the session unless damage
            is reported. Cancellations made more than 24 hours before the start
            time are refunded in full.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">
            3. Host responsibilities
          </h2>
          <p>
            Hosts must accurately describe their space, keep it safe and legal
            to occupy, and honour confirmed reservations. Listings are verified
            with ID before publication, and hosts agree to maintain liability
            coverage for the duration of each booking.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">
            4. Conduct and cancellations
          </h2>
          <p>
            Harassment, unlawful activity and property damage are not
            tolerated. StudioSpace may suspend accounts that put creators,
            hosts or spaces at risk, and may cancel bookings when a listing
            violates these terms.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">5. Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a
              href="mailto:legal@studiospace.dev"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              legal@studiospace.dev
            </a>{" "}
            and a human will get back to you within two business days.
          </p>
        </section>
      </article>
    </div>
  );
}
