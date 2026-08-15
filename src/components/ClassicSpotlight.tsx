"use client";

import { useState, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import { classicSpotlightItems } from "@/lib/data/classic-spotlight";
import Link from "next/link";
import Image from "next/image";

type EraTab = "all" | "50s-60s" | "70s" | "80s-90s";

const tabs: { id: EraTab; label: string; count: number }[] = [
  { id: "all", label: "All Classics", count: 12 },
  { id: "50s-60s", label: "1950s–60s Golden Age", count: 6 },
  { id: "70s", label: "1970s Motorsport", count: 3 },
  { id: "80s-90s", label: "1980s–90s Supercars & JDM", count: 3 },
];

export default function ClassicSpotlight() {
  const [activeTab, setActiveTab] = useState<EraTab>("all");
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredItems = useMemo(() => {
    if (activeTab === "all") {
      return classicSpotlightItems;
    }
    return classicSpotlightItems.filter((item) => item.eraCategory === activeTab);
  }, [activeTab]);

  // When 'all' is selected and not expanded, show top 4 initially
  const displayedItems = useMemo(() => {
    if (activeTab === "all" && !isExpanded) {
      return filteredItems.slice(0, 4);
    }
    return filteredItems;
  }, [filteredItems, activeTab, isExpanded]);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background border-b border-border-custom" id="classics">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-border-custom gap-4">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider pl-4 border-l-[5px] border-[#d4af37] flex items-center gap-2">
              <span className="text-[#d4af37]">🏆</span> Popular Classic Cars
            </h2>
            <p className="text-xs md:text-sm text-text-muted mt-1.5 pl-4">
              Timeless automotive legends, homologation specials, and collector milestones
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/search?q=classic" 
              className="text-[#d4af37] text-xs md:text-sm font-bold uppercase tracking-widest hover:brightness-125 transition-all flex items-center gap-1.5 flex-shrink-0"
            >
              Search Heritage Archive <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Era Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsExpanded(true); // Auto-expand when user filters
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 flex items-center gap-2 cursor-pointer border ${
                  isActive
                    ? "bg-[#d4af37] text-black border-[#d4af37] shadow-md shadow-[#d4af37]/20"
                    : "bg-surface text-text-muted border-border-custom hover:border-[#d4af37]/50 hover:text-text-light"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${isActive ? "bg-black/20 text-black" : "bg-border-custom text-text-muted"}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Car Cards Grid */}
        <m.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedItems.map((classic, index) => (
              <m.div 
                key={classic.id} 
                layout
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: index * 0.05 }} 
                className="h-full"
              >
                <Link 
                  href={`/articles/${classic.slug}`} 
                  className="group bg-surface border border-border-custom rounded-xl overflow-hidden flex flex-col h-full touch-press block hover:border-[#d4af37]/50 hover:shadow-xl hover:shadow-[#d4af37]/5 transition-all duration-300"
                >
                  <div className="relative w-full h-48 sm:h-52 overflow-hidden">
                    <div 
                      className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110" 
                      style={{ backgroundImage: `linear-gradient(135deg, ${classic.gradient.from}, ${classic.gradient.to})` }} 
                    />
                    {classic.coverImage && (
                      <Image
                        src={classic.coverImage}
                        alt={classic.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover opacity-85 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700"
                      />
                    )}
                    
                    {/* Atmospheric Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 group-hover:from-black/75 transition-colors duration-300" />
                    
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black/75 backdrop-blur-md text-[#d4af37] text-[11px] font-bold rounded border border-[#d4af37]/40 uppercase tracking-wide">
                        {classic.year} · {classic.status}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-black/65 backdrop-blur-md text-white/90 text-[10px] font-medium rounded border border-white/10 uppercase tracking-wide">
                        {classic.engine}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
                      {classic.acceleration && (
                        <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md text-[#00cec9] text-[10px] font-bold rounded-sm border border-white/10">
                          {classic.acceleration}
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold rounded-sm border border-white/10">
                        {classic.power}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">{classic.era}</span>
                      {classic.topSpeed && (
                        <span className="text-[10px] font-medium text-text-muted">{classic.topSpeed}</span>
                      )}
                    </div>
                    <h3 className="font-heading text-lg font-bold leading-[1.25] mb-2.5 transition-colors duration-300 group-hover:text-[#d4af37]">
                      {classic.headline}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed mb-4 flex-1">
                      {classic.excerpt}
                    </p>
                    <div className="text-xs font-bold text-[#d4af37] uppercase tracking-widest mt-auto pt-2 border-t border-border-custom/50 flex items-center justify-between">
                      <span>Heritage Story</span>
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </Link>
              </m.div>
            ))}
          </AnimatePresence>
        </m.div>

        {/* Expand / Collapse Button for 'all' tab */}
        {activeTab === "all" && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-surface border-2 border-[#d4af37]/40 hover:border-[#d4af37] text-text-light hover:text-[#d4af37] rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[#d4af37]/10"
            >
              {isExpanded ? "Show Top 4 Classics ↑" : "View All 12 Classic Legends (F40, Gullwing, GT40, Miura, McLaren F1 & More) ↓"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
