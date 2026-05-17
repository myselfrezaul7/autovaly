"use client";

import { useGarage } from "@/lib/useGarage";
import Link from "next/link";
import TiltCard from "./ui/TiltCard";
import Price from "./ui/Price";
import { m, AnimatePresence } from "framer-motion";

export default function GarageView() {
  const { garage, removeFromGarage } = useGarage();

  if (garage.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-surface border border-border-custom flex items-center justify-center mb-6 opacity-50">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold font-heading mb-3">Your garage is empty</h2>
        <p className="text-muted mb-8 max-w-md">You haven&apos;t saved any vehicles yet. Browse our catalog and save your dream cars here.</p>
        <Link href="/vehicles" className="px-8 py-3 bg-text-light text-background font-bold uppercase tracking-wide rounded hover:bg-accent hover:text-white transition-colors">
          Browse Vehicles
        </Link>
      </div>
    );
  }

  const compareUrl = garage.length >= 2 
    ? `/compare/custom?vehicles=${garage.slice(0, 4).map(v => v.slug).join(',')}` 
    : '';

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      {garage.length >= 2 && (
        <div className="mb-8 flex justify-end">
          <Link href={compareUrl} className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold text-sm uppercase tracking-wide rounded hover:bg-accent-dark transition-colors shadow-lg shadow-accent/20 touch-press">
            Compare Selected ({Math.min(garage.length, 4)})
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {garage.map((vehicle) => (
            <m.div
              key={vehicle.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <TiltCard className="flex flex-col h-full overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <Link href={`/vehicles/${vehicle.slug}`} className="block h-40 w-full relative touch-press" style={{ background: `linear-gradient(135deg, ${vehicle.coverGradient.from}, ${vehicle.coverGradient.to})` }}>
                  {vehicle.coverImage && (
                    <img src={vehicle.coverImage} alt={vehicle.model} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  )}
                  <div className="absolute top-3 left-3 flex gap-1">
                    <span className="bg-background/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold uppercase">{vehicle.fuelType}</span>
                  </div>
                </Link>
                
                <div className="p-4 flex-1 flex flex-col relative">
                  <button 
                    onClick={(e) => { e.preventDefault(); removeFromGarage(vehicle.id); }}
                    className="absolute right-4 top-4 w-8 h-8 rounded-full bg-surface/50 backdrop-blur border border-transparent flex items-center justify-center text-muted hover:text-accent hover:bg-surface/80 hover:border-border-custom transition-all z-10 touch-press"
                    aria-label="Remove from garage"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                  
                  <Link href={`/vehicles/${vehicle.slug}`} className="flex-1 flex flex-col block pr-8">
                    <div className="text-[10px] text-muted mb-1 font-bold uppercase tracking-wider">{vehicle.make}</div>
                    <h3 className="text-lg font-bold font-heading mb-2 group-hover:text-accent transition-colors truncate">{vehicle.model}</h3>
                    
                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-border-custom/50">
                      <div className="text-xs text-text-muted">Starting at</div>
                      <Price eurAmount={vehicle.priceEur} usdAmount={vehicle.priceUsd} className="font-bold text-sm tabular-nums" />
                    </div>
                  </Link>
                </div>
              </TiltCard>
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
