import { searchArticles, searchVehicles } from "@/lib/content";
import ArticleCard from "@/components/ui/ArticleCard";
import Link from "next/link";
import Price from "@/components/ui/Price";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tab?: string }>;
}) {
  const query = (await searchParams).q || "";
  const activeTab = (await searchParams).tab || "vehicles";
  const articleResults = searchArticles(query);
  const vehicleResults = searchVehicles(query);

  const hasResults = articleResults.length > 0 || vehicleResults.length > 0;

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20 min-h-[60vh]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">
          Search Results
        </h1>
        <div className="text-muted mb-12">
          {query ? (
            <p>
              Showing results for <span className="text-text-light font-bold">"{query}"</span>
            </p>
          ) : (
            <p>Enter a search term in the navbar to find articles and vehicles.</p>
          )}
        </div>

        {query && hasResults && (
          <div className="mb-8 flex gap-4 border-b border-border-custom">
            <Link 
              href={`/search?q=${encodeURIComponent(query)}&tab=vehicles`}
              className={`pb-3 font-bold text-sm uppercase tracking-widest transition-colors ${activeTab === 'vehicles' ? 'text-accent border-b-2 border-accent' : 'text-text-muted hover:text-text-light'}`}
            >
              Vehicles ({vehicleResults.length})
            </Link>
            <Link 
              href={`/search?q=${encodeURIComponent(query)}&tab=articles`}
              className={`pb-3 font-bold text-sm uppercase tracking-widest transition-colors ${activeTab === 'articles' ? 'text-accent border-b-2 border-accent' : 'text-text-muted hover:text-text-light'}`}
            >
              Articles ({articleResults.length})
            </Link>
          </div>
        )}

        {query && !hasResults && (
          <div className="p-12 border border-border-custom rounded-xl text-center bg-surface">
            <h3 className="text-xl font-bold mb-2">No results found</h3>
            <p className="text-muted">We couldn't find anything matching "{query}". Try adjusting your search.</p>
          </div>
        )}

        {query && hasResults && activeTab === "vehicles" && (
          <div className="grid grid-cols-1 gap-4">
            {vehicleResults.length === 0 ? (
              <p className="text-muted py-8">No vehicle matches found.</p>
            ) : (
              vehicleResults.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  href={`/vehicles/${vehicle.slug}`}
                  className="flex flex-col sm:flex-row gap-6 p-4 rounded-xl border border-border-custom bg-surface hover:border-accent transition-colors group"
                >
                  <div 
                    className="w-full sm:w-48 h-32 rounded-lg bg-border-custom overflow-hidden flex-shrink-0"
                    style={{ background: `linear-gradient(to right, ${vehicle.coverGradient.from}, ${vehicle.coverGradient.to})` }}
                  >
                    {vehicle.coverImage && (
                      <img src={vehicle.coverImage} alt={vehicle.model} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-border-custom px-2 py-1 rounded text-xs uppercase font-bold">{vehicle.fuelType}</span>
                      <span className="text-xs text-muted font-medium">{vehicle.year} {vehicle.bodyStyle}</span>
                    </div>
                    <h2 className="text-2xl font-bold font-heading mb-1 group-hover:text-accent transition-colors">{vehicle.make} {vehicle.model}</h2>
                    <p className="text-text-muted text-sm mb-3">{vehicle.trim}</p>
                    <div className="mt-auto">
                      <Price eurAmount={vehicle.priceEur} usdAmount={vehicle.priceUsd} className="font-bold text-lg" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {query && hasResults && activeTab === "articles" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articleResults.length === 0 ? (
              <p className="text-muted py-8 col-span-2">No article matches found.</p>
            ) : (
              articleResults.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
