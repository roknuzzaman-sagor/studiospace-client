"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  StudioCard,
  StudioCardSkeleton,
} from "@/components/shared/studio-card";
import { EmptyState } from "@/components/shared/status-badge";
import { fetchFeaturedStudios } from "@/lib/api";
import type { Studio } from "@/lib/types";

export function FeaturedStudios() {
  const [studios, setStudios] = React.useState<Studio[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [failed, setFailed] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      setStudios(await fetchFeaturedStudios());
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // Defer the async load so state isn't set synchronously in the effect
    const t = setTimeout(() => void load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <section className="section-pad py-16 sm:py-24" aria-label="Featured studios">
      <SectionHeading
        eyebrow="Featured Spaces"
        title={
          <>
            Top-rated studios, <span className="text-gradient-brand">ready for the call sheet</span>
          </>
        }
        description="Six of the highest-rated spaces on StudioSpace right now — every one inspected, insured and bookable by the hour."
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <StudioCardSkeleton key={i} />
          ))}
        </div>
      ) : failed ? (
        <EmptyState
          title="We couldn't reach the studio feed"
          description="The listing service didn't respond. Give it another try — your spaces will be right here."
          actionLabel="Retry"
          onAction={load}
        />
      ) : studios.length === 0 ? (
        <EmptyState
          title="No studios listed yet"
          description="Be the first host to publish a space on StudioSpace."
          actionLabel="Add New Studio"
          actionHref="/add-studio"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Button
          nativeButton={false} render={<Link href="/studios" />}
          variant="outline"
          className="group h-11 gap-2 rounded-full px-7 font-semibold"
        >
          Browse all studios
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </section>
  );
}
