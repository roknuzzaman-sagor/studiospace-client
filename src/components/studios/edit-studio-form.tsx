"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  ArrowLeftIcon,
  Loader2Icon,
  SaveIcon,
  UploadIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/status-badge";
import { SectionHeading } from "@/components/shared/section-heading";
import { fetchStudio, updateStudio } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { AMENITIES, CATEGORIES } from "@/lib/constants";
import type { Studio } from "@/lib/types";

const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY ?? "";

export function EditStudioForm({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuth();

  const [studio, setStudio] = React.useState<Studio | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);
  const [forbidden, setForbidden] = React.useState(false);

  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [hourlyRate, setHourlyRate] = React.useState("");
  const [securityDeposit, setSecurityDeposit] = React.useState("");
  const [maxCapacity, setMaxCapacity] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [overview, setOverview] = React.useState("");
  const [amenities, setAmenities] = React.useState<string[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const s = await fetchStudio(id);
        if (cancelled) return;
        if (!s) {
          setNotFound(true);
          return;
        }
        if (s.ownerEmail !== user.email) {
          setForbidden(true);
          return;
        }
        setStudio(s);
        setTitle(s.title);
        setCategory(s.category);
        setHourlyRate(String(s.hourlyRate));
        setSecurityDeposit(String(s.securityDeposit));
        setMaxCapacity(String(s.maxCapacity));
        setLocation(s.location);
        setImageUrl(s.imageUrl);
        setOverview(s.overview);
        setAmenities(s.amenities);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, user]);

  function toggleAmenity(amenity: string) {
    setAmenities((list) =>
      list.includes(amenity)
        ? list.filter((a) => a !== amenity)
        : [...list, amenity],
    );
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!IMGBB_KEY) {
      toast.error("Image upload isn't configured — paste a URL instead.");
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
        { method: "POST", body: form },
      );
      if (!res.ok) throw new Error("Upload failed — try a different image.");
      const data = await res.json();
      setImageUrl(data?.data?.url);
      toast.success("Image uploaded — preview updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!studio) return;

    if (!title.trim()) return toast.error("Please add a studio title.");
    if (!location.trim()) return toast.error("Please add a location.");
    if (!imageUrl.trim()) return toast.error("Please add an image URL.");
    if (!overview.trim()) return toast.error("Please add an overview.");
    if (amenities.length === 0)
      return toast.error("Select at least one amenity.");

    const rate = Number(hourlyRate);
    if (!Number.isFinite(rate) || rate <= 0)
      return toast.error("Hourly rate must be greater than 0.");

    setSubmitting(true);
    try {
      await updateStudio(studio._id, {
        title: title.trim(),
        category: category as never,
        hourlyRate: rate,
        securityDeposit: Number(securityDeposit) || 0,
        maxCapacity: Number(maxCapacity) || 1,
        location: location.trim(),
        imageUrl: imageUrl.trim(),
        amenities,
        overview: overview.trim(),
      });
      toast.success("Listing updated successfully.");
      router.push("/my-listings");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not save your changes.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="section-pad flex flex-col gap-6 py-14">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (notFound || forbidden || !studio) {
    return (
      <div className="section-pad py-16">
        <EmptyState
          title={forbidden ? "You don't own this listing" : "Listing not found"}
          description={
            forbidden
              ? "Only the host who published this space can edit it. Head back to your own listings to make changes."
              : "This studio may have been deleted, or the link is out of date."
          }
          actionLabel="My Studio Listings"
          actionHref="/my-listings"
        />
      </div>
    );
  }

  const fieldClass = "h-11 rounded-lg px-4";

  return (
    <div className="section-pad py-10 sm:py-14">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Back
      </button>

      <SectionHeading
        align="left"
        className="mb-8"
        eyebrow="Host Dashboard"
        title="Update studio listing"
        description="Edit the details below — changes go live on Explore Studios as soon as you save."
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[1.7fr_1fr]"
      >
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-title">Studio Title *</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Category *</Label>
              <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                <SelectTrigger className="h-11 w-full rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.slug} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-location">Location / Address *</Label>
              <Input
                id="edit-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={fieldClass}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-rate">Hourly Rate ($) *</Label>
              <Input
                id="edit-rate"
                type="number"
                min={1}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-deposit">Security Deposit ($)</Label>
              <Input
                id="edit-deposit"
                type="number"
                min={0}
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-capacity">Max Capacity</Label>
              <Input
                id="edit-capacity"
                type="number"
                min={1}
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
                className={fieldClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="edit-image">Image URL *</Label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="edit-image"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={`${fieldClass} flex-1`}
              />
              <label
                className={`flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold transition-colors hover:bg-muted ${
                  uploading ? "pointer-events-none opacity-60" : ""
                }`}
              >
                {uploading ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <UploadIcon className="size-4" />
                )}
                {uploading ? "Uploading…" : "Replace image"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border bg-muted">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt="Studio preview"
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                  No image yet
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Amenities *</Label>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {AMENITIES.map((amenity) => (
                <label
                  key={amenity}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2.5 text-sm transition-colors hover:border-primary/40"
                >
                  <Checkbox
                    checked={amenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {amenities.length} selected
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-overview">Detailed Overview *</Label>
            <Textarea
              id="edit-overview"
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              rows={6}
              className="rounded-lg px-4 py-3"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <UserIcon className="size-4 text-primary" />
              Host information
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              <div className="rounded-lg bg-muted/60 px-4 py-3">
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="truncate text-sm font-semibold">
                  {studio.ownerName}
                </p>
              </div>
              <div className="rounded-lg bg-muted/60 px-4 py-3">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="truncate text-sm font-semibold">
                  {studio.ownerEmail}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Read-only — ownership can&apos;t be transferred from this form.
            </p>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={studio.imageUrl}
              alt="Current cover"
              fill
              sizes="400px"
              className="object-cover"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="beam h-12 gap-2 rounded-full text-base font-bold shadow-[0_14px_30px_-16px_oklch(0.76_0.155_62)]"
          >
            {submitting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <SaveIcon className="size-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
