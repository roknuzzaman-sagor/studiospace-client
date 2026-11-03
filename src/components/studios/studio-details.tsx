"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  BadgeCheckIcon,
  CameraIcon,
  ClockIcon,
  HeartIcon,
  MapPinIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryBadge, RatingBadge } from "@/components/shared/studio-card";
import { EmptyState } from "@/components/shared/status-badge";
import { GalleryCarousel } from "./gallery-carousel";
import { BookingModal } from "./booking-modal";
import { fetchReviews, fetchStudio } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useWishlist } from "@/hooks/use-wishlist";
import type { Review, Studio } from "@/lib/types";

const FALLBACK_GALLERY = (url: string) => [url, url, url];

export function StudioDetails({ id }: { id: string }) {
  const { user } = useAuth();
  const { has: isSaved, toggle: toggleSavedStore } = useWishlist();
  const [studio, setStudio] = React.useState<Studio | null>(null);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [bookingOpen, setBookingOpen] = React.useState(false);
  const saved = studio ? isSaved(studio._id) : false;

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, r] = await Promise.all([
          fetchStudio(id),
          fetchReviews(id),
        ]);
        if (cancelled) return;
        setStudio(s);
        setReviews(r);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function toggleSaved() {
    if (!user) {
      toast.error("Sign in to save studios to your wishlist.");
      return;
    }
    if (!studio) return;
    toggleSavedStore(studio._id);
    toast.success(
      saved ? "Removed from your saved studios." : "Saved to your wishlist.",
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="aspect-[16/10] w-full rounded-xl" />
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <EmptyState
        title="This studio isn't available"
        description="The listing may have been removed by its host, or the link is out of date."
        actionLabel="Browse all studios"
        actionHref="/studios"
      />
    );
  }

  const gallery = studio.gallery?.length
    ? studio.gallery
    : FALLBACK_GALLERY(studio.imageUrl);

  const initials = studio.ownerName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col gap-8">
      {/* Gallery */}
      <GalleryCarousel images={gallery} title={studio.title} />

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <CategoryBadge category={studio.category} />
            <RatingBadge
              rating={studio.rating}
              reviewCount={studio.reviewCount}
            />
            <button
              type="button"
              onClick={toggleSaved}
              aria-pressed={saved}
              aria-label={saved ? "Remove from saved" : "Save studio"}
              className={`ml-auto flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                saved
                  ? "border-rose-400 bg-rose-500/10 text-rose-500"
                  : "border-border text-muted-foreground hover:border-rose-400 hover:text-rose-500"
              }`}
            >
              <HeartIcon
                className={`size-3.5 ${saved ? "fill-rose-500" : ""}`}
              />
              {saved ? "Saved" : "Save"}
            </button>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            {studio.title}
          </h1>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="size-4 text-signal" />
              {studio.location}
            </span>
            <span className="flex items-center gap-1.5">
              <UsersIcon className="size-4 text-signal" />
              Up to {studio.maxCapacity} guests
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="size-4 text-signal" />
              Minimum 1-hour booking
            </span>
          </div>

          <Separator />

          {/* Overview */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-bold tracking-tight">
              About this space
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              {studio.overview}
            </p>
          </section>

          {/* Amenities */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-bold tracking-tight">Amenities</h2>
            <ul className="flex flex-wrap gap-2">
              {studio.amenities.map((a) => (
                <li
                  key={a}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium"
                >
                  <BadgeCheckIcon className="size-3.5 text-primary" />
                  {a}
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          {/* Reviews */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Reviews</h2>
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                <StarIcon className="size-4 fill-amber-400 text-amber-400" />
                {studio.rating.toFixed(1)} · {studio.reviewCount} reviews
              </span>
            </div>

            {reviews.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
                No reviews yet — be the first to book and leave one.
              </p>
            ) : (
              <ul className="flex flex-col gap-4">
                {reviews.map((r) => (
                  <li
                    key={r._id}
                    className="rounded-xl border border-border bg-card p-5"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarImage src={r.authorAvatar} alt={r.authorName} />
                        <AvatarFallback className="bg-primary/15 text-xs font-bold text-primary">
                          {r.authorName
                            .split(" ")
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-bold">{r.authorName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(r.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <span className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`size-3.5 ${
                              i < r.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/40"
                            }`}
                          />
                        ))}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {r.comment}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Right column — sticky booking card */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_20px_50px_-35px_oklch(0_0_0/0.6)]">
            <div className="spotlight relative px-6 py-5">
              <p className="text-xs font-medium text-muted-foreground">
                Hourly rate
              </p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight">
                <span className="text-primary">${studio.hourlyRate}</span>
                <span className="text-base font-medium text-muted-foreground">
                  {" "}
                  / hr
                </span>
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                + ${studio.securityDeposit} refundable security deposit
              </p>
            </div>

            <div className="flex flex-col gap-4 p-6">
              <Button
                onClick={() => setBookingOpen(true)}
                className="beam h-12 w-full rounded-full text-base font-bold shadow-[0_14px_30px_-16px_oklch(0.76_0.155_62)]"
              >
                Book Workspace Now
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Free cancellation up to 24 hours before your slot
              </p>

              <Separator />

              {/* Host */}
              <div className="flex items-center gap-3">
                <Avatar className="size-11 ring-2 ring-primary/30">
                  <AvatarImage
                    src={`https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80`}
                    alt={studio.ownerName}
                  />
                  <AvatarFallback className="bg-primary/15 font-bold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 truncate text-sm font-bold">
                    {studio.ownerName}
                    <BadgeCheckIcon className="size-3.5 shrink-0 text-primary" />
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    Verified host · usually replies within an hour
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  toast.info(
                    `Messaging isn't wired up in this build — email ${studio.ownerEmail} directly.`,
                  )
                }
                className="h-10 w-full rounded-full text-sm font-semibold"
              >
                Message Host
              </Button>
            </div>
          </div>

          {/* Quick facts */}
          <ul className="mt-4 flex flex-col gap-2.5 rounded-xl border border-border bg-card p-5 text-sm">
            {[
              { icon: CameraIcon, label: `Category: ${studio.category}` },
              { icon: UsersIcon, label: `Max capacity: ${studio.maxCapacity}` },
              {
                icon: ClockIcon,
                label: "Check-in: self service, 24/7 access",
              },
            ].map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2.5 text-muted-foreground"
              >
                <Icon className="size-4 shrink-0 text-signal" />
                {label}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <BookingModal
        studio={studio}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  );
}
