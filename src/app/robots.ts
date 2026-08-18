import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/studio/", "/api/", "/search", "/garage"],
    },
    sitemap: "https://autovaly.com/sitemap.xml",
  };
}
