import { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const baseUrl = "https://autovaly.com";

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/reviews`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/evs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...articles.map((a) => ({
      url: `${baseUrl}/articles/${a.slug}`,
      lastModified: new Date(a.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
