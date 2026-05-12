"use client";

import { useState } from "react";
import { getArticlesBySegment, getCategoryTagColor, formatDate } from "@/lib/content";
import ArticleCard from "./ui/ArticleCard";
import { m, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { VehicleSegment } from "@/lib/types";

const tabs: ("All" | VehicleSegment)[] = ["All", "Sedans", "SUVs", "Trucks", "Sports Cars", "EVs", "Hybrids", "Luxury", "Budget Picks"];

export default function BySegment() {
  const [activeTab, setActiveTab] = useState<"All" | VehicleSegment>("All");
  const filtered = getArticlesBySegment(activeTab);

  return (
    <section className="py-12 md:py-16 bg-surface border-y border-border-custom" id="by-segment">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-custom">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider pl-4 border-l-4 border-accent">By Segment</h2>
          <a href="/news" className="text-accent text-sm font-bold uppercase tracking-widest hover:brightness-125 transition-all">Browse All <span aria-hidden="true">→</span></a>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-4 mb-6 md:mb-10 hide-scrollbar touch-pan-x" role="tablist">
          {tabs.map((tab) => (
            <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)}
              className={clsx("flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wider border transition-all duration-300", activeTab === tab ? "bg-accent border-accent text-white" : "bg-transparent border-border-custom text-text-light hover:border-accent hover:text-accent")}>{tab}</button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <m.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.slice(0, 4).map((a) => (
              <ArticleCard key={a.id} variant="segment" slug={a.slug} tag={a.category} tagColorClass={getCategoryTagColor(a.category)} headline={a.title} author={a.author.name} date={formatDate(a.publishedAt)} gradientFrom={a.coverGradient.from} gradientTo={a.coverGradient.to} />
            ))}
          </m.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
