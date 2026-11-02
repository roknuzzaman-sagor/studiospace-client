"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRightIcon } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { CATEGORIES } from "@/lib/constants";

export function CategoryBrowser() {
  return (
    <section
      className="relative overflow-hidden border-y border-border bg-muted/40 py-16 sm:py-24"
      aria-label="Browse by category"
    >
      <div className="spotlight absolute inset-0 opacity-70" aria-hidden />

      <div className="section-pad relative">
        <SectionHeading
          eyebrow="Browse by Category"
          title="Every room your production needs"
          description="Pick a category and we'll pre-filter the Explore page — from daylight cyc walls to treated podcast booths."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/studios?category=${cat.slug}`}
              className={[
                "group relative isolate overflow-hidden rounded-xl border border-border bg-card card-hover",
                i === 0 ? "lg:col-span-2" : "",
              ].join(" ")}
            >
              <div
                className={[
                  "relative overflow-hidden bg-muted",
                  i === 0 ? "aspect-[16/9] lg:aspect-[2/1]" : "aspect-[4/3]",
                ].join(" ")}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-5">
                <div>
                  <span className="eyebrow text-[oklch(0.8_0.15_66)]">
                    {String(i + 1).padStart(2, "0")} · Category
                  </span>
                  <h3 className="mt-1.5 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                    {cat.name}
                  </h3>
                  <p className="mt-1 max-w-md text-sm leading-snug text-white/75">
                    {cat.blurb}
                  </p>
                </div>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRightIcon className="size-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
