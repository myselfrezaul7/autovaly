import { searchArticles, getCategoryTagColor, formatDate } from "@/lib/content";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Search", description: "Search Autovaly articles, reviews, and comparisons." };

type SearchParams = Promise<{ q?: string }>;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const { q } = await searchParams;
  const query = q || "";
  const results = query ? searchArticles(query) : [];

  return (
    <div className="min-h-screen bg-background text-text-light">
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border-custom">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-extrabold text-2xl tracking-wide uppercase">AUTO<span className="text-accent">VALY</span></Link>
          <Link href="/" className="text-sm text-accent font-bold uppercase tracking-widest">← Home</Link>
        </div>
      </header>
      <main className="container mx-auto px-4 md:px-6 py-12 max-w-5xl">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Search Results</h1>
        {query && <p className="text-muted mb-10">Showing results for &quot;<span className="text-text-light font-semibold">{query}</span>&quot; — {results.length} found</p>}
        {!query && <p className="text-muted mb-10">Enter a search term to find articles.</p>}

        <form action="/search" method="GET" className="mb-12">
          <div className="flex bg-surface border border-border-custom rounded-md p-2 focus-within:border-accent transition-colors">
            <input type="text" name="q" defaultValue={query} placeholder="Search articles..." className="flex-1 bg-transparent outline-none px-4 py-3 text-text-light placeholder:text-muted" />
            <button type="submit" className="bg-accent text-white font-bold uppercase text-sm px-6 py-3 rounded hover:brightness-110 transition-all">Search</button>
          </div>
        </form>

        <div className="flex flex-col gap-6">
          {results.map((a) => (
            <Link key={a.id} href={`/articles/${a.slug}`} className="group flex flex-col sm:flex-row bg-surface border border-border-custom rounded-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
              <div className="sm:w-48 h-40 sm:h-auto relative overflow-hidden flex-shrink-0"><div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `linear-gradient(135deg, ${a.coverGradient.from}, ${a.coverGradient.to})` }} /></div>
              <div className="p-5 flex flex-col flex-1">
                <span className={`inline-block self-start text-[10px] font-bold uppercase tracking-widest rounded-sm mb-2 text-white px-2 py-0.5 ${getCategoryTagColor(a.category)}`}>{a.category}</span>
                <h2 className="font-heading text-xl font-bold leading-tight group-hover:text-accent transition-colors mb-2">{a.title}</h2>
                <p className="text-sm text-muted mb-3 flex-1">{a.excerpt}</p>
                <div className="text-xs text-muted">{a.author.name} · {formatDate(a.publishedAt)} · {a.readTime}</div>
              </div>
            </Link>
          ))}
        </div>
        {query && results.length === 0 && (
          <div className="text-center py-20">
            <p className="font-heading text-5xl mb-4">🔍</p>
            <p className="text-muted text-lg">No articles match &quot;{query}&quot;. Try a different search term.</p>
          </div>
        )}
      </main>
    </div>
  );
}
