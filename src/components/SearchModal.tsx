"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { searchArticles, searchVehicles } from "@/lib/content";
import { Article, Vehicle } from "@/lib/types";
import SearchResults from "./ui/SearchResults";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [articleResults, setArticleResults] = useState<Article[]>([]);
  const [vehicleResults, setVehicleResults] = useState<Vehicle[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const router = useRouter();
  const searchTimeout = useRef<NodeJS.Timeout>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open and lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setSearchQuery("");
      setArticleResults([]);
      setVehicleResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Debounced search
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

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        onClose();
      }
    },
    [searchQuery, router, onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-2xl flex flex-col items-center pt-[10vh] md:pt-[15vh] px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Site Search Modal"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-text-light hover:text-accent cursor-pointer transition-colors"
            aria-label="Close search dialog"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <m.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-2xl relative"
          >
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center border-b-2 border-border-custom focus-within:border-accent transition-colors pb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-4 text-accent">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <label htmlFor="modal-search-input" className="sr-only">
                  Search vehicles, articles, and specs
                </label>
                <input
                  ref={inputRef}
                  id="modal-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vehicles, articles, specs, classics..."
                  className="flex-1 bg-transparent text-xl md:text-2xl font-heading font-bold outline-none text-text-light placeholder:text-text-muted/50"
                />
                {searchQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 text-text-muted hover:text-text-light mr-2 cursor-pointer"
                    aria-label="Clear search query"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
                {isTyping && (
                  <div className="w-5 h-5 rounded-full border-2 border-border-custom border-t-accent animate-spin ml-2" aria-hidden="true" />
                )}
              </div>
              <p className="mt-4 text-xs text-text-muted">Press Enter to view all results in Universal Hub or Esc to close</p>
            </form>

            {(articleResults.length > 0 || vehicleResults.length > 0) && searchQuery.length > 1 && (
              <SearchResults
                articles={articleResults}
                vehicles={vehicleResults}
                onClose={onClose}
                query={searchQuery}
              />
            )}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
