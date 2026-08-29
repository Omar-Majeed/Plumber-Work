import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { business } from "@/content/business";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { plumberStructuredData } from "@/lib/seo";
import { siteUrl } from "@/lib/site-config";

/**
 * Fonts are self-hosted variable subsets (latin) served from the app bundle,
 * so there is no render-blocking request to a font CDN and no layout shift
 * from a late-arriving stylesheet. Only weights 400-500 are used.
 */
const manrope = localFont({
  src: "../fonts/manrope-latin-variable.woff2",
  weight: "400 500",
  style: "normal",
  variable: "--font-manrope",
  display: "swap",
  preload: true,
  fallback: ["Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

const inter = localFont({
  src: "../fonts/inter-latin-variable.woff2",
  weight: "400 500",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Plumber & Gasfitter Rockhampton | ${business.displayName}`,
    template: `%s | ${business.displayName}`,
  },
  description: `Contact ${business.displayName} for plumbing and gasfitting enquiries in ${business.address.locality}. Call ${business.phone.display} or request a callback.`,
  applicationName: business.displayName,
  authors: [{ name: business.legalName }],
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#0B2036",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${manrope.variable} ${inter.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only rounded-[var(--radius-control)] focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-white focus:px-4 focus:py-2.5 focus:text-[var(--colour-navy-900)] focus:ring-2 focus:ring-[var(--colour-aqua-700)]"
        >
          Skip to main content
        </a>

        <SiteHeader />

        <main id="main" tabIndex={-1}>
          {children}
        </main>

        <SiteFooter />
        <JsonLd data={plumberStructuredData()} />
      </body>
    </html>
  );
}
