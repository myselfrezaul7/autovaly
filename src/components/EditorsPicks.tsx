"use client";

import { useRef } from "react";
import { getEditorsPicks, getCategoryTagColor, formatDate } from "@/lib/content";
import ArticleCard from "./ui/ArticleCard";
import ScrollReveal from "./ui/ScrollReveal";

export default function EditorsPicks() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const picks = getEditorsPicks();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -340 : 340, behavior: "smooth" });
    }
  };

  return (
    <section className="py-14 md:py-20 bg-background overflow-hidden" id="editors-picks">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-custom">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-gold block mb-1">
                ★ 2026 Test Fleet Awards
              </span>
              <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider pl-4 border-l-[5px] border-accent text-text-light">
                Editors&apos; Choice & Benchmarks
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-xl border border-border-custom flex items-center justify-center bg-surface hover:border-accent hover:text-accent transition-all touch-press active:scale-95 cursor-pointer text-text-light"
                aria-label="Scroll left"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-xl border border-border-custom flex items-center justify-center bg-surface hover:border-accent hover:text-accent transition-all touch-press active:scale-95 cursor-pointer text-text-light"
                aria-label="Scroll right"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-4 md:px-6 xl:px-[calc((100vw-1280px)/2+24px)] pb-6"
      >
        {picks.map((pick, index) => (
          <div
            key={pick.id}
            className="relative group snap-center flex-shrink-0 min-w-[280px] sm:min-w-[320px] lg:min-w-[340px] w-[280px] sm:w-[320px] lg:w-[340px]"
          >
            <ScrollReveal delay={index * 0.07}>
              {/* Gold Ribbon Badge */}
              <div className="absolute top-4 right-4 z-20 px-2.5 py-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-heading font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 rounded-md shadow-xl pointer-events-none">
                <span>★</span>
                <span>CHOICE</span>
              </div>
              <ArticleCard
                variant="portrait"
                slug={pick.slug}
                tag={pick.category}
                tagColorClass={getCategoryTagColor(pick.category)}
                headline={pick.title}
                author={pick.author.name}
                date={formatDate(pick.publishedAt)}
                gradientFrom={pick.coverGradient.from}
                gradientTo={pick.coverGradient.to}
                coverImage={pick.coverImage}
              />
            </ScrollReveal>
          </div>
        ))}
      </div>
    </section>
  );
}
