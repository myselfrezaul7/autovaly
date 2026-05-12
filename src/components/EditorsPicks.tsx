"use client";

import { useRef } from "react";
import { getEditorsPicks, getCategoryTagColor, formatDate } from "@/lib/content";
import ArticleCard from "./ui/ArticleCard";

export default function EditorsPicks() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const picks = getEditorsPicks();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 md:py-16 bg-background overflow-hidden" id="editors-picks">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-custom">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider pl-4 border-l-4 border-accent">Editors&apos; Picks</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll("left")} className="w-8 h-8 rounded-full border border-border-custom flex items-center justify-center hover:bg-surface hover:text-accent transition-colors" aria-label="Scroll left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button onClick={() => scroll("right")} className="w-8 h-8 rounded-full border border-border-custom flex items-center justify-center hover:bg-surface hover:text-accent transition-colors" aria-label="Scroll right">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-4 md:px-6 xl:px-[calc((100vw-1280px)/2+24px)] pb-8">
        {picks.map((pick) => (
          <div key={pick.id} className="relative group snap-center flex-shrink-0">
            <div className="absolute top-4 right-4 z-20 w-8 h-8 bg-accent text-white font-heading font-bold text-sm flex items-center justify-center rounded-sm shadow-lg pointer-events-none">EP</div>
            <ArticleCard variant="portrait" slug={pick.slug} tag={pick.category} tagColorClass={getCategoryTagColor(pick.category)} headline={pick.title} author={pick.author.name} date={formatDate(pick.publishedAt)} gradientFrom={pick.coverGradient.from} gradientTo={pick.coverGradient.to} />
          </div>
        ))}
      </div>
    </section>
  );
}
