"use client";

import { tickerHeadlines } from "@/lib/data/ticker";
import Link from "next/link";
import { useRef, useEffect } from "react";

export default function BreakingTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const isTouching = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animationId: number;
    let scrollPos = 0;
    const scroll = () => {
      if (window.innerWidth < 1024 && el.scrollWidth > el.clientWidth && !isTouching.current) {
        scrollPos += 0.5;
        if (scrollPos >= el.scrollWidth - el.clientWidth) scrollPos = 0;
        el.scrollLeft = scrollPos;
      }
      animationId = requestAnimationFrame(scroll);
    };
    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="bg-surface relative py-3 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[5px] before:bg-accent touch-press">
      <div className="container mx-auto px-4 md:px-6 flex items-center gap-4 md:gap-6 overflow-hidden">
        <span className="flex-shrink-0 bg-accent text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-widest">Latest</span>
        <div 
          ref={scrollRef} 
          className="flex items-center whitespace-nowrap overflow-x-auto hide-scrollbar touch-pan-x"
          onTouchStart={() => isTouching.current = true}
          onTouchEnd={() => isTouching.current = false}
        >
          {tickerHeadlines.map((item, index) => (
            <div key={item.id} className="flex items-center">
              <Link href={item.url} className="text-sm font-medium text-text-light px-2 lg:px-4 hover:text-accent transition-colors touch-press">{item.text}</Link>
              {index < tickerHeadlines.length - 1 && <span className="text-muted mx-2">·</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
