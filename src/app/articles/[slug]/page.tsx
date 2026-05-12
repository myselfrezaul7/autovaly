import { getArticleBySlug, getRelatedArticles, getCategoryTagColor, formatDate, getAllArticles } from "@/lib/content";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

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
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.excerpt },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article.id, 3);
  const tagColor = getCategoryTagColor(article.category);

  return (
    <div className="min-h-screen bg-background text-text-light">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border-custom">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-extrabold text-2xl tracking-wide uppercase flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-accent"><path d="M4 20l3-8h18l3 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 20h28v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="26" r="2.5" fill="currentColor"/><circle cx="23" cy="26" r="2.5" fill="currentColor"/></svg>
            AUTO<span className="text-accent">VALY</span>
          </Link>
          <Link href="/" className="text-sm text-accent font-bold uppercase tracking-widest hover:brightness-125 transition-all">← Back to Home</Link>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="w-full h-64 md:h-96 relative overflow-hidden" style={{ backgroundImage: `linear-gradient(135deg, ${article.coverGradient.from}, ${article.coverGradient.to})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      {/* Article Content */}
      <main className="container mx-auto px-4 md:px-6 -mt-24 relative z-10 max-w-4xl">
        <article className="bg-surface border border-border-custom rounded-xl p-6 md:p-10 lg:p-14">
          <span className={`inline-block px-3 py-1 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm mb-6 ${tagColor}`}>{article.category}</span>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] mb-6">{article.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted mb-10 flex-wrap border-b border-border-custom pb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-red-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-text-light">{article.author.name}</p>
              <p className="text-xs">{formatDate(article.publishedAt)} · {article.readTime}</p>
            </div>
          </div>
          <div className="prose prose-invert prose-lg max-w-none leading-relaxed text-gray-300">
            {article.body.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-6">{paragraph}</p>
            ))}
          </div>
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
      </main>
    </div>
  );
}
