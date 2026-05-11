"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "News", href: "#news" },
  { name: "Reviews", href: "#reviews" },
  { name: "EVs", href: "#evs" },
  { name: "Comparisons", href: "#comparisons" },
  { name: "Industry", href: "#industry" },
  { name: "Videos", href: "#videos" },
  { name: "Specs DB", href: "#specs" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    // Throttle scroll event slightly using requestAnimationFrame
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });
    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 border-b border-transparent ${
          isScrolled
            ? "bg-background/85 backdrop-blur-md shadow-lg border-border-custom"
            : "bg-background border-border-custom"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <a href="/" className="font-heading font-extrabold text-2xl tracking-wide uppercase">
            AUTO<span className="text-accent">VALY</span>
          </a>

          <nav className="hidden lg:flex gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium uppercase tracking-wider relative py-1 group transition-colors hover:text-accent"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <button aria-label="Search" className="p-2 rounded-md hover:bg-accent/10 hover:text-accent transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            <button aria-label="Toggle Theme" className="p-2 rounded-md hover:bg-accent/10 hover:text-accent transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </button>
            <button
              aria-label="Open Mobile Menu"
              className="lg:hidden p-2 flex flex-col gap-1.5"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="block w-6 h-0.5 bg-text-light transition-all"></span>
              <span className="block w-6 h-0.5 bg-text-light transition-all"></span>
              <span className="block w-6 h-0.5 bg-text-light transition-all"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <m.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[280px] bg-surface z-50 border-l border-border-custom p-8 lg:hidden flex flex-col"
            >
              <button
                aria-label="Close Menu"
                className="absolute top-4 right-4 p-2 text-text-light hover:text-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              
              <div className="mt-8 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-4 text-base font-medium uppercase tracking-wider border-b border-border-custom hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
