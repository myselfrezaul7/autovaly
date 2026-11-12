"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Vehicle, EVSpotlightItem, Article } from "@/lib/types";
import { useGarage } from "@/lib/useGarage";
import Price from "@/components/ui/Price";
import ArticleCard from "@/components/ui/ArticleCard";

export interface EVClientHubProps {
  vehicles: Vehicle[];
  spotlightItems: EVSpotlightItem[];
  articles: Article[];
}

type RangeFilter = "all" | "400+" | "500+" | "600+" | "700+";
type ChargingFilter = "all" | "800v" | "400v";
type AccelFilter = "all" | "sub-2s" | "sub-3.5s" | "sub-5s";
type BodyFilter = "all" | "Sedan" | "SUV" | "Hypercar" | "Truck";
type SortOption = "range-desc" | "charging-desc" | "accel-asc" | "power-desc" | "price-asc" | "price-desc" | "name-asc";
type ActiveTab = "fleet" | "matrix" | "editorial";

export default function EVClientHub({ vehicles, spotlightItems, articles }: EVClientHubProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<ActiveTab>("fleet");

  // Filters State
  const [rangeFilter, setRangeFilter] = useState<RangeFilter>("all");
  const [chargingFilter, setChargingFilter] = useState<ChargingFilter>("all");
  const [accelFilter, setAccelFilter] = useState<AccelFilter>("all");
  const [bodyFilter, setBodyFilter] = useState<BodyFilter>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("range-desc");

  // Comparison State
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const matrixSectionRef = useRef<HTMLDivElement>(null);

  // Garage integration
  const { garage, addToGarage, removeFromGarage } = useGarage();
  const isSavedInGarage = (id: string) => garage.some((v) => v.id === id);

  const toggleGarage = (e: React.MouseEvent, vehicle: Vehicle) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSavedInGarage(vehicle.id)) {
      removeFromGarage(vehicle.id);
    } else {
      addToGarage(vehicle);
    }
  };

  // Flagships Carousel State
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCarouselAutoplay, setIsCarouselAutoplay] = useState(true);
  const [carouselDirection, setCarouselDirection] = useState(1);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to identify hypercars
  const isHypercar = useCallback((v: Vehicle) => {
    return (
      v.bodyStyle === "Coupe" ||
      v.specs.acceleration060 < 2.2 ||
      v.specs.powerHp >= 900 ||
      v.slug.includes("nevera") ||
      v.slug.includes("mission-x") ||
      v.slug.includes("roadster") ||
      v.slug.includes("su7-ultra") ||
      v.slug.includes("sapphire")
    );
  }, []);

  // Filtered EV vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // Body filter
      if (bodyFilter === "Sedan" && v.bodyStyle !== "Sedan") return false;
      if (bodyFilter === "SUV" && v.bodyStyle !== "SUV") return false;
      if (bodyFilter === "Truck" && v.bodyStyle !== "Truck") return false;
      if (bodyFilter === "Hypercar" && !isHypercar(v)) return false;

      // Range filter (WLTP km)
      const range = v.evSpecs?.rangeKm ?? 0;
      if (rangeFilter === "400+" && range < 400) return false;
      if (rangeFilter === "500+" && range < 500) return false;
      if (rangeFilter === "600+" && range < 600) return false;
      if (rangeFilter === "700+" && range < 700) return false;

      // Charging speed filter
      const chargingKw = v.evSpecs?.chargingSpeedKw ?? 0;
      if (chargingFilter === "800v" && chargingKw < 250) return false;
      if (chargingFilter === "400v" && chargingKw >= 250) return false;

      // Acceleration filter
      const accel = v.specs.acceleration060;
      if (accelFilter === "sub-2s" && accel >= 2.0) return false;
      if (accelFilter === "sub-3.5s" && accel >= 3.5) return false;
      if (accelFilter === "sub-5s" && accel >= 5.0) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName =
          `${v.make} ${v.model} ${v.trim}`.toLowerCase().includes(q) ||
          v.bodyStyle.toLowerCase().includes(q) ||
          (v.highlights && v.highlights.some((h) => h.toLowerCase().includes(q)));
        if (!matchesName) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "range-desc") {
        return (b.evSpecs?.rangeKm ?? 0) - (a.evSpecs?.rangeKm ?? 0);
      }
      if (sortBy === "charging-desc") {
        return (b.evSpecs?.chargingSpeedKw ?? 0) - (a.evSpecs?.chargingSpeedKw ?? 0);
      }
      if (sortBy === "accel-asc") {
        return a.specs.acceleration060 - b.specs.acceleration060;
      }
      if (sortBy === "power-desc") {
        return b.specs.powerHp - a.specs.powerHp;
      }
      if (sortBy === "price-asc") {
        return a.priceEur - b.priceEur;
      }
      if (sortBy === "price-desc") {
        return b.priceEur - a.priceEur;
      }
      if (sortBy === "name-asc") {
        return `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`);
      }
      return 0;
    });
  }, [vehicles, bodyFilter, rangeFilter, chargingFilter, accelFilter, searchQuery, sortBy, isHypercar]);

  // Aggregate stats for EV Command Center Telemetry
  const stats = useMemo(() => {
    const totalEVs = vehicles.length;
    const ultraFast800vCount = vehicles.filter((v) => (v.evSpecs?.chargingSpeedKw ?? 0) >= 250).length;
    const sub3sHypercars = vehicles.filter((v) => v.specs.acceleration060 < 3.0).length;
    const maxRangeVehicle = [...vehicles].sort((a, b) => (b.evSpecs?.rangeKm ?? 0) - (a.evSpecs?.rangeKm ?? 0))[0];
    const fastestChargingVehicle = [...vehicles].sort((a, b) => (b.evSpecs?.chargingSpeedKw ?? 0) - (a.evSpecs?.chargingSpeedKw ?? 0))[0];

    return {
      totalEVs,
      ultraFast800vCount,
      sub3sHypercars,
      maxRange: maxRangeVehicle ? { name: `${maxRangeVehicle.make} ${maxRangeVehicle.model}`, km: maxRangeVehicle.evSpecs?.rangeKm ?? 0 } : null,
      fastestCharging: fastestChargingVehicle ? { name: `${fastestChargingVehicle.make} ${fastestChargingVehicle.model}`, kw: fastestChargingVehicle.evSpecs?.chargingSpeedKw ?? 0 } : null,
    };
  }, [vehicles]);

  // Top Flagship models for the 120Hz Carousel
  const flagships = useMemo((): { vehicle: Vehicle; spotlight?: EVSpotlightItem }[] => {
    // Curated high-performance EV flagships
    const targetSlugs = [
      "rimac-nevera",
      "xiaomi-su7-ultra",
      "lucid-air-sapphire",
      "porsche-taycan-turbo-gt",
      "porsche-taycan-4s",
      "tesla-roadster",
      "rivian-r1s-quad",
      "porsche-mission-x",
      "zeekr-001-fr",
      "lucid-gravity",
      "mercedes-eqs-sedan",
    ];

    const matched: { vehicle: Vehicle; spotlight?: EVSpotlightItem }[] = [];
    for (const slug of targetSlugs) {
      const v = vehicles.find((x) => x.slug === slug);
      if (v) {
        const spot = spotlightItems.find((s) => s.slug === slug || s.slug.includes(slug) || slug.includes(s.slug));
        matched.push({ vehicle: v, spotlight: spot });
      }
    }

    if (matched.length > 0) return matched;

    // Fallback: top 5 powerful EVs
    return [...vehicles]
      .sort((a, b) => b.specs.powerHp - a.specs.powerHp)
      .slice(0, 5)
      .map((v) => ({ vehicle: v, spotlight: undefined }));
  }, [vehicles, spotlightItems]);

  // Autoplay handler for 120Hz carousel
  const nextSlide = useCallback(() => {
    setCarouselDirection(1);
    setActiveSlide((prev) => (prev + 1) % flagships.length);
  }, [flagships.length]);

  const prevSlide = useCallback(() => {
    setCarouselDirection(-1);
    setActiveSlide((prev) => (prev - 1 + flagships.length) % flagships.length);
  }, [flagships.length]);

  useEffect(() => {
    if (!isCarouselAutoplay || flagships.length === 0) return;
    autoplayTimerRef.current = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isCarouselAutoplay, nextSlide, flagships.length]);

  // Comparison toggle
  const toggleCompare = (vehicleId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(vehicleId)) {
        return prev.filter((id) => id !== vehicleId);
      }
      if (prev.length >= 4) {
        // limit to 4
        return [...prev.slice(1), vehicleId];
      }
      return [...prev, vehicleId];
    });
  };

  const clearCompare = () => {
    setCompareIds([]);
  };

  // Selected comparison vehicles
  const comparedVehicles = useMemo(() => {
    return compareIds
      .map((id) => vehicles.find((v) => v.id === id))
      .filter((v): v is Vehicle => v !== undefined);
  }, [compareIds, vehicles]);

  // Pre-seed compare if empty when switching to matrix tab
  const matrixVehicles = useMemo(() => {
    if (comparedVehicles.length >= 2) return comparedVehicles;
    // Pre-fill top 4 benchmark EVs for direct matrix view
    return vehicles
      .filter((v) => (v.evSpecs?.rangeKm ?? 0) > 450)
      .sort((a, b) => (b.evSpecs?.chargingSpeedKw ?? 0) - (a.evSpecs?.chargingSpeedKw ?? 0))
      .slice(0, 4);
  }, [comparedVehicles, vehicles]);

  const activeFiltersCount =
    (rangeFilter !== "all" ? 1 : 0) +
    (chargingFilter !== "all" ? 1 : 0) +
    (accelFilter !== "all" ? 1 : 0) +
    (bodyFilter !== "all" ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetFilters = () => {
    setRangeFilter("all");
    setChargingFilter("all");
    setAccelFilter("all");
    setBodyFilter("all");
    setSearchQuery("");
  };

  const currentFlagship = flagships[activeSlide];

  return (
    <div className="w-full text-text-light">
      {/* 120Hz Hardware-accelerated CSS overrides */}
      <style jsx global>{`
        .hw-accel {
          transform: translateZ(0);
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* TOP COMMAND CENTER TELEMETRY BAR */}
      <section className="mb-10 p-5 md:p-6 bg-surface/90 border border-border-custom rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00D2D3] via-[#00B894] to-[#0984E3]" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#00D2D3]/15 text-[#00D2D3] text-[11px] font-extrabold uppercase tracking-widest border border-[#00D2D3]/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00D2D3] animate-ping" />
                120Hz Live Telemetry
              </span>
              <span className="text-text-muted text-xs font-semibold">Real-Time EV Architecture</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
              <span>⚡</span> Electric Propulsion Command Center
            </h2>
            <p className="text-text-muted text-xs md:text-sm mt-1 max-w-2xl">
              High-voltage battery analytics, 800V fast-charging telemetry, and sub-2s hypercar engineering benchmarks.
            </p>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-background/80 border border-border-custom/80 rounded-2xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">BEV Fleet</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-heading font-extrabold text-white tabular-nums">{stats.totalEVs}</span>
                <span className="text-[10px] text-[#00D2D3] font-bold">MODELS</span>
              </div>
            </div>

            <div className="bg-background/80 border border-border-custom/80 rounded-2xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">800V Ultra-Fast</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-heading font-extrabold text-[#00D2D3] tabular-nums">{stats.ultraFast800vCount}</span>
                <span className="text-[10px] text-[#00D2D3] font-bold">250+ kW</span>
              </div>
            </div>

            <div className="bg-background/80 border border-border-custom/80 rounded-2xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Sub-3.0s Hyper</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-heading font-extrabold text-[#E8232A] tabular-nums">{stats.sub3sHypercars}</span>
                <span className="text-[10px] text-[#E8232A] font-bold">CARS</span>
              </div>
            </div>

            <div className="bg-background/80 border border-border-custom/80 rounded-2xl p-3.5 flex flex-col justify-between">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Max Range</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-heading font-extrabold text-[#00B894] tabular-nums">
                  {stats.maxRange?.km ?? 1000}
                </span>
                <span className="text-[10px] text-[#00B894] font-bold">KM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section View Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-border-custom/60 overflow-x-auto hide-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("fleet")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === "fleet"
                ? "bg-[#00D2D3] text-black shadow-lg shadow-[#00D2D3]/25 font-extrabold"
                : "bg-surface hover:bg-surface-hover text-text-muted hover:text-white border border-border-custom"
            }`}
          >
            <span>🚗 Filterable Fleet</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${activeTab === "fleet" ? "bg-black/20 text-black" : "bg-black/40 text-text-muted"}`}>
              {filteredVehicles.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("matrix");
              if (matrixSectionRef.current) {
                matrixSectionRef.current.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === "matrix"
                ? "bg-[#00D2D3] text-black shadow-lg shadow-[#00D2D3]/25 font-extrabold"
                : "bg-surface hover:bg-surface-hover text-text-muted hover:text-white border border-border-custom"
            }`}
          >
            <span>⚡ Range & Charging Matrix</span>
            {compareIds.length > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8232A] text-white font-extrabold animate-pulse">
                {compareIds.length} Picked
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("editorial")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === "editorial"
                ? "bg-[#00D2D3] text-black shadow-lg shadow-[#00D2D3]/25 font-extrabold"
                : "bg-surface hover:bg-surface-hover text-text-muted hover:text-white border border-border-custom"
            }`}
          >
            <span>📰 EV Reviews & Intel</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${activeTab === "editorial" ? "bg-black/20 text-black" : "bg-black/40 text-text-muted"}`}>
              {articles.length}
            </span>
          </button>
        </div>
      </section>

      {/* FEATURED EV FLAGSHIPS HERO CAROUSEL */}
      {flagships.length > 0 && (
        <section
          aria-label="Featured EV Flagships"
          className="mb-14 relative"
          onMouseEnter={() => setIsCarouselAutoplay(false)}
          onMouseLeave={() => setIsCarouselAutoplay(true)}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00D2D3]" />
              <h3 className="font-heading text-lg md:text-xl font-extrabold uppercase tracking-wider text-white">
                Featured EV Flagships
              </h3>
            </div>
            
            {/* Carousel Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous flagship"
                className="w-10 h-10 rounded-xl bg-surface border border-border-custom hover:border-[#00D2D3] hover:text-[#00D2D3] flex items-center justify-center transition-all cursor-pointer text-text-muted"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border-custom text-xs font-bold text-text-muted tabular-nums">
                <span className="text-[#00D2D3]">{activeSlide + 1}</span>
                <span>/</span>
                <span>{flagships.length}</span>
              </div>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next flagship"
                className="w-10 h-10 rounded-xl bg-surface border border-border-custom hover:border-[#00D2D3] hover:text-[#00D2D3] flex items-center justify-center transition-all cursor-pointer text-text-muted"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          {/* Carousel Slide Container */}
          <div className="relative h-[440px] sm:h-[480px] lg:h-[520px] rounded-3xl overflow-hidden border border-border-custom bg-surface shadow-2xl">
            <AnimatePresence initial={false} custom={carouselDirection} mode="wait">
              {currentFlagship && (
                <m.div
                  key={currentFlagship.vehicle.id}
                  custom={carouselDirection}
                  initial={{ opacity: 0, x: carouselDirection > 0 ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: carouselDirection > 0 ? -50 : 50 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="hw-accel absolute inset-0 flex flex-col justify-end"
                >
                  {/* Background Gradient & Vehicle Image */}
                  <div
                    className="absolute inset-0 transition-transform duration-700"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${currentFlagship.vehicle.coverGradient.from}, ${currentFlagship.vehicle.coverGradient.to})`,
                    }}
                  />
                  {currentFlagship.vehicle.coverImage && (
                    <Image
                      src={currentFlagship.vehicle.coverImage}
                      alt={`${currentFlagship.vehicle.make} ${currentFlagship.vehicle.model}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 1280px"
                      className="object-cover opacity-85 object-center"
                    />
                  )}

                  {/* High-tech Vignette & Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Slide Content */}
                  <div className="relative z-10 p-6 sm:p-8 md:p-12 max-w-4xl">
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="px-3 py-1 rounded-md bg-black/80 backdrop-blur-md text-[#00D2D3] border border-[#00D2D3]/40 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                        {currentFlagship.vehicle.evSpecs?.chargingSpeedKw ? `${currentFlagship.vehicle.evSpecs.chargingSpeedKw} kW Architecture` : "800V Architecture"}
                      </span>
                      <span className="px-3 py-1 rounded-md bg-black/70 backdrop-blur-md text-white/90 border border-white/10 text-xs font-bold uppercase tracking-wider">
                        {currentFlagship.vehicle.year} {currentFlagship.vehicle.make}
                      </span>
                      {currentFlagship.vehicle.new2025 && (
                        <span className="px-3 py-1 rounded-md bg-[#E8232A] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-[#E8232A]/30">
                          NEW FLAGSHIP
                        </span>
                      )}
                    </div>

                    {/* Headline */}
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold uppercase tracking-tight text-white mb-2 leading-tight drop-shadow-md">
                      {currentFlagship.vehicle.make} <span className="text-[#00D2D3]">{currentFlagship.vehicle.model}</span>
                    </h2>
                    <p className="text-text-muted text-sm sm:text-base mb-6 max-w-2xl line-clamp-2">
                      {currentFlagship.spotlight?.headline || currentFlagship.vehicle.trim} — {currentFlagship.vehicle.highlights[0] || "Next-generation electric vehicle architecture."}
                    </p>

                    {/* Telemetry Metrics Ribbon */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 bg-black/60 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/15 max-w-2xl">
                      <div>
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">0-100 km/h</span>
                        <span className="text-lg sm:text-xl font-extrabold font-heading text-white tabular-nums">
                          {currentFlagship.vehicle.specs.acceleration060}s
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">WLTP Range</span>
                        <span className="text-lg sm:text-xl font-extrabold font-heading text-[#00B894] tabular-nums">
                          {currentFlagship.vehicle.evSpecs?.rangeKm ?? "—"} km
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Peak DC Fast</span>
                        <span className="text-lg sm:text-xl font-extrabold font-heading text-[#00D2D3] tabular-nums">
                          {currentFlagship.vehicle.evSpecs?.chargingSpeedKw ?? "—"} kW
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Peak Output</span>
                        <span className="text-lg sm:text-xl font-extrabold font-heading text-[#E8232A] tabular-nums">
                          {currentFlagship.vehicle.specs.powerHp} HP
                        </span>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/vehicles/${currentFlagship.vehicle.slug}`}
                        className="px-6 py-3 rounded-xl bg-[#00D2D3] hover:bg-[#00cec9] text-black text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-[#00D2D3]/25 flex items-center gap-2 cursor-pointer"
                      >
                        <span>Full Vehicle Dossier</span>
                        <span aria-hidden="true">→</span>
                      </Link>

                      {currentFlagship.spotlight && (
                        <Link
                          href={`/articles/${currentFlagship.spotlight.slug}`}
                          className="px-6 py-3 rounded-xl bg-surface/90 hover:bg-surface border border-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <span>Read Road Test Review</span>
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleCompare(currentFlagship.vehicle.id)}
                        className={`px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all backdrop-blur-md flex items-center gap-1.5 cursor-pointer ${
                          compareIds.includes(currentFlagship.vehicle.id)
                            ? "bg-[#E8232A] border-[#E8232A] text-white"
                            : "bg-black/50 border-white/20 text-text-muted hover:text-white hover:border-[#00D2D3]"
                        }`}
                      >
                        <span>{compareIds.includes(currentFlagship.vehicle.id) ? "✓ in Comparison" : "+ Add to Compare"}</span>
                      </button>
                    </div>
                  </div>
                </m.div>
              )}
            </AnimatePresence>

            {/* Slide Indicator Dots */}
            <div className="absolute bottom-4 right-6 z-20 hidden md:flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
              {flagships.map((f, i) => (
                <button
                  key={f.vehicle.id}
                  type="button"
                  onClick={() => {
                    setCarouselDirection(i > activeSlide ? 1 : -1);
                    setActiveSlide(i);
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeSlide === i ? "w-7 bg-[#00D2D3]" : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FILTERABLE EV FLEET SECTION */}
      {activeTab === "fleet" && (
        <section aria-label="Filterable EV Fleet" className="mb-16">
          <div className="flex flex-col gap-6 mb-8">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-custom">
              <div>
                <h3 className="font-heading text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
                  <span>🔋</span> Filterable EV Fleet
                </h3>
                <p className="text-text-muted text-xs md:text-sm mt-0.5">
                  Select performance criteria to filter range benchmarks, charging capabilities, and body styles.
                </p>
              </div>

              {/* Live Search & Sort */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative min-w-[240px]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search EV (e.g. Taycan, 800V, AWD)..."
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-surface border border-border-custom text-xs text-text-light placeholder:text-text-muted/60 focus:border-[#00D2D3] focus-visible:ring-2 focus-visible:ring-[#00D2D3]/30 focus-visible:outline-none transition-all"
                  />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2.5 rounded-xl bg-surface border border-border-custom text-xs text-text-light font-bold focus:border-[#00D2D3] focus-visible:outline-none cursor-pointer"
                >
                  <option value="range-desc">Range: Longest First</option>
                  <option value="charging-desc">Charging: Fastest (kW)</option>
                  <option value="accel-asc">0-60: Quickest First</option>
                  <option value="power-desc">Power: Highest HP</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Filter Pills Clusters */}
            <div className="bg-surface/60 border border-border-custom rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
              {/* Range Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted sm:w-28 flex-shrink-0 flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect><line x1="22" y1="11" x2="22" y2="13"></line></svg>
                  Range (WLTP)
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(["all", "400+", "500+", "600+", "700+"] as RangeFilter[]).map((r) => {
                    const active = rangeFilter === r;
                    const label = r === "all" ? "All Ranges" : `${r} km`;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRangeFilter(r)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          active
                            ? "bg-[#00D2D3] text-black border-[#00D2D3] shadow-md shadow-[#00D2D3]/20"
                            : "bg-surface hover:bg-surface-hover text-text-muted hover:text-white border-border-custom"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Charging Speed Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-3 border-t border-border-custom/50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted sm:w-28 flex-shrink-0 flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  Charging Speed
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: "all" as ChargingFilter, label: "All Speeds" },
                    { id: "800v" as ChargingFilter, label: "⚡ 800V Ultra-Fast (250+ kW)" },
                    { id: "400v" as ChargingFilter, label: "400V Standard (< 250 kW)" },
                  ].map((c) => {
                    const active = chargingFilter === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setChargingFilter(c.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          active
                            ? "bg-[#00D2D3] text-black border-[#00D2D3] shadow-md shadow-[#00D2D3]/20"
                            : "bg-surface hover:bg-surface-hover text-text-muted hover:text-white border-border-custom"
                        }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Acceleration Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-3 border-t border-border-custom/50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted sm:w-28 flex-shrink-0 flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  Acceleration
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: "all" as AccelFilter, label: "All Tiers" },
                    { id: "sub-2s" as AccelFilter, label: "🚀 Sub-2s Hypercar" },
                    { id: "sub-3.5s" as AccelFilter, label: "⚡ Sub-3.5s Supercar" },
                    { id: "sub-5s" as AccelFilter, label: "Sub-5s Sport" },
                  ].map((a) => {
                    const active = accelFilter === a.id;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setAccelFilter(a.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          active
                            ? "bg-[#00D2D3] text-black border-[#00D2D3] shadow-md shadow-[#00D2D3]/20"
                            : "bg-surface hover:bg-surface-hover text-text-muted hover:text-white border-border-custom"
                        }`}
                      >
                        {a.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Body Style Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-3 border-t border-border-custom/50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted sm:w-28 flex-shrink-0 flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.1 2 11.5 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                  Body Style
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(["all", "Sedan", "SUV", "Hypercar", "Truck"] as BodyFilter[]).map((b) => {
                    const active = bodyFilter === b;
                    const label = b === "all" ? "All Body Styles" : b;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBodyFilter(b)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          active
                            ? "bg-[#00D2D3] text-black border-[#00D2D3] shadow-md shadow-[#00D2D3]/20"
                            : "bg-surface hover:bg-surface-hover text-text-muted hover:text-white border-border-custom"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Filter Counter & Reset */}
              {activeFiltersCount > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-border-custom/40 text-xs">
                  <span className="text-text-muted font-medium">
                    <span className="text-[#00D2D3] font-bold">{filteredVehicles.length}</span> matching EV models ({activeFiltersCount} active filter{activeFiltersCount > 1 ? "s" : ""})
                  </span>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[#E8232A] hover:underline font-bold cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* EV Fleet Grid */}
          <m.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredVehicles.map((vehicle, idx) => {
                const saved = isSavedInGarage(vehicle.id);
                const isCompared = compareIds.includes(vehicle.id);
                const is800V = (vehicle.evSpecs?.chargingSpeedKw ?? 0) >= 250;

                return (
                  <m.div
                    key={vehicle.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.2) }}
                    className="hw-accel h-full flex flex-col"
                  >
                    <div className="group bg-surface border border-border-custom rounded-2xl overflow-hidden flex flex-col h-full hover:border-[#00D2D3]/70 hover:shadow-2xl hover:shadow-[#00D2D3]/10 transition-all duration-300 relative">
                      {/* Cover Photo */}
                      <div className="relative w-full h-52 sm:h-56 overflow-hidden">
                        <div
                          className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105"
                          style={{
                            backgroundImage: `linear-gradient(135deg, ${vehicle.coverGradient.from}, ${vehicle.coverGradient.to})`,
                          }}
                        />
                        {vehicle.coverImage && (
                          <Image
                            src={vehicle.coverImage}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20 group-hover:from-black/75 transition-colors duration-300 pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 backdrop-blur-md text-[11px] font-extrabold rounded-md uppercase tracking-wider border ${
                            is800V
                              ? "bg-black/80 text-[#00D2D3] border-[#00D2D3]/40"
                              : "bg-black/70 text-white/90 border-white/10"
                          }`}>
                            {is800V ? "⚡ 800V Architecture" : "400V Platform"}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/60 backdrop-blur-md text-white/80 text-[10px] font-bold rounded uppercase">
                            {vehicle.bodyStyle}
                          </span>
                        </div>

                        {/* Garage & Compare Action Buttons */}
                        <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-20">
                          {/* Compare Toggle */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleCompare(vehicle.id);
                            }}
                            title={isCompared ? "Remove from comparison" : "Add to comparison matrix"}
                            aria-label={isCompared ? "Remove from comparison" : "Add to comparison matrix"}
                            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border text-xs font-bold transition-all cursor-pointer ${
                              isCompared
                                ? "bg-[#00D2D3] text-black border-[#00D2D3] shadow-lg shadow-[#00D2D3]/30"
                                : "bg-black/60 text-white/80 border-white/15 hover:text-[#00D2D3] hover:border-[#00D2D3]"
                            }`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 3h5v5"/><path d="m21 3-7 7"/><path d="M8 21H3v-5"/><path d="m3 21 7-7"/></svg>
                          </button>

                          {/* Garage Bookmark */}
                          <button
                            type="button"
                            onClick={(e) => toggleGarage(e, vehicle)}
                            title={saved ? "Remove from garage" : "Save to garage"}
                            aria-label={saved ? "Remove from garage" : "Save to garage"}
                            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${
                              saved
                                ? "bg-[#E8232A] text-white border-[#E8232A] shadow-lg shadow-[#E8232A]/30"
                                : "bg-black/60 text-white/80 border-white/15 hover:text-[#E8232A] hover:border-[#E8232A]"
                            }`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                          </button>
                        </div>

                        {/* Bottom Right Overlay Specs */}
                        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
                          <span className="px-2.5 py-1 bg-black/85 backdrop-blur-md text-[#00D2D3] text-[11px] font-extrabold rounded-md border border-white/15 tabular-nums">
                            {vehicle.specs.acceleration060}s 0-100
                          </span>
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-5 sm:p-6 flex flex-col flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#00D2D3]">
                            {vehicle.make}
                          </span>
                          <span className="text-xs text-text-muted font-bold">
                            {vehicle.year}
                          </span>
                        </div>

                        <h4 className="font-heading text-xl font-bold leading-tight mb-1 text-white group-hover:text-[#00D2D3] transition-colors duration-200">
                          {vehicle.model}
                        </h4>
                        <div className="text-xs text-text-muted mb-4 font-medium line-clamp-1">
                          {vehicle.trim}
                        </div>

                        {/* EV Telemetry Spec Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs bg-background/60 rounded-xl p-3 mb-4 border border-border-custom/60">
                          <div>
                            <span className="text-[10px] text-text-muted block font-bold uppercase">Range (WLTP)</span>
                            <span className="font-extrabold text-[#00B894] tabular-nums">
                              {vehicle.evSpecs?.rangeKm ? `${vehicle.evSpecs.rangeKm} km` : "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-text-muted block font-bold uppercase">Charging Speed</span>
                            <span className="font-extrabold text-[#00D2D3] tabular-nums">
                              {vehicle.evSpecs?.chargingSpeedKw ? `${vehicle.evSpecs.chargingSpeedKw} kW` : "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-text-muted block font-bold uppercase">Power</span>
                            <span className="font-extrabold text-white tabular-nums">
                              {vehicle.specs.powerHp} HP
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-text-muted block font-bold uppercase">10-80% Time</span>
                            <span className="font-extrabold text-white tabular-nums">
                              {vehicle.evSpecs?.chargingTime1080 || "18-25m"}
                            </span>
                          </div>
                        </div>

                        {/* Price & Actions Footer */}
                        <div className="mt-auto pt-3 border-t border-border-custom/50 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-text-muted block uppercase font-bold">Base MSRP</span>
                            <Price
                              eurAmount={vehicle.priceEur}
                              usdAmount={vehicle.priceUsd}
                              className="font-extrabold text-sm text-white"
                            />
                          </div>

                          <Link
                            href={`/vehicles/${vehicle.slug}`}
                            className="px-4 py-2 rounded-xl bg-surface hover:bg-[#00D2D3] text-text-muted hover:text-black border border-border-custom hover:border-[#00D2D3] text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5"
                          >
                            <span>Dossier</span>
                            <span aria-hidden="true">→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </m.div>
                );
              })}
            </AnimatePresence>
          </m.div>

          {/* Empty State */}
          {filteredVehicles.length === 0 && (
            <div className="text-center py-20 bg-surface rounded-3xl border border-border-custom p-8">
              <div className="text-4xl mb-3">🔍</div>
              <h4 className="font-heading text-xl font-bold text-white mb-2">No electric vehicles match your filters</h4>
              <p className="text-xs text-text-muted mb-6 max-w-md mx-auto">
                Try loosening your range, charging architecture, or acceleration thresholds.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bg-[#00D2D3] text-black text-xs font-bold uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>
      )}

      {/* REAL-TIME RANGE & FAST-CHARGING COMPARISON MATRIX */}
      <section
        ref={matrixSectionRef}
        aria-label="Real-time Range & Fast-Charging Comparison Matrix"
        className="mb-16 scroll-mt-24"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-border-custom">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#00D2D3]/15 text-[#00D2D3] text-[10px] font-extrabold uppercase tracking-widest border border-[#00D2D3]/30">
                Direct Telemetry Benchmarking
              </span>
            </div>
            <h3 className="font-heading text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
              <span>⚡</span> Range & Fast-Charging Comparison Matrix
            </h3>
            <p className="text-text-muted text-xs md:text-sm mt-0.5">
              Head-to-head comparison of battery capacities, WLTP range endurance, and 10–80% fast-charging throughput.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {compareIds.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="px-3.5 py-2 rounded-xl bg-surface border border-border-custom text-text-muted hover:text-[#E8232A] text-xs font-bold transition-all cursor-pointer"
              >
                Clear Selection ({compareIds.length})
              </button>
            )}
            <span className="text-xs font-bold text-text-muted">
              Comparing <span className="text-[#00D2D3] font-extrabold">{matrixVehicles.length}</span> EV champions
            </span>
          </div>
        </div>

        {/* Comparison Matrix Table Card */}
        <div className="bg-surface border border-border-custom rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-border-custom bg-black/40 text-text-muted text-[11px] font-bold uppercase tracking-wider">
                  <th className="p-4 sm:p-5 w-1/4">EV Model & Architecture</th>
                  <th className="p-4 sm:p-5">WLTP Range</th>
                  <th className="p-4 sm:p-5">DC Fast-Charge Peak</th>
                  <th className="p-4 sm:p-5">10–80% Duration</th>
                  <th className="p-4 sm:p-5">0-100 km/h</th>
                  <th className="p-4 sm:p-5">Base Price</th>
                  <th className="p-4 sm:p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom/60 text-xs">
                {matrixVehicles.map((v) => {
                  const range = v.evSpecs?.rangeKm ?? 0;
                  const rangePercent = Math.min(Math.round((range / 1000) * 100), 100);
                  const kw = v.evSpecs?.chargingSpeedKw ?? 0;
                  const kwPercent = Math.min(Math.round((kw / 500) * 100), 100);
                  const is800V = kw >= 250;

                  return (
                    <tr key={v.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Model & Thumb */}
                      <td className="p-4 sm:p-5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-border-custom">
                            {v.coverImage ? (
                              <Image
                                src={v.coverImage}
                                alt={v.model}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div
                                className="w-full h-full"
                                style={{
                                  backgroundImage: `linear-gradient(135deg, ${v.coverGradient.from}, ${v.coverGradient.to})`,
                                }}
                              />
                            )}
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold text-[#00D2D3] uppercase tracking-wider block">
                              {v.make}
                            </span>
                            <Link
                              href={`/vehicles/${v.slug}`}
                              className="font-heading font-extrabold text-sm text-white hover:text-[#00D2D3] transition-colors block"
                            >
                              {v.model}
                            </Link>
                            <span className="text-[10px] text-text-muted">
                              {v.bodyStyle} · {v.specs.powerHp} HP
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Range Progress Bar */}
                      <td className="p-4 sm:p-5">
                        <div className="flex flex-col gap-1.5 max-w-[160px]">
                          <div className="flex items-baseline justify-between">
                            <span className="font-extrabold text-sm text-[#00B894] tabular-nums">
                              {range} km
                            </span>
                            <span className="text-[10px] text-text-muted tabular-nums">
                              {v.evSpecs?.rangeMiles ? `${v.evSpecs.rangeMiles} mi` : ""}
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-border-custom">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#00D2D3] to-[#00B894] transition-all duration-700"
                              style={{ width: `${rangePercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Charging Speed Progress Bar */}
                      <td className="p-4 sm:p-5">
                        <div className="flex flex-col gap-1.5 max-w-[160px]">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-sm text-[#00D2D3] tabular-nums">
                              {kw} kW
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                              is800V
                                ? "bg-[#00D2D3]/20 text-[#00D2D3] border-[#00D2D3]/40"
                                : "bg-white/10 text-text-muted border-white/10"
                            }`}>
                              {is800V ? "800V" : "400V"}
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-border-custom">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#0984E3] to-[#00D2D3] transition-all duration-700"
                              style={{ width: `${kwPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* 10-80% Charging Duration */}
                      <td className="p-4 sm:p-5">
                        <div className="flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#00D2D3]"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          <span className="font-extrabold text-white tabular-nums">
                            {v.evSpecs?.chargingTime1080 || "18–22 min"}
                          </span>
                        </div>
                      </td>

                      {/* 0-60 Accel */}
                      <td className="p-4 sm:p-5">
                        <span className="font-extrabold text-sm text-[#E8232A] tabular-nums">
                          {v.specs.acceleration060}s
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-4 sm:p-5">
                        <Price
                          eurAmount={v.priceEur}
                          usdAmount={v.priceUsd}
                          className="font-extrabold text-sm text-white"
                        />
                      </td>

                      {/* Actions */}
                      <td className="p-4 sm:p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => toggleCompare(v.id)}
                            className="p-1.5 rounded-lg bg-surface border border-border-custom text-text-muted hover:text-[#00D2D3] hover:border-[#00D2D3] transition-all"
                            title={compareIds.includes(v.id) ? "Remove" : "Compare"}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                          </button>

                          <Link
                            href={`/vehicles/${v.slug}`}
                            className="px-3 py-1.5 rounded-lg bg-[#00D2D3] hover:bg-[#00cec9] text-black text-xs font-bold uppercase transition-all"
                          >
                            Dossier
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* EDITORIAL REVIEWS & SPOTLIGHT ARCHIVE */}
      {(activeTab === "editorial" || articles.length > 0) && (
        <section aria-label="EV Editorial & Deep-Dives" className="mb-16">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-custom">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#00D2D3] bg-[#00D2D3]/10 px-3 py-1 rounded border border-[#00D2D3]/25 inline-flex items-center gap-1.5 mb-2">
                ⚡ Automotive Journalism
              </span>
              <h3 className="font-heading text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white">
                EV Road Tests & Battery Technology Intel
              </h3>
            </div>
            <Link
              href="/articles"
              className="text-[#00D2D3] hover:underline text-xs font-bold uppercase tracking-widest hidden sm:inline-flex items-center gap-1"
            >
              All Articles →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                slug={article.slug}
                tag={article.category}
                headline={article.title}
                excerpt={article.excerpt}
                author={article.author.name}
                date={article.publishedAt}
                readTime={article.readTime}
                gradientFrom={article.coverGradient.from}
                gradientTo={article.coverGradient.to}
                coverImage={article.coverImage}
              />
            ))}
          </div>
        </section>
      )}

      {/* STICKY COMPARE BAR (when vehicles selected) */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <m.aside
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.25 }}
            className="hw-accel fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl bg-surface/95 border border-[#00D2D3]/50 rounded-2xl p-4 backdrop-blur-xl shadow-2xl shadow-black/80 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#00D2D3] animate-ping" />
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-white block">
                  {compareIds.length} of 4 EVs Selected for Comparison
                </span>
                <span className="text-[11px] text-text-muted">
                  {comparedVehicles.map((v) => v.model).join(" vs ")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("matrix");
                  if (matrixSectionRef.current) {
                    matrixSectionRef.current.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-4 py-2 rounded-xl bg-[#00D2D3] hover:bg-[#00cec9] text-black text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-[#00D2D3]/25 cursor-pointer"
              >
                View Matrix
              </button>

              <button
                type="button"
                onClick={clearCompare}
                className="p-2 rounded-xl bg-background border border-border-custom text-text-muted hover:text-[#E8232A] text-xs transition-all cursor-pointer"
                title="Clear comparison"
              >
                ✕
              </button>
            </div>
          </m.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
