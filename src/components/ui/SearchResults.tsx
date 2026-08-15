import Link from "next/link";
import Image from "next/image";
import { Article, Vehicle } from "@/lib/types";
import Price from "./Price";
import { getCategoryTagColor, formatDate } from "@/lib/content";

interface SearchResultsProps {
  articles: Article[];
  vehicles: Vehicle[];
  onClose: () => void;
  query: string;
}

export default function SearchResults({ articles, vehicles, onClose, query }: SearchResultsProps) {
  if (articles.length === 0 && vehicles.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border-custom rounded-2xl shadow-2xl overflow-hidden z-50 p-8 text-center text-text-muted">
        No results found for &quot;<span className="text-text-light font-bold">{query}</span>&quot;. Try a different brand, model, or category.
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-surface/95 backdrop-blur-2xl border border-border-custom rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[65vh] overflow-y-auto hide-scrollbar flex flex-col ring-1 ring-black/10">
      {/* Vehicle Matches */}
      {vehicles.length > 0 && (
        <div className="p-4 border-b border-border-custom">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
              <span>🚗</span> Vehicles ({vehicles.length})
            </h3>
          </div>
          <div className="flex flex-col gap-2">
            {vehicles.slice(0, 3).map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/vehicles/${vehicle.slug}`}
                onClick={onClose}
                className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-background/80 transition-all group touch-press"
              >
                <div
                  className="w-16 h-12 rounded-lg bg-border-custom overflow-hidden flex-shrink-0 relative"
                  style={{ background: `linear-gradient(to right, ${vehicle.coverGradient.from}, ${vehicle.coverGradient.to})` }}
                >
                  {vehicle.coverImage && (
                    <Image
                      src={vehicle.coverImage}
                      alt={vehicle.model}
                      width={64}
                      height={48}
                      className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-bold text-sm text-text-light truncate group-hover:text-accent transition-colors">
                    {vehicle.make} {vehicle.model}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                    <span className="bg-border-custom px-1.5 py-0.2 rounded text-[9px] uppercase font-bold text-text-light">
                      {vehicle.fuelType}
                    </span>
                    <Price eurAmount={vehicle.priceEur} usdAmount={vehicle.priceUsd} className="font-bold text-xs" />
                  </div>
                </div>
                <span className="text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all text-xs">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Article Matches */}
      {articles.length > 0 && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
              <span>📰</span> Articles ({articles.length})
            </h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {articles.slice(0, 3).map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                onClick={onClose}
                className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-background/80 transition-all group touch-press"
              >
                <div
                  className="w-16 h-12 rounded-lg bg-border-custom overflow-hidden flex-shrink-0 relative"
                  style={{ background: `linear-gradient(to right, ${article.coverGradient.from}, ${article.coverGradient.to})` }}
                >
                  {article.coverImage && (
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      width={64}
                      height={48}
                      className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-sm text-white ${getCategoryTagColor(article.category)}`}>
                      {article.category}
                    </span>
                    <span className="text-[10px] text-text-muted">{formatDate(article.publishedAt)}</span>
                  </div>
                  <h4 className="font-bold text-xs text-text-light group-hover:text-accent transition-colors line-clamp-1">
                    {article.title}
                  </h4>
                </div>
                <span className="text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all text-xs">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <div className="bg-background/90 p-3 text-center border-t border-border-custom mt-auto sticky bottom-0">
        <Link
          href={`/search?q=${encodeURIComponent(query)}`}
          onClick={onClose}
          className="text-xs font-bold uppercase tracking-wider text-accent hover:underline flex items-center justify-center gap-1.5"
        >
          <span>View all {vehicles.length + articles.length} results in Search Hub</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
