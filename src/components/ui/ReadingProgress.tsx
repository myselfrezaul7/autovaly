"use client";

import { useEffect, useState, RefObject } from "react";
import { m, useScroll, useSpring } from "framer-motion";

interface ReadingProgressProps {
  articleRef: RefObject<HTMLDivElement | null>;
  readTime: string; // e.g. "5 min read"
}

export default function ReadingProgress({ articleRef, readTime }: ReadingProgressProps) {
  const [minutesLeft, setMinutesLeft] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Extract the number from "X min read"
  const totalMinutes = parseInt(readTime.split(" ")[0]) || 5;

  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start start", "end end"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      // Calculate minutes remaining
      const remaining = Math.max(1, Math.ceil(totalMinutes * (1 - latest)));
      setMinutesLeft(remaining);

      // Visibility logic
      if (latest > 0.02 && latest < 0.99) {
        setIsVisible(true);
        setIsFinished(false);
      } else if (latest >= 0.99) {
        setIsVisible(true);
        setIsFinished(true);
      } else {
        setIsVisible(false);
        setIsFinished(false);
      }
    });
  }, [scrollYProgress, totalMinutes]);

  return (
    <>
      <m.div 
        className="fixed top-0 left-0 right-0 h-[3px] bg-accent transform origin-left z-[100]" 
        style={{ scaleX }} 
      />
      
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-24 right-6 z-40 pointer-events-none"
      >
        <div className="bg-surface/80 backdrop-blur-md border border-border-custom shadow-lg rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          {isFinished ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>Finished</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>{minutesLeft} min left</span>
            </>
          )}
        </div>
      </m.div>
    </>
  );
}
