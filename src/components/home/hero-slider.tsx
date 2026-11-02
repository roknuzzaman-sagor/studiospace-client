"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_SLIDES } from "@/lib/constants";

export function HeroSlider() {
  const [active, setActive] = React.useState(0);
  // Swiper reads Date() internally — mount it client-side only so the route
  // can be prerendered without an unstable-value error.
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <section
      className="grain relative isolate min-h-[92vh] overflow-hidden bg-[oklch(0.12_0.01_255)]"
      aria-label="Featured studio spaces"
    >
      {mounted ? (
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".hero-pagination" }}
        loop
        onSlideChange={(s) => setActive(s.realIndex)}
        className="absolute inset-0 !z-0"
      >
        {HERO_SLIDES.map((slide, i) => (
          <SwiperSlide key={slide.title}>
            <div className="relative h-full min-h-[92vh] w-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="hero-scrim absolute inset-0" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      ) : (
        /* SSR/fallback: first slide as a static backdrop before Swiper mounts */
        <div className="absolute inset-0 !z-0">
          <Image
            src={HERO_SLIDES[0].image}
            alt={HERO_SLIDES[0].title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="hero-scrim absolute inset-0" />
        </div>
      )}

      {/* Static content overlay — one entrance animation per slide change */}
      <div className="section-pad relative z-10 flex min-h-[92vh] flex-col justify-center pt-24 pb-28">
        <div key={active} className="fade-up max-w-3xl">
          <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-white/90 backdrop-blur-sm">
            <SparklesIcon className="size-3.5 text-[oklch(0.8_0.15_66)]" />
            {HERO_SLIDES[active].eyebrow}
          </span>

          <h1 className="mt-6 text-4xl leading-[1.05] font-extrabold tracking-tight text-white text-balance sm:text-6xl lg:text-7xl">
            {HERO_SLIDES[active].title}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            {HERO_SLIDES[active].text}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              render={<Link href="/studios" />}
              size="lg"
              className="beam h-12 gap-2 rounded-full px-8 text-base font-bold shadow-[0_16px_40px_-16px_oklch(0.76_0.155_62)]"
            >
              Explore Studios
              <ArrowRightIcon className="size-4" />
            </Button>
            <Button
              render={<Link href="/add-studio" />}
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-white/35 bg-white/10 px-8 text-base font-bold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            >
              Host Your Space
            </Button>
          </div>

          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-black/40 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
            {HERO_SLIDES[active].stat} · booked across NYC
          </p>
        </div>
      </div>

      {/* Film-strip pagination */}
      <div className="hero-pagination absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 !static !w-auto justify-center gap-2" />

      {/* Viewfinder corners */}
      <span className="vf-outer pointer-events-none absolute inset-4 z-10 !text-white/50 sm:inset-6">
        <span className="vf-inner !text-white/50" />
      </span>
    </section>
  );
}
