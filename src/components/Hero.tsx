"use client";

import { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { getHeroArticles, getCategoryTagColor, formatDate } from "@/lib/content";

export default function Hero() {
  const articles = getHeroArticles(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentArticle = articles[currentIndex] || articles[0];
  const tagColor = getCategoryTagColor(currentArticle.category);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, articles.length]);

  return (
    <section
      className="relative w-full overflow-hidden border-b border-border-custom bg-surface"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex flex-col lg:flex-row w-full min-h-[540px] lg:min-h-[620px]">
        {/* Left Column: Visual Vehicle Showcase with Telemetry */}
        <div className="relative flex-shrink-0 lg:w-[60%] min-h-[320px] sm:min-h-[380px] lg:min-h-[620px] overflow-hidden bg-gradient-to-br from-[#111318] via-[#1a1e27] to-[#111318]">
          <AnimatePresence mode="wait">
            <m.div
              key={currentArticle.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {currentArticle.coverImage ? (
                <Image
                  src={currentArticle.coverImage}
                  alt={currentArticle.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover opacity-85"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-surface/90" />
              )}
              {/* Subtle Vignette Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface hidden lg:block" />
            </m.div>
          </AnimatePresence>

          {/* Telemetry Overlay Badges */}
          <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 flex flex-wrap gap-2 z-20">
            <span className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-full text-xs font-bold text-[#00B894] border border-white/15 shadow-lg flex items-center gap-1.5">
              <span>⚡</span>
              <span>TEST VERIFIED</span>
            </span>
            <span className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/15 shadow-lg">
              {currentArticle.readTime}
            </span>
            <span className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-full text-xs font-bold text-accent border border-accent/40 shadow-lg">
              TOP STORY #{currentIndex + 1}
            </span>
          </div>

          {/* Watermark Brand Label */}
          <div className="absolute top-6 left-6 font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-[0.1em] text-white/10 pointer-events-none uppercase select-none">
            AUTOVALY
          </div>
        </div>

        {/* Right Column: Editorial Details & Action Group */}
        <div className="flex-shrink-0 lg:w-[40%] bg-surface border-t lg:border-t-0 lg:border-l border-border-custom flex flex-col justify-between p-6 sm:p-8 lg:p-12 relative z-10">
          <div>
            {/* Category Tag & Counter */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className={`inline-block px-3 py-1 text-white text-[10px] font-bold uppercase tracking-widest rounded-md ${tagColor}`}>
                {currentArticle.category} Deep Dive
              </span>

              {/* Mini Slide Dots */}
              <div className="flex items-center gap-1.5">
                {articles.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentIndex ? "w-6 bg-accent" : "w-1.5 bg-border-custom hover:bg-text-muted"
                    }`}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <m.div
                key={currentArticle.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-extrabold leading-[1.12] text-text-light mb-4 tracking-tight">
                  {currentArticle.title}
                </h1>
                <p className="text-sm sm:text-base text-text-muted leading-relaxed mb-6 line-clamp-3">
                  {currentArticle.excerpt}
                </p>

                {/* Author byline */}
                <div className="flex items-center gap-3 text-xs text-text-muted mb-8 flex-wrap pb-4 border-b border-border-custom/50">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-red-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ring-2 ring-border-custom">
                    {currentArticle.author.name.charAt(0)}
                  </div>
                  <span className="font-bold text-text-light">{currentArticle.author.name}</span>
                  <span className="text-text-muted/60 font-bold">·</span>
                  <span>{formatDate(currentArticle.publishedAt)}</span>
                </div>
              </m.div>
            </AnimatePresence>
          </div>

          {/* Action CTAs */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Link
                href={`/articles/${currentArticle.slug}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent hover:bg-accent/90 text-white rounded-xl font-heading font-bold text-xs uppercase tracking-wider shadow-lg shadow-accent/25 transition-all touch-press active:scale-95"
              >
                <span>Read Full Story</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/vehicles"
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-surface border border-border-custom hover:border-accent text-text-light rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all touch-press active:scale-95"
              >
                <span>Browse Spec DB</span>
                <span className="text-accent">↗</span>
              </Link>
            </div>

            {/* Carousel Story Tabs */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border-custom/60">
              {articles.slice(1, 4).map((art, idx) => {
                const targetIdx = idx + 1;
                const isSelected = targetIdx === currentIndex;
                return (
                  <button
                    key={art.id}
                    onClick={() => setCurrentIndex(targetIdx)}
                    className={`p-2 rounded-lg text-left transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-accent/10 border-accent/40 text-text-light"
                        : "bg-surface hover:bg-surface-hover border-border-custom text-text-muted"
                    }`}
                  >
                    <span className="text-[9px] font-extrabold uppercase block text-accent mb-0.5">#{targetIdx + 1} NEXT</span>
                    <span className="text-[11px] font-bold line-clamp-1 block text-text-light">{art.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
