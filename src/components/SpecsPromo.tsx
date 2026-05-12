"use client";

import { m, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
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
    <section className="py-16 md:py-24 bg-background relative overflow-hidden" id="specs">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <m.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-surface border border-border-custom rounded-xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "radial-gradient(#6B7280 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative z-10 flex flex-col items-center">
            <span className="inline-block px-3 py-1 bg-white text-background text-[10px] font-bold uppercase tracking-widest rounded-sm mb-6">Database</span>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold leading-tight mb-4">Compare Any Car. Instantly.</h2>
            <p className="text-muted text-base md:text-lg max-w-2xl mx-auto mb-10">Search our massive database of 12,000+ vehicles across 80+ specifications. From battery capacity to headroom, we&apos;ve got the numbers.</p>
            
            <div className="w-full max-w-2xl relative">
              <form onSubmit={handleSearch} className="bg-background border border-border-custom rounded-md flex flex-col sm:flex-row p-2 focus-within:border-accent transition-colors shadow-2xl shadow-black/40 relative z-20">
                <input 
                  type="text" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  placeholder="Search make, model, year..." 
                  className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-text-light placeholder:text-muted" 
                />
                {isTyping && (
                  <div className="absolute right-[110px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-border-custom border-t-accent animate-spin"></div>
                )}
                <button type="submit" className="bg-accent text-white font-bold uppercase tracking-wide text-sm px-8 py-3 rounded sm:ml-2 hover:bg-accent-dark transition-colors mt-2 sm:mt-0">Search</button>
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

            <div className="flex items-center gap-4 mt-6 text-xs font-semibold text-muted uppercase tracking-widest relative z-10">
              <span>Popular:</span>
              <div className="flex gap-2">
                <button onClick={() => { setQuery("Model Y"); }} className="hover:text-accent transition-colors">Model Y</button>
                <button onClick={() => { setQuery("Taycan"); }} className="hover:text-accent transition-colors">Taycan</button>
                <button onClick={() => { setQuery("M3"); }} className="hover:text-accent transition-colors">M3</button>
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
