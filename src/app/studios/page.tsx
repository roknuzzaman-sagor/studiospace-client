import type { Metadata } from "next";
import { StudiosExplorer } from "@/components/studios/studios-explorer";

export const metadata: Metadata = {
  title: "Explore Studios",
  description:
    "Browse photography studios, film stages, podcast lounges, music suites and art workshops available by the hour.",
};

export default function StudiosPage() {
  return (
    <div className="section-pad py-10 sm:py-14">
      {/* Page header */}
      <div className="spotlight relative mb-8 overflow-hidden rounded-2xl border border-border bg-card px-6 py-10 text-center sm:px-10 sm:py-12">
        <span className="eyebrow text-primary">Explore Studios</span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">
          Find the room your <span className="text-gradient-brand">shot needs</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Filter by category, price and location — every listing shows live
          hourly rates, verified hosts and real creator reviews.
        </p>
        <span className="vf-outer pointer-events-none absolute inset-4 text-primary/40">
          <span className="vf-inner text-primary/40" />
        </span>
      </div>

      <StudiosExplorer />
    </div>
  );
}
