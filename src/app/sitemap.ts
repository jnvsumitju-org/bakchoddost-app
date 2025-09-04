import type { MetadataRoute } from "next";
import { FE_ENV } from "../lib/env";

type BrowseResponse = {
  items: Array<{ _id: string; ownerUsername?: string | null }>;
  page: number;
  pages: number;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = FE_ENV.SITE_URL;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || FE_ENV.API_BASE_URL;
  const now = new Date();

  const staticRoutes = ["", "/start", "/templates", "/poems", "/about", "/u"] as const;

  const urls: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route === "" ? "/" : route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  // Collect dynamic user pages by browsing poems and extracting distinct owner usernames
  try {
    const usernames = new Set<string>();
    const limit = 50;
    let page = 1;
    let totalPages = 1;
    const maxPages = 50; // safety cap to avoid excessive load

    while (page <= totalPages && page <= maxPages) {
      const res = await fetch(`${apiBase}/api/poems/browse?page=${page}&limit=${limit}`, {
        // Cache for 1 hour to reduce load but keep sitemap reasonably fresh
        next: { revalidate: 3600 },
      });
      if (!res.ok) break;
      const data = (await res.json()) as BrowseResponse;
      data.items.forEach((item) => {
        const u = (item.ownerUsername || "").trim();
        if (u) usernames.add(u);
      });
      totalPages = data.pages || 1;
      page += 1;
    }

    usernames.forEach((username) => {
      urls.push({
        url: `${baseUrl}/u/${encodeURIComponent(username)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    });
  } catch {
    // If API fails, fall back to static routes only
  }

  return urls;
}


