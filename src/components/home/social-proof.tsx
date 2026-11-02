import Image from "next/image";
import Link from "next/link";
import { QuoteIcon, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { TESTIMONIALS } from "@/lib/constants";

export function Testimonials() {
  return (
    <section className="section-pad py-16 sm:py-24" aria-label="Creator testimonials">
      <SectionHeading
        eyebrow="Creator Stories"
        title="Booked, shot, delivered"
        description="Creators across New York use StudioSpace every week — here's how it goes."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6 card-hover"
          >
            <QuoteIcon className="size-7 text-primary/60" aria-hidden />
            <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
              “{t.quote}”
            </blockquote>
            <div className="flex gap-0.5" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  className="size-3.5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <figcaption className="flex items-center gap-3 border-t border-border pt-4">
              <Image
                src={t.avatar}
                alt={t.name}
                width={44}
                height={44}
                className="size-11 rounded-full object-cover ring-2 ring-primary/30"
              />
              <div>
                <p className="text-sm font-bold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="section-pad pb-20" aria-label="Call to action">
      <div className="grain relative isolate overflow-hidden rounded-2xl bg-[oklch(0.16_0.015_255)] px-6 py-14 text-center sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="spotlight absolute inset-0 !opacity-100"
          style={{ "--spotlight-opacity": "0.4" } as React.CSSProperties}
        />
        <span className="vf-outer pointer-events-none absolute inset-5 !text-white/40">
          <span className="vf-inner !text-white/40" />
        </span>

        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-5">
          <span className="eyebrow text-[oklch(0.8_0.15_66)]">
            Ready when you are
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white text-balance sm:text-5xl">
            Your next shoot has a home
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-white/75">
            Browse hundreds of inspected studios, lock your hours in seconds and
            keep every receipt in one place. Or list your own space and start
            earning between bookings.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              render={<Link href="/studios" />}
              size="lg"
              className="beam h-12 gap-2 rounded-full px-8 text-base font-bold"
            >
              Explore Studios
            </Button>
            <Button
              render={<Link href="/add-studio" />}
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/30 bg-white/10 px-8 text-base font-bold text-white hover:bg-white/20 hover:text-white"
            >
              Host Your Space
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
