import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/content";
import { logger } from "@/lib/logger";

const SITE_URL = "https://autovaly.com";

export async function GET() {
  try {
    const articles = getAllArticles();

    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Autovaly — Drive the Story</title>
    <link>${SITE_URL}</link>
    <description>Your definitive source for car news, EV reviews, comparisons, and automotive industry trends.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${articles
      .map((article) => {
        const imageUrl = article.coverImage
          ? (article.coverImage.startsWith("http") ? article.coverImage : `${SITE_URL}${article.coverImage}`).replace(/&/g, "&amp;")
          : `${SITE_URL}/og-image.png`;

        return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${SITE_URL}/articles/${article.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/articles/${article.slug}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${article.excerpt}]]></description>
      <dc:creator><![CDATA[${article.author?.name || "Autovaly Editorial"}]]></dc:creator>
      <category>${article.category}</category>
      ${article.coverImage ? `<enclosure url="${(article.coverImage.startsWith("http") ? article.coverImage : `${SITE_URL}${article.coverImage}`).replace(/&/g, "&amp;")}" length="0" type="image/jpeg" />` : ""}
      <media:content url="${imageUrl}" medium="image" />
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

    logger.info("RSS Feed generated successfully", { count: articles.length });

    return new NextResponse(rssFeed, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    logger.error("Error generating RSS Feed", { error });
    return new NextResponse("Error generating RSS feed", { status: 500 });
  }
}
