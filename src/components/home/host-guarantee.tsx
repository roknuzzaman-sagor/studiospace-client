import {
  BadgeCheckIcon,
  CameraIcon,
  HeadphonesIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { GUARANTEES } from "@/lib/constants";

const ICONS = {
  shield: ShieldCheckIcon,
  badge: BadgeCheckIcon,
  camera: CameraIcon,
  headphones: HeadphonesIcon,
} as const;

export function HostGuarantee() {
  return (
    <section
      className="relative overflow-hidden border-y border-border bg-card py-16 sm:py-24"
      aria-label="Host guarantee and creator support"
    >
      <div className="spotlight absolute inset-0 opacity-60" aria-hidden />

      <div className="section-pad relative">
        <SectionHeading
          eyebrow="Host Guarantee & Creator Support"
          title="We've got the room — and your back"
          description="Every booking on StudioSpace is backed by four commitments, whether you're shooting a campaign or recording episode forty-two."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {GUARANTEES.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <article
                key={item.title}
                className="group flex flex-col gap-4 rounded-xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_20px_45px_-30px_oklch(0.2_0.02_255)]"
              >
                <span className="flex size-12 items-center justify-center rounded-lg bg-primary/12 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" />
                </span>
                <h3 className="text-base font-bold tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
