import type { Metadata } from "next";
import { HeroSlider } from "@/components/home/hero-slider";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { CategoryBrowser } from "@/components/home/category-browser";
import { HowItWorks } from "@/components/home/how-it-works";
import { HostGuarantee } from "@/components/home/host-guarantee";
import { Testimonials, CtaBand } from "@/components/home/social-proof";

export const metadata: Metadata = {
  title:
    "StudioSpace — Peer-to-Peer Creative Workspace & Production Studio Sharing",
};

export default function Home() {
  return (
    <>
      <HeroSlider />
      <FeaturedStudios />
      <CategoryBrowser />
      <HowItWorks />
      <HostGuarantee />
      <Testimonials />
      <CtaBand />
    </>
  );
}
