import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="section-pad py-12 sm:py-16">
      <SectionHeading
        eyebrow="Legal"
        title="Privacy Policy"
        description="What we collect, why we collect it, and the controls you have over it."
      />

      <article className="mx-auto flex max-w-3xl flex-col gap-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">
            Information we collect
          </h2>
          <p>
            Your name, email address and profile photo when you register.
            Booking details — dates, times, studios and totals — when you
            reserve a space. Listing details when you publish a studio, and
            messages you send to hosts through the platform.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">
            How we use it
          </h2>
          <p>
            To run reservations, process payouts, prevent fraud and send you
            transactional updates about your bookings. We never sell your
            personal data. Newsletter email is only sent when you subscribe,
            and every issue includes a one-click unsubscribe.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">
            Cookies and sessions
          </h2>
          <p>
            We use HTTPOnly session cookies to keep you signed in securely.
            These cookies can&apos;t be read by scripts in the page, which
            protects your session from theft. You can clear them at any time by
            signing out.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-foreground">Your rights</h2>
          <p>
            Request a copy of your data or ask us to delete your account by
            emailing{" "}
            <a
              href="mailto:privacy@studiospace.dev"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              privacy@studiospace.dev
            </a>
            . We action verified requests within 30 days.
          </p>
        </section>
      </article>
    </div>
  );
}
