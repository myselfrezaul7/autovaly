import { getAllVehicles } from "@/lib/content";
import Price from "@/components/ui/Price";
import Link from "next/link";
import VehicleCatalog from "@/components/VehicleCatalog";
import { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Vehicle Database 2025 — Specs, Prices & Expert Reviews for Every Car",
  description: "Browse our comprehensive vehicle database with full specs, pricing in EUR and USD, and expert reviews for electric, hybrid, and combustion cars.",
  openGraph: {
    title: "Vehicle Database 2025 — Specs, Prices & Expert Reviews for Every Car",
    description: "Browse our comprehensive vehicle database with full specs, pricing in EUR and USD, and expert reviews for electric, hybrid, and combustion cars.",
    url: "https://autovaly.com/vehicles",
  },
  alternates: { canonical: "/vehicles" }
};

export default function VehiclesPage() {
  const vehicles = getAllVehicles();

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Vehicles", url: "/vehicles" }
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20">
      <BreadcrumbJsonLd crumbs={crumbs} />
      <Breadcrumbs crumbs={crumbs} />
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight mb-4">
            Vehicle Database
          </h1>
          <p className="text-lg text-muted max-w-2xl">
            Browse our comprehensive catalog of the latest electric, hybrid, and combustion vehicles. Detailed specs, pricing, and our expert take.
          </p>
        </header>

        <VehicleCatalog initialVehicles={vehicles} />
      </div>
    </div>
  );
}
