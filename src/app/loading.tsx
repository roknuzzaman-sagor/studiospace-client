import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/shared/logo";

/**
 * Route-level loading UI — branded aperture pulse with skeleton blocks.
 */
export default function Loading() {
  return (
    <div
      className="section-pad flex min-h-[60vh] flex-col items-center justify-center gap-8 py-20"
      role="status"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-3">
        <span className="relative flex size-16 items-center justify-center">
          <span
            aria-hidden
            className="absolute inset-0 animate-spin rounded-full border-2 border-primary/25 border-t-primary"
          />
          <Logo markClassName="size-8" className="[&_span:last-child]:hidden" />
        </span>
        <p className="eyebrow text-muted-foreground">Rolling…</p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
