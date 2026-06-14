import { getArticleBySlug, getRelatedArticles, getCategoryTagColor, formatDate, getAllArticles } from "@/lib/content";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SocialShare from "@/components/ui/SocialShare";
import type { Metadata } from "next";
import ArticleBody from "@/components/ArticleBody";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found | Autovaly" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      url: `https://autovaly.com/articles/${article.slug}`,
      section: article.category,
      tags: article.segments,
      images: article.coverImage ? [{ url: article.coverImage, width: 1200, height: 630, alt: article.title }] : [],
    },
    twitter: { 
      card: "summary_large_image", 
      title: article.title, 
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : [],
    },
    alternates: { canonical: `/articles/${article.slug}` },
  };
}

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { getAllVehicles } from "@/lib/content";

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article.id, 3);
  const tagColor = getCategoryTagColor(article.category);

  const allVehicles = getAllVehicles();
  const relatedVehicles = allVehicles.filter(v => v.segments.some(s => article.segments.includes(s))).slice(0, 3);

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Articles", url: "/articles" },
    { name: article.title, url: `/articles/${article.slug}` }
  ];

  return (
    <div className="min-h-screen bg-background text-text-light">
      <BreadcrumbJsonLd crumbs={crumbs} />
      <ArticleJsonLd article={article} />

      {/* Hero Banner */}
      <div className="w-full h-64 md:h-96 relative overflow-hidden" style={{ backgroundImage: `linear-gradient(135deg, ${article.coverGradient.from}, ${article.coverGradient.to})` }}>
        {article.coverImage && (
          <Image src={article.coverImage} alt={article.title} fill className="object-cover opacity-80" priority sizes="100vw" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" aria-hidden="true" />
      </div>

      {/* Article Content */}
      <main className="container mx-auto px-4 md:px-6 -mt-24 relative z-10 max-w-4xl">
        <Breadcrumbs crumbs={crumbs} />
        <article className="bg-surface border border-border-custom rounded-xl p-6 md:p-10 lg:p-14">
          <span className={`inline-block px-3 py-1 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm mb-6 ${tagColor}`}>{article.category}</span>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] mb-6">{article.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted mb-10 flex-wrap border-b border-border-custom pb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-red-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-text-light">{article.author.name}</p>
              <p className="text-xs">
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                <span> · {article.readTime}</span>
              </p>
            </div>
          </div>
          <ArticleBody content={article.body} readTime={article.readTime} />
          <SocialShare url={`/articles/${article.slug}`} title={article.title} />
        </article>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="mt-16 mb-20">
            <h2 className="font-heading text-2xl uppercase tracking-wider pl-4 border-l-4 border-accent mb-8">Related Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.id} href={`/articles/${r.slug}`} className="group bg-surface border border-border-custom rounded-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
                  <div className="h-40 relative overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `linear-gradient(135deg, ${r.coverGradient.from}, ${r.coverGradient.to})` }} />
                    {r.coverImage && (
                      <Image src={r.coverImage} alt={r.title} fill className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                    )}
                  </div>
                  <div className="p-4">
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-widest rounded-sm mb-2 text-white px-2 py-0.5 ${getCategoryTagColor(r.category)}`}>{r.category}</span>
                    <h3 className="font-heading text-lg font-bold leading-tight group-hover:text-accent transition-colors">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Vehicles */}
        {relatedVehicles.length > 0 && (
          <section className="mt-16 mb-20">
            <h2 className="font-heading text-2xl uppercase tracking-wider pl-4 border-l-4 border-accent mb-8">Vehicles Mentioned</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedVehicles.map((v) => (
                <Link key={v.id} href={`/vehicles/${v.slug}`} className="group bg-surface border border-border-custom rounded-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
                  <div className="h-32 relative overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `linear-gradient(135deg, ${v.coverGradient.from}, ${v.coverGradient.to})` }} />
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg font-bold leading-tight group-hover:text-accent transition-colors">{v.make} {v.model}</h3>
                    <p className="text-sm text-text-muted mt-1 text-accent">€{v.priceEur.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
