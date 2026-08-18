import { getAllVehicles } from "@/lib/content";
import VehicleCatalog from "@/components/VehicleCatalog";
import { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ItemListJsonLd from "@/components/ItemListJsonLd";

export const metadata: Metadata = {
  title: "Vehicle Database 2026 — Specs, Prices & Expert Reviews for Every Car",
  description: "Browse our comprehensive vehicle database with full specs, pricing in EUR and USD, and expert reviews for electric, hybrid, and combustion cars.",
  openGraph: {
    title: "Vehicle Database 2026 — Specs, Prices & Expert Reviews | Autovaly",
    description: "Browse our comprehensive vehicle database with full specs, pricing in EUR and USD, and expert reviews.",
    url: "https://autovaly.com/vehicles",
    images: [{ url: "https://autovaly.com/og-image.jpg", width: 1200, height: 630, alt: "Autovaly Vehicle Database" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vehicle Database 2026 | Autovaly",
    description: "Full specs, pricing in EUR/USD, and expert verdicts for every car.",
  },
  alternates: { canonical: "/vehicles" },
};

export default function VehiclesPage() {
  const vehicles = getAllVehicles();

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Vehicles", url: "/vehicles" },
  ];

  const itemList = vehicles.map((v, i) => ({
    position: i + 1,
    name: `${v.make} ${v.model}`,
    url: `/vehicles/${v.slug}`,
  }));

  return (
    <main id="main-content" className="container mx-auto px-4 md:px-6 py-12 lg:py-20">
      <BreadcrumbJsonLd crumbs={crumbs} />
      <ItemListJsonLd items={itemList} />
      <Breadcrumbs crumbs={crumbs} />
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight mb-4 text-text-light">
            Vehicle Database
          </h1>
          <p className="text-lg text-text-muted max-w-2xl">
            Browse our comprehensive catalog of the latest electric, hybrid, and combustion vehicles. Detailed specs, pricing, and our expert take.
          </p>
        </header>

        <VehicleCatalog initialVehicles={vehicles} />
      </div>
    </main>
  );
}
