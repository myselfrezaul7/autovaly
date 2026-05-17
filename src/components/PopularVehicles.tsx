"use client";

import { getFeaturedVehicles } from "@/lib/content";
import Link from "next/link";
import Price from "./ui/Price";
import ScrollReveal from "./ui/ScrollReveal";
import TiltCard from "./ui/TiltCard";

export default function PopularVehicles() {
  const vehicles = getFeaturedVehicles().slice(0, 4);

  return (
    <section className="py-12 md:py-20 border-b border-border-custom bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-3">Popular Vehicles</h2>
              <p className="text-muted max-w-xl">
                The most searched and compared cars this week in our database.
              </p>
            </div>
            <Link href="/vehicles" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent hover:text-accent-dark transition-colors">
              View All Database
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle, idx) => (
            <ScrollReveal key={vehicle.id} delay={idx * 0.1}>
              <Link href={`/vehicles/${vehicle.slug}`} className="block h-full group touch-press">
                <TiltCard className="flex flex-col h-full overflow-hidden">
                  <div 
                    className="h-44 md:h-40 w-full relative"
                    style={{ background: `linear-gradient(135deg, ${vehicle.coverGradient.from}, ${vehicle.coverGradient.to})` }}
                  >
                    {vehicle.coverImage && (
                      <img src={vehicle.coverImage} alt={vehicle.model} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    )}
                    <div className="absolute top-3 left-3 flex gap-1">
                      <span className="bg-background/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold uppercase">{vehicle.fuelType}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="text-[10px] text-muted mb-1 font-bold uppercase tracking-wider">{vehicle.make}</div>
                    <h3 className="text-lg font-bold font-heading mb-2 group-hover:text-accent transition-colors truncate">{vehicle.model}</h3>
                    
                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-border-custom/50">
                      <div className="text-[11px] text-text-secondary">Starting at</div>
                      <Price eurAmount={vehicle.priceEur} usdAmount={vehicle.priceUsd} className="font-bold text-sm tabular-nums" />
                    </div>
                  </div>
                </TiltCard>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
