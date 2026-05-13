"use client";

import { useState, useMemo } from "react";
import Price from "@/components/ui/Price";
import Link from "next/link";
import { Vehicle } from "@/lib/types";
import { useRecentlyViewed } from "@/lib/useRecentlyViewed";

export default function VehicleCatalog({ initialVehicles }: { initialVehicles: Vehicle[] }) {
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [bodyStyles, setBodyStyles] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("Newest First");
  const { recentlyViewed } = useRecentlyViewed();

  const toggleFuelType = (type: string) => {
    setFuelTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const toggleBodyStyle = (type: string) => {
    setBodyStyles(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const clearFilters = () => {
    setFuelTypes([]);
    setBodyStyles([]);
  };

  const filteredVehicles = useMemo(() => {
    let result = initialVehicles;

    if (fuelTypes.length > 0) {
      result = result.filter(v => fuelTypes.includes(v.fuelType));
    }

    if (bodyStyles.length > 0) {
      // Map body styles roughly based on segments or just mock it since we don't have explicit bodyStyle.
      // We will match against segments: "SUVs", "Sedans", "Trucks", "Sports Cars"
      result = result.filter(v => {
        return bodyStyles.some(style => {
          if (style === "SUV" && v.segments.includes("SUVs")) return true;
          if (style === "Sedan" && v.segments.includes("Sedans")) return true;
          if (style === "Truck" && v.segments.includes("Trucks")) return true;
          if (style === "Sports Car" && v.segments.includes("Sports Cars")) return true;
          return false;
        });
      });
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.priceUsd - b.priceUsd;
      if (sortBy === "Price: High to Low") return b.priceUsd - a.priceUsd;
      if (sortBy === "Alphabetical") return a.model.localeCompare(b.model);
      return 0; // Newest first (default order)
    });

    return result;
  }, [initialVehicles, fuelTypes, bodyStyles, sortBy]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar / Filters */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="bg-surface border border-border-custom rounded-xl p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6 border-b border-border-custom pb-4">
            <h3 className="font-bold uppercase tracking-widest text-sm">Filters</h3>
            {(fuelTypes.length > 0 || bodyStyles.length > 0) && (
              <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {fuelTypes.length + bodyStyles.length}
              </span>
            )}
          </div>
          
          <div className="mb-6">
            <h4 className="font-bold text-sm mb-3">Fuel Type</h4>
            <div className="flex flex-col gap-2">
              {["BEV", "PHEV", "Hybrid", "Gasoline"].map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={fuelTypes.includes(type)}
                    onChange={() => toggleFuelType(type)}
                    className="w-4 h-4 rounded border-border-custom text-accent focus:ring-accent accent-accent cursor-pointer" 
                  />
                  <span className="text-sm text-text-muted group-hover:text-text-primary transition-colors">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-bold text-sm mb-3">Body Style</h4>
            <div className="flex flex-col gap-2">
              {["SUV", "Sedan", "Truck", "Sports Car"].map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={bodyStyles.includes(type)}
                    onChange={() => toggleBodyStyle(type)}
                    className="w-4 h-4 rounded border-border-custom text-accent focus:ring-accent accent-accent cursor-pointer" 
                  />
                  <span className="text-sm text-text-muted group-hover:text-text-primary transition-colors">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <button 
            onClick={clearFilters}
            className="w-full py-2 bg-border-custom hover:bg-border-custom/80 rounded-md text-sm font-bold transition-colors text-text-primary"
          >
            Clear Filters
          </button>
        </div>
      </aside>

      {/* Main Grid */}
      <main className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-text-muted">Showing {filteredVehicles.length} vehicles</p>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface border border-border-custom rounded-md px-3 py-1.5 text-sm outline-none focus:border-accent text-text-primary"
          >
            <option>Newest First</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Alphabetical</option>
          </select>
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="text-center py-20 bg-surface border border-border-custom rounded-xl mb-12">
            <h3 className="text-xl font-bold mb-2">No vehicles found</h3>
            <p className="text-text-muted">Try adjusting your filters to see more results.</p>
            <button onClick={clearFilters} className="mt-4 text-accent font-bold hover:underline">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
            {filteredVehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/vehicles/${vehicle.slug}`}
                className="flex flex-col bg-surface border border-border-custom rounded-xl overflow-hidden hover:border-accent hover:shadow-card-shadow transition-all group"
              >
                <div 
                  className="h-48 w-full bg-border-custom relative"
                  style={{ background: `linear-gradient(135deg, ${vehicle.coverGradient.from}, ${vehicle.coverGradient.to})` }}
                >
                  {vehicle.coverImage && (
                    <img src={vehicle.coverImage} alt={vehicle.model} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-background/80 backdrop-blur px-2 py-1 rounded text-xs font-bold uppercase text-text-primary">{vehicle.fuelType}</span>
                    {vehicle.new2025 && <span className="bg-accent text-white px-2 py-1 rounded text-xs font-bold uppercase">New</span>}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-xs text-text-muted mb-1 font-medium uppercase tracking-wider">{vehicle.make}</div>
                  <h2 className="text-xl font-bold font-heading mb-3 group-hover:text-accent transition-colors line-clamp-1">{vehicle.model}</h2>
                  
                  <div className="flex flex-col gap-2 mb-4 text-sm text-text-secondary">
                    <div className="flex justify-between border-b border-border-custom/50 pb-1">
                      <span>Power</span>
                      <span className="font-medium text-text-primary">{vehicle.specs.powerHp} hp</span>
                    </div>
                    <div className="flex justify-between border-b border-border-custom/50 pb-1">
                      <span>0-100 km/h</span>
                      <span className="font-medium text-text-primary">{vehicle.specs.acceleration060}s</span>
                    </div>
                    {vehicle.evSpecs && (
                      <div className="flex justify-between border-b border-border-custom/50 pb-1">
                        <span>Range (WLTP)</span>
                        <span className="font-medium text-text-primary">{vehicle.evSpecs.rangeKm} km</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <Price eurAmount={vehicle.priceEur} usdAmount={vehicle.priceUsd} className="font-bold text-lg text-text-primary" />
                    <span className="text-xs font-bold text-accent group-hover:underline">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {recentlyViewed.length > 0 && (
          <div className="border-t border-border-custom pt-10 mt-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-6 h-1 bg-accent rounded-full inline-block"></span>
              Recently Viewed
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {recentlyViewed.slice(0, 4).map((vehicle) => (
                <Link
                  key={`recent-${vehicle.id}`}
                  href={`/vehicles/${vehicle.slug}`}
                  className="flex flex-col bg-surface border border-border-custom rounded-lg overflow-hidden hover:border-accent hover:shadow-card-shadow transition-all group"
                >
                  <div className="h-32 w-full bg-border-custom relative" style={{ background: `linear-gradient(135deg, ${vehicle.coverGradient.from}, ${vehicle.coverGradient.to})` }}>
                    {vehicle.coverImage && <img src={vehicle.coverImage} alt={vehicle.model} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />}
                  </div>
                  <div className="p-3">
                    <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{vehicle.make}</div>
                    <h4 className="text-sm font-bold font-heading group-hover:text-accent transition-colors line-clamp-1">{vehicle.model}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
