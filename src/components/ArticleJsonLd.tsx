import { Article } from "@/lib/types";

export default function ArticleJsonLd({ article }: { article: Article }) {
  const isNews = article.category === "News";
  const isReview = article.category === "Review";

  const schema = {
    "@context": "https://schema.org",
    "@type": isNews ? "NewsArticle" : isReview ? "Review" : "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage ? [
      article.coverImage.startsWith("/") ? `https://autovaly.com${article.coverImage}` : article.coverImage
    ] : ["https://autovaly.com/og-image.png"],
    datePublished: new Date(article.publishedAt).toISOString(),
    dateModified: new Date(article.publishedAt).toISOString(),
    inLanguage: "en-US",
    author: {
      "@type": "Person",
      name: article.author.name,
      url: `https://autovaly.com/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "Autovaly",
      url: "https://autovaly.com",
      email: "itsautovaly@gmail.com",
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
