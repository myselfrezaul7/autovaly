"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme-context";
import { useCurrency } from "@/lib/currency-context";
import { searchArticles, searchVehicles } from "@/lib/content";
import { Article, Vehicle } from "@/lib/types";
import SearchResults from "./ui/SearchResults";
import { useGarage } from "@/lib/useGarage";

const navLinks = [
  { name: "News", href: "/news" },
  { name: "Reviews", href: "/reviews" },
  { name: "Vehicles", href: "/vehicles" },
  { name: "Compare", href: "/compare" },
  { name: "Industry", href: "/search?q=industry" },
  { name: "EVs", href: "/evs" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [articleResults, setArticleResults] = useState<Article[]>([]);
  const [vehicleResults, setVehicleResults] = useState<Vehicle[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const { theme, toggleTheme } = useTheme();
  const { currency, toggleCurrency } = useCurrency();
  const { garageCount } = useGarage();
  const pathname = usePathname();
  const searchTimeout = useRef<NodeJS.Timeout>(null);

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

  // Real-time search with debounce
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setIsTyping(true);
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      
      searchTimeout.current = setTimeout(() => {
        setArticleResults(searchArticles(searchQuery));
        setVehicleResults(searchVehicles(searchQuery));
        setIsTyping(false);
      }, 150);
    } else {
      setArticleResults([]);
      setVehicleResults([]);
      setIsTyping(false);
    }
  }, [searchQuery]);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
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
            ? "bg-background/92 backdrop-blur-lg backdrop-saturate-150 shadow-lg border-border-custom"
            : "bg-background border-border-custom"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-extrabold text-2xl tracking-wide uppercase flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-accent">
              <path d="M4 20l3-8h18l3 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 20h28v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2"/>
              <circle cx="9" cy="26" r="2.5" fill="currentColor"/>
              <circle cx="23" cy="26" r="2.5" fill="currentColor"/>
              <path d="M7 12l2-4h14l2 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
            </svg>
            AUTO<span className="text-accent">VALY</span>
          </Link>

          <nav className="hidden lg:flex gap-7" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium uppercase tracking-wider relative py-1 group transition-colors hover:text-accent ${
                  pathname === link.href || pathname.startsWith(link.href + '/') ? 'text-accent' : ''
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${
                  pathname === link.href || pathname.startsWith(link.href + '/') ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Currency Toggle */}
            <button 
              onClick={toggleCurrency}
              aria-label="Toggle Currency" 
              className="hidden md:flex px-2 py-1 items-center text-sm font-bold rounded-md hover:bg-accent/10 transition-colors touch-press active:scale-95"
            >
              <span className={`${currency === 'EUR' ? 'text-accent' : 'text-text-muted'} transition-colors`}>€</span>
              <span className="mx-1 text-border-custom">|</span>
              <span className={`${currency === 'USD' ? 'text-accent' : 'text-text-muted'} transition-colors`}>$</span>
            </button>

            {/* Search icon */}
            <button aria-label="Search" onClick={() => setIsSearchOpen(true)} className="p-2 rounded-md hover:bg-accent/10 hover:text-accent transition-colors touch-press active:scale-95">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
            
            {/* Garage icon */}
            <Link href="/garage" className="relative p-2 rounded-md hover:bg-accent/10 hover:text-accent transition-colors touch-press active:scale-95" aria-label="My Garage">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              {garageCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {garageCount}
                </span>
              )}
            </Link>

            {/* Theme toggle */}
            <button onClick={toggleTheme} aria-label="Toggle Theme" className="p-2 rounded-md hover:bg-accent/10 hover:text-accent transition-colors touch-press active:scale-95">
              {theme === "dark" ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              )}
            </button>
            
            {/* Hamburger */}
            <button
              aria-label="Open Mobile Menu"
              className="lg:hidden p-2 flex flex-col gap-1.5 ml-2 touch-press active:scale-95"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="block w-6 h-[2px] rounded-full bg-text-light transition-all" />
              <span className="block w-4 h-[2px] rounded-full bg-text-light transition-all" />
              <span className="block w-6 h-[2px] rounded-full bg-text-light transition-all" />
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
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center pt-[10vh] md:pt-[15vh] px-4"
          >
            <button onClick={() => setIsSearchOpen(false)} className="absolute top-6 right-6 p-2 text-text-light hover:text-accent" aria-label="Close search">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <m.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-full max-w-2xl relative"
            >
              <form onSubmit={handleSearchSubmit}>
                <div className="flex items-center border-b-2 border-border-custom focus-within:border-accent transition-colors pb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-4 text-muted"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vehicles, articles, specs..."
                    className="flex-1 bg-transparent text-xl md:text-3xl font-heading font-bold outline-none text-text-light placeholder:text-muted/50"
                    autoFocus
                  />
                  {isTyping && (
                    <div className="w-5 h-5 rounded-full border-2 border-border-custom border-t-accent animate-spin ml-4"></div>
                  )}
                </div>
                <p className="mt-4 text-sm text-muted">Press Enter to view all results or Esc to close</p>
              </form>
              
              {(articleResults.length > 0 || vehicleResults.length > 0) && searchQuery.length > 1 && (
                <SearchResults 
                  articles={articleResults} 
                  vehicles={vehicleResults} 
                  onClose={() => setIsSearchOpen(false)} 
                  query={searchQuery} 
                />
              )}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-black/60 z-50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            <m.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-[280px] bg-surface z-50 border-l border-border-custom p-8 pb-[calc(2rem+env(safe-area-inset-bottom))] lg:hidden flex flex-col" role="dialog" aria-modal="true" aria-label="Mobile menu">
              <button aria-label="Close Menu" className="absolute top-4 right-4 p-2 text-text-light hover:text-accent" onClick={() => setIsMobileMenuOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <div className="mt-8 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block py-4 text-base font-medium uppercase tracking-wider border-b border-border-custom hover:text-accent transition-colors active:scale-95 origin-left">
                    {link.name}
                  </Link>
                ))}
                
                <Link href="/garage" onClick={() => setIsMobileMenuOpen(false)} 
                  className="block py-4 text-base font-medium uppercase tracking-wider border-b border-border-custom hover:text-accent transition-colors flex items-center gap-3 active:scale-95 origin-left">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  My Garage
                  {garageCount > 0 && <span className="ml-auto bg-accent text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{garageCount}</span>}
                </Link>
                
                <div className="mt-6 flex items-center justify-between py-4 border-b border-border-custom">
                  <span className="text-sm font-medium uppercase tracking-wider">Currency</span>
                  <div className="flex items-center gap-2 bg-background p-1 rounded-md">
                    <button 
                      onClick={() => { toggleCurrency(); setIsMobileMenuOpen(false); }}
                      className={`px-3 py-1 text-sm rounded touch-press active:scale-95 ${currency === 'EUR' ? 'bg-accent text-white' : 'text-text-muted hover:text-text-light'}`}
                      aria-pressed={currency === 'EUR'}
                    >EUR</button>
                    <button 
                      onClick={() => { toggleCurrency(); setIsMobileMenuOpen(false); }}
                      className={`px-3 py-1 text-sm rounded touch-press active:scale-95 ${currency === 'USD' ? 'bg-accent text-white' : 'text-text-muted hover:text-text-light'}`}
                      aria-pressed={currency === 'USD'}
                    >USD</button>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between py-4 border-b border-border-custom">
                  <span className="text-sm font-medium uppercase tracking-wider">Theme</span>
                  <button onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }} className="p-2 bg-background rounded-md text-text-light hover:text-accent touch-press active:scale-95">
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </button>
                </div>
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
