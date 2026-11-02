import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { HowItWorks } from "@/components/home/how-it-works";
import { HostGuarantee } from "@/components/home/host-guarantee";
import { FAQ } from "@/components/home/faq";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Four steps from discovering a studio to rolling camera — plus answers to the questions creators ask most.",
};

export default function HowItWorksPage() {
  return (
    <>
      <div className="section-pad pt-12 sm:pt-16">
        <SectionHeading
          eyebrow="How It Works"
          title="Booking a studio, start to finish"
          description="No phone tags, no hidden fees and no surprise deposits — just four steps between you and the shoot."
        />
      </div>
      <HowItWorks />
      <FAQ />
      <HostGuarantee />
    </>
  );
}
