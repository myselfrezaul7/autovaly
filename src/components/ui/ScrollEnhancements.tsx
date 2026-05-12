"use client";

import { useState, useEffect } from "react";
import { m, useScroll, useSpring } from "framer-motion";

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
      
      {showTopBtn && (
        <button
          onClick={goToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent-dark transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
          aria-label="Back to top"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
        </button>
      )}
    </>
  );
}
