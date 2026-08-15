"use client";

import { useState } from "react";
import { getArticlesBySegment, getCategoryTagColor, formatDate } from "@/lib/content";
import ArticleCard from "./ui/ArticleCard";
import { m, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";
import { VehicleSegment } from "@/lib/types";

const tabs: ("All" | VehicleSegment)[] = ["All", "Sedans", "SUVs", "Trucks", "Sports Cars", "EVs", "Hybrids", "Luxury", "Budget Picks"];

export default function BySegment() {
  const [activeTab, setActiveTab] = useState<"All" | VehicleSegment>("All");
  const filtered = getArticlesBySegment(activeTab);

  return (
    <section className="py-12 md:py-16 bg-surface border-y border-border-custom" id="by-segment">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-custom">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider pl-4 border-l-[5px] border-accent">By Segment</h2>
          <Link href="/news" className="text-accent text-sm font-bold uppercase tracking-widest hover:brightness-125 transition-all">Browse All <span aria-hidden="true">→</span></Link>
        </div>
        <div className="relative before:absolute before:left-0 before:top-0 before:bottom-4 before:w-6 before:bg-gradient-to-r before:from-surface before:to-transparent before:z-10 before:pointer-events-none after:absolute after:right-0 after:top-0 after:bottom-4 after:w-6 after:bg-gradient-to-l after:from-surface after:to-transparent after:z-10 after:pointer-events-none">
          <div className="flex gap-2.5 overflow-x-auto pb-4 mb-6 md:mb-10 hide-scrollbar touch-pan-x" role="tablist">
            {tabs.map((tab) => (
              <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)}
                className={clsx("relative flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wider transition-colors duration-300 border", activeTab === tab ? "text-white border-transparent" : "bg-transparent border-border-custom text-text-light hover:border-accent hover:text-accent")}>
                {activeTab === tab && (
                  <m.div layoutId="activeTabSegment" className="absolute inset-0 bg-accent rounded-full" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <m.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.slice(0, 4).map((a) => (
              <ArticleCard key={a.id} variant="segment" slug={a.slug} tag={a.category} tagColorClass={getCategoryTagColor(a.category)} headline={a.title} author={a.author.name} date={formatDate(a.publishedAt)} gradientFrom={a.coverGradient.from} gradientTo={a.coverGradient.to} coverImage={a.coverImage} />
            ))}
          </m.div>
        </AnimatePresence>
        {filtered.length === 0 && (
          <p className="text-muted text-center py-12">No articles in this segment yet.</p>
        )}
      </div>
    </section>
  );
}
