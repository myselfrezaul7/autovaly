"use client";

import { m } from "framer-motion";

const evs = [
  {
    id: 1,
    range: "487 km",
    charging: "10-80% in 18m",
    headline: "Hyundai IONIQ 5 N: The First EV That Feels Analog",
    excerpt: "Simulated gearshifts and engine noise sound gimmicky, but Hyundai's execution is so good it might convert the die-hards.",
    gradientFrom: "#0abde3",
    gradientTo: "#222f3e"
  },
  {
    id: 2,
    range: "614 km",
    charging: "10-80% in 28m",
    headline: "Polestar 4 Review: Who Needs a Rear Window Anyway?",
    excerpt: "A radical design choice yields impressive aero and a lounge-like back seat, but is it practical for daily driving?",
    gradientFrom: "#feca57",
    gradientTo: "#222f3e"
  },
  {
    id: 3,
    range: "700 km",
    charging: "10-80% in 31m",
    headline: "Volkswagen ID.7 Pro S Finally Hits The Range Sweet Spot",
    excerpt: "With a massive 86kWh battery, VW's flagship electric sedan is targeting the road-trip crowd. We took it 1,000km to find out.",
    gradientFrom: "#10ac84",
    gradientTo: "#222f3e"
  }
];

export default function EVSpotlight() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-surface border-y border-border-custom" id="evs">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8 md:mb-10 pb-4 border-b border-border-custom">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider pl-4 border-l-4 border-accent flex items-center gap-2">
            <span className="text-accent">⚡</span> EV Spotlight
          </h2>
          <a href="#" className="text-accent text-sm font-bold uppercase tracking-widest hover:brightness-125 transition-all">
            More EVs <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {evs.map((ev, index) => (
            <m.article
              key={ev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-background border border-border-custom rounded-md overflow-hidden flex flex-col"
            >
              {/* Image Area */}
              <div className="relative w-full h-48 md:h-56 overflow-hidden">
                <div 
                  className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `linear-gradient(135deg, ${ev.gradientFrom}, ${ev.gradientTo})` }}
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-sm border border-white/10 uppercase tracking-wide">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00B894]"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    {ev.range}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-sm border border-white/10 uppercase tracking-wide">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0984E3]"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    {ev.charging}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 md:p-6 flex flex-col flex-1">
                <h3 className="font-heading text-xl font-bold leading-[1.2] mb-3 transition-colors duration-300 group-hover:text-accent">
                  {ev.headline}
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-4 flex-1">
                  {ev.excerpt}
                </p>
                <div className="text-xs font-bold text-accent uppercase tracking-widest mt-auto opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  Read Review →
                </div>
              </div>
            </m.article>
          ))}
        </div>
      </div>
    </section>
  );
}
