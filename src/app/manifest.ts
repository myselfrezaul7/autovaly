import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Autovaly — Automotive News & Intelligence",
    short_name: "Autovaly",
    description: "Expert car reviews, instrumented road tests, comparisons, and verified vehicle specifications.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#0D0E12",
    theme_color: "#E82B2B",
    categories: ["news", "magazines", "automotive", "utilities"],
    shortcuts: [
      {
        name: "Latest Car News",
        short_name: "News",
        description: "Read latest automotive headlines and scoops",
        url: "/news",
      },
      {
        name: "Vehicle Specs Database",
        short_name: "Specs",
        description: "Search 1,200+ car specifications and telemetry",
        url: "/vehicles",
      },
      {
        name: "Compare Showdowns",
        short_name: "Compare",
        description: "Head-to-head vehicle comparisons",
        url: "/compare",
      },
      {
        name: "My Garage",
        short_name: "Garage",
        description: "View your saved dream garage collection",
        url: "/garage",
      },
    ],
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
