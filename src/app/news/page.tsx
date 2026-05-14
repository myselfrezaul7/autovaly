import { getArticlesByCategory, getCategoryTagColor, formatDate } from "@/lib/content";
import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = { 
  title: "Latest Car News 2025 — Breaking Automotive Updates", 
  description: "Breaking car news and automotive industry updates. Coverage of Tesla, BMW, BYD, Porsche, and every major brand. Updated daily by Autovaly.",
  openGraph: {
    title: "Latest Car News 2025 — Breaking Automotive Updates",
    description: "Breaking car news and automotive industry updates. Coverage of Tesla, BMW, BYD, Porsche, and every major brand. Updated daily by Autovaly.",
    url: "https://autovaly.com/news",
  },
  alternates: { canonical: "/news" }
};

export default function NewsPage() {
  const articles = getArticlesByCategory("News");

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "News", url: "/news" }
  ];

  return (
    <div className="min-h-screen bg-background text-text-light">
      <BreadcrumbJsonLd crumbs={crumbs} />
      <main className="container mx-auto px-4 md:px-6 py-12">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wider pl-4 border-l-4 border-accent mb-10">News</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <Link key={a.id} href={`/articles/${a.slug}`} className="group bg-surface border border-border-custom rounded-md overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <div className="h-48 relative overflow-hidden"><div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `linear-gradient(135deg, ${a.coverGradient.from}, ${a.coverGradient.to})` }} /></div>
              <div className="p-5">
                <span className={`inline-block text-[10px] font-bold uppercase tracking-widest rounded-sm mb-2 text-white px-2 py-0.5 ${getCategoryTagColor(a.category)}`}>{a.category}</span>
                <h2 className="font-heading text-xl font-bold leading-tight group-hover:text-accent transition-colors mb-2">{a.title}</h2>
                <p className="text-sm text-muted mb-3">{a.excerpt.slice(0, 120)}...</p>
                <div className="text-xs text-muted">{a.author.name} · {formatDate(a.publishedAt)}</div>
              </div>
            </Link>
          ))}
        </div>
        {articles.length === 0 && <p className="text-muted text-lg text-center py-20">No articles found in this category yet.</p>}
      </main>
    </div>
  );
}
