"use client";

import { m } from "framer-motion";
import { featuredComparison } from "@/lib/data/comparisons";
import Link from "next/link";

export default function ComparisonBanner() {
  const c = featuredComparison;
  return (
    <section className="relative w-full py-16 md:py-20 overflow-hidden bg-background border-y border-border-custom">
      <div className="absolute inset-0 opacity-15 pointer-events-none animate-[pattern-drift_20s_linear_infinite]" style={{ backgroundImage: "repeating-linear-gradient(45deg, var(--surface) 0, var(--surface) 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8">
          <div className="w-full lg:w-[48%] flex items-center justify-center gap-4 md:gap-8">
            <m.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col items-center gap-3">
              <div className="w-36 sm:w-44 md:w-52 h-24 sm:h-28 md:h-32 rounded-2xl shadow-[0_0_30px_rgba(232,35,42,0.2)] border border-border-custom overflow-hidden flex items-center justify-center p-3 text-center" style={{ background: `linear-gradient(135deg, ${c.carA.gradient.from}, ${c.carA.gradient.to})` }}>
                <span className="font-heading font-bold text-sm sm:text-base tracking-wider uppercase text-white drop-shadow-md">{c.carA.name}</span>
              </div>
              <span className="font-heading font-bold text-base sm:text-lg tracking-wide uppercase text-text-light">{c.carA.name}</span>
            </m.div>
            
            <div className="font-heading text-4xl sm:text-6xl md:text-7xl font-extrabold text-accent/40 italic drop-shadow-md select-none">
              VS
            </div>

            <m.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col items-center gap-3">
              <div className="w-36 sm:w-44 md:w-52 h-24 sm:h-28 md:h-32 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-border-custom overflow-hidden flex items-center justify-center p-3 text-center" style={{ background: `linear-gradient(135deg, ${c.carB.gradient.from}, ${c.carB.gradient.to})` }}>
                <span className="font-heading font-bold text-sm sm:text-base tracking-wider uppercase text-white drop-shadow-md">{c.carB.name}</span>
              </div>
              <span className="font-heading font-bold text-base sm:text-lg tracking-wide uppercase text-text-light">{c.carB.name}</span>
            </m.div>
          </div>

          <m.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full lg:w-[48%] flex flex-col items-center lg:items-start text-center lg:text-left bg-surface/80 border border-border-custom rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
            <span className="inline-block px-3 py-1 bg-tag-comparison text-white text-[10px] font-bold uppercase tracking-widest rounded-md mb-3">
              Head-to-Head Telemetry
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-4 text-text-light">
              {c.tagline}
            </h2>
            <ul className="flex flex-col gap-2.5 w-full mb-6 text-xs sm:text-sm">
              {c.specs.map((s) => (
                <li key={s.label} className="flex items-center justify-between px-3 py-2 rounded-xl bg-background/60 border border-border-custom/50">
                  <span className="text-text-muted font-medium">{s.label}</span>
                  <span className="font-bold text-text-light">
                    {s.carA} <span className="text-accent font-extrabold mx-1.5">vs</span> {s.carB}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href={`/compare/${c.slug}`}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent hover:bg-accent/90 text-white rounded-xl font-heading font-bold text-xs uppercase tracking-wider shadow-lg shadow-accent/25 transition-all touch-press active:scale-95 cursor-pointer"
            >
              <span>See Full Head-to-Head Comparison</span>
              <span aria-hidden="true">→</span>
            </Link>
          </m.div>
        </div>
      </div>
    </section>
  );
}
