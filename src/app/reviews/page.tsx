import { getArticlesByCategory, getCategoryTagColor, formatDate } from "@/lib/content";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ItemListJsonLd from "@/components/ItemListJsonLd";
import ArticleCard from "@/components/ui/ArticleCard";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = { 
  title: "Expert Car Reviews 2026 — In-Depth Tests & Ratings", 
  description: "Honest, in-depth car reviews from professional automotive journalists. Performance tests, interior analysis, and final verdicts for every major model.",
  openGraph: {
    title: "Expert Car Reviews 2026 — In-Depth Tests & Ratings",
    description: "Honest, in-depth car reviews from professional automotive journalists. Performance tests, interior analysis, and final verdicts for every major model.",
    url: "https://autovaly.com/reviews",
  },
  alternates: { canonical: "/reviews" }
};

export default function ReviewsPage() {
  const articles = getArticlesByCategory("Review");

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Reviews", url: "/reviews" }
  ];

  const itemList = articles.map((a, i) => ({
    position: i + 1,
    name: a.title,
    url: `https://autovaly.com/articles/${a.slug}`,
  }));

  return (
    <div className="min-h-screen bg-background text-text-light">
      <BreadcrumbJsonLd crumbs={crumbs} />
      <ItemListJsonLd items={itemList} />
      <main className="container mx-auto px-4 md:px-6 py-12">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wider pl-4 border-l-4 border-accent mb-10">
          In-Depth Reviews
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <ScrollReveal key={article.id} delay={0.08 * Math.min(idx, 6)}>
              <ArticleCard 
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
            </ScrollReveal>
          ))}
        </div>
        {articles.length === 0 && <p className="text-muted text-lg text-center py-20">No reviews yet.</p>}
      </main>
    </div>
  );
}
