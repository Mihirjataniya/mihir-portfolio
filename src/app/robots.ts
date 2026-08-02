import type { MetadataRoute } from "next";
import { absUrl } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nothing user-facing lives under these; keeping them out of the crawl
      // budget costs nothing.
      disallow: ["/_next/", "/api/"],
    },
    sitemap: absUrl("/sitemap.xml"),
    host: absUrl("/"),
  };
}
