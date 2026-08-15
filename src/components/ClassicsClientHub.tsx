"use client";

import { useState, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ClassicSpotlightItem } from "@/lib/types";

type EraFilter = "all" | "50s-60s" | "70s" | "80s-90s";

interface ClassicsClientHubProps {
  initialItems: ClassicSpotlightItem[];
}

export default function ClassicsClientHub({ initialItems }: ClassicsClientHubProps) {
  const [activeEra, setActiveEra] = useState<EraFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const eras: { id: EraFilter; label: string; count: number }[] = useMemo(() => [
    { id: "all", label: "All Classics", count: initialItems.length },
    { id: "50s-60s", label: "1950s–60s Golden Age", count: initialItems.filter(i => i.eraCategory === "50s-60s").length },
    { id: "70s", label: "1970s Motorsport", count: initialItems.filter(i => i.eraCategory === "70s").length },
    { id: "80s-90s", label: "1980s–90s Supercars & JDM", count: initialItems.filter(i => i.eraCategory === "80s-90s").length },
  ], [initialItems]);

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const matchesEra = activeEra === "all" || item.eraCategory === activeEra;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.headline.toLowerCase().includes(q) ||
        item.engine.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q) ||
        item.era.toLowerCase().includes(q);
      return matchesEra && matchesQuery;
    });
  }, [initialItems, activeEra, searchQuery]);

  return (
    <div>
      {/* Controls Bar: Era Filters & Live Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        {/* Era Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {eras.map((era) => {
            const isActive = activeEra === era.id;
            return (
              <button
                key={era.id}
                type="button"
                onClick={() => setActiveEra(era.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 flex items-center gap-2 cursor-pointer border ${
                  isActive
                    ? "bg-[#d4af37] text-black border-[#d4af37] shadow-lg shadow-[#d4af37]/20"
                    : "bg-surface text-text-muted border-border-custom hover:border-[#d4af37]/50 hover:text-text-light"
                }`}
              >
                <span>{era.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${isActive ? "bg-black/20 text-black" : "bg-border-custom text-text-muted"}`}>
                  {era.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search classics (e.g. F40, Hemi, V8, JDM)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-border-custom text-xs text-text-light placeholder:text-text-muted/60 focus:outline-none focus:border-[#d4af37] transition-all"
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-light text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Counter */}
      <p className="text-xs text-text-muted mb-6 uppercase tracking-wider font-bold">
        Showing <span className="text-[#d4af37]">{filteredItems.length}</span> of {initialItems.length} classic cars
      </p>

      {/* Grid of ALL Classics */}
      <m.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((classic, index) => (
            <m.div
              key={classic.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="h-full"
            >
              <Link
                href={`/articles/${classic.slug}`}
                className="group bg-surface border border-border-custom rounded-2xl overflow-hidden flex flex-col h-full touch-press block hover:border-[#d4af37]/60 hover:shadow-2xl hover:shadow-[#d4af37]/10 transition-all duration-300"
              >
                {/* Cover Image & Overlays */}
                <div className="relative w-full h-52 sm:h-60 overflow-hidden">
                  <div
                    className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `linear-gradient(135deg, ${classic.gradient.from}, ${classic.gradient.to})` }}
                  />
                  {classic.coverImage && (
                    <Image
                      src={classic.coverImage}
                      alt={classic.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20 group-hover:from-black/75 transition-colors duration-300" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-black/80 backdrop-blur-md text-[#d4af37] text-xs font-bold rounded-md border border-[#d4af37]/40 uppercase tracking-wide">
                      {classic.year} · {classic.status}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-black/65 backdrop-blur-md text-white/90 text-[10px] font-medium rounded border border-white/10 uppercase tracking-wide">
                      {classic.engine}
                    </span>
                  </div>

                  {/* Bottom Right Specs */}
                  <div className="absolute bottom-3.5 right-3.5 z-10 flex items-center gap-1.5">
                    {classic.acceleration && (
                      <span className="px-2.5 py-1 bg-black/85 backdrop-blur-md text-[#00cec9] text-[11px] font-bold rounded-md border border-white/15">
                        {classic.acceleration}
                      </span>
                    )}
                    <span className="px-2.5 py-1 bg-black/85 backdrop-blur-md text-white text-[11px] font-bold rounded-md border border-white/15">
                      {classic.power}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#d4af37]">{classic.era}</span>
                    {classic.topSpeed && (
                      <span className="text-[11px] font-medium text-text-muted">{classic.topSpeed}</span>
                    )}
                  </div>

                  <h2 className="font-heading text-xl font-bold leading-tight mb-2.5 transition-colors duration-300 group-hover:text-[#d4af37]">
                    {classic.headline}
                  </h2>

                  <p className="text-xs text-text-muted leading-relaxed mb-6 flex-1">
                    {classic.excerpt}
                  </p>

                  <div className="text-xs font-bold text-[#d4af37] uppercase tracking-widest mt-auto pt-3 border-t border-border-custom/50 flex items-center justify-between">
                    <span>Read Heritage Story</span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </div>
                </div>
              </Link>
            </m.div>
          ))}
        </AnimatePresence>
      </m.div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20 bg-surface rounded-2xl border border-border-custom">
          <p className="text-3xl mb-2">🔍</p>
          <h3 className="font-heading font-bold text-lg text-text-light mb-1">No classic cars found</h3>
          <p className="text-xs text-text-muted mb-4">Try adjusting your search keywords or era filter</p>
          <button
            onClick={() => { setActiveEra("all"); setSearchQuery(""); }}
            className="px-5 py-2 rounded-full bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
