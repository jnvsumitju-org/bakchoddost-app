import type { MetadataRoute } from "next";
import { FE_ENV } from "../lib/env";

export default function robots(): MetadataRoute.Robots {
  const base = FE_ENV.SITE_URL;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/*"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}


