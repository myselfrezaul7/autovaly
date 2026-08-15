"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Article, Vehicle } from "@/lib/types";
import { ClassicSpotlightItem } from "@/lib/types";
import ArticleCard from "@/components/ui/ArticleCard";
import Price from "@/components/ui/Price";
import { getCategoryTagColor, formatDate } from "@/lib/content";

type SearchTab = "all" | "vehicles" | "articles" | "classics" | "evs";

interface SearchClientHubProps {
  initialQuery: string;
  initialTab?: string;
  allArticles: Article[];
  allVehicles: Vehicle[];
  allClassics: ClassicSpotlightItem[];
}

export default function SearchClientHub({
  initialQuery,
  initialTab = "all",
  allArticles,
  allVehicles,
  allClassics,
}: SearchClientHubProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<SearchTab>((initialTab as SearchTab) || "all");

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Real-time matched articles
  const filteredArticles = useMemo(() => {
    if (!query.trim()) return allArticles;
    const q = query.toLowerCase().trim();
    return allArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.segments.some((s) => s.toLowerCase().includes(q)) ||
        a.author.name.toLowerCase().includes(q)
    );
  }, [query, allArticles]);

  // Real-time matched vehicles
  const filteredVehicles = useMemo(() => {
    if (!query.trim()) return allVehicles;
    const q = query.toLowerCase().trim();
    return allVehicles.filter(
      (v) =>
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.trim.toLowerCase().includes(q) ||
        v.bodyStyle.toLowerCase().includes(q) ||
        v.fuelType.toLowerCase().includes(q) ||
        v.segments.some((s) => s.toLowerCase().includes(q)) ||
        v.highlights.some((h) => h.toLowerCase().includes(q))
    );
  }, [query, allVehicles]);

  // Real-time matched classics
  const filteredClassics = useMemo(() => {
    if (!query.trim()) return allClassics;
    const q = query.toLowerCase().trim();
    return allClassics.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.engine.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q) ||
        c.era.toLowerCase().includes(q) ||
        c.excerpt.toLowerCase().includes(q)
    );
  }, [query, allClassics]);

  // Real-time EV specific subset
  const filteredEVs = useMemo(() => {
    const q = query.toLowerCase().trim();
    const evVehicles = allVehicles.filter((v) => v.fuelType === "BEV");
    const evArticles = allArticles.filter((a) => a.category === "EV" || a.segments.includes("EVs"));
    if (!q) return { vehicles: evVehicles, articles: evArticles };
    return {
      vehicles: evVehicles.filter(
        (v) => v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q) || v.trim.toLowerCase().includes(q)
      ),
      articles: evArticles.filter(
        (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
      ),
    };
  }, [query, allVehicles, allArticles]);

  const totalResults =
    filteredArticles.length + filteredVehicles.length + filteredClassics.length;

  const tabs: { id: SearchTab; label: string; count: number }[] = [
    { id: "all", label: "All Results", count: totalResults },
    { id: "vehicles", label: "Specs DB", count: filteredVehicles.length },
    { id: "articles", label: "News & Reviews", count: filteredArticles.length },
    { id: "classics", label: "Classics", count: filteredClassics.length },
    { id: "evs", label: "100% Electric", count: filteredEVs.vehicles.length + filteredEVs.articles.length },
  ];

  return (
    <div>
      {/* Real-time Dynamic Search Bar */}
      <div className="relative mb-8">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all cars, news, specs, classics, electric models..."
            className="w-full bg-surface border-2 border-border-custom focus:border-accent text-text-light placeholder:text-text-muted/60 rounded-2xl pl-12 pr-12 py-4 text-base sm:text-lg font-medium outline-none transition-all shadow-xl shadow-black/5"
            autoFocus
          />
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="absolute left-4 text-accent pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 p-1 rounded-full text-text-muted hover:text-text-light bg-border-custom/50 hover:bg-border-custom text-xs font-bold transition-all"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-xs text-text-muted hide-scrollbar">
          <span className="font-bold uppercase tracking-wider text-[10px] text-text-muted/70 flex-shrink-0">Popular:</span>
          {["Tesla", "Porsche", "Ferrari", "BMW", "Classic", "BYD", "V8", "Solid-State", "GT500"].map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-3 py-1 rounded-full bg-surface border border-border-custom hover:border-accent/50 hover:text-accent transition-colors flex-shrink-0"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-border-custom hide-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 flex items-center gap-2 cursor-pointer border ${
                isActive
                  ? "bg-accent text-white border-accent shadow-lg shadow-accent/25"
                  : "bg-surface text-text-muted border-border-custom hover:border-accent/40 hover:text-text-light"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${isActive ? "bg-white/20 text-white" : "bg-border-custom text-text-muted"}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 text-xs text-text-muted">
        <p>
          {query ? (
            <>
              Found <strong className="text-text-light">{totalResults} matches</strong> for &quot;
              <span className="text-accent font-bold">{query}</span>&quot;
            </>
          ) : (
            <>Showing all database assets ({totalResults} entries)</>
          )}
        </p>
      </div>

      {/* Zero Results State */}
      {totalResults === 0 && (
        <div className="p-12 border border-border-custom rounded-3xl text-center bg-surface flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-2xl mb-4">
            🔍
          </div>
          <h3 className="text-xl font-bold font-heading mb-2 text-text-light">No direct matches found</h3>
          <p className="text-sm text-text-muted max-w-md mb-6">
            We couldn&apos;t find anything matching &quot;{query}&quot;. Try checking for spelling or searching for a broader term like &quot;Porsche&quot;, &quot;Electric&quot;, or &quot;V8&quot;.
          </p>
          <button
            onClick={() => setQuery("")}
            className="px-6 py-2.5 rounded-xl bg-accent text-white font-heading font-bold uppercase tracking-wider text-xs shadow-lg"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* 1. Vehicles Section */}
      {(activeTab === "all" || activeTab === "vehicles") && filteredVehicles.length > 0 && (
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-border-custom">
            <h2 className="font-heading font-bold text-xl uppercase tracking-wider flex items-center gap-2">
              <span className="text-accent">🚗</span> Vehicle Database ({filteredVehicles.length})
            </h2>
            {activeTab === "all" && filteredVehicles.length > 3 && (
              <button
                onClick={() => setActiveTab("vehicles")}
                className="text-xs font-bold uppercase tracking-widest text-accent hover:underline"
              >
                View all {filteredVehicles.length} vehicles →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(activeTab === "all" ? filteredVehicles.slice(0, 4) : filteredVehicles).map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/vehicles/${vehicle.slug}`}
                className="flex flex-col sm:flex-row gap-5 p-4 rounded-2xl border border-border-custom bg-surface hover:border-accent/60 hover:shadow-xl transition-all group touch-press"
              >
                <div
                  className="relative w-full sm:w-44 h-32 rounded-xl bg-border-custom overflow-hidden flex-shrink-0"
                  style={{ background: `linear-gradient(to right, ${vehicle.coverGradient.from}, ${vehicle.coverGradient.to})` }}
                >
                  {vehicle.coverImage && (
                    <Image
                      src={vehicle.coverImage}
                      alt={vehicle.model}
                      fill
                      sizes="(max-width: 640px) 100vw, 176px"
                      className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                  )}
                  <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white">
                    {vehicle.fuelType}
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-[11px] text-text-muted">
                      <span className="font-bold uppercase tracking-wider text-accent">{vehicle.make}</span>
                      <span>·</span>
                      <span>{vehicle.year} {vehicle.bodyStyle}</span>
                    </div>
                    <h3 className="text-lg font-bold font-heading group-hover:text-accent transition-colors">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-xs text-text-muted line-clamp-1">{vehicle.trim}</p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-custom/50">
                    <div className="text-[10px] text-text-muted uppercase font-bold">Base MSRP</div>
                    <Price eurAmount={vehicle.priceEur} usdAmount={vehicle.priceUsd} className="font-bold text-sm tabular-nums text-text-light" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 2. Articles Section */}
      {(activeTab === "all" || activeTab === "articles") && filteredArticles.length > 0 && (
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-border-custom">
            <h2 className="font-heading font-bold text-xl uppercase tracking-wider flex items-center gap-2">
              <span className="text-accent">📰</span> News & Reviews ({filteredArticles.length})
            </h2>
            {activeTab === "all" && filteredArticles.length > 3 && (
              <button
                onClick={() => setActiveTab("articles")}
                className="text-xs font-bold uppercase tracking-widest text-accent hover:underline"
              >
                View all {filteredArticles.length} articles →
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === "all" ? filteredArticles.slice(0, 6) : filteredArticles).map((article) => (
              <ArticleCard
                key={article.id}
                slug={article.slug}
                tag={article.category}
                tagColorClass={getCategoryTagColor(article.category)}
                headline={article.title}
                excerpt={article.excerpt}
                author={article.author.name}
                date={formatDate(article.publishedAt)}
                readTime={article.readTime}
                gradientFrom={article.coverGradient.from}
                gradientTo={article.coverGradient.to}
                coverImage={article.coverImage}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. Classic Cars Section */}
      {(activeTab === "all" || activeTab === "classics") && filteredClassics.length > 0 && (
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-border-custom">
            <h2 className="font-heading font-bold text-xl uppercase tracking-wider flex items-center gap-2">
              <span className="text-[#d4af37]">🏆</span> Heritage Classics ({filteredClassics.length})
            </h2>
            <Link
              href="/classics"
              className="text-xs font-bold uppercase tracking-widest text-[#d4af37] hover:underline"
            >
              Classics Hub →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === "all" ? filteredClassics.slice(0, 3) : filteredClassics).map((classic) => (
              <Link
                key={classic.id}
                href={`/articles/${classic.slug}`}
                className="group bg-surface border border-border-custom rounded-2xl overflow-hidden flex flex-col h-full hover:border-[#d4af37]/60 transition-all duration-300 touch-press"
              >
                <div className="relative w-full h-44 overflow-hidden">
                  <div
                    className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `linear-gradient(135deg, ${classic.gradient.from}, ${classic.gradient.to})` }}
                  />
                  {classic.coverImage && (
                    <Image
                      src={classic.coverImage}
                      alt={classic.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 bg-black/80 backdrop-blur-md text-[#d4af37] text-[10px] font-bold rounded border border-[#d4af37]/30 uppercase">
                      {classic.year} · {classic.status}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-[10px] font-bold uppercase text-[#d4af37] mb-1">{classic.era}</span>
                  <h3 className="font-heading font-bold text-base mb-2 group-hover:text-[#d4af37] transition-colors line-clamp-1">
                    {classic.name}
                  </h3>
                  <p className="text-xs text-text-muted line-clamp-2 mb-4 flex-1">{classic.excerpt}</p>
                  <div className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider flex items-center justify-between mt-auto pt-2 border-t border-border-custom/50">
                    <span>Read Story</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
