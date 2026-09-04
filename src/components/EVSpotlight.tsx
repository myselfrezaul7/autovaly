"use client";

import { m } from "framer-motion";
import { evSpotlightItems } from "@/lib/data/ev-spotlight";
import Link from "next/link";
import Image from "next/image";

export default function EVSpotlight() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-surface border-y border-border-custom" id="evs">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8 md:mb-10 pb-4 border-b border-border-custom">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider pl-4 border-l-[5px] border-accent flex items-center gap-2"><span className="text-accent">⚡</span> EV Spotlight</h2>
          <Link href="/evs" className="text-accent text-sm font-bold uppercase tracking-widest hover:brightness-125 transition-all">More EVs <span aria-hidden="true">→</span></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {evSpotlightItems.map((ev, index) => (
            <m.div key={ev.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="h-full">
              <Link href={`/articles/${ev.slug}`} className="group bg-background border border-border-custom rounded-2xl overflow-hidden flex flex-col h-full touch-press block">
                <div className="relative w-full h-48 md:h-56 lg:h-64 overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105" style={{ backgroundImage: `linear-gradient(135deg, ${ev.gradient.from}, ${ev.gradient.to})` }} />
                  {ev.coverImage && (
                    <Image
                      src={ev.coverImage}
                      alt={ev.headline}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-sm border border-white/10 uppercase tracking-wide">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tag-ev"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect><line x1="22" y1="11" x2="22" y2="13"></line></svg>
                    {ev.range}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-sm border border-white/10 uppercase tracking-wide">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#0984E3]"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    {ev.chargingSpeed}
                  </span>
                </div>
              </div>
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <h3 className="font-heading text-xl font-bold leading-[1.2] mb-3 transition-colors duration-300 group-hover:text-accent">{ev.headline}</h3>
                  <p className="text-sm text-muted leading-relaxed mb-4 flex-1">{ev.excerpt}</p>
                  <div className="text-xs font-bold text-accent uppercase tracking-widest mt-auto opacity-100 md:opacity-0 md:translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">Read Review →</div>
                </div>
              </Link>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
