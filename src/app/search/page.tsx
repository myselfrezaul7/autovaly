import { getAllArticles, getAllVehicles } from "@/lib/content";
import { classicSpotlightItems } from "@/lib/data/classic-spotlight";
import { Metadata } from "next";
import SearchClientHub from "@/components/SearchClientHub";

export const metadata: Metadata = {
  title: "Search Car Database, News, Reviews & Classics — Autovaly",
  description: "Search Autovaly for vehicles, specifications, news, EV reviews, and classic heritage cars in real time.",
  openGraph: {
    title: "Search Car Database, News & Reviews | Autovaly",
    description: "Search Autovaly for vehicles, specifications, news, and classic cars.",
    url: "https://autovaly.com/search",
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

  return (
    <div className="min-h-screen bg-background text-text-light py-12 lg:py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="mb-8">
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
    </div>
  );
}
