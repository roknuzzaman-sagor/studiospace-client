import { cn } from "cn";

/**
 * StudioSpace aperture mark — six-blade iris that spins on hover.
 */
export function ApertureMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      className={cn("size-9 shrink-0", className)}
    >
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2.5" />
      <g className="origin-center transition-transform duration-500 group-hover:rotate-90">
        <path
          d="M24 6.5 34.5 24H13.5L24 6.5Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M39.4 15.5 28.9 33H39.4V15.5Z"
          fill="currentColor"
          opacity="0.65"
        />
        <path
          d="M39.4 36.5 19 36.5 29.5 19 39.4 36.5Z"
          fill="currentColor"
          opacity="0.8"
        />
        <path
          d="M24 41.5 13.5 24h21L24 41.5Z"
          fill="currentColor"
          opacity="0.55"
        />
        <path
          d="M8.6 32.5 19.1 15.5H8.6v17Z"
          fill="currentColor"
          opacity="0.75"
        />
        <path
          d="M8.6 11.5h20.4L18.5 29 8.6 11.5Z"
          fill="currentColor"
          opacity="0.5"
        />
      </g>
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span
      className={cn(
        "group flex items-center gap-2.5 text-foreground",
        className,
      )}
    >
      <ApertureMark
        className={cn(
          "text-primary transition-transform duration-500",
          markClassName,
        )}
      />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-lg font-extrabold tracking-tight">
          Studio<span className="text-primary">Space</span>
        </span>
        <span className="eyebrow text-[0.55rem] text-muted-foreground">
          Creative Workspace Rental
        </span>
      </span>
    </span>
  );
}
