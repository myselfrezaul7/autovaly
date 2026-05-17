"use client";

import { m } from "framer-motion";
import { featuredComparison } from "@/lib/data/comparisons";
import Link from "next/link";

export default function ComparisonBanner() {
  const c = featuredComparison;
  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-background">
      <div className="absolute inset-0 opacity-20 pointer-events-none animate-[pattern-drift_20s_linear_infinite]" style={{ backgroundImage: "repeating-linear-gradient(45deg, var(--surface) 0, var(--surface) 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          <div className="w-full lg:w-[45%] flex items-center justify-center gap-4 md:gap-8">
            <m.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col items-center gap-4">
              <div className="w-36 md:w-48 h-24 md:h-28 rounded-lg shadow-[0_0_30px_rgba(37,99,235,0.2)]" style={{ background: `linear-gradient(135deg, ${c.carA.gradient.from}, ${c.carA.gradient.to})` }} />
              <span className="font-heading font-bold text-xl tracking-wide uppercase">{c.carA.name}</span>
            </m.div>
            <div className="font-heading text-5xl md:text-7xl font-extrabold text-text-light/20 italic drop-shadow-md">VS</div>
            <m.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col items-center gap-4">
              <div className="w-36 md:w-48 h-24 md:h-28 rounded-lg shadow-[0_0_30px_rgba(156,163,175,0.2)]" style={{ background: `linear-gradient(135deg, ${c.carB.gradient.from}, ${c.carB.gradient.to})` }} />
              <span className="font-heading font-bold text-xl tracking-wide uppercase">{c.carB.name}</span>
            </m.div>
          </div>
          <m.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left">
            <span className="inline-block px-3 py-1 bg-tag-comparison text-white text-[10px] font-bold uppercase tracking-widest rounded-sm mb-4">Featured Matchup</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight mb-6">{c.tagline}</h2>
            <ul className="flex flex-col gap-3 w-full max-w-md mb-8">
              {c.specs.map((s) => (
                <li key={s.label} className="flex items-center justify-between px-2 py-2 border-b border-border-custom even:bg-surface/30">
                  <span className="text-muted text-sm font-medium">{s.label}</span>
                  <span className="font-bold">{s.carA} <span className="text-accent mx-2">vs</span> {s.carB}</span>
                </li>
              ))}
            </ul>
            <Link href={`/compare/${c.slug}`} className="inline-flex items-center gap-2 px-7 py-3 bg-text-light text-background rounded-md font-bold text-sm uppercase tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:bg-accent hover:text-white touch-press">See Full Comparison <span aria-hidden="true">→</span></Link>
          </m.div>
        </div>
      </div>
    </section>
  );
}
