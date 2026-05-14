import { Article } from "@/lib/types";

export default function ArticleJsonLd({ article }: { article: Article }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: new Date(article.publishedAt).toISOString(),
    dateModified: new Date(article.publishedAt).toISOString(), // Assume modified = published for now
    author: {
      "@type": "Person",
      name: article.author.name,
      url: `https://autovaly.com/author/${article.author.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Autovaly",
      logo: {
        "@type": "ImageObject",
        url: "https://autovaly.com/og-image.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://autovaly.com/articles/${article.slug}`,
    },
    articleSection: article.category,
    wordCount: article.body.split(/\s+/).length,
    keywords: article.segments.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
