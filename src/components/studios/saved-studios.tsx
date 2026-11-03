"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryBadge, RatingBadge } from "@/components/shared/studio-card";
import { EmptyState } from "@/components/shared/status-badge";
import { SectionHeading } from "@/components/shared/section-heading";
import { fetchStudios } from "@/lib/api";
import { useWishlist } from "@/hooks/use-wishlist";
import type { Studio } from "@/lib/types";

export function SavedStudios() {
  const { ids, remove, hydrated } = useWishlist();
  const [studios, setStudios] = React.useState<Studio[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const all = await fetchStudios();
        if (!cancelled) setStudios(all);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const saved = studios.filter((s) => ids.includes(s._id));

  return (
    <div className="section-pad py-10 sm:py-14">
      <SectionHeading
        align="left"
        className="mb-8"
        eyebrow="Wishlist"
        title="Saved Studios"
        description="Spaces you tapped the heart on — kept on this device so you can compare before booking."
      />

      {!hydrated || loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
          ))}
        </div>
      ) : saved.length === 0 ? (
        <EmptyState
          title="No saved studios yet"
          description="Tap the heart on any studio card or listing page and it will wait for you right here."
          actionLabel="Explore Studios"
          actionHref="/studios"
        />
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((studio) => (
            <li
              key={studio._id}
              className="card-hover group flex flex-col overflow-hidden rounded-xl border border-border bg-card"
            >
              <Link
                href={`/studios/${studio._id}`}
                className="relative aspect-[16/10] overflow-hidden bg-muted"
              >
                <Image
                  src={studio.imageUrl}
                  alt={studio.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 z-10">
                  <CategoryBadge category={studio.category} />
                </span>
              </Link>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-2 text-sm leading-snug font-semibold">
                    <Link
                      href={`/studios/${studio._id}`}
                      className="transition-colors hover:text-primary"
                    >
                      {studio.title}
                    </Link>
                  </h3>
                  <RatingBadge
                    rating={studio.rating}
                    reviewCount={studio.reviewCount}
                  />
                </div>

                <p className="text-lg font-extrabold">
                  <span className="text-primary">${studio.hourlyRate}</span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {" "}
                    / hr
                  </span>
                </p>

                <div className="mt-auto flex gap-2 border-t border-border pt-3">
                  <Button
                    render={<Link href={`/studios/${studio._id}`} />}
                    nativeButton={false}
                    size="sm"
                    className="h-9 flex-1 rounded-full text-sm font-semibold"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => remove(studio._id)}
                    aria-label={`Remove ${studio.title} from saved studios`}
                    className="h-9 gap-1.5 rounded-full px-4 text-sm"
                  >
                    <HeartIcon className="size-3.5 fill-rose-500 text-rose-500" />
                    Remove
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
