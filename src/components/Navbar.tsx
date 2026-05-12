"use client";

import { useState, useEffect, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { name: "News", href: "/news" },
  { name: "Reviews", href: "/reviews" },
  { name: "EVs", href: "/evs" },
  { name: "Comparisons", href: "#comparisons" },
  { name: "Industry", href: "#industry" },
  { name: "Videos", href: "#videos" },
  { name: "Specs DB", href: "#specs" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", scrollListener, { passive: true });
    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  }, [searchQuery]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
          isScrolled
            ? "bg-background/85 backdrop-blur-md shadow-lg border-border-custom"
            : "bg-background border-border-custom"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-extrabold text-2xl tracking-wide uppercase flex items-center gap-2">
            {/* Creative car/speed icon */}
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-accent">
              <path d="M4 20l3-8h18l3 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 20h28v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2"/>
              <circle cx="9" cy="26" r="2.5" fill="currentColor"/>
              <circle cx="23" cy="26" r="2.5" fill="currentColor"/>
              <path d="M7 12l2-4h14l2 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
            </svg>
            AUTO<span className="text-accent">VALY</span>
          </Link>

          <nav className="hidden lg:flex gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium uppercase tracking-wider relative py-1 group transition-colors hover:text-accent"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-3">
            {/* Search icon */}
            <button aria-label="Search" onClick={() => setIsSearchOpen(true)} className="p-2 rounded-md hover:bg-accent/10 hover:text-accent transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
            {/* Theme toggle */}
            <button aria-label="Toggle Theme" className="p-2 rounded-md hover:bg-accent/10 hover:text-accent transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
            {/* Hamburger */}
            <button
              aria-label="Open Mobile Menu"
              className="lg:hidden p-2 flex flex-col gap-1.5"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="block w-6 h-0.5 bg-text-light transition-all" />
              <span className="block w-4 h-0.5 bg-text-light transition-all" />
              <span className="block w-6 h-0.5 bg-text-light transition-all" />
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-start justify-center pt-[20vh]"
          >
            <button onClick={() => setIsSearchOpen(false)} className="absolute top-6 right-6 p-2 text-text-light hover:text-accent" aria-label="Close search">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <m.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSearch}
              className="w-full max-w-2xl px-6"
            >
              <div className="flex items-center border-b-2 border-border-custom focus-within:border-accent transition-colors pb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-4 text-muted"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, reviews, specs..."
                  className="flex-1 bg-transparent text-3xl font-heading font-bold outline-none text-text-light placeholder:text-muted/50"
                  autoFocus
                />
              </div>
              <p className="mt-4 text-sm text-muted">Press Enter to search or Esc to close</p>
            </m.form>
          </m.div>
        )}
      </AnimatePresence>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-black/60 z-50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            <m.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-[280px] bg-surface z-50 border-l border-border-custom p-8 lg:hidden flex flex-col">
              <button aria-label="Close Menu" className="absolute top-4 right-4 p-2 text-text-light hover:text-accent" onClick={() => setIsMobileMenuOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <div className="mt-8 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block py-4 text-base font-medium uppercase tracking-wider border-b border-border-custom hover:text-accent transition-colors">
                    {link.name}
                  </Link>
                ))}
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
