"use client";

import { m, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { searchArticles, searchVehicles } from "@/lib/content";
import { Article, Vehicle } from "@/lib/types";
import SearchResults from "./ui/SearchResults";

export default function SpecsPromo() {
  const [query, setQuery] = useState("");
  const [articleResults, setArticleResults] = useState<Article[]>([]);
  const [vehicleResults, setVehicleResults] = useState<Vehicle[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.trim().length > 1) {
      setIsTyping(true);
      if (searchTimeout.current) clearTimeout(searchTimeout.current);

      searchTimeout.current = setTimeout(() => {
        setArticleResults(searchArticles(query));
        setVehicleResults(searchVehicles(query));
        setIsTyping(false);
      }, 150);
    } else {
      setArticleResults([]);
      setVehicleResults([]);
      setIsTyping(false);
    }
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setArticleResults([]);
        setVehicleResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const clearSearch = () => {
    setQuery("");
    setArticleResults([]);
    setVehicleResults([]);
  };

  return (
    <section className="py-16 md:py-20 bg-background relative overflow-hidden" id="specs">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-surface border border-border-custom rounded-3xl p-6 md:p-10 lg:p-14 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(#6B7280 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="inline-block px-3 py-1 bg-accent/10 border border-accent/25 text-accent text-[10px] font-bold uppercase tracking-widest rounded-md mb-4">
              Intelligence Database
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-text-light">
              Compare Any Car. Instantly.
            </h2>
            <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto mb-8">
              Search verified telemetry, fast-charging curves, 0-100 times, and technical dimensions across our full vehicle database.
            </p>

            <div ref={containerRef} className="w-full max-w-2xl relative">
              <form onSubmit={handleSearch} className="bg-background border-2 border-border-custom focus-within:border-accent rounded-2xl flex flex-col sm:flex-row gap-2 p-2 transition-all shadow-xl relative z-20">
                <label htmlFor="specs-search-input" className="sr-only">
                  Search make, model, electric range, or horsepower
                </label>
                <input
                  id="specs-search-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search make, model, electric range, horsepower..."
                  className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-text-light placeholder:text-text-muted/60 text-sm sm:text-base"
                />
                {isTyping && (
                  <div className="absolute right-[130px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-border-custom border-t-accent animate-spin" aria-hidden="true" />
                )}
                <button
                  type="submit"
                  className="bg-accent hover:bg-accent/90 text-white font-heading font-bold uppercase tracking-wider text-xs px-8 py-3.5 rounded-xl shadow-lg shadow-accent/25 transition-all touch-press active:scale-95 cursor-pointer"
                >
                  Search Specs
                </button>
              </form>

              <AnimatePresence>
                {(articleResults.length > 0 || vehicleResults.length > 0) && query.length > 1 && (
                  <m.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 z-50 text-left"
                  >
                    <SearchResults
                      articles={articleResults}
                      vehicles={vehicleResults}
                      onClose={clearSearch}
                      query={query}
                    />
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs font-semibold text-text-muted uppercase tracking-wider relative z-10">
              <span className="text-text-muted/70">Popular:</span>
              {["Model Y", "Taycan", "BMW M3", "GT500", "Ioniq 5 N"].map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="px-2.5 py-1 rounded-md bg-background/80 border border-border-custom hover:border-accent hover:text-accent transition-colors touch-press text-[11px]"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
