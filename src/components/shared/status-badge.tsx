import Link from "next/link";
import { CameraIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import type { BookingStatus } from "@/lib/types";

const STATUS_STYLES: Record<BookingStatus, string> = {
  Pending:
    "border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400",
  Confirmed:
    "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  Completed:
    "border-sky-500/40 bg-sky-500/15 text-sky-600 dark:text-sky-400",
  Cancelled:
    "border-rose-500/40 bg-rose-500/15 text-rose-600 dark:text-rose-400",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        STATUS_STYLES[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {status}
    </span>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "spotlight flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-card/60 px-6 py-16 text-center",
        className,
      )}
    >
      <span className="relative flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CameraIcon className="size-7" />
        <span className="vf-outer rounded-full text-primary/70">
          <span className="vf-inner rounded-full" />
        </span>
      </span>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {actionLabel && actionHref ? (
        <Button nativeButton={false} render={<Link href={actionHref} />} className="rounded-full">
          {actionLabel}
        </Button>
      ) : null}
      {actionLabel && onAction && !actionHref ? (
        <Button onClick={onAction} className="rounded-full">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
