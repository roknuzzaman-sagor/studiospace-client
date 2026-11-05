"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryBadge } from "@/components/shared/studio-card";
import { EmptyState } from "@/components/shared/status-badge";
import { SectionHeading } from "@/components/shared/section-heading";
import { deleteStudio, fetchMyListings } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";
import type { Studio } from "@/lib/types";

export function MyListings() {
  const router = useRouter();
  const { user } = useAuth();

  const [studios, setStudios] = React.useState<Studio[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [pendingDelete, setPendingDelete] = React.useState<Studio | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchMyListings();
        if (!cancelled) setStudios(list);
      } catch (err) {
        if (!cancelled) {
          toast.error(getErrorMessage(err, "Could not load your listings"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteStudio(pendingDelete._id);
      setStudios((list) => list.filter((s) => s._id !== pendingDelete._id));
      toast.success(`“${pendingDelete.title}” was deleted.`);
      setPendingDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete that listing"));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="section-pad py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          align="left"
          className="mb-0"
          eyebrow="Host Dashboard"
          title="My Studio Listings"
          description="Every space you own, with live booking stats and quick edit controls."
        />
        <Button
          render={<Link href="/add-studio" />}
          nativeButton={false}
          className="beam h-11 gap-2 rounded-full px-6 font-semibold"
        >
          <PlusIcon className="size-4" />
          Add New Studio
        </Button>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
              >
                <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="mt-2 flex gap-2">
                  <Skeleton className="h-9 flex-1 rounded-full" />
                  <Skeleton className="h-9 flex-1 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : studios.length === 0 ? (
          <EmptyState
            title="You haven't listed a space yet"
            description="Publish your first studio and start earning between your own bookings — it takes about two minutes."
            actionLabel="Add New Studio"
            actionHref="/add-studio"
          />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
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
                  <h3 className="line-clamp-2 text-sm leading-snug font-semibold">
                    <Link
                      href={`/studios/${studio._id}`}
                      className="transition-colors hover:text-primary"
                    >
                      {studio.title}
                    </Link>
                  </h3>

                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="size-3.5 text-signal" />
                      <span className="truncate">{studio.location}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <StarIcon className="size-3.5 fill-amber-400 text-amber-400" />
                      {studio.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="size-3.5 text-signal" />
                      {studio.reviewCount} reviews
                    </span>
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
                      variant="outline"
                      onClick={() => router.push(`/studios/edit/${studio._id}`)}
                      className="h-9 flex-1 gap-1.5 rounded-full text-sm font-semibold"
                    >
                      <PencilIcon className="size-3.5" />
                      Update
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setPendingDelete(studio)}
                      className="h-9 flex-1 gap-1.5 rounded-full text-sm font-semibold"
                    >
                      <Trash2Icon className="size-3.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Custom confirmation modal (no window.confirm / alert) */}
      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
            <AlertDialogDescription>
              “{pendingDelete?.title}” will be permanently removed from
              StudioSpace. Existing bookings for this space stay on record, but
              no new reservations can be made.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting ? "Deleting…" : "Yes, delete it"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
