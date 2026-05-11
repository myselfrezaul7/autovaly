"use client";

import { useState } from "react";
import ArticleCard from "./ui/ArticleCard";
import { m, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const tabs = [
  "All", "Sedans", "SUVs", "Trucks", "Sports Cars", "EVs", "Hybrids", "Luxury", "Budget Picks"
];

const articles = [
  {
    id: 1,
    tag: "EV",
    tagColor: "bg-tag-ev",
    headline: "The Xiaomi SU7 Ultra Hits 0–100 in 1.98s. We Drove It.",
    author: "James Mercer",
    date: "May 6, 2025",
    gradientFrom: "#e74c3c",
    gradientTo: "#2c3e50"
  },
  {
    id: 2,
    tag: "Review",
    tagColor: "bg-tag-review",
    headline: "Ford Maverick Hybrid: A Year Later, Still the Smartest Buy?",
    author: "Dan Kowalski",
    date: "May 5, 2025",
    gradientFrom: "#2ecc71",
    gradientTo: "#1a5276"
  },
  {
    id: 3,
    tag: "EV",
    tagColor: "bg-tag-ev",
    headline: "Hyundai IONIQ 9 Review: Family SUV of the Future, Today",
    author: "Sarah Lin",
    date: "May 5, 2025",
    gradientFrom: "#3498db",
    gradientTo: "#1a1a2e"
  },
  {
    id: 4,
    tag: "News",
    tagColor: "bg-tag-news",
    headline: "Rivian R2 Pre-Orders Surge Past 100K in Record First Week",
    author: "Mia Okafor",
    date: "May 4, 2025",
    gradientFrom: "#9b59b6",
    gradientTo: "#2c3e50"
  }
];

export default function BySegment() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <section className="py-12 md:py-16 bg-surface border-y border-border-custom" id="by-segment">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-custom">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider pl-4 border-l-4 border-accent">
            By Segment
          </h2>
          <a href="#" className="text-accent text-sm font-bold uppercase tracking-widest hover:brightness-125 transition-all">
            Browse All <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* Scrollable Tabs */}
        <div 
          className="flex gap-2.5 overflow-x-auto pb-4 mb-6 md:mb-10 hide-scrollbar touch-pan-x"
          role="tablist"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wider border transition-all duration-300",
                activeTab === tab
                  ? "bg-accent border-accent text-white"
                  : "bg-transparent border-border-custom text-text-light hover:border-accent hover:text-accent"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid Area with simple AnimatePresence for tab switching feel */}
        <AnimatePresence mode="wait">
          <m.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                variant="segment"
                tag={article.tag}
                tagColorClass={article.tagColor}
                headline={article.headline}
                author={article.author}
                date={article.date}
                gradientFrom={article.gradientFrom}
                gradientTo={article.gradientTo}
              />
            ))}
          </m.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
