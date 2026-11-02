import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/section-heading";
import { HostGuarantee } from "@/components/home/host-guarantee";
import { Testimonials } from "@/components/home/social-proof";
import { LinkButton } from "@/components/shared/link-button";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "StudioSpace connects creators with production-ready spaces — photo cycs, sound stages, podcast lounges and music suites booked by the hour.",
};

const TEAM = [
  {
    name: "Elena Vasquez",
    role: "Co-founder & Head of Hosts",
    bio: "Fifteen years running a Brooklyn photo studio before deciding the booking process needed a rebuild.",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Marcus Reid",
    role: "Co-founder & Engineering",
    bio: "Former camera assistant who got tired of chasing availability over email and built the first version of StudioSpace.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Priya Raghavan",
    role: "Head of Creator Support",
    bio: "Answers the 2am load-in questions and makes sure every booking ends with five stars.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  },
];

const NUMBERS = [
  { value: "1,200+", label: "Spaces listed" },
  { value: "18k", label: "Sessions booked" },
  { value: "4.8", label: "Average rating" },
  { value: "24/7", label: "Host support" },
];

export default function AboutPage() {
  return (
    <>
      {/* Mission hero */}
      <section className="grain relative overflow-hidden border-b border-border bg-card">
        <div className="spotlight absolute inset-0" aria-hidden />
        <div className="section-pad relative z-10 grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div className="flex flex-col gap-5">
            <span className="eyebrow text-primary">About StudioSpace</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
              Creators deserve rooms that are{" "}
              <span className="text-gradient-brand">ready when they are</span>
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              StudioSpace started because booking a cyc wall shouldn&apos;t take
              twelve emails. We built a marketplace where every space is
              verified, every price is upfront and every slot is checked for
              conflicts before you pay — so you can spend the day shooting
              instead of negotiating.
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton
                href="/studios"
                className="beam h-11 rounded-full px-7 font-semibold"
              >
                Explore Studios
              </LinkButton>
              <LinkButton
                href="/add-studio"
                variant="outline"
                className="h-11 rounded-full px-7 font-semibold"
              >
                Host Your Space
              </LinkButton>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
            <Image
              src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80"
              alt="Production crew working on a studio sound stage"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <span className="vf-outer absolute inset-4 !text-white/50">
              <span className="vf-inner !text-white/50" />
            </span>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="section-pad py-12">
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {NUMBERS.map((n) => (
            <div
              key={n.label}
              className="rounded-xl border border-border bg-card p-6 text-center"
            >
              <dt className="sr-only">{n.label}</dt>
              <dd>
                <p className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                  {n.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{n.label}</p>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Values */}
      <section className="section-pad pb-8">
        <SectionHeading
          eyebrow="What we believe"
          title="Built by people who've done the load-in"
          description="Three principles shape every decision on the platform."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Prices you can read at a glance",
              text: "The hourly rate on the card is the hourly rate at checkout. Deposits are authorised, never quietly captured, and every fee is shown before you confirm.",
            },
            {
              title: "Rooms that match their photos",
              text: "Hosts verify ID and ownership, guests review after every session, and listings that drift from reality get pulled until they're fixed.",
            },
            {
              title: "Support that answers",
              text: "A real person on call around the clock — whether a key code stops working at 6am or a cyclorama needs touch-ups between shoots.",
            },
          ].map((value) => (
            <article
              key={value.title}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
            >
              <span className="h-1 w-10 rounded-full bg-primary" aria-hidden />
              <h3 className="text-base font-bold">{value.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {value.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="section-pad py-8">
        <SectionHeading
          eyebrow="The team"
          title="Who's behind the curtain"
        />
        <div className="grid gap-5 sm:grid-cols-3">
          {TEAM.map((member) => (
            <article
              key={member.name}
              className="card-hover flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center"
            >
              <Image
                src={member.avatar}
                alt={member.name}
                width={88}
                height={88}
                className="size-22 rounded-full object-cover ring-3 ring-primary/30"
              />
              <div>
                <h3 className="font-bold">{member.name}</h3>
                <p className="text-xs font-semibold text-primary">
                  {member.role}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {member.bio}
              </p>
            </article>
          ))}
        </div>
      </section>

      <Testimonials />
      <HostGuarantee />
    </>
  );
}
