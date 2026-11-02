import { cn } from "cn";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-3 sm:mb-14",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <span className="eyebrow inline-flex items-center gap-2 text-primary">
        <span className="inline-block h-px w-6 bg-primary/70" aria-hidden />
        {eyebrow}
        <span className="inline-block h-px w-6 bg-primary/70" aria-hidden />
      </span>
      <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
