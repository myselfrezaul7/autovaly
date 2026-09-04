import { getArticleBySlug, getAllArticles, getRelatedArticles, getCategoryTagColor, formatDate } from "@/lib/content";
import { classicSpotlightItems } from "@/lib/data/classic-spotlight";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ArticleBody from "@/components/ArticleBody";
import SocialShare from "@/components/ui/SocialShare";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import TableOfContents from "@/components/ui/TableOfContents";
import { Metadata } from "next";

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const article = getArticleBySlug(slug);

  if (!article) return { title: "Not Found" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: `${article.title} | Autovaly`,
      description: article.excerpt,
      url: `https://autovaly.com/articles/${article.slug}`,
      siteName: "Autovaly",
      images: article.coverImage ? [
        {
          url: article.coverImage.startsWith("/") ? `https://autovaly.com${article.coverImage}` : article.coverImage,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ] : [],
      publishedTime: new Date(article.publishedAt).toISOString(),
      modifiedTime: new Date(article.publishedAt).toISOString(),
      authors: [article.author.name],
      section: article.category,
      tags: article.segments,
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | Autovaly`,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : [],
    },
    alternates: { canonical: `/articles/${article.slug}` },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = getRelatedArticles(article.id);
  const tagColor = getCategoryTagColor(article.category);
  const isClassic = classicSpotlightItems.some((c) => c.slug === article.slug);

  const crumbs = [
    { name: "Home", url: "/" },
    { name: isClassic ? "Classics" : "Articles", url: isClassic ? "/classics" : "/articles" },
    { name: article.title, url: `/articles/${article.slug}` },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-background text-text-light pb-20">
      <BreadcrumbJsonLd crumbs={crumbs} />
      <ArticleJsonLd article={article} />

      <article>
        {/* Hero Banner */}
        <div
          className="w-full h-72 sm:h-96 lg:h-[420px] relative overflow-hidden"
          style={{ backgroundImage: `linear-gradient(135deg, ${article.coverGradient.from}, ${article.coverGradient.to})` }}
        >
          {article.coverImage && (
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover opacity-85"
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" aria-hidden="true" />
        </div>

        {/* Article Content Container */}
        <div className="container mx-auto px-4 md:px-6 -mt-28 relative z-10 max-w-6xl">
          <div className="mb-6">
            <Breadcrumbs crumbs={crumbs} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Article Body Column */}
            <div className="lg:col-span-8 bg-surface border border-border-custom rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl">
              <span className={`inline-block px-3 py-1 text-white text-[10px] font-bold uppercase tracking-widest rounded-md mb-6 ${tagColor}`}>
                {article.category}
              </span>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] mb-6 text-text-light">
                {article.title}
              </h1>

              {/* Author Byline */}
              <div className="flex items-center gap-3.5 text-xs text-text-muted mb-10 flex-wrap border-b border-border-custom pb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-red-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ring-2 ring-border-custom" aria-hidden="true">
                  {article.author.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-text-light text-sm">{article.author.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                    <span> · {article.readTime} read</span>
                  </p>
                </div>
              </div>

              <ArticleBody content={article.body} readTime={article.readTime} />
              <SocialShare url={`https://autovaly.com/articles/${article.slug}`} title={article.title} />
            </div>

            {/* Sidebar Column: Table of Contents & Quick Meta */}
            <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-6">
              <TableOfContents content={article.body} />

              {/* Author Credibility Card */}
              <div className="p-6 rounded-2xl bg-surface border border-border-custom shadow-lg text-xs">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent block mb-2">Editorial Desk</span>
                <h4 className="font-heading font-bold text-base text-text-light mb-1">{article.author.name}</h4>
                <p className="text-text-muted leading-relaxed mb-4">
                  Automotive journalist covering instrumented road testing, performance dynamics, and global vehicle architectures.
                </p>
                <Link href="/about" className="text-accent font-bold uppercase tracking-wider text-[11px] hover:underline">
                  About Autovaly Standards →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* Related Stories */}
      {related.length > 0 && (
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
          <section className="mt-16 mb-12">
            <h2 className="font-heading text-2xl uppercase tracking-wider pl-4 border-l-4 border-accent mb-8 text-text-light">
              Related Stories & Road Tests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/articles/${r.slug}`}
                  className="group bg-surface border border-border-custom rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-xl shadow-lg flex flex-col"
                >
                  <div className="h-44 relative overflow-hidden">
                    <div
                      className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `linear-gradient(135deg, ${r.coverGradient.from}, ${r.coverGradient.to})` }}
                    />
                    {r.coverImage && (
                      <Image
                        src={r.coverImage}
                        alt={r.title}
                        fill
                        className="object-cover opacity-85 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className={`inline-block text-[9px] font-extrabold uppercase tracking-widest rounded px-2 py-0.5 text-white mb-2 self-start ${getCategoryTagColor(r.category)}`}>
                      {r.category}
                    </span>
                    <h3 className="font-heading text-base font-bold leading-tight group-hover:text-accent transition-colors line-clamp-2 mb-2">
                      {r.title}
                    </h3>
                    <p className="text-xs text-text-muted line-clamp-2 mt-auto">{r.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
