"use client";

import { m } from "framer-motion";

export default function ComparisonBanner() {
  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-background">
      {/* Background with diagonal texture */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, #1C1F26 0, #1C1F26 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px"
        }}
      />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Left: The Cars */}
          <div className="w-full lg:w-[45%] flex items-center justify-center gap-4 md:gap-8">
            <m.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-32 md:w-48 h-20 md:h-28 bg-gradient-to-br from-blue-600 to-blue-900 rounded-md shadow-[0_0_30px_rgba(37,99,235,0.2)]" />
              <span className="font-heading font-bold text-xl tracking-wide uppercase">Tesla Model 3</span>
            </m.div>

            <div className="font-heading text-5xl md:text-7xl font-extrabold text-white/10 italic">
              VS
            </div>

            <m.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-32 md:w-48 h-20 md:h-28 bg-gradient-to-br from-gray-300 to-gray-500 rounded-md shadow-[0_0_30px_rgba(156,163,175,0.2)]" />
              <span className="font-heading font-bold text-xl tracking-wide uppercase">BMW i4</span>
            </m.div>
          </div>

          {/* Right: Highlights & Specs */}
          <m.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <span className="inline-block px-3 py-1 bg-tag-comparison text-white text-[10px] font-bold uppercase tracking-widest rounded-sm mb-4">
              Featured Matchup
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight mb-6">
              The Standard vs The Establishment
            </h2>
            
            <ul className="flex flex-col gap-3 w-full max-w-md mb-8">
              <li className="flex items-center justify-between py-2 border-b border-border-custom">
                <span className="text-muted text-sm font-medium">Range (WLTP)</span>
                <span className="font-bold">629 km <span className="text-accent mx-2">vs</span> 590 km</span>
              </li>
              <li className="flex items-center justify-between py-2 border-b border-border-custom">
                <span className="text-muted text-sm font-medium">0-100 km/h</span>
                <span className="font-bold">4.4s <span className="text-accent mx-2">vs</span> 5.6s</span>
              </li>
              <li className="flex items-center justify-between py-2 border-b border-border-custom">
                <span className="text-muted text-sm font-medium">Base Price</span>
                <span className="font-bold">€50,990 <span className="text-accent mx-2">vs</span> €57,500</span>
              </li>
            </ul>

            <a 
              href="#" 
              className="inline-flex items-center gap-2 px-7 py-3 bg-white text-background rounded-md font-bold text-sm uppercase tracking-wide transition-all duration-300 hover:scale-[1.03] hover:bg-accent hover:text-white"
            >
              See Full Comparison 
              <span aria-hidden="true">→</span>
            </a>
          </m.div>
          
        </div>
      </div>
    </section>
  );
}
