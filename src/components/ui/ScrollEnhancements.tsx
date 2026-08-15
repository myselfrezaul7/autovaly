"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function ScrollEnhancements() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const pathname = usePathname();
  const isArticlePage = pathname.startsWith("/articles/");
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <>
      {/* Global Reading / Scroll Progress Bar (suppressed on article pages where ArticleBody handles progress) */}
      {!isArticlePage && (
        <m.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-accent transform origin-left z-[100] pointer-events-none"
          style={{ scaleX }}
        />
      )}

      <AnimatePresence>
        {showTopBtn && (
          <m.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={goToTop}
            className="fixed bottom-[calc(76px+env(safe-area-inset-bottom,0px))] md:bottom-8 right-4 md:right-8 z-40 p-3 md:p-3.5 rounded-full bg-accent text-white shadow-xl shadow-accent/30 hover:bg-accent-dark transition-all touch-press cursor-pointer border border-white/20 active:scale-95"
            aria-label="Back to top"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </m.button>
        )}
      </AnimatePresence>
    </>
  );
}
