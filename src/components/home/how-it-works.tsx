import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { HOW_IT_WORKS } from "@/lib/constants";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-pad py-16 scroll-mt-20 sm:py-24"
      aria-label="How booking works"
    >
      <SectionHeading
        eyebrow="How Booking Works"
        title="From first scroll to final cut"
        description="Four steps between discovering a space and rolling camera — no phone tag, no surprise fees."
      />

      {/* Dashed "film path" connecting the four steps */}
      <div className="relative">
        <div
          aria-hidden
          className="absolute top-9 right-[12%] left-[12%] hidden border-t-2 border-dashed border-border lg:block"
        />

        <ol className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {HOW_IT_WORKS.map((item) => (
            <li key={item.step} className="flex flex-col items-center text-center">
              <span className="relative z-10 flex size-[4.5rem] items-center justify-center rounded-full border-2 border-primary bg-background font-heading text-xl font-extrabold text-primary shadow-[0_0_0_8px_var(--background)]">
                {item.step}
              </span>
              <h3 className="mt-5 text-lg font-bold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
                {item.text}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-12 flex justify-center">
        <Button
          render={<Link href="/studios" />}
          className="beam h-11 gap-2 rounded-full px-8 font-semibold shadow-[0_14px_30px_-16px_oklch(0.76_0.155_62)]"
        >
          Start with step one
          <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </section>
  );
}
