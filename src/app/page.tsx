import type { Metadata } from "next";
import { business } from "@/content/business";
import { Hero } from "@/components/sections/hero";
import { TrustStrip } from "@/components/sections/trust-strip";
import { EnquirySection } from "@/components/sections/enquiry-section";
import { ProposedServices } from "@/components/sections/proposed-services";
import { Promises } from "@/components/sections/promises";
import { Process } from "@/components/sections/process";
import { AboutPreview } from "@/components/sections/about-preview";
import { ServiceAreas } from "@/components/sections/service-areas";
import { Testimonials } from "@/components/sections/testimonials";
import { LocationContact } from "@/components/sections/location-contact";
import { FinalCta } from "@/components/sections/final-cta";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: `Plumber & Gasfitter Rockhampton | ${business.displayName}`,
    description: `Contact ${business.displayName} for plumbing and gasfitting enquiries in ${business.address.locality}. Call ${business.phone.display} or request a callback.`,
    path: "/",
  }),
  // The home page title is absolute: it should not pick up the "%s | brand"
  // template defined in the root layout.
  title: {
    absolute: `Plumber & Gasfitter Rockhampton | ${business.displayName}`,
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ProposedServices />
      <Promises />
      <Process />
      <EnquirySection />
      <AboutPreview />
      <ServiceAreas />
      <Testimonials />
      <LocationContact />
      <FinalCta />
    </>
  );
}
