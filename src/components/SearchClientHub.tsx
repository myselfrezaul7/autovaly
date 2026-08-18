"use client";

import { useState, useMemo, useEffect, useDeferredValue } from "react";
import Link from "next/link";
import Image from "next/image";
import { Article, Vehicle } from "@/lib/types";
import { ClassicSpotlightItem } from "@/lib/types";
import ArticleCard from "@/components/ui/ArticleCard";
import Price from "@/components/ui/Price";

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
  const deferredQuery = useDeferredValue(query);
  const [activeTab, setActiveTab] = useState<SearchTab>((initialTab as SearchTab) || "all");

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Real-time matched articles (using deferredQuery)
  const filteredArticles = useMemo(() => {
    if (!deferredQuery.trim()) return allArticles;
    const q = deferredQuery.toLowerCase().trim();
    return allArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.segments.some((s) => s.toLowerCase().includes(q)) ||
        a.author.name.toLowerCase().includes(q)
    );
  }, [deferredQuery, allArticles]);

  // Real-time matched vehicles
  const filteredVehicles = useMemo(() => {
    if (!deferredQuery.trim()) return allVehicles;
    const q = deferredQuery.toLowerCase().trim();
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
  }, [deferredQuery, allVehicles]);

  // Real-time matched classics
  const filteredClassics = useMemo(() => {
    if (!deferredQuery.trim()) return allClassics;
    const q = deferredQuery.toLowerCase().trim();
    return allClassics.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.engine.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q) ||
        c.era.toLowerCase().includes(q) ||
        c.excerpt.toLowerCase().includes(q)
    );
  }, [deferredQuery, allClassics]);

  // Real-time EV specific subset
  const filteredEVs = useMemo(() => {
    const q = deferredQuery.toLowerCase().trim();
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
  }, [deferredQuery, allVehicles, allArticles]);

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
          <label htmlFor="search-hub-input" className="sr-only">
            Search all cars, news, specs, classics, and electric models
          </label>
          <input
            id="search-hub-input"
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
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-4 p-1 rounded-full text-text-muted hover:text-text-light bg-border-custom/50 hover:bg-border-custom text-xs font-bold transition-all cursor-pointer"
              aria-label="Clear search text"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Segment / Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar border-b border-border-custom" role="tablist" aria-label="Search filter categories">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-accent text-white shadow-lg shadow-accent/25"
                  : "bg-surface text-text-muted hover:text-text-light hover:bg-surface/80 border border-border-custom"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                  isActive ? "bg-white/20 text-white" : "bg-border-custom text-text-muted"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Screen Reader Result Announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        Found {totalResults} search results for {deferredQuery}
      </div>

      {/* Results View */}
      <div id={`tabpanel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
        {totalResults === 0 ? (
          <div className="py-20 text-center bg-surface border border-border-custom rounded-3xl p-8">
            <div className="text-4xl mb-4" aria-hidden="true">🔍</div>
            <h3 className="text-xl font-bold font-heading mb-2">No Matching Results</h3>
            <p className="text-text-muted text-sm max-w-md mx-auto mb-6">
              We couldn&apos;t find anything matching &quot;{query}&quot;. Try checking for spelling errors, using more general terms, or browsing our vehicle specs database.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setQuery("Electric")}
                className="px-3 py-1.5 bg-background border border-border-custom rounded-lg text-xs font-bold hover:border-accent transition-colors"
              >
                ⚡ Electric (BEV)
              </button>
              <button
                type="button"
                onClick={() => setQuery("Porsche")}
                className="px-3 py-1.5 bg-background border border-border-custom rounded-lg text-xs font-bold hover:border-accent transition-colors"
              >
                🏎️ Porsche
              </button>
              <button
                type="button"
                onClick={() => setQuery("Tesla")}
                className="px-3 py-1.5 bg-background border border-border-custom rounded-lg text-xs font-bold hover:border-accent transition-colors"
              >
                🔋 Tesla
              </button>
              <button
                type="button"
                onClick={() => setQuery("BMW")}
                className="px-3 py-1.5 bg-background border border-border-custom rounded-lg text-xs font-bold hover:border-accent transition-colors"
              >
                🇩🇪 BMW
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Section 1: Vehicle Database Specs Matches */}
            {(activeTab === "all" || activeTab === "vehicles") && filteredVehicles.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent" aria-hidden="true" />
                    <span>Vehicle Specification Database</span>
                    <span className="text-xs text-text-muted font-normal">({filteredVehicles.length})</span>
                  </h2>
                  {activeTab === "all" && filteredVehicles.length > 4 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("vehicles")}
                      className="text-xs font-bold text-accent hover:underline uppercase tracking-wider"
                    >
                      View All {filteredVehicles.length} Vehicles →
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(activeTab === "all" ? filteredVehicles.slice(0, 4) : filteredVehicles).map((vehicle) => (
                    <Link
                      key={vehicle.id}
                      href={`/vehicles/${vehicle.slug}`}
                      className="group bg-surface border border-border-custom rounded-2xl overflow-hidden hover:border-accent/60 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-accent/5 touch-press"
                      aria-label={`View specs for ${vehicle.make} ${vehicle.model}`}
                    >
                      <div className="p-5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">
                          <span className="text-accent">{vehicle.make}</span>
                          <span className="bg-border-custom/50 px-2 py-0.5 rounded text-[10px] text-text-light font-extrabold">{vehicle.fuelType}</span>
                        </div>
                        <h3 className="font-heading font-extrabold text-lg text-text-light group-hover:text-accent transition-colors leading-tight mb-1">
                          {vehicle.model}
                        </h3>
                        <p className="text-xs text-text-muted mb-4">{vehicle.trim}</p>

                        <div className="grid grid-cols-3 gap-2 py-3 border-y border-border-custom/50 text-center mb-4">
                          <div>
                            <span className="block text-[10px] text-text-muted uppercase tracking-wider">Power</span>
                            <span className="text-xs font-extrabold text-text-light">{vehicle.specs.powerHp} hp</span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-text-muted uppercase tracking-wider">0-100</span>
                            <span className="text-xs font-extrabold text-text-light">{vehicle.specs.acceleration060}s</span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-text-muted uppercase tracking-wider">Top Speed</span>
                            <span className="text-xs font-extrabold text-text-light">{vehicle.specs.topSpeedKmh} km/h</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-muted font-medium">Starting MSRP</span>
                          <span className="font-extrabold text-accent">
                            <Price eurAmount={vehicle.priceEur} usdAmount={vehicle.priceUsd} />
                          </span>
                        </div>
                      </div>
                      <div className="bg-background/40 py-2.5 px-5 text-center border-t border-border-custom/50 group-hover:bg-accent group-hover:text-white transition-colors text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Full Telemetry & Specs →
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: Articles, News & Road Tests */}
            {(activeTab === "all" || activeTab === "articles") && filteredArticles.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent" aria-hidden="true" />
                    <span>Editorial Stories & Road Tests</span>
                    <span className="text-xs text-text-muted font-normal">({filteredArticles.length})</span>
                  </h2>
                  {activeTab === "all" && filteredArticles.length > 6 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("articles")}
                      className="text-xs font-bold text-accent hover:underline uppercase tracking-wider"
                    >
                      View All {filteredArticles.length} Articles →
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(activeTab === "all" ? filteredArticles.slice(0, 6) : filteredArticles).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: Heritage Classics Fleet */}
            {(activeTab === "all" || activeTab === "classics") && filteredClassics.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-bold uppercase tracking-wider flex items-center gap-2 text-[#d4af37]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]" aria-hidden="true" />
                    <span>Heritage Classics Spotlight</span>
                    <span className="text-xs text-text-muted font-normal">({filteredClassics.length})</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredClassics.map((classic) => (
                    <Link
                      key={classic.id}
                      href={`/articles/${classic.slug}`}
                      className="group bg-surface border border-border-custom rounded-2xl overflow-hidden hover:border-[#d4af37]/60 transition-all flex flex-col justify-between shadow-xl"
                    >
                      <div
                        className="h-48 relative overflow-hidden bg-background"
                        style={{ backgroundImage: `linear-gradient(135deg, ${classic.gradient.from}, ${classic.gradient.to})` }}
                      >
                        {classic.coverImage && (
                          <Image
                            src={classic.coverImage}
                            alt={classic.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 bg-[#d4af37] text-black text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg">
                          {classic.era}
                        </span>
                      </div>
                      <div className="p-6">
                        <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider block mb-1">
                          {classic.status}
                        </span>
                        <h3 className="font-heading font-extrabold text-xl text-text-light mb-2 group-hover:text-[#d4af37] transition-colors">
                          {classic.name}
                        </h3>
                        <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-4">
                          {classic.excerpt}
                        </p>
                        <div className="text-xs font-bold text-text-light flex items-center justify-between pt-4 border-t border-border-custom/50">
                          <span className="text-text-muted font-normal">{classic.engine}</span>
                          <span className="text-[#d4af37]">Read Retrospective →</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: 100% Electric View */}
            {activeTab === "evs" && (
              <div className="space-y-12">
                <div>
                  <h3 className="font-heading font-bold text-lg uppercase tracking-wider text-accent mb-6">
                    ⚡ Electric Vehicle Specifications ({filteredEVs.vehicles.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredEVs.vehicles.map((vehicle) => (
                      <Link
                        key={vehicle.id}
                        href={`/vehicles/${vehicle.slug}`}
                        className="group bg-surface border border-border-custom rounded-2xl p-5 hover:border-accent/60 transition-all flex flex-col justify-between shadow-lg"
                      >
                        <div>
                          <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-1">{vehicle.make}</span>
                          <h4 className="font-heading font-extrabold text-base text-text-light mb-1">{vehicle.model}</h4>
                          <p className="text-xs text-text-muted mb-3">{vehicle.trim}</p>
                          <div className="bg-accent/10 border border-accent/20 rounded-xl p-2.5 mb-3 text-xs">
                            <span className="text-text-muted block text-[10px] uppercase">WLTP Range</span>
                            <span className="font-extrabold text-accent text-sm">{vehicle.evSpecs?.rangeKm || "N/A"} km</span>
                          </div>
                        </div>
                        <div className="text-xs font-extrabold text-text-light flex items-center justify-between pt-3 border-t border-border-custom/50">
                          <span>0-100: {vehicle.specs.acceleration060}s</span>
                          <span className="text-accent"><Price eurAmount={vehicle.priceEur} usdAmount={vehicle.priceUsd} /></span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {filteredEVs.articles.length > 0 && (
                  <div>
                    <h3 className="font-heading font-bold text-lg uppercase tracking-wider text-accent mb-6">
                      ⚡ EV News & Road Tests ({filteredEVs.articles.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {filteredEVs.articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
