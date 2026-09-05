"use client";

import { useState, useMemo } from "react";
import Price from "@/components/ui/Price";
import Link from "next/link";
import Image from "next/image";
import { Vehicle } from "@/lib/types";
import { useRecentlyViewed } from "@/lib/useRecentlyViewed";
import { useGarage } from "@/lib/useGarage";
import ScrollReveal from "./ui/ScrollReveal";

export default function VehicleCatalog({ initialVehicles }: { initialVehicles: Vehicle[] }) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [bodyStyles, setBodyStyles] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("Newest First");
  const [visibleCount, setVisibleCount] = useState(24);
  const { recentlyViewed } = useRecentlyViewed();
  const { garage, addToGarage, removeFromGarage } = useGarage();

  const toggleFuelType = (type: string) => {
    setVisibleCount(24);
    setFuelTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  const toggleBodyStyle = (type: string) => {
    setVisibleCount(24);
    setBodyStyles((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  const clearFilters = () => {
    setFuelTypes([]);
    setBodyStyles([]);
    setSearchKeyword("");
    setVisibleCount(24);
  };

  const isSavedInGarage = (id: string) => garage.some((v) => v.id === id);

  const toggleGarageItem = (e: React.MouseEvent, vehicle: Vehicle) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSavedInGarage(vehicle.id)) {
      removeFromGarage(vehicle.id);
    } else {
      addToGarage(vehicle);
    }
  };

  const filteredVehicles = useMemo(() => {
    let result = initialVehicles;

    // Search keyword
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      result = result.filter(
        (v) =>
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.trim.toLowerCase().includes(q) ||
          v.fuelType.toLowerCase().includes(q) ||
          v.bodyStyle.toLowerCase().includes(q)
      );
    }

    // Fuel Type
    if (fuelTypes.length > 0) {
      result = result.filter((v) => fuelTypes.includes(v.fuelType));
    }

    // Body Style
    if (bodyStyles.length > 0) {
      result = result.filter((v) => bodyStyles.includes(v.bodyStyle));
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.priceUsd - b.priceUsd;
      if (sortBy === "Price: High to Low") return b.priceUsd - a.priceUsd;
      if (sortBy === "Alphabetical") return a.make.localeCompare(b.make) || a.model.localeCompare(b.model);
      if (sortBy === "Newest First") return b.year - a.year;
      return 0;
    });

    return result;
  }, [initialVehicles, searchKeyword, fuelTypes, bodyStyles, sortBy]);

  const activeFilterCount = fuelTypes.length + bodyStyles.length + (searchKeyword ? 1 : 0);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-72 flex-shrink-0">
        <div className="bg-surface border border-border-custom rounded-3xl p-6 sticky top-24 z-30 shadow-xl">
          <div className="flex items-center justify-between mb-6 border-b border-border-custom pb-4">
            <h3 className="font-heading font-extrabold uppercase tracking-wider text-sm text-text-light">
              Catalog Filters
            </h3>
            {activeFilterCount > 0 && (
              <span className="bg-accent text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                {activeFilterCount} Active
              </span>
            )}
          </div>

          {/* Quick Keyword Search */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase text-text-muted mb-2">Search Models</label>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="e.g. Taycan, Tesla, M3..."
              className="w-full bg-background border border-border-custom rounded-xl px-3 py-2 text-xs text-text-light placeholder:text-text-muted outline-none focus:border-accent"
            />
          </div>

          {/* Fuel Type Filters */}
          <div className="mb-6">
            <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted mb-3">Powertrain</h4>
            <div className="flex flex-col gap-2.5">
              {["BEV", "PHEV", "Hybrid", "Gasoline"].map((type) => (
                <label key={type} className="flex items-center justify-between cursor-pointer group select-none">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={fuelTypes.includes(type)}
                      onChange={() => toggleFuelType(type)}
                      className="w-4 h-4 rounded border-border-custom text-accent focus:ring-accent accent-accent cursor-pointer"
                    />
                    <span className="text-xs text-text-muted group-hover:text-text-light transition-colors font-medium">
                      {type === "BEV" ? "100% Electric (BEV)" : type}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Body Style Filters */}
          <div className="mb-6">
            <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted mb-3">Body Style</h4>
            <div className="flex flex-col gap-2.5">
              {["SUV", "Sedan", "Coupe", "Truck", "Hatchback", "Convertible"].map((type) => (
                <label key={type} className="flex items-center justify-between cursor-pointer group select-none">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={bodyStyles.includes(type)}
                      onChange={() => toggleBodyStyle(type)}
                      className="w-4 h-4 rounded border-border-custom text-accent focus:ring-accent accent-accent cursor-pointer"
                    />
                    <span className="text-xs text-text-muted group-hover:text-text-light transition-colors font-medium">
                      {type}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="w-full py-2.5 bg-background hover:bg-surface-hover border border-border-custom rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-accent touch-press active:scale-95 cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </aside>

      {/* Main Catalog Grid */}
      <main className="flex-1">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border-custom">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Showing <span className="text-accent font-extrabold">{filteredVehicles.length}</span> of {initialVehicles.length} Vehicles
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted font-bold uppercase">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface border border-border-custom rounded-xl px-3 py-1.5 text-xs font-bold outline-none focus:border-accent text-text-light cursor-pointer"
            >
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-20 bg-surface border border-border-custom rounded-3xl mb-12 p-8">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-xl font-bold font-heading mb-2 text-text-light">No vehicles match your criteria</h3>
            <p className="text-sm text-text-muted max-w-md mx-auto mb-6">
              Try adjusting your fuel type, body style, or clearing search keywords.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-accent text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-accent/25 hover:bg-accent/90"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
            {filteredVehicles.slice(0, visibleCount).map((vehicle, idx) => {
              const saved = isSavedInGarage(vehicle.id);
              return (
                <ScrollReveal key={vehicle.id} delay={0.04 * Math.min(idx, 8)}>
                  <div className="contain-card flex flex-col bg-surface border border-border-custom rounded-2xl overflow-hidden hover:border-accent hover:shadow-2xl transition-all group h-full relative">
                    <Link
                      href={`/vehicles/${vehicle.slug}`}
                      className="block h-48 w-full relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${vehicle.coverGradient.from}, ${vehicle.coverGradient.to})` }}
                    >
                      {vehicle.coverImage && (
                        <Image
                          src={vehicle.coverImage}
                          alt={vehicle.model}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                      )}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase text-white border border-white/10">
                          {vehicle.fuelType}
                        </span>
                        {vehicle.new2025 && (
                          <span className="bg-accent text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shadow-lg shadow-accent/40">
                            NEW
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Quick Garage Bookmark Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleGarageItem(e, vehicle)}
                      className={`absolute top-4 right-4 z-20 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${
                        saved
                          ? "bg-accent border-accent text-white shadow-lg"
                          : "bg-black/60 border-white/10 text-white/80 hover:text-accent hover:bg-black/90"
                      }`}
                      aria-label={saved ? "Remove from Garage" : "Save to Garage"}
                      title={saved ? "Saved in Garage" : "Save to Garage"}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-accent mb-1">{vehicle.make}</div>
                        <h4 className="font-heading font-extrabold text-xl text-text-light mb-1 group-hover:text-accent transition-colors">
                          {vehicle.model}
                        </h4>
                        <div className="text-xs text-text-muted mb-4">{vehicle.trim}</div>

                        {/* Specs row */}
                        <div className="grid grid-cols-2 gap-2 text-xs bg-background/50 rounded-xl p-3 mb-4 border border-border-custom/50">
                          <div>
                            <span className="text-[10px] text-text-muted block font-bold uppercase">Power</span>
                            <span className="font-bold text-text-light">{vehicle.specs.powerHp} hp</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-text-muted block font-bold uppercase">0-100 km/h</span>
                            <span className="font-bold text-text-light">{vehicle.specs.acceleration060}s</span>
                          </div>
                          {vehicle.evSpecs && (
                            <div className="col-span-2 pt-1.5 border-t border-border-custom/40 flex justify-between items-center">
                              <span className="text-[10px] text-text-muted font-bold uppercase">Range (WLTP)</span>
                              <span className="font-bold text-tag-ev">{vehicle.evSpecs.rangeKm} km</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border-custom/50 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-text-muted block">Base Price</span>
                          <Price eurAmount={vehicle.priceEur} usdAmount={vehicle.priceUsd} className="font-extrabold text-base text-text-light tabular-nums" />
                        </div>
                        <Link
                          href={`/vehicles/${vehicle.slug}`}
                          className="text-xs font-bold text-accent group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                        >
                          Specs <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}

        {/* Load More Pagination */}
        {filteredVehicles.length > visibleCount && (
          <div className="flex justify-center -mt-8 mb-16">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 24)}
              className="px-8 py-3.5 bg-surface border border-border-custom hover:border-accent text-text-light font-heading font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all touch-press cursor-pointer hover:bg-surface-hover"
            >
              Load More Vehicles ({filteredVehicles.length - visibleCount} remaining) ↓
            </button>
          </div>
        )}

        {/* Recently Viewed Strip */}
        {recentlyViewed.length > 0 && (
          <div className="border-t border-border-custom pt-10 mt-6">
            <h3 className="text-lg font-heading font-bold mb-6 flex items-center gap-2 text-text-light">
              <span className="w-4 h-1 bg-accent rounded-full inline-block" />
              Recently Viewed in Session
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentlyViewed.slice(0, 4).map((vehicle) => (
                <Link
                  key={`recent-${vehicle.id}`}
                  href={`/vehicles/${vehicle.slug}`}
                  className="flex flex-col bg-surface border border-border-custom rounded-2xl overflow-hidden hover:border-accent transition-all group shadow-md"
                >
                  <div
                    className="h-28 w-full bg-border-custom relative"
                    style={{ background: `linear-gradient(135deg, ${vehicle.coverGradient.from}, ${vehicle.coverGradient.to})` }}
                  >
                    {vehicle.coverImage && (
                      <Image
                        src={vehicle.coverImage}
                        alt={vehicle.model}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    )}
                  </div>
                  <div className="p-3">
                    <div className="text-[10px] text-accent font-bold uppercase tracking-wider">{vehicle.make}</div>
                    <h4 className="text-xs font-bold font-heading group-hover:text-accent transition-colors line-clamp-1 text-text-light">
                      {vehicle.model}
                    </h4>
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
