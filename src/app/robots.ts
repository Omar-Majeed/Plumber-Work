import type { MetadataRoute } from "next";
import { absoluteUrl, isProductionStage } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  // A demo build is never offered to crawlers.
  if (!isProductionStage) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      sitemap: absoluteUrl("/sitemap.xml"),
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
