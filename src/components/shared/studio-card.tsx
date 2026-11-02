import Image from "next/image";
import Link from "next/link";
import { MapPinIcon, StarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import type { Studio } from "@/lib/types";

export function CategoryBadge({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  return (
    <Badge
      className={cn(
        "rounded-full border border-primary/30 bg-primary/15 px-2.5 py-0.5 text-[0.68rem] font-semibold tracking-wide text-primary uppercase backdrop-blur-sm",
        className,
      )}
    >
      {category}
    </Badge>
  );
}

export function RatingBadge({
  rating,
  reviewCount,
  className,
}: {
  rating: number;
  reviewCount?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      <StarIcon className="size-3.5 fill-amber-400 text-amber-400" />
      {rating.toFixed(1)}
      {typeof reviewCount === "number" ? (
        <span className="font-normal text-muted-foreground">
          ({reviewCount})
        </span>
      ) : null}
    </span>
  );
}

interface StudioCardProps {
  studio: Studio;
  className?: string;
}

export function StudioCard({ studio, className }: StudioCardProps) {
  return (
    <article
      className={cn(
        "card-hover group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
    >
      <Link
        href={`/studios/${studio._id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        <Image
          src={studio.imageUrl}
          alt={studio.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 z-10">
          <CategoryBadge category={studio.category} />
        </span>
        <span className="absolute top-3 right-3 z-10">
          <RatingBadge
            rating={studio.rating}
            reviewCount={studio.reviewCount}
          />
        </span>
        <span className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base leading-snug font-semibold text-balance">
            <Link
              href={`/studios/${studio._id}`}
              className="transition-colors hover:text-primary"
            >
              {studio.title}
            </Link>
          </h3>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPinIcon className="size-3.5 shrink-0 text-signal" />
          <span className="truncate">{studio.location}</span>
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
          <p className="text-lg font-extrabold tracking-tight">
            <span className="text-primary">${studio.hourlyRate}</span>
            <span className="text-sm font-medium text-muted-foreground">
              {" "}
              / hr
            </span>
          </p>
          <Button
            nativeButton={false} render={<Link href={`/studios/${studio._id}`} />}
            size="sm"
            variant="outline"
            className="rounded-full"
          >
            View Details
          </Button>
        </div>
      </div>
    </article>
  );
}

export function StudioCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-3.5 w-1/2 rounded bg-muted" />
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <div className="h-5 w-20 rounded bg-muted" />
          <div className="h-7 w-24 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
