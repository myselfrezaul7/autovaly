import { getAllVehicles } from "@/lib/content";
import Price from "@/components/ui/Price";
import Link from "next/link";
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Filters (Static for now, could be made client-side) */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-surface border border-border-custom rounded-xl p-6 sticky top-24">
              <h3 className="font-bold uppercase tracking-widest text-sm mb-6 border-b border-border-custom pb-4">Filters</h3>
              
              <div className="mb-6">
                <h4 className="font-bold text-sm mb-3">Fuel Type</h4>
                <div className="flex flex-col gap-2">
                  {["BEV", "PHEV", "Hybrid", "Gasoline"].map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-border-custom text-accent focus:ring-accent accent-accent cursor-pointer" />
                      <span className="text-sm text-text-muted group-hover:text-text-light transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-sm mb-3">Body Style</h4>
                <div className="flex flex-col gap-2">
                  {["SUV", "Sedan", "Truck", "Sports Car"].map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded border-border-custom text-accent focus:ring-accent accent-accent cursor-pointer" />
                      <span className="text-sm text-text-muted group-hover:text-text-light transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full py-2 bg-border-custom hover:bg-border-custom/80 rounded-md text-sm font-bold transition-colors">
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Main Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-medium text-muted">Showing {vehicles.length} vehicles</p>
              <select className="bg-surface border border-border-custom rounded-md px-3 py-1.5 text-sm outline-none focus:border-accent">
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Alphabetical</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  href={`/vehicles/${vehicle.slug}`}
                  className="flex flex-col bg-surface border border-border-custom rounded-xl overflow-hidden hover:border-accent transition-all group"
                >
                  <div 
                    className="h-48 w-full bg-border-custom relative"
                    style={{ background: `linear-gradient(135deg, ${vehicle.coverGradient.from}, ${vehicle.coverGradient.to})` }}
                  >
                    {vehicle.coverImage && (
                      <img src={vehicle.coverImage} alt={vehicle.model} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-background/80 backdrop-blur px-2 py-1 rounded text-xs font-bold uppercase">{vehicle.fuelType}</span>
                      {vehicle.new2025 && <span className="bg-accent text-white px-2 py-1 rounded text-xs font-bold uppercase">New</span>}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-xs text-muted mb-1 font-medium uppercase tracking-wider">{vehicle.make}</div>
                    <h2 className="text-xl font-bold font-heading mb-3 group-hover:text-accent transition-colors line-clamp-1">{vehicle.model}</h2>
                    
                    <div className="flex flex-col gap-2 mb-4 text-sm text-text-muted">
                      <div className="flex justify-between border-b border-border-custom/50 pb-1">
                        <span>Power</span>
                        <span className="font-medium text-text-light">{vehicle.specs.powerHp} hp</span>
                      </div>
                      <div className="flex justify-between border-b border-border-custom/50 pb-1">
                        <span>0-100 km/h</span>
                        <span className="font-medium text-text-light">{vehicle.specs.acceleration060}s</span>
                      </div>
                      {vehicle.evSpecs && (
                        <div className="flex justify-between border-b border-border-custom/50 pb-1">
                          <span>Range (WLTP)</span>
                          <span className="font-medium text-text-light">{vehicle.evSpecs.rangeKm} km</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <Price eurAmount={vehicle.priceEur} usdAmount={vehicle.priceUsd} className="font-bold text-lg" />
                      <span className="text-xs font-bold text-accent group-hover:underline">View Details →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
