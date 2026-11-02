"use client";

import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon, Maximize2Icon } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "cn";

interface GalleryCarouselProps {
  images: string[];
  title: string;
}

export function GalleryCarousel({ images, title }: GalleryCarouselProps) {
  const mounted = useMounted();
  const [thumbsSwiper, setThumbsSwiper] = React.useState<SwiperType | null>(
    null,
  );
  const [active, setActive] = React.useState(0);

  if (!mounted) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted sm:aspect-[16/10]">
        <Image
          src={images[0]}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted sm:aspect-[16/10]">
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          thumbs={{
            swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          navigation={{
            prevEl: ".gallery-prev",
            nextEl: ".gallery-next",
          }}
          pagination={{ clickable: true }}
          onSlideChange={(s) => setActive(s.realIndex)}
          className="size-full !rounded-xl"
        >
          {images.map((src, i) => (
            <SwiperSlide key={`${src}-${i}`}>
              <div className="relative size-full">
                <Image
                  src={src}
                  alt={`${title} — photo ${i + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom controls */}
        <button
          type="button"
          aria-label="Previous photo"
          className="gallery-prev absolute top-1/2 left-3 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-primary hover:text-primary-foreground group-hover:opacity-100"
        >
          <ChevronLeftIcon className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Next photo"
          className="gallery-next absolute top-1/2 right-3 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-primary hover:text-primary-foreground group-hover:opacity-100"
        >
          <ChevronRightIcon className="size-5" />
        </button>

        <span className="absolute right-3 bottom-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          <Maximize2Icon className="size-3" />
          {active + 1} / {images.length}
        </span>
      </div>

      {/* Thumbnail strip — drives the main slide via the thumbs module */}
      <Swiper
        modules={[Thumbs]}
        onSwiper={setThumbsSwiper}
        slidesPerView={4.5}
        spaceBetween={8}
        watchSlidesProgress
        className="!h-[72px] w-full sm:!h-[84px]"
      >
        {images.map((src, i) => (
          <SwiperSlide key={`thumb-${src}-${i}`} className="!h-auto">
            <button
              type="button"
              aria-label={`View photo ${i + 1}`}
              onClick={() => thumbsSwiper?.slideTo(i)}
              className={cn(
                "relative aspect-[4/3] w-full overflow-hidden rounded-md border-2 transition-all",
                active === i
                  ? "border-primary opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
