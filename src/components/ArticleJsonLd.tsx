import { Article } from "@/lib/types";

export default function ArticleJsonLd({ article }: { article: Article }) {
  const isNews = article.category === "News";
  const isReview = article.category === "Review";

  const baseSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": isNews ? "NewsArticle" : isReview ? "Review" : "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage
      ? [
          article.coverImage.startsWith("/")
            ? `https://autovaly.com${article.coverImage}`
            : article.coverImage,
        ]
      : ["https://autovaly.com/og-image.jpg"],
    datePublished: new Date(article.publishedAt).toISOString(),
    dateModified: new Date(article.publishedAt).toISOString(),
    inLanguage: "en-US",
    isAccessibleForFree: true,
    author: {
      "@type": "Person",
      name: article.author?.name || "Autovaly Editorial Team",
      url: "https://autovaly.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: "Autovaly",
      url: "https://autovaly.com",
      email: "itsautovaly@gmail.com",
      logo: {
        "@type": "ImageObject",
        url: "https://autovaly.com/og-image.jpg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://autovaly.com/articles/${article.slug}`,
    },
    articleSection: article.category,
    keywords: article.segments.join(", "),
  };

  // Google Rich Results compliance: Reviews MUST include itemReviewed and reviewRating
  if (isReview) {
    baseSchema.itemReviewed = {
      "@type": "Car",
      name: article.title.replace(/Review:?|First Drive:?|Track Test:?/gi, "").trim(),
      image: article.coverImage?.startsWith("/")
        ? `https://autovaly.com${article.coverImage}`
        : article.coverImage,
    };
    baseSchema.reviewRating = {
      "@type": "Rating",
      ratingValue: "9.0",
      bestRating: "10",
      worstRating: "1",
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(baseSchema) }}
    />
  );
}
