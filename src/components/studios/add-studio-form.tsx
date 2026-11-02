"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionHeading } from "@/components/shared/section-heading";
import { createStudio } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { AMENITIES, CATEGORIES } from "@/lib/constants";

const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY ?? "";

/**
 * Uploads an image file to imgbb and returns the hosted URL.
 * Falls back to an error the caller can toast when no key is configured.
 */
async function uploadToImgbb(file: File): Promise<string> {
  if (!IMGBB_KEY) {
    throw new Error(
      "Image upload isn't configured — paste an image URL instead.",
    );
  }
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
    { method: "POST", body: form },
  );
  if (!res.ok) throw new Error("Upload failed — please try a different image.");
  const data = await res.json();
  return data?.data?.url as string;
}

interface FormState {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  imageUrl: string;
  overview: string;
}

const INITIAL: FormState = {
  title: "",
  category: "",
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  location: "",
  imageUrl: "",
  overview: "",
};

export function AddStudioForm() {
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = React.useState<FormState>(INITIAL);
  const [amenities, setAmenities] = React.useState<string[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

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
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Images must be under 5 MB.");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadToImgbb(file);
      set("imageUrl", url);
      toast.success("Image uploaded — preview updated.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      toast.error("Your session expired — please sign in again.");
      return;
    }
    if (!form.title.trim()) return toast.error("Please add a studio title.");
    if (!form.category) return toast.error("Please choose a category.");
    if (!form.location.trim())
      return toast.error("Please add a location or address.");
    if (!form.imageUrl.trim())
      return toast.error("Please upload or paste an image URL.");
    if (!form.overview.trim())
      return toast.error("Please write a detailed overview.");
    if (amenities.length === 0)
      return toast.error("Select at least one amenity.");

    const rate = Number(form.hourlyRate);
    if (!Number.isFinite(rate) || rate <= 0)
      return toast.error("Hourly rate must be greater than 0.");

    setSubmitting(true);
    try {
      await createStudio({
        title: form.title.trim(),
        category: form.category as never,
        hourlyRate: rate,
        securityDeposit: Number(form.securityDeposit) || 0,
        maxCapacity: Number(form.maxCapacity) || 1,
        location: form.location.trim(),
        imageUrl: form.imageUrl.trim(),
        amenities,
        overview: form.overview.trim(),
        ownerEmail: user.email,
        ownerName: user.name,
      });
      toast.success("Studio published to your listings.");
      router.push("/my-listings");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not publish the studio.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const fieldClass = "h-11 rounded-lg px-4";

  return (
    <div className="section-pad py-10 sm:py-14">
      <SectionHeading
        align="left"
        eyebrow="Host Dashboard"
        title="Add a new studio"
        description="Fill in the details below — your listing appears on Explore Studios as soon as it's saved."
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[1.7fr_1fr]"
      >
        {/* Main column */}
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="studio-title">Studio Title *</Label>
            <Input
              id="studio-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Northlight Cyc Wall — Daylight Photo Bay"
              className={fieldClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => v && set("category", v)}
              >
                <SelectTrigger className="h-11 w-full rounded-lg">
                  <SelectValue placeholder="Choose a category" />
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
              <Label htmlFor="location">Location / Address *</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="Neighborhood, City, State"
                className={fieldClass}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="rate">Hourly Rate ($) *</Label>
              <Input
                id="rate"
                type="number"
                min={1}
                step="1"
                value={form.hourlyRate}
                onChange={(e) => set("hourlyRate", e.target.value)}
                placeholder="85"
                className={fieldClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="deposit">Security Deposit ($)</Label>
              <Input
                id="deposit"
                type="number"
                min={0}
                step="1"
                value={form.securityDeposit}
                onChange={(e) => set("securityDeposit", e.target.value)}
                placeholder="200"
                className={fieldClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="capacity">Max Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                step="1"
                value={form.maxCapacity}
                onChange={(e) => set("maxCapacity", e.target.value)}
                placeholder="12"
                className={fieldClass}
              />
            </div>
          </div>

          {/* Image */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="image-url">Image URL *</Label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="image-url"
                type="url"
                value={form.imageUrl}
                onChange={(e) => set("imageUrl", e.target.value)}
                placeholder="https://…/studio.jpg"
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
                {uploading ? "Uploading…" : "Upload image"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Preview */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border bg-muted">
              {form.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.imageUrl}
                  alt="Studio preview"
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <UploadIcon className="size-6" />
                  <p className="text-sm">
                    Upload a file or paste a URL to preview it here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
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
            <Label htmlFor="overview">Detailed Overview *</Label>
            <Textarea
              id="overview"
              value={form.overview}
              onChange={(e) => set("overview", e.target.value)}
              rows={6}
              placeholder="Describe the space, the gear included, access instructions and what makes it a great fit for creators…"
              className="rounded-lg px-4 py-3"
            />
          </div>
        </div>

        {/* Sidebar */}
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
                  {user?.name ?? "—"}
                </p>
              </div>
              <div className="rounded-lg bg-muted/60 px-4 py-3">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="truncate text-sm font-semibold">
                  {user?.email ?? "—"}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Read-only — taken from your account so bookings reach the right
              host.
            </p>
          </div>

          <div className="spotlight rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-bold">Publishing checklist</h2>
            <ul className="mt-3 flex flex-col gap-2 text-xs text-muted-foreground">
              {[
                "Clear, well-lit cover image",
                "Accurate hourly rate and deposit",
                "At least three amenities",
                "Overview with access instructions",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2.5">
            <Button
              type="submit"
              disabled={submitting}
              className="beam h-12 gap-2 rounded-full text-base font-bold shadow-[0_14px_30px_-16px_oklch(0.76_0.155_62)]"
            >
              {submitting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Publishing…
                </>
              ) : (
                <>
                  <SaveIcon className="size-4" />
                  Publish Studio
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="h-11 rounded-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
