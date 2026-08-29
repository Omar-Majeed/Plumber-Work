import type { Metadata } from "next";
import { business } from "@/content/business";
import { Hero } from "@/components/sections/hero";
import { VerifiedStrip } from "@/components/sections/verified-strip";
import { ServicesSection } from "@/components/sections/services-section";
import { LocalIntroduction } from "@/components/sections/local-introduction";
import { WhyContact } from "@/components/sections/why-contact";
import { Process } from "@/components/sections/process";
import { LocationSection } from "@/components/sections/location-section";
import { FaqSection } from "@/components/sections/faq-section";
import { ContactSection } from "@/components/sections/contact-section";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: `Plumber & Gasfitter Rockhampton | ${business.displayName}`,
    description: `Contact ${business.displayName} for plumbing and gasfitting services in Rockhampton. Call ${business.phone.display} or send an enquiry.`,
    path: "/",
  }),
  // Absolute: the home page title must not pick up the "%s | brand" template
  // defined in the root layout.
  title: {
    absolute: `Plumber & Gasfitter Rockhampton | ${business.displayName}`,
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <VerifiedStrip />
      <ServicesSection />
      <LocalIntroduction />
      <WhyContact />
      <Process />
      <LocationSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
