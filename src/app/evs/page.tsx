import { getArticlesByCategory, getAllVehicles } from "@/lib/content";
import { evSpotlightItems } from "@/lib/data/ev-spotlight";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ItemListJsonLd from "@/components/ItemListJsonLd";
import EVClientHub from "@/components/EVClientHub";

export const metadata: Metadata = {
  title: "Electric Vehicles (EV) Hub 2026 — Range & Fast-Charging Command Center",
  description: "Explore the ultimate 2026 EV Command Center. Compare range, 800V ultra-fast charging speeds, hypercar acceleration, and in-depth electric vehicle reviews.",
  openGraph: {
    title: "Electric Vehicles (EV) Hub 2026 — Range & Fast-Charging Command Center | Autovaly",
    description: "Compare range, 800V ultra-fast charging speeds, hypercar acceleration, and in-depth EV reviews from Autovaly.",
    url: "https://autovaly.com/evs",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Autovaly EV Command Center" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Electric Vehicles (EV) Hub 2026 — Range & Fast-Charging Command Center",
    description: "Compare range, 800V ultra-fast charging speeds, hypercar acceleration, and in-depth electric vehicle reviews.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "/evs" },
};

export default function EVsPage() {
  const articles = getArticlesByCategory("EV");
  const allVehicles = getAllVehicles();
  
  // Filter for pure electric and high-capacity EV fleet
  const evVehicles = allVehicles.filter(
    (v) => v.fuelType === "BEV" || (v.evSpecs && v.evSpecs.rangeKm >= 150) || v.segments.includes("EVs")
  );

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Electric Vehicles", url: "/evs" },
  ];

  const itemList = [
    ...evVehicles.slice(0, 15).map((v, i) => ({
      position: i + 1,
      name: `${v.year} ${v.make} ${v.model} ${v.trim}`,
      url: `/vehicles/${v.slug}`,
    })),
    ...articles.slice(0, 10).map((a, i) => ({
      position: 16 + i,
      name: a.title,
      url: `/articles/${a.slug}`,
    })),
  ];

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Electric Vehicle (EV) Command Center 2026",
    description: "Explore the comprehensive 2026 EV fleet, real-time range & 800V fast-charging comparison matrix, and in-depth electric automotive journalism.",
    url: "https://autovaly.com/evs",
    about: {
      "@type": "Thing",
      name: "Electric Vehicles",
      description: "Battery electric vehicles (BEV), 800V fast-charging architecture, electric hypercars, and electric SUVs.",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: evVehicles.slice(0, 12).map((v, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${v.year} ${v.make} ${v.model}`,
        url: `https://autovaly.com/vehicles/${v.slug}`,
      })),
    },
  };

  return (
    <main id="main-content" className="min-h-screen bg-background text-text-light py-10 md:py-14">
      {/* JSON-LD Schemas */}
      <BreadcrumbJsonLd crumbs={crumbs} />
      <ItemListJsonLd items={itemList} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />

      <div className="container mx-auto px-4 md:px-6">
        <Breadcrumbs crumbs={crumbs} />

        {/* Page Hero Header */}
        <header className="mb-10 pb-6 border-b border-border-custom">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#00D2D3] bg-[#00D2D3]/10 px-3 py-1 rounded-full border border-[#00D2D3]/25 inline-flex items-center gap-1.5">
              <span>⚡</span> Zero-Emissions Propulsion & 800V Architecture
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-tight mb-4">
            Electric Vehicles <span className="text-[#00D2D3]">Command Center</span>
          </h1>
          <p className="text-base sm:text-lg text-text-muted max-w-3xl leading-relaxed">
            The definitive 2026 EV telemetry guide: benchmarking WLTP range endurance, 800V ultra-fast charging curves, and sub-2s hypercar engineering across the global electric vehicle fleet.
          </p>
        </header>

        {/* Interactive 120Hz EV Client Hub */}
        <EVClientHub
          vehicles={evVehicles}
          spotlightItems={evSpotlightItems}
          articles={articles}
        />
      </div>
    </main>
  );
}
