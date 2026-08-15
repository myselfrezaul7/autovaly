import Link from "next/link";
import Image from "next/image";
import { Article, Vehicle } from "@/lib/types";
import Price from "./Price";

interface SearchResultsProps {
  articles: Article[];
  vehicles: Vehicle[];
  onClose: () => void;
  query: string;
}

export default function SearchResults({ articles, vehicles, onClose, query }: SearchResultsProps) {
  if (articles.length === 0 && vehicles.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border-custom rounded-lg shadow-xl overflow-hidden z-50">
        <div className="p-8 text-center text-text-muted">
          No results found for &quot;{query}&quot;. Try a different term.
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border-custom rounded-lg shadow-xl overflow-hidden z-50 max-h-[60vh] overflow-y-auto hide-scrollbar flex flex-col">
      
      {vehicles.length > 0 && (
        <div className="p-4 border-b border-border-custom">
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">Vehicles</h3>
          <div className="flex flex-col gap-2">
            {vehicles.slice(0, 4).map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/vehicles/${vehicle.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 p-2 rounded-md hover:bg-background transition-colors group"
              >
                <div 
                  className="w-16 h-12 rounded bg-border-custom overflow-hidden flex-shrink-0 relative"
                  style={{ background: `linear-gradient(to right, ${vehicle.coverGradient.from}, ${vehicle.coverGradient.to})` }}
                >
                  {vehicle.coverImage && (
                    <Image src={vehicle.coverImage} alt={vehicle.model} width={64} height={48} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-bold text-text-light truncate">{vehicle.make} {vehicle.model}</h4>
                  <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                    <span className="bg-border-custom px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">{vehicle.fuelType}</span>
                    <Price eurAmount={vehicle.priceEur} usdAmount={vehicle.priceUsd} />
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted group-hover:text-accent"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            ))}
          </div>
        </div>
      )}

      {articles.length > 0 && (
        <div className="p-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">Articles</h3>
          <div className="flex flex-col gap-2">
            {articles.slice(0, 4).map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                onClick={onClose}
                className="flex items-start gap-4 p-2 rounded-md hover:bg-background transition-colors group"
              >
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-bold text-sm text-text-light group-hover:text-accent transition-colors line-clamp-2">{article.title}</h4>
                  <p className="text-xs text-text-muted mt-1 line-clamp-1">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-background p-3 text-center border-t border-border-custom mt-auto sticky bottom-0">
        <Link 
          href={`/search?q=${encodeURIComponent(query)}`}
          onClick={onClose}
          className="text-sm font-medium text-accent hover:text-accent-dark transition-colors"
        >
          View all results
        </Link>
      </div>
    </div>
  );
}
