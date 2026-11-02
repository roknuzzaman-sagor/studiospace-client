"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StudioCard,
  StudioCardSkeleton,
} from "@/components/shared/studio-card";
import { EmptyState } from "@/components/shared/status-badge";
import { fetchStudios } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import type { Studio } from "@/lib/types";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Highest rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

const PRICE_BANDS = [
  { value: "any", label: "Any price" },
  { value: "under-50", label: "Under $50 / hr" },
  { value: "50-100", label: "$50 – $100 / hr" },
  { value: "over-100", label: "$100+ / hr" },
] as const;

export function StudiosExplorer() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get("category") ?? "all";

  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState(categoryParam);
  const [price, setPrice] = React.useState("any");
  const [sort, setSort] = React.useState<(typeof SORT_OPTIONS)[number]["value"]>(
    "featured",
  );
  const [studios, setStudios] = React.useState<Studio[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [failed, setFailed] = React.useState(false);

  // Keep local state in sync when the query param changes (e.g. from home)
  React.useEffect(() => {
    setCategory(categoryParam);
  }, [categoryParam]);

  const load = React.useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const list = await fetchStudios({
        category: category !== "all" ? category : undefined,
        search: search.trim() || undefined,
      });
      setStudios(list);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  React.useEffect(() => {
    const t = setTimeout(() => void load(), 250);
    return () => clearTimeout(t);
  }, [load]);

  function selectCategory(value: string) {
    setCategory(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("category");
    else params.set("category", value);
    router.replace(`/studios${params.toString() ? `?${params}` : ""}`, {
      scroll: false,
    });
  }

  const visible = React.useMemo(() => {
    let list = studios;
    if (price === "under-50") list = list.filter((s) => s.hourlyRate < 50);
    if (price === "50-100")
      list = list.filter((s) => s.hourlyRate >= 50 && s.hourlyRate <= 100);
    if (price === "over-100") list = list.filter((s) => s.hourlyRate > 100);

    const sorted = [...list];
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "price-asc") sorted.sort((a, b) => a.hourlyRate - b.hourlyRate);
    if (sort === "price-desc")
      sorted.sort((a, b) => b.hourlyRate - a.hourlyRate);
    return sorted;
  }, [studios, price, sort]);

  const hasFilters =
    category !== "all" || price !== "any" || search.trim().length > 0;

  function clearFilters() {
    setSearch("");
    setPrice("any");
    selectCategory("all");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filter bar */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by studio name, city or category…"
              aria-label="Search studios"
              className="h-10 rounded-full pr-4 pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <SlidersHorizontalIcon className="hidden size-4 text-muted-foreground sm:block" />

            <Select
              value={category}
              onValueChange={(v) => v && selectCategory(v)}
            >
              <SelectTrigger className="h-10 w-[165px] rounded-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={price} onValueChange={(v) => v && setPrice(v)}>
              <SelectTrigger className="h-10 w-[155px] rounded-full">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                {PRICE_BANDS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sort}
              onValueChange={(v) => v && setSort(v as typeof sort)}
            >
              <SelectTrigger className="h-10 w-[150px] rounded-full">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasFilters ? (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="h-10 gap-1.5 rounded-full px-4 text-sm"
              >
                <XIcon className="size-3.5" />
                Clear
              </Button>
            ) : null}
          </div>
        </div>

        {/* Category chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => selectCategory("all")}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
              category === "all"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            All Spaces
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => selectCategory(c.slug)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                category === c.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {loading ? (
            <Skeleton className="h-4 w-40" />
          ) : (
            <>
              <span className="font-semibold text-foreground">
                {visible.length}
              </span>{" "}
              {visible.length === 1 ? "studio" : "studios"} available
            </>
          )}
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <StudioCardSkeleton key={i} />
          ))}
        </div>
      ) : failed ? (
        <EmptyState
          title="The studio feed didn't respond"
          description="We couldn't reach the listing service. Give it another try and your spaces will be right here."
          actionLabel="Retry"
          onAction={load}
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No studios match those filters"
          description="Try widening the price range, clearing the search term or browsing every category."
          actionLabel={hasFilters ? "Clear all filters" : "Return to Home"}
          onAction={hasFilters ? clearFilters : () => router.push("/")}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      )}
    </div>
  );
}
