"use client";

import { m } from "framer-motion";
import { classicSpotlightItems } from "@/lib/data/classic-spotlight";
import Link from "next/link";

export default function ClassicSpotlight() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background border-b border-border-custom" id="classics">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8 md:mb-10 pb-4 border-b border-border-custom">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider pl-4 border-l-[5px] border-[#d4af37] flex items-center gap-2">
              <span className="text-[#d4af37]">🏆</span> Popular Classic Cars
            </h2>
            <p className="text-xs md:text-sm text-text-muted mt-1.5 pl-4">Timeless automotive legends, historic powertrains, and collector milestones</p>
          </div>
          <Link 
            href="/search?q=classic" 
            className="text-[#d4af37] text-sm font-bold uppercase tracking-widest hover:brightness-125 transition-all flex items-center gap-1 flex-shrink-0"
          >
            Explore Heritage <span aria-hidden="true">→</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {classicSpotlightItems.map((classic, index) => (
            <m.div 
              key={classic.id} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5, delay: index * 0.08 }} 
              className="h-full"
            >
              <Link 
                href={`/articles`} 
                className="group bg-surface border border-border-custom rounded-xl overflow-hidden flex flex-col h-full touch-press block hover:border-[#d4af37]/40 transition-colors duration-300"
              >
                <div className="relative w-full h-48 sm:h-52 overflow-hidden">
                  <div 
                    className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110" 
                    style={{ backgroundImage: `linear-gradient(135deg, ${classic.gradient.from}, ${classic.gradient.to})` }} 
                  />
                  
                  {/* Subtle noise/texture overlay effect */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-md text-[#d4af37] text-[11px] font-bold rounded border border-[#d4af37]/30 uppercase tracking-wide">
                      {classic.year} · {classic.status}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-medium rounded border border-white/10 uppercase tracking-wide">
                      {classic.engine}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 z-10">
                    <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold rounded-sm border border-white/10">
                      {classic.power}
                    </span>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-1.5">{classic.era}</span>
                  <h3 className="font-heading text-lg font-bold leading-[1.25] mb-2.5 transition-colors duration-300 group-hover:text-[#d4af37]">
                    {classic.headline}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed mb-4 flex-1">
                    {classic.excerpt}
                  </p>
                  <div className="text-xs font-bold text-[#d4af37] uppercase tracking-widest mt-auto pt-2 border-t border-border-custom/50 flex items-center justify-between">
                    <span>Heritage Story</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </Link>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
