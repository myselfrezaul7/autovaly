import { NextResponse } from "next/server";
import { getAllArticles } from "@/services/article.service";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const articles = await getAllArticles();

    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Autovaly — Drive the Story</title>
    <link>https://autovaly.com</link>
    <description>Your definitive source for car news, EV reviews, comparisons, and automotive industry trends.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://autovaly.com/feed.xml" rel="self" type="application/rss+xml"/>
    ${articles
      .map((article) => {
        const imageUrl = article.coverImage
          ? article.coverImage.startsWith("http")
            ? article.coverImage
            : `https://autovaly.com${article.coverImage}`
          : "https://autovaly.com/og-image.png";

        return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>https://autovaly.com/articles/${article.slug}</link>
      <guid isPermaLink="true">https://autovaly.com/articles/${article.slug}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${article.excerpt}]]></description>
      <dc:creator><![CDATA[${article.author?.name || "Autovaly Editorial"}]]></dc:creator>
      <category>${article.category}</category>
      <enclosure url="${imageUrl}" type="image/jpeg" length="0" />
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
