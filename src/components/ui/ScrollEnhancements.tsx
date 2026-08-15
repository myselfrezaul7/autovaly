"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence, useScroll, useSpring } from "framer-motion";

export default function ScrollEnhancements() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <m.div 
        className="fixed top-0 left-0 right-0 h-1 bg-accent transform origin-left z-[100]" 
        style={{ scaleX }} 
      />
      
      <AnimatePresence>
        {showTopBtn && (
          <m.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={goToTop}
            className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 p-3 md:p-4 rounded-full bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent touch-press"
            aria-label="Back to top"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
          </m.button>
        )}
      </AnimatePresence>
    </>
  );
}
