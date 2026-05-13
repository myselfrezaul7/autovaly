import { getAllVehicles } from "@/lib/content";
import Price from "@/components/ui/Price";
import Link from "next/link";
import VehicleCatalog from "@/components/VehicleCatalog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vehicle Catalog",
  description: "Browse our comprehensive database of electric, hybrid, and combustion vehicles with full specifications and comparison data.",
};

export default function VehiclesPage() {
  const vehicles = getAllVehicles();

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20">
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
