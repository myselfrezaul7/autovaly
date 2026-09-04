"use client";

import { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme-context";
import { useCurrency } from "@/lib/currency-context";
import { useGarage } from "@/lib/useGarage";
import dynamic from "next/dynamic";

const SearchModal = dynamic(() => import("./SearchModal"), { ssr: false });

const navLinks = [
  { name: "News", href: "/news" },
  { name: "Reviews", href: "/reviews" },
  { name: "Vehicles", href: "/vehicles" },
  { name: "Compare", href: "/compare" },
  { name: "Classics", href: "/classics" },
  { name: "EVs", href: "/evs" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { theme, toggleTheme, mounted } = useTheme();
  const { currency, toggleCurrency } = useCurrency();
  const { garageCount } = useGarage();
  const pathname = usePathname();
  const lastScrollY = useRef(0);

  // Direction-aware scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 40);

      if (currentScrollY > 140 && currentScrollY > lastScrollY.current + 5) {
        setIsVisible(false); // scrolling down
      } else if (currentScrollY < lastScrollY.current - 5 || currentScrollY <= 80) {
        setIsVisible(true); // scrolling up or near top
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global ⌘K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border-custom shadow-xl"
            : "bg-background border-b border-border-custom"
        }`}
      >
        <div className={`container mx-auto px-4 md:px-6 flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-14" : "h-16"}`}>
          {/* Logo */}
          <Link href="/" className="font-heading font-extrabold text-2xl tracking-wide uppercase flex items-center gap-2 text-text-light">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-accent" aria-hidden="true">
              <path d="M4 20l3-8h18l3 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 20h28v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2" />
              <circle cx="9" cy="26" r="2.5" fill="currentColor" />
              <circle cx="23" cy="26" r="2.5" fill="currentColor" />
              <path d="M7 12l2-4h14l2 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
            <span>
              AUTO<span className="text-accent">VALY</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex gap-7" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-bold uppercase tracking-widest relative py-1 group transition-colors hover:text-accent ${
                  pathname === link.href || pathname.startsWith(link.href + "/") ? "text-accent" : "text-text-light"
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${
                    pathname === link.href || pathname.startsWith(link.href + "/") ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Currency Switcher */}
            <button
              onClick={toggleCurrency}
              aria-label={`Switch currency (current: ${currency})`}
              className="hidden md:flex px-2.5 py-1 items-center text-xs font-bold rounded-lg border border-border-custom hover:bg-surface transition-colors touch-press active:scale-95 cursor-pointer"
            >
              <span className={`${currency === "EUR" ? "text-accent" : "text-text-muted"} transition-colors`}>€</span>
              <span className="mx-1 text-border-custom">|</span>
              <span className={`${currency === "USD" ? "text-accent" : "text-text-muted"} transition-colors`}>$</span>
            </button>

            {/* Quick Search Button with ⌘K Badge */}
            <button
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-xl border border-border-custom hover:border-accent/60 bg-surface/60 hover:text-accent transition-all touch-press active:scale-95 cursor-pointer text-text-light"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span className="hidden sm:inline text-xs text-text-muted">Search</span>
              <kbd className="hidden sm:inline text-[10px] font-bold px-1.5 py-0.2 rounded bg-background border border-border-custom text-text-muted">
                ⌘K
              </kbd>
            </button>

            {/* Garage Icon */}
            <Link
              href="/garage"
              className="relative min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl border border-border-custom hover:border-accent/60 bg-surface/60 hover:text-accent transition-all touch-press active:scale-95 text-text-light"
              aria-label={`My Garage (${garageCount} saved)`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              {garageCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[9px] rounded-full flex items-center justify-center font-extrabold animate-bounce">
                  {garageCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl border border-border-custom hover:border-accent/60 bg-surface/60 hover:text-accent transition-all touch-press active:scale-95 cursor-pointer text-text-light"
            >
              <svg className="hidden dark:block" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <svg className="block dark:hidden" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </button>

            {/* Mobile Hamburger */}
            <button
              aria-label="Open Mobile Menu"
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-1.5 ml-1 touch-press active:scale-95 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="block w-5 h-[2px] rounded-full bg-text-light transition-all" />
              <span className="block w-3.5 h-[2px] rounded-full bg-text-light transition-all" />
              <span className="block w-5 h-[2px] rounded-full bg-text-light transition-all" />
            </button>
          </div>
        </div>
      </header>

      {/* Standalone Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/70 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <m.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-[290px] bg-surface/95 backdrop-blur-2xl z-50 border-l border-border-custom p-6 pb-[calc(2rem+env(safe-area-inset-bottom))] lg:hidden flex flex-col justify-between"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border-custom">
                  <span className="font-heading font-extrabold text-xl text-text-light">
                    AUTO<span className="text-accent">VALY</span>
                  </span>
                  <button
                    aria-label="Close Menu"
                    className="p-1.5 text-text-light hover:text-accent cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="mt-4 flex flex-col">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-3.5 text-sm font-bold uppercase tracking-wider border-b border-border-custom/50 hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}

                  <Link
                    href="/garage"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3.5 text-sm font-bold uppercase tracking-wider border-b border-border-custom/50 hover:text-accent transition-colors flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <span>🏎️</span>
                      <span>My Garage</span>
                    </span>
                    {garageCount > 0 && (
                      <span className="bg-accent text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {garageCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>

              {/* Bottom Quick Controls */}
              <div className="pt-4 border-t border-border-custom flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-text-muted">Currency</span>
                  <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-border-custom">
                    <button
                      onClick={() => {
                        toggleCurrency();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-2.5 py-0.5 text-xs font-bold rounded ${
                        currency === "EUR" ? "bg-accent text-white" : "text-text-muted"
                      }`}
                    >
                      EUR
                    </button>
                    <button
                      onClick={() => {
                        toggleCurrency();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-2.5 py-0.5 text-xs font-bold rounded ${
                        currency === "USD" ? "bg-accent text-white" : "text-text-muted"
                      }`}
                    >
                      USD
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-text-muted">Theme</span>
                  <button
                    onClick={() => {
                      toggleTheme();
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-3 py-1 bg-background border border-border-custom rounded-lg text-xs font-bold text-text-light hover:text-accent"
                  >
                    {mounted ? (theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode") : "Theme"}
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
