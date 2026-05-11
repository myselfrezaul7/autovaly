"use client";

import { m } from "framer-motion";

export default function SpecsPromo() {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden" id="specs">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <m.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-surface border border-border-custom rounded-xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden"
        >
          {/* Dot grid texture */}
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#6B7280 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }}
          />

          <div className="relative z-10 flex flex-col items-center">
            <span className="inline-block px-3 py-1 bg-white text-background text-[10px] font-bold uppercase tracking-widest rounded-sm mb-6">
              Database
            </span>
            
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Compare Any Car. Instantly.
            </h2>
            
            <p className="text-muted text-base md:text-lg max-w-2xl mx-auto mb-10">
              Search our massive database of 12,000+ vehicles across 80+ specifications. From battery capacity to headroom, we've got the numbers.
            </p>

            {/* Visual Search Bar */}
            <div className="w-full max-w-2xl bg-background border border-border-custom rounded-md flex flex-col sm:flex-row p-2 focus-within:border-accent transition-colors shadow-2xl shadow-black/40">
              <input 
                type="text" 
                placeholder="Search make, model, year..." 
                className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-text-light placeholder:text-muted"
                disabled
              />
              <button 
                type="button"
                className="bg-accent text-white font-bold uppercase tracking-wide text-sm px-8 py-3 rounded sm:ml-2 hover:bg-accent-dark transition-colors mt-2 sm:mt-0"
              >
                Search
              </button>
            </div>
            
            <div className="flex items-center gap-4 mt-6 text-xs font-semibold text-muted uppercase tracking-widest">
              <span>Popular:</span>
              <div className="flex gap-2">
                <span className="hover:text-accent cursor-pointer transition-colors">Model Y</span>
                <span className="hover:text-accent cursor-pointer transition-colors">Macan EV</span>
                <span className="hover:text-accent cursor-pointer transition-colors">R1T</span>
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
