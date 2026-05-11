"use client";

import { useRef, useEffect, useState } from "react";

const headlines = [
  "Rivian R2 pre-orders exceed 100,000 in first week",
  "Mercedes announces EQS price cuts across all markets",
  "Ferrari reveals first hybrid V12 for 296 GTB successor",
  "EU to ban new ICE car sales deadline confirmed for 2035",
  "Toyota bZ5 spotted undisguised in California"
];

export default function BreakingTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll logic for mobile
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    let animationId: number;
    let scrollPos = 0;
    
    const scroll = () => {
      // Only auto-scroll on mobile views where we have overflow
      if (window.innerWidth < 1024 && el.scrollWidth > el.clientWidth) {
        scrollPos += 0.5;
        if (scrollPos >= el.scrollWidth - el.clientWidth) {
          scrollPos = 0;
        }
        el.scrollLeft = scrollPos;
      }
      animationId = requestAnimationFrame(scroll);
    };
    
    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="bg-surface border-l-4 border-accent py-3">
      <div className="container mx-auto px-4 md:px-6 flex items-center gap-4 md:gap-6 overflow-hidden">
        <span className="flex-shrink-0 bg-accent text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          Latest
        </span>
        
        <div 
          ref={scrollRef}
          className="flex items-center whitespace-nowrap overflow-x-auto hide-scrollbar touch-pan-x"
        >
          {headlines.map((headline, index) => (
            <div key={index} className="flex items-center">
              <a 
                href="#" 
                className="text-sm font-medium text-text-light px-2 lg:px-4 hover:text-accent transition-colors"
              >
                {headline}
              </a>
              {index < headlines.length - 1 && (
                <span className="text-muted mx-1">·</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
