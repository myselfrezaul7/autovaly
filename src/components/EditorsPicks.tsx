"use client";

import { useRef } from "react";
import ArticleCard from "./ui/ArticleCard";

const picks = [
  {
    id: 1,
    tag: "Opinion",
    tagColor: "bg-gray-700",
    headline: "Stop Putting Screens in the Steering Wheel",
    author: "Dan Kowalski",
    date: "May 1, 2025",
    gradientFrom: "#ff7675",
    gradientTo: "#d63031"
  },
  {
    id: 2,
    tag: "Deep Dive",
    tagColor: "bg-blue-600",
    headline: "Inside Toyota's Solid State Battery Lab",
    author: "Ryo Tanaka",
    date: "Apr 28, 2025",
    gradientFrom: "#74b9ff",
    gradientTo: "#0984e3"
  },
  {
    id: 3,
    tag: "Review",
    tagColor: "bg-tag-review",
    headline: "The 911 S/T is Peak Analog Porsche",
    author: "Sarah Lin",
    date: "Apr 25, 2025",
    gradientFrom: "#a29bfe",
    gradientTo: "#6c5ce7"
  },
  {
    id: 4,
    tag: "Design",
    tagColor: "bg-amber-600",
    headline: "Why Every EV Looks Like a Jellybean Now",
    author: "Mia Okafor",
    date: "Apr 22, 2025",
    gradientFrom: "#ffeaa7",
    gradientTo: "#fdcb6e"
  },
  {
    id: 5,
    tag: "Feature",
    tagColor: "bg-teal-600",
    headline: "The Rise of the Luxury Off-Road Safari Build",
    author: "James Mercer",
    date: "Apr 20, 2025",
    gradientFrom: "#55efc4",
    gradientTo: "#00b894"
  }
];

export default function EditorsPicks() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300; // rough width of one card + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 md:py-16 bg-background overflow-hidden" id="editors-picks">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-custom">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider pl-4 border-l-4 border-accent">
            Editors' Picks
          </h2>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full border border-border-custom flex items-center justify-center hover:bg-surface hover:text-accent transition-colors"
              aria-label="Scroll left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full border border-border-custom flex items-center justify-center hover:bg-surface hover:text-accent transition-colors"
              aria-label="Scroll right"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Rail */}
      <div 
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-4 md:px-6 xl:px-[calc((100vw-1280px)/2+24px)] pb-8"
      >
        {picks.map((pick) => (
          <div key={pick.id} className="relative group snap-center flex-shrink-0">
            {/* EP Badge overlay */}
            <div className="absolute top-4 right-4 z-20 w-8 h-8 bg-accent text-white font-heading font-bold text-sm flex items-center justify-center rounded-sm shadow-lg pointer-events-none">
              EP
            </div>
            <ArticleCard
              variant="portrait"
              tag={pick.tag}
              tagColorClass={pick.tagColor}
              headline={pick.headline}
              author={pick.author}
              date={pick.date}
              gradientFrom={pick.gradientFrom}
              gradientTo={pick.gradientTo}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
