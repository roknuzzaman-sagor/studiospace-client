import Link from "next/link";
import { ApertureMark } from "@/components/shared/logo";
import { LinkButton } from "@/components/shared/link-button";

export default function NotFound() {
  return (
    <section className="grain spotlight relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      {/* Out-of-focus studio lights */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute top-[18%] left-[12%] size-40 rounded-full bg-primary/15 blur-3xl" />
        <span className="absolute right-[15%] bottom-[22%] size-52 rounded-full bg-signal/15 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <span className="relative flex size-24 items-center justify-center rounded-full border border-border bg-card text-primary shadow-lg">
          <ApertureMark className="size-14" />
          <span className="vf-outer rounded-full text-primary/60">
            <span className="vf-inner rounded-full" />
          </span>
        </span>

        <span className="eyebrow text-primary">Error 404 · No signal</span>

        <h1 className="font-heading text-5xl font-extrabold tracking-tight text-balance sm:text-7xl">
          This scene{" "}
          <span className="text-gradient-brand">never made the cut</span>
        </h1>

        <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
          The page you&apos;re looking for was moved, renamed or never scheduled.
          Let&apos;s get you back to a studio that actually exists.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <LinkButton
            href="/"
            className="beam h-12 rounded-full px-8 text-base font-bold shadow-[0_14px_30px_-16px_oklch(0.76_0.155_62)]"
          >
            Return to Home
          </LinkButton>
          <LinkButton
            href="/studios"
            variant="outline"
            className="h-12 rounded-full px-8 text-base font-semibold"
          >
            Browse Studios
          </LinkButton>
        </div>

        <Link
          href="/"
          className="mt-2 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          or jump back to the featured spaces
        </Link>
      </div>
    </section>
  );
}
