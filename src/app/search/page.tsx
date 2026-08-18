import { getAllArticles, getAllVehicles } from "@/lib/content";
import { classicSpotlightItems } from "@/lib/data/classic-spotlight";
import { Metadata } from "next";
import SearchClientHub from "@/components/SearchClientHub";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Search Car Database, News, Reviews & Classics — Autovaly",
  description: "Search Autovaly for vehicles, specifications, news, EV reviews, and classic heritage cars in real time.",
  openGraph: {
    title: "Search Car Database, News & Reviews | Autovaly",
    description: "Search Autovaly for vehicles, specifications, news, and classic cars.",
    url: "https://autovaly.com/search",
    images: [{ url: "https://autovaly.com/og-image.jpg", width: 1200, height: 630, alt: "Autovaly Search Hub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Car Database, News & Reviews | Autovaly",
    description: "Search Autovaly for vehicles, specifications, news, and classic cars.",
  },
  alternates: { canonical: "/search" },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tab?: string }>;
}) {
  const params = await searchParams;
  const initialQuery = params.q || "";
  const initialTab = params.tab || "all";

  const allArticles = getAllArticles();
  const allVehicles = getAllVehicles();
  const allClassics = classicSpotlightItems;

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Search", url: "/search" },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-background text-text-light py-12 lg:py-16">
      <BreadcrumbJsonLd crumbs={crumbs} />
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <Breadcrumbs crumbs={crumbs} />
        <div className="mb-8 mt-4">
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded border border-accent/20 mb-3 inline-block">
            Universal Intelligence Search
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight">
            Search Automotive Database
          </h1>
        </div>

        <SearchClientHub
          initialQuery={initialQuery}
          initialTab={initialTab}
          allArticles={allArticles}
          allVehicles={allVehicles}
          allClassics={allClassics}
        />
      </div>
    </main>
  );
}
