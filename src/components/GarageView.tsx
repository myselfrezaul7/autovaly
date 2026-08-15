"use client";

import { useState } from "react";
import { useGarage } from "@/lib/useGarage";
import Link from "next/link";
import Image from "next/image";
import TiltCard from "./ui/TiltCard";
import Price from "./ui/Price";
import { m, AnimatePresence } from "framer-motion";

export default function GarageView() {
  const { garage, removeFromGarage } = useGarage();
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  const toggleSelect = (slug: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      }
      if (prev.length >= 2) {
        return [prev[1], slug];
      }
      return [...prev, slug];
    });
  };

  const handleShareGarage = () => {
    if (typeof window !== "undefined") {
      const slugs = garage.map((v) => v.slug).join(",");
      const url = `${window.location.origin}/search?q=${encodeURIComponent(garage[0]?.make || "garage")}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (garage.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center flex flex-col items-center">
        <div className="w-24 h-24 rounded-3xl bg-surface border border-border-custom flex items-center justify-center mb-6 text-3xl shadow-xl">
          🏎️
        </div>
        <h2 className="text-3xl font-bold font-heading mb-3 text-text-light">Your Garage is Empty</h2>
        <p className="text-text-muted mb-8 max-w-md text-sm leading-relaxed">
          You haven&apos;t shortlisted any vehicles yet. Tap the bookmark icon on any vehicle to save and compare them here.
        </p>
        <Link
          href="/vehicles"
          className="px-8 py-3.5 bg-accent hover:bg-accent/90 text-white font-heading font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-accent/25 transition-all touch-press active:scale-95"
        >
          Explore Vehicle Catalog →
        </Link>
      </div>
    );
  }

  const compareSlugs = selectedForCompare.length === 2
    ? selectedForCompare
    : garage.slice(0, 2).map((v) => v.slug);

  const compareUrl = `/compare/custom?a=${compareSlugs[0]}&b=${compareSlugs[1]}`;

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      {/* Header & Fleet Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-border-custom">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded border border-accent/20 mb-2 inline-block">
            Shortlist & Dream Fleet
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-text-light">
            My Saved Garage ({garage.length})
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Select any 2 vehicles to launch an instant side-by-side spec battle.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleShareGarage}
            className="px-4 py-2.5 bg-surface border border-border-custom hover:border-accent text-text-light text-xs font-bold uppercase tracking-wider rounded-xl transition-all touch-press active:scale-95 cursor-pointer"
          >
            {copiedLink ? "✓ Link Copied!" : "📤 Share Shortlist"}
          </button>

          {garage.length >= 2 && (
            <Link
              href={compareUrl}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent/90 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-accent/25 transition-all touch-press active:scale-95"
            >
              <span>Compare ({selectedForCompare.length === 2 ? "2 Selected" : "Top 2"})</span>
              <span>⚔️</span>
            </Link>
          )}
        </div>
      </div>

      {/* Grid of Saved Cars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {garage.map((vehicle) => {
            const isSelected = selectedForCompare.includes(vehicle.slug);
            return (
              <m.div
                key={vehicle.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <TiltCard className={`flex flex-col h-full overflow-hidden group transition-all duration-300 ${isSelected ? "ring-2 ring-accent border-accent" : ""}`}>
                  <div className="relative block h-44 w-full overflow-hidden" style={{ background: `linear-gradient(135deg, ${vehicle.coverGradient.from}, ${vehicle.coverGradient.to})` }}>
                    {vehicle.coverImage && (
                      <Image
                        src={vehicle.coverImage}
                        alt={vehicle.model}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    )}
                    
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white">
                        {vehicle.fuelType}
                      </span>
                    </div>

                    {/* Compare Selection Checkbox */}
                    <button
                      type="button"
                      onClick={() => toggleSelect(vehicle.slug)}
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition-all cursor-pointer ${
                        isSelected
                          ? "bg-accent text-white shadow-lg"
                          : "bg-black/70 text-white/80 hover:bg-accent hover:text-white"
                      }`}
                    >
                      {isSelected ? "✓ Selected" : "+ Compare"}
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between relative bg-surface">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromGarage(vehicle.id);
                      }}
                      className="absolute right-4 top-4 w-7 h-7 rounded-full bg-background border border-border-custom flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-all z-10 touch-press cursor-pointer text-xs"
                      aria-label="Remove from garage"
                      title="Remove from garage"
                    >
                      ✕
                    </button>

                    <Link href={`/vehicles/${vehicle.slug}`} className="flex-1 flex flex-col pr-6">
                      <div className="text-[11px] text-accent mb-0.5 font-bold uppercase tracking-wider">
                        {vehicle.make}
                      </div>
                      <h3 className="text-lg font-bold font-heading mb-2 group-hover:text-accent transition-colors truncate text-text-light">
                        {vehicle.model}
                      </h3>
                      <p className="text-xs text-text-muted line-clamp-1 mb-4">{vehicle.trim}</p>

                      <div className="flex justify-between items-center mt-auto pt-3 border-t border-border-custom/50">
                        <div className="text-[10px] uppercase font-bold text-text-muted">Base MSRP</div>
                        <Price eurAmount={vehicle.priceEur} usdAmount={vehicle.priceUsd} className="font-bold text-sm tabular-nums text-text-light" />
                      </div>
                    </Link>
                  </div>
                </TiltCard>
              </m.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
