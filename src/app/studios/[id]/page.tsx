import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ChevronRightIcon } from "lucide-react";
import { StudioDetails } from "@/components/studios/studio-details";
import { fetchStudio } from "@/lib/api";

interface Props {
  params: Promise<{ id: string }>;
}

// Studio IDs come from MongoDB, so this route blocks on the request
// instead of being prerendered into the static shell.
export const instant = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const studio = await fetchStudio(id);
  if (!studio) return { title: "Studio Not Found" };
  return {
    title: studio.title,
    description: studio.overview.slice(0, 155),
  };
}

export default async function StudioDetailPage({ params }: Props) {
  // Studio IDs come from the database, so this route renders per request
  // instead of being prerendered at build time.
  await connection();
  const { id } = await params;

  return (
    <div className="section-pad py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link
          href="/"
          className="transition-colors hover:text-foreground"
        >
          Home
        </Link>
        <ChevronRightIcon className="size-3.5" />
        <Link
          href="/studios"
          className="transition-colors hover:text-foreground"
        >
          Explore Studios
        </Link>
        <ChevronRightIcon className="size-3.5" />
        <span className="truncate font-medium text-foreground">
          Studio details
        </span>
      </nav>

      <StudioDetails id={id} />
    </div>
  );
}
